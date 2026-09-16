/* =========================================================================
   core__palette.js — every colour in the valley
   =========================================================================
   Faces don't store a colour, they store an INDEX into COLORS plus a normal.
   The colour actually painted comes from SHADES, a precomputed table of six
   flat light bands per colour. That makes shading a face a single array
   lookup, with no colour maths and no string building per frame.
   ========================================================================= */

const COLORS = {
  grassA:"#84bd52", grassB:"#78b148", grassC:"#8fc95e", grassD:"#6ea43f",
  forestFloor:"#5f9440",
  sand:"#dfcf9f",
  water:"#3f9fd4", waterDeep:"#2f86bd", foam:"#eef8fd",
  rock:"#9ea4a9", rockDark:"#7f868d",
  soil:"#b5895c", base:"#96704c",
  trunk:"#7a5230",
  /* Deeper, more olive greens than the first pass. The reference art reads as
     illustrated countryside rather than bright cartoon — the canopies sit dark
     against the fields so the clumps stay legible from above. */
  pineA:"#4a8040", pineB:"#5b9448", pineC:"#3d6b38",
  leafA:"#679a44", leafB:"#7bad52", leafC:"#548340",
  autumnA:"#c8722c", autumnB:"#b25c24", autumnC:"#d99a35",
  wallA:"#f2e3c3", wallB:"#e8d0a6", wallC:"#dcc7a4",
  /* saturated, and deliberately mixed — the reference roofs are red, orange,
     blue, teal and green scattered through the same village */
  roofA:"#c94f3a", roofB:"#b8432f", roofC:"#4f86ad", roofD:"#d98a35",
  roofE:"#4a9a8a", roofF:"#6a9a52",
  window:"#403a31", door:"#7d5a3c",
  cropA:"#d9b955", cropB:"#b99a3f",
  river:"#5cb2de",
  plank:"#b08a5c", timber:"#7d5a3c",
  churchWall:"#f4efe2", churchRoof:"#7b6fa6", gold:"#e0b23c",
  millWall:"#eadfc4", stone:"#bdb6a8",
  barnWall:"#bf5b41", barnRoof:"#7e5c46",
  lamp:"#ffd469",
  hull:"#8a5a3a", trim:"#c9563f",
  sheep:"#f6f3e8", cow:"#f7f3ea", cowPatch:"#403c37",
  deer:"#b07a48", deerLight:"#e2c9a4", hen:"#f1e7d0", comb:"#d9503c",
  goat:"#c9bda6", goatHorn:"#8a7d68",
  bird:"#3b4250", birdWing:"#59626f",
  coat:"#d94f43", trousers:"#3f4a5a", skin:"#f0cba0", hat:"#f5efe0",
  shadow:"#2f4a26"
};

const CNAMES = Object.keys(COLORS);
const CIDX = {};
CNAMES.forEach((k, i) => CIDX[k] = i);

/* Six flat bands — the low-poly staple. No gradients on the geometry itself. */
const BAND_K = [0.50, 0.64, 0.78, 0.92, 1.05, 1.18];
const SHADES = CNAMES.map(k => {
  const c = d3.hsl(COLORS[k]);
  return BAND_K.map(b => d3.hsl(c.h, c.s, Math.max(0.05, Math.min(0.97, c.l * b))).formatHex());
});
