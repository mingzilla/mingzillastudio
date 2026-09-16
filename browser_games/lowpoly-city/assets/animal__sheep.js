/* animal__sheep.js — grazes the grassland and the fields */

const SHEEP_SP = {
  bodyLen: 0.34, bodyWid: 0.24, bodyH: 0.26, legH: 0.15, headR: 0.082,
  gait: 6.5, speed: 0.55, rest: [0.7, 3.4],
  bodyCi: "sheep", headCi: "cowPatch", legCi: "cowPatch"
};

defEntity({
  key: "sheep", group: "animal", label: "Sheep",
  mobile: true,
  spawn: {
    mode: "scatter", biomes: [BIOME.GRASS, BIOME.FIELD],
    density: 0.05, min: 12, max: 40
  },
  create({ t, h }) {
    const e = { z: t.rz };
    h.initWalker(e, t, SHEEP_SP, h);
    return e;
  },
  anim(e, dt, h) {
    h.wander(e, dt, h);
    e.dyn = h.quadrupedFaces(e, h);
  }
});
