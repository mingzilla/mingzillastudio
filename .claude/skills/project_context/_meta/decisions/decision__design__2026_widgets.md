## Widgets

- [WIDGET] One d3 widget per topic, framework-free: `Name.draw(host, { theme, reduceMotion, ... }) -> { setTheme, destroy }`. Built on `WidgetKit.scene` (svg, buttons, resize, timer, still frame, mobile layout). Palettes in `widgets/theme.js` (`dark` for dark panels, `light` for light panels).
- [WIDGET] Every widget moves on its own, has one thing to play with, ends on a number or visible result, has a still frame for reduced-motion and a layout under ~560px.
- [HOST] `WidgetHost` draws a widget while near the viewport and destroys it when far away (many timers would cost CPU). The map is adapted in `registry.js`.
- [HOME] Hero map: bubble size = scale figure; hover shows the challenge; click scrolls to the topic. Mini-map (fixed) mirrors it; the current chapter glows.
- [FIGURES] Illustrative numbers are not claims: race lane speeds, search latency (1 s shown = 400 ms), the isolation graph are simulations. Real figures come only from content.

## Verification

- [VERIFY] Render with Playwright chromium (see memory `verify-visuals-with-a-real-renderer`): console errors, `scrollWidth - innerWidth` = 0 at 390px, screenshot desktop and mobile.
- [VERIFY] `?motion` on a spike page forces animation when the OS asks for reduced motion. `?speed=4` fast-forwards widgets (headless runs animation clocks slowly). `host.__w.state` exposes a widget's state for debugging.
- [VERIFY] Headless `locator.screenshot()` can catch a widget mid-recreation; screenshot the page after an instant scroll instead.

## Process

- [DRAFTS] `2026/.drafts/attempt_01` = first React port (kept for reference, not loaded). `attempt_02` = mockups 001-005, text prototypes and spikes that became `common/widgets`.
- [MOCKUP] Order of work: md WHAT first, then divs-only html mockup, then one real spike, then assemble.

## Apps and motion

- [APPS] One row per app: media on one side, title/text/controls on the other, so unequal text never unbalances the layout. Simzilla = a dark-gold phone frame, 400px wide, that plays in place; no panel around it. Upskill = a thin dark-gold tablet-style frame around its poster (no panel, no extra background); clicking it opens the prototype in its own page.
- [APPS] A running game is destroyed by Close, or automatically when scrolled ~500px out of view. No "result" line under an app.
- [MOTION] No auto-play. Every widget panel shows its staged still frame until the visitor presses Play (top-right of the caption row, `WidgetPanel`); Stop returns to the still frame. A playing widget is destroyed when its section leaves the screen or the tab is hidden (`useInView`, 80px margin).

## Gotchas

- [D3TIMER] `d3.timer(cb)` passes ms elapsed since THAT timer started, not `performance.now()`. Start `last` / `t0` at 0. Mixing them made every widget's clock start at minus the page's uptime, so widgets created late sat frozen until a restart reset their own start time.
- [VERIFY] Test motion on a page that has been open for ~20s, not a fresh load, with `reducedMotion: 'reduce'` emulated and Play pressed (that is Ming's setup).
- [FAVICON] A single bold "M" (for Ming), dark gold `#a8832f`, transparent background. Shape `|\_/|`: two 3px stems and a flat-bottomed solid V, 24/32 tall (a little under the full square), all edges on whole pixels at 16px so it stays crisp. `#a8832f` reads on light and dark tab strips. One glyph, high contrast, no border; two letters turned busy at 16px. `favicon.svg`, `favicon-32.png` (transparent), `apple-touch-icon.png` (opaque near-black ground, brighter gold, since iOS fills transparency with black). The letter is a path: a webfont cannot load inside a favicon.
