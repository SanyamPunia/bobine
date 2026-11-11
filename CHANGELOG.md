# Changelog

Changes to the `bobinejs` npm package and the shadcn registry items. The
registry always serves `main`. The package ships the same source at each
version below.

## 0.2.2

### Fixed

- `hlsLoader` plays HLS natively on Safari and every iOS browser, which all
  run WebKit, instead of downloading hls.js there. Other browsers still use
  hls.js, because Chrome 142 and later report native HLS support but cannot
  parse common MPEG-TS streams.

## 0.2.1

### Fixed

- The AudioPlayer's artwork outline uses the `foreground` token instead of a
  `dark:` class, so it follows a `.light` or `.dark` wrapper around the
  player. Wrapping one player in either class themes it with your app's own
  palette, for a light player on a dark page or the reverse. The
  [Theming guide](https://bobine.fyi/docs/guides#theming) shows how.

## 0.2.0

### Added

- `MediaState.hasSource`: false while the element has no source. The play
  button is disabled until there is one.
- `formatTime(seconds, reference)`: pass the duration as `reference`, so every
  time in one player has the same fields (`0:00:05` beside `10:00:01`).

### Fixed

- HLS plays in current Chrome. Chrome 142 and later report native HLS support,
  but cannot parse common MPEG-TS streams, so `hlsLoader` now uses hls.js
  wherever Media Source Extensions exist.
- A caption track marked `default` is on at load.
- Captions decode HTML entities, so `Q&amp;A` reads `Q&A`.
- Long caption track labels wrap in the settings menu. When the menu scrolls,
  its list fades at the bottom edge.
- Caption text and the time label size to the player, so small players keep
  their captions and their seek bar.
- RTL pages: the control bars, times and rate stay left to right. Cues,
  titles and descriptions follow their own direction.
- A cover image that fails to load falls back to the round play button.
- A clip under a second shows `0:01`, not `0:00`.
- The error message reads "This media couldn't be loaded.", because a 404
  reports as an unsupported format in every browser.
- `media.tsx` passes the React hooks lint rules of `eslint-config-next` 16.
- The package's `cn` no longer carries the docs site's type scale.
- `package.json` sets a top-level `types` field.

## 0.1.0

First release.
