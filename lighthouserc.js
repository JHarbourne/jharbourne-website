module.exports = {
  ci: {
    collect: {
      staticDistDir: '.',
      url: [
        'http://localhost/index.html',
        'http://localhost/projects.html',
        'http://localhost/lgbthistory.html',
        'http://localhost/nearmark.html',
        'http://localhost/beyond-luminance.html',
        'http://localhost/moxii.html',
        'http://localhost/speaking.html',
        'http://localhost/writing.html',
        'http://localhost/art.html',
        'http://localhost/photography.html',
        'http://localhost/contact.html',
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
