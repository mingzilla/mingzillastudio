/* =========================================================================
   game__movement.js — walking, and the per-frame update
   ========================================================================= */

function tryMove(nx, ny) {
  const t = tileAtWorld(nx, ny);
  if (!walkable(t)) return false;
  if (Math.abs(t.rz - player.z) > 2.2) return false;       // no scaling sheer cliffs
  player.x = nx; player.y = ny;
  return true;
}

function update(dt) {
  const turn = (keys["q"] ? 1 : 0) - (keys["e"] ? 1 : 0);
  if (turn) cam.yaw += turn * dt * 1.9;
  cam.c = Math.cos(cam.yaw); cam.s = Math.sin(cam.yaw);

  if (keys["="] || keys["+"]) cam.target = Math.min(MAX_ZOOM, cam.target * (1 + dt * 1.7));
  if (keys["-"] || keys["_"]) cam.target = Math.max(MIN_ZOOM, cam.target / (1 + dt * 1.7));
  cam.zoom += (cam.target - cam.zoom) * Math.min(1, dt * 8);

  /* Keys and stick are summed, then normalised below — so the stick picks the
     direction and its how-far-out only decides walk against run. */
  const ix = (keys["d"] || keys["arrowright"] ? 1 : 0) - (keys["a"] || keys["arrowleft"] ? 1 : 0) + stick.x;
  const iy = (keys["w"] || keys["arrowup"] ? 1 : 0) - (keys["s"] || keys["arrowdown"] ? 1 : 0) + stick.y;
  const running = !!keys["shift"] || stick.mag > RUN_AT;
  player.run = running ? 1 : 0;

  if (ix || iy) {
    /* Normalise in SCREEN space first, then boost the toward/away axis, then
       rotate into the world. Normalising after the rotation would cancel the
       boost straight back out. */
    const mag = Math.hypot(ix, iy);
    const sx = ix / mag;
    const sy = iy / mag * DEPTH_SPEED;
    let dx = sx * cam.c + sy * cam.s;
    let dy = -sx * cam.s + sy * cam.c;

    const step = (running ? RUN_SPEED : WALK_SPEED) * dt;
    if (tryMove(player.x + dx * step, player.y + dy * step)) { /* clean */ }
    else if (tryMove(player.x + dx * step, player.y)) { dy = 0; }
    else if (tryMove(player.x, player.y + dy * step)) { dx = 0; }
    else { dx = 0; dy = 0; }

    if (dx || dy) {
      const want = Math.atan2(dy, dx);
      const diff = ((want - player.facing + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      player.facing += diff * Math.min(1, dt * 12);
    }
    const moved = (dx || dy) ? 1 : 0;
    player.moving += (moved - player.moving) * Math.min(1, dt * 10);
    player.walk += dt * (running ? 15 : 9.5) * player.moving;
  } else {
    player.moving += (0 - player.moving) * Math.min(1, dt * 12);
  }

  const t = tileAtWorld(player.x, player.y);
  if (t) player.z += (t.rz - player.z) * Math.min(1, dt * 12);

  buildPlayer();
  updateEntities(dt);

  cam.x += (player.x - cam.x) * Math.min(1, dt * 6);
  cam.y += (player.y - cam.y) * Math.min(1, dt * 6);
  cam.z += (player.z - cam.z) * Math.min(1, dt * 6);
}
