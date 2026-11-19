# weigle22.github.io

Emmanuel Otacan's developer portfolio: a static SvelteKit site with two Angular components embedded as custom elements, live GitHub data fetched at build time, and automatic deployment to GitHub Pages.

Live at **https://weigle22.github.io/**

---

## 1. Setup

Requires Node 22.18 or newer (the data script is TypeScript run directly by Node).

```sh
npm install
npm install --prefix angular-widgets

npm run build:angular   # builds the Angular widgets into static/angular/widgets.js
npm run dev             # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Local development server |
| `npm run fetch:github` | Refreshes `src/lib/data/github.json` from the GitHub API |
| `npm run build:angular` | Builds the Angular widgets and copies the bundle into `static/angular/` |
| `npm run build` | Builds the static site into `build/` |
| `npm run build:all` | All three of the above, in order |
| `npm run verify` | Checks the build output is complete |
| `npm run check` | Type-checks Svelte and TypeScript |

## 2. Make it yours

Everything personal is in three files. No component needs editing to change content.

**`src/lib/data/site.ts`** holds your name, title, introduction, location, links, the About text, employment, education and the milestones timeline. Some fields are empty on purpose and stay hidden until you fill them in:

| Field | Shows up as |
|---|---|
| `availability` | Green-dot status in the hero and the Contact header (e.g. "Open to remote roles") |
| `email` | Becomes the main Contact button |
| `resume.file`, `resume.updated` | "Download résumé" buttons in the hero, About and Contact. Put the PDF in `static/` and set `file: '/Emmanuel-Otacan-Resume.pdf'`, `updated: '2026-11'` |
| `contactFormEndpoint` | Shows the contact form. Use a static-friendly form service such as Formspree (`https://formspree.io/f/xxxxxxx`). It's a public URL, not a secret |
| `employment[].systems[].contribution` | "My part" under a system. Without it, the system is labelled as team work |
| `education` | Degrees, eligibility, certifications, training and recognition (set `kind`) |
| `journey` | Milestones under Professional experience |

**Changing the GitHub username:** set `githubUsername` in `site.ts`. The fetch script, the nav link, the hero button and the activity section all read it from there.

### Professional context, used everywhere

Every project has a `context`: `Professional`, `Personal`, `Volunteer`, `Technical assessment` or `Independent`. It is shown on the card, on the case study, and can be filtered in the Work explorer. Every technology has a `use` list: `Production` (built new things with it at work), `Maintenance` (maintains work systems with it) and `Independent` (outside the job). The constellation and its text list show these, so the site never claims more than it should.

### Adding or editing a project

Open **`src/lib/data/projects.ts`** and copy an entry:

```ts
{
  id: 'my-project',                       // unique; becomes /projects/my-project/
  title: 'My Project',
  description: 'One sentence a visitor understands without context.',
  category: 'Web',                        // becomes a filter chip
  repository: 'weigle22/my-project',      // omit for private work
  liveUrl: 'https://example.com',         // optional
  image: '/images/my-project.webp',       // optional; see below
  featured: true,
  year: '2026',
  technologies: ['C#', 'ASP.NET Core'],   // names must match technologies.ts
  context: 'Personal',                    // see above
  surface: 'What a user sees.',
  highlights: ['What you actually built.', '…'],
  caseStudy: {                            // every field optional; empty sections are hidden
    overview: '', problem: '', role: '',
    architecture: { caption: '', nodes: [{ id: 'api', label: 'API', detail: '…', row: 0, kind: 'service' }], edges: [] },
    decisions: [{ title: '', text: '' }],
    challenges: [{ challenge: '', solution: '' }],
    testing: [''], beforeAfter: [{ aspect: '', before: '', after: '' }],
    results: [''], lessons: ['']
  }
}
```

Architecture diagrams are drawn from `caseStudy.architecture`: boxes in `row` 0 are at the top, boxes in the same row are spread evenly, and `edges` connect them by `id`. `kind` (`client`, `service`, `native`, `data`, `external`) changes the box style. A text version is generated automatically for screen readers.

- **Public project:** set `repository`. Stars, language, last update and latest commit are added from GitHub automatically.
- **Private project:** leave `repository` out. The card shows "Private work" and no code link. Keep the wording generic.
- **Preview image:** if `image` is empty the site draws a plate in code. Six projects have their own drawing in `src/lib/components/Plate.svelte`; any other project gets a typographic plate from its initials. To use a real screenshot, put a WebP in `static/images/` and set `image`.

**`src/lib/data/technologies.ts`** feeds the constellation. Two technologies are linked when they appear in the same project, so the names must match those used in `projects.ts`.

## 3. How SvelteKit and Angular fit together

SvelteKit owns the page: routing, layout, SEO, content and animation. Angular owns nothing but two self-contained widgets.

```
angular-widgets/  ──ng build──▶  main.js  ──copy──▶  static/angular/widgets.js
                                                            │
SvelteKit page  ──loads it on demand──▶  <tech-constellation>, <leave-demo>
```

- `angular-widgets/src/main.ts` calls `createApplication()` and registers each component with `createCustomElement()` (Angular Elements). There is no Angular router, no root component and no second app shell.
- The components use Shadow DOM, so their styles can't leak. They read the page's CSS variables (`--ink`, `--accent`, …), which is how they match the dark and light bands.
- `src/lib/utils/angular.ts` injects the bundle once, the first time a widget is about to appear. Visitors who never scroll that far never download Angular.
- Data flows one way: Svelte sets `element.data = { technologies, projects }` on the constellation.
- Cost: one extra file of about 43 kB gzipped, loaded lazily. Angular is zoneless here, so there is no zone.js.

Where Angular is used: the **technology constellation** (Tech Stack) and the **leave-approval workflow** (Playground). Both read the page's design tokens and receive their data from Svelte, so editing `technologies.ts` or `projects.ts` updates the constellation without touching Angular code. The project explorer and GitHub activity are Svelte, because they need the build-time data and scroll animation that Svelte already owns; putting them in Angular would have meant duplicating both.

## 4. GitHub data

Hybrid by design: what the site *says* is hand-written; GitHub only supplies numbers.

1. `scripts/fetch-github-stats.ts` runs before each build. It calls `GET /users/{u}`, `GET /users/{u}/repos` (paginated), `GET /repos/{o}/{r}/languages`, `GET /repos/{o}/{r}/commits` and `GET /repos/{o}/{r}`, and writes `src/lib/data/github.json`.
2. `src/lib/services/github.ts` merges that file with `projects.ts`. Hand-written fields always win.
3. The JSON is compiled into the static pages. **The visitor's browser never calls the GitHub API.**

Failure handling: requests retry with back-off and respect rate-limit headers. If GitHub can't be reached at all, the script leaves the committed `github.json` in place and the build carries on. A missing value is stored as `null` and shown as "unavailable", never as zero.

The contribution grid counts **commits to your public repositories** over the last 52 weeks. GitHub's REST API does not expose the profile contribution calendar (private contributions included), so that is not shown.

The token is read from the `GITHUB_TOKEN` environment variable inside GitHub Actions. It is never written to the JSON, the HTML or the JavaScript, and `npm run verify` fails the build if a token-shaped string appears in the output.

### Fonts

The design pairs ITC Avant Garde Gothic with Cooper BT. Both are commercial, so the site ships open-licence equivalents: **TeX Gyre Adventor** (in `static/fonts/`) and **Fraunces** with its softness axis at maximum. `static/fonts/README.md` has the licences and the one-line change to use the originals if you buy web licences.

### Social preview image

`static/og.png` (1200 × 630) is what LinkedIn, Facebook and messaging apps show when someone shares the link. It is a static file: if you change your title or photo, regenerate it (any 1200 × 630 PNG works).

## 5. Deploying to GitHub Pages

One-time setup in the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

After that, every push to `main` deploys itself.

- The site is fully static (`@sveltejs/adapter-static`, configured in `vite.config.ts`). Every page is prerendered, including one per project, so direct links and refreshes work.
- This is a user site (`<username>.github.io`), so it is served from the root and needs no base path. For a project site (`username.github.io/repo`), add `paths: { base: '/repo' }` to the `sveltekit()` options in `vite.config.ts`.
- **Custom domain:** add a file `static/CNAME` containing the domain, set the same domain under Settings → Pages, and update `url` in `site.ts`.

## 6. Workflows

| File | Runs | Purpose |
|---|---|---|
| `.github/workflows/deploy.yml` | Push to `main`, or manually | Build and deploy |
| `.github/workflows/update-github-stats.yml` | Daily at 02:00 UTC, or manually | Refresh GitHub data, rebuild, deploy |

Both run the same steps: install → fetch GitHub metadata → build Angular widgets → build SvelteKit → verify the output → upload → deploy. They share one concurrency group, so a push and the nightly refresh queue instead of colliding. Nothing is committed back to the repository; the refreshed data lives only in the deployed build.

To run either by hand: **Actions → pick the workflow → Run workflow**.

GitHub pauses scheduled workflows after 60 days without repository activity. Any push, or a manual run, restarts them.

## 7. Project structure

```
src/
  routes/                 +layout (fonts, nav, cursor, page transitions), home page, projects/[id]
  lib/
    sections/             Hero, Work, About, Experience, Stack, Playground, GitHubActivity, Contact
    components/           Header, Cursor, ProjectCard, Plate, Altitude, Guide, Stroop, SignDemo, Footer
    animations/scroll.ts  GSAP ScrollTrigger actions: words, rise, stagger, unmask, parallax, drawLine, magnetic
    services/github.ts    Merges projects.ts with github.json
    data/                 site.ts, projects.ts, technologies.ts, types.ts, github.json
    utils/                Angular loader, motion checks, formatting
  app.css                 Design tokens (colours, type, spacing)
angular-widgets/          Angular 22 components published as custom elements
scripts/                  fetch-github-stats.ts, copy-angular.mjs, verify-build.mjs
.github/workflows/        deploy.yml, update-github-stats.yml
```

## 8. What is implemented and tested

See the summary in the latest pull of this README's history, or run the checks yourself:

```sh
npm run check     # TypeScript and Svelte: 0 errors expected
npm run build:all # fetch GitHub data, build Angular widgets, build the site
npm run verify    # every route, section, sitemap entry and asset present; no token-like strings
```

Content rules this site follows: nothing is invented. Private and professional work is described generically, with no source code, screenshots or real data. Sections with no verified content are hidden rather than padded.
