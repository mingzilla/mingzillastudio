/* building__lighthouse.js — striped tower, coast only */

defEntity({
  key: "lighthouse", group: "building", label: "Lighthouse",
  spawn: {
    mode: "scatter", biomes: [BIOME.SAND], density: 0.02, min: 2, max: 3,
    gap: 14,
    where: t => t.nb.some(n => n && n.biome === BIOME.WATER)
  },
  create({ t, h }) {
    const s = h.rr(0.95, 1.15), rot = h.rnd() * 6.28;
    const f = [], C = h.CIDX;

    h.prism(f, 0, 0, 0.00 * s, 0.26 * s, 0.19 * s, 8, rot, C.churchWall);
    h.prism(f, 0, 0, 0.26 * s, 0.56 * s, 0.155 * s, 8, rot, C.churchWall);
    h.prism(f, 0, 0, 0.56 * s, 0.63 * s, 0.185 * s, 8, rot, C.trim);
    h.prism(f, 0, 0, 0.63 * s, 0.79 * s, 0.135 * s, 8, rot, C.lamp);
    h.prism(f, 0, 0, 0.79 * s, 0.85 * s, 0.18 * s, 8, rot, C.trim);
    h.cone(f, 0, 0, 0.85 * s, 0.18 * s, 0.20 * s, 8, rot, C.roofB);

    return { s, rot, faces: f };
  }
});
