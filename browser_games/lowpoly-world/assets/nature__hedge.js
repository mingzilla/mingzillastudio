/* nature__hedge.js — clipped, and obviously so
   =========================================================================
   Two boxes and a lighter cap. Everything else growing in the valley is made
   of blobs and cones, so a straight-edged green cuboid reads immediately as
   something somebody planted on purpose, which is the whole point of it.
   Kept rare: it is the only greenery with a straight line in it. */

defEntity({
  key: "hedge", group: "nature", label: "Hedge",
  spawn: [{ mode: "perTile", biomes: [BIOME.GRASS], chance: 0.018 }],
  create({ t, h }) {
    const spot = h.tileSpot(t, 0.6);
    if (!h.dryLand(spot.owner)) return null;
    const s = h.rr(0.7, 1.05);
    const rot = h.rr(-0.3, 0.3);          // roughly square to the tile, not exactly
    const f = [];
    h.box(f, 0, 0, 0, 0.34 * s, 0.15 * s, 0.26 * s, rot, h.CIDX.hedgeA);
    h.box(f, 0, 0, 0.26 * s, 0.30 * s, 0.13 * s, 0.07 * s, rot, h.CIDX.hedgeB);
    return { x: spot.x, y: spot.y, z: spot.owner.rz, owner: spot.owner, s, faces: f };
  }
});
