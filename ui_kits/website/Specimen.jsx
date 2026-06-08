// Specimen.jsx — Conservative Bridge devices for interior pages.
//   QSpecimen     : a framed, annotated specimen plate (museum vitrine).
//   QCoordField   : the faint ring/crosshair coordinate texture behind heroes.
// Both are decorative — aria-hidden, no semantic weight.

window.QSpecimen = function QSpecimen({ src, fig = '01', theme = 'Specimen', parallax = 14, alt = '', marks = true, tone = 'dark' }) {
  return (
    <figure className={'q-specimen' + (tone === 'light' ? ' light' : '')} aria-hidden={alt ? undefined : true} style={{ margin: 0 }}>
      <div className="plate">
        <img src={src} alt={alt} data-parallax={parallax} />
        <span className="corner tl"></span>
        <span className="corner tr"></span>
        <span className="corner bl"></span>
        <span className="corner br"></span>
        {marks ? <span className="crosshair" style={{ left: '11%', top: '15%' }}></span> : null}
        {marks ? <span className="tick" style={{ right: '9%', top: '50%', width: '22px', height: '1px' }}></span> : null}
        {marks ? <span className="tick" style={{ left: '50%', bottom: '8%', width: '1px', height: '20px' }}></span> : null}
      </div>
      <figcaption className="cap">
        <span className="fig">FIG. {fig}</span>
        <span className="theme">{theme}</span>
      </figcaption>
    </figure>
  );
};

window.QCoordField = function QCoordField() {
  return (
    <div className="q-coord-field" aria-hidden="true">
      <span className="ring r1"></span>
      <span className="ring r2"></span>
      <span className="hair v" style={{ right: '15%' }}></span>
      <span className="hair h" style={{ top: '28%' }}></span>
      <span className="plus" style={{ right: '15%', top: '28%', transform: 'translate(50%, -50%)' }}></span>
    </div>
  );
};
