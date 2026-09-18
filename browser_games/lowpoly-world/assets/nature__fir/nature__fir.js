/* nature__fir.js — the Christmas tree
   =========================================================================
   Unlike the pine, whose tiers are rounded domes, a fir is four flat triangles
   stacked with the widest at the bottom — that straight-edged taper is the whole
   of what makes it read as a Christmas tree rather than a conifer.

   The tiers are labelled skirt, skirt, body, crown so the flat renderer paints
   them bottom-up inside each colour group; get that order wrong and the top
   tier is buried under the bottom one. */

CANOPY.fir = function (r) {
  const lobes = [];
  /* base z, half-width, height. Shallow and wide: a tier as tall as it is
     broad stacks into a spike, which is what a pine already looks like. */
  const TIERS = [
    [0.24, 0.34, 0.26, "skirt"],
    [0.44, 0.28, 0.24, "skirt"],
    [0.62, 0.22, 0.22, "body"],
    [0.78, 0.15, 0.20, "crown"]
  ];
  for (let i = 0; i < TIERS.length; i++) {
    const [z, rad, h, which] = TIERS[i];
    lobes.push([0, 0, z, rad, h, r * i, which, "t"]);
  }
  return lobes;
};

defTree("fir", "Fir",
  () => 0.10,
  () => 0.02,
  {
    tone: { skirt: "firC", body: "firA", crown: "firB" },
    trunkH: 0.30
  });
