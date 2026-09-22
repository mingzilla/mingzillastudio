/* =========================================================================
   cookie.js — the two things on the ground you can put in your mouth
   =========================================================================
   Both are built the same way: a shape that reads from above, because the
   camera looks down at them, and a seeded scatter on top so no two are
   identical without any of them costing anything to make.
   ========================================================================= */

const COOKIE_R = 0.34;

function cookieFaces(seed) {
  const f = [], rnd = mulberry(seed);
  disc(f, 0, 0, 0, COOKIE_R, 0.12, 8, rnd() * 0.8, CIDX.cookie);
  for (let i = 0; i < 5; i++) {
    const a = rnd() * TAU, d = Math.sqrt(rnd()) * COOKIE_R * 0.60;
    blob(f, Math.cos(a) * d, Math.sin(a) * d, 0.12, 0.05 + rnd() * 0.03, 0.07, 5, CIDX.chip);
  }
  return f;
}

function broccoliFaces(seed) {
  const f = [], rnd = mulberry(seed);
  box(f, 0, 0, 0, 0.075, 0.075, 0.32, rnd(), CIDX.stalk);
  /* every head has to sink into the stalk, or the bottom of the blob floats
     above the top of it and the broccoli hovers */
  for (let i = 0; i < 4; i++) {
    const a = rnd() * TAU, d = 0.11 + rnd() * 0.07;
    blob(f, Math.cos(a) * d, Math.sin(a) * d, 0.30, 0.17 + rnd() * 0.04, 0.28, 6,
      (i & 1) ? CIDX.broc : CIDX.broc2);
  }
  blob(f, 0, 0, 0.38, 0.20, 0.32, 6, CIDX.broc);
  return f;
}
