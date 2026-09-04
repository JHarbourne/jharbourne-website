/* Mobile navigation toggle.
   The links are a plain list on wide screens; below the breakpoint they
   collapse behind a button. State lives in data-open on the nav, so the
   desktop layout is never affected by whatever the button last did. */
(function () {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;
  var btn = nav.querySelector('.site-nav__toggle');
  var links = nav.querySelector('.site-nav__links');
  if (!btn || !links) return;

  function setOpen(open) {
    nav.dataset.open = open ? 'true' : 'false';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  setOpen(false);

  btn.addEventListener('click', function () {
    setOpen(nav.dataset.open !== 'true');
  });

  // following a link should not leave the menu open behind you
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.dataset.open === 'true') {
      setOpen(false);
      btn.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (nav.dataset.open === 'true' && !nav.contains(e.target)) setOpen(false);
  });
})();
