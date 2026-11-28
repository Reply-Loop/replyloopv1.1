/**
 * Serves the ReplyLoop static export from files bundled into this Worker
 * (see scripts/build-worker.mjs). Behaves like Cloudflare Pages for this site.
 */
import { FILES, HEADER_RULES } from "./files.generated.js";

const TYPES = {
  html: "text/html; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  json: "application/json",
  xml: "application/xml",
  svg: "image/svg+xml",
  png: "image/png",
  avif: "image/avif",
  webp: "image/webp",
  ico: "image/x-icon",
  woff2: "font/woff2",
  woff: "font/woff",
  mp4: "video/mp4",
  webm: "video/webm",
  exr: "image/x-exr",
};

function contentType(path) {
  const ext = path.slice(path.lastIndexOf("/") + 1).split(".").pop();
  return path.includes(".") && TYPES[ext] ? TYPES[ext] : "application/octet-stream";
}

/** _headers patterns: exact paths, or a trailing "*" splat. */
function headersFor(path) {
  const h = {};
  for (const { pattern, headers } of HEADER_RULES) {
    const hit = pattern.endsWith("*") ? path.startsWith(pattern.slice(0, -1)) : path === pattern;
    if (hit) Object.assign(h, headers);
  }
  return h;
}

/** Map a URL path to a bundled file, Pages style. */
function resolve(path) {
  if (FILES.has(path) && !path.endsWith(".html")) return path;
  if (path === "/") return "/index.html";
  if (FILES.has(path + ".html")) return path + ".html";
  if (FILES.has(path + "/index.html")) return path + "/index.html";
  return null;
}

function respond(request, path, status = 200) {
  const body = FILES.get(path);
  const headers = new Headers({ "Content-Type": contentType(path), ...headersFor(path), "Accept-Ranges": "bytes" });
  const size = body.byteLength;

  const range = request.headers.get("Range");
  const m = status === 200 && range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (m && (m[1] || m[2])) {
    let start = m[1] ? Number(m[1]) : size - Number(m[2]);
    let end = m[1] && m[2] ? Number(m[2]) : size - 1;
    start = Math.max(0, start);
    end = Math.min(end, size - 1);
    if (start > end || start >= size) {
      headers.set("Content-Range", `bytes */${size}`);
      return new Response(null, { status: 416, headers });
    }
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
    headers.set("Content-Length", String(end - start + 1));
    return new Response(request.method === "HEAD" ? null : body.slice(start, end + 1), { status: 206, headers });
  }
  headers.set("Content-Length", String(size));
  return new Response(request.method === "HEAD" ? null : body, { status, headers });
}

const worker = {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    const url = new URL(request.url);
    let path;
    try {
      path = decodeURIComponent(url.pathname);
    } catch {
      path = url.pathname;
    }

    // Clean URLs: /about/ and /about.html -> /about; /index.html -> /
    const redirectTo = (p) => Response.redirect(new URL(p + url.search, url).toString(), 308);
    if (path.length > 1 && path.endsWith("/")) return redirectTo(path.replace(/\/+$/, "") || "/");
    if (path.endsWith(".html") && FILES.has(path)) {
      const clean = path === "/index.html" ? "/" : path.replace(/(\/index)?\.html$/, "");
      return redirectTo(clean || "/");
    }

    const file = resolve(path);
    if (file) return respond(request, file);
    return respond(request, "/404.html", 404);
  },
};

export default worker;
