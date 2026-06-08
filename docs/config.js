/* ============================================================
   QUIMERA — Feature flags
   Flip a value to true/false to show or hide a section site-wide.
   No other change needed: the header, footer and homepage all read
   these flags. Perspective is fully built (perspective.html) and only
   hidden from navigation until it is ready to go live.
   ============================================================ */
window.QFlags = {
  perspective: false,   // ← set to true to publish the Perspective section everywhere
};
