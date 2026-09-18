/* nature__flowerbush.js — a mound with flowers on it
   =========================================================================
   The plain bush with a handful of small bright blobs scattered over the top.
   Four-sided blobs, so each flower is a hard little facet rather than a dome —
   at the size they are drawn, a rounded one just fuzzes into the leaves.

   The three flower colours are picked in rotation rather than at random, which
   keeps any one bush from coming out all yellow. */

defEntity({
  key: "flowerbush", group: "nature", label: "Flowering bush",
  spawn: [
    { mode: "perTile", biomes: [BIOME.GRASS], chance: 0.03 },
    { mode: "perTile", biomes: [BIOME.FOREST], chance: 0.02 }
  ],
  create({ t, h }) {
    const spot = h.tileSpot(t, 0.6);
    if (!h.dryLand(spot.owner)) return null;
    const s = h.rr(0.6, 1.0);
    const f = [];
    h.blob(f, 0, 0, 0.18 * s, 0.25 * s, 0.26 * s, 5, h.rnd() * 6, h.CIDX.leafC);
    const n = 4 + Math.floor(h.rnd() * 4);
    const FLOWER = [h.CIDX.flowerA, h.CIDX.flowerB, h.CIDX.flowerC];
    for (let i = 0; i < n; i++) {
      const a = h.rnd() * Math.PI * 2;
      const rad = h.rr(0.04, 0.19) * s;
      h.blob(f, Math.cos(a) * rad, Math.sin(a) * rad, h.rr(0.27, 0.39) * s,
        0.055 * s, 0.055 * s, 4, h.rnd() * 6, FLOWER[i % 3]);
    }
    return { x: spot.x, y: spot.y, z: spot.owner.rz, owner: spot.owner, s, faces: f };
  }
});
