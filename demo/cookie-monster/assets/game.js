/* =========================================================================
   game.js — the field, the spawns, the keyboard, and the loop
   ========================================================================= */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const view = { w: 0, h: 0, dpr: 1 };

/* The field is ONE FLAT DISC with a ring of trees around it. Everything the
   player can touch lives inside PLAY_R, the trees live outside it, and
   nothing ever has to ask what the ground is doing. */
const ISLAND_R = 16.6;
const PLAY_R = 10.0;
const ROUND = 75;              // seconds
const SPEED = 7.4;             // units per second
const EAT_R = 0.72;

const PITCH = 0.46, SINP = Math.sin(PITCH), COSP = Math.cos(PITCH);
const cam = { x: 0, y: 0, yaw: 0.5, c: 0, s: 0, zoom: 80 };
cam.c = Math.cos(cam.yaw); cam.s = Math.sin(cam.yaw);

/* Screen up and screen right, in world units. The camera never turns, but
   the field is drawn rotated, so the keys have to be mapped through this or
   W walks diagonally. */
const UPX = cam.s, UPY = cam.c, RGX = cam.c, RGY = -cam.s;

/* The sun is fixed in WORLD space, so shading a face is a lookup into
   SHADE and no colour maths happens in the draw loop. */
const LIGHT = [-0.45, -0.30, 0.84];
function bandOf(n) {
  const d = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2];
  return Math.max(0, Math.min(3, Math.round((d * 0.75 + 0.5) * 3)));
}

const P0 = { x: 0, y: 0, d: 0 };
function project(x, y, z, out) {
  const dx = x - cam.x, dy = y - cam.y;
  const rx = dx * cam.c - dy * cam.s;
  const ry = dx * cam.s + dy * cam.c;
  out.x = view.w * 0.5 + rx * cam.zoom;
  out.y = view.h * 0.56 + (-ry * SINP - z * COSP) * cam.zoom;
  out.d = ry;
  return out;
}

/* ------------------------------------------------------------ the world */

const ground = [];    // one flat painting: the disc and the tufts on it
const props = [];     // the ring of trees, bushes and rocks
const items = [];     // the cookies and the broccoli
const say = { text: "", t: 0, idle: 4 };
const GAME = { score: 0, combo: 0, comboT: 0, time: ROUND, over: false, shake: 0 };

const GOOD = ["OM NOM NOM", "COOKIE!", "ME WANT MORE", "YUM YUM", "MORE COOKIE", "CRUNCHY"];
const BAD = ["BLEH!", "YUCK!", "NOT COOKIE", "EW EW EW", "ME TRICKED"];
const IDLE = ["ME WANT COOKIE", "COOKIE?", "HUNGRY...", "WHERE COOKIE"];

function spot(minR, maxR, clear) {
  for (let n = 0; n < 40; n++) {
    const a = Math.random() * TAU, d = minR + Math.random() * (maxR - minR);
    const x = Math.cos(a) * d, y = Math.sin(a) * d;
    if (Math.hypot(x, y) > maxR) continue;
    if (clear && Math.hypot(x - monster.x, y - monster.y) < clear) continue;
    return { x, y };
  }
  return { x: 0, y: 0 };
}

(function buildGround() {
  const rnd = mulberry(7);
  pad(ground, 0, 0, 0, ISLAND_R, 44, 0, CIDX.grass2);
  pad(ground, 0, 0, 0.001, ISLAND_R - 0.8, 44, 0, CIDX.grass);
  /* A few soft patches first, then a lot of small tufts. A checkerboard of
     two greens reads as a chessboard from up here — that was the first thing
     that looked wrong — but the same two greens at two sizes just read as
     grass. */
  for (let i = 0; i < 16; i++) {
    const a = rnd() * TAU, d = Math.sqrt(rnd()) * (ISLAND_R - 3);
    const cx = Math.cos(a) * d, cy = Math.sin(a) * d;
    const R = 1.6 + rnd() * 2.4, n = 5 + ((rnd() * 3) | 0), pts = [];
    for (let k = 0; k < n; k++) {
      const th = k * TAU / n, rr = R * (0.62 + rnd() * 0.55);
      pts.push([cx + Math.cos(th) * rr, cy + Math.sin(th) * rr, 0.002]);
    }
    push(ground, pts, (i & 1) ? CIDX.grass3 : CIDX.grass);
  }
  for (let i = 0; i < 260; i++) {
    const a = rnd() * TAU, d = Math.sqrt(rnd()) * (ISLAND_R - 1.2);
    pad(ground, Math.cos(a) * d, Math.sin(a) * d, 0.003, 0.09 + rnd() * 0.15, 3, rnd() * TAU, CIDX.tuft);
  }
})();

(function buildProps() {
  const kinds = [pineFaces, bushFaces, rockFaces];
  for (let i = 0; i < 30; i++) {
    const p = spot(PLAY_R + 0.9, ISLAND_R - 0.7, 0);
    props.push({
      x: p.x, y: p.y, size: 0.75 + Math.random() * 0.5,
      faces: kinds[i % 3](i * 977 + 3)
    });
  }
})();

let seed = 1;
function addItem(kind) {
  const p = spot(2.2, PLAY_R - 0.8, 2.4);
  items.push({
    x: p.x, y: p.y, kind, size: 0, dying: 0,
    faces: kind === "cookie" ? cookieFaces(seed++) : broccoliFaces(seed++)
  });
}
function count(kind) {
  let n = 0;
  for (const it of items) if (it.kind === kind && !it.dying) n++;
  return n;
}

/* ---------------------------------------------------------------- input */

const keys = {};
window.addEventListener("keydown", e => {
  const k = e.key.toLowerCase();
  keys[k] = 1;
  if (k === "r") reset();
  if (k === "h") document.body.classList.toggle("ui-off");
  if (k.startsWith("arrow") || k === " ") e.preventDefault();
});
window.addEventListener("keyup", e => { keys[e.key.toLowerCase()] = 0; });

const KEYS = {
  up: ["w", "arrowup"], down: ["s", "arrowdown"],
  left: ["a", "arrowleft"], right: ["d", "arrowright"]
};
function held(list) { return list.some(k => keys[k]) ? 1 : 0; }

/* --------------------------------------------------------------- update */

function update(dt) {
  monster.t += dt;

  if (!GAME.over) {
    GAME.time -= dt;
    if (GAME.time <= 0) { GAME.time = 0; GAME.over = true; say.text = "ME STILL HUNGRY"; say.t = 4; }
  }
  if (GAME.comboT > 0 && (GAME.comboT -= dt) <= 0) GAME.combo = 0;
  if (GAME.shake > 0) GAME.shake = Math.max(0, GAME.shake - dt * 3);
  if (say.t > 0) say.t -= dt;

  const up = held(KEYS.up) - held(KEYS.down), rt = held(KEYS.right) - held(KEYS.left);
  let mx = 0, my = 0, want = 0;
  if ((up || rt) && !GAME.over && monster.stun <= 0) {
    mx = UPX * up + RGX * rt; my = UPY * up + RGY * rt;
    const L = Math.hypot(mx, my); mx /= L; my /= L;
    want = 1;
  }

  monster.moving += (want - monster.moving) * Math.min(1, dt * 12);
  if (want) {
    const target = Math.atan2(my, mx);
    const da = ((target - monster.facing + Math.PI * 3) % TAU) - Math.PI;
    monster.facing += da * Math.min(1, dt * 13);
  }

  monster.x += mx * SPEED * dt; monster.y += my * SPEED * dt;
  const rr = Math.hypot(monster.x, monster.y);
  if (rr > PLAY_R) { monster.x *= PLAY_R / rr; monster.y *= PLAY_R / rr; }
  monster.walk += dt * 11 * monster.moving;

  /* eyes lag behind the walk, which is what makes them look loose */
  const lagX = Math.max(-0.06, Math.min(0.06, -mx * 0.05 * monster.moving));
  const lagY = Math.max(-0.06, Math.min(0.06, -my * 0.05 * monster.moving));
  monster.eyeLag[0] += (lagX - monster.eyeLag[0]) * Math.min(1, dt * 6);
  monster.eyeLag[1] += (lagY - monster.eyeLag[1]) * Math.min(1, dt * 6);
  monster.squash = Math.sin(monster.walk * 2) * 0.9 * monster.moving;

  if (monster.stun > 0) monster.stun -= dt;
  if (monster.chomp > 0) monster.chomp = Math.max(0, monster.chomp - dt);

  /* The jaw is the whole performance: it opens on the way to a cookie, snaps
     and chews on contact, and hangs open when he has been poisoned. */
  let open = 0;
  if (monster.chomp > 0) open = 0.45 + 0.55 * Math.abs(Math.sin(monster.chomp * 15));
  else if (monster.stun > 0) open = 0.9;
  else {
    let near = 9;
    for (const it of items) if (!it.dying && it.kind === "cookie")
      near = Math.min(near, Math.hypot(it.x - monster.x, it.y - monster.y));
    if (near < 2.4) open = 0.12 + 0.78 * (1 - near / 2.4);
  }
  monster.open += (open - monster.open) * Math.min(1, dt * 15);
  const lift = (monster.chomp > 0 || monster.stun > 0 || monster.open > 0.55) ? 1 : 0;
  monster.lift += (lift - monster.lift) * Math.min(1, dt * 8);

  /* ------------------------------------------------------ eating things */
  if (!GAME.over) for (const it of items) {
    if (it.dying) continue;
    if (Math.hypot(it.x - monster.x, it.y - monster.y) > EAT_R) continue;
    it.dying = 1;
    monster.chomp = 0.45;
    if (it.kind === "cookie") {
      GAME.combo++; GAME.comboT = 2.4;
      GAME.score += Math.min(3, 1 + Math.floor((GAME.combo - 1) / 3));
      say.text = GOOD[(Math.random() * GOOD.length) | 0]; say.t = 1.4;
    } else {
      GAME.combo = 0;
      GAME.score = Math.max(0, GAME.score - 3);
      monster.stun = 1.1;
      GAME.shake = 1;
      say.text = BAD[(Math.random() * BAD.length) | 0]; say.t = 1.8;
    }
  }

  /* items fade in, pop out, and are gone */
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    if (it.dying) { it.size -= dt * 5; if (it.size <= 0) items.splice(i, 1); }
    else if (it.size < 1) it.size = Math.min(1, it.size + dt * 4);
  }

  /* ------------------------------------------------------------- spawns */
  if (!GAME.over) {
    if (GAME.cookieT > 0) GAME.cookieT -= dt;
    else if (count("cookie") < 8) { addItem("cookie"); GAME.cookieT = 0.45; }
    if (count("cookie") < 2) { addItem("cookie"); GAME.cookieT = 0.45; }
    if (GAME.brocT > 0) GAME.brocT -= dt;
    else { if (count("broccoli") < 3) addItem("broccoli"); GAME.brocT = 3.2; }
  }

  /* and he talks to himself when nothing is happening */
  if (say.t <= 0 && !GAME.over && (say.idle -= dt) <= 0) {
    say.text = IDLE[(Math.random() * IDLE.length) | 0]; say.t = 1.6;
    say.idle = 5 + Math.random() * 5;
  }

  /* the camera trails the monster */
  const k = Math.min(1, dt * 5);
  cam.x += (monster.x - cam.x) * k;
  cam.y += (monster.y - cam.y) * k;
}

/* --------------------------------------------------------------- render */

function facing(n) { return n[0] * cam.s + n[1] * cam.c < 0.02; }

function fillPath(p, scale, ox, oy) {
  ctx.beginPath();
  for (let i = 0; i < p.length; i++) {
    const dx = ox + p[i][0] * scale - cam.x, dy = oy + p[i][1] * scale - cam.y;
    const rx = dx * cam.c - dy * cam.s, ry = dx * cam.s + dy * cam.c;
    const sx = view.w * 0.5 + rx * cam.zoom;
    const sy = view.h * 0.56 + (-ry * SINP - p[i][2] * scale * COSP) * cam.zoom;
    if (i) ctx.lineTo(sx, sy); else ctx.moveTo(sx, sy);
  }
  ctx.closePath();
}

function drawFlat(faces, scale, ox, oy) {
  for (const f of faces) {
    fillPath(f.p, scale, ox, oy);
    /* the ground faces straight up at a fixed sun, so it takes the one band
       every time and never needs a normal */
    const col = SHADE[f.c][2];
    ctx.fillStyle = col;
    ctx.fill();
    /* anti-aliasing leaves a hairline along every shared edge, which reads as
       a grid drawn over the grass */
    ctx.strokeStyle = col;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

/* Every solid here is convex, so anything facing away is hidden behind its
   own front. Dropping those roughly halves the fills. */
function drawFaces(faces, scale, ox, oy) {
  for (const f of faces) {
    if (!facing(f.n)) continue;
    fillPath(f.p, scale, ox, oy);
    ctx.fillStyle = SHADE[f.c][bandOf(f.n)];
    ctx.fill();
  }
}

function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawBubble() {
  if (say.t <= 0 || !say.text) return;
  const p = project(monster.x, monster.y, 2.15, P0);
  ctx.font = "600 17px ui-rounded, 'Segoe UI Rounded', system-ui, sans-serif";
  const w = ctx.measureText(say.text).width + 26, h = 33;
  const x = p.x - w / 2, y = p.y - h;
  ctx.globalAlpha = Math.min(1, say.t * 4);
  ctx.fillStyle = "rgba(255,253,247,0.95)";
  ctx.strokeStyle = "rgba(120,105,80,0.35)";
  ctx.lineWidth = 1.5;
  rr(x, y, w, h, 11);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(p.x - 7, y + h - 1); ctx.lineTo(p.x + 7, y + h - 1); ctx.lineTo(p.x, y + h + 10);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#2b3440";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(say.text, p.x, y + h / 2 + 1);
  ctx.globalAlpha = 1;
}

function render() {
  const g = ctx.createLinearGradient(0, 0, 0, view.h);
  g.addColorStop(0, "#a9d8ee");
  g.addColorStop(0.55, "#cfe8f4");
  g.addColorStop(1, "#eaf3e2");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, view.w, view.h);

  ctx.save();
  if (GAME.shake > 0) {
    ctx.translate((Math.random() - 0.5) * 9 * GAME.shake, (Math.random() - 0.5) * 9 * GAME.shake);
  }

  drawFlat(ground, 1, 0, 0);

  /* furthest first, so anything nearer paints over it */
  const list = props.concat(items);
  list.push({ x: monster.x, y: monster.y, faces: monsterFaces(), size: 1 });
  for (const e of list) e._d = (e.x - cam.x) * cam.s + (e.y - cam.y) * cam.c;
  list.sort((a, b) => b._d - a._d);
  for (const e of list) drawFaces(e.faces, e.size === undefined ? 1 : e.size, e.x, e.y);

  ctx.restore();
  drawBubble();
}

/* ------------------------------------------------------------------ HUD */

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const comboEl = document.getElementById("combo");
const overEl = document.getElementById("over");
const finalEl = document.getElementById("final");
let shown = { score: -1, time: -1, combo: -1 };

function syncHud() {
  if (shown.score !== GAME.score) { shown.score = GAME.score; scoreEl.textContent = GAME.score; }
  const secs = Math.ceil(GAME.time);
  if (shown.time !== secs) {
    shown.time = secs;
    timeEl.textContent = secs;
    timeEl.classList.toggle("low", secs <= 10);
  }
  const c = GAME.combo >= 3 && GAME.comboT > 0 ? GAME.combo : 0;
  if (shown.combo !== c) {
    shown.combo = c;
    comboEl.textContent = c ? "COMBO x" + c : "";
  }
  const on = GAME.over;
  if (overEl.classList.contains("on") !== on) {
    overEl.classList.toggle("on", on);
    if (on) finalEl.textContent = GAME.score + (GAME.score > 0 ? " crumbs" : " crumbs. None. Sad.");
  }
}

function reset() {
  items.length = 0;
  monsterReset();
  cam.x = 0; cam.y = 0;
  GAME.score = 0; GAME.combo = 0; GAME.comboT = 0; GAME.time = ROUND;
  GAME.over = false; GAME.shake = 0; GAME.cookieT = 0; GAME.brocT = 1.5;
  say.text = "ME WANT COOKIE"; say.t = 2; say.idle = 6;
  for (let i = 0; i < 6; i++) addItem(i === 5 ? "broccoli" : "cookie");
}

/* ---------------------------------------------------------------- start */

function resize() {
  view.dpr = Math.min(2, window.devicePixelRatio || 1);
  view.w = window.innerWidth;
  view.h = window.innerHeight;
  canvas.width = Math.round(view.w * view.dpr);
  canvas.height = Math.round(view.h * view.dpr);
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
}

window.addEventListener("resize", resize);
resize();
reset();
document.getElementById("again").addEventListener("click", reset);
document.getElementById("toggle").addEventListener("click", () => {
  document.body.classList.toggle("ui-off");
});

let last = 0;
function frame(ts) {
  requestAnimationFrame(frame);
  if (!last) last = ts;
  const dt = Math.min(0.05, (ts - last) / 1000);
  last = ts;
  update(dt);
  render();
  syncHud();
}
requestAnimationFrame(frame);
