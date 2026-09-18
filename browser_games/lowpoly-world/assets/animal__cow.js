/* animal__cow.js — heavier than a sheep, slower, and patchier */

const COW_SP = {
  bodyLen: 0.46, bodyWid: 0.26, bodyH: 0.30, legH: 0.24, headR: 0.098,
  gait: 5.0, speed: 0.40, rest: [1.0, 4.0],
  bodyCi: "cow", headCi: "cow", legCi: "cowPatch",
  patches: true
};

defEntity({
  key: "cow", group: "animal", label: "Cow",
  mobile: true,
  spawn: {
    mode: "scatter", biomes: [BIOME.GRASS, BIOME.FIELD],
    density: 0.025, min: 6, max: 18
  },
  create({ t, h }) {
    const e = { z: t.rz };
    h.initWalker(e, t, COW_SP, h);
    return e;
  },
  anim(e, dt, h) {
    h.wander(e, dt, h);
    e.dyn = h.quadrupedFaces(e, h);
  }
});
