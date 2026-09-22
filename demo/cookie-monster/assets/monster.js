/* =========================================================================
   monster.js — the stupid character
   =========================================================================
   Two things make him read as a character, and both are cheap: the head is
   most of him, and the mouth is drawn flat on the front of it rather than
   built as a jaw that swings. A swinging jaw was the first attempt. It put
   the hinge down at the waist, so a closed mouth came out as a red sash
   across his belly and an open one as a hole in his chest. Flat panels can
   only ever be on the face, so they cannot do that.

   The eyes sit on TOP of the head. The camera never turns and he always
   turns to face the way he walks, so eyes on the front would be hidden half
   the time; on top, with the pupils pushed toward the camera every frame, he
   is looking at you from any angle.
   ========================================================================= */

const monster = {
  x: 0, y: 0, facing: -Math.PI / 2,   // starts looking at the camera
  walk: 0, moving: 0,
  open: 0,        // mouth, 0 shut .. 1 agape
  chomp: 0,       // counts down after a bite, drives the chewing
  stun: 0,        // counts down after broccoli
  lift: 0,        // arms, 0 down .. 1 up
  squash: 0, eyeLag: [0, 0], t: 0
};

function monsterReset() {
  monster.x = 0; monster.y = 0; monster.facing = -Math.PI / 2;
  monster.walk = 0; monster.moving = 0; monster.open = 0;
  monster.chomp = 0; monster.stun = 0; monster.lift = 0;
  monster.squash = 0; monster.eyeLag = [0, 0]; monster.t = 0;
}

/* The camera sits at world direction -(sin yaw, cos yaw) from whatever it is
   looking at, so this is the way to push a pupil to get eye contact. */
function towardCamera() { return [-cam.s, -cam.c]; }

const MOUTH_TOP = 1.12;

function monsterFaces() {
  const f = [], r = monster.facing;
  const swing = Math.sin(monster.walk) * monster.moving;
  const bob = Math.abs(Math.cos(monster.walk)) * 0.03 * monster.moving;
  const sq = monster.squash, open = monster.open;

  /* Feet first, then the body over the tops of them: inside one entity the
     painter's sort is just the order things were pushed. */
  [-1, 1].forEach(side => {
    const [lx, ly] = off(r, swing * side * 0.09, side * 0.15);
    box(f, lx, ly, 0, 0.11, 0.12, 0.20, r, CIDX.fur2);
  });

  const bodyZ = 0.14 - bob, BH = 0.64 * (1 - sq * 0.08);
  box(f, 0, 0, bodyZ, 0.24 - sq * 0.02, 0.34, BH, r, CIDX.fur);

  /* Arms. They swing out and up together, and they travel sideways as they
     go: hanging at his side they are inside the head's shadow and invisible,
     so the pose that reads is the one with them held right out. */
  [-1, 1].forEach(side => {
    const out = side * (0.44 + monster.lift * 0.16);
    const [ax, ay] = off(r, -swing * side * 0.06, out);
    const az = 0.30 + monster.lift * 0.38 + bob;
    box(f, ax, ay, az, 0.12, 0.12, 0.38, r, CIDX.fur2);
    blob(f, ax, ay, az + 0.40, 0.15, 0.22, 5, CIDX.fur2);
  });

  const HZ = 0.72 + bob, HH = 0.74;
  box(f, 0, 0, HZ, 0.33, 0.40, HH, r, CIDX.fur3);

  /* a snout. Without it he is a column in profile, with nothing on him at all
     from the side. */
  box(f, 0, 0, HZ - 0.06, 0.44, 0.32, 0.64, r, CIDX.fur3);

  /* a few tufts, so the top of him is not a lid */
  [[-0.20, -0.26], [-0.22, 0.24], [-0.26, -0.02]].forEach(([tx, ty], i) => {
    const [px, py] = off(r, tx, ty);
    blob(f, px, py, HZ + HH - 0.04, 0.12 - i * 0.01, 0.17, 5, CIDX.fur2);
  });

  /* ------------------------------------------------------------------ face
     All flat, all standing a hair proud of the front of the head, in the
     order they must paint: hole, tongue, teeth, lip. Shut, the mouth is
     0.10 tall and the teeth fill it, which is why he grins all the time. */
  const MT = MOUTH_TOP, MH = 0.10 + open * 0.34;
  const MB = MT - MH, MW = 0.29 + open * 0.03;
  panel(f, r, 0.445, -MW, MW, MB, MT, CIDX.mouth);
  panel(f, r, 0.448, -MW * 0.82, MW * 0.82, MB, MB + 0.09, CIDX.tongue);
  for (let i = -2; i <= 2; i++) {
    panel(f, r, 0.451, i * 0.115 - 0.048, i * 0.115 + 0.048, MT - 0.10, MT, CIDX.white);
  }
  panel(f, r, 0.454, -MW - 0.02, MW + 0.02, MB - 0.07, MB + 0.02, CIDX.fur2);

  /* ------------------------------------------------------------------ eyes */
  [-1, 1].forEach((side, i) => {
    const [ex, ey] = off(r, 0.05, side * 0.18);
    const ez = HZ + HH + 0.05;
    blob(f, ex, ey, ez, 0.19, 0.38, 6, CIDX.white);
    const [cx, cy] = towardCamera();
    const wob = monster.stun > 0 ? Math.sin(monster.t * 22 + i * 2) * 0.09 : 0;
    blob(f,
      ex + cx * 0.15 + monster.eyeLag[0] - cy * wob,
      ey + cy * 0.15 + monster.eyeLag[1] + cx * wob,
      ez + 0.03, 0.085, 0.17, 5, CIDX.dark);
  });

  return f;
}
