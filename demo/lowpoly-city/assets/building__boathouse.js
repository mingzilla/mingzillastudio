/* =========================================================================
   building__boathouse.js — timber shed on the sand
   =========================================================================
   Lower and wider than a house, planked rather than plastered, and facing the
   water: the door is a boat-width gap rather than a door, and a jetty runs out
   from it over the shallows.

   Only built where sand actually meets water, which is the same test the
   lighthouse uses, so the two end up neighbours on the same few beaches.
   ========================================================================= */

defEntity({
  key: "boathouse", group: "building", label: "Boathouse",
  sizeMul: 2,
  spawn: {
    mode: "scatter", biomes: [BIOME.SAND], density: 0.06, min: 1, max: 4, gap: 11,
    where: t => t.nb.some(n => n && n.biome === BIOME.WATER)
  },
  create({ t, h }) {
    const s = h.rr(0.85, 1.05);
    const rot = h.rnd() * Math.PI * 2;
    const f = [], C = h.CIDX;
    const hx = 0.25 * s, hy = 0.19 * s, hh = 0.20 * s;

    h.box(f, 0, 0, 0, hx, hy, hh, rot, C.plank);
    h.gableRoof(f, 0, 0, hh, hx * 1.26, hy * 1.42, 0.17 * s, rot, C.roofB);

    /* the boat door: a dark gap the full height of the wall */
    const [dx, dy] = h.off(rot, hx * 1.03, 0);
    h.box(f, dx, dy, 0, 0.012, 0.088 * s, hh * 0.82, rot, C.timber);

    /* jetty: a deck on posts running out from the door */
    const deckZ = 0.05 * s, out = 0.46 * s;
    for (const side of [-1, 1]) {
      const [ix, iy] = h.off(rot, hx * 1.02, side * 0.11 * s);
      const [ox, oy] = h.off(rot, hx * 1.02 + out, side * 0.11 * s);
      h.slab(f, [ix, iy, deckZ], [ox, oy, deckZ],
                [ox, oy, deckZ - 0.022 * s], [ix, iy, deckZ - 0.022 * s], C.plank);
      /* two posts, one at the near end and one at the far */
      for (const u of [0.12, 0.92]) {
        const [px, py] = h.off(rot, hx * 1.02 + out * u, side * 0.105 * s);
        h.box(f, px, py, 0, 0.018 * s, 0.018 * s, deckZ, rot, C.timber);
      }
    }

    return { s, rot, faces: f };
  }
});
