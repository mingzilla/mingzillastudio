/* =========================================================================
   game__touch.js — the on-screen stick and buttons
   =========================================================================
   The stick writes into the same ix/iy pair the keyboard writes into, so the
   movement code cannot tell the two apart. Pushed to the rim it runs,
   which saves a run button. It is all pointer events, so one code path covers
   a thumb, a stylus and a mouse.
   ========================================================================= */

const stick = { x: 0, y: 0, mag: 0, live: false, id: null, cx: 0, cy: 0, r: 1 };
const DEAD_ZONE = 0.16;      // of the radius, so a thumb resting off-centre is still
const RUN_AT = 0.88;         // past this much push you run instead of walk
const KNOB_TRAVEL = 0.55;    // of the radius; further and the knob leaves the ring

const padEl = document.getElementById("pad");
const stickEl = document.getElementById("stick");
const knobEl = document.getElementById("knob");

/* true when the pad is on screen — a phone should not be told to press Space */
const padIsOn = () => getComputedStyle(padEl).display !== "none";

function knobPaint() {
  const t = stick.r * KNOB_TRAVEL;
  knobEl.style.transform = "translate(" + (stick.x * t) + "px," + (-stick.y * t) + "px)";
}

function stickCentre() {
  const b = stickEl.getBoundingClientRect();
  stick.cx = b.left + b.width / 2;
  stick.cy = b.top + b.height / 2;
  stick.r = b.width / 2;
}

function stickSet(px, py) {
  const dx = px - stick.cx, dy = py - stick.cy;
  const d = Math.hypot(dx, dy) || 1;
  const reach = Math.min(d, stick.r);
  stick.mag = reach / stick.r < DEAD_ZONE ? 0 : reach / stick.r;
  if (!stick.mag) { stick.x = 0; stick.y = 0; return; }
  stick.x = dx * reach / d / stick.r;
  stick.y = -(dy * reach / d / stick.r);     // screen up is "away from the camera"
}

function stickEnd(ev) {
  if (ev && ev.pointerId !== stick.id) return;
  stick.live = false; stick.id = null;
  stick.x = 0; stick.y = 0; stick.mag = 0;
  knobPaint();
}

stickEl.addEventListener("pointerdown", ev => {
  if (stick.live) return;                    // one thumb on the stick, one on the buttons
  ev.preventDefault();
  stickCentre();
  stick.live = true; stick.id = ev.pointerId;
  stickEl.setPointerCapture(ev.pointerId);
  stickSet(ev.clientX, ev.clientY);
  knobPaint();
});
stickEl.addEventListener("pointermove", ev => {
  if (!stick.live || ev.pointerId !== stick.id) return;
  ev.preventDefault();
  stickSet(ev.clientX, ev.clientY);
  knobPaint();
});
stickEl.addEventListener("pointerup", stickEnd);
stickEl.addEventListener("pointercancel", stickEnd);
stickEl.addEventListener("wheel", ev => { ev.preventDefault(); zoomStep(ev.deltaY); }, { passive: false });
window.addEventListener("blur", () => stickEnd());

/* A held button, not a tapped one: the camera should keep turning for as long
   as the thumb stays down. */
function holdButton(el, k) {
  el.addEventListener("pointerdown", ev => {
    ev.preventDefault();
    keys[k] = true;
    el.classList.add("down");
    el.setPointerCapture(ev.pointerId);
  });
  const up = () => { keys[k] = false; el.classList.remove("down"); };
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", up);
  el.addEventListener("contextmenu", ev => ev.preventDefault());
}
holdButton(document.getElementById("actTurnL"), "q");
holdButton(document.getElementById("actTurnR"), "e");

const plantBtn = document.getElementById("actPlant");
plantBtn.addEventListener("pointerdown", ev => {
  ev.preventDefault();
  plantBtn.classList.add("down");
  plantTree();
});
["pointerup", "pointercancel"].forEach(t =>
  plantBtn.addEventListener(t, () => plantBtn.classList.remove("down")));

const uiToggle = document.getElementById("uiToggle");
function toggleUI(force) {
  const off = force === undefined
    ? !document.body.classList.contains("ui-off")
    : force;
  document.body.classList.toggle("ui-off", off);
  uiToggle.title = (off ? "Show" : "Hide") + " the panel (H)";
}
uiToggle.addEventListener("click", () => toggleUI());

const hint = document.getElementById("hint");
let hintTimer = null;
function showHint(msg) {
  hint.innerHTML = msg;
  hint.classList.add("on");
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => hint.classList.remove("on"), 2400);
}

let planted = 0;
function plantTree() {
  const px = player.x + Math.cos(player.facing) * 0.95;
  const py = player.y + Math.sin(player.facing) * 0.95;
  const t = tileAtWorld(px, py);
  if (!t || !dryLand(t)) { showHint("Not in the water, thanks."); return; }
  const e = spawnEntity(rnd() < 0.6 ? "pine" : "leaf", t);
  if (!e) return;
  e.x = px; e.y = py; e.birth = now;
  planted++;
  if (planted === 1) showHint("Nice. " + (padIsOn() ? "Tap <b>&#127795;</b>" : "Press <b>Space</b>") + " to plant another.");
  else if (planted === 10) showHint("Ten trees. You're basically a forester now.");
}
