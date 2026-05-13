# AI Resume Publisher 中文说明

[English README](README.md)

![AI Resume Publisher 封面](docs/assets/cover.png)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-0f766e)](https://lord97j.github.io/ai-resume-publisher/)
[![Latest PDF](https://img.shields.io/badge/PDF-Releases-b45309)](https://github.com/lord97j/ai-resume-publisher/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-1c2522.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-43853d)](package.json)

面向 Agent 的简历网站生成 skill：把用户简历变成更适合本人背景的个人网站，并完成本地验证、加密、发布。

**AI Resume Publisher 不是给终端用户直接 `npm run` 的产品流程。** 它的定位是 Codex、Claude Code 这类编程 Agent 可安装、可读取、可执行的 skill，加上一套静态简历网站参考实现。用户提供简历，Agent 读取本仓库，把简历提取成 `resume.json`，选择最合适的 `design-md/*.md` 视觉方向，改造个人网站，测试后在用户同意下发布。

本仓库的定位参考了 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)：用 Markdown 文件把设计和执行意图交给 Agent。这里的 `SKILL.md` 说明什么时候使用该 skill，`AGENTS.md` 说明 Agent 如何操作本仓库，`design-md/` 提供视觉参考，简历网站代码只是起点。

[Agent 流程](#agent-流程) • [安装为 Skill](#安装为-skill) • [仓库结构](#仓库结构) • [JD 分支](#jd-分支) • [发布](#发布) • [排障](#排障) • [开源协议](#开源协议)

## Demo

参考公开简历主页：
[https://lord97j.github.io/ai-resume-publisher/](https://lord97j.github.io/ai-resume-publisher/)

参考加密完整简历：
[https://lord97j.github.io/ai-resume-publisher/#key=farKpQkucG44mZcmLIa3Bz2jlDy9hZMxBvyRS4wXU6k](https://lord97j.github.io/ai-resume-publisher/#key=farKpQkucG44mZcmLIa3Bz2jlDy9hZMxBvyRS4wXU6k)

参考最新版 PDF：
[GitHub Releases](https://github.com/lord97j/ai-resume-publisher/releases/latest)

### 加密前后展示

加密解锁前：

![加密解锁前的公开脱敏简历](docs/assets/privacy-before.png)

加密解锁后：

![加密解锁后的完整私密简历](docs/assets/privacy-after.png)

## Agent 流程

推荐流程由 Agent 主导：

1. 用户把本仓库安装为 Codex、Claude Code 或其他编程 Agent 的 skill。
2. Agent 向用户确认必要工具：Git、GitHub CLI、Node.js 20+，以及本地预览用浏览器或静态服务器。
3. 在用户明确同意后，Agent 创建 GitHub 私有仓库，或把本仓库 fork 到用户账号下。
4. 用户把简历以文本、Markdown、PDF 提取文本或 JSON 的形式发给 Agent。
5. Agent 把真实履历事实提取到 `resume.json`。不得编造公司、职位、日期、学历、证书、奖项或指标；不确定内容写入 notes。
6. Agent 阅读 `AGENTS.md`、`SKILL.md`、`resume.json` 和最适合的 `design-md/*.md`。
7. Agent 按用户履历改造网站内容、结构、文案语气和视觉表现。
8. Agent 本地构建、预览、检查脱敏和加密解锁。
9. Agent 从 `main` 发布主简历，从 `jd/<company-role>` 分支发布岗位定制简历。
10. Agent 自动发布，并把公开地址、JD 地址、加密访问地址、GitHub Release PDF 地址、加密 key 等必要结果返回给用户。

npm scripts 是 Agent 的内部实现工具，不是面向用户的主要使用入口。

## 安装为 Skill

推荐使用 `skills` 安装器：

```bash
npx skills
npx skills add git@github.com:lord97j/ai-resume-publisher.git
```

如果你更偏好 HTTPS，而不是 SSH：

```bash
npx skills add https://github.com/lord97j/ai-resume-publisher
```

如果是在本仓库内做开发，可以用软链接，这样 Agent 能立刻读到你的本地改动：

```bash
mkdir -p ~/.codex/skills
ln -s "$PWD" ~/.codex/skills/ai-resume-publisher
```

然后可以对 Agent 说：

```txt
使用 AI Resume Publisher skill。
在我确认后为我的简历网站创建 GitHub 私有仓库。
把我的简历提取到 resume.json，选择合适的设计参考，
完成个人网站、本地测试，并在我确认分支后发布。
```

## 仓库结构

| 文件或目录 | Agent 用途 |
|---|---|
| `SKILL.md` | skill 触发条件、边界和高级工作流 |
| `AGENTS.md` | 编程 Agent 操作本仓库的手册 |
| `resume.json` | 从用户简历提取出的主数据 |
| `design-md/` | Agent 可读的设计方向，参考公开网站视觉模式 |
| `templates/minimal-html/` | 静态简历模板和 CSS 参考实现 |
| `scripts/build.js` | 从 `resume.json` 或 variant 构建 `dist/index.html` |
| `scripts/encrypt.js` | 生成私密简历密文，并输出 URL fragment key |
| `scripts/export-pdf.js` | 从静态页面导出带时间版本的 PDF |
| `scripts/tailor.js` | 创建 JD 定制版本的可审查目录 |
| `variants/<slug>/` | 可选的岗位或公司定制简历版本 |
| `.github/workflows/pages.yml` | 把 `main` 和 `jd/*` 分支聚合发布到同一个 GitHub Pages 站点 |

## 设计参考

本地 `design-md/` 文件来自或仿照 [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) 的理念：让 Agent 直接读取 Markdown 设计文件并应用到界面实现中。

| 风格 | 适合的履历信号 | 本地文件 | 构建提示 |
|---|---|---|---|
| Linear | 后端、架构、安全、基础设施 | `design-md/linear.md` | `npm run build -- --style linear` |
| Stripe | PM、增长、技术销售、SaaS 全栈 | `design-md/stripe.md` | `npm run build -- --style stripe` |
| Claude | AI 研究、内容、市场策划、提示词工程 | `design-md/claude.md` | `npm run build -- --style claude` |
| Notion | 运营、项目管理、行政、职场新人 | `design-md/notion.md` | `npm run build -- --style notion` |
| Vercel | 前端、UI/UX、初创团队通用人才 | `design-md/vercel.md` | `npm run build -- --style vercel` |

Agent 可以直接选择其中一种，也可以在尊重用户履历的前提下做更适合个人定位的实现。目标是可信、有辨识度的个人网站，不是复制某个品牌。

## Agent 本地命令

简历完成结构化后可使用：

```bash
npm run build
npm run encrypt
npm run export:pdf
```

生成岗位定制版本：

```bash
npm run tailor -- --jd examples/frontend-jd.md --slug acme-frontend
npm run build -- --variant acme-frontend
```

切换到 `jd/<slug>` 后，生成分支根目录定制简历：

```bash
npm run tailor:branch -- --jd examples/frontend-jd.md --slug acme-frontend
npm run build
```

指定视觉方向构建：

```bash
npm run build -- --style linear
npm run build -- --style stripe
npm run build -- --style claude
npm run build -- --style notion
npm run build -- --style vercel
```

根据岗位推荐风格：

```bash
node scripts/recommend-style.js --role "后端架构师"
node scripts/recommend-style.js --role "AI 研究"
```

## JD 分支

本仓库使用 GitHub Pages 聚合发布方案支持岗位定制简历：

- `main` 是主简历。
- `jd/<slug>` 分支是从主简历派生的岗位定制简历。
- workflow 会构建每个推送的分支，并把结果部署到统一的 `gh-pages` 发布分支。
- 主简历地址：`https://<owner>.github.io/<repo>/`
- JD 分支名保留可读信息，方便仓库管理；公开 URL 使用 `resume.json -> publisher.publishPath` 中的随机路径。
- JD 简历地址：`https://<owner>.github.io/<repo>/<publisher.publishPath>/`
- 公开 Pages 产物不包含 PDF 文件。需要 PDF 时，在页面解密后点击导出按钮，或使用 GitHub Release 中带时间版本的 PDF。
- 完整私密信息仍然通过加密密文和 `#key=...` URL fragment 解锁。

面向目标岗位的 Agent 流程示例：

```bash
git switch main
git pull
git switch -c jd/apple-frontend
npm run tailor:branch -- --jd path/to/apple-jd.md --slug apple-frontend
# Agent 编辑 resume.json，并核对所有事实。
npm run build
npm run export:pdf
git push -u origin jd/apple-frontend
```

GitHub Action 会把该分支发布到随机的 `publisher.publishPath`，并创建带时间版本的 PDF Release，不会把 `resume.pdf` 发布到 GitHub Pages。

## 发布

当用户同意通过 GitHub 发布时，Agent 应该：

1. 确认仓库 owner、仓库名和隐私设置。
2. 确认发布主简历 `main`，还是岗位定制分支 `jd/<slug>`。
3. 完成本地构建、浏览器预览、PDF、脱敏和加密解锁检查。
4. 不要把 `#key=...` 提交到仓库、issue、PR 描述或公开日志。
5. 推送用户确认的分支。
6. 检查 GitHub Pages、`gh-pages` 聚合分支、GitHub Actions 和 Release。
7. 返回：

```txt
公开简历主页：
https://<owner>.github.io/<repo>/

加密完整简历：
https://<owner>.github.io/<repo>/#key=<base64url-key>

JD 简历：
https://<owner>.github.io/<repo>/<publisher.publishPath>/

PDF 历史版本：
https://github.com/<owner>/<repo>/releases

最新 PDF：
https://github.com/<owner>/<repo>/releases/latest
```

当前参考仓库：

- 公开主页：[https://lord97j.github.io/ai-resume-publisher/](https://lord97j.github.io/ai-resume-publisher/)
- 最新 PDF：[https://github.com/lord97j/ai-resume-publisher/releases/latest](https://github.com/lord97j/ai-resume-publisher/releases/latest)

## 排障

| 问题 | 处理方式 |
|---|---|
| Agent 把本仓库当成 npm 包 | 先读 `SKILL.md` 和 `AGENTS.md`；npm scripts 只是内部构建辅助 |
| `Get Pages site failed` | workflow 会配置 Pages 从 `gh-pages` 发布；检查 token 是否有 `pages: write` 权限 |
| Pages 返回 `404` | 等 workflow 完成后，运行 `gh api repos/<owner>/<repo>/pages` |
| JD 分支访问不到 | 确认分支名以 `jd/` 开头，再检查 `resume.json -> publisher.publishPath` 中的随机路径 |
| 私密解锁失败 | 确认 `public/private-resume.enc.json` 和 `#key=...` 来自同一次 `npm run encrypt` |
| PDF 导出找不到 Chrome | 设置 `CHROME_BIN=/path/to/chrome` 后重试 `npm run export:pdf` |
| Release 没生成 | 用 `gh run view <run-id> --log-failed` 查看日志，并检查 workflow `contents: write` 权限 |
| 公开页露出敏感信息 | 检查 `publisher.redact`，重新 `npm run build`，发布前检查 `dist/index.html` |

## 开源协议

本项目基于 [MIT License](LICENSE) 开源。
