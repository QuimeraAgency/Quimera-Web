/* @ds-bundle: {"format":3,"namespace":"QuimeraDesignSystem_d771f2","components":[],"sourceHashes":{"slides/deck-stage.js":"0c125b8b1e23","ui_kits/website/CaseStudyTable.jsx":"193582613ccc","ui_kits/website/ContactBlock.jsx":"8fd1be3dc89a","ui_kits/website/Footer.jsx":"1e07aec149cf","ui_kits/website/Header.jsx":"65357f902cc6","ui_kits/website/Hero.jsx":"9d941806e019","ui_kits/website/LangHook.jsx":"f1a532a42815","ui_kits/website/Manifesto.jsx":"6e227cab773f","ui_kits/website/PerspectivePage.jsx":"f4d612294c09","ui_kits/website/PerspectiveStrip.jsx":"4a7a86c968fe","ui_kits/website/Services.jsx":"99b371935322","ui_kits/website/ServicesPage.jsx":"51726ed6a378","ui_kits/website/Specimen.jsx":"6655753b977c","ui_kits/website/Tweaks.jsx":"1e0112e4bb60","ui_kits/website/WorkPage.jsx":"5fd8795c4678","ui_kits/website/artdir.js":"09de22fe6fbe","ui_kits/website/config.js":"9cb62abaf72d","ui_kits/website/i18n.js":"68d9d3f1bc4d","ui_kits/website/imagery.js":"861d4f733d1d","ui_kits/website/motion.js":"591d8cccec25","ui_kits/website/tweaks-panel.jsx":"7f64c6909a8b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.QuimeraDesignSystem_d771f2 = window.QuimeraDesignSystem_d771f2 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// slides/deck-stage.js
try { (() => {
/**
 * <deck-stage> — reusable web component for HTML decks.
 *
 * Handles:
 *  (a) speaker notes — reads <script type="application/json" id="speaker-notes">
 *      and posts {slideIndexChanged: N} to the parent window on nav.
 *  (b) keyboard navigation — ←/→, PgUp/PgDn, Space, Home/End, number keys.
 *      On touch devices, tapping the left/right half of the stage goes
 *      prev/next — taps on links, buttons and other interactive slide
 *      content are left alone.
 *  (c) press R to reset to slide 0 (with a tasteful keyboard hint).
 *  (d) bottom-center overlay showing slide count + hints, fades out on idle.
 *  (e) auto-scaling — inner canvas is a fixed design size (default 1920×1080)
 *      scaled with `transform: scale()` to fit the viewport, letterboxed.
 *      Set the `noscale` attribute to render at authored size (1:1) — the
 *      PPTX exporter sets this so its DOM capture sees unscaled geometry.
 *  (f) print — `@media print` lays every slide out as its own page at the
 *      design size, so the browser's Print → Save as PDF produces a clean
 *      one-page-per-slide PDF with no extra setup.
 *  (g) thumbnail rail — resizable left-hand column of per-slide thumbnails
 *      (static clones). Click to navigate; ↑/↓ with a thumbnail focused to
 *      step between slides; drag to reorder; right-click for
 *      Skip / Move up / Move down / Delete (opens a Cancel/Delete confirm
 *      dialog). Drag the rail's right edge to resize; width persists to
 *      localStorage. Skipped slides carry `data-deck-skip`, are dimmed in
 *      the rail, omitted from prev/next navigation, and hidden at print.
 *      The rail is suppressed in presenting mode, in the host's Preview
 *      mode (ViewerMode='none'), on `noscale`, on narrow viewports
 *      (≤640px), and via the `no-rail` attribute. Rail mutations dispatch
 *      a `deckchange`
 *      CustomEvent on the element: detail = {action, from, to, slide}.
 *
 * Slides are HIDDEN, not unmounted. Non-active slides stay in the DOM with
 * `visibility: hidden` + `opacity: 0`, so their state (videos, iframes,
 * form inputs, React trees) is preserved across navigation.
 *
 * Lifecycle event — the component dispatches a `slidechange` CustomEvent on
 * itself whenever the active slide changes (including the initial mount).
 * The event bubbles and composes out of shadow DOM, so you can listen on
 * the <deck-stage> element or on document:
 *
 *   document.querySelector('deck-stage').addEventListener('slidechange', (e) => {
 *     e.detail.index         // new 0-based index
 *     e.detail.previousIndex // previous index, or -1 on init
 *     e.detail.total         // total slide count
 *     e.detail.slide         // the new active slide element
 *     e.detail.previousSlide // the prior slide element, or null on init
 *     e.detail.reason        // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
 *   });
 *
 * Persistence: none at the deck level. The host app keeps the current slide
 * in its own URL (?slide=) and re-delivers it via location.hash on load, so a
 * bare load with no hash always starts at slide 1.
 *
 * Usage:
 *   <style>deck-stage:not(:defined){visibility:hidden}</style>
 *   <deck-stage width="1920" height="1080">
 *     <section data-label="Title">...</section>
 *     <section data-label="Agenda">...</section>
 *   </deck-stage>
 *   <script src="deck-stage.js"></script>
 *
 * The :not(:defined) rule prevents a flash of the first slide at its
 * authored styles before this script runs and attaches the shadow root.
 *
 * Slides are the direct element children of <deck-stage>. Each slide is
 * automatically tagged with:
 *   - data-screen-label="NN Label"   (1-indexed, for comment flow)
 *   - data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"
 */

(() => {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const OVERLAY_HIDE_MS = 1800;
  const VALIDATE_ATTR = 'no_overflowing_text,no_overlapping_text,slide_sized_text';
  const FINE_POINTER_MQ = matchMedia('(hover: hover) and (pointer: fine)');
  const NARROW_MQ = matchMedia('(max-width: 640px)');
  // Slide-authored controls that should keep a tap instead of it navigating.
  const INTERACTIVE_SEL = 'a[href], button, input, select, textarea, summary, label, video[controls], audio[controls], [role="button"], [onclick], [tabindex]:not([tabindex^="-"]), [contenteditable]:not([contenteditable="false" i])';
  const pad2 = n => String(n).padStart(2, '0');

  // Label precedence: data-label → data-screen-label (number stripped) → first heading → "Slide".
  const getSlideLabel = el => {
    const explicit = el.getAttribute('data-label');
    if (explicit) return explicit;
    const existing = el.getAttribute('data-screen-label');
    if (existing) return existing.replace(/^\s*\d+\s*/, '').trim() || existing;
    const h = el.querySelector('h1, h2, h3, [data-title]');
    const t = h && (h.textContent || '').trim().slice(0, 40);
    if (t) return t;
    return 'Slide';
  };
  const stylesheet = `
    :host {
      position: fixed;
      inset: 0;
      display: block;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }
    /* connectedCallback holds this until document.fonts.ready (capped 2s) so
     * the first visible paint has the deck's real typography + final rail
     * layout. opacity (not visibility) so the active slide can't un-hide
     * itself via the ::slotted([data-deck-active]) visibility:visible rule.
     * Only the stage/rail hide — the black :host background stays, so the
     * iframe doesn't flash the page's default white. */
    :host([data-fonts-pending]) .stage,
    :host([data-fonts-pending]) .rail { opacity: 0; pointer-events: none; }

    .stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      transform-origin: center center;
      flex-shrink: 0;
      background: #fff;
      will-change: transform;
    }

    /* Slides live in light DOM (via <slot>) so authored CSS still applies.
       We absolutely position each slotted child to stack them. */
    ::slotted(*) {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    ::slotted([data-deck-active]) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    .overlay {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translate(-50%, 6px) scale(0.92);
      filter: blur(6px);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: #000;
      color: #fff;
      border-radius: 999px;
      font-size: 12px;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.01em;
      opacity: 0;
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease;
      transform-origin: center bottom;
      z-index: 2147483000;
      user-select: none;
    }
    .overlay[data-visible] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
      filter: blur(0);
    }

    .btn {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: default;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      border-radius: 999px;
      color: rgba(255,255,255,0.72);
      transition: background 140ms ease, color 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }
    .btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .btn:active { background: rgba(255,255,255,0.18); }
    .btn:focus { outline: none; }
    .btn:focus-visible { outline: none; }
    .btn::-moz-focus-inner { border: 0; }
    .btn svg { width: 14px; height: 14px; display: block; }
    .btn.reset {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 0 10px 0 12px;
      gap: 6px;
      color: rgba(255,255,255,0.72);
    }
    .btn.reset .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px;
      line-height: 1;
      color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
    }

    .count {
      font-variant-numeric: tabular-nums;
      color: #fff;
      font-weight: 500;
      padding: 0 8px;
      min-width: 42px;
      text-align: center;
      font-size: 12px;
    }
    .count .sep { color: rgba(255,255,255,0.45); margin: 0 3px; font-weight: 400; }
    .count .total { color: rgba(255,255,255,0.55); }

    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.18);
      margin: 0 2px;
    }

    /* ── Thumbnail rail ──────────────────────────────────────────────────
       Fixed column on the left; each thumbnail is a static deep-clone of
       the light-DOM slide scaled into a 16:9 (or design-aspect) frame. The
       stage re-fits around it (see _fit); hidden during present / noscale
       / print so capture geometry and fullscreen output are unchanged. */
    .rail {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--deck-rail-w, 188px);
      background: #141414;
      border-right: 1px solid rgba(255,255,255,0.08);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 2147482500;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.18) transparent;
    }
    .rail::-webkit-scrollbar { width: 8px; }
    .rail::-webkit-scrollbar-track { background: transparent; margin: 2px; }
    .rail::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.18);
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    .rail::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.28);
      border: 2px solid transparent;
      background-clip: content-box;
    }
    :host([no-rail]) .rail,
    :host([noscale]) .rail { display: none; }
    .rail[data-presenting] { display: none; }
    @media (max-width: 640px) {
      .rail, .rail-resize { display: none; }
    }
    /* User-driven show/hide (the TweaksPanel toggle) slides instead of
       popping. Transitions are gated on :host([data-rail-anim]) — set only
       for the 200ms around the toggle — so window-resize and rail-width
       drag (which also call _fit) don't lag behind the cursor. */
    .rail[data-user-hidden] { transform: translateX(-100%); }
    :host([data-rail-anim]) .rail { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .stage { transition: left 200ms cubic-bezier(.3,.7,.4,1); }
    :host([data-rail-anim]) .canvas { transition: transform 200ms cubic-bezier(.3,.7,.4,1); }
    /* transition shorthand replaces rather than merges — repeat the base
       .overlay opacity/transform/filter transitions so visibility changes
       during the 200ms toggle window still fade instead of popping. */
    :host([data-rail-anim]) .overlay {
      transition: margin-left 200ms cubic-bezier(.3,.7,.4,1),
                  opacity 260ms ease,
                  transform 260ms cubic-bezier(.2,.8,.2,1),
                  filter 260ms ease;
    }

    .thumb {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
      user-select: none;
    }
    .thumb .num {
      width: 16px;
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 500;
      text-align: right;
      color: rgba(255,255,255,0.55);
      padding-top: 2px;
      font-variant-numeric: tabular-nums;
    }
    .thumb .frame {
      position: relative;
      flex: 1;
      min-width: 0;
      aspect-ratio: var(--deck-aspect);
      background: #fff;
      border-radius: 4px;
      outline: 2px solid transparent;
      outline-offset: 0;
      overflow: hidden;
      transition: outline-color 120ms ease;
    }
    .thumb:hover .frame { outline-color: rgba(255,255,255,0.25); }
    .thumb { outline: none; }
    .thumb:focus-visible .frame { outline-color: rgba(255,255,255,0.5); }
    .thumb[data-current] .num { color: #fff; }
    .thumb[data-current] .frame { outline-color: #D97757; }
    .thumb[data-dragging] { opacity: 0.35; }
    .thumb::before {
      content: '';
      position: absolute;
      left: 24px;
      right: 0;
      height: 3px;
      border-radius: 2px;
      background: #D97757;
      opacity: 0;
      pointer-events: none;
    }
    .thumb[data-drop="before"]::before { top: -8px; opacity: 1; }
    .thumb[data-drop="after"]::before { bottom: -8px; opacity: 1; }
    .thumb[data-skip] .frame { opacity: 0.35; }
    .thumb[data-skip] .frame::after {
      content: 'Skipped';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.45);
      color: #fff;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    .ctxmenu {
      position: fixed;
      min-width: 150px;
      padding: 4px;
      background: #242424;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 7px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
      z-index: 2147483100;
      display: none;
      font-size: 12px;
    }
    .ctxmenu[data-open] { display: block; }
    .ctxmenu button {
      display: block;
      width: 100%;
      appearance: none;
      border: 0;
      background: transparent;
      color: #e8e8e8;
      font: inherit;
      text-align: left;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .ctxmenu button:hover:not(:disabled) { background: rgba(255,255,255,0.08); }
    .ctxmenu button:disabled { opacity: 0.35; cursor: default; }
    .ctxmenu hr {
      border: 0;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 4px 2px;
    }

    .rail-resize {
      position: fixed;
      left: calc(var(--deck-rail-w, 188px) - 3px);
      top: 0;
      bottom: 0;
      width: 6px;
      cursor: col-resize;
      z-index: 2147482600;
      touch-action: none;
    }
    .rail-resize:hover,
    .rail-resize[data-dragging] { background: rgba(255,255,255,0.12); }
    :host([no-rail]) .rail-resize,
    :host([noscale]) .rail-resize,
    .rail[data-presenting] + .rail-resize,
    .rail[data-user-hidden] + .rail-resize { display: none; }

    /* Delete-confirm popup — matches the SPA's ConfirmDialog layout
       (title + message body, depressed footer with Cancel / Delete). */
    .confirm-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 2147483200;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .confirm-backdrop[data-open] { display: flex; }
    .confirm {
      width: 320px;
      max-width: calc(100vw - 32px);
      background: #2a2a2a;
      color: #e8e8e8;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      overflow: hidden;
      font-family: inherit;
      animation: deck-confirm-in 0.18s ease;
    }
    @keyframes deck-confirm-in {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .confirm .body { padding: 20px 20px 16px; }
    .confirm .title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
    .confirm .msg { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.65); }
    .confirm .footer {
      padding: 14px 20px;
      background: #1f1f1f;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .confirm button {
      appearance: none;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
    }
    .confirm .cancel {
      background: transparent;
      border: 0;
      color: rgba(255,255,255,0.8);
    }
    .confirm .cancel:hover { background: rgba(255,255,255,0.08); }
    .confirm .danger {
      background: #c96442;
      border: 1px solid rgba(0,0,0,0.15);
      color: #fff;
      box-shadow: 0 1px 3px rgba(166,50,68,0.3), 0 2px 6px rgba(166,50,68,0.18);
    }
    .confirm .danger:hover { background: #b5563a; }

    /* ── Print: one page per slide, no chrome ────────────────────────────
       The screen layout stacks every slide at inset:0 inside a scaled
       canvas; for print we want them in document flow at the authored
       design size so the browser paginates one slide per sheet. The
       @page size is set from the width/height attributes via the inline
       <style id="deck-stage-print-page"> that connectedCallback injects
       into <head> (the @page at-rule has no effect inside shadow DOM). */
    @media print {
      :host {
        position: static;
        inset: auto;
        background: none;
        overflow: visible;
        color: inherit;
      }
      .stage { position: static; display: block; }
      .canvas {
        transform: none !important;
        width: auto !important;
        height: auto !important;
        background: none;
        will-change: auto;
      }
      ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        width: var(--deck-design-w) !important;
        height: var(--deck-design-h) !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
        overflow: hidden;
      }
      /* :last-child alone isn't enough once data-deck-skip hides the
         trailing slide(s) — the last *visible* slide still carries
         break-after:page and prints a blank sheet. _markLastVisible()
         maintains data-deck-last-visible on the last non-skipped slide. */
      ::slotted(*:last-child),
      ::slotted([data-deck-last-visible]) {
        break-after: auto;
        page-break-after: auto;
      }
      ::slotted([data-deck-skip]) { display: none !important; }
      .overlay, .rail, .rail-resize, .ctxmenu, .confirm-backdrop { display: none !important; }
    }
  `;
  class DeckStage extends HTMLElement {
    static get observedAttributes() {
      return ['width', 'height', 'noscale', 'no-rail'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._index = 0;
      this._slides = [];
      this._notes = [];
      this._hideTimer = null;
      this._mouseIdleTimer = null;
      this._menuIndex = -1;
      this._onKey = this._onKey.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTap = this._onTap.bind(this);
      this._onMessage = this._onMessage.bind(this);
      // Capture-phase close so a click anywhere dismisses the menu, but
      // ignore clicks that land inside the menu itself — otherwise the
      // capture handler runs before the menu's own (bubble) handler and
      // clears _menuIndex out from under it.
      this._onDocClick = e => {
        if (this._menu && e.composedPath && e.composedPath().includes(this._menu)) return;
        this._closeMenu();
      };
    }
    get designWidth() {
      return parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
    }
    get designHeight() {
      return parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;
    }
    connectedCallback() {
      // Presenter-view popup loads deckUrl?_snthumb=...#N for its prev/cur/
      // next thumbnails — the rail has no business rendering inside those
      // (wrong scale, and it offsets the stage so the thumb shows a gutter).
      if (/[?&]_snthumb=/.test(location.search)) this.setAttribute('no-rail', '');
      this._render();
      this._loadNotes();
      this._syncPrintPageRule();
      window.addEventListener('keydown', this._onKey);
      window.addEventListener('resize', this._onResize);
      window.addEventListener('mousemove', this._onMouseMove, {
        passive: true
      });
      window.addEventListener('message', this._onMessage);
      window.addEventListener('click', this._onDocClick, true);
      this.addEventListener('click', this._onTap);
      // Initial collection + layout happens via slotchange, which fires on mount.
      this._enableRail();
      // Hold the stage hidden until webfonts are ready so the first visible
      // paint has the deck's real typography — the :not(:defined) guard in
      // the page HTML only covers custom-element upgrade, not font load.
      // Capped so a 404'd font URL can't blank the deck indefinitely.
      this.setAttribute('data-fonts-pending', '');
      const reveal = () => this.removeAttribute('data-fonts-pending');
      // rAF first: fonts.ready is a pre-resolved promise until layout has
      // resolved the slotted text's font-family and pushed a FontFace into
      // 'loading'. Reading it here in connectedCallback (parse-time) would
      // settle the race in a microtask before any font fetch starts.
      requestAnimationFrame(() => {
        Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 2000))]).then(reveal, reveal);
      });
    }
    _enableRail() {
      // Idempotent — older host builds still post __omelette_rail_enabled.
      // no-rail guard keeps the observers/stylesheet walk off the cheap path
      // for presenter-popup thumbnail iframes (up to 9 per view).
      if (this._railEnabled || this.hasAttribute('no-rail')) return;
      this._railEnabled = true;
      // Per-viewer preference — restored alongside rail width. Default on;
      // only a stored '0' (from the TweaksPanel toggle) hides it.
      this._railVisible = true;
      try {
        if (localStorage.getItem('deck-stage.railVisible') === '0') this._railVisible = false;
      } catch (e) {}
      // Live thumbnail updates: watch the light-DOM slides for content
      // edits and re-clone just the affected thumb(s), debounced. Ignore
      // the data-deck-* / data-screen-label / data-om-validate attributes
      // this component itself writes so nav and skip don't trigger
      // spurious refreshes.
      const OWN_ATTRS = /^data-(deck-|screen-label$|om-validate$)/;
      this._liveDirty = new Set();
      this._liveObserver = new MutationObserver(records => {
        for (const r of records) {
          if (r.type === 'attributes' && OWN_ATTRS.test(r.attributeName || '')) continue;
          let n = r.target;
          while (n && n.parentElement !== this) n = n.parentElement;
          if (n && this._slideSet && this._slideSet.has(n)) this._liveDirty.add(n);
        }
        if (this._liveDirty.size && !this._liveTimer) {
          this._liveTimer = setTimeout(() => {
            this._liveTimer = null;
            this._liveDirty.forEach(s => this._refreshThumb(s));
            this._liveDirty.clear();
          }, 200);
        }
      });
      this._liveObserver.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      // Lazy thumbnail materialization — clone the slide only when its
      // frame scrolls into (or near) the rail viewport. rootMargin gives
      // ~4 thumbs of pre-load so fast scrolling doesn't flash blanks.
      this._railObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting && e.target.__deckThumb) {
            this._materialize(e.target.__deckThumb);
          }
        });
      }, {
        root: this._rail,
        rootMargin: '400px 0px'
      });
      // Tweaks typically change CSS vars / attrs OUTSIDE <deck-stage>
      // (on <html>, <body>, a wrapper div, or a <style> tag), which
      // _liveObserver can't see. Re-snapshot author CSS (constructable
      // sheet is shared by reference, so one replaceSync updates every
      // thumb shadow root) and re-sync each thumb host's attrs + custom
      // properties. In-slide DOM mutations are _liveObserver's job.
      // Debounced so slider drags don't thrash.
      this._onTweakChange = () => {
        clearTimeout(this._tweakTimer);
        this._tweakTimer = setTimeout(() => {
          this._snapshotAuthorCss();
          // One getComputedStyle for the whole batch — each
          // getPropertyValue read below reuses the same computed style
          // as long as nothing invalidates layout between thumbs.
          const cs = getComputedStyle(this);
          (this._thumbs || []).forEach(t => {
            if (t.host) this._syncThumbHostAttrs(t.host, cs);
          });
        }, 120);
      };
      window.addEventListener('tweakchange', this._onTweakChange);
      this._snapshotAuthorCss();
      // Build the rail now that it's enabled — slotchange already fired,
      // so _renderRail's early-return skipped the initial build.
      this._syncRailHidden();
      this._renderRail();
      this._fit();
    }

    /** Snapshot document stylesheets into a constructable sheet that each
     *  thumbnail's nested shadow root adopts — so author CSS styles the
     *  cloned slide content without touching this component's chrome.
     *  Cross-origin sheets throw on .cssRules — skip them. Re-callable:
     *  the existing constructable sheet is reused via replaceSync so every
     *  already-adopted shadow root picks up the fresh CSS without re-adopt. */
    _snapshotAuthorCss() {
      // :root in an adopted sheet inside a shadow root matches nothing
      // (only the document root qualifies), so author rules like
      // `:root[data-voice="modern"] .serif` never reach the clones.
      // Rewrite :root → :host and mirror <html>'s data-*/class/lang onto
      // each thumb host (see _syncThumbHostAttrs) so the same selectors
      // match inside the thumbnail's shadow tree.
      const authorCss = Array.from(document.styleSheets).map(sh => {
        try {
          return Array.from(sh.cssRules).map(r => r.cssText).join('\n');
        } catch (e) {
          return '';
        }
      }).join('\n')
      // The shadow host is featureless outside the functional :host(...)
      // form, so any compound on :root — [attr], .class, #id, :pseudo —
      // must become :host(<compound>) not :host<compound>. Same for the
      // html type selector (Tailwind class-strategy dark mode emits
      // html.dark; Pico uses html[data-theme]), which has nothing to
      // match inside the thumb's shadow tree.
      .replace(/:root((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)/g, ':host($1)').replace(/:root\b/g, ':host').replace(/(^|[\s,>~+(}])html((?:\[[^\]]*\]|[.#][-\w]+|:[-\w]+(?:\([^)]*\))?)+)(?![-\w])/g, '$1:host($2)').replace(/(^|[\s,>~+(}])html(?![-\w])/g, '$1:host');
      // Every custom property the author references. _syncThumbHostAttrs
      // mirrors each one's *computed* value at <deck-stage> onto the
      // thumb host so the live value wins over the :host default above
      // regardless of which ancestor the tweak wrote to (<html>, <body>,
      // a wrapper div, or the deck-stage element itself all inherit
      // down to getComputedStyle(this)).
      this._authorVars = new Set(authorCss.match(/--[\w-]+/g) || []);
      try {
        if (!this._adoptedSheet) this._adoptedSheet = new CSSStyleSheet();
        this._adoptedSheet.replaceSync(authorCss);
      } catch (e) {
        this._adoptedSheet = null;
        this._authorCss = authorCss;
      }
    }
    _syncThumbHostAttrs(host, cs) {
      const de = document.documentElement;
      // setAttribute overwrites but can't delete — an attr removed from
      // <html> (toggleAttribute off, classList emptied) would linger on
      // the host and :host([data-*]) / :host(.foo) rules would keep
      // matching. Remove stale mirrored attrs first; iterate backward
      // because removeAttribute mutates the live NamedNodeMap.
      for (let i = host.attributes.length - 1; i >= 0; i--) {
        const n = host.attributes[i].name;
        if ((n.startsWith('data-') || n === 'class' || n === 'lang') && !de.hasAttribute(n)) {
          host.removeAttribute(n);
        }
      }
      for (const a of de.attributes) {
        if (a.name.startsWith('data-') || a.name === 'class' || a.name === 'lang') {
          host.setAttribute(a.name, a.value);
        }
      }
      // The :root→:host rewrite in _snapshotAuthorCss pins each custom
      // property to its stylesheet default on the thumb host, shadowing
      // the live value that would otherwise inherit. Tweaks can write the
      // live value on any ancestor — <html>, <body>, a wrapper div, the
      // deck-stage element — so read it as the *computed* value at
      // <deck-stage> (which sees the whole inheritance chain) rather than
      // trying to guess which element the author wrote to. Inline on the
      // host beats the :host{} rule. remove-stale covers vars dropped
      // from the stylesheet between snapshots.
      const vars = this._authorVars || new Set();
      for (let i = host.style.length - 1; i >= 0; i--) {
        const p = host.style[i];
        if (p.startsWith('--') && !vars.has(p)) host.style.removeProperty(p);
      }
      const live = cs || getComputedStyle(this);
      vars.forEach(p => {
        const v = live.getPropertyValue(p);
        if (v) host.style.setProperty(p, v.trim());else host.style.removeProperty(p);
      });
    }
    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('message', this._onMessage);
      window.removeEventListener('click', this._onDocClick, true);
      this.removeEventListener('click', this._onTap);
      if (this._hideTimer) clearTimeout(this._hideTimer);
      if (this._mouseIdleTimer) clearTimeout(this._mouseIdleTimer);
      if (this._liveTimer) clearTimeout(this._liveTimer);
      if (this._tweakTimer) clearTimeout(this._tweakTimer);
      if (this._railAnimTimer) clearTimeout(this._railAnimTimer);
      if (this._scaleRaf) cancelAnimationFrame(this._scaleRaf);
      if (this._liveObserver) this._liveObserver.disconnect();
      if (this._railObserver) this._railObserver.disconnect();
      if (this._onTweakChange) window.removeEventListener('tweakchange', this._onTweakChange);
    }
    attributeChangedCallback() {
      if (this._canvas) {
        this._canvas.style.width = this.designWidth + 'px';
        this._canvas.style.height = this.designHeight + 'px';
        this._canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
        this._canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
        if (this._rail) {
          this._rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
        }
        this._fit();
        this._scaleThumbs();
        this._syncPrintPageRule();
      }
    }
    _render() {
      const style = document.createElement('style');
      style.textContent = stylesheet;
      const stage = document.createElement('div');
      stage.className = 'stage';
      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.width = this.designWidth + 'px';
      canvas.style.height = this.designHeight + 'px';
      canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
      canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
      const slot = document.createElement('slot');
      slot.addEventListener('slotchange', this._onSlotChange);
      canvas.appendChild(slot);
      stage.appendChild(canvas);

      // Overlay: compact, solid black, with clickable controls.
      const overlay = document.createElement('div');
      overlay.className = 'overlay export-hidden';
      overlay.setAttribute('role', 'toolbar');
      overlay.setAttribute('aria-label', 'Deck controls');
      overlay.setAttribute('data-omelette-chrome', '');
      overlay.innerHTML = `
        <button class="btn prev" type="button" aria-label="Previous slide" title="Previous (←)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <span class="count" aria-live="polite"><span class="current">1</span><span class="sep">/</span><span class="total">1</span></span>
        <button class="btn next" type="button" aria-label="Next slide" title="Next (→)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
        </button>
        <span class="divider"></span>
        <button class="btn reset" type="button" aria-label="Reset to first slide" title="Reset (R)">Reset<span class="kbd">R</span></button>
      `;
      overlay.querySelector('.prev').addEventListener('click', () => this._advance(-1, 'click'));
      overlay.querySelector('.next').addEventListener('click', () => this._advance(1, 'click'));
      overlay.querySelector('.reset').addEventListener('click', () => this._go(0, 'click'));

      // Thumbnail rail + context menu. Thumbnails are populated in
      // _renderRail() after _collectSlides().
      const rail = document.createElement('div');
      rail.className = 'rail export-hidden';
      rail.setAttribute('data-omelette-chrome', '');
      rail.style.setProperty('--deck-aspect', this.designWidth + '/' + this.designHeight);
      // Edge auto-scroll while dragging a thumb near the rail's top/bottom
      // so off-screen drop targets are reachable. Native dragover fires
      // continuously while the pointer is stationary, so a per-event nudge
      // (ramped by edge proximity) is enough — no rAF loop needed.
      rail.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        const r = rail.getBoundingClientRect();
        const EDGE = 40;
        const dt = e.clientY - r.top;
        const db = r.bottom - e.clientY;
        if (dt < EDGE) rail.scrollTop -= Math.ceil((EDGE - dt) / 3);else if (db < EDGE) rail.scrollTop += Math.ceil((EDGE - db) / 3);
      });
      const menu = document.createElement('div');
      menu.className = 'ctxmenu export-hidden';
      menu.setAttribute('data-omelette-chrome', '');
      menu.innerHTML = `
        <button type="button" data-act="skip">Skip slide</button>
        <button type="button" data-act="up">Move up</button>
        <button type="button" data-act="down">Move down</button>
        <hr>
        <button type="button" data-act="delete">Delete slide</button>
      `;
      menu.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        const i = this._menuIndex;
        this._closeMenu();
        if (act === 'skip') this._toggleSkip(i);else if (act === 'up') this._moveSlide(i, i - 1);else if (act === 'down') this._moveSlide(i, i + 1);else if (act === 'delete') this._openConfirm(i);
      });
      menu.addEventListener('contextmenu', e => e.preventDefault());

      // Rail resize handle — drag to set --deck-rail-w, persisted to
      // localStorage so the width survives reloads.
      const resize = document.createElement('div');
      resize.className = 'rail-resize export-hidden';
      resize.setAttribute('data-omelette-chrome', '');
      resize.addEventListener('pointerdown', e => {
        e.preventDefault();
        resize.setPointerCapture(e.pointerId);
        resize.setAttribute('data-dragging', '');
        const move = ev => this._setRailWidth(ev.clientX);
        const up = () => {
          resize.removeEventListener('pointermove', move);
          resize.removeEventListener('pointerup', up);
          resize.removeEventListener('pointercancel', up);
          resize.removeAttribute('data-dragging');
          try {
            localStorage.setItem('deck-stage.railWidth', String(this._railPx));
          } catch (err) {}
        };
        resize.addEventListener('pointermove', move);
        resize.addEventListener('pointerup', up);
        resize.addEventListener('pointercancel', up);
      });

      // Delete-confirm dialog — mirrors the SPA's ConfirmDialog layout.
      const confirm = document.createElement('div');
      confirm.className = 'confirm-backdrop export-hidden';
      confirm.setAttribute('data-omelette-chrome', '');
      confirm.innerHTML = `
        <div class="confirm" role="dialog" aria-modal="true">
          <div class="body">
            <div class="title">Delete slide?</div>
            <div class="msg">This slide will be removed from the deck.</div>
          </div>
          <div class="footer">
            <button type="button" class="cancel">Cancel</button>
            <button type="button" class="danger">Delete</button>
          </div>
        </div>
      `;
      confirm.addEventListener('click', e => {
        if (e.target === confirm) this._closeConfirm();
      });
      confirm.querySelector('.cancel').addEventListener('click', () => this._closeConfirm());
      confirm.querySelector('.danger').addEventListener('click', () => {
        const i = this._confirmIndex;
        this._closeConfirm();
        this._deleteSlide(i);
      });
      this._root.append(style, rail, resize, stage, overlay, menu, confirm);
      this._canvas = canvas;
      this._stage = stage;
      this._slot = slot;
      this._overlay = overlay;
      this._rail = rail;
      this._resize = resize;
      this._menu = menu;
      this._confirm = confirm;
      this._countEl = overlay.querySelector('.current');
      this._totalEl = overlay.querySelector('.total');

      // Restore persisted rail width.
      let rw = 188;
      try {
        const s = localStorage.getItem('deck-stage.railWidth');
        if (s) rw = parseInt(s, 10) || rw;
      } catch (err) {}
      this._setRailWidth(rw);
      this._syncRailHidden();
    }
    _setRailWidth(px) {
      const w = Math.max(120, Math.min(360, Math.round(px)));
      this._railPx = w;
      this.style.setProperty('--deck-rail-w', w + 'px');
      this._fit();
      // _scaleThumbs forces a sync layout (frame.offsetWidth) then writes
      // N transforms. During a resize drag this runs per-pointermove;
      // coalesce to one per frame.
      if (!this._scaleRaf) {
        this._scaleRaf = requestAnimationFrame(() => {
          this._scaleRaf = null;
          this._scaleThumbs();
        });
      }
    }

    /** @page must live in the document stylesheet — it's a no-op inside
     *  shadow DOM. Inject/update a single <head> style tag so the print
     *  sheet matches the design size and Save-as-PDF yields one slide per
     *  page with no margins. */
    _syncPrintPageRule() {
      const id = 'deck-stage-print-page';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
        document.head.appendChild(tag);
      }
      tag.textContent = '@page { size: ' + this.designWidth + 'px ' + this.designHeight + 'px; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; overflow: visible !important; height: auto !important; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }';
    }
    _onSlotChange() {
      // Rail mutations (delete/move) already reconcile synchronously and
      // emit slidechange with reason 'api'; skip the async slotchange that
      // would otherwise re-broadcast with reason 'init'.
      if (this._squelchSlotChange) {
        this._squelchSlotChange = false;
        return;
      }
      this._collectSlides();
      this._restoreIndex();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'init'
      });
      this._fit();
    }
    _collectSlides() {
      const assigned = this._slot.assignedElements({
        flatten: true
      });
      this._slides = assigned.filter(el => {
        // Skip template/style/script nodes even if someone slots them.
        const tag = el.tagName;
        return tag !== 'TEMPLATE' && tag !== 'SCRIPT' && tag !== 'STYLE';
      });
      this._slideSet = new Set(this._slides);
      this._slides.forEach((slide, i) => {
        const n = i + 1;
        slide.setAttribute('data-screen-label', `${pad2(n)} ${getSlideLabel(slide)}`);

        // Validation attribute for comment flow / auto-checks.
        if (!slide.hasAttribute('data-om-validate')) {
          slide.setAttribute('data-om-validate', VALIDATE_ATTR);
        }
        slide.setAttribute('data-deck-slide', String(i));
      });
      if (this._totalEl) this._totalEl.textContent = String(this._slides.length || 1);
      if (this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
      this._markLastVisible();
      this._renderRail();
    }

    /** Tag the last non-skipped slide so print CSS can drop its
     *  break-after (see the @media print comment above — :last-child
     *  alone matches a hidden skipped slide). */
    _markLastVisible() {
      let last = null;
      this._slides.forEach(s => {
        s.removeAttribute('data-deck-last-visible');
        if (!s.hasAttribute('data-deck-skip')) last = s;
      });
      if (last) last.setAttribute('data-deck-last-visible', '');
    }
    _loadNotes() {
      const tag = document.getElementById('speaker-notes');
      if (!tag) {
        this._notes = [];
        return;
      }
      try {
        const parsed = JSON.parse(tag.textContent || '[]');
        if (Array.isArray(parsed)) this._notes = parsed;
      } catch (e) {
        console.warn('[deck-stage] Failed to parse #speaker-notes JSON:', e);
        this._notes = [];
      }
    }
    _restoreIndex() {
      // The host's ?slide= param is delivered as a #<int> hash (1-indexed) on
      // the iframe src. No hash → slide 1; the deck itself keeps no position
      // state across loads.
      const h = (location.hash || '').match(/^#(\d+)$/);
      if (h) {
        const n = parseInt(h[1], 10) - 1;
        if (n >= 0 && n < this._slides.length) this._index = n;
      }
    }
    _applyIndex({
      showOverlay = true,
      broadcast = true,
      reason = 'init'
    } = {}) {
      if (!this._slides.length) return;
      const prev = this._prevIndex == null ? -1 : this._prevIndex;
      const curr = this._index;
      // Keep the iframe's own hash in sync so an in-iframe location.reload()
      // (reload banner path in viewer-handle.ts) lands on the current slide,
      // not the stale deep-link hash from initial load.
      try {
        history.replaceState(null, '', '#' + (curr + 1));
      } catch (e) {}
      this._slides.forEach((s, i) => {
        if (i === curr) s.setAttribute('data-deck-active', '');else s.removeAttribute('data-deck-active');
      });
      if (this._countEl) this._countEl.textContent = String(curr + 1);
      // Follow-scroll on every navigation (init deep-link, keyboard, click,
      // tap, external goTo) — the only time we *don't* want the rail to
      // track current is after a rail-internal mutation, where _renderRail
      // has already restored the user's scroll position and yanking back to
      // current would undo it.
      this._syncRail(reason !== 'mutation');
      if (broadcast) {
        // (1) Legacy: host-window postMessage for speaker-notes renderers.
        try {
          window.postMessage({
            slideIndexChanged: curr,
            deckTotal: this._slides.length,
            deckSkipped: this._skippedIndices()
          }, '*');
        } catch (e) {}

        // (2) In-page CustomEvent on the <deck-stage> element itself.
        //     Bubbles and composes out of shadow DOM so slide code can listen:
        //       document.querySelector('deck-stage').addEventListener('slidechange', e => {
        //         e.detail.index, e.detail.previousIndex, e.detail.total, e.detail.slide, e.detail.reason
        //       });
        const detail = {
          index: curr,
          previousIndex: prev,
          total: this._slides.length,
          slide: this._slides[curr] || null,
          previousSlide: prev >= 0 ? this._slides[prev] || null : null,
          reason: reason // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
        };
        this.dispatchEvent(new CustomEvent('slidechange', {
          detail,
          bubbles: true,
          composed: true
        }));
      }
      this._prevIndex = curr;
      if (showOverlay) this._flashOverlay();
    }
    _flashOverlay() {
      // Host posts __omelette_presenting while in fullscreen/tab presentation
      // mode — suppress the nav footer entirely (both hover and slide-change
      // flash) so the audience sees clean slides.
      if (!this._overlay || this._presenting) return;
      this._overlay.setAttribute('data-visible', '');
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => {
        this._overlay.removeAttribute('data-visible');
      }, OVERLAY_HIDE_MS);
    }
    _railWidth() {
      // State-based, no offsetWidth: the first _fit() can run before the
      // rail has had layout on some load paths, and a 0 there paints the
      // slide full-width for one frame before the post-slotchange _fit()
      // corrects it.
      if (!this._railEnabled || !this._railVisible || this.hasAttribute('no-rail') || this.hasAttribute('noscale') || this._presenting || this._previewMode || NARROW_MQ.matches) return 0;
      return this._railPx || 0;
    }
    _fit() {
      if (!this._canvas) return;
      const stage = this._canvas.parentElement;
      // PPTX export sets noscale so the DOM capture sees authored-size
      // geometry — the scaled canvas is in shadow DOM, so the exporter's
      // resetTransformSelector can't reach .canvas.style.transform directly.
      if (this.hasAttribute('noscale')) {
        this._canvas.style.transform = 'none';
        if (stage) stage.style.left = '0';
        if (this._overlay) this._overlay.style.marginLeft = '0';
        return;
      }
      const rw = this._railWidth();
      if (stage) stage.style.left = rw + 'px';
      // Overlay is centred on the viewport via left:50% + translate(-50%);
      // marginLeft shifts the centre by rw/2 so it lands in the middle of
      // the [rw, innerWidth] stage region.
      if (this._overlay) this._overlay.style.marginLeft = rw / 2 + 'px';
      const vw = window.innerWidth - rw;
      const vh = window.innerHeight;
      const s = Math.min(vw / this.designWidth, vh / this.designHeight);
      this._canvas.style.transform = `scale(${s})`;
    }
    _onResize() {
      this._fit();
      // Crossing the narrow-viewport breakpoint reveals the rail — rerun the
      // thumbnail scale the same way _setRailWidth does.
      if (!this._scaleRaf) {
        this._scaleRaf = requestAnimationFrame(() => {
          this._scaleRaf = null;
          this._scaleThumbs();
        });
      }
    }
    _onMouseMove() {
      // Keep overlay visible while mouse moves; hide after idle.
      this._flashOverlay();
    }
    _onMessage(e) {
      const d = e.data;
      if (d && typeof d.__omelette_presenting === 'boolean') {
        this._presenting = d.__omelette_presenting;
        if (this._presenting && this._overlay) {
          this._overlay.removeAttribute('data-visible');
          if (this._hideTimer) clearTimeout(this._hideTimer);
        }
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Host's Preview segment (ViewerMode='none'): the rail's drag-reorder /
      // right-click skip-delete affordances are editing chrome, so hide it
      // while the user is just looking at the deck. Same hard-hide path as
      // presenting; independent of the user's _railVisible preference so
      // returning to Edit restores whatever they had.
      if (d && typeof d.__omelette_preview_mode === 'boolean') {
        if (d.__omelette_preview_mode === this._previewMode) return;
        this._previewMode = d.__omelette_preview_mode;
        this._syncRailHidden();
        this._closeMenu();
        this._closeConfirm();
        this._fit();
        this._scaleThumbs();
      }
      // Per-viewer show/hide, driven by the TweaksPanel's auto-injected
      // "Thumbnail rail" toggle (or any author script). Independent of
      // whether the Tweaks panel itself is open — closing the panel
      // doesn't change rail visibility. Persists alongside rail width.
      if (d && d.type === '__deck_rail_visible' && typeof d.on === 'boolean') {
        if (d.on === this._railVisible) return;
        this._railVisible = d.on;
        try {
          localStorage.setItem('deck-stage.railVisible', d.on ? '1' : '0');
        } catch (e) {}
        // Arm the transition, commit it, then flip state — otherwise the
        // browser coalesces both writes and nothing animates on show.
        this.setAttribute('data-rail-anim', '');
        void (this._rail && this._rail.offsetHeight);
        this._syncRailHidden();
        this._fit();
        this._scaleThumbs();
        clearTimeout(this._railAnimTimer);
        this._railAnimTimer = setTimeout(() => this.removeAttribute('data-rail-anim'), 220);
      }
      if (d && d.type === '__omelette_rail_enabled') this._enableRail();
    }
    _syncRailHidden() {
      if (!this._rail) return;
      // data-presenting is the hard hide (display:none) for flag-off,
      // presentation mode, and the host's Preview segment — instant, no
      // transition. data-user-hidden is the soft hide (translateX(-100%))
      // for the viewer's rail toggle, so show/hide slides under
      // :host([data-rail-anim]).
      const hard = !this._railEnabled || this._presenting || this._previewMode;
      if (hard) this._rail.setAttribute('data-presenting', '');else this._rail.removeAttribute('data-presenting');
      if (!this._railVisible) this._rail.setAttribute('data-user-hidden', '');else this._rail.removeAttribute('data-user-hidden');
      // translateX hide leaves thumbs (tabIndex=0) in the tab order —
      // inert keeps them unfocusable while the rail is off-screen.
      this._rail.inert = hard || !this._railVisible;
    }
    _onTap(e) {
      // Touch-only — keyboard + the overlay toolbar cover nav on desktop.
      if (FINE_POINTER_MQ.matches) return;
      // Only taps that land on the stage (slide content or letterbox); the
      // overlay / rail / menus are siblings with their own click handlers.
      const path = e.composedPath();
      if (!this._stage || !path.includes(this._stage)) return;
      // Let interactive slide content keep the tap. composedPath (not
      // e.target.closest) so we see through open shadow roots — a <button>
      // inside a slide-authored custom element retargets e.target to the
      // host but still appears in the composed path.
      if (e.defaultPrevented) return;
      for (const n of path) {
        if (n === this._stage) break;
        if (n.matches && n.matches(INTERACTIVE_SEL)) return;
      }
      e.preventDefault();
      const rw = this._railWidth();
      const mid = rw + (window.innerWidth - rw) / 2;
      this._advance(e.clientX < mid ? -1 : 1, 'tap');
    }
    _onKey(e) {
      // Ignore when the user is typing.
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      // Confirm dialog swallows nav keys while open; Escape cancels. Enter
      // is left to the focused button's native activation so Tab→Cancel
      // →Enter activates Cancel, not the window-level confirm path.
      if (this._confirm && this._confirm.hasAttribute('data-open')) {
        if (e.key === 'Escape') {
          this._closeConfirm();
          e.preventDefault();
        }
        return;
      }
      if (e.key === 'Escape' && this._menu && this._menu.hasAttribute('data-open')) {
        this._closeMenu();
        e.preventDefault();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;
      let handled = true;
      if (key === 'ArrowRight' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
        this._advance(1, 'keyboard');
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        this._advance(-1, 'keyboard');
      } else if (key === 'Home') {
        this._go(0, 'keyboard');
      } else if (key === 'End') {
        this._go(this._slides.length - 1, 'keyboard');
      } else if (key === 'r' || key === 'R') {
        this._go(0, 'keyboard');
      } else if (/^[0-9]$/.test(key)) {
        // 1..9 jump to that slide; 0 jumps to 10.
        const n = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (n < this._slides.length) this._go(n, 'keyboard');
      } else {
        handled = false;
      }
      if (handled) {
        e.preventDefault();
        this._flashOverlay();
      }
    }
    _go(i, reason = 'api') {
      if (!this._slides.length) return;
      const clamped = Math.max(0, Math.min(this._slides.length - 1, i));
      if (clamped === this._index) {
        this._flashOverlay();
        return;
      }
      this._index = clamped;
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason
      });
    }

    /** Step forward/back skipping any slide marked data-deck-skip. Falls
     *  back to _go's clamp-at-ends behaviour (flash overlay) when there's
     *  nothing further in that direction. */
    _advance(dir, reason) {
      if (!this._slides.length) return;
      let i = this._index + dir;
      while (i >= 0 && i < this._slides.length && this._slides[i].hasAttribute('data-deck-skip')) {
        i += dir;
      }
      if (i < 0 || i >= this._slides.length) {
        this._flashOverlay();
        return;
      }
      this._go(i, reason);
    }

    // ── Thumbnail rail ────────────────────────────────────────────────────
    //
    // Thumbs are keyed by slide element and reused across _renderRail()
    // calls, so a reorder/delete is an O(changed) DOM shuffle instead of an
    // O(N) teardown-and-re-clone. Each thumb starts as a lightweight shell
    // (num + empty frame); the clone is materialized lazily by an
    // IntersectionObserver when the frame scrolls into (or near) view, so
    // only visible-ish slides pay the clone + image-decode cost.

    _renderRail() {
      if (!this._rail || !this._railEnabled) {
        this._thumbs = [];
        return;
      }
      // FLIP: record each *materialized* thumb's top before the reconcile.
      // Off-screen (non-materialized) thumbs don't need the animation and
      // skipping their getBoundingClientRect saves a forced layout per
      // off-screen thumb on large decks.
      const prevTops = new Map();
      (this._thumbs || []).forEach(({
        thumb,
        slide,
        host
      }) => {
        if (host) prevTops.set(slide, thumb.getBoundingClientRect().top);
      });
      const st = this._rail.scrollTop;

      // Reconcile: reuse thumbs that already exist for a slide, create
      // shells for new slides, drop thumbs for removed slides.
      const bySlide = new Map();
      (this._thumbs || []).forEach(t => bySlide.set(t.slide, t));
      const next = [];
      this._slides.forEach(slide => {
        let t = bySlide.get(slide);
        if (t) bySlide.delete(slide);else t = this._makeThumb(slide);
        next.push(t);
      });
      // Orphans — slides removed since last render.
      bySlide.forEach(t => {
        if (this._railObserver) this._railObserver.unobserve(t.frame);
        t.thumb.remove();
      });
      // Put thumbs into document order to match _slides. insertBefore on
      // an already-correctly-placed node is a no-op, so this is cheap
      // when nothing moved.
      next.forEach((t, i) => {
        const want = t.thumb;
        const at = this._rail.children[i];
        if (at !== want) this._rail.insertBefore(want, at || null);
        t.i = i;
        t.num.textContent = String(i + 1);
        if (t.slide.hasAttribute('data-deck-skip')) t.thumb.setAttribute('data-skip', '');else t.thumb.removeAttribute('data-skip');
      });
      this._thumbs = next;
      this._rail.scrollTop = st;
      if (prevTops.size) {
        const moved = [];
        this._thumbs.forEach(({
          thumb,
          slide
        }) => {
          const old = prevTops.get(slide);
          if (old == null) return;
          const dy = old - thumb.getBoundingClientRect().top;
          if (Math.abs(dy) < 1) return;
          thumb.style.transition = 'none';
          thumb.style.transform = `translateY(${dy}px)`;
          moved.push(thumb);
        });
        if (moved.length) {
          // Commit the inverted positions before flipping the transition
          // on — otherwise the browser coalesces both style writes and
          // nothing animates.
          void this._rail.offsetHeight;
          moved.forEach(t => {
            t.style.transition = 'transform 180ms cubic-bezier(.2,.7,.3,1)';
            t.style.transform = '';
          });
          setTimeout(() => moved.forEach(t => {
            t.style.transition = '';
          }), 220);
        }
      }
      requestAnimationFrame(() => this._scaleThumbs());
      this._syncRail(false);
    }

    /** Create a lightweight thumb shell for one slide. The clone is
     *  materialized later by the IntersectionObserver. Event handlers
     *  look up the thumb's *current* index (via _thumbs.indexOf) so the
     *  same element can be reused across reorders. */
    _makeThumb(slide) {
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      thumb.tabIndex = 0;
      const num = document.createElement('div');
      num.className = 'num';
      const frame = document.createElement('div');
      frame.className = 'frame';
      thumb.append(num, frame);
      const entry = {
        thumb,
        num,
        frame,
        slide,
        clone: null,
        host: null,
        i: -1
      };
      // entry.i is refreshed on every _renderRail reconcile pass, so
      // handlers read the thumb's current position without an O(N) scan.
      const idx = () => entry.i;
      thumb.addEventListener('click', () => this._go(idx(), 'click'));
      // ↑/↓ step through the rail when a thumb has focus. _go clamps at the
      // ends and _applyIndex→_syncRail scrolls the new current thumb into
      // view; we move focus to it (preventScroll — _syncRail already
      // scrolled) so a held key walks the whole list. stopPropagation keeps
      // this out of the window-level _onKey nav handler.
      thumb.addEventListener('keydown', e => {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        e.preventDefault();
        e.stopPropagation();
        this._go(idx() + (e.key === 'ArrowDown' ? 1 : -1), 'keyboard');
        const cur = this._thumbs && this._thumbs[this._index];
        if (cur) cur.thumb.focus({
          preventScroll: true
        });
      });
      thumb.addEventListener('contextmenu', e => {
        e.preventDefault();
        this._openMenu(idx(), e.clientX, e.clientY);
      });
      thumb.draggable = true;
      thumb.addEventListener('dragstart', e => {
        this._dragFrom = idx();
        thumb.setAttribute('data-dragging', '');
        e.dataTransfer.effectAllowed = 'move';
        try {
          e.dataTransfer.setData('text/plain', String(this._dragFrom));
        } catch (err) {}
      });
      thumb.addEventListener('dragend', () => {
        thumb.removeAttribute('data-dragging');
        this._clearDrop();
        this._dragFrom = null;
      });
      thumb.addEventListener('dragover', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const r = thumb.getBoundingClientRect();
        this._setDrop(idx(), e.clientY < r.top + r.height / 2 ? 'before' : 'after');
      });
      thumb.addEventListener('drop', e => {
        if (this._dragFrom == null) return;
        e.preventDefault();
        const i = idx();
        const r = thumb.getBoundingClientRect();
        let to = e.clientY >= r.top + r.height / 2 ? i + 1 : i;
        if (this._dragFrom < to) to--;
        const from = this._dragFrom;
        this._clearDrop();
        this._dragFrom = null;
        if (to !== from) this._moveSlide(from, to);
      });
      if (this._railObserver) this._railObserver.observe(frame);
      frame.__deckThumb = entry;
      return entry;
    }

    /** Lazily build the clone for a thumb that has scrolled into view. */
    _materialize(entry) {
      if (entry.host) return;
      const dw = this.designWidth,
        dh = this.designHeight;
      let clone = entry.slide.cloneNode(true);
      clone.removeAttribute('id');
      clone.removeAttribute('data-deck-active');
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      // Neuter heavy media; replace <video> with its poster so the box
      // keeps a visual. <iframe>/<audio> become empty placeholders.
      clone.querySelectorAll('iframe, audio, object, embed').forEach(el => {
        el.removeAttribute('src');
        el.removeAttribute('srcdoc');
        el.removeAttribute('data');
        el.innerHTML = '';
      });
      clone.querySelectorAll('video').forEach(el => {
        if (!el.poster) {
          el.removeAttribute('src');
          el.innerHTML = '';
          return;
        }
        const img = document.createElement('img');
        img.src = el.poster;
        img.alt = '';
        img.style.cssText = el.style.cssText + ';object-fit:cover;width:100%;height:100%;';
        img.className = el.className;
        el.replaceWith(img);
      });
      // Images: defer decode and let the browser pick the smallest
      // srcset candidate for the ~140px thumb. Same-URL clones reuse the
      // slide's decoded bitmap (URL-keyed cache), so the remaining cost
      // is paint/composite — lazy+async keeps that off the main thread.
      clone.querySelectorAll('img').forEach(el => {
        el.loading = 'lazy';
        el.decoding = 'async';
        if (el.srcset) el.sizes = (this._railPx || 188) + 'px';
      });
      // Custom elements inside the slide would have their
      // connectedCallback fire when the clone is appended. Replace them
      // with inert boxes so a component-heavy deck doesn't run N copies
      // of each component's mount logic in the rail. Children are
      // preserved so layout-wrapper elements (<my-column><h2>…</h2>)
      // still show their authored content; the querySelectorAll NodeList
      // is static, so nested custom elements in the moved subtree are
      // still visited on later iterations.
      const neuter = el => {
        const box = document.createElement('div');
        box.style.cssText = (el.getAttribute('style') || '') + ';background:rgba(0,0,0,0.06);border:1px dashed rgba(0,0,0,0.15);';
        box.className = el.className;
        // Preserve theming/i18n hooks so [data-*] / :lang() / [dir]
        // descendant selectors still match the neutered root.
        for (const a of el.attributes) {
          const n = a.name;
          if (n.startsWith('data-') || n.startsWith('aria-') || n === 'lang' || n === 'dir' || n === 'role' || n === 'title') {
            box.setAttribute(n, a.value);
          }
        }
        while (el.firstChild) box.appendChild(el.firstChild);
        return box;
      };
      // querySelectorAll('*') returns descendants only — a custom-element
      // slide root (<my-slide>…</my-slide>) would slip through and upgrade
      // on append. Swap the root first.
      if (clone.tagName.includes('-')) clone = neuter(clone);
      clone.querySelectorAll('*').forEach(el => {
        if (el.tagName.includes('-')) el.replaceWith(neuter(el));
      });
      clone.style.cssText += ';position:absolute;top:0;left:0;transform-origin:0 0;' + 'pointer-events:none;width:' + dw + 'px;height:' + dh + 'px;' + 'box-sizing:border-box;overflow:hidden;visibility:visible;opacity:1;';
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute;inset:0;';
      this._syncThumbHostAttrs(host);
      const sr = host.attachShadow({
        mode: 'open'
      });
      if (this._adoptedSheet) sr.adoptedStyleSheets = [this._adoptedSheet];else {
        const st = document.createElement('style');
        st.textContent = this._authorCss || '';
        sr.appendChild(st);
      }
      sr.appendChild(clone);
      entry.frame.appendChild(host);
      entry.host = host;
      entry.clone = clone;
      if (this._thumbScale) clone.style.transform = 'scale(' + this._thumbScale + ')';
      // Once materialized the IO callback is a no-op early-return —
      // unobserve so scroll doesn't keep firing it.
      if (this._railObserver) this._railObserver.unobserve(entry.frame);
    }

    /** Re-clone a single thumb (live-update path). No-op if the thumb
     *  hasn't been materialized yet — it'll pick up current content when
     *  it scrolls into view. */
    _refreshThumb(slide) {
      const entry = (this._thumbs || []).find(t => t.slide === slide);
      if (!entry || !entry.host) return;
      entry.host.remove();
      entry.host = entry.clone = null;
      this._materialize(entry);
    }
    _scaleThumbs() {
      if (!this._thumbs || !this._thumbs.length) return;
      // Every frame is the same width; if it reads 0 the rail is
      // display:none (noscale / no-rail / presenting / print) — leave the
      // clones as-is and re-run when the rail is revealed.
      const fw = this._thumbs[0].frame.offsetWidth;
      if (!fw) return;
      this._thumbScale = fw / this.designWidth;
      this._thumbs.forEach(({
        clone
      }) => {
        if (clone) clone.style.transform = 'scale(' + this._thumbScale + ')';
      });
    }
    _setDrop(i, where) {
      // dragover fires at pointer-event rate; touch only the previous
      // and new target rather than sweeping all N thumbs.
      const t = this._thumbs && this._thumbs[i];
      if (this._dropOn && this._dropOn !== t) {
        this._dropOn.thumb.removeAttribute('data-drop');
      }
      if (t) t.thumb.setAttribute('data-drop', where);
      this._dropOn = t || null;
    }
    _clearDrop() {
      if (this._dropOn) this._dropOn.thumb.removeAttribute('data-drop');
      this._dropOn = null;
    }
    _syncRail(follow) {
      if (!this._thumbs) return;
      this._thumbs.forEach(({
        thumb
      }, i) => {
        if (i === this._index) {
          thumb.setAttribute('data-current', '');
          if (follow && typeof thumb.scrollIntoView === 'function') {
            thumb.scrollIntoView({
              block: 'nearest'
            });
          }
        } else {
          thumb.removeAttribute('data-current');
        }
      });
    }
    _openMenu(i, x, y) {
      if (!this._menu) return;
      this._menuIndex = i;
      const slide = this._slides[i];
      const skip = slide && slide.hasAttribute('data-deck-skip');
      this._menu.querySelector('[data-act="skip"]').textContent = skip ? 'Unskip slide' : 'Skip slide';
      this._menu.querySelector('[data-act="up"]').disabled = i <= 0;
      this._menu.querySelector('[data-act="down"]').disabled = i >= this._slides.length - 1;
      this._menu.querySelector('[data-act="delete"]').disabled = this._slides.length <= 1;
      // Place, then clamp to viewport after it's measurable.
      this._menu.style.left = x + 'px';
      this._menu.style.top = y + 'px';
      this._menu.setAttribute('data-open', '');
      const r = this._menu.getBoundingClientRect();
      const nx = Math.min(x, window.innerWidth - r.width - 4);
      const ny = Math.min(y, window.innerHeight - r.height - 4);
      this._menu.style.left = Math.max(4, nx) + 'px';
      this._menu.style.top = Math.max(4, ny) + 'px';
    }
    _closeMenu() {
      if (this._menu) this._menu.removeAttribute('data-open');
      this._menuIndex = -1;
    }
    _openConfirm(i) {
      if (!this._confirm) return;
      this._confirmIndex = i;
      this._confirm.querySelector('.title').textContent = 'Delete slide ' + (i + 1) + '?';
      this._confirm.setAttribute('data-open', '');
      const btn = this._confirm.querySelector('.danger');
      if (btn && btn.focus) btn.focus();
    }
    _closeConfirm() {
      if (this._confirm) this._confirm.removeAttribute('data-open');
      this._confirmIndex = -1;
    }
    _emitDeckChange(detail) {
      this.dispatchEvent(new CustomEvent('deckchange', {
        detail,
        bubbles: true,
        composed: true
      }));
    }
    _deleteSlide(i) {
      const slide = this._slides[i];
      if (!slide || this._slides.length <= 1) return;
      const wasCurrent = i === this._index;
      if (i < this._index || wasCurrent && i === this._slides.length - 1) this._index--;
      this._squelchSlotChange = true;
      slide.remove();
      this._emitDeckChange({
        action: 'delete',
        from: i,
        slide
      });
      this._collectSlides();
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason: 'mutation'
      });
    }
    _toggleSkip(i) {
      const slide = this._slides[i];
      if (!slide) return;
      const on = !slide.hasAttribute('data-deck-skip');
      if (on) slide.setAttribute('data-deck-skip', '');else slide.removeAttribute('data-deck-skip');
      if (this._thumbs && this._thumbs[i]) {
        if (on) this._thumbs[i].thumb.setAttribute('data-skip', '');else this._thumbs[i].thumb.removeAttribute('data-skip');
      }
      this._markLastVisible();
      this._emitDeckChange({
        action: on ? 'skip' : 'unskip',
        from: i,
        slide
      });
      // Re-broadcast so the presenter popup's prev/next thumbnails re-pick
      // the nearest non-skipped slide without waiting for a nav event.
      try {
        window.postMessage({
          slideIndexChanged: this._index,
          deckTotal: this._slides.length,
          deckSkipped: this._skippedIndices()
        }, '*');
      } catch (e) {}
    }
    _skippedIndices() {
      const out = [];
      for (let i = 0; i < this._slides.length; i++) {
        if (this._slides[i].hasAttribute('data-deck-skip')) out.push(i);
      }
      return out;
    }
    _moveSlide(i, j) {
      if (j < 0 || j >= this._slides.length || j === i) return;
      const slide = this._slides[i];
      const ref = j < i ? this._slides[j] : this._slides[j].nextSibling;
      // Track the active slide across the reorder so the same content
      // stays on screen.
      const cur = this._index;
      if (cur === i) this._index = j;else if (i < cur && j >= cur) this._index = cur - 1;else if (i > cur && j <= cur) this._index = cur + 1;
      this._squelchSlotChange = true;
      this.insertBefore(slide, ref);
      this._emitDeckChange({
        action: 'move',
        from: i,
        to: j,
        slide
      });
      this._collectSlides();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'mutation'
      });
    }

    // Public API ------------------------------------------------------------

    /** Current slide index (0-based). */
    get index() {
      return this._index;
    }
    /** Total slide count. */
    get length() {
      return this._slides.length;
    }
    /** Programmatically navigate. */
    goTo(i) {
      this._go(i, 'api');
    }
    next() {
      this._advance(1, 'api');
    }
    prev() {
      this._advance(-1, 'api');
    }
    reset() {
      this._go(0, 'api');
    }
  }
  if (!customElements.get('deck-stage')) {
    customElements.define('deck-stage', DeckStage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/deck-stage.js", error: String((e && e.message) || e) }); }

// ui_kits/website/CaseStudyTable.jsx
try { (() => {
window.QCaseStudyTable = function QCaseStudyTable({
  bare
}) {
  const lang = useLang();
  const [hover, setHover] = useState(null);
  const COPY = {
    en: {
      eyebrow: 'Selected work',
      head: ['Engagement', 'What it taught us', 'Tags'],
      cta: 'See all selected work',
      rows: [['Telco brand positioning', 'Brand and narrative consistency from inside a major telecommunications operator', ['Telecom', 'Partner coordination']], ['Regulation as narrative', 'Public authority around right-to-repair and EU sustainability legislation', ['Regulatory', 'EU Tech']], ['Contact-centre at scale', 'Corporate narrative and service communications for a global contact-centre operator', ['B2B', 'Operational scale']], ['Reputation in high-noise markets', 'Communications across APAC, EMEA and LATAM in a category where trust is fragile by default', ['Sports Tech', 'International']], ['Critical infrastructure', 'Expert positioning for a complex international technology account in critical infrastructure', ['B2B Tech', 'Cross-Atlantic']], ['Localising a US-born brand', 'Brand positioning and visibility for European expansion — adapting US narrative for local audiences', ['Education', 'Market Entry']]]
    },
    es: {
      eyebrow: 'Trabajo seleccionado',
      head: ['Proyecto', 'Qué nos enseñó', 'Etiquetas'],
      cta: 'Ver todo el trabajo seleccionado',
      rows: [['Posicionamiento de marca telco', 'Coherencia de marca y narrativa desde dentro de un gran operador de telecomunicaciones', ['Telecom', 'Coordinación de partners']], ['La regulación como narrativa', 'Autoridad pública en torno al derecho a reparar y la legislación de sostenibilidad de la UE', ['Regulación', 'EU Tech']], ['Contact center a escala', 'Narrativa corporativa y comunicación de servicio para un operador global de contact centers', ['B2B', 'Escala operativa']], ['Reputación en mercados de mucho ruido', 'Comunicación en APAC, EMEA y LATAM en una categoría donde la confianza es frágil por defecto', ['Sports Tech', 'Internacional']], ['Infraestructura crítica', 'Posicionamiento experto para una cuenta tecnológica internacional compleja en infraestructura crítica', ['B2B Tech', 'Transatlántico']], ['Localizar una marca nacida en EE. UU.', 'Posicionamiento de marca y visibilidad para la expansión europea — adaptando la narrativa estadounidense a audiencias locales', ['Educación', 'Entrada a mercado']]]
    }
  };
  const t = COPY[lang];
  const heading = lang === 'es' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Cada proyecto es una ", /*#__PURE__*/React.createElement("em", null, "lecci\xF3n transferible"), ".") : /*#__PURE__*/React.createElement(React.Fragment, null, "Each engagement is a ", /*#__PURE__*/React.createElement("em", null, "transferable lesson"), ".");
  return /*#__PURE__*/React.createElement("section", {
    className: "q-section",
    id: "work"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, !bare && /*#__PURE__*/React.createElement("div", {
    className: "q-section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, t.eyebrow)), /*#__PURE__*/React.createElement("h2", null, heading)), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--rule-strong)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-work-head",
    style: {
      padding: '18px 0',
      borderBottom: '1px solid var(--rule-strong)',
      fontFamily: 'var(--font-title)',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--fg-3)'
    }
  }, /*#__PURE__*/React.createElement("div", null, t.head[0]), /*#__PURE__*/React.createElement("div", null, t.head[1]), /*#__PURE__*/React.createElement("div", null, t.head[2])), t.rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "q-work-row",
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(null),
    style: {
      padding: '32px 0',
      alignItems: 'baseline',
      borderBottom: '1px solid var(--rule)',
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(0.22,0.61,0.36,1)',
      background: hover === i ? 'rgba(190,186,204,0.03)' : 'transparent',
      paddingLeft: hover === i ? '16px' : '0',
      marginLeft: hover === i ? '-16px' : '0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-title)',
      fontSize: '20px',
      lineHeight: 1.25,
      color: hover === i ? 'var(--seal)' : 'var(--fg-1)',
      letterSpacing: '-0.015em',
      fontWeight: 600
    }
  }, r[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '15px',
      lineHeight: 1.55,
      color: 'var(--fg-2)'
    }
  }, r[1]), /*#__PURE__*/React.createElement("div", {
    className: "q-work-tags",
    style: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap'
    }
  }, r[2].map(tag => /*#__PURE__*/React.createElement("span", {
    key: tag,
    className: "q-tag"
  }, tag)))))), !bare && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '48px',
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "q-btn secondary",
    href: "work.html"
  }, t.cta, " ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/CaseStudyTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ContactBlock.jsx
try { (() => {
window.QContactBlock = function QContactBlock() {
  const lang = useLang();
  const COPY = {
    en: {
      eyebrow: 'Contact',
      h: "Let’s talk.",
      lede: 'If you are navigating a moment where perception, reputation, or narrative requires strategic attention — we would like to hear about it.',
      link: 'Get in touch'
    },
    es: {
      eyebrow: 'Contacto',
      h: 'Hablemos.',
      lede: 'Si estás atravesando un momento en el que la percepción, la reputación o la narrativa requieren atención estratégica, nos gustaría ayudarte.',
      link: 'Ponte en contacto'
    }
  };
  const t = COPY[lang];
  return /*#__PURE__*/React.createElement("section", {
    className: "q-section",
    id: "contact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-contact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-contact-eyebrow"
  }, t.eyebrow), /*#__PURE__*/React.createElement("div", {
    className: "q-contact-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-contact-lead"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "q-contact-h"
  }, t.h), /*#__PURE__*/React.createElement("p", {
    className: "q-contact-lede"
  }, t.lede)), /*#__PURE__*/React.createElement("div", {
    className: "q-contact-actions"
  }, /*#__PURE__*/React.createElement("a", {
    className: "q-contact-link",
    href: "mailto:hola@quimeragency.com"
  }, t.link, " ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")), /*#__PURE__*/React.createElement("a", {
    className: "q-contact-email",
    href: "mailto:hola@quimeragency.com"
  }, "hola@quimeragency.com"))))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ContactBlock.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
window.QFooter = function QFooter() {
  const lang = useLang();
  const COPY = {
    en: {
      tagline: '"Visibility is not the objective. Gravity is."',
      arch: 'Architecture',
      archItems: ['Define — Narrative & positioning', 'Activate — Media & strategic presence', 'Sustain — Reputation advisory'],
      agency: 'The Agency',
      agencyItems: ['Welcome', 'Selected work', 'Perspective', 'Contact'],
      contact: 'Contact',
      appt: 'By appointment',
      legal: ['Imprint', 'Privacy', 'Confidentiality']
    },
    es: {
      tagline: '"La visibilidad no es el objetivo. La influencia sí."',
      arch: 'Arquitectura',
      archItems: ['Definir — Narrativa y posicionamiento', 'Activar — Medios y presencia estratégica', 'Sostener — Asesoría de reputación'],
      agency: 'La Agencia',
      agencyItems: ['Bienvenida', 'Trabajo seleccionado', 'Perspectiva', 'Contacto'],
      contact: 'Contacto',
      appt: 'Con cita previa',
      legal: ['Aviso legal', 'Privacidad', 'Confidencialidad']
    }
  };
  const t = COPY[lang];
  const archHrefs = ['services.html', 'services.html', 'services.html'];
  // Agency links paired with hrefs + optional feature flag, then filtered.
  const agencyHrefs = ['index.html#manifesto', 'work.html', 'perspective.html', 'index.html#contact'];
  const agencyFlags = [null, null, 'perspective', null];
  const agencyLinks = t.agencyItems.map((label, i) => ({
    label,
    href: agencyHrefs[i],
    flag: agencyFlags[i]
  })).filter(l => !l.flag || window.QFlags && window.QFlags[l.flag]);
  return /*#__PURE__*/React.createElement("footer", {
    className: "q-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "q-lockup",
    style: {
      marginBottom: '24px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/quimera-mark-bebacc.svg",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", null, "Quimera Agency")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '17px',
      lineHeight: 1.6,
      color: 'var(--fg-1)',
      maxWidth: '420px',
      fontWeight: 400
    }
  }, t.tagline)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, t.arch), /*#__PURE__*/React.createElement("ul", null, t.archItems.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("a", {
    href: archHrefs[i]
  }, it))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, t.agency), /*#__PURE__*/React.createElement("ul", null, agencyLinks.map((l, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("a", {
    href: l.href
  }, l.label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, t.contact), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "mailto:hola@quimeragency.com"
  }, "hola@quimeragency.com")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "LinkedIn"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '14px',
      lineHeight: 1.7,
      color: 'var(--fg-2)',
      marginTop: '16px'
    }
  }, "Madrid \xB7 Espa\xF1a", /*#__PURE__*/React.createElement("br", null), t.appt))), /*#__PURE__*/React.createElement("div", {
    className: "colophon"
  }, /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Quimera Agency, S.L."), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, "Madrid \xB7 Espa\xF1a")), /*#__PURE__*/React.createElement("div", {
    className: "r"
  }, t.legal.map((it, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#"
  }, it))))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
const {
  useState,
  useEffect
} = React;

/* Shared site header.
   page: 'home' | 'services' | 'work' | 'perspective'
   - The active dot reflects the current PAGE and only moves on click/navigation.
   - EN/ES toggle switches language site-wide (persisted) via window.QLang.
   - On a sub-page, Services/Work/Perspective navigate between pages; the
     current page is marked active; Welcome/Contact jump back to home sections. */
window.QHeader = function QHeader({
  page = 'home'
}) {
  const lang = useLang();
  const items = [{
    key: 'manifesto',
    en: 'Welcome',
    es: 'Home',
    kind: 'anchor'
  }, {
    key: 'services',
    en: 'Services',
    es: 'Servicios',
    kind: 'page',
    href: 'services.html'
  }, {
    key: 'work',
    en: 'Work',
    es: 'Trabajo',
    kind: 'page',
    href: 'work.html'
  }, {
    key: 'perspective',
    en: 'Perspective',
    es: 'Perspectiva',
    kind: 'page',
    href: 'perspective.html',
    flag: 'perspective'
  }, {
    key: 'contact',
    en: 'Contact',
    es: 'Contacto',
    kind: 'anchor'
  }].filter(it => !it.flag || window.QFlags && window.QFlags[it.flag]);
  const isHome = page === 'home';
  const hrefFor = it => {
    if (it.kind === 'page') return it.href;
    return isHome ? `#${it.key}` : `index.html#${it.key}`;
  };
  const [active, setActive] = useState(isHome ? 'manifesto' : page);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    document.body.classList.toggle('q-noscroll', menuOpen);
    return () => document.body.classList.remove('q-noscroll');
  }, [menuOpen]);

  // Close the overlay on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = e => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);
  const setLang = l => e => {
    e.preventDefault();
    window.QLang.set(l);
  };
  const homeHref = isHome ? '#' : 'index.html';
  return /*#__PURE__*/React.createElement("header", {
    className: "q-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inner"
  }, /*#__PURE__*/React.createElement("a", {
    href: homeHref,
    className: "q-lockup"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/quimera-mark-bebacc.svg",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", null, "Quimera Agency")), /*#__PURE__*/React.createElement("nav", {
    className: "q-nav"
  }, items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.key,
    href: hrefFor(it),
    onClick: () => {
      if (it.kind === 'anchor') setActive(it.key);
    },
    className: (it.key === active ? 'active' : '') + (it.key === 'contact' ? ' is-contact' : '')
  }, it[lang]))), /*#__PURE__*/React.createElement("div", {
    className: "q-locale"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: setLang('en'),
    className: lang === 'en' ? 'active' : ''
  }, "EN"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: setLang('es'),
    className: lang === 'es' ? 'active' : ''
  }, "ES")), /*#__PURE__*/React.createElement("button", {
    className: "q-burger",
    "aria-label": menuOpen ? lang === 'es' ? 'Cerrar menú' : 'Close menu' : lang === 'es' ? 'Abrir menú' : 'Open menu',
    "aria-expanded": menuOpen,
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))), /*#__PURE__*/React.createElement("div", {
    className: `q-mobile-menu${menuOpen ? ' open' : ''}`
  }, items.map((it, i) => /*#__PURE__*/React.createElement("a", {
    key: it.key,
    href: hrefFor(it),
    className: it.key === active ? 'active' : '',
    onClick: () => {
      if (it.kind === 'anchor') setActive(it.key);
      setMenuOpen(false);
    }
  }, it[lang], /*#__PURE__*/React.createElement("span", {
    className: "idx"
  }, String(i + 1).padStart(2, '0')))), /*#__PURE__*/React.createElement("div", {
    className: "q-mm-foot"
  }, /*#__PURE__*/React.createElement("span", null, "Madrid \xB7 Espa\xF1a"), /*#__PURE__*/React.createElement("span", {
    className: "locale"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: setLang('en'),
    className: lang === 'en' ? 'active' : ''
  }, "EN"), " / ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: setLang('es'),
    className: lang === 'es' ? 'active' : ''
  }, "ES")))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
window.QHero = function QHero() {
  const lang = useLang();
  const COPY = {
    en: {
      kicker: 'Strategic communications · Reputation · Market entry',
      lead: 'Most firms reduce complexity into something flatter, simpler and easier to market. We help organisations stay strategically legible without losing the depth that makes them differentiated in the first place.',
      cta1: 'Request a conversation',
      cta2: 'Our services',
      founded: 'Founded 2019',
      appt: 'By appointment'
    },
    es: {
      kicker: 'Comunicación estratégica · Reputación · Entrada a mercado',
      lead: 'La mayoría de las firmas simplifican la complejidad hasta volverla más fácil de comunicar. Nosotros ayudamos a las organizaciones a seguir siendo estratégicamente claras sin perder la profundidad que las diferencia en primer lugar.',
      cta1: 'Solicita una conversación',
      cta2: 'Nuestros servicios',
      founded: 'Fundada en 2019',
      appt: 'Con cita previa'
    }
  };
  const t = COPY[lang];
  const headline = lang === 'es' ? /*#__PURE__*/React.createElement(React.Fragment, null, "La diferencia entre ser ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 500
    }
  }, "visto"), " y ser ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 500
    }
  }, "entendido"), ".") : /*#__PURE__*/React.createElement(React.Fragment, null, "The difference between being ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 500
    }
  }, "seen"), " and being ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 500
    }
  }, "understood"), ".");
  return /*#__PURE__*/React.createElement("section", {
    className: "q-section loose q-imghost q-hero",
    style: {
      paddingTop: '152px',
      paddingBottom: '64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-hero-art",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-hero-art-inner q-hero-art-face"
  }, /*#__PURE__*/React.createElement("img", {
    className: "q-hero-img",
    "data-parallax": "26",
    src: "assets/imagery/face-blocks.png",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "q-hero-art-inner q-hero-art-texture"
  }, /*#__PURE__*/React.createElement("img", {
    className: "q-hero-img",
    "data-parallax": "16",
    src: "assets/imagery/slab.png",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "q-hero-veil"
  })), /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-title)',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--fg-3)',
      marginBottom: '40px'
    }
  }, t.kicker), /*#__PURE__*/React.createElement("h1", {
    className: "q-hero-h1",
    style: {
      fontFamily: 'var(--font-title)',
      lineHeight: 1.0,
      letterSpacing: '-0.035em',
      fontWeight: 700,
      textWrap: 'balance',
      margin: 0,
      maxWidth: '20ch',
      textShadow: '0 2px 50px rgba(8,7,11,0.55)'
    }
  }, headline), /*#__PURE__*/React.createElement("div", {
    className: "q-hero-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-hero-foot-l"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '18px',
      lineHeight: 1.6,
      color: 'var(--fg-2)',
      fontWeight: 400,
      margin: 0,
      maxWidth: '52ch'
    }
  }, t.lead), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '36px',
      display: 'flex',
      gap: '14px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "q-btn primary",
    href: "#contact"
  }, t.cta1, " ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")), /*#__PURE__*/React.createElement("a", {
    className: "q-btn secondary",
    href: "#services"
  }, t.cta2)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '72px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-coord-ribbon"
  }, /*#__PURE__*/React.createElement("div", {
    className: "left"
  }, /*#__PURE__*/React.createElement("span", null, "Madrid \xB7 Espa\xF1a"), /*#__PURE__*/React.createElement("span", null, t.founded), /*#__PURE__*/React.createElement("span", null, t.appt)), /*#__PURE__*/React.createElement("div", {
    className: "right"
  }, /*#__PURE__*/React.createElement("span", null, "40.4168 N \xB7 03.7038 W"))))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/LangHook.jsx
try { (() => {
/* React hook bound to the QLang store. Any component that calls
   useLang() re-renders when the language changes. */
window.useLang = function useLang() {
  const [lang, setLang] = React.useState(window.QLang ? window.QLang.get() : 'en');
  React.useEffect(function () {
    if (!window.QLang) return;
    return window.QLang.sub(setLang);
  }, []);
  return lang;
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/LangHook.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Manifesto.jsx
try { (() => {
window.QManifesto = function QManifesto() {
  const lang = useLang();
  const COPY = {
    en: {
      lines: [['On interpretation', 'There are agencies that optimize for attention. We are interested in gravity. Most can generate visibility around a company. We can do that too. But far fewer can shape the conditions under which that company becomes relevant.'], ['On signals', "A company's language. The pacing of an announcement. The media you refuse. The people willing to defend your company when you are absent. These are not surface decisions. They are signals, and signals accumulate into perception long before they become conscious analysis."], ['On neutrality', 'Every company already communicates a worldview. Through hiring, through design, through capital allocation, through what gets protected when pressure arrives. The question is not whether meaning exists. The question is whether it is intentional.']],
      chimera: 'The mythological chimera was difficult to kill because it was never built from a single logic. Neither are the strategic implementations that endure.',
      why: '— Why Quimera'
    },
    es: {
      lines: [['Sobre la interpretación', 'Hay agencias que optimizan para la atención. A nosotros nos interesa el peso estratégico. Muchos pueden generar visibilidad alrededor de una empresa. Nosotros también. Pero muy pocos saben construir las condiciones bajo las que una empresa adquiere relevancia, legitimidad y capacidad de influencia.'], ['Sobre las señales', 'El lenguaje de una empresa. El ritmo de un comunicado. Los medios que decide rechazar. Las personas dispuestas a defenderla cuando sus líderes no están presentes. Nada de eso es superficial. Son señales, y las señales moldean la percepción mucho antes de convertirse en análisis consciente.'], ['Sobre la neutralidad', 'Todas las empresas ya comunican una forma de entender el mundo. Lo hacen a través de a quién contratan, de cómo diseñan, de cómo asignan capital y de lo que deciden proteger cuando aparece la presión. La cuestión no es si existe una narrativa. La cuestión es si esa narrativa es intencional.']],
      chimera: 'La quimera era un ser mitológico difícil de destruir porque nunca obedecía a una única lógica. Las estructuras estratégicas que logran perdurar se construyen igual.',
      why: '— Por qué Quimera'
    }
  };
  const t = COPY[lang];
  const heading = lang === 'es' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Hecha para ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 500
    }
  }, "sostener la complejidad"), " sin colapsarla.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Built to ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 500
    }
  }, "hold complexity"), " without collapsing it.");
  return /*#__PURE__*/React.createElement("section", {
    className: "q-section paper q-imghost",
    id: "manifesto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-fraglayer q-hide-mobile",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-reveal",
    style: {
      position: 'absolute',
      right: '2%',
      top: '5%',
      width: '720px',
      height: '980px',
      overflow: 'hidden',
      WebkitMaskImage: 'radial-gradient(72% 80% at 50% 42%, #000 34%, rgba(0,0,0,0.5) 60%, transparent 84%)',
      maskImage: 'radial-gradient(72% 80% at 50% 42%, #000 34%, rgba(0,0,0,0.5) 60%, transparent 84%)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/imagery/temple.png",
    "data-parallax": "20",
    style: {
      position: 'absolute',
      width: '100%',
      maxWidth: 'none',
      left: '0',
      top: '0',
      opacity: 0.8
    },
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "q-veil paper-l"
  })), /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-section-header",
    style: {
      gridTemplateColumns: '1fr',
      gap: '24px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "q-manifesto-h2",
    style: {
      lineHeight: 1.12,
      letterSpacing: '-0.02em',
      maxWidth: '760px'
    }
  }, heading)), /*#__PURE__*/React.createElement("div", {
    className: "q-manifesto-grid"
  }, t.lines.map(([label, body]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
      margin: '-20px',
      borderRadius: '4px',
      background: 'rgba(244,241,234,0.22)',
      WebkitBackdropFilter: 'blur(2px)',
      backdropFilter: 'blur(2px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--on-bone-3)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-editorial)',
      fontSize: '31px',
      lineHeight: 1.2,
      letterSpacing: '0',
      fontWeight: 500,
      color: 'var(--on-bone-1)'
    }
  }, body.split('. ')[0], "."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '15px',
      lineHeight: 1.65,
      color: 'var(--on-bone-2)'
    }
  }, body.split('. ').slice(1).join('. '))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '96px',
      paddingTop: '48px',
      borderTop: '1px solid var(--rule-paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-editorial)',
      fontSize: '40px',
      lineHeight: 1.24,
      fontStyle: 'italic',
      letterSpacing: '0',
      fontWeight: 500,
      color: 'var(--on-bone-1)',
      maxWidth: '820px'
    }
  }, t.chimera), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '28px',
      fontFamily: 'var(--font-body)',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--on-bone-3)'
    }
  }, t.why))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Manifesto.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/PerspectivePage.jsx
try { (() => {
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
      paras: ['Most communication failures are not failures of content. The message was accurate. The positioning was sound. The wording had been argued over for weeks. It simply arrived when no one was able to receive it — too early to be understood, or too late to matter.', 'Markets, regulators and press do not assess information in a vacuum. They assess it against what else is happening, what they already believe, and how much attention they have to spare. The same sentence can read as leadership in March and as defensiveness in May.'],
      bylinePaper: 'Quimera — Working paper',
      indexEyebrow: 'Index',
      papersLabel: 'papers',
      readLabel: 'read',
      specimenTheme: 'The Mark',
      themes: [{
        theme: 'On Timing',
        articles: [{
          date: '04 / 26',
          title: 'The right message at the wrong moment is still the wrong message.',
          read: '6 min'
        }, {
          date: '01 / 26',
          title: 'Why the best announcement is often the one you delay.',
          read: '5 min'
        }, {
          date: '11 / 25',
          title: 'Momentum is not a strategy. It is a window.',
          read: '4 min'
        }]
      }, {
        theme: 'On Silence',
        articles: [{
          date: '03 / 26',
          title: 'What a company chooses not to say is also a position.',
          read: '5 min'
        }, {
          date: '12 / 25',
          title: 'The discipline of declining to comment.',
          read: '6 min'
        }, {
          date: '09 / 25',
          title: 'Restraint reads as confidence. Noise reads as need.',
          read: '4 min'
        }]
      }, {
        theme: 'On Scrutiny',
        articles: [{
          date: '02 / 26',
          title: 'Reputation is tested in the moments you did not plan for.',
          read: '7 min'
        }, {
          date: '10 / 25',
          title: 'Preparing for the question you hope never comes.',
          read: '6 min'
        }, {
          date: '08 / 25',
          title: 'Trust compounds quietly and collapses loudly.',
          read: '5 min'
        }]
      }]
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
      paras: ['La mayoría de los fallos de comunicación no son fallos de contenido. El mensaje era preciso. El posicionamiento era sólido. La redacción se había discutido durante semanas. Simplemente llegó cuando nadie podía recibirlo: demasiado pronto para entenderlo, o demasiado tarde para que importara.', 'Los mercados, los reguladores y la prensa no evalúan la información en el vacío. La evalúan frente a lo que está pasando, frente a lo que ya creen y frente a la atención de la que disponen. La misma frase puede leerse como liderazgo en marzo y como defensa en mayo.'],
      bylinePaper: 'Quimera — Documento de trabajo',
      indexEyebrow: 'Índice',
      papersLabel: 'documentos',
      readLabel: 'de lectura',
      specimenTheme: 'La Marca',
      themes: [{
        theme: 'Sobre el momento',
        articles: [{
          date: '04 / 26',
          title: 'El mensaje correcto en el momento equivocado sigue siendo el mensaje equivocado.',
          read: '6 min'
        }, {
          date: '01 / 26',
          title: 'Por qué el mejor anuncio suele ser el que aplazas.',
          read: '5 min'
        }, {
          date: '11 / 25',
          title: 'El impulso no es una estrategia. Es una ventana.',
          read: '4 min'
        }]
      }, {
        theme: 'Sobre el silencio',
        articles: [{
          date: '03 / 26',
          title: 'Lo que una empresa elige no decir también es una posición.',
          read: '5 min'
        }, {
          date: '12 / 25',
          title: 'La disciplina de declinar un comentario.',
          read: '6 min'
        }, {
          date: '09 / 25',
          title: 'La contención se lee como confianza. El ruido se lee como necesidad.',
          read: '4 min'
        }]
      }, {
        theme: 'Sobre el escrutinio',
        articles: [{
          date: '02 / 26',
          title: 'La reputación se pone a prueba en los momentos que no planeaste.',
          read: '7 min'
        }, {
          date: '10 / 25',
          title: 'Prepararte para la pregunta que esperas que nunca llegue.',
          read: '6 min'
        }, {
          date: '08 / 25',
          title: 'La confianza se acumula en silencio y se derrumba con estruendo.',
          read: '5 min'
        }]
      }]
    }
  };
  const t = COPY[lang];
  const h1 = lang === 'es' ? 'Notas, informes y documentos de trabajo.' : 'Notes, briefs, and working papers.';
  const featuredHeading = lang === 'es' ? /*#__PURE__*/React.createElement(React.Fragment, null, "El mensaje correcto en ", /*#__PURE__*/React.createElement("em", null, "el momento equivocado.")) : /*#__PURE__*/React.createElement(React.Fragment, null, "The right message at the ", /*#__PURE__*/React.createElement("em", null, "wrong moment."));
  const indexHeading = lang === 'es' ? 'Por tema.' : 'By theme.';
  const lastPara = lang === 'es' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Por eso tratamos el momento como una decisi\xF3n estrat\xE9gica de primer orden, no de calendario. La pregunta nunca es solo ", /*#__PURE__*/React.createElement("em", null, "qu\xE9 decimos"), ", sino ", /*#__PURE__*/React.createElement("em", null, "qu\xE9 significar\xE1 esto, para estas personas, el d\xEDa en que se escuche."), " Equivocarse en eso sale caro de una forma dif\xEDcil de ver, porque nada se rompe a la vista. El mensaje simplemente no llega a componer.") : /*#__PURE__*/React.createElement(React.Fragment, null, "This is why we treat timing as a first-order strategic decision, not a scheduling one. The question is never only ", /*#__PURE__*/React.createElement("em", null, "what do we say"), " \u2014 it is ", /*#__PURE__*/React.createElement("em", null, "what will this mean, to these people, on the day it is heard."), " Getting that wrong is expensive in a way that is hard to see, because nothing visibly breaks. The message simply fails to compound.");
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "q-page-hero has-specimen"
  }, /*#__PURE__*/React.createElement(QCoordField, null), /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, t.eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "q-page-hero-h1"
  }, h1), /*#__PURE__*/React.createElement("div", {
    className: "lede"
  }, t.lede), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, t.meta.map((m, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, m))))), /*#__PURE__*/React.createElement("section", {
    className: "q-section",
    style: {
      paddingTop: '56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-section-header",
    style: {
      marginBottom: '40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, t.featuredEyebrow)), /*#__PURE__*/React.createElement("h2", null, featuredHeading)), /*#__PURE__*/React.createElement("div", {
    className: "q-featured"
  }, /*#__PURE__*/React.createElement("div", {
    className: "frame"
  }, t.frameLead, /*#__PURE__*/React.createElement("span", {
    className: "note"
  }, t.frameNote)), /*#__PURE__*/React.createElement("article", {
    className: "read"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kicker"
  }, t.kicker), /*#__PURE__*/React.createElement("h2", null, t.articleTitle), /*#__PURE__*/React.createElement("p", null, t.paras[0]), /*#__PURE__*/React.createElement("p", null, t.paras[1]), /*#__PURE__*/React.createElement("p", null, lastPara), /*#__PURE__*/React.createElement("div", {
    className: "byline"
  }, /*#__PURE__*/React.createElement("span", null, t.bylinePaper), /*#__PURE__*/React.createElement("span", null, "Madrid \xB7 Espa\xF1a")))))), /*#__PURE__*/React.createElement("section", {
    className: "q-section paper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, t.indexEyebrow)), /*#__PURE__*/React.createElement("h2", null, indexHeading)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '72px'
    }
  }, t.themes.map(grp => /*#__PURE__*/React.createElement("div", {
    key: grp.theme
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-theme-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, grp.theme), /*#__PURE__*/React.createElement("span", {
    className: "c"
  }, String(grp.articles.length).padStart(2, '0'), " ", t.papersLabel)), grp.articles.map((a, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    className: "q-article-row",
    style: {
      borderColor: 'var(--rule-paper)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "date",
    style: {
      color: 'var(--on-bone-3)'
    }
  }, a.date), /*#__PURE__*/React.createElement("span", {
    className: "title",
    style: {
      color: 'var(--on-bone-1)'
    }
  }, a.title), /*#__PURE__*/React.createElement("span", {
    className: "read",
    style: {
      color: 'var(--on-bone-3)'
    }
  }, a.read, " ", t.readLabel)))))))), /*#__PURE__*/React.createElement("section", {
    className: "q-section",
    style: {
      paddingTop: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '300px',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(QSpecimen, {
    src: "assets/imagery/lion.png",
    fig: "01",
    theme: t.specimenTheme,
    parallax: "10",
    marks: false
  })))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/PerspectivePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/PerspectiveStrip.jsx
try { (() => {
window.QPerspectiveStrip = function QPerspectiveStrip() {
  const lang = useLang();
  const COPY = {
    en: {
      eyebrow: 'Perspective',
      articles: [{
        eyebrow: 'On Timing',
        date: '04 / 26',
        title: 'The right message at the wrong moment is still the wrong message.',
        read: '6 min'
      }, {
        eyebrow: 'On Silence',
        date: '03 / 26',
        title: 'What a company chooses not to say is also a position.',
        read: '5 min'
      }, {
        eyebrow: 'On Scrutiny',
        date: '02 / 26',
        title: 'Reputation is tested in the moments you did not plan for.',
        read: '7 min'
      }],
      readLabel: 'read',
      cta: 'Read all perspective'
    },
    es: {
      eyebrow: 'Perspectiva',
      articles: [{
        eyebrow: 'Sobre el momento',
        date: '04 / 26',
        title: 'El mensaje correcto en el momento equivocado sigue siendo el mensaje equivocado.',
        read: '6 min'
      }, {
        eyebrow: 'Sobre el silencio',
        date: '03 / 26',
        title: 'Lo que una empresa elige no decir también es una posición.',
        read: '5 min'
      }, {
        eyebrow: 'Sobre el escrutinio',
        date: '02 / 26',
        title: 'La reputación se pone a prueba en los momentos que no planeaste.',
        read: '7 min'
      }],
      readLabel: 'de lectura',
      cta: 'Ver toda la perspectiva'
    }
  };
  const t = COPY[lang];
  const heading = lang === 'es' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Notas, informes y ", /*#__PURE__*/React.createElement("em", null, "documentos de trabajo.")) : /*#__PURE__*/React.createElement(React.Fragment, null, "Notes, briefs, and ", /*#__PURE__*/React.createElement("em", null, "working papers."));
  return /*#__PURE__*/React.createElement("section", {
    className: "q-section",
    id: "perspective"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, t.eyebrow)), /*#__PURE__*/React.createElement("h2", null, heading)), /*#__PURE__*/React.createElement("div", {
    className: "q-persp-grid"
  }, t.articles.map((a, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "perspective.html",
    className: "q-card dark",
    style: {
      minHeight: '320px',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, a.eyebrow), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      letterSpacing: '0.14em',
      color: 'var(--fg-3)'
    }
  }, a.date)), /*#__PURE__*/React.createElement("h3", null, a.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid var(--rule)',
      paddingTop: '16px',
      marginTop: '24px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      letterSpacing: '0.14em',
      color: 'var(--fg-3)',
      textTransform: 'uppercase'
    }
  }, a.read, " ", t.readLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--fg-2)'
    }
  }, "\u2192"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '48px',
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "q-btn secondary",
    href: "perspective.html"
  }, t.cta, " ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/PerspectiveStrip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Services.jsx
try { (() => {
window.QServices = function QServices() {
  const lang = useLang();
  const COPY = {
    en: {
      eyebrow: 'Services architecture',
      layers: [{
        n: '01',
        verb: 'DEFINE',
        lead: 'We map reality.',
        cont: 'We clarify what matters, what is at stake, and what is possible.'
      }, {
        n: '02',
        verb: 'ACTIVATE',
        lead: 'We shape perspective.',
        cont: 'We decide what becomes visible, when, and to whom it matters most.'
      }, {
        n: '03',
        verb: 'SUSTAIN',
        lead: 'We build gravity.',
        cont: 'We turn presence into authority that holds under pressure and endures beyond the moment.'
      }],
      cta: 'Explore the full Services page'
    },
    es: {
      eyebrow: 'Arquitectura de servicios',
      layers: [{
        n: '01',
        verb: 'DEFINIR',
        lead: 'Cartografiamos la realidad.',
        cont: 'Clarificamos qué importa, qué está en juego y qué es posible.'
      }, {
        n: '02',
        verb: 'ACTIVAR',
        lead: 'Damos forma a la percepción.',
        cont: 'Decidimos qué se hace visible, cuándo y para quién importa más.'
      }, {
        n: '03',
        verb: 'SOSTENER',
        lead: 'Construimos influencia.',
        cont: 'Convertimos la presencia en autoridad que resiste la presión y perdura más allá de un solo impacto.'
      }],
      cta: 'Explora la página completa de Servicios'
    }
  };
  const t = COPY[lang];
  const heading = lang === 'es' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Tres capas. ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 500
    }
  }, "Un sistema.")) : /*#__PURE__*/React.createElement(React.Fragment, null, "Three layers. ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 500
    }
  }, "One system."));
  return /*#__PURE__*/React.createElement("section", {
    className: "q-section",
    id: "services"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, t.eyebrow)), /*#__PURE__*/React.createElement("h2", null, heading)), /*#__PURE__*/React.createElement("div", {
    className: "q-trilogy"
  }, t.layers.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.n,
    className: "col",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.2em',
      color: 'var(--fg-3)'
    }
  }, l.n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      fontWeight: 500,
      letterSpacing: '0.2em',
      color: 'var(--fg-2)'
    }
  }, l.verb)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '30px',
      lineHeight: 1.12,
      letterSpacing: '-0.01em',
      fontWeight: 400,
      color: 'var(--fg-1)'
    }
  }, l.lead), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '15px',
      lineHeight: 1.6,
      color: 'var(--fg-2)',
      maxWidth: '34ch'
    }
  }, l.cont)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '64px',
      paddingTop: '40px',
      borderTop: '1px solid var(--rule)',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '40px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "q-btn secondary",
    href: "services.html"
  }, t.cta, " ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Services.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ServicesPage.jsx
try { (() => {
window.QServicesPage = function QServicesPage() {
  const lang = useLang();
  const COPY = {
    en: {
      eyebrow: 'Services architecture',
      lede: 'Most firms help companies become more visible. We help ensure that visibility translates into credibility, clarity, and strategic positioning.',
      meta: ['01 — Define', '02 — Activate', '03 — Sustain'],
      includesHead: 'Includes',
      includesCta: 'Request the full scope',
      layers: [{
        n: '01',
        verb: 'DEFINE',
        tagline: 'The layer built before visibility scales.',
        title: 'Narrative & positioning strategy',
        body: ['We define how the company should be understood by the audiences that shape its trajectory — investors, regulators, media, partners and talent — and build the communication architecture required to sustain that positioning as the organisation grows.', 'Positioning is not a tagline exercise. It is the discipline of making a complex company legible without reducing what makes it strategically distinct.'],
        diff: 'Translation of complexity into public legibility. Narrative systems designed for long-term reputational compounding.',
        includes: ['Corporate narrative architecture', 'Positioning strategy & messaging system', 'Executive positioning', 'Market localisation & narrative adaptation', 'Communication criteria & exposure frameworks', 'Internal communication alignment']
      }, {
        n: '02',
        verb: 'ACTIVATE',
        tagline: 'What we proactively communicate — and when we stay quiet.',
        title: 'Media & strategic presence',
        body: ['We develop visibility selectively. Through media, public positioning and the moments that materially influence how a company is perceived: launches, fundraising, partnerships, leadership transitions and category-defining conversations.', 'Not everything needs to be public. But the relationships, credibility and positioning that make visibility effective must be built before they are needed.'],
        diff: 'Visibility calibrated around strategic timing. Selective rather than volume-driven media logic.',
        includes: ['Strategic media relations', 'Announcement & launch communications', 'Fundraising & partnership communications', 'Interview, podcast & panel preparation', 'Speaking opportunity advisory', 'Research & insight amplification']
      }, {
        n: '03',
        verb: 'SUSTAIN',
        tagline: 'What preserves coherence as scrutiny increases.',
        title: 'Reputation & strategic advisory',
        body: ['As organisations grow, visibility compounds, stakeholders multiply and scrutiny intensifies. We help companies sustain reputational coherence and institutional trust across that expansion.', 'Reputation is tested in moments of pressure, but sustained in the decisions, positioning and relationships maintained long before those moments arrive.'],
        diff: 'Reputation viewed as long-term strategic infrastructure. Narrative continuity across growth and pressure.',
        includes: ['Ongoing strategic communications counsel', 'Reputational risk assessment', 'Sensitive communications advisory', 'Vulnerability identification', 'Narrative coordination in high-attention moments', 'Executive counsel in complex situations']
      }],
      process: [['01', 'Read', 'We start by understanding the company, its context and the gap between what is true and what is understood.'], ['02', 'Frame', 'We build the positioning and communication architecture — the system everything else is measured against.'], ['03', 'Activate', 'We engage visibility selectively, around the moments and audiences where it compounds.'], ['04', 'Sustain', 'We hold coherence as the company grows, scrutiny rises and complexity accumulates.']],
      engageEyebrow: 'How we engage',
      engageClosing: 'Quimera is designed for sustained strategic collaboration. We engage selectively and maintain a limited number of active partnerships, so that depth of context is never traded for volume.',
      whoEyebrow: 'Who we work with',
      audiences: [['Founders & C-Level', 'Leaders with high public exposure or strategic positioning needs.'], ['Investors & Ecosystem', 'Funds, angels and operators requiring reputational advisory for portfolio and leadership.'], ['Agencies & Firms', 'PR, branding, legal or public-affairs partners needing strategic communications support.']],
      calibrateEyebrow: 'What we calibrate',
      calibrateWords: 'Narrative · Presence · Reputation · Leadership',
      ctaBtn: 'Request a conversation'
    },
    es: {
      eyebrow: 'Arquitectura de servicios',
      lede: 'La mayoría de las firmas ayudan a las empresas a ser más visibles. Nosotros nos aseguramos de que esa visibilidad se traduzca en credibilidad, claridad y posicionamiento estratégico.',
      meta: ['01 — Definir', '02 — Activar', '03 — Sostener'],
      includesHead: 'Incluye',
      includesCta: 'Solicita el alcance completo',
      layers: [{
        n: '01',
        verb: 'DEFINIR',
        tagline: 'La capa que se construye antes de escalar la visibilidad.',
        title: 'Estrategia de narrativa y posicionamiento',
        body: ['Definimos cómo debe entenderse la empresa ante las audiencias que moldean su trayectoria —inversores, reguladores, medios, partners y talento— y construimos la arquitectura de comunicación necesaria para sostener ese posicionamiento a medida que la organización crece.', 'El posicionamiento no es un ejercicio de eslogan. Es la disciplina de hacer legible una empresa compleja sin reducir lo que la hace estratégicamente distinta.'],
        diff: 'Traducción de la complejidad en legibilidad pública. Sistemas narrativos diseñados para componer reputación a largo plazo.',
        includes: ['Arquitectura de narrativa corporativa', 'Estrategia de posicionamiento y sistema de mensajes', 'Posicionamiento de directivos', 'Localización de mercado y adaptación narrativa', 'Criterios de comunicación y marcos de exposición', 'Alineación de la comunicación interna']
      }, {
        n: '02',
        verb: 'ACTIVAR',
        tagline: 'Lo que comunicamos de forma proactiva — y cuándo guardamos silencio.',
        title: 'Medios y presencia estratégica',
        body: ['Desarrollamos la visibilidad de forma selectiva. A través de los medios, el posicionamiento público y los momentos que influyen de forma material en cómo se percibe a una empresa: lanzamientos, rondas de financiación, alianzas, relevos de liderazgo y conversaciones que definen una categoría.', 'No todo necesita ser público. Pero las relaciones, la credibilidad y el posicionamiento que hacen efectiva la visibilidad deben construirse antes de que hagan falta.'],
        diff: 'Visibilidad calibrada en torno al momento estratégico. Una lógica de medios selectiva, no guiada por el volumen.',
        includes: ['Relaciones con medios estratégicas', 'Comunicación de anuncios y lanzamientos', 'Comunicación de financiación y alianzas', 'Preparación de entrevistas, pódcast y paneles', 'Asesoría de oportunidades de ponencia', 'Amplificación de estudios e insights']
      }, {
        n: '03',
        verb: 'SOSTENER',
        tagline: 'Lo que preserva la coherencia a medida que aumenta el escrutinio.',
        title: 'Reputación y asesoría estratégica',
        body: ['A medida que las organizaciones crecen, la visibilidad se acumula, los grupos de interés se multiplican y el escrutinio se intensifica. Ayudamos a las empresas a sostener la coherencia reputacional y la confianza institucional a lo largo de esa expansión.', 'La reputación se pone a prueba en los momentos de presión, pero se sostiene en las decisiones, el posicionamiento y las relaciones que se mantienen mucho antes de que esos momentos lleguen.'],
        diff: 'La reputación entendida como infraestructura estratégica a largo plazo. Continuidad narrativa a través del crecimiento y la presión.',
        includes: ['Asesoramiento continuo de comunicación estratégica', 'Evaluación de riesgos reputacionales', 'Asesoría en comunicación sensible', 'Identificación de vulnerabilidades', 'Coordinación narrativa en momentos de máxima atención', 'Acompañamiento a directivos en situaciones complejas']
      }],
      process: [['01', 'Leer', 'Empezamos por entender la empresa, su contexto y la distancia entre lo que es cierto y lo que se entiende.'], ['02', 'Enmarcar', 'Construimos la arquitectura de posicionamiento y comunicación: el sistema con el que se mide todo lo demás.'], ['03', 'Activar', 'Activamos la visibilidad de forma selectiva, en torno a los momentos y las audiencias donde se acumula.'], ['04', 'Sostener', 'Sostenemos la coherencia a medida que la empresa crece, el escrutinio sube y la complejidad se acumula.']],
      engageEyebrow: 'Cómo trabajamos',
      engageClosing: 'Quimera está diseñada para la colaboración estratégica sostenida. Trabajamos de forma selectiva y mantenemos un número limitado de colaboraciones activas, para que la profundidad de contexto nunca se cambie por volumen.',
      whoEyebrow: 'Con quién trabajamos',
      audiences: [['Fundadores y alta dirección', 'Líderes con alta exposición pública o necesidades de posicionamiento estratégico.'], ['Inversores y ecosistema', 'Fondos, business angels y operadores que necesitan asesoría reputacional para su portfolio y su liderazgo.'], ['Agencias y firmas', 'Partners de PR, branding, legal o asuntos públicos que necesitan apoyo en comunicación estratégica.']],
      calibrateEyebrow: 'Qué calibramos',
      calibrateWords: 'Narrativa · Presencia · Reputación · Liderazgo',
      ctaBtn: 'Solicita una conversación'
    }
  };
  const t = COPY[lang];
  const h1 = lang === 'es' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Tres capas. Un sistema.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Three layers. One system.");
  const engageHeading = lang === 'es' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Una forma de trabajar, ", /*#__PURE__*/React.createElement("em", null, "no un men\xFA.")) : /*#__PURE__*/React.createElement(React.Fragment, null, "A way of working, ", /*#__PURE__*/React.createElement("em", null, "not a menu."));
  const ctaText = lang === 'es' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Un briefing, una pregunta ", /*#__PURE__*/React.createElement("em", null, "o una conversaci\xF3n confidencial.")) : /*#__PURE__*/React.createElement(React.Fragment, null, "A brief, a question, ", /*#__PURE__*/React.createElement("em", null, "or a confidential conversation."));
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "q-page-hero has-specimen"
  }, /*#__PURE__*/React.createElement(QCoordField, null), /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, t.eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "q-page-hero-h1"
  }, h1), /*#__PURE__*/React.createElement("div", {
    className: "lede"
  }, t.lede), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, t.meta.map((m, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, m))))), /*#__PURE__*/React.createElement("section", {
    className: "q-section",
    style: {
      paddingTop: '40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, t.layers.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.n,
    className: "q-layer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, l.n), /*#__PURE__*/React.createElement("div", {
    className: "verb"
  }, l.verb), /*#__PURE__*/React.createElement("div", {
    className: "tagline"
  }, l.tagline)), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("h2", null, l.title), l.body.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i
  }, p)), /*#__PURE__*/React.createElement("div", {
    className: "diff"
  }, l.diff), /*#__PURE__*/React.createElement("div", {
    className: "q-includes-pane",
    style: {
      marginTop: '32px',
      maxWidth: '560px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-includes-head"
  }, /*#__PURE__*/React.createElement("span", null, t.includesHead)), /*#__PURE__*/React.createElement("div", {
    className: "q-includes-glass",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("ul", null, l.includes.map(it => /*#__PURE__*/React.createElement("li", {
    key: it
  }, /*#__PURE__*/React.createElement("span", {
    className: "dash"
  }, "\u2014"), it)))), /*#__PURE__*/React.createElement("a", {
    className: "q-includes-cta",
    href: "index.html#contact"
  }, t.includesCta, " ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")))))))), /*#__PURE__*/React.createElement("section", {
    className: "q-section q-who"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-who-aurora",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-who-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-who-eyebrow"
  }, t.whoEyebrow)), /*#__PURE__*/React.createElement("div", {
    className: "q-who-grid"
  }, t.audiences.map(([title, d]) => /*#__PURE__*/React.createElement("div", {
    key: title,
    className: "q-frost-card"
  }, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, d)))), /*#__PURE__*/React.createElement("div", {
    className: "q-who-calibrate"
  }, /*#__PURE__*/React.createElement("span", {
    className: "div",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "q-who-eyebrow"
  }, t.calibrateEyebrow), /*#__PURE__*/React.createElement("div", {
    className: "words"
  }, t.calibrateWords)))), /*#__PURE__*/React.createElement("section", {
    className: "q-section paper q-imghost"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-fraglayer q-hide-mobile",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-reveal",
    style: {
      position: 'absolute',
      right: '3%',
      top: '6%',
      width: '620px',
      height: '980px',
      overflow: 'hidden',
      WebkitMaskImage: 'radial-gradient(60% 72% at 54% 46%, #000 26%, rgba(0,0,0,0.5) 54%, transparent 80%)',
      maskImage: 'radial-gradient(60% 72% at 54% 46%, #000 26%, rgba(0,0,0,0.5) 54%, transparent 80%)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/imagery/hourglass.png",
    "data-parallax": "22",
    style: {
      position: 'absolute',
      width: '100%',
      maxWidth: 'none',
      left: '0',
      top: '0',
      opacity: 0.46,
      filter: 'grayscale(0.5) contrast(0.98) brightness(1.1)'
    },
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "q-veil paper-l"
  })), /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, t.engageEyebrow)), /*#__PURE__*/React.createElement("h2", null, engageHeading)), /*#__PURE__*/React.createElement("div", {
    className: "q-process"
  }, t.process.map(([n, title, d]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    className: "q-step frost"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, n), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, d)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '64px',
      maxWidth: '680px',
      fontFamily: 'var(--font-body)',
      fontSize: '16px',
      lineHeight: 1.6,
      color: 'var(--on-bone-2)'
    }
  }, t.engageClosing))), /*#__PURE__*/React.createElement("section", {
    className: "q-section",
    style: {
      paddingTop: 0,
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-page-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, ctaText), /*#__PURE__*/React.createElement("a", {
    className: "q-btn primary",
    href: "index.html#contact"
  }, t.ctaBtn, " ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192"))))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ServicesPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Specimen.jsx
try { (() => {
// Specimen.jsx — Conservative Bridge devices for interior pages.
//   QSpecimen     : a framed, annotated specimen plate (museum vitrine).
//   QCoordField   : the faint ring/crosshair coordinate texture behind heroes.
// Both are decorative — aria-hidden, no semantic weight.

window.QSpecimen = function QSpecimen({
  src,
  fig = '01',
  theme = 'Specimen',
  parallax = 14,
  alt = '',
  marks = true,
  tone = 'dark'
}) {
  return /*#__PURE__*/React.createElement("figure", {
    className: 'q-specimen' + (tone === 'light' ? ' light' : ''),
    "aria-hidden": alt ? undefined : true,
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "plate"
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    "data-parallax": parallax
  }), /*#__PURE__*/React.createElement("span", {
    className: "corner tl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "corner tr"
  }), /*#__PURE__*/React.createElement("span", {
    className: "corner bl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "corner br"
  }), marks ? /*#__PURE__*/React.createElement("span", {
    className: "crosshair",
    style: {
      left: '11%',
      top: '15%'
    }
  }) : null, marks ? /*#__PURE__*/React.createElement("span", {
    className: "tick",
    style: {
      right: '9%',
      top: '50%',
      width: '22px',
      height: '1px'
    }
  }) : null, marks ? /*#__PURE__*/React.createElement("span", {
    className: "tick",
    style: {
      left: '50%',
      bottom: '8%',
      width: '1px',
      height: '20px'
    }
  }) : null), /*#__PURE__*/React.createElement("figcaption", {
    className: "cap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fig"
  }, "FIG. ", fig), /*#__PURE__*/React.createElement("span", {
    className: "theme"
  }, theme)));
};
window.QCoordField = function QCoordField() {
  return /*#__PURE__*/React.createElement("div", {
    className: "q-coord-field",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ring r1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ring r2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "hair v",
    style: {
      right: '15%'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "hair h",
    style: {
      top: '28%'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "plus",
    style: {
      right: '15%',
      top: '28%',
      transform: 'translate(50%, -50%)'
    }
  }));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Specimen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Tweaks.jsx
try { (() => {
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
  } /*EDITMODE-END*/;
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
    if (el) {
      setHeroEl(el);
      return;
    }
    // Retry a bounded number of times in case the React tree hasn't committed.
    let tries = 0;
    const id = setInterval(() => {
      const found = find();
      if (found) {
        setHeroEl(found);
        clearInterval(id);
      } else if (++tries > 30) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, []);
  const VOICE_SWATCHES = {
    bebacc: '#BEBACC',
    oxide: '#C26A60',
    copper: '#C99166',
    slate: '#7A95B0'
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "q-dossier-margin-l"
  }, "FILE \xB7 Q-001 \xB7 2026 \xB7 RESTRICTED CIRCULATION"), /*#__PURE__*/React.createElement("div", {
    className: "q-dossier-margin-r"
  }, "PROOF \xB7 REVIEW COPY \xB7 NOT FOR DISTRIBUTION"), heroEl && ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "q-dossier-stamp",
    "aria-hidden": "true"
  }, "REVIEW", /*#__PURE__*/React.createElement("br", null), "COPY", /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "Q-001 / 2026")), heroEl), /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Hero"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px 4px',
      fontFamily: 'var(--font-body, system-ui)',
      fontSize: 11,
      color: 'rgba(0,0,0,0.55)',
      lineHeight: 1.45
    }
  }, "What sits behind the opening headline."), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "",
    value: t.heroArt,
    options: [{
      value: 'none',
      label: 'None'
    }, {
      value: 'face',
      label: 'Face'
    }, {
      value: 'texture',
      label: 'Texture'
    }],
    onChange: v => setTweak('heroArt', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Register"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px 4px',
      fontFamily: 'var(--font-body, system-ui)',
      fontSize: 11,
      color: 'rgba(0,0,0,0.55)',
      lineHeight: 1.45
    }
  }, "The posture of the whole page."), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "",
    value: t.register,
    options: [{
      value: 'editorial',
      label: 'Editorial'
    }, {
      value: 'atelier',
      label: 'Atelier'
    }, {
      value: 'cinema',
      label: 'Cinema'
    }],
    onChange: v => setTweak('register', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Apparatus"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px 4px',
      fontFamily: 'var(--font-body, system-ui)',
      fontSize: 11,
      color: 'rgba(0,0,0,0.55)',
      lineHeight: 1.45
    }
  }, "How much intelligence-file framing shows \u2014 index marks, coord ribbons, stamps."), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "",
    value: t.apparatus,
    options: [{
      value: 'clean',
      label: 'Clean'
    }, {
      value: 'standard',
      label: 'Standard'
    }, {
      value: 'dossier',
      label: 'Dossier'
    }],
    onChange: v => setTweak('apparatus', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Voice"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px 4px',
      fontFamily: 'var(--font-body, system-ui)',
      fontSize: 11,
      color: 'rgba(0,0,0,0.55)',
      lineHeight: 1.45
    }
  }, "The signature accent \u2014 runs through eyebrows, link-hovers, the brand dot, selection, stamps."), /*#__PURE__*/React.createElement(TweakColor, {
    label: "",
    value: VOICE_SWATCHES[t.voice],
    options: Object.values(VOICE_SWATCHES),
    onChange: hex => {
      const key = Object.keys(VOICE_SWATCHES).find(k => VOICE_SWATCHES[k] === hex);
      if (key) setTweak('voice', key);
    }
  })));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Tweaks.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/WorkPage.jsx
try { (() => {
window.QWorkPage = function QWorkPage() {
  const lang = useLang();
  const COPY = {
    en: {
      eyebrow: 'Selected work',
      lede: 'Client confidentiality is part of the work, so these cases are described without names. What we can share is the challenge itself, the strategic thinking behind the response, and the decisions that shaped the process.',
      meta: 'Six selected engagements',
      ctaBtn: 'Request a conversation'
    },
    es: {
      eyebrow: 'Trabajo seleccionado',
      lede: 'La confidencialidad del cliente forma parte de nuestro trabajo, así que estos casos se describen sin nombres. Lo que sí podemos compartir es el reto en sí, el pensamiento estratégico detrás de la solución y las decisiones que dieron forma al proceso.',
      meta: 'Seis proyectos seleccionados',
      ctaBtn: 'Solicita una conversación'
    }
  };
  const t = COPY[lang];
  const h1 = lang === 'es' ? 'Cada proyecto es una lección transferible.' : 'Each engagement is a transferable lesson.';
  const ctaText = lang === 'es' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Tu empresa ", /*#__PURE__*/React.createElement("em", null, "no est\xE1 en esta lista."), " Por eso est\xE1s aqu\xED.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Your situation is ", /*#__PURE__*/React.createElement("em", null, "not in this list."), " That is the point.");
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "q-page-hero has-specimen"
  }, /*#__PURE__*/React.createElement(QCoordField, null), /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, t.eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "q-page-hero-h1"
  }, h1), /*#__PURE__*/React.createElement("div", {
    className: "lede"
  }, t.lede), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("span", null, t.meta)))), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: '24px'
    }
  }, /*#__PURE__*/React.createElement(QCaseStudyTable, {
    bare: true
  })), /*#__PURE__*/React.createElement("section", {
    className: "q-section",
    style: {
      paddingTop: 0,
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-page-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, ctaText), /*#__PURE__*/React.createElement("a", {
    className: "q-btn primary",
    href: "index.html#contact"
  }, t.ctaBtn, " ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192"))))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/WorkPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/artdir.js
try { (() => {
/* Art Direction study — subtle motion only.
   - IntersectionObserver reveals .ad-reveal blocks
   - slow parallax drift on [data-drift] (translateY scaled by viewport progress)
   - sticky A/B/C nav active state
   Respects prefers-reduced-motion. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- reveal ----
  var revealEls = [].slice.call(document.querySelectorAll('.ad-reveal'));
  function show(el) {
    el.classList.add('in');
  }
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.92 && r.bottom > 0;
  }
  function revealInView() {
    revealEls.forEach(function (el) {
      if (!el.classList.contains('in') && inView(el)) show(el);
    });
  }

  // 1. reveal anything already in view immediately
  revealInView();

  // 2. IntersectionObserver — the preferred scroll-reveal in real browsers
  var observerFired = false;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      observerFired = true;
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          show(e.target);
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });
    revealEls.forEach(function (el) {
      if (!el.classList.contains('in')) io.observe(el);
    });
  } else {
    revealEls.forEach(show);
  }

  // 3. scroll fallback — covers environments where the observer is flaky but scrolling works
  window.addEventListener('scroll', revealInView, {
    passive: true
  });

  // 4. safety net — guarantee nothing stays hidden (covers environments where
  //    the observer fires once then stalls, or where scrolling is blocked).
  //    Real browsers have already animated the above-fold in; below-fold reveals
  //    off-screen, so the scroll effect for early sections is preserved.
  if (!reduce) {
    setTimeout(function () {
      revealEls.forEach(show);
    }, 1200);
  }

  // ---- drift / parallax ----
  var driftEls = [].slice.call(document.querySelectorAll('[data-drift]'));
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var vh = window.innerHeight;
      driftEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var center = r.top + r.height / 2;
        var progress = (center - vh / 2) / vh; // -1..1 across viewport
        var amt = parseFloat(el.getAttribute('data-drift')) || 0;
        el.style.transform = 'translate3d(0,' + (progress * amt).toFixed(2) + 'px,0)';
      });
      ticking = false;
    });
  }
  if (!reduce && driftEls.length) {
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  // ---- sticky direction nav ----
  var navLinks = [].slice.call(document.querySelectorAll('.ad-dirnav a'));
  var dirs = navLinks.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  function setActive() {
    var line = window.innerHeight * 0.35;
    var idx = 0;
    dirs.forEach(function (sec, i) {
      if (sec && sec.getBoundingClientRect().top - line <= 0) idx = i;
    });
    navLinks.forEach(function (a, i) {
      a.classList.toggle('active', i === idx);
    });
  }
  if (navLinks.length) {
    window.addEventListener('scroll', setActive, {
      passive: true
    });
    window.addEventListener('resize', setActive);
    setActive();
    navLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.querySelector(a.getAttribute('href'));
        if (t) {
          e.preventDefault();
          t.scrollIntoView({
            behavior: reduce ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/artdir.js", error: String((e && e.message) || e) }); }

// ui_kits/website/config.js
try { (() => {
/* ============================================================
   QUIMERA — Feature flags
   Flip a value to true/false to show or hide a section site-wide.
   No other change needed: the header, footer and homepage all read
   these flags. Perspective is fully built (perspective.html) and only
   hidden from navigation until it is ready to go live.
   ============================================================ */
window.QFlags = {
  perspective: false // ← set to true to publish the Perspective section everywhere
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/config.js", error: String((e && e.message) || e) }); }

// ui_kits/website/i18n.js
try { (() => {
/* ============================================================
   QUIMERA — Language store (EN / ES)
   Plain JS, no React. Loads before everything so the chosen
   language is known on first paint. Persists to localStorage,
   reflects on <html lang>, and notifies React via subscribers.
   ============================================================ */
(function () {
  var KEY = 'quimera-lang';
  var lang = 'en';
  try {
    lang = localStorage.getItem(KEY) || 'en';
  } catch (e) {}
  if (lang !== 'en' && lang !== 'es') lang = 'en';
  var subs = [];
  function set(l) {
    if (l !== 'en' && l !== 'es') return;
    if (l === lang) return;
    lang = l;
    try {
      localStorage.setItem(KEY, l);
    } catch (e) {}
    document.documentElement.setAttribute('lang', l);
    for (var i = 0; i < subs.length; i++) subs[i](l);
  }
  window.QLang = {
    get: function () {
      return lang;
    },
    set: set,
    toggle: function () {
      set(lang === 'en' ? 'es' : 'en');
    },
    sub: function (fn) {
      subs.push(fn);
      return function () {
        subs = subs.filter(function (f) {
          return f !== fn;
        });
      };
    }
  };
  document.documentElement.setAttribute('lang', lang);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/i18n.js", error: String((e && e.message) || e) }); }

// ui_kits/website/imagery.js
try { (() => {
/* ============================================================
   QUIMERA — Scroll-motion engine
   Two continuous, scroll-position-linked layers so there is ALWAYS
   something in gentle motion while the visitor scrolls (either way):

   1. [data-parallax]  — image drift via --py (consumed by transform:
      translate3d in CSS). Unchanged; used by hero art, fragments,
      specimen plates, the hourglass watermark.

   2. FLOW selectors    — decorative marks + content blocks drift at
      layered rates via the STANDALONE `translate:` property, which
      composes with the `transform:`-based entrance reveals without
      fighting them. Travel is tied to each element's position in the
      viewport (−1..1), so motion runs on scroll-up AND scroll-down.

   Bails entirely on prefers-reduced-motion.
   ============================================================ */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* selector → drift amplitude in px (total travel ≈ 2× this across a
     full viewport pass). Larger = more apparent depth. */
  var FLOW = [['.q-coord-field', 40], ['.q-hero-ring', 30], ['.q-section-header h2', 18], ['.q-section-header .eyebrow', 26], ['.q-page-hero-h1', 16], ['.q-page-hero .lede', 24], ['.q-manifesto-grid > div', 16], ['.q-persp-grid > a', 22], ['.q-trilogy > .col', 18], ['.q-case', 14], ['.q-step', 14], ['.q-layer', 16], ['.q-who-grid > *', 16], ['.q-contact-row', 16], ['.q-article-row', 14], ['.q-featured', 14], ['.q-prose p', 10]];
  var flowNodes = []; // cached { el, amt } list
  var seen = 'undefined' !== typeof WeakSet ? new WeakSet() : null;
  function scanFlow() {
    for (var f = 0; f < FLOW.length; f++) {
      var sel = FLOW[f][0],
        amt = FLOW[f][1];
      var nodes = document.querySelectorAll(sel);
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (seen) {
          if (seen.has(el)) continue;
          seen.add(el);
        }
        // small per-sibling variance so grouped rows layer slightly
        var vary = 1;
        if (el.parentElement) {
          var sibs = el.parentElement.children,
            idx = 0;
          for (var s = 0; s < sibs.length; s++) {
            if (sibs[s] === el) {
              idx = s;
              break;
            }
          }
          vary = 1 + idx % 3 * 0.16;
        }
        el.style.willChange = 'translate';
        flowNodes.push({
          el: el,
          amt: amt * vary
        });
      }
    }
  }
  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;

    // 1. image parallax (--py)
    var pll = document.querySelectorAll('[data-parallax]');
    for (var i = 0; i < pll.length; i++) {
      var el = pll[i];
      var r = el.getBoundingClientRect();
      var p = (r.top + r.height / 2 - vh / 2) / vh; // −1..1
      var amt = parseFloat(el.getAttribute('data-parallax')) || 0;
      el.style.setProperty('--py', (p * amt).toFixed(1) + 'px');
    }

    // 2. flow drift (standalone translate)
    for (var j = 0; j < flowNodes.length; j++) {
      var n = flowNodes[j],
        e = n.el;
      var rr = e.getBoundingClientRect();
      if (rr.bottom < -vh || rr.top > vh * 2) continue; // far off-screen: skip
      var pr = (rr.top + rr.height / 2 - vh / 2) / vh; // −1..1
      if (pr > 1.4) pr = 1.4;else if (pr < -1.4) pr = -1.4;
      // drift up as the element rises past centre → classic parallax
      e.style.translate = '0 ' + (-pr * n.amt).toFixed(1) + 'px';
    }
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener('scroll', onScroll, {
    passive: true
  });
  window.addEventListener('resize', update);

  // catch nodes as React mounts them; rescan a while, then settle
  var c = 0,
    iv = setInterval(function () {
      scanFlow();
      update();
      if (++c > 50) clearInterval(iv);
    }, 120);
  scanFlow();
  update();
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/imagery.js", error: String((e && e.message) || e) }); }

// ui_kits/website/motion.js
try { (() => {
/* ============================================================
   QUIMERA — Motion engine
   1. Hero entrance (staggered, on load)
   2. Scroll reveal (IntersectionObserver, fire-once)
   3. Nav background on scroll past 40px
   Vanilla + defensive: bails to fully-visible on reduced motion;
   polls briefly so it catches React-mounted nodes.
   ============================================================ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; // leave everything visible

  var root = document.documentElement;
  root.classList.add('js-motion'); // arm the hidden base states

  /* ---- Nav: tint + blur after 40px ---- */
  function nav() {
    var h = document.querySelector('.q-header');
    if (!h) return;
    var on = window.scrollY > 40;
    h.classList.toggle('scrolled', on);
  }
  window.addEventListener('scroll', nav, {
    passive: true
  });
  nav();

  /* ---- index of an element among same-selector siblings (for stagger) ---- */
  function indexInParent(el, sel) {
    var p = el.parentElement;
    if (!p) return 0;
    var sibs = p.querySelectorAll(':scope > ' + sel);
    for (var i = 0; i < sibs.length; i++) if (sibs[i] === el) return i;
    return 0;
  }

  /* Reveal targets: [selector, per-row stagger seconds]. */
  var GROUPS = [['.q-section-header', 0], ['.q-svc-row', 0.1], ['.q-work-head', 0], ['.q-work-row', 0.08], ['.q-manifesto-grid > div', 0.14], ['.q-persp-grid > a', 0.12], ['.q-layer', 0.1], ['.q-step', 0.1], ['.q-case', 0.08], ['.q-featured', 0], ['.q-theme-head', 0], ['.q-article-row', 0.06], ['.q-page-cta', 0], ['.q-closing .stmt', 0], ['.q-closing .sub', 0.12], ['.q-prose', 0]];
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        // Reversible: animate in on enter (from EITHER scroll direction),
        // reset on leave so it replays next time it scrolls back into view.
        // → motion happens scrolling DOWN and UP. (Hero entrance stays
        //   fire-once; that uses data-load, not this observer.)
        if (e.isIntersecting) e.target.classList.add('in');else e.target.classList.remove('in');
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -8% 0px'
    });
  }
  function armReveal(el, childSel, stagger) {
    if (el.hasAttribute('data-reveal') || el.hasAttribute('data-load')) return;
    el.setAttribute('data-reveal', '');
    if (stagger) {
      var i = childSel ? indexInParent(el, childSel.replace(/^.*>\s*/, '')) : indexInParent(el, el.tagName.toLowerCase());
      el.style.setProperty('--reveal-delay', (i * stagger).toFixed(2) + 's');
    }
    if (io) io.observe(el); // viewport-based, reliable; no rect guessing
    else el.classList.add('in');
  }
  function scanReveals() {
    GROUPS.forEach(function (g) {
      var sel = g[0],
        stagger = g[1];
      var childSel = sel.indexOf('>') > -1 ? sel : null;
      document.querySelectorAll(sel).forEach(function (el) {
        armReveal(el, childSel, stagger);
      });
    });
  }

  /* ---- Hero entrance: staggered, runs once when hero mounts ---- */
  function applyLoad(seq) {
    seq.forEach(function (s) {
      var el = s[0];
      if (!el || el.hasAttribute('data-load')) return;
      el.setAttribute('data-load', '');
      el.style.setProperty('--load-delay', s[1] + 's');
      el.style.setProperty('--load-dur', s[2] + 's');
      if (s[3]) el.classList.add('opacity-only');
    });
    // Force a reflow so the hidden base commits, then release via timeout.
    // (setTimeout still fires in background tabs; rAF is paused there, which
    // could otherwise leave the hero stuck hidden.)
    void document.body.offsetHeight;
    setTimeout(function () {
      seq.forEach(function (s) {
        if (s[0]) s[0].classList.add('in');
      });
    }, 40);
  }
  var heroDone = false;
  function heroLoad() {
    if (heroDone) return;

    // Home hero (.q-section.loose)
    var h1 = document.querySelector('.q-section.loose .q-hero-h1');
    if (h1) {
      heroDone = true;
      var tagline = h1.previousElementSibling;
      var subtitle = h1.nextElementSibling;
      var ctas = subtitle ? subtitle.nextElementSibling : null;
      var ribbon = document.querySelector('.q-section.loose .q-coord-ribbon');
      applyLoad([[tagline, 0.10, 0.9, false], [h1, 0.25, 1.0, false], [subtitle, 0.50, 0.95, false], [ctas, 0.70, 0.95, false], [ribbon, 1.00, 0.9, true]]);
      return;
    }

    // Dedicated page hero (.q-page-hero)
    var ph = document.querySelector('.q-page-hero');
    if (ph) {
      heroDone = true;
      applyLoad([[ph.querySelector('.eyebrow'), 0.10, 0.9, false], [ph.querySelector('h1'), 0.25, 1.0, false], [ph.querySelector('.lede'), 0.50, 0.95, false], [ph.querySelector('.meta'), 0.75, 0.9, true]]);
    }
  }

  /* ---- Boot: poll briefly for React-mounted nodes ---- */
  var n = 0;
  var iv = setInterval(function () {
    heroLoad();
    scanReveals();
    nav();
    if (++n > 40) clearInterval(iv); // ~5s of polling then stop
  }, 120);
  // also run once on DOM ready in case scripts already settled
  if (document.readyState !== 'loading') {
    heroLoad();
    scanReveals();
  } else document.addEventListener('DOMContentLoaded', function () {
    heroLoad();
    scanReveals();
  });

  /* ---- Safety net: in a non-scrollable context (e.g. a full-height
     preview frame where IntersectionObserver can never fire on scroll),
     reveal anything still hidden so content is never lost. Also hard-settle
     the hero entrance so a frozen transition can never leave it blank. ---- */
  setTimeout(function () {
    root.classList.add('motion-settled'); // hero can never stay hidden
    var canScroll = document.documentElement.scrollHeight > window.innerHeight + 8;
    if (canScroll) return; // real page → trust IO on scroll
    document.querySelectorAll('[data-reveal]:not(.in)').forEach(function (el) {
      el.classList.add('in');
    });
  }, 4000);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/motion.js", error: String((e && e.message) || e) }); }

// ui_kits/website/tweaks-panel.jsx
try { (() => {
/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

})();
