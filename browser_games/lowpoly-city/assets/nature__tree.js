/* =========================================================================
   nature__tree.js — pine | leaf | autumn
   =========================================================================
   Three keys, one shape builder. Which one grows where is driven by the
   tile's `season` value, a slow noise field baked at world-gen time, so whole
   regions of the valley turn over to autumn at once instead of speckling.

   `simple` is the far-distance version. The renderer swaps to it once a tree
   is past the LOD radius, which buys back most of the frame budget.
   ========================================================================= */

const AUTUMN_ABOVE = 0.66;

function treeFaces(e, kind, h) {
  const f = [], g = [];
  const s = e.s, r = e.rot, C = h.CIDX;

  h.prism(f, 0, 0, 0, 0.30 * s, 0.072 * s, 5, r, C.trunk);

  if (kind === "pine") {
    const c = [C.pineA, C.pineB, C.pineC][e.tone];
    h.cone(f, 0, 0, 0.14 * s, 0.35 * s, 0.72 * s, 6, r, c);
    h.cone(f, 0, 0, 0.58 * s, 0.24 * s, 0.62 * s, 6, r + 0.5, c);
    h.cone(g, 0, 0, 0.18 * s, 0.34 * s, 1.02 * s, 5, r, c);
  } else {
    const pal = kind === "autumn"
      ? [C.autumnA, C.autumnB, C.autumnC]
      : [C.leafA, C.leafB, C.leafC];
    const c = pal[e.tone];
    h.blob(f, 0, 0, 0.72 * s, 0.40 * s, 0.64 * s, 6, r + 0.3, c);
    h.blob(g, 0, 0, 0.74 * s, 0.38 * s, 0.58 * s, 5, r, c);
  }
  e.faces = f;
  e.simple = g;
}

function defTree(key, label, forestChance, grassChance) {
  defEntity({
    key, group: "nature", label,
    spawn: [
      { mode: "perTile", biomes: [BIOME.FOREST], chance: forestChance, count: [1, 2] },
      { mode: "perTile", biomes: [BIOME.GRASS],  chance: grassChance,  count: [1, 1] }
    ],
    create({ t, h }) {
      const spot = h.tileSpot(t, 0.62);
      if (!h.dryLand(spot.owner)) return null;
      const e = {
        x: spot.x, y: spot.y, z: spot.owner.rz, owner: spot.owner,
        s: h.rr(0.72, 1.18), rot: h.rnd() * Math.PI * 2,
        tone: Math.floor(h.rnd() * 3)
      };
      treeFaces(e, key, h);
      return e;
    }
  });
}

const autumnNow = t => t.season > AUTUMN_ABOVE;

defTree("pine", "Pine",
  t => autumnNow(t) ? 0.06 : 0.20,
  t => autumnNow(t) ? 0.00 : 0.04);

defTree("leaf", "Broadleaf",
  t => autumnNow(t) ? 0.06 : 0.16,
  () => 0.02);

defTree("autumn", "Autumn tree",
  t => autumnNow(t) ? 0.30 : 0.03,
  () => 0.00);
