/* =========================================================================
   core__creature.js — the shared four-legged body, and how animals wander
   =========================================================================
   Every animal__*.js file supplies a species table and gets this body for
   free. A creature is rebuilt from scratch each frame while it is near the
   player, which is what lets the legs swing and the body bob.

   `e.moving` eases toward 1 while walking and back to 0 when it stops, so
   turning and stopping read as motion rather than snapping.
   ========================================================================= */

function quadrupedFaces(e, h) {
  const f = [], sp = e.sp, s = e.s, r = e.facing, C = h.CIDX;
  const swing = Math.sin(e.phase) * e.moving;
  const bob = Math.abs(Math.cos(e.phase)) * 0.012 * e.moving * s;
  const bl = sp.bodyLen * s, bw = sp.bodyWid * s, bh = sp.bodyH * s, lh = sp.legH * s;
  const legCi = C[sp.legCi], bodyCi = C[sp.bodyCi], headCi = C[sp.headCi];

  const LX = 0.28 * bl, LY = 0.32 * bw;
  for (let i = 0; i < 4; i++) {
    const ph = (i === 0 || i === 3) ? 1 : -1;
    const [px, py] = h.off(r, (i < 2 ? LX : -LX) + ph * swing * 0.05 * s, i % 2 ? LY : -LY);
    h.prism(f, px, py, 0, lh, 0.024 * s, 3, r, legCi);
  }

  h.blob(f, 0, 0, lh + bh * 0.44 + bob, bl * 0.5, bh, 6, r, bodyCi);

  if (sp.patches) {
    const [qx, qy] = h.off(r, bl * 0.18, bw * 0.26);
    h.blob(f, qx, qy, lh + bh * 0.58 + bob, bl * 0.20, bh * 0.55, 5, r + 0.6, C.cowPatch);
  }

  const [hx, hy] = h.off(r, bl * 0.60, 0);
  h.blob(f, hx, hy, lh + bh * 0.64 + bob, sp.headR * s, sp.headR * 1.9 * s, 5, r, headCi);

  if (sp.antlers || sp.horns) {
    const ci = sp.antlers ? C.deerLight : C.goatHorn;
    const hh = (sp.antlers ? 0.07 : 0.05) * s;
    [0.7, -0.7].forEach(k => {
      const [ax, ay] = h.off(r, bl * 0.62, sp.headR * k * s);
      h.box(f, ax, ay, lh + bh * 0.80 + bob, 0.008 * s, 0.008 * s, hh, r, ci);
    });
  }
  if (sp.comb) {
    const [cx2, cy2] = h.off(r, bl * 0.58, 0);
    h.box(f, cx2, cy2, lh + bh * 0.88 + bob, 0.011 * s, 0.011 * s, 0.032 * s, r, C.comb);
  }
  return f;
}

/* Pick somewhere new to head for, near where this one lives. Falls back to
   home if it can't find anywhere legal. */
function pickTarget(e, h) {
  for (let tries = 0; tries < 8; tries++) {
    const a = h.rnd() * Math.PI * 2, d = h.rr(1.0, 4.0) * HEX_SIZE;
    const tx = e.homeX + Math.cos(a) * d, ty = e.homeY + Math.sin(a) * d;
    const t = tileAtWorld(tx, ty);
    if (t && walkable(t)) { e.tx = tx; e.ty = ty; return; }
  }
  e.tx = e.homeX;
  e.ty = e.homeY;
}

/* Graze, wander a bit, pause, repeat. Refuses to walk into water. */
function wander(e, dt, h) {
  if (e.wait > 0) {
    e.wait -= dt;
    e.moving += (0 - e.moving) * Math.min(1, dt * 5);
    return;
  }
  const dx = e.tx - e.x, dy = e.ty - e.y;
  const d = Math.hypot(dx, dy);
  if (d < 0.10) {
    e.wait = h.rr(e.sp.rest[0], e.sp.rest[1]);
    pickTarget(e, h);
    return;
  }
  const step = e.sp.speed * dt;
  const nx = e.x + dx / d * step, ny = e.y + dy / d * step;
  const t = tileAtWorld(nx, ny);
  if (!t || !walkable(t)) { pickTarget(e, h); return; }

  e.x = nx; e.y = ny; e.owner = t;
  e.z += (t.rz - e.z) * Math.min(1, dt * 8);
  const want = Math.atan2(dy, dx);
  const diff = ((want - e.facing + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  e.facing += diff * Math.min(1, dt * 6);
  e.moving = Math.min(1, e.moving + dt * 4);
  e.phase += dt * e.sp.gait;
}

/* Shared setup for anything that walks. */
function initWalker(e, t, sp, h) {
  e.sp = sp;
  e.s = h.rr(0.9, 1.15);
  e.facing = h.rnd() * Math.PI * 2;
  e.phase = h.rnd() * Math.PI * 2;
  e.moving = 0;
  e.wait = h.rr(0, 2);
  e.homeX = t.cx; e.homeY = t.cy;
  e.tx = t.cx; e.ty = t.cy;
  e.speed = sp.speed;
  e.moving = 0;
  return e;
}
