# jabdy.com

James Abdy’s project notebook. A static Hugo site, deployed to the existing AWS S3 bucket by GitHub Actions. No application server, database, or paid build service.

## Develop

Use Hugo **0.125.5**, matching the version pinned in `.github/workflows/deploy.yml`.

```sh
hugo server -D
```

Open http://localhost:1313. The custom templates live in `layouts/`, CSS and small progressive-enhancement script in `assets/`. Fonts are served locally; their licenses are in `static/fonts/`. The old Ghostwriter theme remains in the repository for reference but is no longer loaded.

## Build and check

Stop the development server before checking the production output (it adds a development-only live-reload script):

```sh
hugo --gc --minify --panicOnWarning
python3 scripts/check_site.py
```

The check verifies content routes, local assets, internal links, and AI disclosures. Existing article paths are retained, including the privacy policy. The full project list remains usable without JavaScript; filtering and search are enhancements.

## Publish

Push to `main` to build, validate, and sync `public/` to `s3://jabdy.com`, using the existing AWS secrets and region. Pull requests run the same build and validation without deploying. Manual workflow dispatch is also available. The workflow retains existing S3 objects and does not provision AWS resources. HTML is uploaded with revalidation headers so CloudFront picks up new pages promptly; fingerprinted CSS and JavaScript can remain cached.

## Content

Add one Markdown file per new project in `content/projects/`. Use `ai_generated = true` for AI-written entries; this adds a visible label to cards and a disclosure to articles. Dates for the 2026 refresh approximate the arithmetic mean of GitHub commit author dates. See [content provenance](docs/content-provenance.md).

Keep original articles intact. New entries can use `icon` for an existing app icon, `visual` and `monogram` for a typographic card, or `image` for an image. Login screenshots are not used. Existing archive thumbnails are mapped in `data/project_images.json`. Private repositories are described without source links.

## Writing and presentation

Keep this a straightforward personal website for visitors, colleagues, and the author’s own record. Use a few substantial paragraphs per new project, focused on functionality and what using the app is like. A brief stack overview is useful; avoid attributing low-level implementation decisions to James. Light self-deprecation is fine, but avoid slogans and a punchline in every paragraph. Give cards enough description to explain the project before opening it. Use the existing app icons rather than login screenshots. Keep the portrait on About, with project artwork on the homepage.
