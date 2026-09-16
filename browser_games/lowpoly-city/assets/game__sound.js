/* =========================================================================
   game__sound.js — the animals answer back
   =========================================================================
   Everything here is synthesised. The folder ships no audio files and pulls
   nothing but d3 off a CDN, so a .wav would be the only thing in the valley
   that needs a download — and a moo is a couple of oscillators anyway.

   A cry fires when you walk into an animal. Each animal carries its own
   cooldown and there is a second, global one on top, so a flock of sheep is a
   few bleats rather than a wall of them.

   Browsers refuse to start audio until the page has been touched, so the
   context is built on the first key or tap and every call here is a no-op
   until then. That is why nothing bothers to check whether audio exists.

   Each voice is a shape, not a recording: `vib` is a wobble on the pitch and
   that is the whole difference between a sheep and a cow — same sawtooth, one
   is an octave and a half down and three times as long.
   ========================================================================= */

let actx = null, master = null, noiseBuf = null;
let soundOn = true;
let lastCry = -99;

const CRY_GAP = 1.4;          // one animal will not speak again for this long
const CRY_GLOBAL_GAP = 0.12;  // and only one animal is picked per this long
const PLAYER_R = 0.14;        // the character's shoulders, before WORLD_SCALE

function audio() {
  if (actx) return actx;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  /* Ask for the playback session, so a phone with the ringer switch off still
     plays. Without this line Web Audio on iOS is silent for anyone whose
     phone is on silent — which is most people, most of the time — and no
     amount of unlocking will bring it back. */
  if (navigator.audioSession) navigator.audioSession.type = "playback";
  actx = new Ctor();
  master = actx.createGain();
  master.gain.value = 0.45;      // phone speakers are small and this is quiet material
  master.connect(actx.destination);
  return actx;
}

/* Called from every kind of first contact with the page. iOS wants more than a
   resume(): it wants to see a source actually started inside the handler, so
   one silent sample goes out with the first one. resume() alone works on some
   versions and silently fails on others, which is the worst kind of bug. */
let primed = false;

function wakeAudio() {
  const a = audio();
  if (!a) return;
  if (a.state !== "running" && a.resume) a.resume();
  if (primed) return;
  primed = true;
  const b = a.createBufferSource();
  b.buffer = a.createBuffer(1, 1, a.sampleRate);
  b.connect(a.destination);
  b.start(0);
}

function noiseFor(a) {
  if (noiseBuf) return noiseBuf;
  const n = Math.floor(a.sampleRate * 0.4);
  noiseBuf = a.createBuffer(1, n, a.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}

/* One voiced note. `vibHz`/`vibDepth` are the bleat; leave them off and it is
   a plain tone, which is what the cow and the bird want. */
function tone(a, t0, o) {
  const osc = a.createOscillator(), g = a.createGain();
  osc.type = o.type || "sawtooth";
  osc.frequency.setValueAtTime(o.f0, t0);
  if (o.f1) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.f1), t0 + o.dur);
  if (o.vibHz) {
    const lfo = a.createOscillator(), depth = a.createGain();
    lfo.frequency.value = o.vibHz;
    depth.gain.value = o.vibDepth || 40;
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(t0); lfo.stop(t0 + o.dur + 0.05);
  }
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(o.gain || 0.5, t0 + (o.attack || 0.015));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  osc.connect(g).connect(master);
  osc.start(t0); osc.stop(t0 + o.dur + 0.03);
}

/* Unvoiced — a snort, a cluck's edge. Bandpassed white noise. */
function hiss(a, t0, o) {
  const src = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain();
  src.buffer = noiseFor(a);
  bp.type = "bandpass";
  bp.frequency.value = o.freq || 500;
  bp.Q.value = o.q === undefined ? 1.2 : o.q;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(o.gain || 0.4, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  src.connect(bp).connect(g).connect(master);
  src.start(t0); src.stop(t0 + o.dur + 0.02);
}

/* three quick notes falling away, with a tick of breath in front */
function cluck(a, t, v) {
  hiss(a, t, { freq: 1700, q: 0.8, dur: 0.05, gain: 0.14 });
  for (let i = 0; i < 3; i++) {
    tone(a, t + i * 0.085, {
      f0: 870 * v * (1 + i * 0.07), f1: 600 * v,
      dur: 0.06, type: "square", gain: 0.20
    });
  }
}

function chirp(a, t, v) {
  const n = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < n; i++) {
    tone(a, t + i * 0.09, { f0: 2100 * v, f1: 3300 * v, dur: 0.07, type: "sine", gain: 0.26 });
  }
}

/* `r` is how close the character has to get, before WORLD_SCALE. It tracks
   the animal's actual bulk, so you have to be inside a cow's flank but a hen
   only has to be underfoot. */
const VOICES = {
  sheep: { r: 0.24, cry(a, t, v) { tone(a, t, { f0: 470 * v, f1: 395 * v, dur: 0.42, vibHz: 21, vibDepth: 60, gain: 0.40 }); } },
  goat:  { r: 0.20, cry(a, t, v) { tone(a, t, { f0: 640 * v, f1: 555 * v, dur: 0.30, vibHz: 32, vibDepth: 90, gain: 0.34 }); } },
  cow:   { r: 0.30, cry(a, t, v) { tone(a, t, { f0: 165 * v, f1: 118 * v, dur: 1.05, vibHz: 6, vibDepth: 10, gain: 0.62, attack: 0.06 }); } },
  deer:  { r: 0.26, cry(a, t, v) { hiss(a, t, { freq: 430 * v, q: 1.0, dur: 0.16, gain: 0.50 });
                                   tone(a, t, { f0: 240 * v, f1: 145 * v, dur: 0.14, type: "square", gain: 0.26 }); } },
  hen:   { r: 0.13, cry(a, t, v) { cluck(a, t, v); } },
  bird:  { r: 0.12, cry(a, t, v) { chirp(a, t, v); } }
};

/* The player is a point, so the test is a circle round each animal. Only the
   mobile ones are considered — everything else in `entities` is scenery, and
   there are well over a thousand of those. */
function updateAnimalSounds() {
  if (!soundOn || !actx || actx.state !== "running") return;
  if (now - lastCry < CRY_GLOBAL_GAP) return;
  for (let i = 0; i < entities.length; i++) {
    const e = entities[i];
    if (!e.mobile) continue;
    const v = VOICES[e.key];
    if (!v) continue;
    const reach = (v.r + PLAYER_R) * e.s * e.sizeMul * WORLD_SCALE;
    const dx = e.x - player.x, dy = e.y - player.y;
    if (dx * dx + dy * dy > reach * reach) continue;
    if (e._cryAt !== undefined && now - e._cryAt < CRY_GAP) continue;
    e._cryAt = now;
    lastCry = now;
    /* a little pitch scatter, or six sheep in a field are one sheep */
    v.cry(actx, actx.currentTime + 0.01, 0.92 + Math.random() * 0.17);
    return;                       // one voice at a time, whatever you walk into
  }
}

/* ------------------------------------------------------------------ UI --- */

const sndToggle = document.getElementById("sndToggle");

function toggleSound(force) {
  soundOn = force === undefined ? !soundOn : !!force;
  if (sndToggle) {
    sndToggle.textContent = soundOn ? "🔊" : "🔇";
    sndToggle.title = (soundOn ? "Mute" : "Unmute") + " (M)";
    sndToggle.setAttribute("aria-label", soundOn ? "Mute the animals" : "Unmute the animals");
  }
  if (soundOn) wakeAudio();
}

/* No init call: the button ships in the right state, and building the context
   here would make a suspended one on page load for nothing. It waits for the
   first gesture, which is the only way a browser will let it start anyway. */
/* Every route in: a tap, a touch on a browser that will not give us pointer
   events, a key, a click, and coming back from the background. */
window.addEventListener("pointerdown", wakeAudio);
window.addEventListener("touchstart", wakeAudio, { passive: true });
window.addEventListener("keydown", wakeAudio);
window.addEventListener("click", wakeAudio);
document.addEventListener("visibilitychange", () => { if (!document.hidden) wakeAudio(); });
