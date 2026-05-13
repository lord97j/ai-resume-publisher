import { mkdir, readFile, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";

const root = process.cwd();
const resume = await readFile(path.join(root, "resume.json"), "utf8");
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
const ciphertext = Buffer.concat([cipher.update(resume, "utf8"), cipher.final()]);
const tag = cipher.getAuthTag();

await mkdir(path.join(root, "public"), { recursive: true });
await writeFile(
  path.join(root, "public", "private-resume.enc.json"),
  JSON.stringify(
    {
      version: 1,
      algorithm: "AES-256-GCM",
      iv: base64url(iv),
      ciphertext: base64url(Buffer.concat([ciphertext, tag]))
    },
    null,
    2
  )
);

const keyB64 = base64url(key);
await writeFile(path.join(root, "public", "decrypt.key"), keyB64);

console.log("Encrypted full resume written to public/private-resume.enc.json");
console.log(`Private URL suffix: /#key=${keyB64}`);

function base64url(buffer) {
  return Buffer.from(buffer).toString("base64url");
}
