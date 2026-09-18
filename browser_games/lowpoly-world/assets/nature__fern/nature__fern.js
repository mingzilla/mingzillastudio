/* nature__fern.js — a rosette of fronds
   =========================================================================
   Fronds are `slab` quads: four points each, tapering from a wide base to a
   narrow tip that lifts off the ground. A slab is flat and double-sided, so it
   shows from any camera angle without needing thickness — the same trick the
   windmill sails use.

   Nothing here is a blob, which is what separates it from the other four
   bushes at a glance: a fern is all edges and gaps. */

defEntity({
  key: "fern", group: "nature", label: "Fern",
  spawn: [
    { mode: "perTile", biomes: [BIOME.FOREST], chance: 0.06 },
    { mode: "perTile", biomes: [BIOME.GRASS], chance: 0.02 }
  ],
  create({ t, h }) {
    const spot = h.tileSpot(t, 0.6);
    if (!h.dryLand(spot.owner)) return null;
    const s = h.rr(0.5, 0.85);
    const f = [];
    const n = 6;
    const spin = h.rnd() * Math.PI * 2;
    for (let i = 0; i < n; i++) {
      const a = spin + (i / n) * Math.PI * 2;
      const bx = Math.cos(a), by = Math.sin(a);
      const px = -by, py = bx;                       // across the frond
      const len = h.rr(0.20, 0.30) * s;
      const tipZ = h.rr(0.17, 0.27) * s;
      const w = 0.05 * s;
      h.slab(f,
        [bx * 0.03 - px * w, by * 0.03 - py * w, 0.02],
        [bx * len - px * w * 0.35, by * len - py * w * 0.35, tipZ],
        [bx * len + px * w * 0.35, by * len + py * w * 0.35, tipZ],
        [bx * 0.03 + px * w, by * 0.03 + py * w, 0.02],
        i % 2 ? h.CIDX.leafC : h.CIDX.leafA);
    }
    return { x: spot.x, y: spot.y, z: spot.owner.rz, owner: spot.owner, s, faces: f };
  }
});
