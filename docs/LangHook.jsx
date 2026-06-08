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
