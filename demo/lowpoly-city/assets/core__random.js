/* =========================================================================
   core__random.js — seeded random and value noise
   =========================================================================
   d3.randomLcg gives a reproducible stream, so a seed always builds the same
   valley. d3.shuffle isn't seedable, so shuffleSeeded does its own.
   ========================================================================= */

let rng = d3.randomLcg(1);

const rnd = () => rng();
const rr = (a, b) => a + (b - a) * rng();
const ri = (a, b) => Math.floor(a + (b - a + 1) * rng());

function shuffleSeeded(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

const PERM = new Uint8Array(512);
function buildPerm() {
  const p = shuffleSeeded(d3.range(256));
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}
const hash2 = (ix, iy) => PERM[(PERM[ix & 255] + (iy & 255)) & 255] / 255;

function smoothstep(e0, e1, x) {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function noise2(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = smoothstep(0, 1, x - ix), fy = smoothstep(0, 1, y - iy);
  const a = hash2(ix, iy), b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1), d = hash2(ix + 1, iy + 1);
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
}

function fbm(x, y, oct) {
  let v = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) {
    v += amp * noise2(x * f, y * f);
    norm += amp; amp *= 0.5; f *= 2.03;
  }
  return v / norm;
}
