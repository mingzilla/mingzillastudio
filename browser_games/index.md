---
title: Browser games
---

<style>
  :root{
    --bg:#f7f7f4;
    --surface:#ffffff;
    --ink:#101114;
    --muted:#666a73;
    --line:#d9dbdf;
    --soft:#eceeea;
    --accent:#5a57ff;
    --radius:28px;
  }
  .bg-wrap{
    margin:0;background-color:var(--bg);
    background-image:
      repeating-linear-gradient(0deg,rgba(17,18,20,.05) 0,rgba(17,18,20,.05) 1px,transparent 1px,transparent 9px),
      repeating-linear-gradient(90deg,rgba(17,18,20,.05) 0,rgba(17,18,20,.05) 1px,transparent 1px,transparent 9px),
      linear-gradient(160deg,#fbfbf8 0%,#f3f3ee 42%,#edf0f6 100%);
    color:var(--ink);
    font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    -webkit-font-smoothing:antialiased;
    min-height:100vh;
    padding:56px 20px 72px;
  }
  .bg-wrap *{box-sizing:border-box}
  .sheet{width:min(1080px,100%);margin:0 auto}
  .eyebrow{
    margin:0 0 14px;text-transform:uppercase;letter-spacing:.18em;
    font-size:12px;font-weight:700;color:var(--muted);
  }
  .bg-wrap h1{
    font-size:clamp(38px,6.4vw,60px);line-height:.95;letter-spacing:-.06em;margin:0;
  }
  .lede{
    margin:22px 0 0;font-size:clamp(17px,2.2vw,21px);color:var(--muted);
    letter-spacing:-.02em;max-width:56ch;line-height:1.45;
  }
  .grid{
    display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
    gap:20px;margin-top:46px;
  }
  .card{
    position:relative;display:flex;flex-direction:column;
    border:1px solid var(--line);border-radius:var(--radius);
    background:linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,255,255,.62));
    box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 16px 40px -22px rgba(17,18,20,.2);
    padding:30px 30px 26px;text-decoration:none;color:inherit;
    transition:transform .2s,box-shadow .2s,border-color .2s;
  }
  .card:hover{
    transform:translateY(-4px);border-color:#c5c7cc;
    box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 26px 52px -22px rgba(17,18,20,.28);
  }
  .card:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
  .tag{
    font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
    color:var(--muted);margin:0 0 16px;
  }
  .card h2{
    font-size:clamp(23px,3vw,30px);letter-spacing:-.04em;line-height:1.08;margin:0;
  }
  .card p{
    margin:14px 0 0;font-size:15px;line-height:1.5;color:var(--muted);
  }
  .keys{
    list-style:none;margin:20px 0 26px;padding:0;display:flex;flex-wrap:wrap;gap:8px;
  }
  .keys li{
    font-size:12px;color:var(--muted);background:var(--soft);
    border:1px solid var(--line);border-radius:999px;padding:5px 11px;
  }
  .go{
    margin-top:auto;padding-top:18px;border-top:1px solid var(--line);
    font-size:14px;font-weight:650;letter-spacing:-.01em;
    display:flex;align-items:center;gap:8px;
  }
  .go .arrow{transition:transform .2s}
  .card:hover .go .arrow{transform:translateX(4px)}
  .note{
    margin-top:22px;font-size:12.5px;color:var(--muted);line-height:1.5;
  }
  @media (prefers-reduced-motion:reduce){
    .card,.go .arrow{transition:none}
  }
</style>

<div class="bg-wrap">
  <div class="sheet">

    <p class="eyebrow">Mingzillastudio</p>
    <h1>Browser games</h1>
    <p class="lede">Two small games, both single files you can open straight in a browser. No build step, no install.</p>

    <div class="grid">

      <a class="card" href="kenny-game/">
        <p class="tag">Arcade &middot; one player</p>
        <h2>What&rsquo;s The Actual Problem?</h2>
        <p>Everything is falling at you at once. Most of it is waffle. Somewhere in there is a real problem &mdash; spot it, and whatever you do, don&rsquo;t shoot it.</p>
        <ul class="keys">
          <li>Tap the waffle</li>
          <li>Let real problems land</li>
          <li>Space = power-up</li>
        </ul>
        <span class="go">Play <span class="arrow">&rarr;</span></span>
      </a>

      <a class="card" href="lowpoly-city/">
        <p class="tag">Explorer &middot; procedurally generated</p>
        <h2>Lowpoly Valley</h2>
        <p>A little 3D valley you can walk around. Every hedge, house, sheep and windmill is generated geometry &mdash; there isn&rsquo;t a single image in it. Type a seed to grow a different one.</p>
        <ul class="keys">
          <li>WASD to walk</li>
          <li>Q / E turn camera</li>
          <li>Space plants a tree</li>
        </ul>
        <span class="go">Play <span class="arrow">&rarr;</span></span>
      </a>

    </div>

    <p class="note">
      Lowpoly Valley loads D3 from a CDN, so it needs a network connection the first time you open it.
      Everything else works offline.
    </p>

  </div>
</div>
