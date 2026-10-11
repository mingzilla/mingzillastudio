## Structure

- [STRUCTURE] Light 3-tier (skill `unit__design__structure__3_tier__frontend`): `common/` + `page__profile/{domains,components}`. No store, guard, service: nothing is shared or fetched.
- [LOAD] No build. `node .claude/skills/unit__design__structure__3_tier__frontend/_meta/scripts/assemble/assemble_scripts.js --html 2026/index.html --root 2026` rewrites the `<script>` tags. Run it after adding a js file. `assemble.config.json` fixes vendor order.
- [LOAD] Files are classic scripts sharing globals (`html`, `useState`, components). Domain classes reach components only at call time (`ProfileSections.all()`), as domains load first.
- [CSS] `css/<block>.css`, BEM-style, listed by hand in `index.html`. A new block needs a new `<link>`.

## Edit map

- [EDIT] One diagram/section text -> `page__profile/components/showcase__<topic>.comp.js`.
- [ADD] App -> append to `page__profile/domains/app_catalog.js` (+ image in `assets/`). Chapter, nav entry and numbering are generated.
- [ADD] Other chapter -> `chapter__<name>.comp.js` (uses `Chapter` + `Showcase`) + one line in `domains/profile_sections.js`. Chapters are numbered by order.
- [ADD] Hero stat -> `domains/profile_stats.js`.

## htm gotchas

- [HTM] Attribute names are React's (`className`, `markerEnd`). `style` is an object.
- [HTM] `<br />` with a space. Literal `<` / `>` in text -> `${'<'}`, else it parses as a tag.

## d3

- [D3] `Network` (hero force graph) and `CountUp` (stat strip) are the d3 pieces. Both honour `prefers-reduced-motion`.

## Mobile

- [MOBILE] Wide svg diagrams get `min-width:640px` inside a horizontally scrolling `.visual`; scaled to fit, their text is unreadable. Nav is one scrolling row.

## Verify

- [VERIFY] No system browser: Playwright chromium needs `libnspr4`/`libnss3` extracted from `apt-get download` into `LD_LIBRARY_PATH`. Check console errors, `scrollWidth - innerWidth` (must be 0), and word diff against the previous page.
