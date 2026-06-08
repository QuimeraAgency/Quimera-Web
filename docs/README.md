# Quimera — Website UI Kit

A high-fidelity, modular UI kit for the Quimera Agency marketing website. Built on
React 18 + inline Babel, with all visual foundations consumed from
`../../colors_and_type.css`.

## Demo

Open `index.html` to see the assembled homepage — header, hero, recent-work
table, approach grid, perspective strip, contact form, and footer in one
scrolling page. The contact form is interactive (submit cycles to a confirmation
state).

## Components

| File | Component | Use |
|---|---|---|
| `Header.jsx` | `<QHeader active="manifesto" />` | Sticky top nav with mark, locale toggle |
| `Hero.jsx` | `<QHero />` | Manifesto-line hero — *"We are interested in gravity."* |
| `Manifesto.jsx` | `<QManifesto />` | Three-column editorial — interpretation / signals / neutrality |
| `Services.jsx` | `<QServices />` | DEFINE / ACTIVATE / SUSTAIN three-layer architecture (no pricing) |
| `CaseStudyTable.jsx` | `<QCaseStudyTable />` | Hairline-row engagement table (hover-state, tags) |
| `PerspectiveStrip.jsx` | `<QPerspectiveStrip />` | Three-card editorial / working-papers index |
| `ContactBlock.jsx` | `<QContactBlock />` | Lead-partner block + inline brief form |
| `Footer.jsx` | `<QFooter />` | Dense editorial colophon |

**Source of copy:** brand manifesto and services architecture
(`context/brand_manifesto.txt`, `context/services_architecture.txt`). The
Hiya proposal is not used in the website — that material was client-specific.
Pricing and investment figures are deliberately omitted from public-facing
surfaces.

All components attach themselves to `window` so they can share scope across
Babel `<script>` files. None of them take heavy props — content is editorial
and lives in source (consistent with the editorial-document register).

## Patterns this kit codifies

- **§-prefix numbered sections.** Every section has a small `§ NN` + `EYEBROW`
  in the left rail of the section header. This is the document-structure
  signal that runs through Quimera's brief language.
- **Sentence-case serif headlines; emphasis by italic + weight, never colour.**
  `Authority is built, *not announced.*` — emphasis is Cormorant italic at
  weight 500. Lavender never touches text: it lives only in elements and
  atmosphere (the star mark, nav dot, borders, rings, coordinate ticks,
  frosted panels, and the aurora wash). The single warm **gold seal**
  (`--seal`) is the only colour allowed on a word or act — the primary CTA,
  a differential mark — at most once per view.
- **Hairline tables over cards.** Lists of things default to a 1px hairline
  table with column-based info hierarchy, not a card grid.
- **Editorial pairing of dark and paper.** Sections alternate between
  `--ink-950` and `--bone-50` backgrounds; transitions are abrupt (no
  gradients).
- **Mono document coordinates.** Every section header carries a `§` number;
  every section ends with a coord ribbon or document meta where useful.
- **Sparing motion.** Hover states are subtle (1px lift, lavender border,
  arrow translate). No on-load animations.

## Reuse

To embed into another HTML file:

```html
<link rel="stylesheet" href="site.css">
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>

<script type="text/babel" src="Hero.jsx"></script>
<script type="text/babel" src="CaseStudyTable.jsx"></script>
<!-- ... -->

<script type="text/babel">
  ReactDOM.createRoot(document.getElementById('root'))
    .render(<><QHero /><QCaseStudyTable /></>);
</script>
```

## Notes & TODOs

- The kit is **a recreation, not production code**. Markup is high-fidelity but
  the form is a stub (no submit endpoint, no validation). Replace before
  shipping.
- Locale toggle in `Header.jsx` is decorative; wire up to your i18n layer.
- Imagery is intentionally absent. When real photography is available, add a
  full-bleed `<section style={{height: 720, background: 'url(...) center / cover'}}>`
  between the hero and the work table — see VISUAL FOUNDATIONS § Imagery.
