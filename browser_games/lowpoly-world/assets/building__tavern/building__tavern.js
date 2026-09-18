/* =========================================================================
   building__tavern.js — two storeys and a sign
   =========================================================================
   A house with a floor added and a lantern over the door. The band between the
   storeys is what stops it reading as a tall house: without it the extra height
   just looks like a mistake, and the windows have nowhere to sit.

   The sign hangs on a bracket off the gable end, deliberately the one piece of
   geometry on any building in the valley that sticks out into nothing. That
   silhouette is how you pick a tavern out of a village from above.
   ========================================================================= */

defEntity({
  key: "tavern", group: "building", label: "Tavern",
  sizeMul: 2,
  spawn: { kind: "village", biomes: [BIOME.GRASS] },
  create({ t, h }) {
    const s = h.rr(0.95, 1.15);
    const rot = Math.round(h.rnd() * 4) * Math.PI / 2;
    const f = [], C = h.CIDX;
    const hx = 0.29 * s, hy = 0.21 * s, floor = 0.26 * s, hh = floor * 2;
    const rh = 0.30 * s;

    h.box(f, 0, 0, 0, hx, hy, hh, rot, C.wallB);
    /* the string course, proud of the wall on every side */
    h.box(f, 0, 0, floor - 0.015 * s, hx * 1.04, hy * 1.04, 0.03 * s, rot, C.timber);
    h.gableRoof(f, 0, 0, hh, hx * 1.28, hy * 1.42, rh, rot, C.roofA);

    const [cx, cy] = h.off(rot, -hx * 0.44, 0);
    h.box(f, cx, cy, hh + rh * 0.40, 0.036 * s, 0.036 * s, 0.24 * s, rot, C.stone);

    /* two windows each floor on the long walls, plus one in each gable */
    [-1, 1].forEach(side => {
      for (const u of [-0.44, 0.44]) {
        for (const row of [0, 1]) {
          const [wx, wy] = h.off(rot, u * hx, side * hy * 1.03);
          h.box(f, wx, wy, (0.42 + row * 0.95) * floor, 0.045 * s, 0.012, 0.055 * s, rot, C.window);
        }
      }
      const [gx, gy] = h.off(rot, side * hx * 1.03, 0);
      h.box(f, gx, gy, floor + 0.05 * s, 0.012, 0.045 * s, 0.055 * s, rot, C.window);
    });

    const [dx, dy] = h.off(rot, hx * 1.03, 0);
    h.box(f, dx, dy, 0, 0.014, 0.055 * s, 0.16 * s, rot, C.door);

    /* bracket and sign, out over the street */
    const [bx, by] = h.off(rot, hx * 0.55, hy * 1.10);
    h.box(f, bx, by, floor * 0.86, 0.085 * s, 0.016 * s, 0.016 * s, rot, C.timber);
    const [sx, sy] = h.off(rot, hx * 0.80, hy * 1.10);
    h.box(f, sx, sy, floor * 0.86 - 0.075 * s, 0.055 * s, 0.012 * s, 0.06 * s, rot, C.gold);

    return { s, rot, faces: f };
  }
});
