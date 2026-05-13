<a id="english"></a>

# AI Resume Publisher

[English](#english) | [中文](#中文)

![AI Resume Publisher cover](docs/assets/cover.svg)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-0f766e)](https://lord97j.github.io/ai-resume-publisher/)
[![Latest PDF](https://img.shields.io/badge/PDF-Releases-b45309)](https://github.com/lord97j/ai-resume-publisher/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-1c2522.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-43853d)](package.json)

Generate, tailor, encrypt, publish, and export AI resume pages from Git branches.

**AI Resume Publisher** is an open-source starter for job seekers who want a Git-native personal resume homepage. It ships as a static-site template plus an AI/Codex skill: the public `main` branch hosts a redacted resume, while each job description can become a tailored branch or variant with its own preview, PDF, and review notes.

Quick Start • How It Works • Search Tools • Documentation • Configuration • Troubleshooting • License

## Demo

Public resume:
[https://lord97j.github.io/ai-resume-publisher/](https://lord97j.github.io/ai-resume-publisher/)

Encrypted full resume:
[https://lord97j.github.io/ai-resume-publisher/#key=farKpQkucG44mZcmLIa3Bz2jlDy9hZMxBvyRS4wXU6k](https://lord97j.github.io/ai-resume-publisher/#key=farKpQkucG44mZcmLIa3Bz2jlDy9hZMxBvyRS4wXU6k)

Latest timestamped PDF:
[GitHub Releases](https://github.com/lord97j/ai-resume-publisher/releases/latest)

![Demo resume screenshot](docs/assets/demo-resume.svg)

![Encryption and unlock flow](docs/assets/encryption-flow.gif)

## Quick Start

Clone and build:

```bash
git clone git@github.com:lord97j/ai-resume-publisher.git
cd ai-resume-publisher
npm run build
```

Open `dist/index.html` or serve `dist/` with any static server.

Create an encrypted full-resume payload:

```bash
npm run encrypt
npm run build
```

The command prints a private URL suffix:

```txt
/#key=<base64url-key>
```

Build a tailored resume variant from a JD:

```bash
npm run tailor -- --jd examples/frontend-jd.md --slug acme-frontend
npm run build -- --variant acme-frontend
```

Export a timestamped PDF:

```bash
npm run export:pdf
```

The PDF is written to `release/resume-<version>.pdf`.

## Skill Installation

Install the skill locally for Codex-style agents:

```bash
mkdir -p ~/.codex/skills/ai-resume-publisher
cp SKILL.md ~/.codex/skills/ai-resume-publisher/SKILL.md
```

For active development, symlink it instead:

```bash
mkdir -p ~/.codex/skills
ln -s "$PWD" ~/.codex/skills/ai-resume-publisher
```

Then ask your agent:

```txt
Use the AI Resume Publisher skill.
Read my resume draft, generate resume.json, publish the public page,
then tailor a private branch for this JD.
```

## How It Works

```mermaid
flowchart LR
  A["Resume draft<br/>Markdown / PDF text / JSON"] --> B["resume.json<br/>JSON Resume compatible"]
  B --> C["Redaction<br/>hide email, phone, address"]
  C --> D["Static site<br/>dist/index.html"]
  B --> E["AES-GCM encryption<br/>public ciphertext"]
  E --> F["Private URL<br/>#key=..."]
  G["Job description"] --> H["Variant<br/>variants/company-role"]
  H --> D
  D --> I["GitHub Pages"]
  D --> J["PDF export"]
  J --> K["GitHub Release<br/>resume-time-sha.pdf"]
```

Core ideas:

- `main` is the public resume homepage.
- Sensitive fields are redacted before publishing.
- Full resume data is stored as AES-GCM ciphertext.
- The decryption key lives in the URL fragment, so it is not sent to GitHub Pages.
- JD-specific versions live in `variants/<company-role>/` or Git branches.
- GitHub Actions publishes Pages and attaches PDFs to timestamped Releases.

## Search Tools

This project is designed for agent-friendly discovery. The skill should inspect these files first:

| Surface | Purpose |
|---|---|
| `resume.json` | Canonical resume data |
| `publisher.redact` | Public redaction policy |
| `variants/<slug>/resume.json` | JD-specific resume variant |
| `variants/<slug>/jd.md` | Original target JD |
| `variants/<slug>/notes.md` | What changed and what needs review |
| `public/private-resume.enc.json` | Public ciphertext for private unlock |
| `release/resume-*.pdf` | Local PDF export artifacts |
| GitHub Releases | Published PDF history by time and commit |

Useful commands:

```bash
rg "publisher|redact|variant" resume.json variants
gh release list --repo <owner>/<repo> --limit 10
gh run list --repo <owner>/<repo> --limit 5
gh api repos/<owner>/<repo>/pages
```

## Documentation

| Topic | File / Command |
|---|---|
| Skill workflow | [`SKILL.md`](SKILL.md) |
| Resume schema sample | [`resume.json`](resume.json) |
| Static builder | [`scripts/build.js`](scripts/build.js) |
| JD variant generator | [`scripts/tailor.js`](scripts/tailor.js) |
| Redaction helpers | [`scripts/redact.js`](scripts/redact.js) |
| Encryption | [`scripts/encrypt.js`](scripts/encrypt.js) |
| PDF export | [`scripts/export-pdf.js`](scripts/export-pdf.js) |
| GitHub Pages workflow | [`.github/workflows/pages.yml`](.github/workflows/pages.yml) |

## Configuration

### Resume Data

Edit `resume.json`. The shape is compatible with the spirit of JSON Resume and adds a `publisher` block:

```json
{
  "publisher": {
    "redact": ["email", "phone", "location"],
    "template": "minimal-html",
    "tone": "credible, concise, evidence-first"
  }
}
```

### Redaction

Use `publisher.redact` to decide which fields are hidden on the public page. The default public homepage hides direct contact fields and keeps public profile links visible.

### Encryption

Run:

```bash
npm run encrypt
```

Commit `public/private-resume.enc.json`; do **not** commit or paste the printed `#key=...` into issues, PRs, README examples for real resumes, or public logs.

### GitHub Pages and Releases

Enable Pages in workflow mode:

```bash
gh api -X POST repos/<owner>/<repo>/pages \
  -f build_type=workflow \
  -f 'source[branch]=main' \
  -f 'source[path]=/'
```

Push `main`. The workflow will:

1. build `dist/`;
2. export `resume-YYYY.MM.DD.HHMM-<short-sha>.pdf`;
3. upload the PDF to a GitHub Release;
4. deploy GitHub Pages.

## Output Results

After a successful publish, you should have:

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

For this repository:

- Public URL: [https://lord97j.github.io/ai-resume-publisher/](https://lord97j.github.io/ai-resume-publisher/)
- Latest PDF: [https://github.com/lord97j/ai-resume-publisher/releases/latest](https://github.com/lord97j/ai-resume-publisher/releases/latest)

## Troubleshooting

| Problem | Fix |
|---|---|
| `Get Pages site failed` | Enable Pages with `gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow ...` |
| Pages returns `404` | Wait for the workflow to finish, then check `gh api repos/<owner>/<repo>/pages` |
| Private unlock fails | Make sure `public/private-resume.enc.json` matches the printed `#key=...` from the same `npm run encrypt` run |
| PDF export cannot find Chrome | Set `CHROME_BIN=/path/to/chrome` and rerun `npm run export:pdf` |
| Release was not created | Check `gh run view <run-id> --log-failed` and repository `contents: write` workflow permission |
| Public page shows private data | Review `publisher.redact`, rerun `npm run build`, and inspect `dist/index.html` before publishing |

## Roadmap

- More templates for engineers, product managers, researchers, designers, and students.
- Stronger JD tailoring reports with keyword coverage.
- Branch-based Vercel preview helpers.
- Bilingual resume output.
- Optional ATS-friendly plain HTML mode.

## Open Source License

This project is open source under the [MIT License](LICENSE).

---

<a id="中文"></a>

# AI Resume Publisher 中文说明

AI Resume Publisher 是一个面向求职者的开源简历发布系统：用 `resume.json` 作为主数据源，通过 AI/Codex skill 生成静态个人简历主页，并支持 JD 定制版本、GitHub Pages 发布、私密完整简历加密访问，以及按时间和提交版本输出 PDF 到 GitHub Releases。

## 快速开始

```bash
git clone git@github.com:lord97j/ai-resume-publisher.git
cd ai-resume-publisher
npm run build
```

生成加密完整简历：

```bash
npm run encrypt
npm run build
```

生成 JD 定制版本：

```bash
npm run tailor -- --jd examples/frontend-jd.md --slug acme-frontend
npm run build -- --variant acme-frontend
```

导出 PDF：

```bash
npm run export:pdf
```

## Skill 安装

```bash
mkdir -p ~/.codex/skills/ai-resume-publisher
cp SKILL.md ~/.codex/skills/ai-resume-publisher/SKILL.md
```

使用时可以对 agent 说：

```txt
使用 AI Resume Publisher skill。
读取我的初版简历，生成 resume.json，发布公开脱敏主页，
再根据这个 JD 生成一个定制简历版本。
```

## 工作流

1. 把初版简历整理成 `resume.json`。
2. 用 `publisher.redact` 定义公开页隐藏字段。
3. 运行 `npm run encrypt` 生成完整简历密文和 `#key`。
4. 运行 `npm run build` 生成静态主页。
5. 输入 JD 后生成 `variants/<company-role>/`。
6. 推送 `main` 后 GitHub Actions 自动发布 Pages。
7. Actions 自动导出 PDF 并上传到按时间命名的 Release。

## 输出结果

- 公开简历主页：`https://<owner>.github.io/<repo>/`
- 加密完整简历：`https://<owner>.github.io/<repo>/#key=<base64url-key>`
- PDF 历史版本：`https://github.com/<owner>/<repo>/releases`
- 最新 PDF：`https://github.com/<owner>/<repo>/releases/latest`

## 隐私说明

GitHub Pages 是公开托管。隐藏路径不是安全机制。本项目采用：

- 公开页脱敏：邮箱、电话、地址等字段默认隐藏；
- 完整简历加密：静态站点里只保存 AES-GCM 密文；
- URL fragment key：密钥放在 `#key=...` 中，不会发送给 GitHub Pages 服务器。

这适合静态托管场景下的轻量隐私保护。如果需要强访问控制，请使用 Vercel Deployment Protection、Cloudflare Access 或后端鉴权。

## 开源协议

本项目基于 [MIT License](LICENSE) 开源。
