/* =========================================================================
   building__bridge.js — the only way across a river
   =========================================================================
   Not placed by the scatter rules. index.html marks one or two river tiles
   as `t.bridge` while carving, sets `t.bridgeRot` square across the flow,
   and spawns one of these on each. Without them the river can cut the island
   in two and strand you.
   ========================================================================= */

defEntity({
  key: "bridge", group: "building", label: "Bridge",
  spawn: null,                       // placed explicitly, see below
  create({ t, h }) {
    const rot = t.bridgeRot, f = [], C = h.CIDX;

    h.box(f, 0, 0, 0, 0.90, 0.17, 0.06, rot, C.plank);

    [-0.15, 0.15].forEach(side => {
      const [rx, ry] = h.off(rot, 0, side);
      h.box(f, rx, ry, 0.06, 0.90, 0.02, 0.035, rot, C.timber);
      [-0.62, 0, 0.62].forEach(u => {
        const [ux, uy] = h.off(rot, u, side);
        h.box(f, ux, uy, 0.06, 0.022, 0.022, 0.10, rot, C.timber);
      });
    });

    return { s: 1, rot, faces: f };
  }
});
