/* Art Direction study — subtle motion only.
   - IntersectionObserver reveals .ad-reveal blocks
   - slow parallax drift on [data-drift] (translateY scaled by viewport progress)
   - sticky A/B/C nav active state
   Respects prefers-reduced-motion. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- reveal ----
  var revealEls = [].slice.call(document.querySelectorAll('.ad-reveal'));
  function show(el) { el.classList.add('in'); }
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.92 && r.bottom > 0;
  }
  function revealInView() {
    revealEls.forEach(function (el) { if (!el.classList.contains('in') && inView(el)) show(el); });
  }

  // 1. reveal anything already in view immediately
  revealInView();

  // 2. IntersectionObserver — the preferred scroll-reveal in real browsers
  var observerFired = false;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      observerFired = true;
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });
  } else {
    revealEls.forEach(show);
  }

  // 3. scroll fallback — covers environments where the observer is flaky but scrolling works
  window.addEventListener('scroll', revealInView, { passive: true });

  // 4. safety net — guarantee nothing stays hidden (covers environments where
  //    the observer fires once then stalls, or where scrolling is blocked).
  //    Real browsers have already animated the above-fold in; below-fold reveals
  //    off-screen, so the scroll effect for early sections is preserved.
  if (!reduce) {
    setTimeout(function () { revealEls.forEach(show); }, 1200);
  }

  // ---- drift / parallax ----
  var driftEls = [].slice.call(document.querySelectorAll('[data-drift]'));
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var vh = window.innerHeight;
      driftEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var center = r.top + r.height / 2;
        var progress = (center - vh / 2) / vh; // -1..1 across viewport
        var amt = parseFloat(el.getAttribute('data-drift')) || 0;
        el.style.transform = 'translate3d(0,' + (progress * amt).toFixed(2) + 'px,0)';
      });
      ticking = false;
    });
  }
  if (!reduce && driftEls.length) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  // ---- sticky direction nav ----
  var navLinks = [].slice.call(document.querySelectorAll('.ad-dirnav a'));
  var dirs = navLinks.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  function setActive() {
    var line = window.innerHeight * 0.35;
    var idx = 0;
    dirs.forEach(function (sec, i) {
      if (sec && sec.getBoundingClientRect().top - line <= 0) idx = i;
    });
    navLinks.forEach(function (a, i) { a.classList.toggle('active', i === idx); });
  }
  if (navLinks.length) {
    window.addEventListener('scroll', setActive, { passive: true });
    window.addEventListener('resize', setActive);
    setActive();
    navLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
      });
    });
  }
})();
