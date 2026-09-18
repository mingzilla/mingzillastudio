/* nature__dead.js — a bare snag
   =========================================================================
   No canopy at all: the trunk and five branches, all in the same dead wood
   colour, so it paints as one flat silhouette. Its whole job is to be the one
   thing in the valley that is not green.

   The branches are the same thin ellipses the palm uses for fronds, aimed
   upward instead of outward. Rare on purpose — a few of these read as weather,
   a field of them reads as blight. */

CANOPY.dead = function (r) {
  const lobes = [];
  const n = 5;
  for (let i = 0; i < n; i++) {
    /* 30 to 150 degrees: all above the horizontal, none drooping. Thin is the
       point of a dead tree, but too thin and the branches vanish at 1px. */
    const a = Math.PI / 180 * (30 + (i / (n - 1)) * 120) + r * 0.4;
    const len = 0.17 + (i === 2 ? 0.05 : 0);
    const z = 0.30 + (i % 2) * 0.16;
    lobes.push([Math.cos(a) * len, 0, z + Math.sin(a) * len, len, 0.05, a, "body", "e"]);
  }
  /* a broken leader, straight up off the top */
  lobes.push([0, 0, 0.66, 0.07, 0.16, 0, "crown", "e"]);
  return lobes;
};

defTree("dead", "Dead tree",
  0, 0,
  {
    tone: { skirt: "deadWood", body: "deadWood", crown: "deadWood" },
    bark: "deadBark",
    trunkH: 0.44,
    spawn: [
      { mode: "perTile", biomes: [BIOME.GRASS], chance: 0.012 },
      { mode: "perTile", biomes: [BIOME.FIELD], chance: 0.010 }
    ]
  });
