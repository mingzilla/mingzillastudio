/* =========================================================================
   game__player.js — the character you are
   ========================================================================= */

const player = { x: 0, y: 0, z: 0, facing: 0, walk: 0, moving: 0, run: 0, faces: [] };

/* How far the hands swing out of their resting pose once you are walking:
   0 keeps them straight out to the sides, PI/2 would tuck them right in.
   At 60 degrees they trail well behind, and still show half their length from
   the front instead of turning edge-on and disappearing. */
const ARM_LEAN = Math.PI / 3;

/* The direction that lean swings towards: backwards along the body and
   downwards, which is what makes the hands trail rather than just fold in. */
const ARM_TRAIL = [-Math.SQRT1_2, 0, -Math.SQRT1_2];

/* A limb is a box running between two points. box() only yaws, and an arm that
   trails behind a walker has to pitch as well, so this builds the four long
   faces from an explicit frame instead — same winding as box(), so the outward
   normals and the backface culling come out the same. */
function limb(f, from, to, rad, ci) {
  const dx = to[0] - from[0], dy = to[1] - from[1], dz = to[2] - from[2];
  const L = Math.hypot(dx, dy, dz) || 1;
  const u = [dx / L, dy / L, dz / L];
  /* any axis but the limb's own will do to hang the cross-section on */
  const p = Math.abs(u[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
  let a = [u[1] * p[2] - u[2] * p[1], u[2] * p[0] - u[0] * p[2], u[0] * p[1] - u[1] * p[0]];
  const aL = Math.hypot(a[0], a[1], a[2]) || 1;
  a = [a[0] / aL, a[1] / aL, a[2] / aL];
  const b = [u[1] * a[2] - u[2] * a[1], u[2] * a[0] - u[0] * a[2], u[0] * a[1] - u[1] * a[0]];
  const P = (t, sa, sb) => [
    from[0] + u[0] * L * t + (a[0] * sa + b[0] * sb) * rad,
    from[1] + u[1] * L * t + (a[1] * sa + b[1] * sb) * rad,
    from[2] + u[2] * L * t + (a[2] * sa + b[2] * sb) * rad
  ];
  const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const r0 = CORNERS.map(([x, y]) => P(0, x, y));
  const r1 = CORNERS.map(([x, y]) => P(1, x, y));
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    push(f, [r0[i], r0[j], r1[j], r1[i]], ci);
  }
  /* capped at both ends — a leaning arm lifts its shoulder end clear of the
     body, and an open tube there reads as a hole */
  push(f, [r0[3], r0[2], r0[1], r0[0]], ci);
  push(f, r1, ci);
}

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

/* A big blocky head on a small body with short legs — roughly 60% of the
   height is head. Every part is a box, so the silhouette is the sketch.

   Local axes matter here: local x is the way the character faces and local y
   is its left/right. Limbs go out along y and stride along x, or the two legs
   line up one behind the other and the character reads as a profile no matter
   which way it is turned. Same for the body, which is wider than it is deep. */
function buildPlayer() {
  const f = [];
  const s = 0.92;
  const rot = player.facing;
  const swing = Math.sin(player.walk) * player.moving;
  const bob = Math.abs(Math.cos(player.walk)) * 0.025 * player.moving;

  const LEG_H = 0.11 * s;
  [-1, 1].forEach(side => {
    const [lx, ly] = off(rot, swing * side * 0.04 * s, side * 0.075 * s);
    box(f, lx, ly, 0.02, 0.052 * s, 0.052 * s, LEG_H, rot, CIDX.trousers);
  });

  const bodyZ = 0.02 + LEG_H + bob;
  const BODY_H = 0.16 * s;
  box(f, 0, 0, bodyZ, 0.085 * s, 0.105 * s, BODY_H, rot, CIDX.coat);

  /* arms: out to the sides standing still, trailing back and down once moving.
     Rest is straight out along local y; the lean rotates that direction towards
     ARM_TRAIL, so the hand ends up behind and below the shoulder. The two arms
     lean by slightly different amounts, in step with the legs. */
  const armR = 0.033 * s, armLen = 0.145 * s;
  const shoulderZ = bodyZ + BODY_H * 0.62;
  [-1, 1].forEach(side => {
    const [sx, sy] = off(rot, 0, side * 0.09 * s);
    const lean = ARM_LEAN * player.moving * (1 + 0.12 * side * swing);
    const cl = Math.cos(lean), sl = Math.sin(lean);
    const dz = ARM_TRAIL[2] * sl;
    /* the lean direction is local, so it needs rotating into the world the same
       way the shoulder was — otherwise the arms stay pinned to world axes and
       swing round the wrong way as the character turns */
    const [dx, dy] = off(rot,
      ARM_TRAIL[0] * sl,
      side * cl + ARM_TRAIL[1] * sl);
    limb(f, [sx, sy, shoulderZ],
            [sx + dx * armLen, sy + dy * armLen, shoulderZ + dz * armLen],
            armR, CIDX.coat);
  });

  /* the head sits straight on the shoulders — no neck, and wider than the
     body under it, which is what makes it read as heavy */
  const headZ = bodyZ + BODY_H;
  const HEAD_H = 0.38 * s, HEAD_D = 0.155 * s, HEAD_W = 0.175 * s;
  box(f, 0, 0, headZ, HEAD_D, HEAD_W, HEAD_H, rot, CIDX.skin);

  /* eyes: two dashes pushed a hair proud of the face, high up like the sketch.
     They are on the leading face, so you see them coming toward you. */
  const eyeZ = headZ + HEAD_H * 0.60;
  [-1, 1].forEach(side => {
    const [ex, ey] = off(rot, HEAD_D - 0.004 * s, side * 0.078 * s);
    box(f, ex, ey, eyeZ, 0.012 * s, 0.042 * s, 0.036 * s, rot, CIDX.window);
  });

  player.faces = f;
}
