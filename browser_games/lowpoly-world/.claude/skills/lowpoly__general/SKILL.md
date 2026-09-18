---
name: lowpoly__general
description: Decisions for building a low-poly Dorfromantik-style browser game
---

## Structure

- one folder is the root, opened from `index.html`
- d3 from a CDN. no build step, no other dependencies
- no image files and no image-generation model — every shape is built from generated geometry or drawn paths
- one file per entity in `assets/`, named by group: `animal__cat.js`, `building__church.js`, `nature__tree.js`, `vehicle__boat.js`, `core__*.js` for shared plumbing
- plain `<script>` tags, not ES modules, so it still opens from `file://`
- every entity — characters, animals, buildings, trees — is low-poly geometry built from a handful of primitives (prism, cone, blob, box, gable roof)
- each asset registers itself: `defEntity({ key, group, spawn, create, anim })`

## Look

- Dorfromantik: flat-shaded low-poly, warm earthy palette, no gradients on geometry
- light fixed in VIEW space so shading holds as the camera turns
- ink outline around every entity: all faces pushed a couple of px outward and filled once — one clean silhouette, not a wireframe

## Camera and movement

- `PITCH` is camera elevation. LOW is flat, which foreshortens the ground and shows far more of the area
- flattening the pitch halves apparent up/down speed, so `DEPTH_SPEED` scales the toward/away axis of input. apply it BEFORE rotating into world space or normalisation cancels it
- `WALK_SPEED` / `RUN_SPEED` in world units per second
- WASD or arrows, camera-relative; Q/E turn the camera; Shift runs

## Trees

- 2D BILLBOARDS that always face the camera, not 3D solids
- the whole effect is that height is NOT multiplied by cos(PITCH)
- spread canopy lobes ALONG X, not in a ring. a ring collapses behind the middle lobe on a billboard and the tree becomes a lollipop

## Renderer

- batch faces by colour AND light band into one path per bucket — one fill per bucket
- backface-cull; every primitive is convex
- distance LOD, and scale every LOD and animation radius by `HEX_SIZE`. leave them fixed and a bigger world silently pushes the whole scene past the LOD
- entities sort just in front of their own tile. on flat ground that is enough on its own; the extra bias only earns its keep at cliff edges, where a higher tile nearer the camera would otherwise paint over what stands behind it
- mobile entities sort on their own depth, static ones on their tile
- if a character looks half-buried in the ground, suspect SCALE before sorting. a shrunken character samples the ground above its own head, which looks exactly like being painted over and sends you chasing depth order for nothing

## Behaviour

- store NOTHING in the browser — no localStorage, no cookies. refresh returns to the default
- put `autocomplete="off"` on inputs; browsers restore form values on reload and it looks like saved state
- seed in a text input, world rebuilt from it
- the UI should be hideable with one key

## Scale

- an asset declares one `layer`: `indoor`, `outdoor`, or both. roads are `outdoor` only
- `indoor size` = 0.1 m units. real, for rooms and furniture
- `outdoor size` = a count of `outdoor units`. a layout unit, not a measurement - realism is deliberately absent
- outdoor sizes are compressed: a stadium is ~8x a home, and that is correct here
- windows and doors do NOT scale with a building. only the footprint grows
- the asset creator asserts against the unit, so outdoor things snap and lay out neatly
- a building states both: its outdoor size, and its indoor size

## Terrain

- no hex, no tile. the land is one flat surface; a building or road sits on it at a point with a footprint
- a road is its own layer, laid as a network - not part of a building
- a building faces a road
- land is ONE FLAT LEVEL, not rolling noise - no cliff face to draw
- height comes from a single MESA: flat top, steep shoulder
- a river is a path across the land, not a set of edges; a bridge is a span over it
- indoor maps have no terrain - one flat floor