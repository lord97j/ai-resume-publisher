import { mkdir, readFile, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));

if (!args.jd || !args.slug) {
  console.error("Usage: npm run tailor -- --jd path/to/jd.md --slug company-role");
  process.exit(1);
}

const slug = normalizeSlug(args.slug);
const jd = await readFile(path.resolve(root, args.jd), "utf8");
const baseResume = JSON.parse(await readFile(path.join(root, "resume.json"), "utf8"));
const keywords = extractKeywords(jd);
const variantDir = path.join(root, "variants", slug);
const variantResume = scaffoldVariant(baseResume, slug, keywords);

await mkdir(variantDir, { recursive: true });
await writeFile(path.join(variantDir, "resume.json"), `${JSON.stringify(variantResume, null, 2)}\n`);
await writeFile(path.join(variantDir, "jd.md"), jd);
await writeFile(path.join(variantDir, "notes.md"), renderNotes(slug, keywords));

if (args["branch-root"]) {
  await writeFile(path.join(root, "resume.json"), `${JSON.stringify(variantResume, null, 2)}\n`);
  console.log("Updated root resume.json for the current JD branch.");
}

console.log(`Created variant at variants/${slug}`);
console.log("Next: edit the resume conservatively, then run:");
console.log(args["branch-root"] ? "npm run build" : `npm run build -- --variant ${slug}`);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index].startsWith("--")) {
      parsed[argv[index].slice(2)] = argv[index + 1] && !argv[index + 1].startsWith("--") ? argv[++index] : true;
    }
  }
  return parsed;
}

function normalizeSlug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64);
}

function extractKeywords(text) {
  const preferred = [
    "React",
    "TypeScript",
    "JavaScript",
    "CSS",
    "Accessibility",
    "Performance",
    "Vercel",
    "GitHub Actions",
    "Astro",
    "Vite",
    "AI",
    "OpenAI",
    "Product",
    "Design System",
    "SaaS"
  ];
  const lower = text.toLowerCase();
  return preferred.filter((word) => lower.includes(word.toLowerCase())).slice(0, 12);
}

function scaffoldVariant(resume, slug, keywords) {
  const clone = structuredClone(resume);
  clone.publisher = {
    ...(clone.publisher || {}),
    variant: slug,
    publishPath: clone.publisher?.publishPath || randomPublishPath(),
    emphasizedKeywords: keywords,
    reviewRequired: true
  };

  clone.skills = prioritizeByKeywords(clone.skills || [], keywords, (skill) => [skill.name, ...(skill.keywords || [])].join(" "));
  clone.projects = prioritizeByKeywords(clone.projects || [], keywords, (project) => [project.name, project.description, ...(project.keywords || [])].join(" "));

  return clone;
}

function prioritizeByKeywords(items, keywords, textForItem) {
  return [...items].sort((left, right) => score(right, keywords, textForItem) - score(left, keywords, textForItem));
}

function score(item, keywords, textForItem) {
  const text = textForItem(item).toLowerCase();
  return keywords.reduce((total, keyword) => total + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0);
}

function renderNotes(slug, keywords) {
  return `# Variant Notes: ${slug}

## Private Publish Path

- This variant should publish to the randomized path stored in \`resume.json -> publisher.publishPath\`.
- Keep the branch name descriptive for repository operations, but share only the randomized public URL with employers.

## Target Keywords

${keywords.length ? keywords.map((keyword) => `- ${keyword}`).join("\n") : "- No obvious known keywords detected. Review the JD manually."}

## Changes Made

- Created a branch-ready resume variant from the canonical resume.
- Reordered skills and projects when they matched JD keywords.
- Preserved the public-facing summary so the page does not reveal JD tailoring.

## Human Review Required

- Rewrite summary and highlights naturally if stronger positioning is needed.
- Confirm every bullet remains factual.
- Add only metrics the candidate can defend.
`;
}

function randomPublishPath() {
  return `p/${crypto.randomBytes(8).toString("hex")}`;
}
