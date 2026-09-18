/* nature__rock.js — boulders. Dense on the hill, occasional on the flat. */

defEntity({
  key: "rock", group: "nature", label: "Rock",
  spawn: [
    { mode: "perTile", biomes: [BIOME.FIELD], chance: 0.03 },
    { mode: "perTile", biomes: [BIOME.GRASS], chance: 0.02 },
    { mode: "perTile", biomes: [BIOME.SAND],  chance: 0.05 }
  ],
  create({ t, h }) {
    const spot = h.tileSpot(t, 0.6);
    if (!h.dryLand(spot.owner)) return null;
    const s = h.rr(0.5, 1.0);
    const f = [];
    h.blob(f, 0, 0, 0.15 * s, 0.30 * s, 0.34 * s, 5, h.rnd() * 6, h.CIDX.rock);
    return { x: spot.x, y: spot.y, z: spot.owner.rz, owner: spot.owner, s, faces: f };
  }
});
