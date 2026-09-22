/* =========================================================================
   building__watchtower.js — a tall shaft with a parapet
   =========================================================================
   Taller and thinner than the keep, and it is the height that is the point:
   from the hill it is the highest thing in the valley, so it reads as a
   landmark from anywhere on the map.

   The crenellations are six separate boxes round the rim rather than one ring,
   because a ring drawn as a prism would give a smooth circular top and lose the
   notched silhouette — which at this size is the only thing telling you it is a
   watchtower and not a chimney.
   ========================================================================= */

defEntity({
  key: "watchtower", group: "building", label: "Watchtower",
  sizeMul: 2,
  spawn: {
    mode: "scatter", biomes: [BIOME.GRASS], density: 0.006, min: 1, max: 2,
    gap: 15,
    where: (t, h) => t.h >= h.PLAIN + h.STEP * 2
  },
  create({ t, h }) {
    const s = h.rr(0.95, 1.15);
    const rot = h.rnd() * 6.28;
    const f = [], C = h.CIDX;
    const top = 0.92 * s;

    /* tapers very slightly: dead straight reads as a pipe */
    h.prism(f, 0, 0, 0, top, 0.155 * s, 6, rot, C.stone);
    h.prism(f, 0, 0, top, top + 0.09 * s, 0.205 * s, 6, rot, C.rockDark);

    for (let i = 0; i < 6; i++) {
      const a = rot + i * Math.PI / 3;
      h.box(f, Math.cos(a) * 0.175 * s, Math.sin(a) * 0.175 * s,
        top + 0.09 * s, 0.05 * s, 0.05 * s, 0.075 * s, rot, C.stone);
    }

    /* a slit window halfway up, on two opposite faces */
    for (const side of [-1, 1]) {
      const [wx, wy] = h.off(rot, 0, side * 0.152 * s);
      h.box(f, wx, wy, top * 0.55, 0.022 * s, 0.012, 0.055 * s, rot, C.window);
    }

    return { s, rot, faces: f };
  }
});
