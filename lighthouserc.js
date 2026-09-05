module.exports = {
  ci: {
    collect: {
      staticDistDir: '.',
      // Every page a visitor can reach. Add new ones here: a page left off
      // this list is not audited at all, which is how design.html shipped
      // with no h1 on it. Deliberately absent: the colour and contrast
      // working files, which are tools rather than pages and are already
      // skipped by htmlhint, and tollesbury-gallery-proposal.html, which is
      // unlinked and carries noindex, so the SEO audit would fail by design.
      url: [
        'http://localhost/index.html',
        'http://localhost/projects.html',
        'http://localhost/design.html',
        'http://localhost/writing.html',
        'http://localhost/speaking.html',
        'http://localhost/art.html',
        'http://localhost/photography.html',
        'http://localhost/contact.html',
        'http://localhost/lgbthistory.html',
        'http://localhost/nearmark.html',
        'http://localhost/rephoto.html',
        'http://localhost/moxii.html',
        'http://localhost/beyond-luminance.html',
        'http://localhost/tollesbury-arts.html',
        'http://localhost/tollesbury-surgery.html',
        'http://localhost/sailing-club.html',
        'http://localhost/saltmarsh-press.html',
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.90 }],
        'categories:performance': ['warn', { minScore: 0.75 }],
        'categories:seo': ['warn', { minScore: 0.90 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
