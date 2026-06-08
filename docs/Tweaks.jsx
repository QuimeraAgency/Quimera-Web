// Tweaks.jsx — three expressive controls that reshape the feel of the page.
//   Register   : Editorial · Atelier · Cinema    (overall posture)
//   Apparatus  : Clean · Standard · Dossier      (intelligence-file framing)
//   Voice      : Bebacc · Oxide · Copper · Slate (signature accent)
//
// State is applied as data-attrs on <html>; ui_kits/website/tweaks-effects.css
// translates each attr into a coordinated cascade of overrides.
// Apparatus="dossier" also injects fixed-position file-code margins and a
// diagonal REVIEW COPY stamp anchored to the hero.

window.QTweaks = function QTweaks() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "heroArt": "none",
    "register": "editorial",
    "apparatus": "clean",
    "voice": "bebacc"
  }/*EDITMODE-END*/;

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Project tweak state onto the document root so CSS can drive the cascade.
  React.useEffect(() => {
    const html = document.documentElement;
    html.dataset.heroArt = t.heroArt;
    html.dataset.register = t.register;
    html.dataset.apparatus = t.apparatus;
    html.dataset.voice = t.voice;
  }, [t.heroArt, t.register, t.apparatus, t.voice]);

  // Mount the dossier stamp inside the hero so it sits in document flow.
  const [heroEl, setHeroEl] = React.useState(null);
  React.useEffect(() => {
    // Home hero is .q-section.loose; dedicated pages use .q-page-hero.
    const find = () => document.querySelector('main section.q-section.loose, .q-page-hero');
    let el = find();
    if (el) { setHeroEl(el); return; }
    // Retry a bounded number of times in case the React tree hasn't committed.
    let tries = 0;
    const id = setInterval(() => {
      const found = find();
      if (found) { setHeroEl(found); clearInterval(id); }
      else if (++tries > 30) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, []);

  const VOICE_SWATCHES = {
    bebacc: '#BEBACC',
    oxide:  '#C26A60',
    copper: '#C99166',
    slate:  '#7A95B0',
  };

  return (
    <>
      {/* Fixed dossier margin labels — visible only when apparatus=dossier */}
      <div className="q-dossier-margin-l">
        FILE · Q-001 · 2026 · RESTRICTED CIRCULATION
      </div>
      <div className="q-dossier-margin-r">
        PROOF · REVIEW COPY · NOT FOR DISTRIBUTION
      </div>

      {/* Diagonal stamp inside the hero — portaled so it doesn't disturb layout */}
      {heroEl && ReactDOM.createPortal(
        <div className="q-dossier-stamp" aria-hidden="true">
          REVIEW<br />COPY
          <span className="sub">Q-001 / 2026</span>
        </div>,
        heroEl
      )}

      <TweaksPanel title="Tweaks">

        <TweakSection label="Hero" />
        <div style={{ padding: '0 14px 4px', fontFamily: 'var(--font-body, system-ui)', fontSize: 11, color: 'rgba(0,0,0,0.55)', lineHeight: 1.45 }}>
          What sits behind the opening headline.
        </div>
        <TweakRadio
          label=""
          value={t.heroArt}
          options={[
            { value: 'none',    label: 'None'    },
            { value: 'face',    label: 'Face'    },
            { value: 'texture', label: 'Texture' },
          ]}
          onChange={(v) => setTweak('heroArt', v)}
        />

        <TweakSection label="Register" />
        <div style={{ padding: '0 14px 4px', fontFamily: 'var(--font-body, system-ui)', fontSize: 11, color: 'rgba(0,0,0,0.55)', lineHeight: 1.45 }}>
          The posture of the whole page.
        </div>
        <TweakRadio
          label=""
          value={t.register}
          options={[
            { value: 'editorial', label: 'Editorial' },
            { value: 'atelier',   label: 'Atelier'   },
            { value: 'cinema',    label: 'Cinema'    },
          ]}
          onChange={(v) => setTweak('register', v)}
        />

        <TweakSection label="Apparatus" />
        <div style={{ padding: '0 14px 4px', fontFamily: 'var(--font-body, system-ui)', fontSize: 11, color: 'rgba(0,0,0,0.55)', lineHeight: 1.45 }}>
          How much intelligence-file framing shows — index marks, coord ribbons, stamps.
        </div>
        <TweakRadio
          label=""
          value={t.apparatus}
          options={[
            { value: 'clean',    label: 'Clean'    },
            { value: 'standard', label: 'Standard' },
            { value: 'dossier',  label: 'Dossier'  },
          ]}
          onChange={(v) => setTweak('apparatus', v)}
        />

        <TweakSection label="Voice" />
        <div style={{ padding: '0 14px 4px', fontFamily: 'var(--font-body, system-ui)', fontSize: 11, color: 'rgba(0,0,0,0.55)', lineHeight: 1.45 }}>
          The signature accent — runs through eyebrows, link-hovers, the brand dot, selection, stamps.
        </div>
        <TweakColor
          label=""
          value={VOICE_SWATCHES[t.voice]}
          options={Object.values(VOICE_SWATCHES)}
          onChange={(hex) => {
            const key = Object.keys(VOICE_SWATCHES).find(k => VOICE_SWATCHES[k] === hex);
            if (key) setTweak('voice', key);
          }}
        />

      </TweaksPanel>
    </>
  );
};
