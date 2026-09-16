/* nature__palm.js — the only tree on the sand
   =========================================================================
   Fronds are ellipses, not circles. A circle at the top of a trunk is a
   lollipop; a frond has to be long and thin and turned so it points away from
   the crown, which is the one thing the circle-only renderer cannot do — hence
   the "e" shape code in nature__tree.js.

   Each frond sits half its own length out along its own angle, because the
   flat renderer draws a lobe about its CENTRE. Put them all at the crown and
   they pile up into a disc instead of radiating.

   The trunk leans, and by a random amount either way, so a stand of them on
   the same beach does not look like a row of identical umbrellas. */

CANOPY.palm = function (r) {
  const lobes = [];
  const n = 6;
  const crown = 0.60;
  for (let i = 0; i < n; i++) {
    /* 195 degrees round to -15: over the top, drooping at both ends. Six long
       fronds, not ten short ones — the crown of a palm is mostly gap. */
    const a = Math.PI / 180 * (195 - (i / (n - 1)) * 210) + r * 0.25;
    const up = Math.sin(a);
    const len = 0.20 + Math.abs(up) * 0.09;      // the upright fronds reach higher
    const which = up < -0.15 ? "skirt" : up > 0.45 ? "crown" : "body";
    lobes.push([Math.cos(a) * len, 0, crown + up * len, len, 0.05, a, which, "e"]);
  }
  return lobes;
};

defTree("palm", "Palm",
  0, 0,
  {
    tone: { skirt: "palmC", body: "palmA", crown: "palmB" },
    bark: "palmTrunk",
    trunkH: 0.66,
    lean: 0.13,
    /* sand, and only the sand that actually touches water */
    spawn: [{
      mode: "perTile", biomes: [BIOME.SAND], chance: 0.16,
      where: t => t.nb.some(n => n && n.biome === BIOME.WATER)
    }]
  });
