/* =========================================================================
   building__windmill.js — tapered tower, and four sails that turn
   =========================================================================
   The tower is static geometry built once. The sails are rebuilt every frame
   from `spin`, and live in `e.dyn` so the renderer draws them with the tower.

   The sails are dark on purpose. They were near-white to begin with, which
   looked correct against the sky and was completely invisible against pale
   sand and ripe fields — the only background a windmill ever actually stands
   against.
   ========================================================================= */

defEntity({
  key: "windmill", group: "building", label: "Windmill",
  spawn: {
    mode: "scatter", biomes: [BIOME.GRASS, BIOME.FIELD],
    density: 0.012, min: 2, max: 4, gap: 11,
    where: (t, h) => t.h <= h.PLAIN + h.STEP   // open flats, not the hilltop
  },
  create({ t, h }) {
    const s = h.rr(0.9, 1.15);
    const rot = h.rnd() * Math.PI * 2;
    const f = [], C = h.CIDX;

    h.prism(f, 0, 0, 0.00 * s, 0.30 * s, 0.35 * s, 8, rot, C.millWall);
    h.prism(f, 0, 0, 0.30 * s, 0.60 * s, 0.30 * s, 8, rot, C.millWall);
    h.prism(f, 0, 0, 0.60 * s, 0.86 * s, 0.25 * s, 8, rot, C.millWall);
    h.cone(f, 0, 0, 0.86 * s, 0.27 * s, 0.26 * s, 8, rot, C.roofA);

    const [dx, dy] = h.off(rot, 0.34 * s, 0);
    h.box(f, dx, dy, 0.02, 0.02 * s, 0.06 * s, 0.17 * s, rot, C.timber);

    return {
      s, rot, faces: f, dyn: [],
      spin: h.rnd() * 6.28, spinRate: h.rr(0.6, 1.1),
      hubZ: 0.72 * s, hubR: 0.38 * s
    };
  },

  anim(e, dt, h) {
    e.spin += dt * e.spinRate;
    const f = [], s = e.s, r = e.rot;
    const px = -Math.sin(r), py = Math.cos(r);          // in the sail plane, horizontal
    const hx = Math.cos(r) * e.hubR, hy = Math.sin(r) * e.hubR, hz = e.hubZ;

    for (let k = 0; k < 4; k++) {
      const a = e.spin + k * Math.PI / 2;
      const ca = Math.cos(a), sa = Math.sin(a);
      const dx = ca * px, dy = ca * py, dz = sa;        // along the sail
      const tx = -sa * px, ty = -sa * py, tz = ca;      // across it
      const P = (rr_, ww) => [
        hx + dx * rr_ + tx * ww, hy + dy * rr_ + ty * ww, hz + dz * rr_ + tz * ww
      ];
      const r0 = 0.10 * s, r1 = 0.62 * s, w = 0.088 * s;
      h.slab(f, P(r0, -w), P(r1, -w), P(r1, w), P(r0, w), h.CIDX.timber);
    }
    e.dyn = f;
  }
});
