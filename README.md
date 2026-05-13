# AI Resume Publisher

[中文文档](README.zh-CN.md)

![AI Resume Publisher cover](docs/assets/cover.png)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-0f766e)](https://lord97j.github.io/ai-resume-publisher/)
[![Latest PDF](https://img.shields.io/badge/PDF-Releases-b45309)](https://github.com/lord97j/ai-resume-publisher/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-1c2522.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-43853d)](package.json)

Agent-readable skill for turning a resume into a personalized, publishable website.

**AI Resume Publisher is not an npm product flow for end users.** It is a Codex / Claude Code style skill plus a reference static-site implementation. A human brings a resume; an Agent reads this repo, extracts the resume into `resume.json`, chooses the most suitable `design-md/*.md` direction, edits the personal website, tests locally, and publishes with the user's consent.

This repo is inspired by the positioning of [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md): markdown files give Agents design and build intent they can apply directly. Here, `SKILL.md` explains when to use the skill, `AGENTS.md` explains how to operate the repo, `design-md/` gives visual references, and the existing resume site code is only the starting point.

[Agent Workflow](#agent-workflow) • [Install As A Skill](#install-as-a-skill) • [Repository Map](#repository-map) • [Design References](#design-references) • [Publishing](#publishing) • [Troubleshooting](#troubleshooting) • [License](#open-source-license)

## Demo

Reference public resume:
[https://lord97j.github.io/ai-resume-publisher/](https://lord97j.github.io/ai-resume-publisher/)

Reference encrypted full resume:
[https://lord97j.github.io/ai-resume-publisher/#key=farKpQkucG44mZcmLIa3Bz2jlDy9hZMxBvyRS4wXU6k](https://lord97j.github.io/ai-resume-publisher/#key=farKpQkucG44mZcmLIa3Bz2jlDy9hZMxBvyRS4wXU6k)

Latest reference PDF:
[GitHub Releases](https://github.com/lord97j/ai-resume-publisher/releases/latest)

### Privacy States

Before private unlock:

![Public redacted resume before encrypted unlock](docs/assets/privacy-before.png)

After private unlock:

![Private resume after encrypted unlock](docs/assets/privacy-after.png)

## Agent Workflow

The intended flow is Agent-led:

1. User installs this repository as a skill for Codex, Claude Code, or another coding Agent.
2. Agent verifies required tools with the user: Git, GitHub CLI, Node.js 20+, and a browser or static server for local preview.
3. With explicit user consent, Agent creates a private GitHub repository or forks this repository into the user's account.
4. User provides resume content as text, Markdown, PDF text, or an existing JSON file.
5. Agent extracts canonical facts into `resume.json`. Facts must be preserved; uncertain claims go into notes, not into the resume.
6. Agent reads `AGENTS.md`, `SKILL.md`, `resume.json`, and the best-fit `design-md/*.md` file.
7. Agent edits the website so the content, structure, writing tone, and visual direction fit the user's actual background.
8. Agent runs local validation and browser checks before publishing.
9. Agent asks whether to publish from `main` or another branch.
10. Agent publishes, then returns the public URL, private unlock URL fragment, PDF/release URL, and any encryption key material the user needs.

The npm scripts are implementation tools for the Agent. They are not the user-facing installation or publishing experience.

## Install As A Skill

For Codex-style local skills:

```bash
mkdir -p ~/.codex/skills
ln -s "$PWD" ~/.codex/skills/ai-resume-publisher
```

Or copy only the skill entrypoint:

```bash
mkdir -p ~/.codex/skills/ai-resume-publisher
cp SKILL.md ~/.codex/skills/ai-resume-publisher/SKILL.md
```

Then ask your Agent something like:

```txt
Use the AI Resume Publisher skill.
Create a private GitHub repo for my resume site after I approve it.
Extract my resume into resume.json, choose the right design reference,
build the personal website, test locally, and publish when I confirm the branch.
```

## Repository Map

| File or folder | Purpose for Agents |
|---|---|
| `SKILL.md` | Skill trigger, guardrails, and high-level workflow |
| `AGENTS.md` | Operating manual for coding Agents working in this repo |
| `resume.json` | Canonical resume data extracted from the user's source resume |
| `design-md/` | Agent-readable design directions inspired by public website patterns |
| `templates/minimal-html/` | Reference static resume template and CSS |
| `scripts/build.js` | Builds `dist/index.html` from `resume.json` or a variant |
| `scripts/encrypt.js` | Creates encrypted private resume payload and prints URL fragment key |
| `scripts/export-pdf.js` | Exports a timestamped PDF from the built static site |
| `scripts/tailor.js` | Creates a reviewable JD-specific variant scaffold |
| `variants/<slug>/` | Optional role or company-specific resume variants |
| `.github/workflows/pages.yml` | Reference GitHub Pages and PDF release workflow |

## Design References

The local `design-md/` files are copied from, or modeled after, the public [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) concept: plain Markdown design files that Agents can read and apply.

| Style | Best-fit resume signal | Local file | Build hint |
|---|---|---|---|
| Linear | Backend, architecture, security, infrastructure | `design-md/linear.md` | `npm run build -- --style linear` |
| Stripe | PM, growth, technical sales, SaaS full-stack | `design-md/stripe.md` | `npm run build -- --style stripe` |
| Claude | AI research, content, market strategy, prompt engineering | `design-md/claude.md` | `npm run build -- --style claude` |
| Notion | Operations, project management, admin, junior roles | `design-md/notion.md` | `npm run build -- --style notion` |
| Vercel | Frontend, UI/UX engineering, startup generalists | `design-md/vercel.md` | `npm run build -- --style vercel` |

The Agent may choose one of these directly or combine the resume content with a custom implementation when that better serves the user's background. The goal is a convincing personal site, not brand imitation.

## Local Agent Commands

Use these after the resume has been normalized:

```bash
npm run build
npm run encrypt
npm run export:pdf
```

Build a role-specific variant:

```bash
npm run tailor -- --jd examples/frontend-jd.md --slug acme-frontend
npm run build -- --variant acme-frontend
```

Build with a specific visual direction:

```bash
npm run build -- --style linear
npm run build -- --style stripe
npm run build -- --style claude
npm run build -- --style notion
npm run build -- --style vercel
```

Recommend a style from a role description:

```bash
node scripts/recommend-style.js --role "backend architect"
node scripts/recommend-style.js --role "AI research"
```

## Publishing

When the user approves GitHub publishing, the Agent should:

1. Confirm repository ownership and privacy settings.
2. Confirm whether publication should happen from `main` or a separate branch.
3. Run local validation.
4. Keep the printed `#key=...` out of commits, issues, PR descriptions, and public logs.
5. Push the approved branch.
6. Verify GitHub Pages, GitHub Actions, and releases.
7. Return:

```txt
Public URL:
https://<owner>.github.io/<repo>/

Encrypted URL:
https://<owner>.github.io/<repo>/#key=<base64url-key>

PDF history:
https://github.com/<owner>/<repo>/releases

Latest PDF:
https://github.com/<owner>/<repo>/releases/latest
```

For this reference repository:

- Public URL: [https://lord97j.github.io/ai-resume-publisher/](https://lord97j.github.io/ai-resume-publisher/)
- Latest PDF: [https://github.com/lord97j/ai-resume-publisher/releases/latest](https://github.com/lord97j/ai-resume-publisher/releases/latest)

## Troubleshooting

| Problem | Fix |
|---|---|
| Agent treats this as an npm package | Read `SKILL.md` and `AGENTS.md`; npm scripts are internal build helpers |
| `Get Pages site failed` | Enable Pages with `gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow ...` |
| Pages returns `404` | Wait for the workflow to finish, then check `gh api repos/<owner>/<repo>/pages` |
| Private unlock fails | Make sure `public/private-resume.enc.json` matches the printed `#key=...` from the same `npm run encrypt` run |
| PDF export cannot find Chrome | Set `CHROME_BIN=/path/to/chrome` and rerun `npm run export:pdf` |
| Release was not created | Check `gh run view <run-id> --log-failed` and repository `contents: write` workflow permission |
| Public page shows private data | Review `publisher.redact`, rerun `npm run build`, and inspect `dist/index.html` before publishing |

## Open Source License

This project is open source under the [MIT License](LICENSE).
