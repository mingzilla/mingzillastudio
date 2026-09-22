/* =========================================================================
   building__watermill.js — a shed with a wheel that turns
   =========================================================================
   Only ever built on a bank with river on at least one side, and it is turned
   to face that water: the wheel hangs off the gable end on an axle running out
   of the wall, so the building is aiming its one interesting feature at the
   river rather than at whatever the seed happened to pick.

   The wheel is deliberately taller than the shed. It is the only moving part
   on any building in the valley, and at this size it still reads as turning
   from the far zoom, which a hobbit-sized wheel would not.

   The wheel is the same trick as the windmill's sails: geometry rebuilt from
   `spin` every tick and parked in `e.dyn`, so the renderer draws it in the
   same pass as the building. It turns in the plane of the wall — its axle runs
   along the building's own x — because a wheel seen edge-on shows nothing but
   a line, and the camera can be anywhere.
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

    /* point the wheel at the river. +x is where the wheel goes, so aim +x at
       the first neighbouring river tile we can find. */
    let rot = h.rnd() * Math.PI * 2;
    for (const d of DIRS) {
      const n = tiles.get(key(t.q + d[0], t.r + d[1]));
      if (!n || n.biome !== BIOME.RIVER) continue;
      const c = hexCenter(t.q + d[0], t.r + d[1]);
      rot = Math.atan2(c.y - t.cy, c.x - t.cx);
      break;
    }

    const f = [], C = h.CIDX;
    const hx = 0.22 * s, hy = 0.18 * s, hh = 0.26 * s;

    h.box(f, 0, 0, 0, hx, hy, hh, rot, C.millWall);
    /* the gable overhang is trimmed right back: at the house's 1.30 the roof
       reaches out past the wheel and the two grow through each other */
    h.gableRoof(f, 0, 0, hh, hx * 1.12, hy * 1.45, 0.22 * s, rot, C.roofB);

    /* the door is on the far end, so you come in off the land */
    const [dx, dy] = h.off(rot, -hx * 1.03, 0);
    h.box(f, dx, dy, 0, 0.014, 0.05 * s, 0.15 * s, rot, C.door);

    /* The wheel. Its whole width has to clear the wall AND the eaves, so it
       stands off by both. hubZ = hubR puts the rim exactly on the ground. */
    const hubW = 0.052 * s, hubR = 0.28 * s, hubZ = hubR;
    const hubX = hx + hubW + 0.07 * s;
    const axleOut = hubX + hubW + 0.07 * s;

    /* the axle, out through the wall at one end and the hub at the other */
    h.box(f, (hx - 0.02 * s + axleOut) / 2, 0, hubZ - 0.024 * s,
      (axleOut - hx + 0.02 * s) / 2, 0.024 * s, 0.048 * s, rot, C.timber);
    /* and a bearing post under its outer end, standing on the ground */
    const [px, py] = h.off(rot, axleOut - 0.03 * s, 0);
    h.box(f, px, py, 0, 0.024 * s, 0.024 * s, hubZ - 0.024 * s, rot, C.timber);

    return {
      s, rot, faces: f, dyn: [],
      spin: h.rnd() * 6.28, spinRate: h.rr(0.5, 0.9),
      hubX, hubZ, hubR, hubW
    };
  },

  anim(e, dt, h) {
    e.spin += dt * e.spinRate;
    const f = [], r = e.rot;
    const P = (lx, ly, lz) => { const [wx, wy] = h.off(r, lx, ly); return [wx, wy, lz]; };
    const w = e.hubW, r0 = 0.30;
    for (let k = 0; k < 8; k++) {
      const a = e.spin + k * Math.PI / 4;
      const ca = Math.cos(a), sa = Math.sin(a);
      /* each paddle runs from an inner radius out to the rim, and spans the
         wheel's full width */
      const iy = ca * e.hubR * r0, iz = e.hubZ + sa * e.hubR * r0;
      const oy = ca * e.hubR, oz = e.hubZ + sa * e.hubR;
      h.slab(f,
        P(e.hubX - w, iy, iz), P(e.hubX + w, iy, iz),
        P(e.hubX + w, oy, oz), P(e.hubX - w, oy, oz),
        k % 2 ? h.CIDX.timber : h.CIDX.plank);
    }
    e.dyn = f;
  }
});
