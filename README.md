# Quimera — Design System

> Strategic communications, reputation & market entry.
> Editorial · architectural · interpretive · mineral.

---

## What is Quimera

**Quimera** (Spanish for *Chimera*) is a senior strategic communications, reputation
and market-entry agency based in **Madrid, Spain**. Led by **Mariola Montoya (CEO)**,
the firm operates as a hybrid strategic entity — between media and infrastructure,
culture and institutions, intelligence and aesthetics, strategy and perception.

The name and mark refer to the **Chimera** — not as a mythical animal but as a
*composite organism built from multiple systems simultaneously*. That idea
informs the identity: a brand that is **difficult to fully classify at first
encounter, but extremely coherent after deeper exposure**.

Quimera's clients are companies entering complex categories where **regulation,
public conversation and stakeholder trust** all converge. Recent client work
referenced in source material includes:

| Client | Engagement |
|---|---|
| Hiya | Spain market entry, voice-trust reputation platform, regulatory narrative |
| Telefónica (in-house) | Telco brand positioning, multi-channel narrative |
| Konecta (in-house) | Global contact-centre digital marketing |
| Back Market | Right-to-repair regulatory narrative |
| Chiliz | Crypto / sports-tech reputation, international markets |
| Ironhack | US-born brand localisation for Europe |
| Critical Software | B2B tech expert positioning |
| Deiser | Niche B2B authority |
| Cámara de Comercio Portuguesa en España | Institutional bilateral comms |

The brand should feel **capable of existing naturally beside** a financial
institution, a research lab, a cultural magazine, a frontier-technology company,
or a private strategic advisory. The goal is **not to look creative — it is to
look interpretively powerful**.

---

## Sources used to build this system

- **`uploads/Proposal Hiya_2026_Reviewed.pdf`** — 19-page strategic proposal
  for Hiya (Spain market entry). Source of structure, table format, sectioning,
  and example client language. Text saved at `context/proposal_hiya_text.txt`.
- **`uploads/Brand manifesto.docx`** — the highest expression of the
  Quimera voice. Source of the conceptual vocabulary (gravity, signal,
  compound, legibility, interpretation) and the founding rationale. Text
  saved at `context/brand_manifesto.txt`.
- **`uploads/Services Architecture.pdf`** — internal services & pricing
  document. Source of the **DEFINE / ACTIVATE / SUSTAIN** three-layer model,
  the strategic-projects catalogue, and the €23k / $25.3k quarterly retainer
  structure. Text saved at `context/services_architecture.txt`.
- **`uploads/typography_guide_montserrat_helvetica.html`** — brand
  typography pairing (Montserrat titles + Helvetica body) and the type
  rules.
- **`uploads/LOGO _ color bebacc.svg`** — primary mark, brand colour `#BEBACC`.
- **`uploads/LOGO _ blanco trazado negro.svg`** — white-fill / black-stroke.
- **`uploads/LOGO _ negro trazado blanco.svg`** — black-fill / white-stroke.
- **`uploads/LOGO _ trazado blanco.svg`** — outline, white stroke.
- **`uploads/LOGO _ trazado negro.svg`** — outline, black stroke.
- **`uploads/Helvetica*.ttf` + `Montserrat-*.ttf`** — brand-supplied font
  files, wired up in `fonts/`.

> The PDF, DOCX and SVGs are originals from the client. Their text contents
> have been extracted into `context/` for easy reference. Logos have been
> processed into `assets/` as ready-to-use SVGs.

---

## Index

| File / folder | Purpose |
|---|---|
| `README.md` | This file — brand context, content & visual foundations, iconography |
| `colors_and_type.css` | All CSS custom properties: colours, type, spacing, radii, motion |
| `SKILL.md` | Agent / Claude-Skill manifest |
| `assets/` | Logos and brand marks (SVG) |
| `fonts/` | Local font files (none — Google substitutes loaded via `@import`) |
| `preview/` | Design-system specimen cards (registered in the Design System tab) |
| `slides/` | Deck templates modelled on the Hiya proposal |
| `ui_kits/website/` | Quimera agency website UI kit (homepage, case-study, contact) |
| `ui_kits/proposal/` | Editable-document UI kit (proposal/brief layout) |

---

## CONTENT FUNDAMENTALS

How Quimera writes. Drawn from the **Brand Manifesto**, the **Services
Architecture**, and the Hiya proposal.

### Voice — what it sounds like

Quimera's manifesto is the highest expression of the voice. Use it as a tuning
fork:

> *"There are agencies that optimize attention. We are interested in gravity."*
>
> *"It is not communication as amplification of void narratives. It is
> positioning as architectural to the company."*
>
> *"We are built to hold complexity without collapsing it into something
> smaller."*
>
> *"The mythological chimera was difficult to kill because it was never built
> from a single logic."*

- **Calm, senior, declarative.** Never markety, never hyped, never sales-y.
- **Interpretive over descriptive.** Quimera does not describe what it does;
  it frames the situation and names the move.
- **Gravity over attention.** When in doubt, write the sentence that adds
  weight. Visibility is incidental.
- **Definitional confidence.** *"A communications firm? Sometimes. A
  strategic advisory? Occasionally. A narrative intelligence unit? Closer."*
  The voice is comfortable refusing easy labels.
- **Restrained authority.** Never "we are the best at" — instead "our role
  is to translate," "we will support," "we will not always appear
  immediately legible."
- **Diagnostic before prescriptive.** Open by reading the context, then
  propose action.

### Conceptual vocabulary — the words to reach for

Drawn from the manifesto. These belong in Quimera copy more than generic
agency words:

| Reach for | Avoid |
|---|---|
| gravity, weight, accumulation | reach, impact, results |
| compound, coherence, legibility | growth, optimisation, performance |
| signal, position, architecture | message, brand voice, content |
| interpretation, perception, framing | awareness, awareness-building |
| timing, room, sentence | campaign, push, blast |
| infrastructural, institutional | platform, ecosystem, solution |

### Structural vocabulary — DEFINE / ACTIVATE / SUSTAIN

Per the Services Architecture, Quimera's offering is a three-layer system.
**These three verbs are the structural backbone of the brand** and should
appear together wherever services are described:

1. **DEFINE** — *Narrative & Positioning Strategy.* What gets built before
   visibility scales. The layer that shapes interpretation before the market
   defines it for you.
2. **ACTIVATE** — *Media & Strategic Presence.* What we proactively
   communicate. Strategic visibility with direction, timing and criteria.
3. **SUSTAIN** — *Reputation & Strategic Advisory.* What preserves coherence
   as visibility, scrutiny and complexity increase.

These are always **uppercase**, set in Montserrat 600, often paired with
their definitional one-liner. When in doubt, use this triad as the spine of
any agency-introduction page or deck.

### Person / address

- **First-person plural ("we")** for the agency.
- **Third-person** for the client / subject — never "you" in marketing copy.
- **Direct "you"** only in addenda or advisory asides that explicitly address
  the reader.

### Casing & typography of copy

- **Sentence case** for titles, headings, table cells. Not Title Case.
- **ALL CAPS** only for short editorial markers, eyebrows, document IDs,
  the three structural verbs, and labels (`§ 02`, `EXT — 2026`, `DEFINE`,
  `INT — 2026`).
- **Em dashes (`—`) with spaces** around them, used liberally for asides.
- **British/European spelling preferred** ("organise", "behaviour",
  "localisation").
- **Numbers**: spell out one through nine in prose; figures for stats,
  ranges, timeframes ("Month 1", "90-day", "$25,300", "€23,000").

### Punctuation tells

- Section titles often arrive as **two lines**: a noun-phrase title plus a
  smaller editorial sub-line. (*"The Opportunity"* / *"Spain as Hiya's
  European reputation testbed"*)
- **Colons** introduce frames.
- **Bullets** are short, parallel, never more than two lines.
- **Period after a single sentence used as a heading.** *"Authority is built,
  not announced."* The full stop is part of the punctuation rhythm.

### Vibe

- **Editorial brief**, not pitch deck. Reads like a quality broadsheet's
  business pages or an institutional white paper.
- **Numbered workstreams** (01, 02, 03) and **labelled phases** (Month 1 /
  Month 2 / Month 3) structure thinking.
- **No emoji.** Ever.
- **No exclamation marks.** Authority is quiet.

### Specific examples (lifted from source materials)

- *"The goal is not visibility for visibility's sake."*
- *"Hiya does not need mass visibility. It needs visibility in the places
  and conversations that matter."*
- *"From nuisance calls to trusted voice infrastructure."*
- *"Most can generate visibility around a company. Far fewer can shape the
  conditions under which that company becomes relevant and self-aware."*
- *"Not everything has to be public, but relationships must be built."*
- *"Reputation viewed as long-term strategic infrastructure."*
- *"Authority is built, not announced."* — implicit throughout.

---

## VISUAL FOUNDATIONS

### Colour
The palette is **mineral, not chromatic**. Brand colour `#BEBACC` ("BEBACC", a
desaturated lavender / dove) sits between violet and stone — institutional,
slightly cool, never decorative.

| Token | Hex | Use |
|---|---|---|
| `--quimera-bebacc` | `#BEBACC` | Brand mark, accents, hover states, key data points |
| `--quimera-ink` | `#0E0D12` | Primary dark surface — has a cool violet undertone, *not* pure black |
| `--quimera-bone` | `#F2EFE9` | Paper / institutional cream — *not* pure white |

A full **ink scale** (`--ink-050` → `--ink-950`) and **bone scale** (`--bone-50`
→ `--bone-500`) supply layered greys. Editorial accents (`--signal-oxide`,
`--signal-copper`, `--signal-slate`) are reserved for redaction-style marks,
archival footnotes and analytical callouts — never as fills, never as buttons.

**Dark palettes are core but not exclusive.** Always pair dark surfaces with
bone-paper sections; the rhythm between *infrastructural dark* and *editorial
paper* is the system. Avoid pure black (`#000`) and pure white (`#FFF`).

### Typography

**Two sans, deliberately paired.** Per the brand typography guide
(`uploads/typography_guide_montserrat_helvetica.html`): **Montserrat for
titles, Helvetica for body.** The Chimera logic — a composite organism of
two systems — is encoded in the type itself.

- **Titles — `Montserrat` (brand-supplied)**. Geometric, restrained. Used for
  display, h1–h6, labels, eyebrows, navigation, all uppercase document marks.
  Weights in active use: **600** (sections, h2, h3, labels) and **700**
  (display, h1). The full family (300–900) is loaded but the system is
  disciplined: most pages use one weight, never more than two.
- **Body — `Helvetica` (brand-supplied)**. The institutional workhorse: lead,
  body, captions, all reading copy. **Weight 400 only — never bold for body.**
  Italic is available but the system avoids it (no editorial italic emphasis).
- **Mono — `Geist Mono` (substitute)**. Utility role only: tabular numerics,
  document IDs, phone numbers, code. *No brand mono supplied — flag if you
  want a different mono.*

CSS tokens: `--font-title`, `--font-body`, `--font-mono`.

#### Hard typography rules (from the guide)

- **Minimum 1.5× jump** from heading to body — never let an h3 sit at body+2.
- **No Montserrat below 16px.** It is a title face. Caption / body register
  belongs to Helvetica.
- **Negative letter-spacing only above 24px.** Smaller sizes track at 0.
- **Montserrat 700** reserved for display and h1; **600** for everything else.
- **Max two weights per screen.** A page with three Montserrat weights is broken.
- **Helvetica never bold** for body. Emphasis in body is done by color or by
  surrounding context, not weight.
- **Labels & eyebrows** are always Montserrat 600 uppercase, tracked +8% to +12%.

#### Emphasis pattern

**One emphasis device only: lavender colour shift, same weight.**
The italic-serif accent from earlier drafts is retired. To stress a single
phrase in a heading, change its colour to `--quimera-bebacc` and keep the
weight identical. Use on **one phrase per page maximum**.

```html
<h1>Authority is built, <em style="color: var(--lav-300)">not announced.</em></h1>
```

### Spacing & rhythm
8-based scale with editorial half-steps (`--sp-1` 4px → `--sp-11` 192px).
**Negative space is a primary expressive material.** Section padding routinely
goes to 96–192px. Body columns are narrow (max ~640px for prose, ~720px for
mixed). Rhythm is intentional and rule-governed.

### Backgrounds
- **No gradients** — at most, a near-imperceptible vertical *protection gradient*
  from `--ink-950` → `--ink-900` to anchor heavy content on long pages.
- **No hand-drawn illustrations.**
- **Imagery**: documentary, architectural, or institutional — buildings,
  infrastructure, archives, signal towers, archival paper, shadow studies.
  **Warm-cool monochrome or desaturated colour grade**. Never warm-saturated
  stock. Never people-stock with laptops. When unavailable, fall back to a
  **typographic-only composition** — always preferable to a wrong image.
- **Textures**: very subtle — a 1–2% film-grain overlay is acceptable on full-bleed
  imagery. **No repeating patterns**, no marble, no noise that reads as decoration.
- **Full-bleed** is used as an architectural device: one section full-bleed image,
  next section full-bleed paper, rhythm builds the document.

### Layout
- **Editorial grid**: 12-column with generous gutters (24–32px).
- **Asymmetric, controlled.** Headlines often offset to the right rule of the
  grid, body anchored left. Numbered workstreams sit in narrow left rail with
  body in adjacent column.
- **Hairline rules** (1px, `--rule` on dark, `--rule-paper` on light) separate
  sections — never thick borders, never coloured rules.
- **Fixed nav** is minimal: a thin top bar with mark + section index + locale
  toggle. Footer is dense editorial colophon.
- **Document coordinates** in the corners (`MADRID · ES — DOC 04.26`,
  page numbers, document IDs) reinforce the institutional-document register.

### Borders
- 1px hairlines only. Use `--rule` / `--rule-paper`.
- **Never** double borders. **Never** coloured borders as accent (except the
  redaction-style oxide rule, very sparingly).

### Shadows / elevation
**Mineral, not glowy.** Three levels (`--shadow-1`, `--shadow-2`, `--shadow-3`)
— all tight, near-black, low-spread. Cards on paper get `--shadow-1`. Modals get
`--shadow-3`. **No coloured shadows. No glow. No neumorphism.**

### Hover states
- **Text links**: underline-on-hover (with `text-underline-offset: 0.2em`,
  `text-decoration-thickness: 1px`); colour does *not* change.
- **Buttons**: background shifts one ink-step (e.g. `--ink-900` → `--ink-800`),
  and `transform: translateY(-1px)` only on primary buttons.
- **Cards**: outer ring sharpens (`--rule` → `--rule-strong`), shadow elevates one step.
- **Lavender hover** on dark buttons: `--quimera-bebacc` text reveal under the
  default state — *sparingly*.

### Press / active
- 1px translateY back to 0, opacity 0.9, no scale-down. Quimera never bounces.

### Transparency & blur
- **Hairline rules** use `rgba` for hairline tone.
- **Modal scrims** use `rgba(14,13,18,0.65)` + `backdrop-filter: blur(8px)` —
  *only* for full-screen modals. Never as decoration.
- **No glass-morphism panels.** No frosted nav.

### Animation
- **Easing**: `--ease-quiet` (`cubic-bezier(0.22, 0.61, 0.36, 1)`) for content
  reveals; `--ease-firm` for utility (toggles, menus).
- **Duration**: 120ms (`--t-fast`) for hover; 200ms (`--t-base`) for content;
  400ms (`--t-slow`) for full-section enters. **Never longer.**
- **Motion vocabulary**:
  - Opacity fades + 8–12px translate-up for content enters.
  - Hairline rules *draw on* (left → right) for section dividers.
  - **No bounce, no spring, no parallax, no scroll-jacked animations.**
- Hover/idle animations are absent. The product is still when not addressed.

### Corner radii
- **Architectural**, almost square. `--r-md` (6px) is the everyday card / input
  / button radius. `--r-pill` (999px) is reserved for **chips / tags only** —
  never buttons.
- Large surfaces (modals, sheets) use `--r-md` or `--r-none`. Photos and
  full-bleed images: **0**.

### Cards
- 1px hairline border (`--rule-paper` on light, `--rule` on dark).
- `--r-md` corners.
- `--shadow-1` on light backgrounds. **No shadow on dark.**
- 24–32px internal padding.
- Eyebrow + serif title + sans body is the canonical card composition.
- Title and body are separated by a 1px hairline or 24–32px of space — never both.

### Imagery colour vibe
- **Cool / monochrome / institutional.** B&W with warm-paper duotone is the
  default treatment for editorial imagery.
- Acceptable colour grades: *graphite-blue, oxide-red duotone, copper-paper duotone*.
- **Grain**: subtle, only on hero / full-bleed images, 2–4% noise.
- **Avoid**: warm-saturated stock; flat illustration; AI-generated abstract
  blobs; bluish-purple "tech" gradients; emoji.

### Layering & rhythm
- Layer **paper rectangles on dark surfaces**, slightly inset and rotated 0° (never
  tilted). This is the visual analogue of *documents on a desk*.
- Use **document-coordinate metadata** (mono, mono-mono-eyebrow tone) to label
  every surface: section number, doc ID, page count, locale.

### What to avoid (explicitly)
- Bluish-purple "AI" gradients
- Emoji of any kind
- Cards with rounded corners and a coloured left-border accent
- Glassy frosted panels
- Soft drop shadows in colour
- Hand-drawn SVG illustrations
- Decorative gradient text
- Cursive / handwritten fonts
- Stock photography of teams, laptops, handshakes
- "Cyberpunk" dark themes (neon, electric blue, magenta, scanlines)

---

## ICONOGRAPHY

**Quimera does not lead with icons.** The brand is editorial-document first —
language and typography carry hierarchy, not icons.

### When icons appear
- Functional UI affordances only (menu, close, external-link, search, locale
  toggle, play, download).
- Document-coordinate markers (small mono glyphs alongside coordinates and meta).
- *Never* as decorative accents next to headlines, list items, or section titles.

### Icon system: Lucide (CDN)
Source materials do not include a custom icon set. The Quimera system standardises
on **Lucide** (`https://unpkg.com/lucide@latest`) — a minimal, even-stroke,
24×24 line icon library that matches the architectural-grotesque register of
the typography.

- **Stroke**: 1.5px (not 2 — Lucide's default 2 reads too heavy beside Geist).
- **Size**: 16, 20, 24 px. Inline icons use `currentColor`.
- **Never** mix Lucide with another set. Never use filled-style icons.
- **No emoji** as icon. No unicode arrows in place of icons.

> **Substitution flag**: Lucide is a placeholder. If Quimera adopts a licensed
> set (e.g. Phosphor, Iconic, or a bespoke library), swap globally — keeping
> the 1.5px / 24-box conventions.

### Logos & marks
The chimera mark is rendered in six canonical variants — copy from `assets/`:

| File | Use |
|---|---|
| `assets/quimera-mark-bebacc.svg` | Primary — on `--ink-950` or `--bone-50` |
| `assets/quimera-mark-bebacc-shadow.svg` | "3D" variant — bebacc fill with offset darker layer behind. For paper / hero contexts where the mark needs depth. |
| `assets/quimera-mark-white-on-black.svg` | Reversed solid on dark surfaces |
| `assets/quimera-mark-black-on-white.svg` | Solid on paper / documents |
| `assets/quimera-mark-outline-white.svg` | Outline reversed — for overlays / watermarks |
| `assets/quimera-mark-outline-black.svg` | Outline on paper — for stamps / debossed contexts |

The mark is always given **clear space ≥ 1× its own height** on all sides.
Minimum size: 24px square in UI, 32px in print. **Never** rotate, recolour
outside the palette, place on busy imagery without a paper or ink panel, or
combine with other graphic elements.

The agency name "QUIMERA AGENCY" is typically locked-up beside or below the
mark in `Geist Mono` uppercase, tracked `0.12em`. The lockup is reproduced in
`ui_kits/website/Header.jsx` and `slides/`.
