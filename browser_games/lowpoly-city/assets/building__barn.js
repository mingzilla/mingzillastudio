/* building__barn.js — long low farm building with big doors */

defEntity({
  key: "barn", group: "building", label: "Barn",
  sizeMul: 2,          // twice the size of everything else
  spawn: {
    mode: "scatter", biomes: [BIOME.GRASS, BIOME.FIELD],
    density: 0.012, min: 2, max: 5, gap: 7,
    where: (t, h) => t.h <= h.PLAIN + h.STEP
  },
  create({ t, h }) {
    const s = h.rr(0.95, 1.15);
    const rot = Math.round(h.rnd() * 4) * Math.PI / 2;
    const f = [], C = h.CIDX;

    h.box(f, 0, 0, 0, 0.36 * s, 0.22 * s, 0.26 * s, rot, C.barnWall);
    h.gableRoof(f, 0, 0, 0.26 * s, 0.37 * s, 0.23 * s, 0.24 * s, rot, C.barnRoof);

    const [dx, dy] = h.off(rot, 0, 0.225 * s);
    h.box(f, dx, dy, 0, 0.11 * s, 0.02 * s, 0.17 * s, rot, C.timber);

    return { s, rot, faces: f };
  }
});
