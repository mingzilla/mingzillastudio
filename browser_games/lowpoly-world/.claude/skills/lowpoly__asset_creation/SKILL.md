---
name: lowpoly__asset_creation
description: The three files of one asset - the ASCII sketch, the size json, the generated entity - and the page that edits them. Use when creating, resizing or regenerating an asset for lowpoly-world.
---

## An asset is a folder

- `assets/<id>/`, named by the id that `index.html` loads it under:
    - `<id>.md` — the ASCII sketch. nothing else
    - `<id>.json` — the layer and the size in units
    - `<id>.js` — the entity, generated from the two above
- drafts are the same with a suffix: `<id>__1.md`, `<id>__2.md`, `<id>__3.md`
- `assets/` beside the folders holds only the shared plumbing, `core__*.js` and `game__*.js`

## The sketch

- the ASCII is a ROUGH SHAPE. it is how a person says what they mean, never pixel-perfect
- it fixes which parts there are and how they stack. it says nothing about depth
- `+` corner, `-` horizontal edge, `|` vertical edge, `/` `\` slant (roofs), `.` a filled face, space empty
- read it as one elevation and invent the depth. the character came from nine characters of this

## The flow

1. ask for three options — write three draft files
2. in the page: `reload draft`, then `1` / `2` / `3` to copy one into the canvas
3. edit the canvas, `save` — writes `<id>.md`
4. generate `<id>.js` from the sketch and the size json
5. in the page: `reload asset`

## The size json

- `layer` is `outdoor`, `indoor` or `both`. roads are `outdoor` only
- `w` `h` `d` are the size in that layer's units. `w`=x, `h`=z, `d`=y
- the numbers are the truth and the geometry is built to match them, not the other way round
- the layer's unit is a layout unit, not a measurement. one unit is whatever makes the city lay out neatly
- outdoor sizes are compressed on purpose: a stadium is about 8x a home, and that is correct here
- a window does not scale with its building. only the footprint grows

## The page — `asset-creator.html`

- canvas on the left, preview on the right, every asset in the game listed underneath
- `1` `2` `3` copy a draft into the canvas. `reload draft` re-reads them from disk
- `save` writes the sketch, `save size` writes the json
- `L` / `R` turn the preview, `-` / `+` zoom it
- `reload asset` re-reads the js, so a regenerated entity shows without a page reload
- the preview draws the asset against a one-unit grid, and the red box is the declared size. when the asset does not fill its box, the sketch and the json disagree
- `connect folder` once per page load, or `save` downloads the file instead
