/* Leonida Atlas — tiny static server for app/ (development only).
   Serves the guide from its own files on port 8080 by default, or the
   port given with --port <n>. Refuses any path that escapes app/. */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(join(fileURLToPath(new URL(".", import.meta.url)), "app"));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

let port = 8080;
const portFlag = process.argv.indexOf("--port");
if (portFlag !== -1 && process.argv[portFlag + 1]) {
  port = Number(process.argv[portFlag + 1]) || 8080;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://localhost");
    let rel = decodeURIComponent(url.pathname);
    if (rel === "/") rel = "/index.html";
    const file = resolve(join(appRoot, normalize(rel).replace(/^(\.\.[/\\])+/, "")));
    if (file !== appRoot && !file.startsWith(appRoot + sep)) {
      res.writeHead(403, { "content-type": "text/plain" });
      res.end("forbidden");
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(body);
  } catch (err) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  }
});

server.listen(port, () => {
  console.log("Leonida Atlas serving app/ at http://localhost:" + port);
});
