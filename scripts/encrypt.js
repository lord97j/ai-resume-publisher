import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));
const resumePath = path.join(root, "resume.json");
const resume = await readFile(resumePath, "utf8");
const resumeData = JSON.parse(resume);
const resolvedKey = await resolveKey(resumeData, args);
const salt = crypto.randomBytes(16);
const key = crypto.pbkdf2Sync(resolvedKey.value, salt, 210000, 32, "sha256");
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
const ciphertext = Buffer.concat([cipher.update(resume, "utf8"), cipher.final()]);
const tag = cipher.getAuthTag();

await mkdir(path.join(root, "public"), { recursive: true });
await writeFile(
  path.join(root, "public", "private-resume.enc.json"),
  JSON.stringify(
    {
      version: 2,
      algorithm: "AES-256-GCM",
      keyDerivation: {
        type: "PBKDF2-SHA256",
        iterations: 210000,
        salt: base64url(salt)
      },
      iv: base64url(iv),
      ciphertext: base64url(Buffer.concat([ciphertext, tag]))
    },
    null,
    2
  )
);

await writeFile(path.join(root, "public", "decrypt.key"), resolvedKey.value);

console.log("Encrypted full resume written to public/private-resume.enc.json");
console.log(`Key source: ${resolvedKey.source}`);
console.log(`Private URL suffix: /#key=${encodeURIComponent(resolvedKey.value)}`);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index].startsWith("--")) {
      parsed[argv[index].slice(2)] = argv[index + 1] && !argv[index + 1].startsWith("--") ? argv[++index] : true;
    }
  }
  return parsed;
}

async function resolveKey(resumeData, args) {
  const configuredKey = resumeData.publisher?.encryption?.key;
  const keyFile = path.join(root, "public", "decrypt.key");
  const candidates = [
    { source: "--key", value: args.key },
    { source: "RESUME_PRIVATE_KEY", value: process.env.RESUME_PRIVATE_KEY },
    { source: "resume.json publisher.encryption.key", value: configuredKey }
  ];

  for (const candidate of candidates) {
    const value = normalizeKey(candidate.value);
    if (value) return { ...candidate, value };
  }

  if (existsSync(keyFile)) {
    const value = normalizeKey(await readFile(keyFile, "utf8"));
    if (value) return { source: "public/decrypt.key", value };
  }

  return {
    source: "generated random key",
    value: crypto.randomBytes(32).toString("base64url")
  };
}

function normalizeKey(value) {
  if (value === undefined || value === null || value === true) return "";
  return String(value).trim();
}

function base64url(buffer) {
  return Buffer.from(buffer).toString("base64url");
}
