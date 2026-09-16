---
name: low-poly-village
description: Decisions for building a low-poly Dorfromantik-style browser game — hex tiles, d3 from a CDN, entities as asset files, flat-shaded 3D, 2D billboard trees, keyboard character. Use when creating or changing this kind of village/city game.
---

## Structure
- one folder is the root, opened from `index.html`
- d3 from a CDN. no build step, no other dependencies
- no image files and no image-generation model — every shape is built from generated geometry or drawn paths
- one file per entity in `assets/`, named by group: `animal__sheep.js`, `building__church.js`, `nature__tree.js`, `vehicle__boat.js`, `core__*.js` for shared plumbing
- plain `<script>` tags, not ES modules, so it still opens from `file://`
- every entity — characters, animals, buildings, trees — is low-poly geometry built from a handful of primitives (prism, cone, blob, box, gable roof)
- each asset registers itself: `defEntity({ key, group, spawn, create, anim })`
- keep the spawn rule in the asset file so placement sits next to the shape it places

## Look
- Dorfromantik: flat-shaded low-poly, warm earthy palette, no gradients on geometry
- 6 flat light bands per colour, precomputed; light fixed in VIEW space so shading holds as the camera turns
- ink outline around every entity: all faces pushed a couple of px outward and filled once — one clean silhouette, not a wireframe

## Scale — four independent controls
- `HEX_SIZE` = the land. one number rescales every tile
- `WORLD_SCALE` = everything standing on the land
- `sizeMul` in an entity file = that entity only, on top of WORLD_SCALE
- drawn size is `e.s × sizeMul × WORLD_SCALE`, and `sizeMul` is linear, so 2 is exactly twice
- keep people and animals smaller than buildings — that contrast is what reads as scale

## Terrain
- land is ONE FLAT LEVEL, not rolling noise. flat means neighbours share heights, so there is no cliff face to draw
- height comes from a single MESA — flat top, steep shoulder. not a smooth dome: a dome descends in even steps and leaves nothing for a waterfall to fall from
- river carved from the hill to the sea, surface just under the ground and never rising. level across the plain, stepping down over the shoulder
- the waterfall is not special-cased: a river face with a big drop gets painted foam

## Camera and movement
- `PITCH` is camera elevation. LOW is flat, which foreshortens the ground and shows far more of the valley
- flattening the pitch halves apparent up/down speed, so `DEPTH_SPEED` scales the toward/away axis of input. apply it BEFORE rotating into world space or normalisation cancels it
- `WALK_SPEED` / `RUN_SPEED` in world units per second
- WASD or arrows, camera-relative; Q/E turn the camera; Shift runs

## Trees
- 2D BILLBOARDS that always face the camera, not 3D solids
- reuse the canopy data, drawn as flat circles in screen space
- the whole effect is that height is NOT multiplied by cos(PITCH) — that is what makes it read as drawn-on
- spread canopy lobes ALONG X, not in a ring. a ring collapses behind the middle lobe on a billboard and the tree becomes a lollipop

## Renderer
- batch faces by colour AND light band into one path per bucket — one fill per bucket
- backface-cull; every primitive is convex
- distance LOD, and scale every LOD and animation radius by `HEX_SIZE`. leave them fixed and a bigger world silently pushes the whole scene past the LOD
- entities sort just in front of their own tile, biased by about a hex width, or the next tile paints over them
- mobile entities sort on their own depth, static ones on their tile

## Behaviour
- store NOTHING in the browser — no localStorage, no cookies. refresh returns to the default
- put `autocomplete="off"` on inputs; browsers restore form values on reload and it looks like saved state
- seed in a text input, world rebuilt from it
- the UI should be hideable with one key
