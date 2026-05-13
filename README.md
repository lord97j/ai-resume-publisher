# AI Resume Publisher

Generate, tailor, publish, and export AI resume pages from Git branches.

AI Resume Publisher is an open-source starter for job seekers who want a Git-native resume homepage:

- `main` is the public resume homepage.
- Job-specific resumes live in branches or `variants/<company-role>/`.
- The public homepage redacts sensitive fields by default.
- Full resume data can be encrypted client-side and unlocked with a URL fragment key.
- Every version is static HTML, so it can be hosted on GitHub Pages, Vercel, Netlify, or any static host.

This project is intentionally not another heavy resume SaaS. It is a template plus Codex/AI skill workflow that turns a first-draft resume and a job description into reviewable, publishable static resume pages.

## Quick Start

```bash
npm run build
```

Open `dist/index.html` in a browser.

To build a job-specific variant:

```bash
npm run tailor -- --jd examples/frontend-jd.md --slug acme-frontend
npm run build -- --variant acme-frontend
```

To encrypt the full resume and produce a private access URL:

```bash
npm run encrypt
npm run build
```

The encryption command writes `public/private-resume.enc.json` and prints a private URL suffix like:

```txt
/#key=<base64url-key>
```

Keep that fragment private. URL fragments are not sent to the server, so the static host only receives the encrypted data.

To export a timestamped PDF locally:

```bash
npm run export:pdf
```

The PDF is written to `release/resume-<version>.pdf`.

## Core Workflow

1. Put the canonical resume in `resume.json`.
2. Run `npm run build` to generate the redacted public homepage.
3. Send a JD to an AI agent using `SKILL.md`.
4. The skill creates a variant under `variants/<company-role>/`.
5. Build and publish that variant from a Git branch or Vercel preview deployment.
6. Export PDF from the page with the print button or browser print.

## Repository Layout

```txt
.
  SKILL.md                         Codex/AI delivery workflow
  resume.json                      Canonical JSON Resume compatible data
  templates/minimal-html/          Static HTML/CSS template assets
  variants/                        JD-specific resume versions
  public/private-resume.enc.json   Optional encrypted full resume payload
  scripts/
    build.js                       Static site generator
    tailor.js                      Variant scaffold from JD
    encrypt.js                     AES-GCM private resume encryption
    redact.js                      Public redaction helpers
```

## Privacy Model

GitHub Pages and most static hosts publish files publicly. A hidden path such as `/secret-token/` is only obscurity, not security.

AI Resume Publisher uses two layers:

- Public resume: sensitive fields are removed before build.
- Private resume: full data is stored as AES-GCM ciphertext and decrypted in the browser with a key in the URL fragment, for example `/#key=...`.

This is still a static-site privacy pattern, not an enterprise access-control system. For stricter needs, use Vercel Deployment Protection, Cloudflare Access, or a private backend.

## GitHub Pages

The included workflow builds `dist/`, publishes it with GitHub Pages, exports a PDF, and attaches the PDF to a timestamped GitHub Release.

Expected public URL format:

```txt
https://<owner>.github.io/<repo>/
```

For this repository:

```txt
https://lord97j.github.io/ai-resume-publisher/
```

Release tags use:

```txt
resume-YYYY.MM.DD.HHMM-<short-sha>
```

Each release includes:

```txt
resume-YYYY.MM.DD.HHMM-<short-sha>.pdf
```

Enable Pages in repository settings and choose GitHub Actions as the source if the first workflow run asks for it.

## Vercel

Vercel works well for the branch model:

- `main` becomes the production resume.
- `jd/company-role-*` branches become preview deployments.
- Paid protection features can add password or SSO gates when needed.

## Data Format

`resume.json` follows the spirit of JSON Resume and adds a small `publisher` block for privacy and AI tailoring metadata.

The AI skill should preserve facts, avoid inventing metrics, and write a short tailoring report for every variant.
