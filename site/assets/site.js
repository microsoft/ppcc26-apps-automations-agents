(() => {
  "use strict";

  const menu = document.querySelector(".menu-toggle");
  const moduleNavigation = document.querySelector(".module-navigation");
  const mobileViewport = matchMedia("(max-width: 760px)");
  const updateModuleNavigation = () => { if (moduleNavigation) moduleNavigation.open = !mobileViewport.matches; };
  updateModuleNavigation();
  mobileViewport.addEventListener("change", updateModuleNavigation);
  menu.addEventListener("click", () => {
    const expanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!expanded));
    document.querySelector("#primary-nav").classList.toggle("is-open", !expanded);
  });

  const dialog = document.querySelector("#search-dialog");
  const input = document.querySelector("#search-input");
  const results = document.querySelector("#search-results");
  const status = document.querySelector("#search-status");
  let entries;
  let loading;

  async function loadSearch() {
    const response = await fetch(`${document.body.dataset.baseurl}/search.json`);
    if (!response.ok) throw new Error(`Search index request failed (${response.status}).`);
    const data = await response.json();
    if (!Array.isArray(data) || data.some(item => typeof item.title !== "string" || typeof item.text !== "string" || typeof item.url !== "string")) {
      throw new Error("The search index has an invalid format.");
    }
    return data;
  }

  function renderSearch() {
    results.replaceChildren();
    if (!entries) return;
    const query = input.value.trim().toLocaleLowerCase();
    if (!query) {
      status.textContent = "Enter a word or phrase to search.";
      return;
    }
    const terms = query.split(/\s+/);
    const matches = entries.map(item => {
      const title = item.title.toLocaleLowerCase();
      const text = item.text.toLocaleLowerCase();
      return { item, score: terms.every(term => `${title} ${text}`.includes(term)) ? terms.reduce((sum, term) => sum + (title.includes(term) ? 10 : 1), 0) : 0 };
    }).filter(match => match.score > 0).sort((a, b) => b.score - a.score);
    status.textContent = matches.length ? `${matches.length} result${matches.length === 1 ? "" : "s"} found.` : "No results. Try another word or check the module index.";
    for (const { item } of matches.slice(0, 20)) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.url;
      link.textContent = item.title;
      const excerpt = document.createElement("p");
      const found = item.text.toLocaleLowerCase().indexOf(terms[0]);
      const start = Math.max(0, found - 70);
      excerpt.textContent = `${start > 0 ? "…" : ""}${item.text.slice(start, start + 210)}…`;
      li.append(link, excerpt);
      results.append(li);
    }
  }

  document.querySelector(".search-toggle").addEventListener("click", async () => {
    dialog.showModal();
    input.focus();
    if (entries) return renderSearch();
    status.textContent = "Loading workshop search…";
    try {
      loading ??= loadSearch();
      entries = await loading;
      renderSearch();
    } catch (error) {
      loading = undefined;
      status.textContent = "Search is unavailable. Close and reopen to retry, or use Modules in the navigation.";
      console.error("Workshop search:", error);
    }
  });
  document.querySelector(".search-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    }
  });
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  input.addEventListener("input", renderSearch);

  for (const code of document.querySelectorAll(".prose pre > code")) {
    const pre = code.parentElement;
    if (pre.closest(".rouge-gutter")) continue;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code or prompt");
    pre.classList.add("copyable");
    pre.append(button);
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = "Copied";
        document.querySelector("#copy-status").textContent = "Code copied to clipboard.";
        setTimeout(() => { button.textContent = "Copy"; }, 1800);
      } catch (error) {
        button.textContent = "Copy failed";
        document.querySelector("#copy-status").textContent = "Clipboard access failed. Select and copy the text manually.";
        console.error("Workshop clipboard:", error);
      }
    });
  }
})();
