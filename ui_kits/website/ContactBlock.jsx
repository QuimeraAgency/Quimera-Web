window.QContactBlock = function QContactBlock() {
  const lang = useLang();
  const COPY = {
    en: {
      eyebrow: 'Contact',
      h: "Let’s talk.",
      lede: 'If you are navigating a moment where perception, reputation, or narrative requires strategic attention — we would like to hear about it.',
      link: 'Get in touch',
    },
    es: {
      eyebrow: 'Contacto',
      h: 'Hablemos.',
      lede: 'Si estás atravesando un momento en el que la percepción, la reputación o la narrativa requieren atención estratégica, nos gustaría ayudarte.',
      link: 'Ponte en contacto',
    },
  };
  const t = COPY[lang];

  return (
    <section className="q-section" id="contact">
      <div className="q-container">
        <div className="q-contact">
          <div className="q-contact-eyebrow">{t.eyebrow}</div>
          <div className="q-contact-row">
            <div className="q-contact-lead">
              <h2 className="q-contact-h">{t.h}</h2>
              <p className="q-contact-lede">
                {t.lede}
              </p>
            </div>
            <div className="q-contact-actions">
              <a className="q-contact-link" href="mailto:hola@quimeragency.com">
                {t.link} <span className="arrow">→</span>
              </a>
              <a className="q-contact-email" href="mailto:hola@quimeragency.com">hola@quimeragency.com</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
