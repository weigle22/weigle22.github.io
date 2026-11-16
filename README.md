# weigle22.github.io

Emmanuel Otacan's portfolio. A SvelteKit site with one real Angular component embedded in it.

## How it's put together

| Part | Where | Notes |
|---|---|---|
| Site shell | `src/` | SvelteKit 3 + Svelte 5, prerendered to static HTML |
| What the site says | `src/lib/data/content.js` | Case files, timeline, guide lines. **Edit this to change the content.** |
| Live GitHub numbers | `src/routes/+page.server.js` | Fetched at build time; falls back to `src/lib/data/github-snapshot.json` |
| Angular demo | `angular-demo/` | Angular 22 component published as a `<leave-demo>` custom element |
| Deployment | `.github/workflows/deploy.yml` | Builds on every push to `main` and once a day |

Private projects are described generically on purpose: no organisation names, no real data, no code links.

## Run it locally

```sh
npm install
npm install --prefix angular-demo
npm run build:angular   # builds the Angular element into static/angular/
npm run dev             # http://localhost:5173
```

`npm run build:all` produces the finished site in `build/`.

## One-time GitHub setup

In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
After that, every push to `main` deploys itself.

GitHub pauses scheduled workflows after 60 days without repository activity. If the daily rebuild
stops, any push (or "Run workflow" on the Actions tab) starts it again.
