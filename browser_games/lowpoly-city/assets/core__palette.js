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
  pineA:"#3f7d45", pineB:"#356e3c", pineC:"#4a8c50",
  leafA:"#4f8f3f", leafB:"#5da345", leafC:"#3d7a34",
  autumnA:"#d9793a", autumnB:"#c85a34", autumnC:"#e0a13c",
  wallA:"#f2e4ca", wallB:"#e6d3b3",
  roofA:"#c9503c", roofB:"#b8432f", roofC:"#8a5aa0", roofD:"#c98a3a",
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
