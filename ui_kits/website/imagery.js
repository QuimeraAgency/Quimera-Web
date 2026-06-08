/* ============================================================
   QUIMERA — Scroll-motion engine
   Two continuous, scroll-position-linked layers so there is ALWAYS
   something in gentle motion while the visitor scrolls (either way):

   1. [data-parallax]  — image drift via --py (consumed by transform:
      translate3d in CSS). Unchanged; used by hero art, fragments,
      specimen plates, the hourglass watermark.

   2. FLOW selectors    — decorative marks + content blocks drift at
      layered rates via the STANDALONE `translate:` property, which
      composes with the `transform:`-based entrance reveals without
      fighting them. Travel is tied to each element's position in the
      viewport (−1..1), so motion runs on scroll-up AND scroll-down.

   Bails entirely on prefers-reduced-motion.
   ============================================================ */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* selector → drift amplitude in px (total travel ≈ 2× this across a
     full viewport pass). Larger = more apparent depth. */
  var FLOW = [
    ['.q-coord-field', 40],
    ['.q-hero-ring', 30],
    ['.q-section-header h2', 18],
    ['.q-section-header .eyebrow', 26],
    ['.q-page-hero-h1', 16],
    ['.q-page-hero .lede', 24],
    ['.q-manifesto-grid > div', 16],
    ['.q-persp-grid > a', 22],
    ['.q-trilogy > .col', 18],
    ['.q-case', 14],
    ['.q-step', 14],
    ['.q-layer', 16],
    ['.q-who-grid > *', 16],
    ['.q-contact-row', 16],
    ['.q-article-row', 14],
    ['.q-featured', 14],
    ['.q-prose p', 10],
  ];

  var flowNodes = [];   // cached { el, amt } list
  var seen = 'undefined' !== typeof WeakSet ? new WeakSet() : null;

  function scanFlow() {
    for (var f = 0; f < FLOW.length; f++) {
      var sel = FLOW[f][0], amt = FLOW[f][1];
      var nodes = document.querySelectorAll(sel);
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (seen) { if (seen.has(el)) continue; seen.add(el); }
        // small per-sibling variance so grouped rows layer slightly
        var vary = 1;
        if (el.parentElement) {
          var sibs = el.parentElement.children, idx = 0;
          for (var s = 0; s < sibs.length; s++) { if (sibs[s] === el) { idx = s; break; } }
          vary = 1 + (idx % 3) * 0.16;
        }
        el.style.willChange = 'translate';
        flowNodes.push({ el: el, amt: amt * vary });
      }
    }
  }

  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;

    // 1. image parallax (--py)
    var pll = document.querySelectorAll('[data-parallax]');
    for (var i = 0; i < pll.length; i++) {
      var el = pll[i];
      var r = el.getBoundingClientRect();
      var p = ((r.top + r.height / 2) - vh / 2) / vh;        // −1..1
      var amt = parseFloat(el.getAttribute('data-parallax')) || 0;
      el.style.setProperty('--py', (p * amt).toFixed(1) + 'px');
    }

    // 2. flow drift (standalone translate)
    for (var j = 0; j < flowNodes.length; j++) {
      var n = flowNodes[j], e = n.el;
      var rr = e.getBoundingClientRect();
      if (rr.bottom < -vh || rr.top > vh * 2) continue;      // far off-screen: skip
      var pr = ((rr.top + rr.height / 2) - vh / 2) / vh;     // −1..1
      if (pr > 1.4) pr = 1.4; else if (pr < -1.4) pr = -1.4;
      // drift up as the element rises past centre → classic parallax
      e.style.translate = '0 ' + (-pr * n.amt).toFixed(1) + 'px';
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);

  // catch nodes as React mounts them; rescan a while, then settle
  var c = 0, iv = setInterval(function () {
    scanFlow();
    update();
    if (++c > 50) clearInterval(iv);
  }, 120);
  scanFlow();
  update();
})();
