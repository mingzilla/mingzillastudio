/* =========================================================================
   core__registry.js — the entity catalogue
   =========================================================================
   Every entity in the valley is declared by one file in this folder, which
   registers itself here. Nothing about what exists is hard-coded in the
   renderer.

   File naming says what things are:

       animal__sheep.js        creature that walks about
       building__church.js     structure that stands still
       nature__tree.js         tree, bush, rock
       vehicle__boat.js        something that moves on water
       core__*.js              shared plumbing, not an entity

   A definition looks like this:

       defEntity({
         key:   "sheep",                 // what other code calls it
         group: "animal",                // animal | building | nature | vehicle
         spawn: { mode: "scatter", biomes: [BIOME.GRASS], density: 0.075,
                  min: 14, max: 46 },
         create({ t, h }) {              // build geometry, return the entity
           const f = [];
           h.blob(f, 0, 0, 0.2, 0.2, 0.25, 6, 0, h.CIDX.sheep);
           return { faces: f, s: 1 };
         },
         anim(e, dt, h) { ... }          // optional, each frame while near
       });

   Spawn rules come in two shapes:

     perTile  — rolled for every tile in `biomes`. `chance` and `count` may be
                numbers or functions of the tile.
     scatter  — the matching tiles are pooled, shuffled, and `min`..`max` of
                them get one entity each.

   An optional `where(tile)` filters candidates for either mode.

   `create` may return null to decline (the tile turned out to be water, say).
   ========================================================================= */

const DEFS = [];
const DEF_BY_KEY = {};

function defEntity(def) {
  if (!def.key) throw new Error("defEntity needs a key");
  if (DEF_BY_KEY[def.key]) throw new Error("duplicate entity key: " + def.key);
  DEFS.push(def);
  DEF_BY_KEY[def.key] = def;
}

/* Pick a jittered spot inside a tile and report which tile it really landed
   on, since the jitter can push it over an edge. */
function tileSpot(t, spread) {
  const ang = rr(0, Math.PI * 2);
  const rad = spread * Math.sqrt(rnd());
  const x = t.cx + Math.cos(ang) * rad, y = t.cy + Math.sin(ang) * rad;
  const w = worldToAxial(x, y);
  return { x, y, owner: tiles.get(key(w.q, w.r)) || t };
}

/* The tile under a world point, or null if it's off the map. */
function tileAtWorld(x, y) {
  const w = worldToAxial(x, y);
  return tiles.get(key(w.q, w.r)) || null;
}

/* Everything an entity definition is allowed to use, handed over as `h` so the
   asset files never reach for globals directly.

   index.html adds a few more once it has defined them: STEP, PLAIN, SEA and
   BASE_Z, which the terrain-scouting `where` rules need. */
const H = {
  prism, cone, blob, box, slab, gableRoof, off, push, faceNormal,
  CIDX, COLORS,
  BIOME, walkable, dryLand,
  tileSpot, tileAtWorld,
  quadrupedFaces, wander, initWalker,
  SQ3, hexCenter, DIRS, EDGE_TO_DIR, CORNER,
  /* these read the live stream, so they stay correct across world rebuilds */
  rnd: () => rng(),
  rr: (a, b) => a + (b - a) * rng(),
  ri: (a, b) => Math.floor(a + (b - a + 1) * rng()),
  hash2,
  /** ground height at a world point, for things that sit on the terrain */
  groundAt: (x, y) => {
    const w = worldToAxial(x, y);
    const t = tiles.get(key(w.q, w.r));
    return t ? t.rz : 0;
  }
};

function spawnEntity(keyName, t) {
  const def = DEF_BY_KEY[keyName];
  if (!def) throw new Error("unknown entity: " + keyName);
  const part = def.create({ t, h: H });
  if (!part) return null;
  const e = Object.assign({
    key: keyName, def, group: def.group,
    x: t.cx, y: t.cy, z: t.rz, owner: t,
    s: 1, rot: 0, faces: [], dyn: null, sizeMul: def.sizeMul || 1,
    mobile: !!def.mobile, flying: !!def.flying, birth: -1
  }, part);
  if (def.init) def.init(e, H);
  entities.push(e);
  return e;
}
