window.QPerspectiveStrip = function QPerspectiveStrip() {
  const lang = useLang();
  const COPY = {
    en: {
      eyebrow: 'Perspective',
      articles: [
        { eyebrow: 'On Timing',   date: '04 / 26', title: 'The right message at the wrong moment is still the wrong message.', read: '6 min' },
        { eyebrow: 'On Silence',  date: '03 / 26', title: 'What a company chooses not to say is also a position.',            read: '5 min' },
        { eyebrow: 'On Scrutiny', date: '02 / 26', title: 'Reputation is tested in the moments you did not plan for.',        read: '7 min' },
      ],
      readLabel: 'read',
      cta: 'Read all perspective',
    },
    es: {
      eyebrow: 'Perspectiva',
      articles: [
        { eyebrow: 'Sobre el momento',   date: '04 / 26', title: 'El mensaje correcto en el momento equivocado sigue siendo el mensaje equivocado.', read: '6 min' },
        { eyebrow: 'Sobre el silencio',  date: '03 / 26', title: 'Lo que una empresa elige no decir también es una posición.',                       read: '5 min' },
        { eyebrow: 'Sobre el escrutinio', date: '02 / 26', title: 'La reputación se pone a prueba en los momentos que no planeaste.',                read: '7 min' },
      ],
      readLabel: 'de lectura',
      cta: 'Ver toda la perspectiva',
    },
  };
  const t = COPY[lang];

  const heading = lang === 'es'
    ? (<>Notas, informes y <em>documentos de trabajo.</em></>)
    : (<>Notes, briefs, and <em>working papers.</em></>);

  return (
    <section className="q-section" id="perspective">
      <div className="q-container">
        <div className="q-section-header">
          <div className="l">
            <div className="num"></div>
            <div className="eyebrow">{t.eyebrow}</div>
          </div>
          <h2>{heading}</h2>
        </div>

        <div className="q-persp-grid">
          {t.articles.map((a, i) => (
            <a key={i} href="perspective.html" className="q-card dark" style={{ minHeight: '320px', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="eyebrow">{a.eyebrow}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--fg-3)' }}>{a.date}</span>
                </div>
                <h3>{a.title}</h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--rule)', paddingTop: '16px', marginTop: '24px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--fg-3)', textTransform: 'uppercase' }}>{a.read} {t.readLabel}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-2)' }}>→</span>
              </div>
            </a>
          ))}
        </div>

        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
          <a className="q-btn secondary" href="perspective.html">{t.cta} <span className="arrow">→</span></a>
        </div>
      </div>
    </section>
  );
};
