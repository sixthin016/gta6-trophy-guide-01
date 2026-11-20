// Leonida Atlas — tiny static server for app/ (development convenience only).
// Serves app/ on port 8080, or --port <n> for another port. Refuses any path
// that escapes app/. Node 22, standard library only.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "app");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

let port = 8080;
const portFlag = process.argv.indexOf("--port");
if (portFlag !== -1 && process.argv[portFlag + 1]) {
  const n = Number(process.argv[portFlag + 1]);
  if (Number.isInteger(n) && n > 0 && n < 65536) port = n;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://localhost");
    let rel = decodeURIComponent(url.pathname);
    if (rel === "/") rel = "/index.html";
    const filePath = resolve(join(appRoot, normalize(rel).replace(/^(\.\.[/\\])+/, "")));
    if (filePath !== appRoot && !filePath.startsWith(appRoot + sep)) {
      res.writeHead(403, { "content-type": "text/plain" });
      res.end("forbidden");
      return;
    }
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("not a file");
    const body = await readFile(filePath);
    res.writeHead(200, { "content-type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    res.end(body);
  } catch (e) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  }
});

server.listen(port, () => {
  console.log("Leonida Atlas serving app/ at http://localhost:" + port);
});
