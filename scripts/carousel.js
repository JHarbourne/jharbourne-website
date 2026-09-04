/* Card carousel, shared by the speaking topics and the home page writing row.
   Each track is a scroll-snap flex row; the buttons scroll it by roughly a
   viewport of cards, so it works whatever the card width is at that
   breakpoint. Arrows disable at the ends rather than scrolling into nothing. */
(function () {
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.topics-track, .browse-cards');
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    if (!track || !prev || !next) return;

    function step() {
      var card = track.querySelector('.topic-card, li');
      if (!card) return track.clientWidth;
      var w = card.getBoundingClientRect().width + 2;
      // move by whole cards, at most a screenful
      return Math.max(w, Math.floor(track.clientWidth / w) * w);
    }

    function sync() {
      var max = track.scrollWidth - track.clientWidth - 1;
      prev.disabled = track.scrollLeft <= 0;
      next.disabled = track.scrollLeft >= max;
    }

    prev.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });
})();
