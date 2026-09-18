/* nature__birch.js — pale trunk, thin airy crown
   =========================================================================
   The opposite read to the broadleaf: a long bare trunk with a small canopy
   perched on top, so the pale bark is most of what you see. That pale trunk is
   the point — it is the only near-white upright in the valley that is not a
   building.

   The lobes are spread far apart on purpose. A birch crown is sparse; if the
   lobes touch, the gaps close up and it turns back into a broadleaf. */

CANOPY.birch = function (r) {
  const lobes = [];
  const n = 4 + (r < 0.5 ? 1 : 0);
  for (let i = 0; i < n; i++) {
    const u = (i / (n - 1)) * 2 - 1;                 // -1 .. 1 across the crown
    lobes.push([u * (0.15 + r * 0.05), 0, 0.68 + (1 - Math.abs(u)) * 0.10,
                0.115 - Math.abs(u) * 0.025, 0.15, u * 1.6, "body"]);
  }
  lobes.push([0, 0, 0.86, 0.10, 0.13, r * 2, "crown"]);
  lobes.push([0, 0, 0.60, 0.13, 0.17, r, "skirt"]);
  return lobes;
};

defTree("birch", "Birch",
  () => 0.10,
  () => 0.03,
  {
    tone: { skirt: "birchC", body: "birchA", crown: "birchB" },
    bark: "birchBark",
    trunkH: 0.46
  });
