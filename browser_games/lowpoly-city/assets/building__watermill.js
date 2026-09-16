/* =========================================================================
   building__watermill.js — a shed with a wheel that turns
   =========================================================================
   Only ever built on a bank with river on at least one side, so the wheel
   always has water under it. The wheel is the same trick as the windmill's
   sails: geometry rebuilt from `spin` every tick and parked in `e.dyn`, so the
   renderer draws it in the same pass as the building.

   The wheel turns in the plane of the wall — its axle runs along the building's
   own x — because a wheel facing the camera edge-on shows nothing but a line,
   and the camera can be anywhere.
   ========================================================================= */

defEntity({
  key: "watermill", group: "building", label: "Watermill",
  sizeMul: 2,
  spawn: {
    mode: "scatter", biomes: [BIOME.GRASS, BIOME.FOREST, BIOME.FIELD, BIOME.SAND],
    density: 0.02, min: 1, max: 3, gap: 13,
    where: t => t.nb.some(n => n && n.biome === BIOME.RIVER)
  },
  create({ t, h }) {
    const s = h.rr(0.9, 1.1);
    const rot = h.rnd() * Math.PI * 2;
    const f = [], C = h.CIDX;
    const hx = 0.22 * s, hy = 0.18 * s, hh = 0.26 * s;

    h.box(f, 0, 0, 0, hx, hy, hh, rot, C.millWall);
    h.gableRoof(f, 0, 0, hh, hx * 1.30, hy * 1.45, 0.22 * s, rot, C.roofB);

    /* the axle housing, poking out of the wall the wheel hangs on */
    const [ax, ay] = h.off(rot, hx * 0.96, 0);
    h.box(f, ax, ay, 0, 0.03 * s, 0.03 * s, 0.30 * s, rot, C.timber);

    const [dx, dy] = h.off(rot, -hx * 1.03, 0);
    h.box(f, dx, dy, 0, 0.014, 0.05 * s, 0.15 * s, rot, C.door);

    return {
      s, rot, faces: f, dyn: [],
      spin: h.rnd() * 6.28, spinRate: h.rr(0.5, 0.9),
      hubX: hx * 1.05, hubZ: 0.20 * s, hubR: 0.20 * s
    };
  },

  anim(e, dt, h) {
    e.spin += dt * e.spinRate;
    const f = [], r = e.rot, s = e.s;
    const P = (lx, ly, lz) => { const [wx, wy] = h.off(r, lx, ly); return [wx, wy, lz]; };
    const w = 0.045 * s, r0 = 0.22, r1 = 1;
    for (let k = 0; k < 8; k++) {
      const a = e.spin + k * Math.PI / 4;
      const ca = Math.cos(a), sa = Math.sin(a);
      const inner = e.hubZ + sa * e.hubR * r0, outer = e.hubZ + sa * e.hubR;
      const ci = ca * e.hubR * r0, co = ca * e.hubR;
      h.slab(f,
        P(e.hubX - w, ci, inner), P(e.hubX + w, ci, inner),
        P(e.hubX + w, co, outer), P(e.hubX - w, co, outer),
        k % 2 ? h.CIDX.timber : h.CIDX.plank);
    }
    e.dyn = f;
  }
});
