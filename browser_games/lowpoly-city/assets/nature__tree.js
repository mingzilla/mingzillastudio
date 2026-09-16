/* =========================================================================
   nature__tree.js — pine | leaf | autumn
   =========================================================================
   Three keys, one canopy. Which grows where is driven by the tile's `season`,
   a slow noise field baked at world-gen time, so whole regions turn over to
   autumn at once instead of speckling.

   Two ways to draw the same tree, switched by TREE_2D:

     3D  a cluster of low-poly lobes, projected and lit like everything else
     2D  a billboard — the same lobes drawn as flat circles in screen space,
         always facing the camera

   The 2D path reuses the lobe list, so the silhouette is identical. The only
   real difference is that its height is NOT foreshortened by the camera pitch,
   which is precisely what makes it read as drawn-on rather than built.

   The canopy is a CLUSTER of rounded lobes rather than a single solid. That is
   what gives the illustrated look: overlapping domes read as a leafy mass,
   where one cone reads as a geometric solid. The lobes are picked once at
   create time and stored on the entity, so a tree is random but stable.

   Colour runs dark at the skirt, mid in the body, light on the crown — the
   light direction would do some of that on its own, but stacking it deliberately
   makes the clumps readable from directly above, which is how you mostly see them.
   ========================================================================= */

const AUTUMN_ABOVE = 0.66;

const TREE_2D = true;      // flip to false for the low-poly 3D trees
const TAU = Math.PI * 2;

const TREE_TONE = {
  pine:   { skirt: "pineC", body: "pineA", crown: "pineB" },
  leaf:   { skirt: "leafC", body: "leafA", crown: "leafB" },
  autumn: { skirt: "autumnB", body: "autumnA", crown: "autumnC" }
};

/* Lobes are [dx, dy, dz, radius, height, extraRot, which]. The 2D path uses
   dx, dz, radius and which; the 3D path uses all seven. */
function makeCanopy(kind, r) {
  const lobes = [];
  if (kind === "pine") {
    // a rounded conifer: stacked domes tapering upward
    for (let i = 0; i < 3; i++) {
      const t = i / 2;
      lobes.push([0, 0, 0.30 + t * 0.34, 0.28 - t * 0.105, 0.32 - t * 0.085, r * i, i === 2 ? "crown" : "body"]);
    }
    return lobes;
  }

  /* Broadleaf. The side lobes are spread ALONG X rather than round a circle:
     in 3D a ring of them reads as a dome from any angle, but on a billboard
     they all sit behind the middle one and the canopy collapses into a
     lollipop. Spreading them sideways is what makes the clump show. */
  lobes.push([0, 0, 0.54, 0.27, 0.32, r, "body"]);
  const n = 3 + (r < 0.5 ? 1 : 0);
  const span = 0.19 + r * 0.06;
  for (let i = 0; i < n; i++) {
    const u = n === 1 ? 0 : (i / (n - 1)) * 2 - 1;
    lobes.push([u * span, 0, 0.42 + Math.abs(u) * 0.05, 0.165, 0.20, u * 2, "skirt"]);
  }
  lobes.push([0, 0, 0.72, 0.155, 0.19, r * 2, "crown"]);
  return lobes;
}

function treeFaces(e, kind, h) {
  const f = [], g = [];
  const s = e.s, r = e.rot, C = h.CIDX, tone = TREE_TONE[kind];

  h.prism(f, 0, 0, 0, 0.24 * s, 0.055 * s, 4, r, C.trunk);

  for (const L of e.canopy) {
    h.blob(f, L[0] * s, L[1] * s, L[2] * s, L[3] * s, L[4] * s, 6, r + L[5], C[tone[L[6]]]);
  }

  /* Far-distance version. One lobe, but a big one in the body colour with a
     rounded six-sided profile — a small dark five-sided blob reads as a flat
     diamond from above, which is exactly how you see most of a forest. */
  h.blob(g, 0, 0, 0.54 * s, 0.34 * s, 0.72 * s, 6, r, C[tone.body]);
  h.blob(g, 0, 0, 0.74 * s, 0.22 * s, 0.30 * s, 6, r + 0.4, C[tone.crown]);

  e.faces = f;
  e.simple = g;
}

/* ---------------------------------------------------------------- 2D ---
   A billboard. The base is projected as usual, then everything is drawn in
   screen space at px = scale x zoom on BOTH axes — no COSP on the vertical,
   which is the whole of the effect.
*/
function tree2d(e, s, alpha, h) {
  const ctx = h.ctx, C = h.COLORS, tone = TREE_TONE[e.key];
  const p = h.screenOf(e.x, e.y, e.z);
  const px = s * h.cam.zoom;
  const ink = Math.max(0.9, h.cam.zoom * 0.018);

  if (alpha !== undefined) ctx.globalAlpha = alpha;

  const tw = 0.062 * px, th = 0.26 * px;

  /* Ink pass: trunk and every lobe in ONE path, each grown by `ink`, filled
     once. Only the union shows, so the silhouette gets a single clean edge
     instead of a dark ring around every circle. */
  ctx.beginPath();
  ctx.rect(p.x - tw - ink, p.y - th - ink, tw * 2 + ink * 2, th + ink * 2);
  for (const L of e.canopy) {
    const cx = p.x + L[0] * px, cy = p.y - L[2] * px, r = L[3] * px + ink;
    ctx.moveTo(cx + r, cy);            // park the pen on the arc's start point
    ctx.arc(cx, cy, r, 0, TAU);
  }
  ctx.fillStyle = h.INK;
  ctx.fill();

  ctx.fillStyle = C.trunk;
  ctx.fillRect(p.x - tw, p.y - th, tw * 2, th);

  /* Skirt first so the crown lands on top — the same light-from-above reading
     the 3D version gets from its shading bands. */
  for (const which of ["skirt", "body", "crown"]) {
    ctx.fillStyle = C[tone[which]];
    for (const L of e.canopy) {
      if (L[6] !== which) continue;
      ctx.beginPath();
      ctx.arc(p.x + L[0] * px, p.y - L[2] * px, L[3] * px, 0, TAU);
      ctx.fill();
    }
  }
  if (alpha !== undefined) ctx.globalAlpha = 1;
}

function defTree(key, label, forestChance, grassChance) {
  defEntity({
    key, group: "nature", label,
    sizeMul: 2,        // on top of WORLD_SCALE — independent of people and animals
    draw2d: TREE_2D ? tree2d : undefined,
    spawn: [
      { mode: "perTile", biomes: [BIOME.FOREST], chance: forestChance, count: [1, 2] },
      { mode: "perTile", biomes: [BIOME.GRASS],  chance: grassChance,  count: [1, 1] }
    ],
    create({ t, h }) {
      const spot = h.tileSpot(t, 0.62);
      if (!h.dryLand(spot.owner)) return null;
      const e = {
        x: spot.x, y: spot.y, z: spot.owner.rz, owner: spot.owner,
        s: h.rr(0.78, 1.24), rot: h.rnd() * Math.PI * 2
      };
      e.canopy = makeCanopy(key, h.rnd());
      /* only build the 3D geometry when it will actually be used */
      if (!TREE_2D) treeFaces(e, key, h);
      return e;
    }
  });
}

const autumnNow = t => t.season > AUTUMN_ABOVE;

defTree("pine", "Pine",
  t => autumnNow(t) ? 0.06 : 0.20,
  t => autumnNow(t) ? 0.00 : 0.04);

defTree("leaf", "Broadleaf",
  t => autumnNow(t) ? 0.06 : 0.16,
  () => 0.02);

defTree("autumn", "Autumn tree",
  t => autumnNow(t) ? 0.30 : 0.03,
  () => 0.00);
