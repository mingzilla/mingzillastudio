/* building__keep.js — round stone tower with a conical roof. Hilltop only. */

defEntity({
  key: "keep", group: "building", label: "Keep",
  sizeMul: 2,          // twice the size of everything else
  spawn: {
    mode: "scatter", biomes: [BIOME.GRASS], density: 0.008, min: 1, max: 3,
    gap: 12,
    where: (t, h) => t.h >= h.PLAIN + h.STEP * 2
  },
  create({ t, h }) {
    const s = h.rr(0.95, 1.25), rot = h.rnd() * 6.28;
    const f = [], C = h.CIDX;

    h.prism(f, 0, 0, 0, 0.62 * s, 0.21 * s, 6, rot, C.stone);
    h.prism(f, 0, 0, 0.42 * s, 0.47 * s, 0.235 * s, 6, rot, C.rockDark);
    h.cone(f, 0, 0, 0.62 * s, 0.24 * s, 0.30 * s, 6, rot, C.roofC);

    return { s, rot, faces: f };
  }
});
