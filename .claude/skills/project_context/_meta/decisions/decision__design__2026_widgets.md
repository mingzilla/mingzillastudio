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
