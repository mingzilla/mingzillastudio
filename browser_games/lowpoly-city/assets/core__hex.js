/* =========================================================================
   core__hex.js — hex grid maths (pointy-top, axial coordinates)
   ========================================================================= */

const SQ3 = Math.sqrt(3);

const hexCenter = (q, r) => ({ x: SQ3 * (q + r / 2), y: 1.5 * r });
const key = (q, r) => q + "," + r;

function worldToAxial(x, y) {
  const fq = (SQ3 / 3) * x - y / 3;
  const fr = (2 / 3) * y;
  const cx = fq, cz = fr, cy = -cx - cz;
  let rx = Math.round(cx), ry = Math.round(cy), rz = Math.round(cz);
  const dx = Math.abs(rx - cx), dy = Math.abs(ry - cy), dz = Math.abs(rz - cz);
  if (dx > dy && dx > dz) rx = -ry - rz;
  else if (dy > dz) ry = -rx - rz;
  else rz = -rx - ry;
  return { q: rx, r: rz };
}

/* corner i sits at 60i - 30 degrees, radius 1 */
const CORNER = d3.range(6).map(i => {
  const a = Math.PI / 180 * (60 * i - 30);
  return { x: Math.cos(a), y: Math.sin(a), a };
});

const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];

/* Which neighbour lies across edge i? Derived from the corner geometry so the
   two can't quietly drift apart. */
const EDGE_TO_DIR = d3.range(6).map(i => {
  const a = CORNER[i].a, b = CORNER[(i + 1) % 6].a;
  const mid = Math.atan2(Math.sin(a) + Math.sin(b), Math.cos(a) + Math.cos(b));
  let best = 0, bestD = 9;
  DIRS.forEach((d, k) => {
    const n = hexCenter(d[0], d[1]);
    const ang = Math.atan2(n.y, n.x);
    const diff = Math.abs(((ang - mid + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    if (diff < bestD) { bestD = diff; best = k; }
  });
  return best;
});
