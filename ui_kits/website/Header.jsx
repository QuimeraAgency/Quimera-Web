const { useState, useEffect } = React;

/* Shared site header.
   page: 'home' | 'services' | 'work' | 'perspective'
   - The active dot reflects the current PAGE and only moves on click/navigation.
   - EN/ES toggle switches language site-wide (persisted) via window.QLang.
   - On a sub-page, Services/Work/Perspective navigate between pages; the
     current page is marked active; Welcome/Contact jump back to home sections. */
window.QHeader = function QHeader({ page = 'home' }) {
  const lang = useLang();

  const items = [
    { key: 'manifesto',   en: 'Welcome',     es: 'Home',        kind: 'anchor' },
    { key: 'services',    en: 'Services',    es: 'Servicios',   kind: 'page', href: 'services.html' },
    { key: 'work',        en: 'Work',        es: 'Trabajo',     kind: 'page', href: 'work.html' },
    { key: 'perspective', en: 'Perspective', es: 'Perspectiva', kind: 'page', href: 'perspective.html', flag: 'perspective' },
    { key: 'contact',     en: 'Contact',     es: 'Contacto',    kind: 'anchor' },
  ].filter((it) => !it.flag || (window.QFlags && window.QFlags[it.flag]));

  const isHome = page === 'home';
  const hrefFor = (it) => {
    if (it.kind === 'page') return it.href;
    return isHome ? `#${it.key}` : `index.html#${it.key}`;
  };

  const [active, setActive] = useState(isHome ? 'manifesto' : page);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    document.body.classList.toggle('q-noscroll', menuOpen);
    return () => document.body.classList.remove('q-noscroll');
  }, [menuOpen]);

  // Close the overlay on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const setLang = (l) => (e) => { e.preventDefault(); window.QLang.set(l); };
  const homeHref = isHome ? '#' : 'index.html';

  return (
    <header className="q-header">
      <div className="inner">
        <a href={homeHref} className="q-lockup">
          <img src="../../assets/quimera-mark-bebacc.svg" alt="" />
          <span>Quimera Agency</span>
        </a>

        <nav className="q-nav">
          {items.map((it) => (
            <a key={it.key} href={hrefFor(it)}
              onClick={() => { if (it.kind === 'anchor') setActive(it.key); }}
              className={(it.key === active ? 'active' : '') + (it.key === 'contact' ? ' is-contact' : '')}>{it[lang]}</a>
          ))}
        </nav>

        <div className="q-locale">
          <a href="#" onClick={setLang('en')} className={lang === 'en' ? 'active' : ''}>EN</a>
          <span className="sep">/</span>
          <a href="#" onClick={setLang('es')} className={lang === 'es' ? 'active' : ''}>ES</a>
        </div>

        <button
          className="q-burger"
          aria-label={menuOpen ? (lang === 'es' ? 'Cerrar menú' : 'Close menu') : (lang === 'es' ? 'Abrir menú' : 'Open menu')}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}>
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className={`q-mobile-menu${menuOpen ? ' open' : ''}`}>
        {items.map((it, i) => (
          <a key={it.key} href={hrefFor(it)}
            className={it.key === active ? 'active' : ''}
            onClick={() => { if (it.kind === 'anchor') setActive(it.key); setMenuOpen(false); }}>
            {it[lang]}
            <span className="idx">{String(i + 1).padStart(2, '0')}</span>
          </a>
        ))}
        <div className="q-mm-foot">
          <span>Madrid · España</span>
          <span className="locale">
            <a href="#" onClick={setLang('en')} className={lang === 'en' ? 'active' : ''}>EN</a> / <a href="#" onClick={setLang('es')} className={lang === 'es' ? 'active' : ''}>ES</a>
          </span>
        </div>
      </div>
    </header>
  );
};
