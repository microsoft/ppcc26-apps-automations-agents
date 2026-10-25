import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = "/ppcc26-apps-automations-agents";
const modules = [
  "01-open-and-orient", "02-build-control-tower", "03-build-intake-and-impact-cloud-flows",
  "04-build-policy-and-supervision", "05-configure-recovery-and-cua", "06-run-deploy-and-replay"
];

test("day agenda is discoverable, complete, and links to every module", async ({ page }) => {
  await page.goto(`${base}/`);
  await page.getByRole("link", { name: "View the day agenda" }).click();
  await expect(page).toHaveURL(`${base}/#agenda`);
  const agenda = page.locator("#agenda");
  await expect(agenda.getByRole("heading", { name: "Full-day agenda" })).toBeVisible();
  await expect(agenda.locator(".agenda-status")).toHaveText("9:00 AM–4:40 PM");
  await expect(agenda.locator(".agenda-row")).toHaveCount(12);
  await expect(agenda.locator(".agenda-columns > span")).toHaveText(["", "Session", "Owner", "Products", "Start", "End"]);
  await expect(agenda.locator(".agenda-duration")).toHaveCount(0);
  await expect(agenda.locator(".agenda-products + .agenda-time")).toHaveCount(12);
  for (const row of await agenda.locator(".agenda-lab").all()) {
    const products = await row.locator(".agenda-products").boundingBox();
    const times = await row.locator(".agenda-time").boundingBox();
    expect(times.x).toBeGreaterThanOrEqual(products.x + products.width);
  }
  await expect(agenda.getByRole("heading", { name: "Lunch", exact: true })).toBeVisible();
  await expect(agenda.locator(".agenda-break")).toHaveCount(4);
  await expect(agenda.locator(".agenda-time time").first()).toHaveText("9:00 AM");
  await expect(agenda.locator(".agenda-time time").last()).toHaveText("4:40 PM");
  const timeRanges = [
    ["9:00 AM", "9:10 AM"], ["9:10 AM", "9:25 AM"], ["9:25 AM", "10:00 AM"],
    ["10:00 AM", "10:15 AM"], ["10:15 AM", "11:15 AM"], ["11:15 AM", "12:15 PM"],
    ["12:15 PM", "1:15 PM"], ["1:15 PM", "1:30 PM"], ["1:30 PM", "3:00 PM"],
    ["3:00 PM", "3:15 PM"], ["3:15 PM", "4:30 PM"], ["4:30 PM", "4:40 PM"]
  ];
  for (let index = 0; index < timeRanges.length; index++) {
    const times = agenda.locator(".agenda-row").nth(index).locator(".agenda-time time");
    await expect(times).toHaveText(timeRanges[index]);
    await expect(times.first()).toBeVisible();
    await expect(times.last()).toBeVisible();
  }
  await expect(agenda.locator(".agenda-summary")).toHaveText("9:00 AM–4:40 PM · 5 h 35 min of modules and labs, plus Computer Use wait time");
  const moduleRows = agenda.locator(".agenda-lab");
  const owners = ["Oliver", "Adrian", "Rasika", "Nikita", "Jay", "Warren"];
  for (let index = 0; index < owners.length; index++) {
    await expect(moduleRows.nth(index).locator(".agenda-owner")).toContainText(owners[index]);
  }
  await expect(moduleRows.last().locator(".agenda-time-note")).toHaveText("+ Computer Use wait");
  const links = agenda.locator(".agenda-description h3 a");
  await expect(links).toHaveCount(6);
  for (let index = 0; index < modules.length; index++) {
    await expect(links.nth(index)).toHaveAttribute("href", `${base}/labs/${modules[index]}/`);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(agenda.locator(".agenda-status")).toBeVisible();
  for (const row of await agenda.locator(".agenda-lab").all()) {
    const products = await row.locator(".agenda-products").boundingBox();
    const times = await row.locator(".agenda-time").boundingBox();
    expect(times.y).toBeGreaterThanOrEqual(products.y + products.height);
  }
  for (const times of await agenda.locator(".agenda-time").all()) {
    await expect(times.locator("time")).toHaveCount(2);
    await expect(times.locator("time").last()).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await links.first().click();
  await expect(page).toHaveURL(`${base}/labs/${modules[0]}/`);
});

test("agenda time text is not clipped and columns align across screen sizes", async ({ page }) => {
  await page.goto(`${base}/`);
  for (const stylesheet of await page.locator('link[rel="stylesheet"]').all()) {
    await expect(stylesheet).toHaveAttribute("href", /\?v=\d+$/);
  }
  for (const width of [1440, 1280, 1100, 1024, 961, 960, 820, 768, 760, 600, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const failures = await page.locator("#agenda").evaluate(agenda => {
      const problems = [];
      const headers = [...agenda.querySelectorAll(".agenda-columns > span")].slice(-2);
      const desktop = getComputedStyle(agenda.querySelector(".agenda-columns")).display !== "none";
      for (const row of agenda.querySelectorAll(".agenda-row")) {
        const values = [...row.querySelectorAll(".agenda-time-value")];
        for (let index = 0; index < values.length; index++) {
          const value = values[index];
          const time = value.querySelector("time");
          const range = document.createRange();
          range.selectNodeContents(time);
          const text = range.getBoundingClientRect();
          for (const container of [value, row.querySelector(".agenda-time"), row, agenda]) {
            const bounds = container.getBoundingClientRect();
            if (text.left < bounds.left - 1 || text.right > bounds.right + 1 || text.top < bounds.top - 1 || text.bottom > bounds.bottom + 1) {
              problems.push(`Clipped ${time.textContent} in ${container.className}`);
            }
          }
          if (desktop && Math.abs(value.getBoundingClientRect().left - headers[index].getBoundingClientRect().left) > 1) {
            problems.push(`Misaligned ${time.textContent}`);
          }
        }
        if (values[0].getBoundingClientRect().right > values[1].getBoundingClientRect().left + 1) {
          problems.push("Start and end columns overlap");
        }
      }
      if (document.documentElement.scrollWidth > innerWidth) problems.push("Page overflows horizontally");
      return problems;
    });
    expect(failures, `Agenda layout at ${width}px`).toEqual([]);
  }
});

test("all six direct module URLs, order, screenshots, and warnings work", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  for (let index = 0; index < modules.length; index++) {
    const response = await page.goto(`${base}/labs/${modules[index]}/`);
    expect(response.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".module-navigation [aria-current]")).toContainText(`0${index + 1}`);
    if (index < modules.length - 1) {
      await expect(page.locator(".next-prev a").last()).toHaveAttribute("href", `${base}/labs/${modules[index + 1]}/`);
    }
    expect(await page.locator(".lab-content").innerText()).not.toContain("[!CAUTION]");
    for (const image of await page.locator(".lab-content img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test("search covers every module, no-results state, and keyboard close", async ({ page }) => {
  await page.goto(`${base}/`);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  const input = page.getByRole("searchbox");
  const index = await (await page.request.get(`${base}/search.json`)).json();
  for (const slug of modules) {
    const entry = index.find(item => item.url === `${base}/labs/${slug}/`);
    expect(entry).toBeTruthy();
    const phrase = entry.text.match(/[A-Za-z][A-Za-z -]{30,70}/)[0].trim();
    await input.fill(phrase);
    await expect(page.locator("#search-results a").filter({ hasText: entry.title })).toBeVisible();
  }
  await input.fill("thisworddoesnotexistintheworkshop");
  await expect(page.locator("#search-status")).toContainText("No results");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Search", exact: true })).toBeFocused();
});

test("search failures are explicit and retryable", async ({ page }) => {
  await page.route("**/search.json", route => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto(`${base}/`);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator("#search-status")).toContainText("Search is unavailable");
  await page.getByRole("button", { name: "Close search" }).click();
  await page.unroute("**/search.json");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("searchbox").fill("supplier");
  await expect(page.locator("#search-results li").first()).toBeVisible();
});

test("copy controls preserve exact prompt text and report denied clipboard access", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(`${base}/labs/${modules[2]}/`);
  const code = page.locator(".lab-content pre > code").first();
  const expected = await code.textContent();
  await page.evaluate(() => {
    const write = navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = text => { window.copiedText = text; return write(text); };
  });
  const copy = code.locator("..").getByRole("button", { name: "Copy code or prompt" });
  await copy.click();
  await expect(copy).toHaveText("Copied");
  expect(await page.evaluate(() => window.copiedText)).toBe(expected);
  expect((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n")).toBe(expected);
  await page.evaluate(() => {
    navigator.clipboard.writeText = () => Promise.reject(new Error("Permission denied"));
  });
  await copy.click();
  await expect(copy).toHaveText("Copy failed");
  await expect(page.locator("#copy-status")).toContainText("Select and copy the text manually");
});

for (const route of ["/", "/setup/", `/labs/${modules[2]}/`]) {
  test(`accessibility: ${route}`, async ({ page }) => {
    await page.goto(`${base}${route}`);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.filter(item => ["critical", "serious"].includes(item.impact))).toEqual([]);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });
}

test("375px mobile navigation and pages do not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of ["/", "/setup/", "/resources/", ...modules.map(slug => `/labs/${slug}/`)]) {
    await page.goto(`${base}${route}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.goto(`${base}/`);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await page.getByRole("link", { name: "Get ready", exact: true }).click();
  await expect(page).toHaveURL(`${base}/setup/`);
});

test("prompt downloads and missing-page recovery work", async ({ page }) => {
  await page.goto(`${base}/resources/`);
  const links = await page.locator(".resource-card a[download]").all();
  expect(links.length).toBe(5);
  for (const link of links) {
    const response = await page.request.get(await link.getAttribute("href"));
    expect(response.ok()).toBe(true);
    expect((await response.body()).length).toBeGreaterThan(100);
  }
  const response = await page.goto(`${base}/not-a-page/`);
  expect(response.status()).toBe(404);
  await page.getByRole("link", { name: "Back to the workshop" }).click();
  await expect(page).toHaveURL(`${base}/`);
});
