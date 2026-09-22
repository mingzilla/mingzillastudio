/* =========================================================================
   core__primitives.js — low-poly building blocks
   =========================================================================
   Each helper appends flat-shaded faces to `out`. A face is:
       { p: [[x,y,z], ...], n: [nx,ny,nz], c: colourIndex }
   Coordinates are local to the entity; the renderer offsets by the entity's
   origin. Only triangles and quads are produced — the batched renderer relies
   on that (it packs up to 4 points per face into a scratch buffer).
   ========================================================================= */

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

/* a column of `sides` quads */
function prism(out, cx, cy, z0, z1, rad, sides, rot, ci) {
  const ring = [];
  for (let i = 0; i < sides; i++) {
    const a = rot + i * Math.PI * 2 / sides;
    ring.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
  }
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    push(out, [
      [ring[i][0], ring[i][1], z0], [ring[j][0], ring[j][1], z0],
      [ring[j][0], ring[j][1], z1], [ring[i][0], ring[i][1], z1]
    ], ci);
  }
}

function cone(out, cx, cy, z0, rad, height, sides, rot, ci) {
  const apex = [cx, cy, z0 + height];
  const ring = [];
  for (let i = 0; i < sides; i++) {
    const a = rot + i * Math.PI * 2 / sides;
    ring.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, z0]);
  }
  for (let i = 0; i < sides; i++) push(out, [ring[i], ring[(i + 1) % sides], apex], ci);
}

/* bipyramid — the chunky low-poly blob, with a little irregularity so
   canopies and animal bodies don't look like they came off a lathe */
function blob(out, cx, cy, cz, rad, height, sides, rot, ci) {
  const top = [cx, cy, cz + height * 0.58];
  const bot = [cx, cy, cz - height * 0.42];
  const ring = [];
  for (let i = 0; i < sides; i++) {
    const a = rot + i * Math.PI * 2 / sides;
    const j = 0.84 + 0.30 * hash2(Math.round(cx * 13 + i * 7), Math.round(cy * 13));
    ring.push([cx + Math.cos(a) * rad * j, cy + Math.sin(a) * rad * j, cz]);
  }
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    push(out, [ring[i], ring[j], top], ci);
    push(out, [ring[j], ring[i], bot], ci);
  }
}

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

/* flat double-sided quad — sails and awnings have no thickness worth modelling,
   but they must not vanish when the camera swings behind them */
function slab(out, a, b, c, d, ci) {
  push(out, [a, b, c, d], ci);
  push(out, [d, c, b, a], ci);
}

/* gabled roof: a triangular prism, which is what most roofs actually are */
function gableRoof(out, cx, cy, z0, hx, hy, h, rot, ci) {
  const P = (x, y, z) => { const [ox, oy] = off(rot, x, y); return [cx + ox, cy + oy, z]; };
  const z1 = z0 + h;
  const a0 = P(-hx, -hy, z0), a1 = P(hx, -hy, z0);
  const b0 = P(-hx, hy, z0), b1 = P(hx, hy, z0);
  const r0 = P(-hx, 0, z1), r1 = P(hx, 0, z1);
  push(out, [a0, a1, r1, r0], ci);      // pitch facing -y
  push(out, [r0, r1, b1, b0], ci);      // pitch facing +y
  push(out, [a0, r0, b0], ci);          // gable ends
  push(out, [a1, b1, r1], ci);
}
