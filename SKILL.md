---
name: quimera-design
description: Use this skill to generate well-branded interfaces and assets for Quimera, the Madrid-based strategic communications, reputation and market-entry agency. Contains essential design guidelines (editorial, architectural, mineral palette), typography (Instrument Serif + Geist + Geist Mono), the BEBACC brand colour, the chimera mark in five canonical variants, and a website + slide UI kit. Use for production work, proposal decks, internal documents, marketing pages, or throwaway mocks that need to feel coherent with the Quimera identity.
user-invocable: true
---

# Quimera Design Skill

Read `README.md` first — it covers brand context, content fundamentals
(voice / casing / tone), visual foundations (colour / type / spacing / motion),
and iconography. Then look at the files below.

## What is in this skill

| File / folder | Purpose |
|---|---|
| `README.md` | Brand context, content fundamentals, visual foundations, iconography |
| `colors_and_type.css` | All design tokens — paste-ready CSS custom properties |
| `assets/` | Five canonical mark variants (SVG) |
| `preview/` | Specimen cards — useful to view in browser to internalise the system |
| `slides/` | Proposal-deck template (deck-stage based) — copy for any new client deck |
| `ui_kits/website/` | Modular React+JSX components for the agency website |

## How to use this skill

### If the user wants a one-off visual artifact (slide, mock, proposal, page)
1. Copy `colors_and_type.css` and `assets/` into the new output folder
2. Build static HTML referencing the CSS custom properties (`var(--ink-950)`,
   `var(--font-serif)`, etc.)
3. For decks, copy `slides/deck-stage.js` and pattern your slides after
   `slides/index.html`
4. For web layouts, copy and adapt components from `ui_kits/website/`
5. Show the user the rendered HTML

### If the user wants production code
- Lift the design tokens from `colors_and_type.css` into the project's
  design-system layer (Tailwind config, CSS modules, etc.)
- Copy `assets/quimera-mark-*.svg` directly — never trace or recreate the mark
- Refer to README's CONTENT FUNDAMENTALS when writing UI copy, marketing
  copy, or microcopy — the voice is **calm, senior, declarative, restrained**
- Refer to README's VISUAL FOUNDATIONS for layout / motion / hover behaviour
  decisions

### If the user invokes the skill with no other context
Ask them what they want to build or design. Probe:
- Is this a slide deck (proposal / pitch / internal brief)?
- A marketing page (homepage / case study / contact)?
- A document (RFP / sensitive-issues brief / executive memo)?
- A throwaway mock, or production work?

Then ask the standard kickoff questions (audience, length, tone constraints,
variations requested) before building.

## Hard rules — do not break these

- **No emoji.** Not in product, not in marketing, not in social, not in
  microcopy. Quimera's audiences are journalists, regulators, telecom
  executives. Emoji is the wrong register.
- **No exclamation marks.** Authority is quiet.
- **Typography is locked.** Montserrat for titles (600 / 700 only), Helvetica
  for body (400 only). Never use Montserrat below 16px. Never bold Helvetica
  for body. Maximum two type weights per screen.
- **Single emphasis device: lavender colour shift, same weight.** No italic
  emphasis, no weight bumps, no underlines, no colour beyond `--quimera-bebacc`.
- **No bluish-purple gradients**, no "AI tech" gradient blobs, no neumorphism,
  no glass / frosted nav, no soft coloured drop-shadows.
- **No hand-drawn SVG illustrations.** When imagery is unavailable, use the
  outline mark as a graphic device or fall back to a typographic-only
  composition.
- **Never recolour, rotate, or distort the chimera mark.** Always use a variant
  from `assets/`.
- **Editorial casing for headlines and titles** — sentence case, not Title Case.
- **British/European spelling preferred** ("organise", "behaviour", "localisation").

## Hard recommendations — break only with reason

- Pair every dark section with at least one paper section in any multi-section
  composition. Rhythm between mineral dark and institutional paper is the
  design system.
- Wrap big numbers, document IDs, page counts, coordinates, eyebrows in
  `Geist Mono` (`var(--font-mono)`) — never in the serif and never in the
  default sans.
- Reserve italic + `--lav-300` (bebacc) for the single emphasis word per
  headline. Don't italicise more than one phrase per page.
- Use 1px hairline rules. Anything thicker reads as decorative.

## Font note

The system uses **Montserrat for titles and Helvetica for body**, both
brand-supplied and loaded locally from `fonts/`. The pairing follows
`uploads/typography_guide_montserrat_helvetica.html`. Only the mono face
(Geist Mono, used for tabular numerics and document IDs) remains a Google
Fonts substitute — if a brand mono is adopted, drop the file into `fonts/`
and update `colors_and_type.css`.
