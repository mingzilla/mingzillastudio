/* =========================================================================
   game__boot.js — start it up, then run the loop
   ========================================================================= */

let now = 0, last = 0, fpsAcc = 0, fpsN = 0;
const sFps = document.getElementById("sFps");
const sTiles = document.getElementById("sTiles");
const sTrees = document.getElementById("sTrees");
const sBeasts = document.getElementById("sBeasts");
const sBuilds = document.getElementById("sBuilds");
const sWhere = document.getElementById("sWhere");
/* Nothing is written to localStorage, sessionStorage or cookies — a refresh
   always rebuilds the default valley. This constant plus autocomplete="off" on
   the input is only here because browsers will sometimes restore a form field
   on reload, which would otherwise look like saved state. */
const DEFAULT_SEED = "7";
const seedInput = document.getElementById("seed");

function resetSeedField() { seedInput.value = DEFAULT_SEED; }

function newValley() {
  const raw = String(seedInput.value || "7").trim();
  let seed = 0;
  for (let i = 0; i < raw.length; i++) seed = (seed * 31 + raw.charCodeAt(i)) | 0;
  buildWorld(seed || 1);
  spawnPlayer();
  planted = 0;
  sTiles.textContent = tileList.length;
  let trees = 0, beasts = 0, builds = 0;
  for (const e of entities) {
    if (e.group === "nature" && TREE_KEYS[e.key]) trees++;
    else if (e.group === "animal" || e.group === "vehicle") beasts++;
    else builds++;
  }
  sTrees.textContent = trees;
  sBeasts.textContent = beasts;
  sBuilds.textContent = builds;
}

document.getElementById("regen").addEventListener("click", () => {
  newValley();
  showHint("Valley built from seed <b>" + String(seedInput.value).trim() + "</b>.");
});
seedInput.addEventListener("keydown", ev => { if (ev.key === "Enter") newValley(); });
window.addEventListener("resize", resize);

resize();
resetSeedField();
newValley();
showHint(padIsOn()
  ? "Walk with the stick. Tap <b>&#127795;</b> to plant a tree."
  : "Walk about. Press <b>Space</b> to plant a tree.");

function frame(ts) {
  requestAnimationFrame(frame);
  if (!last) last = ts;
  let dt = (ts - last) / 1000;
  last = ts;
  if (dt > 0.05) dt = 0.05;
  now += dt;

  update(dt);
  render();

  fpsAcc += dt; fpsN++;
  if (fpsAcc > 0.5) {
    sFps.textContent = Math.round(fpsN / fpsAcc);
    fpsAcc = 0; fpsN = 0;
    const t = tileAtWorld(player.x, player.y);
    sWhere.textContent = t ? BIOME_NAME[t.biome] : "–";
  }
}
requestAnimationFrame(frame);
