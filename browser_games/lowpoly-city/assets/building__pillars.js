/* =========================================================================
   building__pillars.js — a marble ruin on the hill
   =========================================================================
   Two weathered steps, six columns, and a lintel that survived over one pair
   only. Nothing else in the valley is white, and nothing else is broken, so it
   reads at a glance from above even at the far zoom — which is the job.

   The broken columns are the whole character of the thing, so the heights are
   deliberately uneven and each stump is cut at its own fraction rather than
   sharing one. A tidy row of equal stumps looks like a fence.
   ========================================================================= */

defEntity({
  key: "pillars", group: "building", label: "Ruined pillars",
  sizeMul: 2,
  spawn: {
    mode: "scatter", biomes: [BIOME.GRASS], density: 0.005, min: 1, max: 2,
    gap: 16,
    where: (t, h) => t.h >= h.PLAIN + h.STEP * 2
  },
  create({ t, h }) {
    const s = h.rr(0.9, 1.15);
    const rot = h.rnd() * 6.28;
    const f = [], C = h.CIDX;

    /* the stylobate: two steps, the upper one inset */
    h.box(f, 0, 0, 0, 0.52 * s, 0.40 * s, 0.05 * s, rot, C.marbleC);
    h.box(f, 0, 0, 0.05 * s, 0.45 * s, 0.33 * s, 0.05 * s, rot, C.marbleB);

    const base = 0.10 * s, full = 0.58 * s, rad = 0.072 * s;
    const stand = [];
    for (const row of [-0.22, 0.22]) {
      for (const col of [-0.33, 0, 0.33]) {
        const [cx, cy] = h.off(rot, col * s, row * s);
        const broken = h.rnd() < 0.4;
        const hgt = broken ? full * h.rr(0.22, 0.62) : full;
        stand.push({ cx, cy, hgt, broken });
        h.prism(f, cx, cy, base, base + hgt, rad, 8, rot, C.marbleA);
        if (!broken) {
          h.box(f, cx, cy, base + hgt, 0.098 * s, 0.098 * s, 0.032 * s, rot, C.marbleB);
        }
      }
    }

    /* the lintel, over the tallest neighbouring pair, if they can carry it */
    let best = null;
    for (let i = 0; i < stand.length; i++) {
      for (let j = i + 1; j < stand.length; j++) {
        const a = stand[i], b = stand[j];
        const span = Math.hypot(a.cx - b.cx, a.cy - b.cy);
        if (span > 0.45 * s || a.broken || b.broken) continue;
        const hi = Math.min(a.hgt, b.hgt);
        if (!best || hi > best.hi) best = { a, b, hi };
      }
    }
    if (best) {
      const mx = (best.a.cx + best.b.cx) / 2, my = (best.a.cy + best.b.cy) / 2;
      const span = Math.hypot(best.a.cx - best.b.cx, best.a.cy - best.b.cy);
      const ang = Math.atan2(best.b.cy - best.a.cy, best.b.cx - best.a.cx);
      h.box(f, mx, my, base + best.hi + 0.032 * s,
        span / 2 + 0.05 * s, 0.055 * s, 0.05 * s, ang, C.marbleB);
    }

    return { s, rot, faces: f };
  }
});
