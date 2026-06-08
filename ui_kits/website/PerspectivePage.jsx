window.QPerspectivePage = function QPerspectivePage() {
  const lang = useLang();
  const COPY = {
    en: {
      eyebrow: 'Perspective',
      lede: 'Short, argued pieces on the questions that decide how a company is understood — timing, silence, and scrutiny. Less commentary, more position.',
      meta: ['Three themes', 'Updated monthly', 'Written, not generated'],
      featuredEyebrow: 'Featured',
      frameLead: 'Timing is not logistics.',
      frameNote: 'It is the difference between a message that lands and one that is technically correct and completely ignored. Below: the full piece, as it reads.',
      kicker: 'On Timing · 04 / 26 · 6 min',
      articleTitle: 'The right message at the wrong moment is still the wrong message.',
      paras: [
        'Most communication failures are not failures of content. The message was accurate. The positioning was sound. The wording had been argued over for weeks. It simply arrived when no one was able to receive it — too early to be understood, or too late to matter.',
        'Markets, regulators and press do not assess information in a vacuum. They assess it against what else is happening, what they already believe, and how much attention they have to spare. The same sentence can read as leadership in March and as defensiveness in May.',
      ],
      bylinePaper: 'Quimera — Working paper',
      indexEyebrow: 'Index',
      papersLabel: 'papers',
      readLabel: 'read',
      specimenTheme: 'The Mark',
      themes: [
        {
          theme: 'On Timing',
          articles: [
            { date: '04 / 26', title: 'The right message at the wrong moment is still the wrong message.', read: '6 min' },
            { date: '01 / 26', title: 'Why the best announcement is often the one you delay.', read: '5 min' },
            { date: '11 / 25', title: 'Momentum is not a strategy. It is a window.', read: '4 min' },
          ],
        },
        {
          theme: 'On Silence',
          articles: [
            { date: '03 / 26', title: 'What a company chooses not to say is also a position.', read: '5 min' },
            { date: '12 / 25', title: 'The discipline of declining to comment.', read: '6 min' },
            { date: '09 / 25', title: 'Restraint reads as confidence. Noise reads as need.', read: '4 min' },
          ],
        },
        {
          theme: 'On Scrutiny',
          articles: [
            { date: '02 / 26', title: 'Reputation is tested in the moments you did not plan for.', read: '7 min' },
            { date: '10 / 25', title: 'Preparing for the question you hope never comes.', read: '6 min' },
            { date: '08 / 25', title: 'Trust compounds quietly and collapses loudly.', read: '5 min' },
          ],
        },
      ],
    },
    es: {
      eyebrow: 'Perspectiva',
      lede: 'Piezas breves y argumentadas sobre las cuestiones que deciden cómo se entiende una empresa: el momento, el silencio y el escrutinio. Menos comentario, más posición.',
      meta: ['Tres temas', 'Actualizado cada mes', 'Escrito, no generado'],
      featuredEyebrow: 'Destacado',
      frameLead: 'El momento no es logística.',
      frameNote: 'Es la diferencia entre un mensaje que cala y uno que es técnicamente correcto y completamente ignorado. Abajo: la pieza completa, tal como se lee.',
      kicker: 'Sobre el momento · 04 / 26 · 6 min',
      articleTitle: 'El mensaje correcto en el momento equivocado sigue siendo el mensaje equivocado.',
      paras: [
        'La mayoría de los fallos de comunicación no son fallos de contenido. El mensaje era preciso. El posicionamiento era sólido. La redacción se había discutido durante semanas. Simplemente llegó cuando nadie podía recibirlo: demasiado pronto para entenderlo, o demasiado tarde para que importara.',
        'Los mercados, los reguladores y la prensa no evalúan la información en el vacío. La evalúan frente a lo que está pasando, frente a lo que ya creen y frente a la atención de la que disponen. La misma frase puede leerse como liderazgo en marzo y como defensa en mayo.',
      ],
      bylinePaper: 'Quimera — Documento de trabajo',
      indexEyebrow: 'Índice',
      papersLabel: 'documentos',
      readLabel: 'de lectura',
      specimenTheme: 'La Marca',
      themes: [
        {
          theme: 'Sobre el momento',
          articles: [
            { date: '04 / 26', title: 'El mensaje correcto en el momento equivocado sigue siendo el mensaje equivocado.', read: '6 min' },
            { date: '01 / 26', title: 'Por qué el mejor anuncio suele ser el que aplazas.', read: '5 min' },
            { date: '11 / 25', title: 'El impulso no es una estrategia. Es una ventana.', read: '4 min' },
          ],
        },
        {
          theme: 'Sobre el silencio',
          articles: [
            { date: '03 / 26', title: 'Lo que una empresa elige no decir también es una posición.', read: '5 min' },
            { date: '12 / 25', title: 'La disciplina de declinar un comentario.', read: '6 min' },
            { date: '09 / 25', title: 'La contención se lee como confianza. El ruido se lee como necesidad.', read: '4 min' },
          ],
        },
        {
          theme: 'Sobre el escrutinio',
          articles: [
            { date: '02 / 26', title: 'La reputación se pone a prueba en los momentos que no planeaste.', read: '7 min' },
            { date: '10 / 25', title: 'Prepararte para la pregunta que esperas que nunca llegue.', read: '6 min' },
            { date: '08 / 25', title: 'La confianza se acumula en silencio y se derrumba con estruendo.', read: '5 min' },
          ],
        },
      ],
    },
  };
  const t = COPY[lang];

  const h1 = lang === 'es' ? 'Notas, informes y documentos de trabajo.' : 'Notes, briefs, and working papers.';
  const featuredHeading = lang === 'es'
    ? (<>El mensaje correcto en <em>el momento equivocado.</em></>)
    : (<>The right message at the <em>wrong moment.</em></>);
  const indexHeading = lang === 'es' ? 'Por tema.' : 'By theme.';
  const lastPara = lang === 'es'
    ? (<>Por eso tratamos el momento como una decisión estratégica de primer orden, no de calendario. La pregunta nunca es solo <em>qué decimos</em>, sino <em>qué significará esto, para estas personas, el día en que se escuche.</em> Equivocarse en eso sale caro de una forma difícil de ver, porque nada se rompe a la vista. El mensaje simplemente no llega a componer.</>)
    : (<>This is why we treat timing as a first-order strategic decision, not a scheduling one. The question is never only <em>what do we say</em> — it is <em>what will this mean, to these people, on the day it is heard.</em> Getting that wrong is expensive in a way that is hard to see, because nothing visibly breaks. The message simply fails to compound.</>);

  return (
    <main>
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

      {/* featured / sample reading view */}
      <section className="q-section" style={{ paddingTop: '56px' }}>
        <div className="q-container">
          <div className="q-section-header" style={{ marginBottom: '40px' }}>
            <div className="l">
              <div className="num"></div>
              <div className="eyebrow">{t.featuredEyebrow}</div>
            </div>
            <h2>{featuredHeading}</h2>
          </div>

          <div className="q-featured">
            <div className="frame">
              {t.frameLead}
              <span className="note">
                {t.frameNote}
              </span>
            </div>
            <article className="read">
              <div className="kicker">{t.kicker}</div>
              <h2>{t.articleTitle}</h2>
              <p>{t.paras[0]}</p>
              <p>{t.paras[1]}</p>
              <p>{lastPara}</p>
              <div className="byline">
                <span>{t.bylinePaper}</span>
                <span>Madrid · España</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* themed index */}
      <section className="q-section paper">
        <div className="q-container">
          <div className="q-section-header">
            <div className="l">
              <div className="num"></div>
              <div className="eyebrow">{t.indexEyebrow}</div>
            </div>
            <h2>{indexHeading}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '72px' }}>
            {t.themes.map((grp) => (
              <div key={grp.theme}>
                <div className="q-theme-head">
                  <span className="t">{grp.theme}</span>
                  <span className="c">{String(grp.articles.length).padStart(2, '0')} {t.papersLabel}</span>
                </div>
                {grp.articles.map((a, i) => (
                  <a key={i} href="#" className="q-article-row" style={{ borderColor: 'var(--rule-paper)' }}>
                    <span className="date" style={{ color: 'var(--on-bone-3)' }}>{a.date}</span>
                    <span className="title" style={{ color: 'var(--on-bone-1)' }}>{a.title}</span>
                    <span className="read" style={{ color: 'var(--on-bone-3)' }}>{a.read} {t.readLabel}</span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="q-section" style={{ paddingTop: '8px' }}>
        <div className="q-container">
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <QSpecimen src="assets/imagery/lion.png" fig="01" theme={t.specimenTheme} parallax="10" marks={false} />
          </div>
        </div>
      </section>
    </main>
  );
};
