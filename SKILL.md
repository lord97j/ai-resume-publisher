# AI Resume Publisher Skill

Use this skill when a job seeker provides a first-draft resume, a job description, or asks to publish a tailored static resume page.

## Goal

Create a Git-native resume homepage from `resume.json`, then generate JD-specific variants that can be published from branches or static hosting previews.

## Inputs

- Base resume: Markdown, PDF text, plain text, or existing `resume.json`.
- Optional JD: pasted job description or URL content provided by the user.
- Optional target: GitHub Pages, Vercel, or local preview.

## Non-Negotiable Rules

- Preserve facts. Never invent employers, degrees, titles, dates, certifications, awards, or metrics.
- Do not expose private contact fields on the public homepage.
- Treat hidden paths as convenience links, not security.
- For private full resumes, use encrypted payloads and URL fragment keys.
- Keep every JD-specific change reviewable in `variants/<slug>/notes.md`.

## Workflow

1. Normalize the resume into JSON Resume compatible `resume.json`.
2. Confirm sensitive fields are listed in `publisher.redact`.
3. If the user wants a private full-resume URL, run:

   ```bash
   npm run encrypt
   ```

   Capture the printed `/#key=...` suffix and keep it out of commits, logs, issues, and PR descriptions.

4. Run `npm run build` to create the public redacted homepage.
5. Run `npm run export:pdf` to verify the static page can become a PDF.
6. For a JD, create a slug such as `company-role` and run:

   ```bash
   npm run tailor -- --jd path/to/jd.md --slug company-role
   ```

7. Edit `variants/<slug>/resume.json` conservatively:
   - sharpen summary toward the role;
   - reorder skills and projects for relevance;
   - tighten bullets using JD language only when truthful;
   - preserve the canonical work history.
8. Write `variants/<slug>/notes.md` with:
   - target role;
   - keywords emphasized;
   - exact sections changed;
   - review risks or claims needing user confirmation.
9. Build the variant:

   ```bash
   npm run build -- --variant company-role
   ```

10. Publish:
   - GitHub Pages: push `main`. The `Publish Resume Page` workflow builds the static page, deploys GitHub Pages, exports a PDF, and creates a timestamped Release.
   - Vercel: push `jd/company-role` branch and use the preview deployment URL.

11. Return URLs:
   - Public resume: `https://<owner>.github.io/<repo>/`
   - Private resume: `https://<owner>.github.io/<repo>/#key=<base64url-key>`
   - PDF releases: `https://github.com/<owner>/<repo>/releases`

## GitHub Pages Release Flow

When the user asks to publish through GitHub:

1. Verify the repository has an `origin` remote.
2. Verify GitHub CLI auth:

   ```bash
   gh auth status
   ```

3. Enable GitHub Pages in workflow mode if `gh api repos/<owner>/<repo>/pages` returns 404:

   ```bash
   gh api -X POST repos/<owner>/<repo>/pages \
     -f build_type=workflow \
     -f 'source[branch]=main' \
     -f 'source[path]=/'
   ```

4. Run local validation:

   ```bash
   npm run encrypt
   npm run build
   npm run export:pdf
   ```

5. Browser-check the local public page:
   - public page shows redacted contact fields;
   - `/#key=...` unlocks full contact fields;
   - PDF export exists under `release/`.
6. Commit source files plus `public/private-resume.enc.json`. The encrypted payload is safe to publish; the fragment key is not.
7. Push `main`.
8. Watch the `Publish Resume Page` GitHub Actions run:

   ```bash
   gh run watch <run-id> --repo <owner>/<repo> --exit-status
   ```

   Or trigger it manually after enabling Pages:

   ```bash
   gh workflow run pages.yml --repo <owner>/<repo> --ref main
   ```

9. Confirm:
   - Pages deployment succeeded;
   - GitHub Release was created;
   - Release contains a timestamped PDF asset;
   - public URL loads without exposing raw sensitive fields;
   - private URL with `#key=...` unlocks full contact details.
10. Return:
    - `https://<owner>.github.io/<repo>/`
    - `https://<owner>.github.io/<repo>/#key=<base64url-key>`
    - `https://github.com/<owner>/<repo>/releases/latest`

## Output Checklist

- `dist/index.html` renders the public or tailored resume.
- Contact info is hidden unless decrypted in the browser.
- Print button works for PDF export.
- Variant notes explain every meaningful adjustment.
- The GitHub Release includes `resume-YYYY.MM.DD.HHMM-<short-sha>.pdf`.
- The user receives the public URL, private encrypted URL, releases URL, and exact build/publish commands used.
