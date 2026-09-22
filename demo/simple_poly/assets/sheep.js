/* sheep.js — a woolly box on four short legs */

const SHEEP = {
  count: 16, speed: 1.3, gait: 6.5, rest: [0.6, 2.8],

  faces(e) {
    const f = [], s = e.size, r = e.facing;
    const swing = Math.sin(e.phase) * e.moving;
    const bob = Math.abs(Math.cos(e.phase)) * 0.012 * e.moving;

    const LEG = 0.14 * s, LX = 0.12 * s, LY = 0.08 * s;
    for (let i = 0; i < 4; i++) {
      const ph = (i === 0 || i === 3) ? 1 : -1;
      const [px, py] = off(r, (i < 2 ? LX : -LX) + ph * swing * 0.02 * s, i % 2 ? LY : -LY);
      box(f, px, py, 0, 0.024 * s, 0.024 * s, LEG, r, CIDX.dark);
    }

    /* the body is a BOX. A blob has its widest point at mid-height and tapers
       to a point above and below it, which from this camera reads as a kite on
       four sticks rather than as an animal. */
    box(f, 0, 0, LEG + bob, 0.20 * s, 0.13 * s, 0.22 * s, r, CIDX.sheep);

    /* The head fills the FRONT of the body rather than perching on top of it:
       sunk down so its foot is level with the body's, and no taller than the
       body, so the two read as one animal with a dark face. Two ears out to
       the sides are what finish the silhouette. */
    const [hx, hy] = off(r, 0.19 * s, 0);
    box(f, hx, hy, LEG - 0.01 * s + bob, 0.07 * s, 0.075 * s, 0.24 * s, r, CIDX.dark);
    [-1, 1].forEach(side => {
      const [ex, ey] = off(r, 0.17 * s, side * 0.13 * s);
      box(f, ex, ey, LEG + 0.15 * s + bob, 0.045 * s, 0.045 * s, 0.05 * s, r, CIDX.sheep);
    });
    return f;
  }
};
