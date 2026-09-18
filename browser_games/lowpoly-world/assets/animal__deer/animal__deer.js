/* animal__deer.js — woodland, long legs, skittish */

const DEER_SP = {
  bodyLen: 0.40, bodyWid: 0.20, bodyH: 0.23, legH: 0.28, headR: 0.072,
  gait: 8.0, speed: 0.95, rest: [0.4, 2.2],
  bodyCi: "deer", headCi: "deer", legCi: "deerLight",
  antlers: true
};

defEntity({
  key: "deer", group: "animal", label: "Deer",
  mobile: true,
  spawn: { mode: "scatter", biomes: [BIOME.FOREST], density: 0.10, min: 8, max: 26 },
  create({ t, h }) {
    const e = { z: t.rz };
    h.initWalker(e, t, DEER_SP, h);
    return e;
  },
  anim(e, dt, h) {
    h.wander(e, dt, h);
    e.dyn = h.quadrupedFaces(e, h);
  }
});
