/* building__well.js — goes in the middle of a village, one per village */

defEntity({
  key: "well", group: "building", label: "Well",
  spawn: { kind: "village-centre", biomes: [BIOME.GRASS] },
  create({ t, h }) {
    const s = h.rr(0.85, 1.05), rot = h.rnd() * 6.28;
    const f = [], C = h.CIDX;

    h.prism(f, 0, 0, 0, 0.16 * s, 0.13 * s, 6, rot, C.stone);

    const [ax, ay] = h.off(rot, 0.10 * s, 0);
    const [bx, by] = h.off(rot, -0.10 * s, 0);
    h.box(f, ax, ay, 0.16 * s, 0.018 * s, 0.018 * s, 0.15 * s, rot, C.timber);
    h.box(f, bx, by, 0.16 * s, 0.018 * s, 0.018 * s, 0.15 * s, rot, C.timber);
    h.gableRoof(f, 0, 0, 0.31 * s, 0.14 * s, 0.11 * s, 0.09 * s, rot, C.roofB);

    return { s, rot, faces: f };
  }
});
