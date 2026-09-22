/* tree.js — a pine: trunk and three cones. The tiers get smaller and lighter
   as they go up, which is what stops the three round shapes reading as one
   green lump. */

function treeFaces(k) {
  const f = [];
  box(f, 0, 0, 0, 0.10 * k, 0.10 * k, 0.30 * k, 0, CIDX.trunk);
  cone(f, 0, 0, 0.26 * k, 0.42 * k, 0.55 * k, 7, CIDX.pineC);
  cone(f, 0, 0, 0.62 * k, 0.34 * k, 0.52 * k, 7, CIDX.pineA);
  cone(f, 0, 0, 0.96 * k, 0.24 * k, 0.48 * k, 7, CIDX.pineB);
  return f;
}
