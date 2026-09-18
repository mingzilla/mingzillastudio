/* animal__hen.js — tiny, twitchy, everywhere there is grass */

const HEN_SP = {
  bodyLen: 0.15, bodyWid: 0.12, bodyH: 0.13, legH: 0.065, headR: 0.048,
  gait: 12, speed: 0.40, rest: [0.3, 1.6],
  bodyCi: "hen", headCi: "hen", legCi: "gold",
  comb: true
};

defEntity({
  key: "hen", group: "animal", label: "Hen",
  mobile: true,
  spawn: { mode: "scatter", biomes: [BIOME.GRASS], density: 0.02, min: 8, max: 26 },
  create({ t, h }) {
    const e = { z: t.rz };
    h.initWalker(e, t, HEN_SP, h);
    return e;
  },
  anim(e, dt, h) {
    h.wander(e, dt, h);
    e.dyn = h.quadrupedFaces(e, h);
  }
});
