/* =========================================================================
   vehicle__boat.js — drifts in a slow circle offshore
   =========================================================================
   The sail runs fore-and-aft (along the hull), not across the beam. Built
   across the beam it is edge-on to the viewer from almost every angle and
   renders as an invisible hairline.
   ========================================================================= */

function boatFaces(e, h) {
  const f = [], s = e.s, r = e.rot, C = h.CIDX;
  const HULL = [[0.30, 0], [0.10, 0.13], [-0.22, 0.13], [-0.27, 0], [-0.22, -0.13], [0.10, -0.13]];
  const pts = HULL.map(([x, y]) => h.off(r, x * s, y * s));
  const bh = 0.11 * s;

  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6;
    h.push(f, [
      [pts[i][0], pts[i][1], 0], [pts[j][0], pts[j][1], 0],
      [pts[j][0], pts[j][1], bh], [pts[i][0], pts[i][1], bh]
    ], C.hull);
  }
  h.push(f, pts.map(p => [p[0], p[1], bh]), C.plank);

  h.prism(f, 0, 0, bh, bh + 0.36 * s, 0.014 * s, 4, r, C.timber);

  const [px, py] = h.off(r, 1, 0);
  h.slab(f,
    [0, 0, bh + 0.34 * s],
    [px * 0.24 * s, py * 0.24 * s, bh + 0.32 * s],
    [px * 0.24 * s, py * 0.24 * s, bh + 0.04 * s],
    [0, 0, bh + 0.04 * s], C.trim);

  return f;
}

defEntity({
  key: "boat", group: "vehicle", label: "Boat",
  mobile: true,
  spawn: { kind: "water", near: "shore" },
  create({ t, h }) {
    const s = h.rr(0.85, 1.25), r = h.rnd() * 6.28;
    const e = {
      s, rot: r, z: t.rz + 0.03,
      bob: h.rnd() * 6.28, driftA: h.rnd() * 6.28,
      drift: h.rr(0.10, 0.22), driftR: h.rr(0.10, 0.22)
    };
    e.homeX = t.cx; e.homeY = t.cy;
    e.faces = boatFaces(e, h);
    return e;
  },

  anim(e, dt, h) {
    e.bob += dt * 1.3;
    e.driftA += dt * e.drift;
    e.x = e.homeX + Math.cos(e.driftA) * e.driftR;
    e.y = e.homeY + Math.sin(e.driftA) * e.driftR;
    e.z = e.owner.rz + 0.03 + Math.sin(e.bob) * 0.022;
    e.rot = e.driftA + Math.PI / 2;
    e.faces = boatFaces(e, h);
  }
});
