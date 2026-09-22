/* =========================================================================
   game__input.js — keys, the wheel, the panel, planting
   ========================================================================= */

const keys = Object.create(null);
const TRAP = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Spacebar"];
window.addEventListener("keydown", ev => {
  if (TRAP.indexOf(ev.key) >= 0) ev.preventDefault();
  keys[ev.key.toLowerCase()] = true;
  keys[ev.code] = true;
  if (ev.code === "Space" && !ev.repeat) plantTree();
  if (ev.key === "r" || ev.key === "R") newValley();
  if (ev.key === "h" || ev.key === "H") toggleUI();
  if (ev.key === "m" || ev.key === "M") toggleSound();
});
window.addEventListener("keyup", ev => { keys[ev.key.toLowerCase()] = false; keys[ev.code] = false; });
window.addEventListener("blur", () => { for (const k in keys) keys[k] = false; });

function zoomStep(deltaY) {
  cam.target = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, cam.target * (deltaY > 0 ? 0.9 : 1.11)));
}
canvas.addEventListener("wheel", ev => { ev.preventDefault(); zoomStep(ev.deltaY); }, { passive: false });
