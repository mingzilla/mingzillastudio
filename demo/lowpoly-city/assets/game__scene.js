/* =========================================================================
   game__scene.js — assembling a frame: what draws, in what order
   ========================================================================= */

/* A tree two hundred metres away covers a dozen pixels, so it doesn't need a
   full canopy. Distance LOD is most of the frame budget here.

   Every threshold below is in WORLD units, so they all scale with HEX_SIZE.
   Leave them fixed and doubling the land quietly pushes the entire scene past
   the LOD radius, at which point every tree in the valley renders as its
   single-blob fallback and the woods turn into dark diamonds. */
const LOD_R2 = (9.5 * HEX_SIZE) ** 2;
const ANIM_R2 = (28 * HEX_SIZE) ** 2;
const FADE_R2 = (2.6 * HEX_SIZE) ** 2;
const LOD_ZOOM = 44 / HEX_SIZE;
/* Every tree key, and nothing else. A tree missing from here still grows, but
   it stops counting as one and — worse — stops fading out when it comes
   between the camera and the player. */
const TREE_KEYS = {
  pine: 1, leaf: 1, autumn: 1,
  fir: 1, birch: 1, palm: 1, cypress: 1, blossom: 1, dead: 1
};

/* Walking into a wood swallows the character completely, so anything standing
   between the camera and the player drops back to a ghost. */
function occluderAlpha(e) {
  if (!TREE_KEYS[e.key]) return undefined;
  if (e.owner._d >= playerDepth) return undefined;
  const dx = e.x - player.x, dy = e.y - player.y;
  return dx * dx + dy * dy < FADE_R2 ? 0.20 : undefined;
}

function drawEntity(e) {
  const grow = e.birth >= 0 ? Math.min(1, (now - e.birth) / 0.35) : 1;
  const s = e.s * e.sizeMul * WORLD_SCALE * (0.45 + 0.55 * grow) * (1 + (1 - grow) * 0.3);
  const alpha = occluderAlpha(e);

  /* a 2D entity paints itself, always facing the camera */
  if (e.def.draw2d) { e.def.draw2d(e, s, alpha, H); return; }

  const lod = (cam.zoom < LOD_ZOOM || !e._near) && e.simple && e.simple.length;
  if (!lod && e.dyn && e.dyn.length) drawFaces(e.dyn, e.x, e.y, e.z, s, alpha);
  drawFaces(lod ? e.simple : e.faces, e.x, e.y, e.z, s, alpha);
}

/* Animated entities are rebuilt from scratch every time they tick — a walking
   sheep is a few hundred small arrays. Ticking them all every frame was the
   single biggest source of garbage in the scene, and a sheep at 20fps looks
   exactly like a sheep at 60. So each one ticks on a rotating third of frames,
   and gets handed the time it actually missed. */
const ANIM_SLICES = 3;
let frameNo = 0;

function updateEntities(dt) {
  frameNo++;
  for (let i = 0; i < entities.length; i++) {
    const e = entities[i];
    const dx = e.x - player.x, dy = e.y - player.y;
    const d2 = dx * dx + dy * dy;
    e._near = d2 < LOD_R2;
    if (!e.def.anim || d2 > ANIM_R2) continue;
    e.acc = (e.acc || 0) + dt;
    if (e.tick === undefined) e.tick = i % ANIM_SLICES;
    if ((frameNo + e.tick) % ANIM_SLICES !== 0) continue;
    e.def.anim(e, e.acc, H);
    e.acc = 0;
  }
}

const SHADOW_PTS = d3.range(8).map(i => {
  const a = i * Math.PI / 4;
  return [Math.cos(a) * 0.30 * WORLD_SCALE, Math.sin(a) * 0.30 * WORLD_SCALE * 0.78];
});
function drawPlayer() {
  for (let i = 0; i < 8; i++) {
    project(player.x + SHADOW_PTS[i][0], player.y + SHADOW_PTS[i][1], player.z + 0.02, PBUF[i]);
  }
  fillBuf(8, CIDX.shadow, [0, 0, 1], 0.18);
  /* the player is built in the same units as every entity, so it takes the same
     world scale — without this it stays at half size while the valley doubles */
  drawFaces(player.faces, player.x, player.y, player.z, WORLD_SCALE);
}

function render() {
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, view.w, view.h);

  updateLight();
  updateOutline();
  DRAW.length = 0;
  drawN = 0;
  const margin = 1.5 * cam.zoom;

  for (let i = 0; i < tileList.length; i++) {
    const t = tileList[i];
    project(t.cx, t.cy, t.rz, PBUF[0]);
    if (PBUF[0].x < -margin || PBUF[0].x > view.w + margin ||
        PBUF[0].y < -margin || PBUF[0].y > view.h + margin) { t._vis = false; continue; }
    t._vis = true;
    t._d = PBUF[0].d - DEPTH_BIAS;           // entities on it draw just after it
    drawPush(PBUF[0].d, 0, t);
  }

  for (let i = 0; i < entities.length; i++) {
    const e = entities[i];
    /* a creature that has wandered is no longer where its tile says it is, so
       it sorts on its own depth; static things sort with the tile they're on */
    const mobile = e.mobile;
    if (!mobile && !e.owner._vis) continue;
    project(e.x, e.y, e.z, PBUF[0]);
    if (PBUF[0].x < -margin || PBUF[0].x > view.w + margin ||
        PBUF[0].y < -margin || PBUF[0].y > view.h + margin) continue;
    drawPush(mobile ? PBUF[0].d - DEPTH_BIAS : e.owner._d, 1, e);
  }

  playerDepth = project(player.x, player.y, player.z, PBUF[0]).d - DEPTH_BIAS;
  drawPush(playerDepth, 2, null);

  DRAW.sort((p, q) => q.d - p.d);

  for (let i = 0; i < DRAW.length; i++) {
    const it = DRAW[i];
    if (it.k === 0) drawTile(it.r);
    else if (it.k === 1) drawEntity(it.r);
    else drawPlayer();
  }
}
