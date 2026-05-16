import { mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));
const version = args.version || timestampVersion();
const distDir = resolve(root, args.source || args.dist || "dist");
const releaseDir = join(root, "release");
const pdfPath = join(releaseDir, `resume-${version}.pdf`);
const chromeBin = findChrome();

if (!existsSync(join(distDir, "index.html"))) {
  console.error("Missing dist/index.html. Run npm run build first.");
  process.exit(1);
}

if (!chromeBin) {
  console.error("Could not find Chrome. Set CHROME_BIN to a Chrome or Chromium executable.");
  process.exit(1);
}

await mkdir(releaseDir, { recursive: true });

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
  const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = resolve(distDir, `.${pathname}`);

  if (!filePath.startsWith(distDir) || !existsSync(filePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  response.writeHead(200, { "content-type": contentType(filePath) });
  createReadStream(filePath).pipe(response);
});

await new Promise((resolveListen, rejectListen) => {
  server.once("error", rejectListen);
  server.listen(0, "127.0.0.1", resolveListen);
});
const { port } = server.address();
const url = `http://127.0.0.1:${port}/`;

try {
  await runChrome(chromeBin, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--run-all-compositor-stages-before-draw",
    `--print-to-pdf=${pdfPath}`,
    "--print-to-pdf-no-header",
    "--no-pdf-header-footer",
    url
  ]);
  console.log(`Exported PDF to ${pdfPath}`);
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index].startsWith("--")) {
      parsed[argv[index].slice(2)] = argv[index + 1] && !argv[index + 1].startsWith("--") ? argv[++index] : true;
    }
  }
  return parsed;
}

function timestampVersion() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return [
    now.getUTCFullYear(),
    pad(now.getUTCMonth() + 1),
    pad(now.getUTCDate())
  ].join(".") + `.${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}`;
}

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    process.env.GOOGLE_CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser"
  ].filter(Boolean);

  return candidates.find((candidate) => existsSync(candidate));
}

function runChrome(binary, args) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(binary, args, { stdio: "inherit" });
    child.on("error", rejectRun);
    child.on("exit", (code) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`Chrome exited with code ${code}`));
    });
  });
}

function contentType(filePath) {
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".pdf": "application/pdf"
  };
  return types[extname(filePath)] || "application/octet-stream";
}
