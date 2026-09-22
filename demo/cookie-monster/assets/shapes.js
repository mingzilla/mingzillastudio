/* =========================================================================
   shapes.js — the low-poly kit: one palette, flat shading, five primitives
   =========================================================================
   A face is { p: [[x,y,z], ...], n: [nx,ny,nz], c: colourIndex }. Everything
   in this game is a box, a disc, a blob, a panel or a pad — there is nothing
   else to learn, and no entity file needs any maths of its own.

   Local axes are the same everywhere: local +x is the way the thing faces,
   local +y is its left. `off()` is the only way to place a part.
   ========================================================================= */

if (typeof d3 === "undefined") throw new Error("shapes.js needs d3 loaded first");

const TAU = Math.PI * 2;

const PAL = {
  grass:"#8cc152", grass2:"#7cb04b", grass3:"#95c65f", tuft:"#a3d06c",
  bush:"#5f9a43", bush2:"#4c8038", rock:"#adb2b6", rock2:"#8f959a",
  trunk:"#7a5230", pine:"#4a8040", pine2:"#3d6b38",
  fur:"#5d8fd8", fur2:"#3f66a8", fur3:"#6f9ee4",
  cookie:"#b0763a", chip:"#4a3122",
  broc:"#4f9a4a", broc2:"#3f7f3e", stalk:"#cadf92",
  white:"#fdfbf4", dark:"#2e2a27", mouth:"#6d2830", tongue:"#e2707c"
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

/* a point offset in the entity's own rotated frame */
function off(rot, dx, dy) {
  const c = Math.cos(rot), s = Math.sin(rot);
  return [dx * c - dy * s, dx * s + dy * c];
}

/* Four walls and a lid. The workhorse: bodies, heads, legs, stalks. Nothing in
   this game is ever seen from underneath. */
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

/* A flat disc standing on the ground: a cookie, a stump, a plate of shame.
   Eight sides is enough that it reads as round and still looks cut. */
function disc(out, cx, cy, z0, rad, h, sides, rot, ci) {
  const z1 = z0 + h, ring = [], top = [];
  for (let i = 0; i < sides; i++) {
    const a = rot + i * TAU / sides;
    const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad;
    ring.push([x, y, z0]); top.push([x, y, z1]);
  }
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    push(out, [ring[i], ring[j], top[j], top[i]], ci);
  }
  push(out, top, ci);
}

/* A chunky bipyramid, for anything that should not look machined: bodies,
   heads, eyeballs, broccoli, bushes. */
function blob(out, cx, cy, cz, rad, height, sides, ci) {
  const top = [cx, cy, cz + height * 0.58];
  const bot = [cx, cy, cz - height * 0.42];
  const ring = [];
  for (let i = 0; i < sides; i++) {
    const a = i * TAU / sides;
    ring.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, cz]);
  }
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    push(out, [ring[i], ring[j], top], ci);
    push(out, [ring[j], ring[i], bot], ci);
  }
}

/* A flat panel standing on the entity's face, normal pointing the way it
   faces: lips, teeth, signs. Flat, so it never has side walls that the
   painter's sort could get the wrong way round. */
function panel(out, rot, fwd, lo, hi, z0, z1, ci) {
  const a = off(rot, fwd, lo), b = off(rot, fwd, hi);
  push(out, [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], ci);
}

/* A flat polygon lying on the ground, wound so its normal points up. Ground,
   grass tufts — anything with no height worth speaking of. */
function pad(out, cx, cy, z, rad, sides, rot, ci) {
  const ring = [];
  for (let i = 0; i < sides; i++) {
    const a = rot + i * TAU / sides;
    ring.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, z]);
  }
  push(out, ring, ci);
}

/* Seeded, so a cookie's chocolate chips stay put between frames instead of
   boiling. */
function mulberry(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
