/* =========================================================================
   game__camera.js — where the camera sits, and how the world flattens onto the screen
   ========================================================================= */

/* Camera elevation, radians above the ground plane. Small = flatter, which
   foreshortens the ground and shows you far more of the valley in the same
   screen height. Raise it toward 1.2 for a near plan view. */
const PITCH = 0.28;
const SINP = Math.sin(PITCH), COSP = Math.cos(PITCH);
/* START_ZOOM is where the camera opens at. Raise it for a closer view. */
const START_ZOOM = 66;
const cam = { x: 0, y: 0, z: 0, c: 1, s: 0, yaw: 0.5, zoom: START_ZOOM, target: START_ZOOM };
const view = { w: 0, h: 0, dpr: 1 };

function project(x, y, z, out) {
  const dx = x - cam.x, dy = y - cam.y;
  const rx = dx * cam.c - dy * cam.s;
  const ry = dx * cam.s + dy * cam.c;
  out.x = view.w * 0.5 + rx * cam.zoom;
  out.y = view.h * 0.60 + (-ry * SINP - (z - cam.z) * COSP) * cam.zoom;
  out.d = ry;
  return out;
}

/* Light lives in view space, so shading holds still while the camera turns.
   Rotating it back into world space each frame keeps the sun glued to the
   screen instead of swinging round the valley. */
const LV = [-0.45, -0.30, 0.84];
let LWx = LV[0], LWy = LV[1], LWz = LV[2];
function updateLight() {
  LWx = LV[0] * cam.c + LV[1] * cam.s;
  LWy = -LV[0] * cam.s + LV[1] * cam.c;
  LWz = LV[2];
}
function bandOf(n) {
  const d = n[0] * LWx + n[1] * LWy + n[2] * LWz;
  let i = Math.round((d * 0.72 + 0.36) * (BAND_K.length - 1));
  if (i < 0) i = 0; else if (i > BAND_K.length - 1) i = BAND_K.length - 1;
  return i;
}
