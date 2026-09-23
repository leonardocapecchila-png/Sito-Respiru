const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname);
const port = Number(process.env.PORT || 5173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

const parseBody = (rawBody, contentType) => {
  if (!rawBody) return {};
  if (contentType && contentType.includes("application/json")) {
    try {
      return JSON.parse(rawBody);
    } catch {
      return {};
    }
  }
  if (contentType && contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(rawBody));
  }
  return {};
};

const server = http.createServer((request, response) => {
  const requestedPath = decodeURIComponent(request.url.split("?")[0]);
  const safePath = requestedPath === "/" ? "index.html" : path.normalize(requestedPath).replace(/^[/\\]+/, "").replace(/^(\.\.[/\\])+/, "");
  const filePath = path.resolve(root, safePath);

  if (request.method === "POST" && requestedPath === "/submit-demo") {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      const formData = parseBody(body, request.headers["content-type"] || "");
      const submission = {
        type: "demo-request",
        receivedAt: new Date().toISOString(),
        ...formData,
      };

      fs.appendFile(path.join(root, "submissions.json"), JSON.stringify(submission) + "\n", (err) => {
        if (err) {
          response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
          response.end(JSON.stringify({ status: "error", message: "Impossibile salvare la richiesta." }));
          return;
        }

        response.writeHead(303, {
          "Location": "/thank-you.html",
        });
        response.end();
      });
    });
    return;
  }

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  const serveFile = (targetPath) => {
    fs.readFile(targetPath, (error, content) => {
      if (error) {
        // Mimic Vercel's cleanUrls: /page falls back to /page.html when no extension matches.
        if (error.code !== "ENOENT" || path.extname(targetPath) !== "") {
          response.writeHead(404);
          response.end("Not found");
          return;
        }

        const withHtml = `${targetPath}.html`;
        fs.readFile(withHtml, (fallbackError, fallbackContent) => {
          if (fallbackError) {
            response.writeHead(404);
            response.end("Not found");
            return;
          }

          response.writeHead(200, { "Content-Type": types[".html"] });
          response.end(fallbackContent);
        });
        return;
      }

      response.writeHead(200, {
        "Content-Type": types[path.extname(targetPath)] || "application/octet-stream",
      });
      response.end(content);
    });
  };

  serveFile(filePath);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Respiru site running at http://127.0.0.1:${port}/`);
});
