/* =========================================================================
   core__biome.js — what a tile can be
   ========================================================================= */

const BIOME = { WATER: 0, SAND: 1, GRASS: 2, FOREST: 3, FIELD: 4, RIVER: 5 };
const BIOME_NAME = ["water", "shore", "grass", "forest", "fields", "river"];

/* Anything you can stand on. Rivers need a bridge. */
function walkable(t) {
  if (!t) return false;
  if (t.biome === BIOME.WATER) return false;
  if (t.biome === BIOME.RIVER && !t.bridge) return false;
  return true;
}

const dryLand = t => t && t.biome !== BIOME.WATER && t.biome !== BIOME.RIVER;
