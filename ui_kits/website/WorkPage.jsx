window.QWorkPage = function QWorkPage() {
  const lang = useLang();
  const COPY = {
    en: {
      eyebrow: 'Selected work',
      lede: 'Client confidentiality is part of the work, so these cases are described without names. What we can share is the challenge itself, the strategic thinking behind the response, and the decisions that shaped the process.',
      meta: 'Six selected engagements',
      ctaBtn: 'Request a conversation',
    },
    es: {
      eyebrow: 'Trabajo seleccionado',
      lede: 'La confidencialidad del cliente forma parte de nuestro trabajo, así que estos casos se describen sin nombres. Lo que sí podemos compartir es el reto en sí, el pensamiento estratégico detrás de la solución y las decisiones que dieron forma al proceso.',
      meta: 'Seis proyectos seleccionados',
      ctaBtn: 'Solicita una conversación',
    },
  };
  const t = COPY[lang];

  const h1 = lang === 'es'
    ? 'Cada proyecto es una lección transferible.'
    : 'Each engagement is a transferable lesson.';
  const ctaText = lang === 'es'
    ? (<>Tu empresa <em>no está en esta lista.</em> Por eso estás aquí.</>)
    : (<>Your situation is <em>not in this list.</em> That is the point.</>);

  return (
    <main>
      <section className="q-page-hero has-specimen">
        <QCoordField />
        <div className="q-container">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1 className="q-page-hero-h1">{h1}</h1>
          <div className="lede">{t.lede}</div>
          <div className="meta">
            <span>{t.meta}</span>
          </div>
        </div>
      </section>

      {/* The selected-work table, shared with the home page */}
      <section style={{ paddingTop: '24px' }}>
        <QCaseStudyTable bare />
      </section>

      <section className="q-section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="q-container">
          <div className="q-page-cta">
            <div className="t">{ctaText}</div>
            <a className="q-btn primary" href="index.html#contact">{t.ctaBtn} <span className="arrow">→</span></a>
          </div>
        </div>
      </section>
    </main>
  );
};
