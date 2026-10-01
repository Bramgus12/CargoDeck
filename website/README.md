# CargoDeck website

The marketing site for CargoDeck: one prerendered page, built with
[TanStack Start](https://tanstack.com/start) and Tailwind CSS v4.

Bun is the package manager and script runner for this project. Use `bun` and
`bunx --bun`; do not use npm, pnpm, or npx, including in any snippet copied from
upstream documentation.

## Working on it

```bash
bun install
bun run dev
```

| Script                            | What it does                                                      |
| --------------------------------- | ----------------------------------------------------------------- |
| `bun run dev`                     | Dev server on <http://localhost:3000>                             |
| `bun run build`                   | Refreshes the version and SEO files, then prerenders into `dist/` |
| `bun run preview`                 | Serves the production build                                       |
| `bun run images`                  | Regenerates every image in `public/` from the sources             |
| `bun run version:fetch`           | Pulls the latest release tag into `src/lib/version.ts`            |
| `bun run typecheck`               | `tsc --noEmit`                                                    |
| `bun run lint` / `bun run format` | ESLint and Prettier                                               |

There is no component library. The page is one route with five components and
no client-side dependency beyond React and the router — everything it draws,
including the six sidebar glyphs, is written here. Keep it that way: every
package is more JavaScript on a page whose job is to load fast.

Type checking uses TypeScript 7 through the `@typescript/native` alias, which
provides `tsc`. ESLint still needs the TypeScript 6 compiler API, so the
`typescript` entry aliases Microsoft's `@typescript/typescript6` compatibility
package. Keep both aliases until typescript-eslint supports the TypeScript 7
API; see [Microsoft's migration guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).
The generated `src/routeTree.gen.ts` is excluded from Prettier because the router
plugin owns its formatting.

## How it is built to be found

The page exists to rank for "apple container gui" and its neighbours, so a few
things are load-bearing and should not be undone casually:

- **Prerendering is on** (`prerender` in `vite.config.ts`). The built
  `dist/client/index.html` contains the full copy as text. If a change moves
  content behind client-side rendering, crawlers stop seeing it.
- **Copy lives in `src/lib/site.ts`**, and the JSON-LD is built from the same
  constants the page renders, which is what stops the structured data from
  describing text the page does not show. There is deliberately no `FAQPage`
  node: the design has no FAQ, and claiming one is how a site earns a
  structured-data manual action.
- **`SITE_URL` in `src/lib/site.ts` is the only place the domain is written
  down.** The canonical tag, `og:url`, the JSON-LD, `robots.txt`, and
  `sitemap.xml` all derive from it — the last two are generated during `build`
  by `scripts/generate-seo-files.ts`.
- **Motion is one plain CSS animation on load**, never an IntersectionObserver
  and never a per-section scroll reveal. An observer has to hide the content
  first, which means shipping markup that is invisible to crawlers and to
  anyone without JavaScript. Here `[data-enter]` animates from the moment the
  stylesheet applies, so the only thing between an element and its final state
  is a 0.75s animation that has already started.
- **The split view renders all six panels**, five of them with `hidden`. The
  prerendered HTML therefore contains every destination's copy whether or not
  the crawler runs the script; only the selection is client state.

## The version number

The version in the header and in the `SoftwareApplication` JSON-LD comes from
the latest published GitHub release, not from a constant somebody has to
remember to bump. `scripts/fetch-version.ts` runs first in `build`, reads
`/releases/latest`, and rewrites `src/lib/version.ts`.

That generated file is committed on purpose. It is the fallback when the API is
unreachable or rate-limited: the script warns, exits zero, and the build ships
the committed value rather than failing. It also means a build that finds a
newer release shows up in `git status`, so the bump is visible rather than
silent — commit it along with everything else.

Only plain `vX.Y.Z` tags are accepted, since the value is written straight into
a TypeScript string literal. `GITHUB_TOKEN` or `GH_TOKEN` is used when present,
which lifts the unauthenticated 60-per-hour rate limit.

## Design

The app is the focal point on a cool white page. The centered hero introduces
Apple Container and the native Mac experience, followed by the real app
screenshot. Three short product notes lead into the interactive feature
explorer, the command preview, and installation with its requirements.

- **Colour follows the app icon.** Cool white, deep navy, and azure are defined
  in `src/styles.css`. The installation panel uses a pale blue surface; dark
  surfaces are reserved for product demonstrations.
- **Archivo Variable carries the type hierarchy.** Display type uses the
  width axis, with Geist Mono reserved for commands, tags, and version numbers.
- **The screenshot keeps its native shadow.** It needs no artificial frame.
  The optimized AVIF, WebP, and PNG versions share a responsive `<picture>`.
- **Interactions stay useful.** Feature tabs support arrow keys, Home, and End;
  the command has a copy button; navigation has a keyboard skip link. Reduced
  motion disables the single hero entrance.

Coverage is described as partial. The command demo states that CargoDeck
launches the executable directly, without a shell.

## Images

`public/` holds only optimised output, all of it generated by
`bun run images` from two sources:

- `screenshots/containers-inspector.png` — the current window capture of the app.
  Multi-megabyte, so it is git-ignored and kept locally rather than carried in
  the repository.
- `../docs/app-icon.png` — the app icon, for the favicons and the Open Graph
  card.

To swap in a new screenshot, replace that file, run `bun run images`, and update
`SCREENSHOT.width` / `SCREENSHOT.height` in `src/lib/site.ts` if the script
reports different dimensions. Capture it **with** the window shadow: the page
applies no border and no CSS shadow of its own, and the hero figure is widened
by the shadow's share of the image (about 2.75% per side) so the window's edges
line up with the text column. A capture without one would sit on the paper with
nothing lifting it off.

Without `screenshots/`, `bun run images` skips that step with a warning and
still regenerates the icons and the social card, both of which come from
committed files.

## Deployment

The site deploys to Vercel as **static files**, with no serverless function.

`bun run build` produces two directories, and only one of them is deployed:

- `dist/client` — the complete static site, including the prerendered
  `index.html`. This is what ships.
- `dist/server` — an SSR handler that prerendering uses to render the HTML and
  is then finished with. A build-time tool, not a runtime artifact. There are no
  server functions and no API routes in `src/`, so nothing needs to run per
  request.

This version of TanStack Start has no Vercel target — its plugin options are
`dev`, `pages`, `prerender`, `sitemap` and `spa` — so it emits plain Vite output
and leaves hosting to the host. Vercel's zero-config Vite preset serves `dist`,
which contains no `index.html`, so without the configuration below **every URL
returns Vercel's 404**. `vercel.json` overrides the output directory to
`dist/client` and that is the whole fix.

Two settings, one of which is not in this repo:

| Setting                                        | Where                                | Value       |
| ---------------------------------------------- | ------------------------------------ | ----------- |
| Root Directory                                 | Vercel dashboard, Build & Deployment | `website`   |
| Build command, output directory, cache headers | `vercel.json`                        | already set |

Root Directory has to be set in the dashboard — `vercel.json` is read _from_ the
root directory, so it cannot set it. The repository root has no `package.json`,
so if it is left unset the build never runs and the result is the same 404 by a
different route.

The one header rule caches everything under `/assets/` for a year as immutable,
which is safe because Vite content-hashes those filenames. The images at the
root of `public/` are deliberately left on Vercel's defaults: `source` is
path-to-regexp, not a regex, and Vercel documents no pattern for matching by
file extension — `/assets/(.*)` is documented verbatim, an invented extension
pattern would either fail the deploy or silently never match. Do not "fix" this
by moving the images under `public/assets/` to pick up the existing rule, since
they are not content-hashed and a year of `immutable` would strand a replaced
screenshot in caches.
