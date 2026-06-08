window.QCaseStudyTable = function QCaseStudyTable({ bare }) {
  const lang = useLang();
  const [hover, setHover] = useState(null);
  const COPY = {
    en: {
      eyebrow: 'Selected work',
      head: ['Engagement', 'What it taught us', 'Tags'],
      cta: 'See all selected work',
      rows: [
        ['Telco brand positioning',          'Brand and narrative consistency from inside a major telecommunications operator',              ['Telecom', 'Partner coordination']],
        ['Regulation as narrative',          'Public authority around right-to-repair and EU sustainability legislation',                   ['Regulatory', 'EU Tech']],
        ['Contact-centre at scale',          'Corporate narrative and service communications for a global contact-centre operator',         ['B2B', 'Operational scale']],
        ['Reputation in high-noise markets', 'Communications across APAC, EMEA and LATAM in a category where trust is fragile by default',   ['Sports Tech', 'International']],
        ['Critical infrastructure',          'Expert positioning for a complex international technology account in critical infrastructure', ['B2B Tech', 'Cross-Atlantic']],
        ['Localising a US-born brand',       'Brand positioning and visibility for European expansion — adapting US narrative for local audiences', ['Education', 'Market Entry']],
      ],
    },
    es: {
      eyebrow: 'Trabajo seleccionado',
      head: ['Proyecto', 'Qué nos enseñó', 'Etiquetas'],
      cta: 'Ver todo el trabajo seleccionado',
      rows: [
        ['Posicionamiento de marca telco',     'Coherencia de marca y narrativa desde dentro de un gran operador de telecomunicaciones',                ['Telecom', 'Coordinación de partners']],
        ['La regulación como narrativa',        'Autoridad pública en torno al derecho a reparar y la legislación de sostenibilidad de la UE',           ['Regulación', 'EU Tech']],
        ['Contact center a escala',             'Narrativa corporativa y comunicación de servicio para un operador global de contact centers',           ['B2B', 'Escala operativa']],
        ['Reputación en mercados de mucho ruido', 'Comunicación en APAC, EMEA y LATAM en una categoría donde la confianza es frágil por defecto',         ['Sports Tech', 'Internacional']],
        ['Infraestructura crítica',             'Posicionamiento experto para una cuenta tecnológica internacional compleja en infraestructura crítica', ['B2B Tech', 'Transatlántico']],
        ['Localizar una marca nacida en EE. UU.', 'Posicionamiento de marca y visibilidad para la expansión europea — adaptando la narrativa estadounidense a audiencias locales', ['Educación', 'Entrada a mercado']],
      ],
    },
  };
  const t = COPY[lang];

  const heading = lang === 'es'
    ? (<>Cada proyecto es una <em>lección transferible</em>.</>)
    : (<>Each engagement is a <em>transferable lesson</em>.</>);

  return (
    <section className="q-section" id="work">
      <div className="q-container">
        {!bare && (
        <div className="q-section-header">
          <div className="l">
            <div className="num"></div>
            <div className="eyebrow">{t.eyebrow}</div>
          </div>
          <h2>{heading}</h2>
        </div>
        )}

        <div style={{ borderTop: '1px solid var(--rule-strong)' }}>
          <div className="q-work-head" style={{
            padding: '18px 0',
            borderBottom: '1px solid var(--rule-strong)',
            fontFamily: 'var(--font-title)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--fg-3)',
          }}>
            <div>{t.head[0]}</div>
            <div>{t.head[1]}</div>
            <div>{t.head[2]}</div>
          </div>

          {t.rows.map((r, i) => (
            <div key={i} className="q-work-row"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{
                padding: '32px 0',
                alignItems: 'baseline',
                borderBottom: '1px solid var(--rule)',
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.22,0.61,0.36,1)',
                background: hover === i ? 'rgba(190,186,204,0.03)' : 'transparent',
                paddingLeft: hover === i ? '16px' : '0',
                marginLeft: hover === i ? '-16px' : '0',
              }}>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '20px', lineHeight: 1.25, color: hover === i ? 'var(--seal)' : 'var(--fg-1)', letterSpacing: '-0.015em', fontWeight: 600 }}>
                {r[0]}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.55, color: 'var(--fg-2)' }}>
                {r[1]}
              </div>
              <div className="q-work-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {r[2].map(tag => <span key={tag} className="q-tag">{tag}</span>)}
              </div>
            </div>
          ))}
        </div>

        {!bare && (
        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
          <a className="q-btn secondary" href="work.html">{t.cta} <span className="arrow">→</span></a>
        </div>
        )}
      </div>
    </section>
  );
};
