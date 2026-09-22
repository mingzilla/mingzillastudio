/* =========================================================================
   game.js — everything around the shapes: the ground, the camera, the
   drawing, the keyboard, and the loop.
   ========================================================================= */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const view = { w: 0, h: 0, dpr: 1 };

/* The ground is ONE FLAT DISC. No heights, no tiles, no biomes — every point
   inside the radius is walkable and everything stands at z = 0, so nothing in
   the game ever has to ask what the ground is doing. */
const ISLAND_R = 22;
const TAU = Math.PI * 2;

/* Camera elevation, in radians above the ground plane. Small is flat, which
   foreshortens the ground; this is a middle setting that still shows depth. */
const PITCH = 0.42, SINP = Math.sin(PITCH), COSP = Math.cos(PITCH);
const WALK = 8, RUN = 16;

const cam = { x: 0, y: 0, yaw: 0.5, c: 1, s: 0, zoom: 72, target: 72 };

/* The sun is fixed in WORLD space, so the camera turning does not drag it
   around the sky. Shading a face is a lookup into SHADE. */
const LIGHT = [-0.45, -0.30, 0.84];
function bandOf(n) {
  const d = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2];
  return Math.max(0, Math.min(3, Math.round((d * 0.75 + 0.5) * 3)));
}

function project(x, y, z, out) {
  const dx = x - cam.x, dy = y - cam.y;
  const rx = dx * cam.c - dy * cam.s;
  const ry = dx * cam.s + dy * cam.c;
  out.x = view.w * 0.5 + rx * cam.zoom;
  out.y = view.h * 0.58 + (-ry * SINP - z * COSP) * cam.zoom;
  out.d = ry;
  return out;
}

function inBounds(x, y) { return x * x + y * y < (ISLAND_R - 1.4) ** 2; }

/* ------------------------------------------------------------ the world */

const world = [];       // everything drawn, the character included
const animals = [];     // the subset of it that walks about

function spot(minR, maxR) {
  let x, y, n = 0;
  do {
    const a = Math.random() * TAU, d = minR + Math.random() * (maxR - minR);
    x = Math.cos(a) * d; y = Math.sin(a) * d;
  } while (!inBounds(x, y) && ++n < 20);
  return { x, y };
}

function addStill(faces, count, minR, maxR, lo, hi) {
  for (let i = 0; i < count; i++) {
    const p = spot(minR, maxR);
    world.push({ x: p.x, y: p.y, faces: faces(lo + Math.random() * (hi - lo)), size: 1 });
  }
}

function addAnimals(spec) {
  for (let i = 0; i < spec.count; i++) {
    const p = spot(4, ISLAND_R - 2);
    const e = {
      x: p.x, y: p.y, homeX: p.x, homeY: p.y, tx: p.x, ty: p.y,
      size: 0.9 + Math.random() * 0.25, facing: Math.random() * TAU,
      phase: Math.random() * TAU, moving: 0, wait: Math.random() * 2,
      spec, faces: []
    };
    e.faces = spec.faces(e);
    world.push(e);
    animals.push(e);
  }
}

function buildWorld() {
  world.length = 0; animals.length = 0;
  addStill(treeFaces, 30, 5, ISLAND_R - 1, 0.8, 1.5);
  addStill(rockFaces, 9, 4, ISLAND_R - 1, 0.7, 1.5);
  addAnimals(SHEEP);
  addAnimals(COW);
  world.push(player);
}

/* Graze, wander a bit, pause, repeat. Never walks off the island. */
function updateAnimal(e, dt) {
  const sp = e.spec;
  if (e.wait > 0) {
    e.wait -= dt;
    e.moving += (0 - e.moving) * Math.min(1, dt * 5);
  } else {
    const dx = e.tx - e.x, dy = e.ty - e.y, d = Math.hypot(dx, dy);
    if (d < 0.1) {
      e.wait = sp.rest[0] + Math.random() * (sp.rest[1] - sp.rest[0]);
      const a = Math.random() * TAU, r = 1 + Math.random() * 5;
      const nx = e.homeX + Math.cos(a) * r, ny = e.homeY + Math.sin(a) * r;
      if (inBounds(nx, ny)) { e.tx = nx; e.ty = ny; }
      else { e.tx = e.homeX; e.ty = e.homeY; }
    } else {
      const step = sp.speed * dt;
      const nx = e.x + dx / d * step, ny = e.y + dy / d * step;
      if (inBounds(nx, ny)) { e.x = nx; e.y = ny; }
      const want = Math.atan2(dy, dx);
      e.facing += (((want - e.facing + Math.PI * 3) % TAU) - Math.PI) * Math.min(1, dt * 6);
      e.moving = Math.min(1, e.moving + dt * 4);
      e.phase += dt * sp.gait;
    }
  }
  e.faces = sp.faces(e);
}

/* ------------------------------------------------------------- the input */

const keys = Object.create(null);
const ALIAS = { arrowup: "w", arrowleft: "a", arrowdown: "s", arrowright: "d" };
const keyName = ev => ALIAS[ev.key.toLowerCase()] || ev.key.toLowerCase();
const toggleUI = () => document.body.classList.toggle("ui-off");

document.getElementById("toggle").addEventListener("click", toggleUI);

window.addEventListener("keydown", ev => {
  const k = keyName(ev);
  if (k === "h") { toggleUI(); return; }
  keys[k] = true;
  if (k === "w" || k === "a" || k === "s" || k === "d") ev.preventDefault();
});
window.addEventListener("keyup", ev => { keys[keyName(ev)] = false; });
/* alt-tabbing away mid-stride would otherwise leave the key stuck down */
window.addEventListener("blur", () => { for (const k in keys) keys[k] = false; });
window.addEventListener("wheel", ev => {
  cam.target = Math.max(16, Math.min(110, cam.target * (ev.deltaY > 0 ? 0.9 : 1.11)));
}, { passive: true });

/* -------------------------------------------------------------- the loop */

function update(dt) {
  const turn = (keys.q ? 1 : 0) - (keys.e ? 1 : 0);
  if (turn) cam.yaw += turn * dt * 1.9;
  cam.c = Math.cos(cam.yaw);
  cam.s = Math.sin(cam.yaw);

  if (keys["="] || keys["+"]) cam.target = Math.min(110, cam.target * (1 + dt * 1.7));
  if (keys["-"] || keys["_"]) cam.target = Math.max(16, cam.target / (1 + dt * 1.7));
  cam.zoom += (cam.target - cam.zoom) * Math.min(1, dt * 8);

  const ix = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
  const iy = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);
  const running = !!keys.shift;

  if (ix || iy) {
    /* Rotate the input into the world. DEPTH makes the toward/away axis faster
       than the left/right one, because flattening the camera makes walking up
       the screen look only half as quick as walking across it. */
    const mag = Math.hypot(ix, iy);
    const sx = ix / mag, sy = iy / mag * 2;
    const dx = sx * cam.c + sy * cam.s, dy = -sx * cam.s + sy * cam.c;
    const step = (running ? RUN : WALK) * dt;

    if (inBounds(player.x + dx * step, player.y + dy * step)) {
      player.x += dx * step; player.y += dy * step;
    } else if (inBounds(player.x + dx * step, player.y)) {
      player.x += dx * step;                       // slide along the rim
    } else if (inBounds(player.x, player.y + dy * step)) {
      player.y += dy * step;
    }

    const face = Math.atan2(dy, dx);
    player.facing += (((face - player.facing + Math.PI * 3) % TAU) - Math.PI) * Math.min(1, dt * 12);
    player.moving += (1 - player.moving) * Math.min(1, dt * 10);
    player.walk += dt * (running ? 15 : 9.5) * player.moving;
  } else {
    player.moving += (0 - player.moving) * Math.min(1, dt * 12);
  }
  player.faces = characterFaces();

  for (const e of animals) updateAnimal(e, dt);

  cam.x += (player.x - cam.x) * Math.min(1, dt * 6);
  cam.y += (player.y - cam.y) * Math.min(1, dt * 6);
}

/* ------------------------------------------------------------ the drawing */

const PT = { x: 0, y: 0, d: 0 };

function resize() {
  view.dpr = Math.min(window.devicePixelRatio || 1, 2);
  view.w = window.innerWidth;
  view.h = window.innerHeight;
  canvas.width = Math.floor(view.w * view.dpr);
  canvas.height = Math.floor(view.h * view.dpr);
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
}

function disc(rad) {
  const N = 36;
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const a = i / N * TAU;
    project(Math.cos(a) * rad, Math.sin(a) * rad, 0, PT);
    if (i === 0) ctx.moveTo(PT.x, PT.y); else ctx.lineTo(PT.x, PT.y);
  }
  ctx.closePath();
}

/* A flat uniform green gives you nothing to judge movement against, so the
   grass is broken into patches. Low contrast on purpose: enough to see your
   own motion, not enough to read as a chessboard. */
const CELL = 2.2;
const P = [{ x: 0, y: 0, d: 0 }, { x: 0, y: 0, d: 0 }, { x: 0, y: 0, d: 0 }, { x: 0, y: 0, d: 0 }];

function drawGround() {
  disc(ISLAND_R);                                   // the soil under the rim
  ctx.fillStyle = SHADE[CIDX.soil][2];
  ctx.fill();

  ctx.save();
  disc(ISLAND_R - 0.8);                             // never spills over the edge
  ctx.clip();
  const N = Math.ceil(ISLAND_R / CELL);
  for (let gx = -N; gx < N; gx++) {
    for (let gy = -N; gy < N; gy++) {
      const x0 = gx * CELL, y0 = gy * CELL;
      if (Math.hypot(x0, y0) > ISLAND_R + CELL) continue;
      project(x0, y0, 0, P[0]);
      project(x0 + CELL, y0, 0, P[1]);
      project(x0 + CELL, y0 + CELL, 0, P[2]);
      project(x0, y0 + CELL, 0, P[3]);
      ctx.beginPath();
      ctx.moveTo(P[0].x, P[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(P[i].x, P[i].y);
      ctx.closePath();
      const col = SHADE[((gx + gy) & 1) ? CIDX.grass : CIDX.grass2][2];
      ctx.fillStyle = col;
      ctx.fill();
      /* anti-aliasing leaves a hairline between two patches sharing an edge,
         which reads as a grid drawn over the grass */
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  ctx.restore();
}

/* Every solid in this game is convex, so anything facing away is hidden behind
   its own front. Dropping those roughly halves the fills. */
function facing(n) { return n[0] * cam.s + n[1] * cam.c < 0.02; }

function drawFaces(faces, ox, oy, scale) {
  const halfW = view.w * 0.5, baseY = view.h * 0.58;
  for (const f of faces) {
    if (!facing(f.n)) continue;
    const p = f.p;
    ctx.beginPath();
    for (let i = 0; i < p.length; i++) {
      const dx = ox + p[i][0] * scale - cam.x;
      const dy = oy + p[i][1] * scale - cam.y;
      const rx = dx * cam.c - dy * cam.s;
      const ry = dx * cam.s + dy * cam.c;
      const sx = halfW + rx * cam.zoom;
      const sy = baseY + (-ry * SINP - p[i][2] * scale * COSP) * cam.zoom;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fillStyle = SHADE[f.c][bandOf(f.n)];
    ctx.fill();
  }
}

function render() {
  const g = ctx.createLinearGradient(0, 0, 0, view.h);
  g.addColorStop(0, "#a4d6ed");
  g.addColorStop(0.5, "#cfe8f4");
  g.addColorStop(1, "#e6f0e0");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, view.w, view.h);

  drawGround();

  /* furthest first, so anything nearer paints over it */
  for (const e of world) e._d = (e.x - cam.x) * cam.s + (e.y - cam.y) * cam.c;
  world.sort((a, b) => b._d - a._d);
  for (const e of world) drawFaces(e.faces, e.x, e.y, e.size);
}

/* ------------------------------------------------------------------ start */

window.addEventListener("resize", resize);
resize();

/* Face the camera at the start rather than facing zero, so the first thing you
   look at is a face with eyes on it and not the back of a head. */
buildWorld();
player.facing = -(cam.yaw + Math.PI / 2);
player.faces = characterFaces();

let last = 0;
function frame(ts) {
  requestAnimationFrame(frame);
  if (!last) last = ts;
  const dt = Math.min(0.05, (ts - last) / 1000);
  last = ts;
  update(dt);
  render();
}
requestAnimationFrame(frame);
