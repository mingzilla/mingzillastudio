/* animal__goat.js — scrub and hillside, small horns */

const GOAT_SP = {
  bodyLen: 0.28, bodyWid: 0.18, bodyH: 0.20, legH: 0.15, headR: 0.066,
  gait: 7.5, speed: 0.70, rest: [0.5, 2.6],
  bodyCi: "goat", headCi: "goat", legCi: "goatHorn",
  horns: true
};

defEntity({
  key: "goat", group: "animal", label: "Goat",
  mobile: true,
  spawn: { mode: "scatter", biomes: [BIOME.FOREST], density: 0.03, min: 3, max: 10 },
  create({ t, h }) {
    const e = { z: t.rz };
    h.initWalker(e, t, GOAT_SP, h);
    return e;
  },
  anim(e, dt, h) {
    h.wander(e, dt, h);
    e.dyn = h.quadrupedFaces(e, h);
  }
});
