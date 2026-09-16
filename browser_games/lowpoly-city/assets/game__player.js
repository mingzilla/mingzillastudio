/* =========================================================================
   game__player.js — the character you are
   ========================================================================= */

const player = { x: 0, y: 0, z: 0, facing: 0, walk: 0, moving: 0, run: 0, faces: [] };

function spawnPlayer() {
  let home = null, best = Infinity;
  for (const t of tileList) {
    if (t.biome !== BIOME.GRASS || t.h <= SEA || t.h > PLAIN) continue;
    const d = t.cx * t.cx + t.cy * t.cy;
    if (d < best) { best = d; home = t; }
  }
  if (!home) home = tileList.find(t => dryLand(t)) || tileList[0];
  player.x = home.cx; player.y = home.cy; player.z = home.rz;
  player.facing = 0; player.walk = 0; player.moving = 0;
  cam.x = player.x; cam.y = player.y; cam.z = player.z;
}

function buildPlayer() {
  const f = [];
  const s = 0.78;
  const swing = Math.sin(player.walk) * player.moving;
  const bob = Math.abs(Math.cos(player.walk)) * 0.03 * player.moving;
  const c = Math.cos(player.facing), sn = Math.sin(player.facing);
  const fwd = (dx, dy) => [dx * c - dy * sn, dx * sn + dy * c];

  [-1, 1].forEach(side => {
    const kick = side * swing * 0.10 * s;
    const [lx, ly] = fwd(0.105 * s + kick, 0);
    box(f, lx, ly, 0.02, 0.055 * s, 0.045 * s, 0.30 * s, player.facing, CIDX.trousers);
  });

  const zb = 0.30 * s + bob;
  box(f, 0, 0, zb, 0.155 * s, 0.125 * s, 0.36 * s, player.facing, CIDX.coat);

  [-1, 1].forEach(side => {
    const kick = -side * swing * 0.075 * s;
    const [ax, ay] = fwd(0.20 * s + kick, 0);
    box(f, ax, ay, zb + 0.05 * s, 0.045 * s, 0.045 * s, 0.24 * s, player.facing, CIDX.coat);
  });

  const hz = zb + 0.36 * s + 0.11 * s;
  blob(f, 0, 0, hz, 0.115 * s, 0.20 * s, 6, player.facing, CIDX.skin);
  cone(f, 0, 0, hz + 0.07 * s, 0.115 * s, 0.10 * s, 6, player.facing, CIDX.hat);

  player.faces = f;
}
