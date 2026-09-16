/* =========================================================================
   nature__tree.js — pine | leaf | autumn
   =========================================================================
   Three keys, one shape builder. Which grows where is driven by the tile's
   `season` value, a slow noise field baked at world-gen time, so whole regions
   turn over to autumn at once instead of speckling.

   The canopy is a CLUSTER of rounded lobes rather than a single solid. That is
   what gives the illustrated look: overlapping domes read as a leafy mass,
   where one cone reads as a geometric solid. The lobes are picked once at
   create time and stored on the entity, so a tree is random but stable.

   Colour runs dark at the skirt, mid in the body, light on the crown — the
   light direction would do some of that on its own, but stacking it deliberately
   makes the clumps readable from directly above, which is how you mostly see them.
   ========================================================================= */

const AUTUMN_ABOVE = 0.66;

const TREE_TONE = {
  pine:   { skirt: "pineC", body: "pineA", crown: "pineB" },
  leaf:   { skirt: "leafC", body: "leafA", crown: "leafB" },
  autumn: { skirt: "autumnB", body: "autumnA", crown: "autumnC" }
};

/* Lobes are [dx, dy, dz, radius, height, extraRot, which] where `which` picks
   skirt / body / crown. */
function makeCanopy(kind, r) {
  const lobes = [];
  if (kind === "pine") {
    // a rounded conifer: stacked domes tapering upward
    for (let i = 0; i < 3; i++) {
      const t = i / 2;
      lobes.push([0, 0, 0.30 + t * 0.34, 0.28 - t * 0.105, 0.32 - t * 0.085, r * i, i === 2 ? "crown" : "body"]);
    }
  } else {
    lobes.push([0, 0, 0.52, 0.29, 0.33, r, "body"]);
    const n = 2 + (r < 0.5 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const a = r * 6.28 + i * 6.28 / n;
      lobes.push([Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0.42, 0.19, 0.24, a, "skirt"]);
    }
    lobes.push([0, 0, 0.70, 0.16, 0.19, r * 2, "crown"]);
  }
  return lobes;
}

function treeFaces(e, kind, h) {
  const f = [], g = [];
  const s = e.s, r = e.rot, C = h.CIDX, tone = TREE_TONE[kind];

  h.prism(f, 0, 0, 0, 0.24 * s, 0.055 * s, 4, r, C.trunk);

  for (const L of e.canopy) {
    h.blob(f, L[0] * s, L[1] * s, L[2] * s, L[3] * s, L[4] * s, 6, r + L[5], C[tone[L[6]]]);
  }

  /* Far-distance version. One lobe, but a big one in the body colour with a
     rounded six-sided profile — a small dark five-sided blob reads as a flat
     diamond from above, which is exactly how you see most of a forest. */
  h.blob(g, 0, 0, 0.54 * s, 0.34 * s, 0.72 * s, 6, r, C[tone.body]);
  h.blob(g, 0, 0, 0.74 * s, 0.22 * s, 0.30 * s, 6, r + 0.4, C[tone.crown]);

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
        s: h.rr(0.78, 1.24), rot: h.rnd() * Math.PI * 2
      };
      e.canopy = makeCanopy(key, h.rnd());
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
