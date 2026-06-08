window.QServicesPage = function QServicesPage() {
  const lang = useLang();
  const COPY = {
    en: {
      eyebrow: 'Services architecture',
      lede: 'Most firms help companies become more visible. We help ensure that visibility translates into credibility, clarity, and strategic positioning.',
      meta: ['01 — Define', '02 — Activate', '03 — Sustain'],
      includesHead: 'Includes',
      includesCta: 'Request the full scope',
      layers: [
        {
          n: '01', verb: 'DEFINE', tagline: 'The layer built before visibility scales.',
          title: 'Narrative & positioning strategy',
          body: [
            'We define how the company should be understood by the audiences that shape its trajectory — investors, regulators, media, partners and talent — and build the communication architecture required to sustain that positioning as the organisation grows.',
            'Positioning is not a tagline exercise. It is the discipline of making a complex company legible without reducing what makes it strategically distinct.',
          ],
          diff: 'Translation of complexity into public legibility. Narrative systems designed for long-term reputational compounding.',
          includes: [
            'Corporate narrative architecture',
            'Positioning strategy & messaging system',
            'Executive positioning',
            'Market localisation & narrative adaptation',
            'Communication criteria & exposure frameworks',
            'Internal communication alignment',
          ],
        },
        {
          n: '02', verb: 'ACTIVATE', tagline: 'What we proactively communicate — and when we stay quiet.',
          title: 'Media & strategic presence',
          body: [
            'We develop visibility selectively. Through media, public positioning and the moments that materially influence how a company is perceived: launches, fundraising, partnerships, leadership transitions and category-defining conversations.',
            'Not everything needs to be public. But the relationships, credibility and positioning that make visibility effective must be built before they are needed.',
          ],
          diff: 'Visibility calibrated around strategic timing. Selective rather than volume-driven media logic.',
          includes: [
            'Strategic media relations',
            'Announcement & launch communications',
            'Fundraising & partnership communications',
            'Interview, podcast & panel preparation',
            'Speaking opportunity advisory',
            'Research & insight amplification',
          ],
        },
        {
          n: '03', verb: 'SUSTAIN', tagline: 'What preserves coherence as scrutiny increases.',
          title: 'Reputation & strategic advisory',
          body: [
            'As organisations grow, visibility compounds, stakeholders multiply and scrutiny intensifies. We help companies sustain reputational coherence and institutional trust across that expansion.',
            'Reputation is tested in moments of pressure, but sustained in the decisions, positioning and relationships maintained long before those moments arrive.',
          ],
          diff: 'Reputation viewed as long-term strategic infrastructure. Narrative continuity across growth and pressure.',
          includes: [
            'Ongoing strategic communications counsel',
            'Reputational risk assessment',
            'Sensitive communications advisory',
            'Vulnerability identification',
            'Narrative coordination in high-attention moments',
            'Executive counsel in complex situations',
          ],
        },
      ],
      process: [
        ['01', 'Read', 'We start by understanding the company, its context and the gap between what is true and what is understood.'],
        ['02', 'Frame', 'We build the positioning and communication architecture — the system everything else is measured against.'],
        ['03', 'Activate', 'We engage visibility selectively, around the moments and audiences where it compounds.'],
        ['04', 'Sustain', 'We hold coherence as the company grows, scrutiny rises and complexity accumulates.'],
      ],
      engageEyebrow: 'How we engage',
      engageClosing: 'Quimera is designed for sustained strategic collaboration. We engage selectively and maintain a limited number of active partnerships, so that depth of context is never traded for volume.',
      whoEyebrow: 'Who we work with',
      audiences: [
        ['Founders & C-Level', 'Leaders with high public exposure or strategic positioning needs.'],
        ['Investors & Ecosystem', 'Funds, angels and operators requiring reputational advisory for portfolio and leadership.'],
        ['Agencies & Firms', 'PR, branding, legal or public-affairs partners needing strategic communications support.'],
      ],
      calibrateEyebrow: 'What we calibrate',
      calibrateWords: 'Narrative · Presence · Reputation · Leadership',
      ctaBtn: 'Request a conversation',
    },
    es: {
      eyebrow: 'Arquitectura de servicios',
      lede: 'La mayoría de las firmas ayudan a las empresas a ser más visibles. Nosotros nos aseguramos de que esa visibilidad se traduzca en credibilidad, claridad y posicionamiento estratégico.',
      meta: ['01 — Definir', '02 — Activar', '03 — Sostener'],
      includesHead: 'Incluye',
      includesCta: 'Solicita el alcance completo',
      layers: [
        {
          n: '01', verb: 'DEFINIR', tagline: 'La capa que se construye antes de escalar la visibilidad.',
          title: 'Estrategia de narrativa y posicionamiento',
          body: [
            'Definimos cómo debe entenderse la empresa ante las audiencias que moldean su trayectoria —inversores, reguladores, medios, partners y talento— y construimos la arquitectura de comunicación necesaria para sostener ese posicionamiento a medida que la organización crece.',
            'El posicionamiento no es un ejercicio de eslogan. Es la disciplina de hacer legible una empresa compleja sin reducir lo que la hace estratégicamente distinta.',
          ],
          diff: 'Traducción de la complejidad en legibilidad pública. Sistemas narrativos diseñados para componer reputación a largo plazo.',
          includes: [
            'Arquitectura de narrativa corporativa',
            'Estrategia de posicionamiento y sistema de mensajes',
            'Posicionamiento de directivos',
            'Localización de mercado y adaptación narrativa',
            'Criterios de comunicación y marcos de exposición',
            'Alineación de la comunicación interna',
          ],
        },
        {
          n: '02', verb: 'ACTIVAR', tagline: 'Lo que comunicamos de forma proactiva — y cuándo guardamos silencio.',
          title: 'Medios y presencia estratégica',
          body: [
            'Desarrollamos la visibilidad de forma selectiva. A través de los medios, el posicionamiento público y los momentos que influyen de forma material en cómo se percibe a una empresa: lanzamientos, rondas de financiación, alianzas, relevos de liderazgo y conversaciones que definen una categoría.',
            'No todo necesita ser público. Pero las relaciones, la credibilidad y el posicionamiento que hacen efectiva la visibilidad deben construirse antes de que hagan falta.',
          ],
          diff: 'Visibilidad calibrada en torno al momento estratégico. Una lógica de medios selectiva, no guiada por el volumen.',
          includes: [
            'Relaciones con medios estratégicas',
            'Comunicación de anuncios y lanzamientos',
            'Comunicación de financiación y alianzas',
            'Preparación de entrevistas, pódcast y paneles',
            'Asesoría de oportunidades de ponencia',
            'Amplificación de estudios e insights',
          ],
        },
        {
          n: '03', verb: 'SOSTENER', tagline: 'Lo que preserva la coherencia a medida que aumenta el escrutinio.',
          title: 'Reputación y asesoría estratégica',
          body: [
            'A medida que las organizaciones crecen, la visibilidad se acumula, los grupos de interés se multiplican y el escrutinio se intensifica. Ayudamos a las empresas a sostener la coherencia reputacional y la confianza institucional a lo largo de esa expansión.',
            'La reputación se pone a prueba en los momentos de presión, pero se sostiene en las decisiones, el posicionamiento y las relaciones que se mantienen mucho antes de que esos momentos lleguen.',
          ],
          diff: 'La reputación entendida como infraestructura estratégica a largo plazo. Continuidad narrativa a través del crecimiento y la presión.',
          includes: [
            'Asesoramiento continuo de comunicación estratégica',
            'Evaluación de riesgos reputacionales',
            'Asesoría en comunicación sensible',
            'Identificación de vulnerabilidades',
            'Coordinación narrativa en momentos de máxima atención',
            'Acompañamiento a directivos en situaciones complejas',
          ],
        },
      ],
      process: [
        ['01', 'Leer', 'Empezamos por entender la empresa, su contexto y la distancia entre lo que es cierto y lo que se entiende.'],
        ['02', 'Enmarcar', 'Construimos la arquitectura de posicionamiento y comunicación: el sistema con el que se mide todo lo demás.'],
        ['03', 'Activar', 'Activamos la visibilidad de forma selectiva, en torno a los momentos y las audiencias donde se acumula.'],
        ['04', 'Sostener', 'Sostenemos la coherencia a medida que la empresa crece, el escrutinio sube y la complejidad se acumula.'],
      ],
      engageEyebrow: 'Cómo trabajamos',
      engageClosing: 'Quimera está diseñada para la colaboración estratégica sostenida. Trabajamos de forma selectiva y mantenemos un número limitado de colaboraciones activas, para que la profundidad de contexto nunca se cambie por volumen.',
      whoEyebrow: 'Con quién trabajamos',
      audiences: [
        ['Fundadores y alta dirección', 'Líderes con alta exposición pública o necesidades de posicionamiento estratégico.'],
        ['Inversores y ecosistema', 'Fondos, business angels y operadores que necesitan asesoría reputacional para su portfolio y su liderazgo.'],
        ['Agencias y firmas', 'Partners de PR, branding, legal o asuntos públicos que necesitan apoyo en comunicación estratégica.'],
      ],
      calibrateEyebrow: 'Qué calibramos',
      calibrateWords: 'Narrativa · Presencia · Reputación · Liderazgo',
      ctaBtn: 'Solicita una conversación',
    },
  };
  const t = COPY[lang];

  const h1 = lang === 'es'
    ? (<>Tres capas. Un sistema.</>)
    : (<>Three layers. One system.</>);
  const engageHeading = lang === 'es'
    ? (<>Una forma de trabajar, <em>no un menú.</em></>)
    : (<>A way of working, <em>not a menu.</em></>);
  const ctaText = lang === 'es'
    ? (<>Un briefing, una pregunta <em>o una conversación confidencial.</em></>)
    : (<>A brief, a question, <em>or a confidential conversation.</em></>);

  return (
    <main>
      {/* hero */}
      <section className="q-page-hero has-specimen">
        <QCoordField />
        <div className="q-container">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1 className="q-page-hero-h1">{h1}</h1>
          <div className="lede">{t.lede}</div>
          <div className="meta">
            {t.meta.map((m, i) => <span key={i}>{m}</span>)}
          </div>
        </div>
      </section>

      {/* expanded layers */}
      <section className="q-section" style={{ paddingTop: '40px' }}>
        <div className="q-container">
          {t.layers.map((l) => (
            <div key={l.n} className="q-layer">
              <div className="rail">
                <div className="n">{l.n}</div>
                <div className="verb">{l.verb}</div>
                <div className="tagline">{l.tagline}</div>
              </div>
              <div className="body">
                <h2>{l.title}</h2>
                {l.body.map((p, i) => <p key={i}>{p}</p>)}
                <div className="diff">{l.diff}</div>

                <div className="q-includes-pane" style={{ marginTop: '32px', maxWidth: '560px' }}>
                  <div className="q-includes-head">
                    <span>{t.includesHead}</span>
                  </div>
                  <div className="q-includes-glass" aria-hidden="true">
                    <ul>
                      {l.includes.map((it) => (
                        <li key={it}><span className="dash">—</span>{it}</li>
                      ))}
                    </ul>
                  </div>
                  <a className="q-includes-cta" href="index.html#contact">
                    {t.includesCta} <span className="arrow">→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* who we work with — frosted, centered, its own moment */}
      <section className="q-section q-who">
        <div className="q-who-aurora" aria-hidden="true"></div>
        <div className="q-container">
          <div className="q-who-head">
            <div className="q-who-eyebrow">{t.whoEyebrow}</div>
          </div>
          <div className="q-who-grid">
            {t.audiences.map(([title, d]) => (
              <div key={title} className="q-frost-card">
                <h3>{title}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <div className="q-who-calibrate">
            <span className="div" aria-hidden="true"></span>
            <div className="q-who-eyebrow">{t.calibrateEyebrow}</div>
            <div className="words">{t.calibrateWords}</div>
          </div>
        </div>
      </section>

      {/* how we engage */}
      <section className="q-section paper q-imghost">
        <div className="q-fraglayer q-hide-mobile" aria-hidden="true">
          <div className="q-reveal" style={{ position: 'absolute', right: '3%', top: '6%', width: '620px', height: '980px', overflow: 'hidden',
            WebkitMaskImage: 'radial-gradient(60% 72% at 54% 46%, #000 26%, rgba(0,0,0,0.5) 54%, transparent 80%)',
            maskImage: 'radial-gradient(60% 72% at 54% 46%, #000 26%, rgba(0,0,0,0.5) 54%, transparent 80%)' }}>
            <img src="assets/imagery/hourglass.png" data-parallax="22"
              style={{ position: 'absolute', width: '100%', maxWidth: 'none', left: '0', top: '0', opacity: 0.46, filter: 'grayscale(0.5) contrast(0.98) brightness(1.1)' }} alt="" />
          </div>
          <div className="q-veil paper-l"></div>
        </div>
        <div className="q-container">
          <div className="q-section-header">
            <div className="l">
              <div className="num"></div>
              <div className="eyebrow">{t.engageEyebrow}</div>
            </div>
            <h2>{engageHeading}</h2>
          </div>
          <div className="q-process">
            {t.process.map(([n, title, d]) => (
              <div key={n} className="q-step frost">
                <div className="n">{n}</div>
                <h3>{title}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '64px', maxWidth: '680px', fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.6, color: 'var(--on-bone-2)' }}>
            {t.engageClosing}
          </div>
        </div>
      </section>

      {/* cta */}
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
