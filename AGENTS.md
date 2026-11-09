<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# bobine

Drop-in media players for React, distributed as a shadcn registry and as the
`bobine` package. `app/page.tsx` is the landing page. The docs are three
pages under `app/docs/` (Getting started, Guides, Reference) sharing
`app/docs/layout.tsx`.

This file is the one source of project rules for every coding agent.
`CLAUDE.md` only imports it, so edit the rules here and nowhere else. The
block above is managed by `next dev`; leave it as it is.

## Stack declaration

| Parameter | Value |
| --- | --- |
| Package manager | pnpm |
| Framework | Next.js 16, App Router |
| Components | Base UI primitives, shadcn registry format |
| Icons | Phosphor (`@phosphor-icons/react`), `*Icon`-suffixed imports. Server components import from `@phosphor-icons/react/dist/ssr`. Brand marks come from svgl.app into `public/brands/` |
| Fonts | Inter (body), Geist Mono (code), Instrument Serif italic (one hero word only) |
| Theme | Light and dark, following `prefers-color-scheme`, overridable with `.light` / `.dark` on `html` |
| Type scale | `text-display` (landing hero only) / `text-title` / `text-body` / `text-action` / `text-meta` / `text-code` |
| Page width | `CONTENT_WIDTH` in `lib/constants.ts` |
| Focus pattern | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` |
| Class helper | `cn()` from `lib/utils.ts` |

## Directories

```
app/                 landing (`/`), docs (`/docs`, `/docs/guides`, `/docs/reference`, `/docs/examples`), root layout, icons, the one stylesheet
components/ui/       registry components. These ship to consumers.
components/site/     docs-page chrome. Never shipped.
lib/                 media store and HLS loader (shipped), plus site helpers and page content
hooks/               React hooks for the site (`useCopy`, `useIsApple`). Never shipped; the players' hooks stay in `components/ui/media.tsx`
proxy.ts             serves markdown at / and /docs for Accept: text/markdown
packages/bobine/       the npm package build
skills/bobine/         the agent skill, installed with `npx skills add SanyamPunia/bobine`. Update it when the API changes
public/brands/       third-party marks from svgl.app: OpenAI and Claude (page actions), TypeScript, CSS and Bash (code block labels), GitHub (header)
public/team/         author avatars for the footer credit, 96px JPEGs cropped to the face
public/media/        demo video, captions and audio
```

## Code comments

Follow these roughly in every TS, TSX and CSS file:

- Always `/* */`, never `//`. In JSX that is `{/* */}`.
- `/** */` only for multi-line comments; a single-line comment stays `/* */`.
- Max 80 characters per comment line. Wrap anything longer.
- A blank line before every comment, except where it opens a block or file.

```tsx
const swap = "transition-[opacity,scale,filter] duration-300"

/* the check replaces the copy icon in the same grid cell */
const cell = "grid *:col-start-1 *:row-start-1"

/**
 * One of two icons that cross-fade on a state change. Reduced motion keeps
 * the fade and drops the scale and blur.
 */
export function swapIcon(shown: boolean) {
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

The `dark:` variant follows the same switch as the tokens: `.dark` on `html`,
or the system preference unless `html` is `.light`. Keep the two in step.

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
- Absolute URLs come from `SITE_URL` in `lib/site.ts`, fixed at build time.
  Never read the request host in a page: it makes the page dynamic, which
  disables prefetch and makes every click wait on a server render.
- Every page's `<main>` carries `id="content"`. The root layout's "Skip to
  content" link targets it, past the header and the docs sidebar.
- `SiteHeader` takes `current`, the href of the page rendering it, to mark
  the active link.
- `CodeBlock` highlights with `sugar-high` on the server. Shell commands
  (`prompt`) skip the highlighter.

## Touch

The players are tested against a phone's touch sequence: tap plays, the
controls stay up after the finger lifts, they sleep after `idleTimeout`, a tap
while playing only reveals them, and the next tap pauses.

- `MediaRoot` hides the controls on `pointerleave` for a mouse only. A finger
  lifting fires `pointerleave` too, and hiding on it flashed the controls off
  after every tap.
- Hovering the control bar keeps it awake only where `(hover: hover)` matches,
  because `:hover` sticks to the last tapped control on touch.
- The root sets `touch-manipulation`, no tap highlight and no long-press
  callout, so apps that never set these globally still get them. Control
  buttons get a 36px hit area on `pointer-coarse` without changing size.
- Volume sliders render for `pointer-fine` only: phones use hardware buttons,
  and iOS ignores volume set from the page.
- The seek and volume sliders track the finger 1:1: the fill is a direct
  `transform` write with no transition, and touch moves never set React
  state. They are value sliders, so no momentum, spring or rubber-band.
- Every drag ends on `pointercancel` as well as `pointerup`. The system can
  take a touch away mid-drag, and the seek bar used to stay paused with its
  fill frozen.
- The seek bar has a 44px-tall hit area on `pointer-coarse`, and its track
  thickens while pressed (`group-active`), the only grab feedback touch has.
- No haptics. iOS Safari has no vibration API, and Android's
  `navigator.vibrate` is a buzz, not a tap, so it would feel worse than none.
- Any text input is 16px on `pointer-coarse`, or iOS zooms the page into it.
- The player clips its children, so the settings panel caps its height to
  the space above its trigger and scrolls.

## Social metadata

Every page builds its metadata with `pageMetadata()` in `lib/metadata.ts`:
title, description, canonical URL, Open Graph and the X card. Next merges
metadata shallowly, so a page that set `openGraph` by hand would drop the
site name and the image. The root layout sets `metadataBase` from `SITE_URL`,
which turns the relative canonical, og:url and image paths into absolute
`https://bobine.fyi` URLs. Production needs `NEXT_PUBLIC_SITE_URL` set, or
they resolve to the Vercel domain.

The social card is `public/og.jpg` (1200 by 630, under X's 5MB limit), set on
every page by the helper. It is not an `opengraph-image` file, because a page
that sets its own `openGraph` loses an image inherited from a parent segment.
It is deliberately minimal: the real paused player on the dark ground, with
the orb, the wordmark and one muted line centred in its frame and the control
bar at the bottom. Re-render it from the live player when the mark, that line
or the controls change.

## Icon

`app/icon.svg` is the mark: a soft gradient orb. It is the favicon through the
App Router file convention, and `SiteHeader` renders it from `/icon.svg`. Its
colours are fixed in the SVG, because a favicon has no theme. They are pastel
so the orb reads on both grounds.

`app/apple-icon.png` is a 180px render of the same SVG on a light ground,
because iOS fills transparent pixels with black. Re-render it whenever the SVG
changes.

## Content source

`lib/docs.ts`, `lib/landing.ts` and `lib/examples.ts` hold every word and
snippet the pages show. The pages render them, and `lib/markdown.ts` turns the same data into
markdown. Edit copy there, never inline in a page, or the HTML and the
markdown drift apart. Only the live demos exist in the pages alone.

## Agent readiness

| Path | Serves |
| --- | --- |
| `/llms.txt` | Index per llmstxt.org: when to use bobine, then every doc and registry link |
| `/llms-full.txt` | The full docs as one file |
| `/docs.md`, `/index.md`, `/docs/examples.md` | Markdown copies of the pages, `noindex` |
| `/sitemap.xml`, `/robots.txt` | Generated from `app/sitemap.ts` and `app/robots.ts` |

- `proxy.ts` rewrites `/`, the docs pages and `/docs/examples` to their markdown
  copy when the request sends `Accept: text/markdown`. The HTML responses
  cannot carry `Vary: Accept`, because Next replaces Vary on App Router pages.
- Absolute URLs use `SITE_URL` (see Docs page above). Set
  `NEXT_PUBLIC_SITE_URL` on the host if the domain is not Vercel's production
  domain.
- The docs title carries `PageActions`, a small split button: "Copy page",
  plus a menu with Copy prompt, View as Markdown, Open in ChatGPT and Open in
  Claude. The landing hero uses `CopyAction` for the agent prompt alone.
- Server pages pass these client components strings only. `CopyAction` takes
  an icon **name**, since a component is a function and cannot cross the
  server/client boundary.

## Motion

- There are no page transitions. Both pages are static and prefetched, so a
  click shows the next page at once, and an animation would only delay it.
- `SketchUnderline` draws two pencil strokes under the hero word on every
  render. The strokes are `text-primary`, so they are white in dark mode.
- Copy buttons morph their label with `torph` through `MorphLabel`, and the
  button width animates to fit. The docs title has its own `max-w-sm` so it
  never re-wraps when the button changes width. Tooltips do not morph,
  because Base UI closes a tooltip when its trigger is clicked.
- Every copy control swaps its icon through `swapIcon()` in
  `components/site/copy-swap-icon.tsx`, so they all animate alike. Press
  feedback is `motion-safe:active:scale-[0.98]`.
- The header logo (`LogoLink`) plays cuelume's `tap` cue on click, and
  only the orb presses in, to `scale-90`. Six clicks less than 600ms apart
  play `success` and send two blurred copies of the orb out as rings.
  cuelume synthesizes the sound with Web Audio, so there is no audio file.
  These are the only sounds on the site.
- The header is sticky on every page, with no border. A
  blurred page-coloured layer behind it runs 24px past its bottom and fades
  out through `mask-b-from-70%`. Three values depend on its height (about
  60px, plus the 24px fade): sections use `scroll-mt-24`, the
  rail's `THRESHOLD` is 112, and popups sit at `z-50` above its `z-20`. Change
  them together.
- `ColumnGuides` (in the root layout) draws hairlines at the column edges from
  `sm` up. The landing title carries faded blueprint rules on each line box,
  pitched with `1lh`. They run past the column, so `body` has
  `overflow-x: clip` (not `hidden`, which would break the sticky header).
- The header shows the version from `packages/bobine/package.json`. Bump it
  there on release. Nothing else stores the version. `PUBLISHING.md` has the
  release steps.

## Docs structure

- `docPages` in `lib/docs.ts` is the page list: href, markdown path, title,
  description and section ids. The sidebar (`DocsNav`), the pager
  (`DocsPager`), the `.md` routes, the proxy map, the sitemap, llms.txt and
  the search index all read it. A new page needs an entry there, its
  `page.tsx`, its `.md` route, and its path in the proxy `matcher`, which Next
  reads at build time and so cannot be derived.
- `DocsNav` takes the left margin and `PageRail` the right, both from the
  `rail` breakpoint. Below it, a bar naming the current page opens the same
  list as a left drawer (Base UI `Dialog`). Both render one `NavLinks`, so
  the two lists cannot drift.
- Once that bar has scrolled fully behind the sticky header,
  `DocsMenuButton` slides in left of the logo and opens the same drawer. It
  is a detached trigger on one `Dialog.createHandle()`, and it reaches the
  header through `SiteHeader`'s `leading` slot, so the header stays a
  server component.
- Code blocks are a double bezel (`fill` tray, `bg` panel with
  `--shadow-well`). The label shows a language mark from `public/brands/`.

## Search

`CommandMenu` (Cmd+K / Ctrl+K, and the header button) uses `cmdk` for
filtering inside Base UI's `Dialog`, not cmdk's built-in Radix dialog, so the
site keeps one dialog system. `searchItems()` in `lib/search.ts` builds the
index on the server from `docPages`, so new sections appear without changes.
The palette is a double bezel like the code blocks: a `fill` tray with an
inset panel (`--shadow-well`), lifted by `--shadow-overlay`, with framed icon
tiles and a key hint strip in the tray. The filter is word matching, not cmdk's fuzzy default: pages match on their
title only, because a page description names every topic and outranked the
section the reader typed. The backdrop uses the `scrim` token, 30% black in
light and 60% in dark.

Overscroll bounce is off site-wide (`overscroll-behavior: none` on `html`
and `body`).

## Examples page

`/docs/examples` has a playground and recipes. It lives under the docs
layout, so the layout supplies its header, sidebar and footer. Its words and
snippets live in `lib/examples.ts`, which the page, `/docs/examples.md`,
llms.txt and search all
read, so a new recipe needs an entry there and its live player in the page.
Each recipe is one card: the live player on top and its code below, split by
a single border and the change of tone. The card clips both, so `Demo` and
`CodeBlock` drop their own radius and shadow there. The playground (`components/site/playground.tsx`) builds its code from the
same toggles it renders, so the two cannot disagree.

The header holds Docs, search and a GitHub icon, nothing else. Examples is a
docs page, reached from the sidebar and search. Registry is in the sidebar
and search, npm only in search.
Below `sm` the version pill, the GitHub icon and the divider hide, and the
search trigger becomes a 32px circle, so a phone shows the logo, Docs and
search. Decorative lines (column guides, title rules, header divider)
are all off below `sm`. Anything hidden on phones must stay
reachable through search.

The docs sidebar lists Examples in the Docs group, after Reference
(`docExtras` in `lib/docs.ts`). The pager walks `docsReadingOrder`, which is
`docPages` then `docExtras`, so Reference links on to Examples. A "Resources" group closes the sidebar: `registry.json`,
`llms.txt` and `llms-full.txt`, which open in a new tab. The footer holds
only the credit and the licence. The landing page has no sidebar, so all
three files are also in search.
