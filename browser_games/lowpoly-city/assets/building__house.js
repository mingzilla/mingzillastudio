/* =========================================================================
   building__house.js — the ordinary dwelling
   =========================================================================
   Houses are not scattered; they are placed by the village builder in
   index.html, which picks a flat open tile and then fills in the ring of
   neighbours around it. Set `kind: "village"` on the spawn rule to mark a
   building as one that wants neighbours rather than open country.
   ========================================================================= */

defEntity({
  key: "house", group: "building", label: "House",
  sizeMul: 2,          // twice the size of everything else
  spawn: { kind: "village", biomes: [BIOME.GRASS] },
  create({ t, h }) {
    const s = h.rr(0.86, 1.12);
    const rot = Math.round(h.rnd() * 4) * Math.PI / 2
              + (h.rnd() < 0.3 ? Math.PI / 4 : 0);
    const f = [], C = h.CIDX;
    const hx = 0.30 * s, hy = 0.24 * s, hh = 0.36 * s;

    h.box(f, 0, 0, 0, hx, hy, hh, rot, h.rnd() < 0.5 ? C.wallA : C.wallB);

    const roofCi = [C.roofA, C.roofB, C.roofC, C.roofD][Math.floor(h.rnd() * 4)];
    if (h.rnd() < 0.55) {
      h.gableRoof(f, 0, 0, hh, hx * 1.06, hy * 1.1, 0.30 * s, rot, roofCi);
    } else {
      h.cone(f, 0, 0, hh, Math.max(hx, hy) * 1.34, 0.30 * s, 4, rot + Math.PI / 4, roofCi);
    }

    if (h.rnd() < 0.5) {
      // chimney, offset in the house's own frame so it stays on the roof
      const [cx, cy] = h.off(rot, 0.15 * s, 0.11 * s);
      h.box(f, cx, cy, hh + 0.12 * s, 0.045 * s, 0.045 * s, 0.22 * s, rot, C.rockDark);
    }
    return { s, rot, faces: f };
  }
});
