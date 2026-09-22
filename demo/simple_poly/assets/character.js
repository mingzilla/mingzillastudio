/* character.js — the person you move
   ---------------------------------------------------------------------
   A big blocky head on a small body with short legs: roughly 60% of the
   height is head, which is what reads as a person at this size.

   Local axes matter. Local x is the way it faces and local y is its
   left/right, so the arms go out along y and the legs stride along x — or
   the two legs line up one behind the other and it reads as a profile no
   matter which way you turn.
   --------------------------------------------------------------------- */

const player = { x: 0, y: 0, facing: 0, walk: 0, moving: 0, size: 1 };

function characterFaces() {
  const f = [], s = 0.9, r = player.facing;
  const swing = Math.sin(player.walk) * player.moving;
  const bob = Math.abs(Math.cos(player.walk)) * 0.02 * player.moving;

  const LEG = 0.11 * s;
  [-1, 1].forEach(side => {
    const [lx, ly] = off(r, swing * side * 0.045 * s, side * 0.075 * s);
    box(f, lx, ly, 0.02, 0.05 * s, 0.05 * s, LEG, r, CIDX.trousers);
  });

  const bodyZ = 0.02 + LEG + bob;
  const BODY = 0.16 * s;
  box(f, 0, 0, bodyZ, 0.085 * s, 0.105 * s, BODY, r, CIDX.coat);

  /* arms hang off the shoulders and swing opposite the legs */
  [-1, 1].forEach(side => {
    const [ax, ay] = off(r, -swing * side * 0.055 * s, side * 0.105 * s);
    box(f, ax, ay, bodyZ + BODY * 0.32, 0.034 * s, 0.034 * s, 0.19 * s, r, CIDX.coat);
  });

  /* the head sits straight on the shoulders — no neck, and wider than the
     body under it, which is what makes it read as heavy */
  const HEAD = 0.38 * s;
  const headZ = bodyZ + BODY;
  box(f, 0, 0, headZ, 0.155 * s, 0.175 * s, HEAD, r, CIDX.skin);

  /* eyes, pushed a hair proud of the face and set high up. They are on the
     leading face, so you see them coming toward you. */
  const eyeZ = headZ + HEAD * 0.60;
  [-1, 1].forEach(side => {
    const [ex, ey] = off(r, 0.155 * s, side * 0.078 * s);
    box(f, ex, ey, eyeZ, 0.012 * s, 0.042 * s, 0.036 * s, r, CIDX.dark);
  });
  return f;
}
