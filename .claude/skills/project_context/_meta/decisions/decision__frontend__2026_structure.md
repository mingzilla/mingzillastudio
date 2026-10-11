## Structure

- [STRUCTURE] Light 3-tier (skill `unit__design__structure__3_tier__frontend`): `common/{util,components,widgets}` + `page__profile/{domains,components}` + `infra/`. No store, guard or service: nothing is shared or fetched at runtime.
- [LOAD] Classic scripts, no bundler. `node .claude/skills/unit__design__structure__3_tier__frontend/_meta/scripts/assemble/assemble_scripts.js --html 2026/index.html --root 2026` rewrites the `<script>` tags; run it when a js file is added. `2026/assemble.config.json` pins vendor order.
- [LOAD] Files share globals (`html`, `useState`, components, widgets). Domain classes reach components only at call time (`PageSections.all()`), because domains load first.
- [CSS] `css/<block>.css`, listed by hand in `index.html`. Tokens `--bg --ink --mute --gold --line`. `.band.light|dark` flips tokens; `.panel` inverts its band.
- [HTM] React attribute names (`className`, `markerEnd`); `style` is an object; write `<br />` with a space; literal `<` or `>` in text -> `${'<'}`.

## Where to edit

- [EDIT] Topic text -> `_meta/content/content.md` (then run build). Extras/links/demo -> `showcase.md`. Hero, About, stats, BI, Connect -> `profile.md`.
- [EDIT] A topic's widget -> `common/widgets/<name>.js`. Which widget a topic uses and its caption -> `page__profile/domains/topic_widgets.js`.
- [ADD] App -> add to `content.md` under Recent Apps, details in `showcase.md`, poster in `assets/`.
- [ADD] Chapter -> topics in `content.md`, one line in `page__profile/domains/page_sections.js`.
- [ADD] Widget -> `common/widgets/<name>.js` using `WidgetKit.scene`, one line in `registry.js`, one in `topic_widgets.js`.
- [HOME] Hero map bubbles -> `page__profile/domains/hero_map.js`.
