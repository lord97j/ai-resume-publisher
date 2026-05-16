# AI Resume Publisher Skill

Use this skill when a user wants an Agent to turn resume material into a personalized, publishable resume website.

This repository is a skill and reference implementation for coding Agents such as Codex or Claude Code. Do not treat it as an end-user npm package. The user should not need to know the scripts; the Agent uses them to build, test, encrypt, and publish.

## Goal

Create a truthful, visually appropriate personal resume website from the user's resume, with optional encrypted private details, PDF export, and GitHub Pages publishing.

## Inputs

- Base resume: pasted text, Markdown, PDF-extracted text, plain text, or existing `resume.json`.
- Optional target role or JD.
- Optional preferred publishing target: GitHub Pages, branch preview, Vercel, or local-only.
- Optional privacy preference: public redacted page only, or public page plus encrypted full resume.

## Required Repo Reading

Before editing, read:

1. `AGENTS.md`
2. `resume.json`
3. `design-md/README.md`
4. The most relevant `design-md/*.md`
5. Existing template and scripts only as needed

## Non-Negotiable Rules

- Preserve facts. Never invent employers, degrees, titles, dates, certifications, awards, or metrics.
- Do not exaggerate seniority or claim technologies the user did not provide.
- Keep uncertain claims in notes for user confirmation.
- Do not expose private contact fields on the public homepage.
- If the user asks for public redaction, include company-name masking unless they explicitly want employers public.
- Treat hidden paths as convenience links, not security.
- For private full resumes, use encrypted payloads and URL fragment keys.
- Never commit the printed `#key=...` value.
- Ask before creating repositories, pushing branches, enabling Pages, or publishing publicly.

## Agent Workflow

1. Confirm the user's desired output:
   - public resume site only;
   - public site plus encrypted full resume;
   - role/JD-specific branch;
   - GitHub Pages or another host.
2. If the user wants GitHub publishing, install or verify GitHub tooling with consent:
   - `git`
   - `gh auth status`
   - repository owner/name
   - private repository or fork preference
3. If needed and approved, create a private repository or fork this repo.
4. Normalize the user's resume into `resume.json`.
5. Set `publisher.redact` for public privacy. Use `["email", "phone", "location", "company"]` by default unless the user asks otherwise.
6. Choose a design direction:
   - read `design-md/README.md`;
   - inspect the most relevant `design-md/*.md`;
   - choose based on the user's role, industry, seniority, and content density.
7. Update the site implementation so it serves the resume content. The current template is a reference, not a hard limit.
8. If there is a JD for local review, create a reviewable variant:

   ```bash
   npm run tailor -- --jd path/to/jd.md --slug company-role
   ```

   If the user already has a published resume site and wants a dedicated JD link, create a branch instead:

   ```bash
   git switch main
   git pull
   git switch -c jd/company-role
   npm run tailor:branch -- --jd path/to/jd.md --slug company-role
   ```

9. Edit the variant or JD branch root `resume.json` conservatively:
   - sharpen summary toward the role;
   - reorder skills and projects for relevance;
   - tighten bullets using JD language only when truthful;
   - preserve canonical work history.
10. Write `variants/<slug>/notes.md` with:
    - target role;
    - keywords emphasized;
    - exact sections changed;
    - review risks or claims needing user confirmation.
11. Build and verify locally:

    ```bash
    npm run build
    npm run export:pdf
    ```

12. If the user wants encrypted private details:

    ```bash
    npm run encrypt
    npm run build
    ```

    Capture the printed `/#key=...` suffix for the user only.
    If the user provides a custom key, run:

    ```bash
    npm run encrypt -- --key "<user-key>"
    ```

    For GitHub Actions, set the private repository secret `RESUME_PRIVATE_KEY` to keep the key stable without committing it. In a private repository only, `resume.json -> publisher.encryption.key` may be used when the user explicitly wants the key in repo config.

13. Browser-check the generated site:
    - public page loads;
    - private contact fields are redacted;
    - `/#key=...` unlocks full contact fields when encryption is enabled;
    - layout is readable on desktop and mobile;
    - PDF export exists under `release/`.
14. Ask whether this should publish as the canonical `main` resume or as a JD branch under `jd/<slug>`.
15. Publish only after user confirmation.
16. Return final outputs:
    - public URL;
    - JD URL when applicable;
    - encrypted URL with fragment key when applicable;
    - GitHub Releases PDF URL;
    - branch name and commit summary;
    - notes about any claims needing user review.

## GitHub Pages Release Flow

When the user asks to publish through GitHub:

1. Verify the repository has an `origin` remote.
2. Verify GitHub CLI auth:

   ```bash
   gh auth status
   ```

3. This repository publishes GitHub Pages from the generated `gh-pages` branch. The workflow configures that source automatically, but you can do it manually if needed:

   ```bash
   gh api -X POST repos/<owner>/<repo>/pages \
     -f build_type=legacy \
     -f 'source[branch]=gh-pages' \
     -f 'source[path]=/'
   ```

4. Run local validation:

   ```bash
   npm run build
   npm run export:pdf
   ```

5. Commit source files plus `public/private-resume.enc.json` if encrypted mode is used. The encrypted payload is safe to publish; the fragment key is not.
6. Push the user-approved branch:
   - `main` publishes to `/`;
   - `jd/<slug>` publishes to the randomized `publisher.publishPath` from `resume.json`.
7. Watch the GitHub Actions run:

   ```bash
   gh run list --repo <owner>/<repo> --limit 5
   gh run watch <run-id> --repo <owner>/<repo> --exit-status
   ```

8. Confirm:
   - Pages deployment succeeded;
   - `gh-pages` contains root files for `main` or the randomized `publisher.publishPath` files for the JD branch;
   - GitHub Release was created with a timestamped PDF asset;
   - public URL loads without exposing raw sensitive fields;
   - public Pages output does not expose `resume.pdf`;
   - private URL with `#key=...` unlocks full contact details when applicable.

## Output Checklist

- `resume.json` contains only user-supported facts.
- `publisher.redact` protects direct contact and location details as requested.
- Public company names are masked with `**` when `publisher.redact` includes `company`.
- The selected `design-md/*.md` is reflected in the actual page.
- `dist/index.html` renders the public or tailored resume.
- Contact info is hidden unless decrypted in the browser.
- Print/PDF export works.
- Variant notes explain every meaningful adjustment.
- For JD branches, `https://<owner>.github.io/<repo>/<publisher.publishPath>/` loads and PDF is available from GitHub Releases, not public Pages.
- The user receives URLs, branch information, and any private unlock key.
