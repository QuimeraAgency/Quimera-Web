window.QHero = function QHero() {
  const lang = useLang();
  const COPY = {
    en: {
      kicker: 'Strategic communications · Reputation · Market entry',
      lead: 'Most firms reduce complexity into something flatter, simpler and easier to market. We help organisations stay strategically legible without losing the depth that makes them differentiated in the first place.',
      cta1: 'Request a conversation', cta2: 'Our services',
      founded: 'Founded 2019', appt: 'By appointment',
    },
    es: {
      kicker: 'Comunicación estratégica · Reputación · Entrada a mercado',
      lead: 'La mayoría de las firmas simplifican la complejidad hasta volverla más fácil de comunicar. Nosotros ayudamos a las organizaciones a seguir siendo estratégicamente claras sin perder la profundidad que las diferencia en primer lugar.',
      cta1: 'Solicita una conversación', cta2: 'Nuestros servicios',
      founded: 'Fundada en 2019', appt: 'Con cita previa',
    },
  };
  const t = COPY[lang];

  const headline = lang === 'es'
    ? (<>La diferencia entre ser <em style={{ fontStyle: 'italic', fontWeight: 500 }}>visto</em> y ser <em style={{ fontStyle: 'italic', fontWeight: 500 }}>entendido</em>.</>)
    : (<>The difference between being <em style={{ fontStyle: 'italic', fontWeight: 500 }}>seen</em> and being <em style={{ fontStyle: 'italic', fontWeight: 500 }}>understood</em>.</>);

  return (
    <section className="q-section loose q-imghost q-hero" style={{ paddingTop: '152px', paddingBottom: '64px' }}>
      {/* Art layer — large classical face (or texture alt) behind the headline */}
      <div className="q-hero-art" aria-hidden="true">
        <div className="q-hero-art-inner q-hero-art-face">
          <img className="q-hero-img" data-parallax="26" src="assets/imagery/face-blocks.png" alt="" />
        </div>
        <div className="q-hero-art-inner q-hero-art-texture">
          <img className="q-hero-img" data-parallax="16" src="assets/imagery/slab.png" alt="" />
        </div>
        <div className="q-hero-veil"></div>
      </div>

      <div className="q-container">
        <div style={{ fontFamily: 'var(--font-title)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: '40px' }}>
          {t.kicker}
        </div>

        <h1 className="q-hero-h1" style={{
          fontFamily: 'var(--font-title)',
          lineHeight: 1.0,
          letterSpacing: '-0.035em',
          fontWeight: 700,
          textWrap: 'balance',
          margin: 0,
          maxWidth: '20ch',
          textShadow: '0 2px 50px rgba(8,7,11,0.55)',
        }}>
          {headline}
        </h1>

        <div className="q-hero-foot">
          <div className="q-hero-foot-l">
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.6, color: 'var(--fg-2)', fontWeight: 400, margin: 0, maxWidth: '52ch' }}>
              {t.lead}
            </p>
            <div style={{ marginTop: '36px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a className="q-btn primary" href="#contact">{t.cta1} <span className="arrow">→</span></a>
              <a className="q-btn secondary" href="#services">{t.cta2}</a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '72px' }}>
          <div className="q-coord-ribbon">
            <div className="left">
              <span>Madrid · España</span>
              <span>{t.founded}</span>
              <span>{t.appt}</span>
            </div>
            <div className="right">
              <span>40.4168 N · 03.7038 W</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
