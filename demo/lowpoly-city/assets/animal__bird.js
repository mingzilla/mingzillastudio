/* =========================================================================
   animal__bird.js — the only one that flies
   =========================================================================
   Circles a home point at a fixed radius, holding altitude above whatever
   ground is underneath (so it climbs over the hill rather than through it).
   Two wings on flat slabs, flapped by a sine on the Z axis.

   `flying: true` tells the renderer to keep it out of the walkable-tile
   bookkeeping that ground animals use.
   ========================================================================= */

function birdFaces(e, h) {
  const f = [], s = e.s, r = e.facing, C = h.CIDX;
  const P = (lx, ly, lz) => { const [ox, oy] = h.off(r, lx, ly); return [ox, oy, lz]; };

  h.blob(f, 0, 0, 0, 0.055 * s, 0.10 * s, 5, r, C.bird);

  const [hx, hy] = h.off(r, 0.075 * s, 0);
  h.blob(f, hx, hy, 0.015 * s, 0.030 * s, 0.042 * s, 5, r, C.bird);

  const tipZ = Math.sin(e.flap) * 0.16 * s;
  [-1, 1].forEach(side => {
    h.slab(f,
      P(0.06 * s, side * 0.04 * s, 0.012 * s),
      P(0.11 * s, side * 0.27 * s, tipZ),
      P(-0.10 * s, side * 0.27 * s, tipZ),
      P(-0.06 * s, side * 0.04 * s, 0.012 * s),
      C.birdWing);
  });
  return f;
}

defEntity({
  key: "bird", group: "animal", label: "Bird",
  mobile: true, flying: true,
  spawn: {
    mode: "scatter",
    biomes: [BIOME.GRASS, BIOME.FOREST, BIOME.FIELD, BIOME.WATER],
    density: 0.012, min: 6, max: 18
  },
  create({ t, h }) {
    const e = {
      s: h.rr(0.85, 1.25),
      ang: h.rnd() * Math.PI * 2,
      radius: h.rr(3.0, 8.0),
      spin: h.rr(0.20, 0.55),
      flap: h.rnd() * Math.PI * 2,
      flapRate: h.rr(6, 11),
      alt: h.rr(4.0, 9.0),
      homeX: t.cx, homeY: t.cy,
      owner: t,
      z: t.rz + 6
    };
    e.facing = e.ang + Math.PI / 2;
    e.dyn = birdFaces(e, h);
    return e;
  },
  anim(e, dt, h) {
    e.ang += dt * e.spin;
    e.x = e.homeX + Math.cos(e.ang) * e.radius;
    e.y = e.homeY + Math.sin(e.ang) * e.radius;
    e.facing = e.ang + Math.PI / 2;               // face along the tangent
    e.flap += dt * e.flapRate;

    const want = h.groundAt(e.x, e.y) + e.alt;
    e.z += (want - e.z) * Math.min(1, dt * 2);

    e.dyn = birdFaces(e, h);
  }
});
