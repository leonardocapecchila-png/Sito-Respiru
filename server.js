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

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
    });
    response.end(content);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Respiru site running at http://127.0.0.1:${port}/`);
});
