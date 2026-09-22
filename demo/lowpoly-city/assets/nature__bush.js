/* nature__bush.js — low scrub, fills the gaps between trees */

defEntity({
  key: "bush", group: "nature", label: "Bush",
  spawn: [
    { mode: "perTile", biomes: [BIOME.FOREST], chance: 0.06 },
    { mode: "perTile", biomes: [BIOME.GRASS], chance: 0.05 },
    { mode: "perTile", biomes: [BIOME.SAND], chance: 0.04 }
  ],
  create({ t, h }) {
    const spot = h.tileSpot(t, 0.6);
    if (!h.dryLand(spot.owner)) return null;
    const s = h.rr(0.6, 1.1);
    const f = [];
    h.blob(f, 0, 0, 0.20 * s, 0.26 * s, 0.30 * s, 5, h.rnd() * 6,
      h.rnd() < 0.5 ? h.CIDX.leafB : h.CIDX.leafC);
    return { x: spot.x, y: spot.y, z: spot.owner.rz, owner: spot.owner, s, faces: f };
  }
});
