/* =========================================================================
   building__house.js — the ordinary dwelling
   =========================================================================
   Chunky box, a roof that visibly overhangs the walls on all four sides, a
   couple of windows and a door. The overhang is doing most of the work: a roof
   flush with the walls reads as a plain prism, and the reference art leans
   hard on that shadow line.

   Houses are not scattered; the village builder in index.html picks a flat open
   tile and fills in the ring around it. `kind: "village"` marks a building as
   one that wants neighbours rather than open country.
   ========================================================================= */

const ROOFS = ["roofA", "roofB", "roofC", "roofD", "roofE", "roofF"];
const WALLS = ["wallA", "wallB", "wallC"];

defEntity({
  key: "house", group: "building", label: "House",
  sizeMul: 2,          // on top of WORLD_SCALE — independent of people and animals
  spawn: { kind: "village", biomes: [BIOME.GRASS] },
  create({ t, h }) {
    const s = h.rr(0.9, 1.1);
    const rot = Math.round(h.rnd() * 4) * Math.PI / 2
              + (h.rnd() < 0.25 ? Math.PI / 4 : 0);
    const f = [], C = h.CIDX;
    const hx = 0.24 * s, hy = 0.19 * s, hh = 0.30 * s;
    const rh = 0.26 * s;

    h.box(f, 0, 0, 0, hx, hy, hh, rot, C[WALLS[Math.floor(h.rnd() * WALLS.length)]]);

    const roofCi = C[ROOFS[Math.floor(h.rnd() * ROOFS.length)]];
    if (h.rnd() < 0.75) {
      h.gableRoof(f, 0, 0, hh, hx * 1.30, hy * 1.45, rh, rot, roofCi);
    } else {
      h.cone(f, 0, 0, hh, Math.max(hx, hy) * 1.62, rh, 4, rot + Math.PI / 4, roofCi);
    }

    // chimney, sitting on the ridge rather than the pitch
    const [cx, cy] = h.off(rot, hx * 0.46, 0);
    h.box(f, cx, cy, hh + rh * 0.42, 0.032 * s, 0.032 * s, 0.19 * s, rot, C.stone);

    // two windows on each long wall, set slightly proud of it
    [-1, 1].forEach(side => {
      for (const u of [-0.42, 0.42]) {
        const [wx, wy] = h.off(rot, u * hx, side * hy * 1.03);
        h.box(f, wx, wy, hh * 0.40, 0.042 * s, 0.012, 0.052 * s, rot, C.window);
      }
    });

    // a door on one gable end
    const [dx, dy] = h.off(rot, hx * 1.03, 0);
    h.box(f, dx, dy, 0, 0.012, 0.048 * s, 0.14 * s, rot, C.door);

    return { s, rot, faces: f };
  }
});
