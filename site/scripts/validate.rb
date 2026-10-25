require "json"
require "nokogiri"
require "pathname"
require "uri"
require "yaml"
require "digest"
require "kramdown"
require "kramdown-parser-gfm"

root = File.expand_path("..", __dir__)
repo = File.expand_path("..", root)
output = File.join(root, "_site")
config = YAML.safe_load(File.read(File.join(root, "_config.yml")))
baseurl = ENV.fetch("SITE_BASEURL", config.fetch("baseurl")).delete_suffix("/")
errors = []
documents = {}
Dir.glob(File.join(output, "**", "*.html")).each do |path|
  document = Nokogiri::HTML5.parse(File.read(path, encoding: "UTF-8"))
  documents[path] = document
  ids = document.css("[id]").map { |node| node["id"] }
  duplicate_ids = ids.tally.select { |_, count| count > 1 }.keys
  errors << "#{path}: duplicate IDs: #{duplicate_ids.join(", ")}" unless duplicate_ids.empty?
  errors << "#{path}: missing main landmark" unless document.at_css("main#main")
  document.css("img").each { |image| errors << "#{path}: image missing alt text" unless image.key?("alt") }
end
documents.each do |path, document|
  document.css("a[href], img[src], link[href], script[src]").each do |node|
    value = node[node.name == "img" || node.name == "script" ? "src" : "href"]
    next if value.match?(%r{\A(?:[a-z][a-z0-9+.-]*:|//)}i)
    errors << "#{path}: non-portable backslash in generated URL: #{value}" if value.include?("\\")
    destination, fragment = value.split("#", 2)
    destination = URI::DEFAULT_PARSER.unescape(destination.split("?", 2).first.to_s)
    if destination.empty?
      target = path
    elsif destination.start_with?("/")
      unless baseurl.empty? || destination == baseurl || destination.start_with?("#{baseurl}/")
        errors << "#{path}: URL missing project base path: #{value}"
        next
      end
      target = File.join(output, destination.delete_prefix(baseurl).delete_prefix("/"))
    else
      target = File.expand_path(destination, File.dirname(path))
    end
    target = File.join(target, "index.html") if File.directory?(target)
    unless File.file?(target)
      errors << "#{path}: missing destination: #{value}"
      next
    end
    if fragment && !fragment.empty? && documents[target]
      decoded = URI::DEFAULT_PARSER.unescape(fragment)
      errors << "#{path}: missing fragment: #{value}" unless documents[target].css("[id]").any? { |node_with_id| node_with_id["id"] == decoded }
    end
  end
end
modules = YAML.safe_load(File.read(File.join(root, "_data", "modules.yml")))
agenda = YAML.safe_load(File.read(File.join(root, "_data", "agenda.yml")))
previous_end = nil
agenda.each do |entry|
  start_time, end_time = %w[start end].map do |key|
    value = entry.fetch(key)
    raise "Invalid agenda time: #{value}" unless value.match?(/\A(?:[01]\d|2[0-3]):[0-5]\d\z/)
    hours, minutes = value.split(":").map(&:to_i)
    hours * 60 + minutes
  end
  errors << "Agenda gap/overlap at #{entry.fetch("start")}" if previous_end && previous_end != start_time
  errors << "Agenda duration mismatch at #{entry.fetch("start")}" unless end_time - start_time == entry.fetch("duration") && end_time > start_time
  errors << "Agenda session missing title" if entry.fetch("title").strip.empty?
  errors << "Agenda session missing owner" if entry.fetch("kind") != "break" && entry.fetch("owner", "").strip.empty?
  errors << "Agenda module missing products" if entry["module"] && entry.fetch("products", []).empty?
  previous_end = end_time
end
errors << "Agenda must include all modules once in order" unless agenda.filter_map { |entry| entry["module"] } == modules.map { |item| item.fetch("number") }
errors << "Agenda must start at 09:00 and end at 16:25" unless agenda.first.fetch("start") == "09:00" && agenda.last.fetch("end") == "16:25"
errors << "Agenda module allocations must total 295 minutes" unless agenda.select { |entry| entry["module"] }.sum { |entry| entry.fetch("duration") } == 295
manifest = JSON.parse(File.read(File.join(output, "source-manifest.json")))
manifest.each do |source, hash|
  errors << "Source changed during build: #{source}" unless Digest::SHA256.file(File.join(repo, source)).hexdigest == hash
end
modules.each do |item|
  source = File.read(File.join(repo, item.fetch("source")), encoding: "UTF-8")
  original = Nokogiri::HTML5.fragment(Kramdown::Document.new(source, input: "GFM").to_html)
  rendered_path = File.join(output, "labs", item.fetch("slug"), "index.html")
  rendered = documents.fetch(rendered_path)
  source_code = original.css("pre > code").map(&:text)
  rendered_code = rendered.css(".lab-content pre > code").map(&:text)
  errors << "Code/prompt content changed: #{item.fetch("source")}" unless source_code == rendered_code
  source_images = original.css("img").map { |node| node["alt"] }
  rendered_images = rendered.css(".lab-content img").map { |node| node["alt"] }
  errors << "Screenshot content changed: #{item.fetch("source")}" unless source_images == rendered_images
  source_alerts = original.css("blockquote").count { |node| node.text.match?(/\A\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/) }
  errors << "Missing alert: #{item.fetch("source")}" unless rendered.css(".lab-content .callout").length == source_alerts
end
Dir.glob(File.join(repo, "labs", "prompts", "**", "*.md")).each do |path|
  relative = Pathname.new(path).relative_path_from(Pathname.new(File.join(repo, "labs", "prompts"))).to_s
  download = File.join(output, "downloads", "#{relative}.txt")
  errors << "Prompt download is not byte-identical: #{relative}" unless File.binread(path) == File.binread(download)
end
index = JSON.parse(File.read(File.join(output, "search.json")))
modules.each do |item|
  url = "#{baseurl}/labs/#{item.fetch("slug")}/"
  entry = index.find { |candidate| candidate.fetch("url") == url }
  errors << "Module missing full-content search: #{url}" unless entry && entry.fetch("text").length > 1000
end
%w[Gemfile Gemfile.lock package.json package-lock.json scripts tests _plugins node_modules vendor].each do |excluded|
  errors << "Build/source file published: #{excluded}" if File.exist?(File.join(output, excluded))
end
unless errors.empty?
  warn errors.join("\n")
  abort "#{errors.length} site validation error(s)."
end
puts "PASS: #{documents.length} HTML pages; all local links/fragments/images; #{modules.length} unchanged lab code/image/alert sets; exact prompt downloads; complete module search; source hashes; publication exclusions."
puts "PASS: #{agenda.length} contiguous agenda entries; all six modules, owners, and products; 295 module minutes; 09:00-16:25 timetable."
