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

Project card and panel content live in one object in `app.js`: `PROJECTS`.
Update links and copy there to refresh cards + panel details.
