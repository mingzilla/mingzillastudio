/* nature__blossom.js — the broadleaf in flower
   =========================================================================
   Same canopy as the broadleaf, different three colours. That is the whole
   file, and it is meant to be: the shape was never the thing that made a
   blossom tree, the pink was. */

CANOPY.blossom = canopyLeaf;

defTree("blossom", "Blossom",
  () => 0.05,
  () => 0.02,
  { tone: { skirt: "blossomC", body: "blossomA", crown: "blossomB" } });
