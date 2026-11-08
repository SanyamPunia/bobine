@AGENTS.md

@~/.claude/rules/base.md

@~/.claude/rules/frontend.md

# reel

Drop-in media players for React, distributed as a shadcn registry and as the
`reel-media` package. `app/page.tsx` is the landing page and
`app/docs/page.tsx` is the docs and example page.

## Stack declaration

| Parameter | Value |
| --- | --- |
| Package manager | pnpm |
| Framework | Next.js 16, App Router |
| Components | Base UI primitives, shadcn registry format |
| Icons | lucide-react, `*Icon`-suffixed imports |
| Fonts | Inter (body), Geist Mono (code), Instrument Serif italic (one hero word only) |
| Theme | Light and dark, following `prefers-color-scheme`, overridable with `.light` / `.dark` on `html` |
| Type scale | `text-display` (landing hero only) / `text-title` / `text-body` / `text-action` / `text-meta` / `text-code` |
| Page width | `CONTENT_WIDTH` in `lib/constants.ts` |
| Focus pattern | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` |
| Class helper | `cn()` from `lib/utils.ts` |

## Directories

```
app/                 landing (`/`), docs (`/docs`), root layout, icons, the one stylesheet
components/ui/       registry components. These ship to consumers.
components/site/     docs-page chrome. Never shipped.
lib/                 media store and HLS loader (shipped), plus site helpers and page content
proxy.ts             serves markdown at / and /docs for Accept: text/markdown
packages/reel/       the npm package build
```

## Color

Two token sets live in `app/globals.css`, one per audience.

- **Site tokens** (`bg`, `surface`, `fill`, `fill-hover`, `stroke-soft`,
  `stroke`, `stroke-strong`, `text-primary`, `text-secondary`, `text-muted`)
  are for `components/site/` and `app/`. Each has a light and a dark value.
- **shadcn tokens** (`background`, `muted`, `card`, `border` and the rest) are
  for `components/ui/`. Consumer apps define these names, so registry code
  must never use a site token. On this site most shadcn names point at a site
  token, so the players match the page.

`--shadow-frame` draws demo stages, code blocks and `kbd` chips. Its edge is
the `stroke` token, so it matches every border in both themes.

## Type scale

The named sizes are registered with `tailwind-merge` in `lib/utils.ts`.
Without that, `cn("text-meta text-text-muted")` drops `text-meta`, because
tailwind-merge reads it as a colour. Add a new size in both places.

## Docs page

- Every section renders through `components/site/section.tsx`. `PageRail`
  builds "On this page" from the rendered `main section[id]` elements, so a
  section built another way is missing from the rail.
- Live examples sit in `Demo`. `bleed` makes a bezel for a full-width player.
- Install commands build their URL with `getRegistryUrl()` in
  `lib/registry.ts`, so they point at whichever host serves the page.
- `SiteHeader` takes `current`, the href of the page rendering it, to mark
  the active link.
- `CodeBlock` highlights with `sugar-high` on the server. Shell commands
  (`prompt`) skip the highlighter.

## Icon

`app/icon.svg` is the mark: a soft gradient orb. It is the favicon through the
App Router file convention, and `SiteHeader` renders it from `/icon.svg`. Its
colours are fixed in the SVG, because a favicon has no theme. They are pastel
so the orb reads on both grounds.

`app/apple-icon.png` is a 180px render of the same SVG on a light ground,
because iOS fills transparent pixels with black. Re-render it whenever the SVG
changes.

## Content source

`lib/docs.ts` and `lib/landing.ts` hold every word and snippet the two pages
show. The pages render them, and `lib/markdown.ts` turns the same data into
markdown. Edit copy there, never inline in a page, or the HTML and the
markdown drift apart. Only the live demos exist in the pages alone.

## Agent readiness

| Path | Serves |
| --- | --- |
| `/llms.txt` | Index per llmstxt.org: when to use reel, then every doc and registry link |
| `/llms-full.txt` | The full docs as one file |
| `/docs.md`, `/index.md` | Markdown copies of the two pages, `noindex` |
| `/sitemap.xml`, `/robots.txt` | Generated from `app/sitemap.ts` and `app/robots.ts` |

- `proxy.ts` rewrites `/` and `/docs` to their markdown copy when the request
  sends `Accept: text/markdown`. The HTML responses cannot carry
  `Vary: Accept`, because Next replaces Vary on App Router pages.
- Absolute URLs come from `getOrigin()` in `lib/registry.ts`, the request's
  own host, so every environment links to itself.
- The docs title carries `PageActions`, a small split button: "Copy page",
  plus a menu with Copy prompt, View as Markdown, Open in ChatGPT and Open in
  Claude. The landing hero uses `CopyAction` for the agent prompt alone.
- Server pages pass these client components strings only. `CopyAction` takes
  an icon **name**, since a component is a function and cannot cross the
  server/client boundary.

## Motion

- Page transitions use React's `<ViewTransition>` through `PageTransition`:
  the body fades out and the next one fades in. The CSS is in `globals.css`,
  with a reduced-motion override. The browser back button runs no transition.
- `SketchUnderline` draws two pencil strokes under the hero word on every
  render. The strokes are `text-primary`, so they are white in dark mode.
- Copy buttons morph their label with `torph` through `MorphLabel`. It
  reserves the longest label's width, so the button never resizes. Tooltips
  do not morph, because Base UI closes a tooltip when its trigger is clicked.
