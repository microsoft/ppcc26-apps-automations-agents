require "json"
require "nokogiri"
require "pathname"
require "uri"
require "digest"

module Workshop
  class TextFile < Jekyll::PageWithoutAFile
    def render(*)
      @output = content
    end
  end

  class PromptDownload < Jekyll::StaticFile
    def initialize(site, root, source, route)
      super(site, root, File.dirname(source), File.basename(source))
      @download_route = route.delete_prefix("/")
    end

    def destination(destination_root)
      File.join(destination_root, @download_route)
    end
  end

  class ContentGenerator < Jekyll::Generator
    safe true
    priority :high

    def generate(site)
      @site = site
      @root = File.expand_path("..", site.source)
      @converter = site.find_converter_instance(Jekyll::Converters::Markdown)
      @routes = {
        "labs/README.md" => "/labs/",
        "setup/README.md" => "/setup/",
        "solutions/README.md" => "/solutions/"
      }
      modules = site.data.fetch("modules")
      modules.each { |item| @routes[item.fetch("source")] = "/labs/#{item.fetch("slug")}/" }
      prompts = Dir.glob(File.join(@root, "labs", "prompts", "**", "*.md")).sort
      resources = prompts.map do |path|
        source = relative(path)
        markdown = File.read(path, encoding: "UTF-8")
        fragment = Nokogiri::HTML5.fragment(@converter.convert(markdown))
        title = fragment.at_css("h1")&.text || File.basename(path, ".md").tr("-", " ").capitalize
        route = "/resources/#{source.delete_prefix("labs/prompts/").delete_suffix(".md")}/"
        @routes[source] = route
        {
          "source" => source, "url" => route, "title" => title,
          "module" => source[%r{/module(\d+)/}, 1],
          "description" => "Supporting prompt for Module #{source[%r{/module(\d+)/}, 1]}. Follow the lab before using it.",
          "download" => "/downloads/#{source.delete_prefix("labs/prompts/")}.txt"
        }
      end
      site.data["resources"] = resources
      site.data["solution_packages"] = Dir.glob(File.join(@root, "solutions", "**", "*.zip")).sort.map do |path|
        source = relative(path)
        {
          "name" => File.basename(path),
          "size_kb" => (File.size(path) / 1024.0).ceil,
          "catch_up" => source.include?("CloudFlow-ReadytoUse solution/"),
          "url" => "https://raw.githubusercontent.com/#{site.config.fetch("repository")}/#{site.config.fetch("source_branch")}/#{source.split("/").map { |part| URI.encode_www_form_component(part).gsub("+", "%20") }.join("/")}"
        }
      end
      modules.each_with_index do |item, index|
        document(item.fetch("source"), @routes.fetch(item.fetch("source")), {
          "layout" => "lab", "title" => item.fetch("title"), "module" => item.fetch("number"),
          "duration" => item.fetch("duration"), "product" => item.fetch("product"),
          "outcome" => item.fetch("outcome"), "previous_module" => index.positive? ? modules[index - 1] : nil,
          "next_module" => modules[index + 1], "description" => item.fetch("description")
        })
      end
      resources.each do |item|
        document(item.fetch("source"), item.fetch("url"), {
          "layout" => "page", "title" => item.fetch("title"), "eyebrow" => "SUPPORTING PROMPT",
          "description" => item.fetch("description")
        })
        site.static_files << PromptDownload.new(site, @root, item.fetch("source"), item.fetch("download"))
      end
      manifest = TextFile.new(site, site.source, "", "source-manifest.json")
      manifest.data["layout"] = nil
      manifest.content = JSON.pretty_generate((modules.map { |item| item.fetch("source") } + resources.map { |item| item.fetch("source") }).to_h do |source|
        [source, Digest::SHA256.file(File.join(@root, source)).hexdigest]
      end)
      site.pages << manifest
    end

    private

    def relative(path)
      Pathname.new(path).relative_path_from(Pathname.new(@root)).to_s.tr("\\", "/")
    end

    def document(source, route, metadata)
      path = File.join(@root, source)
      fragment = Nokogiri::HTML5.fragment(@converter.convert(File.read(path, encoding: "UTF-8")))
      fragment.at_css("h1")&.remove
      fragment.css("h1").each { |heading| heading.name = "h2" }
      fragment.css("blockquote").each do |quote|
        first = quote.at_css("p")
        next unless first && (match = first.text.match(/\A\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/))

        kind = match[1].downcase
        quote.name = "aside"
        quote["class"] = "callout callout-#{kind}"
        # Remove just the marker text; keep all instructional content and inline markup.
        first.children.each do |child|
          next unless child.text?
          child.content = child.content.sub(/\A\s*\[!#{match[1]}\]\s*/, "")
          break
        end
        label = Nokogiri::XML::Node.new("strong", fragment.document)
        label["class"] = "callout-label"
        label.content = match[1].capitalize
        quote.children.first.add_previous_sibling(label)
      end
      fragment.css("a[href], img[src]").each do |node|
        attribute = node.name == "img" ? "src" : "href"
        node[attribute] = resolve(node[attribute], source)
        if node.name == "img"
          node["loading"] = "lazy"
          node["decoding"] = "async"
        end
      end
      fragment.css("table").each do |table|
        wrapper = Nokogiri::XML::Node.new("div", fragment.document)
        wrapper["class"] = "table-scroll"
        wrapper["tabindex"] = "0"
        wrapper["role"] = "region"
        wrapper["aria-label"] = "Scrollable table"
        table.add_previous_sibling(wrapper)
        wrapper.add_child(table)
      end
      page = Jekyll::PageWithoutAFile.new(@site, @site.source, route, "index.html")
      page.data.merge!(metadata)
      page.data["render_with_liquid"] = false
      page.data["source_path"] = source
      page.data["headings"] = fragment.css("h2[id], h3[id]").map { |heading| { "id" => heading["id"], "text" => heading.text, "level" => heading.name[1] } }
      page.content = fragment.to_html
      @site.pages << page
    end

    def resolve(value, source)
      return value if value.start_with?("#", "//") || value.match?(/\A[a-z][a-z0-9+.-]*:/i)

      path, suffix = value.split(/(?=[?#])/, 2)
      decoded = URI::DEFAULT_PARSER.unescape(path).tr("\\", "/")
      target = decoded.start_with?("/") ? File.join(@root, decoded.delete_prefix("/")) : File.expand_path(decoded, File.dirname(File.join(@root, source)))
      key = relative(target)
      raise Jekyll::Errors::FatalException, "Link escapes repository: #{source}: #{value}" if key.start_with?("../")

      route = @routes[key]
      unless route
        unless File.exist?(target)
          raise Jekyll::Errors::FatalException, "Missing source link: #{source}: #{value}"
        end
        if File.extname(target) == ".md" || File.directory?(target)
          route = "https://github.com/#{@site.config.fetch("repository")}/blob/#{@site.config.fetch("source_branch")}/#{key.split("/").map { |part| URI.encode_www_form_component(part).gsub("+", "%20") }.join("/")}"
        else
          @site.static_files << Jekyll::StaticFile.new(@site, @root, File.dirname(key), File.basename(key)) unless @site.static_files.any? { |file| file.relative_path.tr("\\", "/").delete_prefix("/") == key }
          route = "/#{key.split("/").map { |part| URI.encode_www_form_component(part).gsub("+", "%20") }.join("/")}"
        end
      end
      route = "#{@site.baseurl}#{route}" unless route.start_with?("https://")
      "#{route}#{suffix}"
    end
  end

  Jekyll::Hooks.register :site, :post_render do |site|
    entries = site.pages.filter_map do |page|
      next unless page.output_ext == ".html" && page.data["title"] && page.url != "/404.html"
      fragment = Nokogiri::HTML5.parse(page.output)
      main = fragment.at_css(".lab-content") || fragment.at_css(".prose") || fragment.at_css("main")
      { title: page.data["title"], url: "#{site.baseurl}#{page.url}", text: main&.text.to_s.gsub(/\s+/, " ").strip }
    end
    search = TextFile.new(site, site.source, "", "search.json")
    search.data["layout"] = nil
    search.content = JSON.generate(entries)
    search.output = search.content
    site.pages << search
  end
end
