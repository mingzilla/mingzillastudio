/* =========================================================================
   game__world.js — building the valley: tiles, biomes and furrows
   ========================================================================= */

function buildWorld(seed) {
  rng = d3.randomLcg(seed);
  buildPerm();
  tiles = new Map(); tileList = []; entities = [];

  const R = HEX_R;
  const span = SQ3 * HEX_SIZE * R * 0.95;

  /* one hill, parked a little off centre at a random bearing */
  const hillAng = rng() * Math.PI * 2, hillDist = span * 0.34;
  hill = { x: Math.cos(hillAng) * hillDist, y: Math.sin(hillAng) * hillDist };

  for (let q = -R; q <= R; q++) {
    for (let r = Math.max(-R, -q - R); r <= Math.min(R, -q + R); r++) {
      const c = hexCenter(q, r);

      const rim = smoothstep(RIM_IN, RIM_OUT, Math.hypot(c.x, c.y) / span);
      let h = PLAIN * (1 - rim);

      const hd = Math.hypot(c.x - hill.x, c.y - hill.y) / HILL_R;
      if (hd < 1) h += HILL_H * (1 - smoothstep(0.55, 1.0, hd));

      h = Math.round(h / STEP) * STEP;

      const moist = fbm(c.x * 0.075 + 310.7, c.y * 0.075 + 310.7, 3);
      const season = fbm(c.x * 0.052 + 880.1, c.y * 0.052 + 880.1, 2);

      const wx = new Array(6), wy = new Array(6);
      for (let i = 0; i < 6; i++) { wx[i] = c.x + CORNER[i].x; wy[i] = c.y + CORNER[i].y; }

      const t = {
        q, r, cx: c.x, cy: c.y, h, moist, season,
        biome: h <= SEA ? BIOME.WATER : BIOME.GRASS,
        rz: h <= SEA ? SEA : h,
        nb: new Array(6).fill(null),
        wx, wy,
        top: CIDX.grassA, side: CIDX.soil, rows: null,
        _vis: false, _d: 0
      };
      tiles.set(key(q, r), t);
      tileList.push(t);
    }
  }

  tileList.forEach(t => {
    for (let i = 0; i < 6; i++) {
      const d = DIRS[EDGE_TO_DIR[i]];
      t.nb[i] = tiles.get(key(t.q + d[0], t.r + d[1])) || null;
    }
  });

  // biome pass — needs neighbours, so it runs after linking
  tileList.forEach(t => {
    if (t.biome === BIOME.WATER) {
      const shallow = t.nb.some(n => n && n.biome !== BIOME.WATER);
      t.top = shallow ? CIDX.water : CIDX.waterDeep;
      t.side = CIDX.base;
      return;
    }
    if (t.biome === BIOME.RIVER) { t.top = CIDX.river; t.side = CIDX.soil; return; }

    const shore = t.nb.some(n => n && (n.biome === BIOME.WATER || n.biome === BIOME.RIVER));
    if (shore) t.biome = BIOME.SAND;
    else if (t.moist > 0.55) t.biome = BIOME.FOREST;
    else if (t.moist < 0.405) t.biome = BIOME.FIELD;
    else t.biome = BIOME.GRASS;

    t.top = topColorFor(t.biome, t);
    if (t.biome === BIOME.FIELD) {
      const ang = fbm(t.cx * 0.019 + 700.3, t.cy * 0.019 + 700.3, 2) * Math.PI * 1.6;
      t.rows = makeFurrows(t.wx, t.wy, ang);
    }
  });

  carveRiver();
  decorate();
}

function topColorFor(biome, t) {
  if (biome === BIOME.RIVER) return CIDX.river;
  if (biome === BIOME.WATER) return CIDX.water;
  if (biome === BIOME.SAND) return CIDX.sand;
  if (biome === BIOME.FOREST) return CIDX.forestFloor;
  if (biome === BIOME.FIELD) return CIDX.cropA;
  const p = hash2(Math.round(t.cx * 7), Math.round(t.cy * 7));
  return p < 0.28 ? CIDX.grassA : p < 0.56 ? CIDX.grassB : p < 0.81 ? CIDX.grassC : CIDX.grassD;
}

/* Furrows: clip the hex against a slab running across it. Done in world space
   rather than screen space so they stay stuck to the ground as the camera turns. */
function makeFurrows(wx, wy, ang) {
  const nx = Math.cos(ang), ny = Math.sin(ang);
  let mn = Infinity, mx = -Infinity;
  const poly = [];
  for (let i = 0; i < 6; i++) {
    const d = wx[i] * nx + wy[i] * ny;
    if (d < mn) mn = d;
    if (d > mx) mx = d;
    poly.push([wx[i], wy[i]]);
  }
  const rows = [];
  const n = 3;
  for (let k = 0; k < n; k++) {
    const a = mn + (mx - mn) * (k / n) + 0.03;
    const b = mn + (mx - mn) * ((k + 0.34) / n);
    let seg = clipHalf(poly, nx, ny, b);
    if (seg.length >= 3) seg = clipHalf(seg, -nx, -ny, -a);
    if (seg.length >= 3) rows.push(seg);
  }
  return rows;
}

function clipHalf(poly, nx, ny, c) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const da = nx * a[0] + ny * a[1] - c, db = nx * b[0] + ny * b[1] - c;
    if (da <= 0) out.push(a);
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
      const t = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}
