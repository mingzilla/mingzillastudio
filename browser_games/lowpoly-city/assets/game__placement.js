/* =========================================================================
   game__placement.js — where everything in the valley comes to stand
   ========================================================================= */

const clampI = (v, a, b) => v < a ? a : v > b ? b : v;
const countFor = (spec, t) => typeof spec === "function" ? spec(t, H)
                       : Array.isArray(spec) ? (spec[0] + Math.floor(rnd() * (spec[1] - spec[0] + 1)))
                       : 1;

function decorate() {
  for (const def of DEFS) {
    if (!def.spawn) continue;
    const rules = Array.isArray(def.spawn) ? def.spawn : [def.spawn];
    for (const rule of rules) {
      if (rule.kind) continue;                    // village / water kinds spawn elsewhere
      if (rule.mode === "perTile") spawnPerTile(def, rule);
      else if (rule.mode === "scatter") spawnScatter(def, rule);
    }
  }
  placeVillages();
  placeBoats();
  tileList.forEach(t => { if (t.bridge) spawnEntity("bridge", t); });
}

function spawnPerTile(def, rule) {
  for (const t of tileList) {
    if (rule.biomes.indexOf(t.biome) < 0) continue;
    if (rule.where && !rule.where(t, H)) continue;
    const chance = typeof rule.chance === "function" ? rule.chance(t, H)
                 : rule.chance === undefined ? 1 : rule.chance;
    if (chance <= 0 || rnd() >= chance) continue;
    const n = rule.count ? countFor(rule.count, t) : 1;
    for (let i = 0; i < n; i++) spawnEntity(def.key, t);
  }
}

function spawnScatter(def, rule) {
  const pool = tileList.filter(t =>
    rule.biomes.indexOf(t.biome) >= 0 && (!rule.where || rule.where(t, H)));
  shuffleSeeded(pool);
  const want = clampI(Math.round(pool.length * (rule.density || 0.02)), rule.min || 0, rule.max || 999);
  const taken = [];
  let placed = 0;
  for (const t of pool) {
    if (placed >= want) break;
    const gap = (rule.gap || 0) * HEX_SIZE;
    if (gap && taken.some(s => Math.hypot(s.cx - t.cx, s.cy - t.cy) < gap)) continue;
    if (spawnEntity(def.key, t)) { taken.push(t); placed++; }
  }
}

/* Villages: a well in the middle, houses on the flat ring around it. */
function placeVillages() {
  const flat = tileList.filter(t =>
    t.biome === BIOME.GRASS && t.h > SEA && t.h <= PLAIN + STEP);
  shuffleSeeded(flat);
  const sites = [];
  for (const t of flat) {
    if (sites.length >= 10) break;
    if (sites.every(s => Math.hypot(s.cx - t.cx, s.cy - t.cy) > 4.6)) {
      sites.push(t);
      makeVillage(t);
    }
  }
}

function makeVillage(centre) {
  spawnEntity("well", centre);
  const homes = [centre];
  for (const d of DIRS) {
    const n = tiles.get(key(centre.q + d[0], centre.r + d[1]));
    if (n && n.biome === BIOME.GRASS && rnd() < 0.6) homes.push(n);
  }
  homes.forEach((t, i) => {
    if (i > 0 && rnd() < 0.22) return;
    const spot = tileSpot(t, i === 0 ? 0.18 : 0.48);
    if (spot.owner.biome !== BIOME.GRASS) return;
    const e = spawnEntity("house", spot.owner);
    if (e) { e.x = spot.x; e.y = spot.y; }
  });
}

function placeBoats() {
  const water = tileList.filter(t =>
    t.biome === BIOME.WATER && t.nb.some(n => n && n.biome !== BIOME.WATER));
  shuffleSeeded(water);
  const n = clampI(Math.round(water.length * 0.06), 6, 18);
  water.slice(0, n).forEach(t => spawnEntity("boat", t));
}
