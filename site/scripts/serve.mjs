import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../_site/", import.meta.url));
const base = process.env.SITE_BASEURL ?? "/ppcc26-apps-automations-agents";
const port = Number(process.env.PORT ?? 4173);
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".txt": "text/plain; charset=utf-8" };

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (pathname !== base && !pathname.startsWith(`${base}/`)) {
      response.writeHead(404).end("Use the workshop project URL.");
      return;
    }
    let file = resolve(root, `.${pathname.slice(base.length) || "/"}`);
    if (file !== resolve(root) && !file.startsWith(`${resolve(root)}${sep}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    response.writeHead(200, { "Content-Type": mime[extname(file)] ?? "application/octet-stream" });
    response.end(await readFile(file));
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(await readFile(resolve(root, "404.html")));
    } else {
      console.error("Preview server:", error);
      response.writeHead(500).end("Preview server error.");
    }
  }
}).listen(port, "127.0.0.1", () => console.log(`Workshop preview: http://127.0.0.1:${port}${base}/`));
