/* =========================================================================
   game__render.js — painting tiles and solids
   ========================================================================= */

const canvas = document.getElementById("view");
const ctx = canvas.getContext("2d");
const PBUF = d3.range(8).map(() => ({ x: 0, y: 0 }));

/* Draw list. DRAW holds references into POOL, which grows to a high-water mark
   and is never thrown away — so a frame allocates no objects at all once it has
   warmed up. Building {d,k,r} literals every frame was ~460 objects a frame,
   which is ~28k a second of pure garbage for the collector to sweep. */
const POOL = [];
const DRAW = [];
let drawN = 0;

function drawPush(d, k, r) {
  let it = POOL[drawN];
  if (it === undefined) it = POOL[drawN] = { d: 0, k: 0, r: null };
  it.d = d; it.k = k; it.r = r;
  DRAW.push(it);
  drawN++;
}
let playerDepth = 0;
let skyGrad = null;

function resize() {
  view.dpr = Math.min(window.devicePixelRatio || 1, 2);
  view.w = window.innerWidth;
  view.h = window.innerHeight;
  canvas.width = Math.floor(view.w * view.dpr);
  canvas.height = Math.floor(view.h * view.dpr);
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, view.h);
  g.addColorStop(0, "#a4d6ed");
  g.addColorStop(0.34, "#cfe8f4");
  g.addColorStop(0.56, "#e6f0e0");
  g.addColorStop(1, "#dbe6cf");
  skyGrad = g;
}

function fillBuf(n, ci, normal, alpha, seam) {
  const col = SHADES[ci][bandOf(normal)];
  ctx.beginPath();
  ctx.moveTo(PBUF[0].x, PBUF[0].y);
  for (let i = 1; i < n; i++) ctx.lineTo(PBUF[i].x, PBUF[i].y);
  ctx.closePath();
  ctx.fillStyle = col;
  if (alpha !== undefined) ctx.globalAlpha = alpha;
  ctx.fill();
  if (alpha !== undefined) ctx.globalAlpha = 1;
  /* Anti-aliasing leaves a hairline between two tiles sharing an edge at the
     same height, which reads as a grid drawn over the grass. Stroking the big
     flat faces with their own colour closes it. Only worth it on tile tops. */
  if (seam) { ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke(); }
}

/* Every solid here is convex, so anything facing away is hidden behind its own
   front. Dropping those roughly halves the fills. */
function facing(n) { return n[0] * cam.s + n[1] * cam.c < 0.02; }

const NRM = [0, 0, 0];       // scratch face normal, reused — see the note on PBUF
const _scr = { x: 0, y: 0, d: 0 };   // scratch screen point for H.screenOf


function drawTile(t) {
  const zt = t.rz;

  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6;
    const nb = t.nb[i];
    const zb = nb ? nb.rz : BASE_Z;
    if (zb >= zt - 0.004) continue;
    const ex = (t.wx[i] + t.wx[j]) / 2 - t.cx, ey = (t.wy[i] + t.wy[j]) / 2 - t.cy;
    const L = Math.hypot(ex, ey) || 1;
    NRM[0] = ex / L; NRM[1] = ey / L; NRM[2] = 0;
    if (!facing(NRM)) continue;

    /* a river dropping a long way is a waterfall; nothing else needs painting */
    const river = t.biome === BIOME.RIVER || (nb && nb.biome === BIOME.RIVER);
    const ci = river && (zt - zb) > STEP * 1.4 ? CIDX.foam
             : nb ? t.side : CIDX.base;

    project(t.wx[i], t.wy[i], zt, PBUF[0]);
    project(t.wx[j], t.wy[j], zt, PBUF[1]);
    project(t.wx[j], t.wy[j], zb, PBUF[2]);
    project(t.wx[i], t.wy[i], zb, PBUF[3]);
    fillBuf(4, ci, NRM);
  }

  for (let i = 0; i < 6; i++) project(t.wx[i], t.wy[i], zt, PBUF[i]);
  fillBuf(6, t.top, [0, 0, 1], undefined, true);

  if (t.rows) {
    const rz = zt + 0.012;
    for (let k = 0; k < t.rows.length; k++) {
      const seg = t.rows[k];
      const m = Math.min(seg.length, 8);
      for (let i = 0; i < m; i++) project(seg[i][0], seg[i][1], rz, PBUF[i]);
      fillBuf(m, CIDX.cropB, [0, 0, 1], 0.24);
    }
  }
}

/* Faces of one solid sharing a fill colour go into a single canvas path, and
   one fill draws the lot. A pine's two cones are the same green, so this turns
   a dozen fills into about three. Buckets are keyed by colour AND light band,
   because the band is what actually picks the drawn colour. */
const MAXF = 512;
const NKEYS = CNAMES.length * 8;
const FBUF = new Float64Array(MAXF * 4 * 2);
const FCNT = new Uint8Array(MAXF);
const FKEY = new Uint16Array(MAXF);
const BCOUNT = new Uint16Array(NKEYS);
const BSTART = new Uint16Array(NKEYS);
const BEND = new Uint16Array(NKEYS);
const BIDX = new Uint16Array(MAXF);
const BUSED = new Uint8Array(NKEYS);
const BUSED_LIST = new Uint16Array(NKEYS);

function drawFaces(faces, ox, oy, oz, scale, alpha) {
  const cc = cam.c, cs = cam.s, z = cam.zoom;
  const camX = cam.x, camY = cam.y, camZ = cam.z;
  const halfW = view.w * 0.5, baseY = view.h * 0.60;

  let nf = 0, nused = 0;
  for (let fi = 0; fi < faces.length; fi++) {
    const f = faces[fi], p = f.p, n = p.length;
    if (!facing(f.n)) continue;
    if (nf >= MAXF) break;
    /* projection inlined: this loop runs tens of thousands of times a frame */
    for (let i = 0; i < n; i++) {
      const v = p[i];
      const dx = ox + v[0] * scale - camX;
      const dy = oy + v[1] * scale - camY;
      const dz = oz + v[2] * scale - camZ;
      const rx = dx * cc - dy * cs;
      const ry = dx * cs + dy * cc;
      const o = (nf * 4 + i) * 2;
      FBUF[o] = halfW + rx * z;
      FBUF[o + 1] = baseY + (-ry * SINP - dz * COSP) * z;
    }
    const k = f.c * 8 + bandOf(f.n);
    FCNT[nf] = n; FKEY[nf] = k;
    if (!BCOUNT[k]++) { BUSED[k] = 1; BUSED_LIST[nused++] = k; }
    nf++;
  }

  /* counting sort: BCOUNT holds each bucket's size, then doubles as the write
     cursor once BSTART/BEND bracket each run */
  let acc = 0;
  for (let i = 0; i < nused; i++) {
    const k = BUSED_LIST[i];
    BSTART[k] = acc; acc += BCOUNT[k]; BEND[k] = acc;
  }
  for (let i = 0; i < nused; i++) BCOUNT[BUSED_LIST[i]] = 0;
  for (let i = 0; i < nf; i++) { const k = FKEY[i]; BIDX[BSTART[k] + BCOUNT[k]++] = i; }

  if (alpha !== undefined) ctx.globalAlpha = alpha;

  /* Outline pass. Every face is re-drawn pushed a couple of pixels out from the
     shape's centre, all in one path, so only the union shows — which reads as a
     single ink line around the silhouette rather than a wireframe over the
     facets. One extra fill per entity, whatever its face count. */
  if (OUTLINE_PX > 0 && nf > 0) {
    let sx = 0, sy = 0, sn = 0;
    for (let i = 0; i < nf; i++) {
      const n = FCNT[i], base = i * 8;
      for (let q = 0; q < n; q++) { sx += FBUF[base + q * 2]; sy += FBUF[base + q * 2 + 1]; sn++; }
    }
    const ecx = sx / sn, ecy = sy / sn;
    ctx.beginPath();
    for (let i = 0; i < nf; i++) {
      const n = FCNT[i], base = i * 8;
      for (let q = 0; q < n; q++) {
        const x = FBUF[base + q * 2], y = FBUF[base + q * 2 + 1];
        const dx = x - ecx, dy = y - ecy;
        const L = Math.hypot(dx, dy) || 1;
        const px = x + dx / L * OUTLINE_PX, py = y + dy / L * OUTLINE_PX;
        if (q === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }
    ctx.fillStyle = OUTLINE_INK;
    ctx.fill();
  }

  for (let i = 0; i < nused; i++) {
    const k = BUSED_LIST[i];
    ctx.beginPath();
    for (let j = BSTART[k]; j < BEND[k]; j++) {
      const fi = BIDX[j], n = FCNT[fi], base = fi * 8;
      ctx.moveTo(FBUF[base], FBUF[base + 1]);
      for (let q = 1; q < n; q++) ctx.lineTo(FBUF[base + q * 2], FBUF[base + q * 2 + 1]);
      ctx.closePath();
    }
    ctx.fillStyle = SHADES[k >> 3][k & 7];
    ctx.fill();
    /* BCOUNT doubled as the write cursor, so it has to go back to zero —
       leave it dirty and the next call marks nothing used and draws nothing */
    BUSED[k] = 0;
    BCOUNT[k] = 0;
  }
  if (alpha !== undefined) ctx.globalAlpha = 1;
}

/* One multiplier for every entity in the world. HEX_SIZE scales the land; this
   scales what stands on it, so the two move together. Without it, doubling
   HEX_SIZE leaves houses, trees and sheep the same absolute size on tiles that
   are twice as wide, and everything looks shrunken. */
const WORLD_SCALE = 2;

/* Ink line around every entity, in screen pixels. Held roughly constant as you
   zoom so the illustration keeps the same weight, but clamped at the bottom or
   a zoomed-out valley turns into a smudge of outlines. */
let OUTLINE_PX = 0;
const OUTLINE_INK = "#3a3128";

/* How far in front of its tile an entity sorts. A hex is HEX_SIZE across, and
   the player is only a fraction of that, so standing anywhere near a hex edge
   puts your body over the NEXT hex — which is nearer, draws later, and paints
   straight over you. Sorting entities a full hex-width nearer than their own
   tile makes them win against every tile that can overlap them. */
const DEPTH_BIAS = HEX_SIZE * 2.4;
function updateOutline() {
  OUTLINE_PX = Math.max(0.9, Math.min(2.4, cam.zoom * 0.036));
}

/* Entities may paint themselves directly instead of returning 3D faces. That is
   how the 2D billboard trees work — see nature__tree.js. This has to run down
   here, after ctx / cam / view / WORLD_SCALE exist; doing it up with the other
   H properties hits the temporal dead zone. */
Object.assign(H, {
  ctx, cam, view, WORLD_SCALE,
  INK: OUTLINE_INK,
  /* screen position of a world point, in the SHARED _scr — read it and let it go */
  screenOf: (x, y, z) => project(x, y, z, _scr)
});
