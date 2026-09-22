/* nature__shrub.js — low spreading scrub
   =========================================================================
   A row of small lobes rather than one big one, so it reads as wide and flat
   where the plain bush reads as a lump. It is the only undergrowth that grows
   sideways, which is what makes the ground look covered rather than dotted. */

defEntity({
  key: "shrub", group: "nature", label: "Shrub",
  spawn: [
    { mode: "perTile", biomes: [BIOME.FOREST], chance: 0.05 },
    { mode: "perTile", biomes: [BIOME.GRASS], chance: 0.04 },
    { mode: "perTile", biomes: [BIOME.FIELD], chance: 0.03 }
  ],
  create({ t, h }) {
    const spot = h.tileSpot(t, 0.6);
    if (!h.dryLand(spot.owner)) return null;
    const s = h.rr(0.55, 0.95);
    const n = 3 + Math.floor(h.rnd() * 3);
    const f = [];
    for (let i = 0; i < n; i++) {
      const u = n === 1 ? 0 : (i / (n - 1)) * 2 - 1;
      h.blob(f, u * 0.22 * s, h.rr(-0.06, 0.06) * s,
        (0.12 + (1 - Math.abs(u)) * 0.05) * s, 0.17 * s, 0.15 * s, 5,
        h.rnd() * 6, i % 2 ? h.CIDX.leafB : h.CIDX.leafC);
    }
    return { x: spot.x, y: spot.y, z: spot.owner.rz, owner: spot.owner, s, faces: f };
  }
});
