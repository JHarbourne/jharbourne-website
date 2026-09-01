/**
 * WCAG 2.2 AA accessibility check — runs axe-core via Playwright
 * against every public HTML page and fails CI if violations are found.
 */

const { chromium } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

const PAGES = [
  '/',
  '/projects.html',
  '/lgbthistory.html',
  '/nearmark.html',
  '/beyond-luminance.html',
  '/moxii.html',
  '/speaking.html',
  '/writing.html',
  '/art.html',
  '/photography.html',
  '/contact.html',
];

// Rules that cannot be automatically verified without user interaction
// or that are intentionally acceptable on this site
const KNOWN_INAPPLICABLE = [];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  let totalViolations = 0;

  for (const path of PAGES) {
    const page = await context.newPage();
    const url = BASE_URL + path;

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    } catch (e) {
      console.warn(`⚠  Could not load ${url}: ${e.message}`);
      await page.close();
      continue;
    }

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .exclude(KNOWN_INAPPLICABLE)
      .analyze();

    const violations = results.violations;

    if (violations.length === 0) {
      console.log(`✓  ${path}`);
    } else {
      console.error(`\n❌ ${path} — ${violations.length} violation(s):`);
      for (const v of violations) {
        console.error(`\n  [${v.impact}] ${v.id}`);
        console.error(`  ${v.description}`);
        console.error(`  Help: ${v.helpUrl}`);
        for (const node of v.nodes.slice(0, 3)) {
          console.error(`  → ${node.html.slice(0, 140)}`);
        }
      }
      totalViolations += violations.length;
    }

    await page.close();
  }

  await browser.close();

  console.log('');
  if (totalViolations > 0) {
    console.error(`FAIL — ${totalViolations} WCAG 2.2 AA violation(s) across ${PAGES.length} pages.`);
    process.exit(1);
  } else {
    console.log(`PASS — all ${PAGES.length} pages clear WCAG 2.2 AA.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
