/* ============================================================
   QUIMERA — Motion engine
   1. Hero entrance (staggered, on load)
   2. Scroll reveal (IntersectionObserver, fire-once)
   3. Nav background on scroll past 40px
   Vanilla + defensive: bails to fully-visible on reduced motion;
   polls briefly so it catches React-mounted nodes.
   ============================================================ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;                         // leave everything visible

  var root = document.documentElement;
  root.classList.add('js-motion');            // arm the hidden base states

  /* ---- Nav: tint + blur after 40px ---- */
  function nav() {
    var h = document.querySelector('.q-header');
    if (!h) return;
    var on = window.scrollY > 40;
    h.classList.toggle('scrolled', on);
  }
  window.addEventListener('scroll', nav, { passive: true });
  nav();

  /* ---- index of an element among same-selector siblings (for stagger) ---- */
  function indexInParent(el, sel) {
    var p = el.parentElement;
    if (!p) return 0;
    var sibs = p.querySelectorAll(':scope > ' + sel);
    for (var i = 0; i < sibs.length; i++) if (sibs[i] === el) return i;
    return 0;
  }

  /* Reveal targets: [selector, per-row stagger seconds]. */
  var GROUPS = [
    ['.q-section-header', 0],
    ['.q-svc-row', 0.1],
    ['.q-work-head', 0],
    ['.q-work-row', 0.08],
    ['.q-manifesto-grid > div', 0.14],
    ['.q-persp-grid > a', 0.12],
    ['.q-layer', 0.1],
    ['.q-step', 0.1],
    ['.q-case', 0.08],
    ['.q-featured', 0],
    ['.q-theme-head', 0],
    ['.q-article-row', 0.06],
    ['.q-page-cta', 0],
    ['.q-closing .stmt', 0],
    ['.q-closing .sub', 0.12],
    ['.q-prose', 0],
  ];

  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        // Reversible: animate in on enter (from EITHER scroll direction),
        // reset on leave so it replays next time it scrolls back into view.
        // → motion happens scrolling DOWN and UP. (Hero entrance stays
        //   fire-once; that uses data-load, not this observer.)
        if (e.isIntersecting) e.target.classList.add('in');
        else e.target.classList.remove('in');
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  }

  function armReveal(el, childSel, stagger) {
    if (el.hasAttribute('data-reveal') || el.hasAttribute('data-load')) return;
    el.setAttribute('data-reveal', '');
    if (stagger) {
      var i = childSel ? indexInParent(el, childSel.replace(/^.*>\s*/, ''))
                       : indexInParent(el, el.tagName.toLowerCase());
      el.style.setProperty('--reveal-delay', (i * stagger).toFixed(2) + 's');
    }
    if (io) io.observe(el);            // viewport-based, reliable; no rect guessing
    else el.classList.add('in');
  }

  function scanReveals() {
    GROUPS.forEach(function (g) {
      var sel = g[0], stagger = g[1];
      var childSel = sel.indexOf('>') > -1 ? sel : null;
      document.querySelectorAll(sel).forEach(function (el) {
        armReveal(el, childSel, stagger);
      });
    });
  }

  /* ---- Hero entrance: staggered, runs once when hero mounts ---- */
  function applyLoad(seq) {
    seq.forEach(function (s) {
      var el = s[0];
      if (!el || el.hasAttribute('data-load')) return;
      el.setAttribute('data-load', '');
      el.style.setProperty('--load-delay', s[1] + 's');
      el.style.setProperty('--load-dur', s[2] + 's');
      if (s[3]) el.classList.add('opacity-only');
    });
    // Force a reflow so the hidden base commits, then release via timeout.
    // (setTimeout still fires in background tabs; rAF is paused there, which
    // could otherwise leave the hero stuck hidden.)
    void document.body.offsetHeight;
    setTimeout(function () {
      seq.forEach(function (s) { if (s[0]) s[0].classList.add('in'); });
    }, 40);
  }

  var heroDone = false;
  function heroLoad() {
    if (heroDone) return;

    // Home hero (.q-section.loose)
    var h1 = document.querySelector('.q-section.loose .q-hero-h1');
    if (h1) {
      heroDone = true;
      var tagline = h1.previousElementSibling;
      var subtitle = h1.nextElementSibling;
      var ctas = subtitle ? subtitle.nextElementSibling : null;
      var ribbon = document.querySelector('.q-section.loose .q-coord-ribbon');
      applyLoad([
        [tagline, 0.10, 0.9, false],
        [h1, 0.25, 1.0, false],
        [subtitle, 0.50, 0.95, false],
        [ctas, 0.70, 0.95, false],
        [ribbon, 1.00, 0.9, true],
      ]);
      return;
    }

    // Dedicated page hero (.q-page-hero)
    var ph = document.querySelector('.q-page-hero');
    if (ph) {
      heroDone = true;
      applyLoad([
        [ph.querySelector('.eyebrow'), 0.10, 0.9, false],
        [ph.querySelector('h1'), 0.25, 1.0, false],
        [ph.querySelector('.lede'), 0.50, 0.95, false],
        [ph.querySelector('.meta'), 0.75, 0.9, true],
      ]);
    }
  }

  /* ---- Boot: poll briefly for React-mounted nodes ---- */
  var n = 0;
  var iv = setInterval(function () {
    heroLoad();
    scanReveals();
    nav();
    if (++n > 40) clearInterval(iv);          // ~5s of polling then stop
  }, 120);
  // also run once on DOM ready in case scripts already settled
  if (document.readyState !== 'loading') { heroLoad(); scanReveals(); }
  else document.addEventListener('DOMContentLoaded', function () { heroLoad(); scanReveals(); });

  /* ---- Safety net: in a non-scrollable context (e.g. a full-height
     preview frame where IntersectionObserver can never fire on scroll),
     reveal anything still hidden so content is never lost. Also hard-settle
     the hero entrance so a frozen transition can never leave it blank. ---- */
  setTimeout(function () {
    root.classList.add('motion-settled');          // hero can never stay hidden
    var canScroll = document.documentElement.scrollHeight > window.innerHeight + 8;
    if (canScroll) return;                          // real page → trust IO on scroll
    document.querySelectorAll('[data-reveal]:not(.in)').forEach(function (el) {
      el.classList.add('in');
    });
  }, 4000);
})();
