# Fonts

The Quimera type system. **Both faces are brand-supplied** — Montserrat for
titles and Helvetica for body — per
`../uploads/typography_guide_montserrat_helvetica.html`.

## Montserrat — titles

The full family is loaded (Thin → Black + italics) but the system uses only
**600** and **700** weights, with **300** and **900** reserved for special
editorial moments.

| File | Weight | Active role |
|---|---|---|
| `Montserrat-Regular.ttf` | 400 | available, rarely used |
| `Montserrat-Italic.ttf` | 400i | available, rarely used |
| `Montserrat-Medium.ttf` | 500 | available, rarely used |
| `Montserrat-MediumItalic.ttf` | 500i | available, rarely used |
| `Montserrat-SemiBold.ttf` | 600 | **h2, h3, h4, eyebrows, labels, nav** |
| `Montserrat-SemiBoldItalic.ttf` | 600i | available |
| `Montserrat-Bold.ttf` | 700 | **display, h1** |
| `Montserrat-BoldItalic.ttf` | 700i | available |
| `Montserrat-Black.ttf` | 900 | editorial display only |
| `Montserrat-BlackItalic.ttf` | 900i | available |
| `Montserrat-Light.ttf` | 300 | editorial display only |
| `Montserrat-ExtraBold.ttf` | 800 | not currently used |
| `Montserrat-Thin.ttf` etc. | 100/200 | not currently used |

## Helvetica — body

| File | Weight | Active role |
|---|---|---|
| `Helvetica.ttf` | 400 | **lead, body, caption** |
| `Helvetica-Oblique.ttf` | 400i | available, rarely used |
| `Helvetica-Bold.ttf` | 700 | available but **never use for body** |
| `Helvetica-BoldOblique.ttf` | 700i | available but **never use for body** |
| `helvetica-compressed-5871d14b6903a.otf` | — | available (not active) |
| `helvetica-rounded-bold-5871d05ead8de.otf` | — | available (not active) |
| ⚠️ `helvetica-light-587ebe5a59211.ttf` | 300 | **invalid TTF — file rejected by browser** |

> ⚠️ **Helvetica Light 300** — the supplied `helvetica-light-*.ttf` file
> fetches successfully but the browser rejects it as an invalid TrueType
> font. Its `@font-face` block has been removed. If a working Light cut is
> needed, please re-upload a valid file.

## CSS tokens

```css
--font-title:  'Montserrat', 'Helvetica', Arial, sans-serif;
--font-body:   'Helvetica', 'Helvetica Neue', Arial, sans-serif;
--font-mono:   'Geist Mono', ui-monospace, 'JetBrains Mono', Menlo, monospace;

/* Back-compat aliases (older code) */
--font-sans:   var(--font-body);
--font-serif:  var(--font-title);   /* legacy — was editorial serif */
```

## Still missing (substitute in use)

| Role | Substitute (Google Fonts) | Note |
|---|---|---|
| Mono | Geist Mono | Used sparingly — tabular numerics, document IDs, code only |

If the agency adopts a licensed mono, drop the file into this folder and
replace the `@import` at the top of `colors_and_type.css`.
