# Agent Operating Guide

This repository is an Agent skill plus a reference resume-site implementation. Your job is to create a better personal website for the specific user, not to preserve the sample site as a product.

## Positioning

- Treat `SKILL.md` as the workflow contract.
- Treat `resume.json` as the canonical resume data source.
- Treat `design-md/*.md` files as Agent-readable design directions, similar to the `DESIGN.md` idea from `awesome-design-md`.
- Treat scripts and templates as implementation helpers. They can be edited when the user's resume needs a better presentation.
- Do not frame the user's experience as "run npm commands"; the Agent runs commands on the user's behalf.

## First Pass

1. Inspect `resume.json`, `publisher.redact`, and existing template output.
2. Ask for missing source resume material only if the repository does not contain enough real user data.
3. Choose a design file from `design-md/` based on the user's actual content:
   - `linear.md`: infrastructure, backend, architecture, security, systems work.
   - `stripe.md`: product, growth, business-facing engineering, technical sales.
   - `claude.md`: AI, research, writing-heavy, strategy, prompt/workflow expertise.
   - `notion.md`: operations, project coordination, early-career, broad generalist.
   - `vercel.md`: frontend, UI engineering, product engineering, startup generalist.
4. If none fits, use the closest one as a reference and adapt thoughtfully.

## Resume Extraction Rules

- Preserve original facts exactly: employer names, schools, titles, dates, degrees, awards, certifications, and numbers.
- Rewrite for clarity, density, and positioning, but do not create new claims.
- Prefer specific evidence over generic adjectives.
- Keep public page content concise; use projects and highlights to show proof.
- Mark uncertain or inferred details in notes for user confirmation.

## Privacy Rules

- Put direct contact fields and precise location in `publisher.redact` unless the user explicitly wants them public.
- `public/private-resume.enc.json` may be committed because it is ciphertext.
- The printed `#key=...` fragment must only be returned to the user. Never commit it.
- Check `dist/index.html` before publishing to ensure sensitive fields are not visible in the public HTML.

## Implementation Guidance

- You may change templates, scripts, CSS, and data shape when needed, but keep the result easy for future Agents to inspect.
- Use `design-md/*.md` as design intent, not as a brand clone. Build a credible personal site that matches the user's role.
- Keep layout responsive and readable before adding flourish.
- Show the user's strongest evidence in the first viewport: name, role, positioning, core proof, and contact/profile affordances.
- Avoid making the page look like a generic SaaS landing page when the user's goal is a resume or personal site.
- If creating JD-specific versions, keep them under `variants/<slug>/` and explain changes in `notes.md`.

## Local Validation

Typical checks:

```bash
npm run build
npm run export:pdf
```

Encrypted private resume checks:

```bash
npm run encrypt
npm run build
```

Then verify:

- `dist/index.html` renders.
- Public contact fields are redacted.
- `/#key=...` unlocks private details when encryption is enabled.
- The page works on desktop and mobile.
- PDF output exists in `release/`.

## Publishing Protocol

Before any external action, ask for user consent:

- Create or fork GitHub repository.
- Set repository privacy.
- Enable GitHub Pages.
- Push a branch.
- Publish from `main`.
- Publish from an alternate branch or preview host.

When publishing succeeds, return:

- public resume URL;
- encrypted private URL when applicable;
- PDF or GitHub Releases URL;
- branch name;
- commit hash or short summary;
- private unlock key material, clearly labeled for the user only.

## Branching

- Use `main` for the canonical public resume only after user confirmation.
- Use descriptive branches such as `resume/<slug>` or `jd/<company-role>` for experiments and role-specific variants.
- Do not maintain one branch per visual style unless the user explicitly asks for that workflow; visual style should usually be data/config plus implementation.
