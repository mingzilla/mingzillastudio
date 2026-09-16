/* nature__cypress.js — a dark column, almost all height
   =========================================================================
   Three ellipses stacked into a spindle. It is the narrowest tree in the
   valley by a long way — barely a third the width of a pine at the same
   height — so a line of them reads as a wall rather than a wood.

   The foliage runs nearly to the ground, so the trunk is only a stub and the
   lowest ellipse is what you actually see sitting on the grass. */

/* No rot on these. A rotated lobe only spins a round blob, which is harmless
   in 3D — but these are upright ellipses drawn flat, and any tilt leans the
   whole column over. */
CANOPY.cypress = function (r) {
  return [
    [0, 0, 0.26, 0.125, 0.24, 0, "skirt", "e"],
    [0, 0, 0.60, 0.145, 0.40, 0, "body", "e"],
    [0, 0, 0.98, 0.095, 0.24, 0, "crown", "e"]
  ];
};

defTree("cypress", "Cypress",
  () => 0.07,
  () => 0.02,
  {
    tone: { skirt: "cypC", body: "cypA", crown: "cypB" },
    trunkH: 0.14
  });
