/* cow.js — the same body as the sheep, half again as big and slower, with a
   patch on its flank */

const COW = {
  count: 7, speed: 1.0, gait: 4.6, rest: [1.0, 4.0],

  faces(e) {
    const f = [], s = e.size * 1.35, r = e.facing;
    const swing = Math.sin(e.phase) * e.moving;
    const bob = Math.abs(Math.cos(e.phase)) * 0.012 * e.moving;

    const LEG = 0.18 * s, LX = 0.13 * s, LY = 0.09 * s;
    for (let i = 0; i < 4; i++) {
      const ph = (i === 0 || i === 3) ? 1 : -1;
      const [px, py] = off(r, (i < 2 ? LX : -LX) + ph * swing * 0.02 * s, i % 2 ? LY : -LY);
      box(f, px, py, 0, 0.028 * s, 0.028 * s, LEG, r, CIDX.dark);
    }

    box(f, 0, 0, LEG + bob, 0.24 * s, 0.15 * s, 0.25 * s, r, CIDX.cow);

    /* Two blotches, of different sizes and on opposite flanks. One square
       patch in the middle of a white box reads as a label stuck on it; a pair
       reads as markings. Each sits just proud of the side it covers. */
    const BLOTCH = [[-0.05, 0.14, 0.09, 0.14, 0.05], [0.10, -0.14, 0.05, 0.08, 0.14]];
    for (const [bx, by, hx2, hz, bz] of BLOTCH) {
      const [px, py] = off(r, bx * s, by * s);
      box(f, px, py, LEG + bz * s + bob, hx2 * s, 0.02 * s, hz * s, r, CIDX.dark);
    }

    /* head fills the front of the body, as on the sheep, but a dark muzzle is
       what puts a face on it — head and body are the same colour here, so
       without one the two read as a single white box */
    const [hx, hy] = off(r, 0.24 * s, 0);
    box(f, hx, hy, LEG - 0.01 * s + bob, 0.085 * s, 0.085 * s, 0.27 * s, r, CIDX.cow);
    const [mx, my] = off(r, 0.315 * s, 0);
    box(f, mx, my, LEG + 0.05 * s + bob, 0.012 * s, 0.055 * s, 0.11 * s, r, CIDX.dark);

    /* two short horns, out at the top corners of the head */
    [-1, 1].forEach(side => {
      const [ax, ay] = off(r, 0.24 * s, side * 0.07 * s);
      box(f, ax, ay, LEG + 0.26 * s + bob, 0.012 * s, 0.012 * s, 0.06 * s, r, CIDX.dark);
    });
    return f;
  }
};
