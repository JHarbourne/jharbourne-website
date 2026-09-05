/* Cookieless analytics, served first-party.

   PostHog, EU-hosted, in its cookieless mode: no cookies, no local storage,
   no session storage, nothing written to the visitor's device at all. Who
   you are is a salted hash computed on PostHog's servers, not an identifier
   handed to you and read back later, so there is nothing to opt out of and
   no banner to dismiss.

   Every request goes to jharbourne.com/hbn and is rewritten to PostHog by
   Vercel (see vercel.json), so the browser makes no third-party request and
   the page keeps the single-origin property the rest of the site has. The
   path is deliberately meaningless: PostHog's own guidance is that /ingest,
   /analytics and /tracking are on blocklists, and a blocked request is a
   visitor counted as nobody.

   Autocapture, session replay, heatmaps and surveys are off both here and
   in the project settings, so the only thing recorded is which page was
   viewed and where the visit came from. person_profiles: 'never' makes any
   identify() call a no-op, so no profile can accumulate by accident.

   Do Not Track is honoured before the bundle is even requested: a visitor
   who has set it does not download the script, let alone send an event.

   The rewrites live in Vercel, so this does nothing on a local preview:
   /hbn/static/array.js 404s, onload never fires, and the page is unaffected.
   Verify against the deployed site, not localhost. */
(function () {
  var dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  if (dnt === '1' || dnt === 'yes') return;

  var script = document.createElement('script');
  script.src = '/hbn/static/array.js';
  script.async = true;

  script.onload = function () {
    if (!window.posthog || !window.posthog.init) return;
    window.posthog.init('phc_sFhx5AnY8i62s7jg7XW7N4f2NKDG6WZy7YdzYK48b4zw', {
      api_host: '/hbn',
      ui_host: 'https://eu.posthog.com',
      defaults: '2026-05-30',
      cookieless_mode: 'always',
      person_profiles: 'never',
      autocapture: false,
      capture_pageview: true,
      capture_pageleave: true,
      capture_exceptions: false,
      disable_session_recording: true,
      disable_surveys: true,
      respect_dnt: true
    });
  };

  document.head.appendChild(script);
})();
