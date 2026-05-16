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
- Treat profile links such as WeChat, LinkedIn, personal blogs, and direct social handles as contact fields when `profiles` or `contact` is redacted.
- Include `company` in `publisher.redact` by default so public work history masks employer names with `**`.
- `public/private-resume.enc.json` may be committed because it is ciphertext.
- The printed `#key=...` fragment must only be returned to the user. Never commit it to public repositories.
- Prefer `RESUME_PRIVATE_KEY` for stable private-repo publishing. Use `npm run encrypt -- --key "<user-key>"` for user-chosen keys. `public/decrypt.key` is local and ignored.
- Check `dist/index.html` before publishing to ensure sensitive fields are not visible in the public HTML.

## Implementation Guidance

- You may change templates, scripts, CSS, and data shape when needed, but keep the result easy for future Agents to inspect.
- Use `design-md/*.md` as design intent, not as a brand clone. Build a credible personal site that matches the user's role.
- Keep layout responsive and readable before adding flourish.
- Show the user's strongest evidence in the first viewport: name, role, positioning, core proof, and contact/profile affordances.
- Avoid making the page look like a generic SaaS landing page when the user's goal is a resume or personal site.
- If creating JD-specific versions for local review, keep them under `variants/<slug>/` and explain changes in `notes.md`.
- If creating a publishable JD-specific resume, use a `jd/<slug>` branch and keep the optimized resume in the branch root `resume.json`.
- Do not expose JD tailoring in public UI, PDF text, or shared URLs. Branch names can be descriptive; public paths should come from randomized `publisher.publishPath`.

## Local Validation

Typical checks:

```bash
npm run build
npm run export:pdf
```

Full private PDF for GitHub Releases:

```bash
npm run build -- --private --out-dir dist-private
npm run export:pdf -- --source dist-private
```

Encrypted private resume checks:

```bash
npm run encrypt
npm run build
```

Custom key check:

```bash
npm run encrypt -- --key "<user-key>"
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
- Publish from a `jd/<slug>` branch or preview host.

When publishing succeeds, return:

- public resume URL;
- encrypted private URL when applicable;
- GitHub Releases PDF URL;
- branch name;
- commit hash or short summary;
- private unlock key material, clearly labeled for the user only.

## JD Branch Publishing

Use this flow when a user already has a resume site and wants a dedicated link for a target role:

```bash
git switch main
git pull
git switch -c jd/company-role
npm run tailor:branch -- --jd path/to/jd.md --slug company-role
```

Then edit `resume.json` in the branch root. Keep changes truthful and note uncertain claims in `variants/company-role/notes.md`.

After validation, push the branch:

```bash
npm run build
npm run export:pdf
git push -u origin jd/company-role
```

The workflow deploys:

- `main` to `https://<owner>.github.io/<repo>/`
- `jd/company-role` to `https://<owner>.github.io/<repo>/<publisher.publishPath>/`
- timestamped full PDF to GitHub Releases only

GitHub Pages cannot password-protect different subdirectories. Use encrypted resume payloads and `#key=...` fragments for private contact details.

## Branching

- Use `main` for the canonical public resume only after user confirmation.
- Use `jd/<company-role>` for published role-specific variants.
- Do not maintain one branch per visual style unless the user explicitly asks for that workflow; visual style should usually be data/config plus implementation.
