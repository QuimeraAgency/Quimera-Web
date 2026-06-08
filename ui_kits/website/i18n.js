/* ============================================================
   QUIMERA — Language store (EN / ES)
   Plain JS, no React. Loads before everything so the chosen
   language is known on first paint. Persists to localStorage,
   reflects on <html lang>, and notifies React via subscribers.
   ============================================================ */
(function () {
  var KEY = 'quimera-lang';
  var lang = 'en';
  try { lang = localStorage.getItem(KEY) || 'en'; } catch (e) {}
  if (lang !== 'en' && lang !== 'es') lang = 'en';

  var subs = [];
  function set(l) {
    if (l !== 'en' && l !== 'es') return;
    if (l === lang) return;
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    document.documentElement.setAttribute('lang', l);
    for (var i = 0; i < subs.length; i++) subs[i](l);
  }
  window.QLang = {
    get: function () { return lang; },
    set: set,
    toggle: function () { set(lang === 'en' ? 'es' : 'en'); },
    sub: function (fn) {
      subs.push(fn);
      return function () { subs = subs.filter(function (f) { return f !== fn; }); };
    },
  };
  document.documentElement.setAttribute('lang', lang);
})();
