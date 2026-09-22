/* rock.js — a boulder with a smaller one shouldered up against it, so no two
   rocks read as the same lump */

function rockFaces(k) {
  const f = [];
  blob(f, 0, 0, 0.17 * k, 0.34 * k, 0.38 * k, 5, CIDX.rock);
  blob(f, 0.24 * k, 0.11 * k, 0.11 * k, 0.21 * k, 0.24 * k, 5, CIDX.rock2);
  return f;
}
