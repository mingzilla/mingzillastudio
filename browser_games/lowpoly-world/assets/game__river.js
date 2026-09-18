/* =========================================================================
   game__river.js — carving the river, and the falls it drops over
   =========================================================================
   The river leaves the hill's shoulder, falls the whole remaining height of
   the hill in a single tile boundary — that drop IS the waterfall — and then
   eases across the plain to the sea.

   The fall is not drawn specially. A river tile whose neighbour is much lower
   gets a foam-coloured cliff face like any other, which happens to be exactly
   what falling water looks like from here.
   ========================================================================= */

function carveRiver() {
  let src = null, best = -Infinity;
  for (const t of tileList) {
    if (t.h <= SEA) continue;
    const score = t.h - Math.hypot(t.cx - hill.x, t.cy - hill.y) * 0.4;
    if (score > best) { best = score; src = t; }
  }
  if (!src) return;

  const path = [];
  const seen = new Set();
  let cur = src;
  for (let step = 0; step < 260; step++) {
    if (!cur || seen.has(key(cur.q, cur.r))) break;
    seen.add(key(cur.q, cur.r));
    path.push(cur);
    if (cur.biome === BIOME.WATER) break;
    let nxt = null, nbest = Infinity;
    for (const d of DIRS) {
      const n = tiles.get(key(cur.q + d[0], cur.r + d[1]));
      if (!n || seen.has(key(n.q, n.r))) continue;
      const score = n.h - Math.hypot(n.cx, n.cy) * 0.05;   // downhill first, outward as tiebreak
      if (score < nbest) { nbest = score; nxt = n; }
    }
    if (!nxt) break;
    cur = nxt;
  }
  if (path.length < 6) return;

  let prev = null, prevTile = null;
  for (let i = 0; i < path.length; i++) {
    const t = path[i];
    if (t.biome === BIOME.WATER) break;

    /* Sit just under the ground, and never higher than the tile upstream.
       Across the flat plain that is a constant height, so the water runs
       level; over the hill's shoulder it steps down, and those steps are the
       waterfalls. */
    let rz = t.h - 0.10;
    if (prev !== null) rz = Math.min(rz, prev);   // prev holds a height, not a tile
    rz = Math.max(rz, SEA);

    if (prevTile && (prevTile.rz - rz) > STEP * 1.2) {
      t.fall = true;
      prevTile.fall = true;                  // both ends of the drop
    }

    t.biome = BIOME.RIVER;
    t.h = rz; t.rz = rz; t.top = CIDX.river; t.side = CIDX.soil; t.rows = null;
    prev = rz; prevTile = t;
  }

  /* Widen it: one hex to alternating sides of the flow, so it reads as a river
     rather than a canal someone dug in a straight line. Never widen across the
     fall, or the waterfall becomes a very wide waterfall. */
  const wide = [];
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i];
    if (b.biome !== BIOME.RIVER || b.fall || a.fall) continue;
    const ang = Math.atan2(b.cy - a.cy, b.cx - a.cx) + (i % 2 ? Math.PI / 2 : -Math.PI / 2);
    const wx = worldToAxial(b.cx + Math.cos(ang) * 1.25, b.cy + Math.sin(ang) * 1.25);
    const n = tiles.get(key(wx.q, wx.r));
    if (n && n.biome !== BIOME.WATER && n.biome !== BIOME.RIVER) wide.push([n, b.rz]);
  }
  wide.forEach(([n, hz]) => {
    n.biome = BIOME.RIVER;
    n.h = Math.min(n.h, hz); n.rz = n.h;
    n.top = CIDX.river; n.side = CIDX.soil; n.rows = null;
  });

  /* Two bridges, or the river can cut the island in half and strand you. */
  const crossable = path.filter(t => t.biome === BIOME.RIVER && !t.fall);
  for (let n = 0; n < 2 && crossable.length > 5; n++) {
    const t = crossable[Math.floor(crossable.length * (n + 1) / 3)];
    const i = path.indexOf(t);
    const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)];
    t.bridge = true;
    t.bridgeRot = Math.atan2(b.cy - a.cy, b.cx - a.cx) + Math.PI / 2;
  }
}
