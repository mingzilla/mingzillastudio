/* =========================================================================
   shapes.js — the whole low-poly kit: colours, shading, three primitives
   =========================================================================
   A face is { p: [[x,y,z], ...], n: [nx,ny,nz], c: colourIndex }. Everything
   in the game is built from box, cone and blob — there is nothing else to
   learn, and no entity file needs any maths of its own.
   ========================================================================= */

const PAL = {
  grass:"#84bd52", grass2:"#7fb44d", soil:"#a8875e",
  trunk:"#7a5230", pineA:"#4a8040", pineB:"#5b9448", pineC:"#3d6b38",
  rock:"#9ea4a9", rock2:"#7f868d",
  sheep:"#f6f3e8", cow:"#f2e9d2", dark:"#403c37",
  coat:"#d94f43", trousers:"#3f4a5a", skin:"#f0cba0"
};

const NAMES = Object.keys(PAL);
const CIDX = {};
NAMES.forEach((k, i) => CIDX[k] = i);

/* Four flat bands per colour, worked out once. Shading a face is then a single
   array lookup, with no colour maths anywhere in the draw loop. */
const BANDS = [0.62, 0.80, 0.97, 1.14];
const SHADE = NAMES.map(k => {
  const c = d3.hsl(PAL[k]);
  return BANDS.map(b => d3.hsl(c.h, c.s, Math.min(0.97, c.l * b)).formatHex());
});

function faceNormal(p) {
  const ax = p[1][0] - p[0][0], ay = p[1][1] - p[0][1], az = p[1][2] - p[0][2];
  const bx = p[2][0] - p[0][0], by = p[2][1] - p[0][1], bz = p[2][2] - p[0][2];
  const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
  const L = Math.hypot(nx, ny, nz) || 1;
  return [nx / L, ny / L, nz / L];
}

function push(out, pts, ci) { out.push({ p: pts, n: faceNormal(pts), c: ci }); }

/* a point offset in the entity's own rotated frame — local +x is the way it
   is facing, local +y is its left */
function off(rot, dx, dy) {
  const c = Math.cos(rot), s = Math.sin(rot);
  return [dx * c - dy * s, dx * s + dy * c];
}

/* Four walls and a lid. The workhorse: bodies, heads, legs, trunks. Nothing
   in this game is ever seen from underneath. */
function box(out, cx, cy, z0, hx, hy, h, rot, ci) {
  const c = Math.cos(rot), s = Math.sin(rot);
  const cs = [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]]
    .map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
  const z1 = z0 + h;
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    push(out, [
      [cs[i][0], cs[i][1], z0], [cs[j][0], cs[j][1], z0],
      [cs[j][0], cs[j][1], z1], [cs[i][0], cs[i][1], z1]
    ], ci);
  }
  push(out, cs.map(p => [p[0], p[1], z1]), ci);
}

/* round in plan, pointed on top — a tree tier, or a hat */
function cone(out, cx, cy, z0, rad, height, sides, ci) {
  const apex = [cx, cy, z0 + height];
  const ring = [];
  for (let i = 0; i < sides; i++) {
    const a = i * Math.PI * 2 / sides;
    ring.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, z0]);
  }
  for (let i = 0; i < sides; i++) push(out, [ring[i], ring[(i + 1) % sides], apex], ci);
}

/* a chunky bipyramid, for anything that should not look machined */
function blob(out, cx, cy, cz, rad, height, sides, ci) {
  const top = [cx, cy, cz + height * 0.58];
  const bot = [cx, cy, cz - height * 0.42];
  const ring = [];
  for (let i = 0; i < sides; i++) {
    const a = i * Math.PI * 2 / sides;
    ring.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, cz]);
  }
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    push(out, [ring[i], ring[j], top], ci);
    push(out, [ring[j], ring[i], bot], ci);
  }
}
