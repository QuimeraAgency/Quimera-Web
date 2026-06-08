window.QManifesto = function QManifesto() {
  const lang = useLang();
  const COPY = {
    en: {
      lines: [
        ['On interpretation', 'There are agencies that optimize for attention. We are interested in gravity. Most can generate visibility around a company. We can do that too. But far fewer can shape the conditions under which that company becomes relevant.'],
        ['On signals', "A company's language. The pacing of an announcement. The media you refuse. The people willing to defend your company when you are absent. These are not surface decisions. They are signals, and signals accumulate into perception long before they become conscious analysis."],
        ['On neutrality', 'Every company already communicates a worldview. Through hiring, through design, through capital allocation, through what gets protected when pressure arrives. The question is not whether meaning exists. The question is whether it is intentional.'],
      ],
      chimera: 'The mythological chimera was difficult to kill because it was never built from a single logic. Neither are the strategic implementations that endure.',
      why: '— Why Quimera',
    },
    es: {
      lines: [
        ['Sobre la interpretación', 'Hay agencias que optimizan para la atención. A nosotros nos interesa el peso estratégico. Muchos pueden generar visibilidad alrededor de una empresa. Nosotros también. Pero muy pocos saben construir las condiciones bajo las que una empresa adquiere relevancia, legitimidad y capacidad de influencia.'],
        ['Sobre las señales', 'El lenguaje de una empresa. El ritmo de un comunicado. Los medios que decide rechazar. Las personas dispuestas a defenderla cuando sus líderes no están presentes. Nada de eso es superficial. Son señales, y las señales moldean la percepción mucho antes de convertirse en análisis consciente.'],
        ['Sobre la neutralidad', 'Todas las empresas ya comunican una forma de entender el mundo. Lo hacen a través de a quién contratan, de cómo diseñan, de cómo asignan capital y de lo que deciden proteger cuando aparece la presión. La cuestión no es si existe una narrativa. La cuestión es si esa narrativa es intencional.'],
      ],
      chimera: 'La quimera era un ser mitológico difícil de destruir porque nunca obedecía a una única lógica. Las estructuras estratégicas que logran perdurar se construyen igual.',
      why: '— Por qué Quimera',
    },
  };
  const t = COPY[lang];

  const heading = lang === 'es'
    ? (<>Hecha para <em style={{ fontStyle: 'italic', fontWeight: 500 }}>sostener la complejidad</em> sin colapsarla.</>)
    : (<>Built to <em style={{ fontStyle: 'italic', fontWeight: 500 }}>hold complexity</em> without collapsing it.</>);

  return (
    <section className="q-section paper q-imghost" id="manifesto">
      <div className="q-fraglayer q-hide-mobile" aria-hidden="true">
        <div className="q-reveal" style={{ position: 'absolute', right: '2%', top: '5%', width: '720px', height: '980px', overflow: 'hidden',
          WebkitMaskImage: 'radial-gradient(72% 80% at 50% 42%, #000 34%, rgba(0,0,0,0.5) 60%, transparent 84%)',
          maskImage: 'radial-gradient(72% 80% at 50% 42%, #000 34%, rgba(0,0,0,0.5) 60%, transparent 84%)' }}>
          <img src="assets/imagery/temple.png" data-parallax="20"
            style={{ position: 'absolute', width: '100%', maxWidth: 'none', left: '0', top: '0', opacity: 0.8 }} alt="" />
        </div>
        <div className="q-veil paper-l"></div>
      </div>
      <div className="q-container">
        <div className="q-section-header" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
          <h2 className="q-manifesto-h2" style={{ lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: '760px' }}>
            {heading}
          </h2>
        </div>

        <div className="q-manifesto-grid">
          {t.lines.map(([label, body]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', margin: '-20px', borderRadius: '4px', background: 'rgba(244,241,234,0.22)', WebkitBackdropFilter: 'blur(2px)', backdropFilter: 'blur(2px)' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--on-bone-3)' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-editorial)', fontSize: '31px', lineHeight: 1.2, letterSpacing: '0', fontWeight: 500, color: 'var(--on-bone-1)' }}>{body.split('. ')[0]}.</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.65, color: 'var(--on-bone-2)' }}>{body.split('. ').slice(1).join('. ')}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '96px', paddingTop: '48px', borderTop: '1px solid var(--rule-paper)' }}>
          <div style={{ fontFamily: 'var(--font-editorial)', fontSize: '40px', lineHeight: 1.24, fontStyle: 'italic', letterSpacing: '0', fontWeight: 500, color: 'var(--on-bone-1)', maxWidth: '820px' }}>
            {t.chimera}
          </div>
          <div style={{ marginTop: '28px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--on-bone-3)' }}>{t.why}</div>
        </div>
      </div>
    </section>
  );
};
