window.QFooter = function QFooter() {
  const lang = useLang();
  const COPY = {
    en: {
      tagline: '"Visibility is not the objective. Gravity is."',
      arch: 'Architecture',
      archItems: [
        'Define — Narrative & positioning',
        'Activate — Media & strategic presence',
        'Sustain — Reputation advisory',
      ],
      agency: 'The Agency',
      agencyItems: ['Welcome', 'Selected work', 'Perspective', 'Contact'],
      contact: 'Contact',
      appt: 'By appointment',
      legal: ['Imprint', 'Privacy', 'Confidentiality'],
    },
    es: {
      tagline: '"La visibilidad no es el objetivo. La influencia sí."',
      arch: 'Arquitectura',
      archItems: [
        'Definir — Narrativa y posicionamiento',
        'Activar — Medios y presencia estratégica',
        'Sostener — Asesoría de reputación',
      ],
      agency: 'La Agencia',
      agencyItems: ['Bienvenida', 'Trabajo seleccionado', 'Perspectiva', 'Contacto'],
      contact: 'Contacto',
      appt: 'Con cita previa',
      legal: ['Aviso legal', 'Privacidad', 'Confidencialidad'],
    },
  };
  const t = COPY[lang];
  const archHrefs = ['services.html', 'services.html', 'services.html'];
  // Agency links paired with hrefs + optional feature flag, then filtered.
  const agencyHrefs = ['index.html#manifesto', 'work.html', 'perspective.html', 'index.html#contact'];
  const agencyFlags = [null, null, 'perspective', null];
  const agencyLinks = t.agencyItems
    .map((label, i) => ({ label, href: agencyHrefs[i], flag: agencyFlags[i] }))
    .filter((l) => !l.flag || (window.QFlags && window.QFlags[l.flag]));

  return (
    <footer className="q-footer">
      <div className="q-container">
        <div className="top">
          <div>
            <div className="q-lockup" style={{ marginBottom: '24px' }}>
              <img src="../../assets/quimera-mark-bebacc.svg" alt="" />
              <span>Quimera Agency</span>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '17px', lineHeight: 1.6, color: 'var(--fg-1)', maxWidth: '420px', fontWeight: 400 }}>
              {t.tagline}
            </div>
          </div>
          <div>
            <h4>{t.arch}</h4>
            <ul>
              {t.archItems.map((it, i) => (
                <li key={i}><a href={archHrefs[i]}>{it}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{t.agency}</h4>
            <ul>
              {agencyLinks.map((l, i) => (
                <li key={i}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{t.contact}</h4>
            <ul>
              <li><a href="mailto:hola@quimeragency.com">hola@quimeragency.com</a></li>
              <li><a href="#">LinkedIn</a></li>
            </ul>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: 'var(--fg-2)', marginTop: '16px' }}>
              Madrid · España<br/>{t.appt}
            </div>
          </div>
        </div>

        <div className="colophon">
          <div className="l">
            <span>© 2026 Quimera Agency, S.L.</span>
            <span>·</span>
            <span>Madrid · España</span>
          </div>
          <div className="r">
            {t.legal.map((it, i) => <a key={i} href="#">{it}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
};
