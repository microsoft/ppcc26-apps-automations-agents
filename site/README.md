# Workshop website

This directory is the GitHub Pages presentation layer for the public workshop.
Canonical content remains in `../labs`, `../setup`, and `../solutions`.
The build only reads those directories: it never edits or generates files there.

## Build and verify

Requires Ruby 3.3+, Bundler, and Node.js 22+ for browser checks.

```powershell
Set-Location site
bundle install
bundle exec jekyll build --trace
bundle exec ruby scripts/validate.rb
npm ci
npx playwright install chromium
npm test
```

If the system Ruby directory is not writable, set `GEM_HOME` to a writable local
directory such as `site\vendor\gems` and retain your system gem directory in
`GEM_PATH`, or use `bundle config set --local path vendor/bundle` before installing.
These directories are ignored.

For a preview of the production-path output:

```powershell
npm run preview
```

Open <http://127.0.0.1:4173/ppcc26-apps-automations-agents/>.
Stop the preview with Ctrl+C.

## Architecture

- Jekyll and Minimal Mistakes provide the static-site foundation. The local
  layouts and stylesheet implement a workshop-focused shell.
- `_data/modules.yml` owns the ordered navigation and landing-page metadata.
- `_plugins/workshop.rb` reads canonical Markdown, renders it in memory, maps
  links to site routes, turns GitHub alerts into labeled callouts, and publishes
  only referenced static files.
- Lab content is not evaluated as Liquid; code and prompts keep their literal
  template syntax.
- Supporting Markdown prompts receive reader pages and byte-identical `.txt`
  downloads. Other source links remain usable from the rendered labs.
- Solution links point at original GitHub files. Package discovery reflects
  actual files, not assumptions about a potentially stale README.
- Search is generated locally from rendered content. There is no search service,
  account provisioning, analytics, or chatbot.
- `scripts/validate.rb` checks every internal link/fragment, images, code-block
  fidelity, alert counts, exact downloads, search coverage, source hashes, and
  exclusion of build files.
- Playwright checks direct module routes, search and its failure/retry state,
  clipboard success/failure, 375px layouts, 404 recovery, and automated
  accessibility on the home, setup, and Module 3 pages.

Do not copy internal preview content into this site without publication approval.
Do not place credentials or attendee data anywhere in the site source.

## Publishing

The workflow in `../.github/workflows/pages.yml` builds and tests pull requests.
A successful push run on `main` or `site/github-pages` can deploy; pull requests
cannot deploy. Both branches target the same public Pages site, not separate previews.

A repository administrator must first enable **Settings > Pages > Build and
deployment > Source: GitHub Actions**, subject to organization policy.
The intended production address is:

<https://microsoft.github.io/ppcc26-apps-automations-agents/>

No repository settings are changed by the build. Local implementation does not
publish anything; a push to an allowed branch and Pages enablement are separate
operations. The `github-pages` environment must permit the deployment branch.

To publish without merging the site PR, push to `site/github-pages`. Its push
trigger builds and deploys without requiring a workflow file on `main`. Manual
workflow dispatch is available once GitHub recognizes the workflow on the default
branch; it is not needed for the branch-publishing path.

The base path is configured in `_config.yml`. Keep preview-server and browser
test paths aligned if the repository name changes. Use production-base-path
validation before publishing.

## Updating the site

Edit only `site/` for presentation changes. Changes to existing labs/assets are
separate content work and are not necessary for this site to build.
When the workshop adds or reorders modules, update `_data/modules.yml` and the
corresponding browser-test route list together.

The theme is distributed under the MIT license; its license is retained in the
installed gem. The footer credits Jekyll and Minimal Mistakes.
