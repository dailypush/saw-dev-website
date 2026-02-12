# saw.dev playground

A static, terminal-first homepage for `saw.dev`.

## Run locally

Open `index.html` directly in a browser.

## GitHub Pages setup

1. Push this repo to GitHub (for example: `saw-dev-website`).
2. In GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/ (root)`
4. Save and wait for deployment.
5. Optional custom domain: in Pages settings set custom domain to `saw.dev`, then configure your DNS records to point to GitHub Pages.

## Content updates

Project content now has two layers in `/Users/chadedwards/Projects/saw-dev-website/app.js`:

- `LOCAL_PROJECTS`: local override copy for titles/descriptions/notes and fallback if sync data is unavailable.
- `PROJECT_DATA_SOURCE`: points to `/Users/chadedwards/Projects/saw-dev-website/assets/projects.json`.

Repository sync now runs in GitHub Actions:

- Workflow: `/Users/chadedwards/Projects/saw-dev-website/.github/workflows/sync-projects.yml`
- Schedule: hourly (`17 * * * *`) and manual (`workflow_dispatch`)
- Output: `/Users/chadedwards/Projects/saw-dev-website/assets/projects.json`

Use terminal command `repos` in the site header to reload the generated JSON in the browser.
