import { mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const styles = ["linear", "stripe", "claude", "notion", "vercel"];
const distDir = join(root, "dist");
const outDir = join(root, "docs", "assets", "style-previews");
const chromeBin = findChrome();

if (!chromeBin) {
  console.error("Could not find Chrome. Set CHROME_BIN to a Chrome or Chromium executable.");
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

for (const style of styles) {
  await run("node", ["scripts/build.js", "--style", style]);
  const server = createServer((request, response) => serveDist(request, response));
  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  const { port } = server.address();
  const screenshot = join(outDir, `${style}.png`);

  try {
    await run(chromeBin, [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--window-size=1440,1100",
      `--screenshot=${screenshot}`,
      `http://127.0.0.1:${port}/`
    ]);
    console.log(`Exported ${style} preview to ${screenshot}`);
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
}

function serveDist(request, response) {
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

function run(command, args) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, { stdio: "inherit", cwd: root });
    child.on("error", rejectRun);
    child.on("exit", (code) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`${command} exited with code ${code}`));
    });
  });
}

function contentType(filePath) {
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png"
  };
  return types[extname(filePath)] || "application/octet-stream";
}
