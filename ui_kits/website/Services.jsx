window.QServices = function QServices() {
  const lang = useLang();
  const COPY = {
    en: {
      eyebrow: 'Services architecture',
      layers: [
        { n: '01', verb: 'DEFINE',   lead: 'We map reality.',          cont: 'We clarify what matters, what is at stake, and what is possible.' },
        { n: '02', verb: 'ACTIVATE', lead: 'We shape perspective.',    cont: 'We decide what becomes visible, when, and to whom it matters most.' },
        { n: '03', verb: 'SUSTAIN',  lead: 'We build gravity.',        cont: 'We turn presence into authority that holds under pressure and endures beyond the moment.' },
      ],
      cta: 'Explore the full Services page',
    },
    es: {
      eyebrow: 'Arquitectura de servicios',
      layers: [
        { n: '01', verb: 'DEFINIR',  lead: 'Cartografiamos la realidad.',       cont: 'Clarificamos qué importa, qué está en juego y qué es posible.' },
        { n: '02', verb: 'ACTIVAR',  lead: 'Damos forma a la percepción.',     cont: 'Decidimos qué se hace visible, cuándo y para quién importa más.' },
        { n: '03', verb: 'SOSTENER', lead: 'Construimos influencia.',             cont: 'Convertimos la presencia en autoridad que resiste la presión y perdura más allá de un solo impacto.' },
      ],
      cta: 'Explora la página completa de Servicios',
    },
  };
  const t = COPY[lang];

  const heading = lang === 'es'
    ? (<>Tres capas. <em style={{ fontStyle: 'italic', fontWeight: 500 }}>Un sistema.</em></>)
    : (<>Three layers. <em style={{ fontStyle: 'italic', fontWeight: 500 }}>One system.</em></>);

  return (
    <section className="q-section" id="services">
      <div className="q-container">
        <div className="q-section-header">
          <div className="l">
            <div className="num"></div>
            <div className="eyebrow">{t.eyebrow}</div>
          </div>
          <h2>{heading}</h2>
        </div>

        <div className="q-trilogy">
          {t.layers.map((l) => (
            <div key={l.n} className="col" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', color: 'var(--fg-3)' }}>{l.n}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500, letterSpacing: '0.2em', color: 'var(--fg-2)' }}>{l.verb}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '30px', lineHeight: 1.12, letterSpacing: '-0.01em', fontWeight: 400, color: 'var(--fg-1)' }}>{l.lead}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.6, color: 'var(--fg-2)', maxWidth: '34ch' }}>{l.cont}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '64px', paddingTop: '40px', borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
          <a className="q-btn secondary" href="services.html">{t.cta} <span className="arrow">→</span></a>
        </div>
      </div>
    </section>
  );
};
