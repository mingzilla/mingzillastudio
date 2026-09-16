/* building__church.js — nave, tower, spire. Wants the high ground. */

defEntity({
  key: "church", group: "building", label: "Church",
  sizeMul: 2,          // twice the size of everything else
  spawn: {
    mode: "scatter", biomes: [BIOME.GRASS], density: 0.01, min: 1, max: 2,
    gap: 9,
    where: (t, h) => t.h >= h.PLAIN + h.STEP * 2
  },
  create({ t, h }) {
    const s = h.rr(1.0, 1.2);
    const rot = Math.round(h.rnd() * 4) * Math.PI / 2;
    const f = [], C = h.CIDX;

    h.box(f, 0, 0, 0, 0.34 * s, 0.20 * s, 0.26 * s, rot, C.churchWall);
    h.gableRoof(f, 0, 0, 0.26 * s, 0.35 * s, 0.21 * s, 0.22 * s, rot, C.churchRoof);

    const [tx, ty] = h.off(rot, 0.38 * s, 0);
    h.box(f, tx, ty, 0, 0.12 * s, 0.12 * s, 0.64 * s, rot, C.churchWall);
    h.cone(f, tx, ty, 0.64 * s, 0.14 * s, 0.36 * s, 4, rot + Math.PI / 4, C.churchRoof);
    h.box(f, tx, ty, 1.00 * s, 0.011 * s, 0.011 * s, 0.09 * s, rot, C.gold);
    h.box(f, tx, ty, 1.05 * s, 0.033 * s, 0.009 * s, 0.011 * s, rot, C.gold);

    return { s, rot, faces: f };
  }
});
