/* =========================================================================
   props.js — the scenery, which is everything he is not allowed to eat
   =========================================================================
   All three are one shape plus a couple of lumps. They exist to give the
   field some depth cues; nothing here moves and nothing here can be eaten.
   ========================================================================= */

function pineFaces(seed) {
  const f = [], rnd = mulberry(seed);
  box(f, 0, 0, 0, 0.10, 0.10, 0.52, rnd() * TAU, CIDX.trunk);
  blob(f, 0, 0, 0.78, 0.40, 0.70, 6, CIDX.pine2);
  blob(f, 0, 0, 1.16, 0.30, 0.54, 6, CIDX.pine);
  blob(f, 0, 0, 1.46, 0.19, 0.36, 6, CIDX.pine2);
  return f;
}

function bushFaces(seed) {
  const f = [], rnd = mulberry(seed);
  for (let i = 0; i < 3; i++) {
    const a = i * 2.1 + rnd(), d = i ? 0.22 + rnd() * 0.12 : 0;
    blob(f, Math.cos(a) * d, Math.sin(a) * d, 0.20 + rnd() * 0.06,
      0.30 + rnd() * 0.08, 0.44, 6, i === 1 ? CIDX.bush2 : CIDX.bush);
  }
  return f;
}

function rockFaces(seed) {
  const f = [], rnd = mulberry(seed);
  box(f, 0, 0, 0, 0.34, 0.28, 0.30, rnd() * TAU, CIDX.rock2);
  box(f, 0.06, 0.04, 0.26, 0.24, 0.20, 0.22, rnd() * TAU, CIDX.rock);
  blob(f, -0.04, 0, 0.44, 0.18, 0.24, 5, CIDX.rock);
  return f;
}
