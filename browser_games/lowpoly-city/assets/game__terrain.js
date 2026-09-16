/* =========================================================================
   game__terrain.js — the shape of the valley, and the speeds you cross it at
   =========================================================================
   The valley is one flat plain with a single hill on it. Almost everything
   sits at PLAIN; the hill is the only thing with real height, which is what
   gives the waterfall somewhere to fall from and keeps the frame cheap —
   flat ground means most tiles share two edges with neighbours at the same
   height, so there is no cliff face to draw.
   ========================================================================= */

"use strict";

if (typeof d3 === "undefined") {
  document.getElementById("fail").style.display = "flex";
  throw new Error("d3 not loaded");
}

const HEX_R = 28;
const SEA = 0;
const STEP = 0.85;                       // height quantum
const PLAIN = STEP;                      // flat land sits one step above the sea
const HILL_STEPS = 5;
const HILL_H = HILL_STEPS * STEP;
const HILL_R = 9.0 * HEX_SIZE;           // hill radius, in world units
const BASE_Z = SEA - 2.2;                // underside of the diorama block
const RIM_IN = 0.82, RIM_OUT = 1.02;     // where the coast falls away
const MIN_ZOOM = 6, MAX_ZOOM = 96;       // wide enough to still see the whole island

/* Walking toward or away from the camera is foreshortened by the pitch: at 0.28
   rad a step along the depth axis covers about half the screen distance the same
   step covers across it, so up/down feels sluggish next to left/right. Scaling
   the depth axis of the input compensates for the look without touching the
   sideways speed. Exact screen-space parity would be 1/sin(PITCH) ~= 3.6. */
const DEPTH_SPEED = 2;

/* World units per second. Note these are on top of DEPTH_SPEED, so walking
   toward the camera is twice these figures. */
const WALK_SPEED = 8.8;
const RUN_SPEED = 16.8;

/* the terrain-scouting `where` rules in the asset files need these */
Object.assign(H, { STEP, PLAIN, SEA, BASE_Z });


let tiles = new Map();
let tileList = [];
let entities = [];
let hill = { x: 0, y: 0 };
