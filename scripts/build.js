import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { redactResume, publicContactItems } from "./redact.js";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));
const variant = args.variant;
const source = variant ? path.join(root, "variants", variant, "resume.json") : path.join(root, "resume.json");
const outDir = path.join(root, "dist");

const resume = JSON.parse(await readFile(source, "utf8"));
const style = normalizeStyle(args.style || resume.publisher?.template || "minimal-html");
const publicResume = redactResume(resume);
const encryptedPath = path.join(root, "public", "private-resume.enc.json");
const hasEncryptedResume = existsSync(encryptedPath);

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "index.html"), renderPage(publicResume, { variant, hasEncryptedResume, style }));
await copyFile(path.join(root, "templates", "minimal-html", "style.css"), path.join(outDir, "style.css"));

if (hasEncryptedResume) {
  await copyFile(encryptedPath, path.join(outDir, "private-resume.enc.json"));
}

console.log(`Built ${variant ? `variant "${variant}"` : "main resume"} with style "${style}" at dist/index.html`);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index].startsWith("--")) {
      parsed[argv[index].slice(2)] = argv[index + 1] && !argv[index + 1].startsWith("--") ? argv[++index] : true;
    }
  }
  return parsed;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function normalizeStyle(value) {
  const allowed = new Set(["minimal-html", "linear", "stripe", "claude", "notion", "vercel"]);
  return allowed.has(value) ? value : "minimal-html";
}

function renderPage(resume, options) {
  const basics = resume.basics || {};
  const title = `${basics.name || "Resume"}${basics.label ? ` - ${basics.label}` : ""}`;
  const variantLabel = options.variant || resume.publisher?.variant;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(basics.summary || title)}">
  <link rel="stylesheet" href="./style.css">
</head>
<body class="style-${escapeHtml(options.style)}">
  <main class="page">
    <header class="resume-header">
      <div>
        <p class="eyebrow">${escapeHtml([styleLabel(options.style), variantLabel ? `Tailored resume: ${variantLabel}` : "Public resume"].join(" / "))}</p>
        <h1>${escapeHtml(basics.name || "Your Name")}</h1>
        <p class="role">${escapeHtml(basics.label || "")}</p>
      </div>
      <div class="actions">
        ${options.hasEncryptedResume ? '<button id="unlockButton" type="button">Unlock private</button>' : ""}
        <button type="button" onclick="window.print()">Export PDF</button>
      </div>
    </header>

    <section class="summary">
      <p>${escapeHtml(basics.summary || "")}</p>
    </section>

    ${renderContact(resume)}
    ${renderWork(resume.work || [])}
    ${renderProjects(resume.projects || [])}
    ${renderSkills(resume.skills || [])}
    ${renderEducation(resume.education || [])}
  </main>

  ${options.hasEncryptedResume ? renderUnlockScript() : ""}
</body>
</html>`;
}

function styleLabel(styleName) {
  const labels = {
    "minimal-html": "Minimal",
    linear: "Linear",
    stripe: "Stripe",
    claude: "Claude",
    notion: "Notion",
    vercel: "Vercel"
  };
  return labels[styleName] || labels["minimal-html"];
}

function renderContact(resume) {
  const items = publicContactItems(resume);
  if (!items.length) return "";
  return `<section class="contact-grid" id="contactGrid" aria-label="Contact and profiles">
    ${items.map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${renderMaybeLink(item.value)}</strong></div>`).join("")}
  </section>`;
}

function renderMaybeLink(value) {
  const escaped = escapeHtml(value);
  if (/^https?:\/\//.test(value)) return `<a href="${escaped}" rel="noreferrer">${escaped}</a>`;
  return escaped;
}

function renderWork(items) {
  if (!items.length) return "";
  return `<section><h2>Experience</h2>${items.map((item) => `
    <article class="entry">
      <div class="entry-head">
        <h3>${escapeHtml(item.position || "")}</h3>
        <span>${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(" - "))}</span>
      </div>
      <p class="meta">${escapeHtml(item.name || "")}</p>
      <p>${escapeHtml(item.summary || "")}</p>
      ${renderBullets(item.highlights || [])}
    </article>`).join("")}</section>`;
}

function renderProjects(items) {
  if (!items.length) return "";
  return `<section><h2>Projects</h2>${items.map((item) => `
    <article class="entry">
      <h3>${escapeHtml(item.name || "")}</h3>
      <p>${escapeHtml(item.description || "")}</p>
      ${renderBullets(item.highlights || [])}
      ${item.keywords?.length ? `<p class="tags">${item.keywords.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</p>` : ""}
    </article>`).join("")}</section>`;
}

function renderSkills(items) {
  if (!items.length) return "";
  return `<section><h2>Skills</h2><div class="skill-list">${items.map((item) => `
    <div>
      <h3>${escapeHtml(item.name || "")}</h3>
      <p>${(item.keywords || []).map(escapeHtml).join(" · ")}</p>
    </div>`).join("")}</div></section>`;
}

function renderEducation(items) {
  if (!items.length) return "";
  return `<section><h2>Education</h2>${items.map((item) => `
    <article class="entry compact">
      <h3>${escapeHtml(item.institution || "")}</h3>
      <p>${escapeHtml([item.studyType, item.area].filter(Boolean).join(", "))}</p>
      <p class="meta">${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(" - "))}</p>
    </article>`).join("")}</section>`;
}

function renderBullets(items) {
  if (!items.length) return "";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderUnlockScript() {
  return `<script type="module">
const button = document.querySelector("#unlockButton");
button?.addEventListener("click", async () => {
  const key = new URLSearchParams(location.hash.slice(1)).get("key");
  if (!key) {
    alert("Private key missing. Add #key=... to the URL.");
    return;
  }

  try {
    const payload = await fetch("./private-resume.enc.json").then((response) => response.json());
    const resume = await decryptPayload(payload, key);
    document.body.dataset.privateUnlocked = "true";
    renderPrivateBasics(resume);
    button.textContent = "Private unlocked";
    button.disabled = true;
  } catch (error) {
    console.error(error);
    alert("Could not unlock private resume. Check the key.");
  }
});

async function decryptPayload(payload, keyText) {
  const keyBytes = base64urlToBytes(keyText);
  const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["decrypt"]);
  const data = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64urlToBytes(payload.iv) },
    cryptoKey,
    base64urlToBytes(payload.ciphertext)
  );
  return JSON.parse(new TextDecoder().decode(data));
}

function base64urlToBytes(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

function renderPrivateBasics(resume) {
  const basics = resume.basics || {};
  const location = basics.location || {};
  const contactGrid = document.querySelector("#contactGrid");
  const items = [];

  if (basics.email) items.push(["Email", basics.email]);
  if (basics.phone) items.push(["Phone", basics.phone]);

  const place = [location.address, location.city, location.region, location.postalCode, location.countryCode]
    .filter(Boolean)
    .join(", ");
  if (place) items.push(["Location", place]);

  for (const profile of basics.profiles || []) {
    items.push([profile.network || "Profile", profile.url || profile.username || ""]);
  }

  if (contactGrid) {
    contactGrid.innerHTML = items.map(([label, value]) => {
      const safeLabel = escapeText(label);
      const safeValue = escapeText(value);
      const content = /^https?:\\/\\//.test(value)
        ? \`<a href="\${safeValue}" rel="noreferrer">\${safeValue}</a>\`
        : safeValue;
      return \`<div><span>\${safeLabel}</span><strong>\${content}</strong></div>\`;
    }).join("");
  }
}

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
</script>`;
}
