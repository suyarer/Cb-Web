// ClubBeans canlı audit — Playwright headless Chromium + axe-core
// Kapsam: 3 viewport × full sayfa + interaction + a11y + performance + console
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

const URL = process.env.AUDIT_URL || 'http://localhost:3001';
const OUT = '/tmp/audit';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(`${OUT}/shots`, { recursive: true });

const viewports = [
  { name: 'mobile-375', width: 375, height: 812, deviceScaleFactor: 2, isMobile: true },
  { name: 'tablet-768', width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true },
  { name: 'desktop-1280', width: 1280, height: 800, deviceScaleFactor: 1, isMobile: false },
];

const findings = {
  console: [],
  network: [],
  a11y: [],
  performance: {},
  interactions: [],
  visual: [],
};

function log(...args) {
  const s = args.join(' ');
  console.log(s);
  fs.appendFileSync(`${OUT}/log.txt`, s + '\n');
}

async function auditViewport(browser, vp) {
  log(`\n━━━ Viewport: ${vp.name} (${vp.width}×${vp.height}) ━━━`);

  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
    ignoreHTTPSErrors: true,
    userAgent: vp.isMobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined,
  });

  const page = await context.newPage();

  // Console dinle
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      findings.console.push({ vp: vp.name, type, text: msg.text() });
    }
  });

  // Network errors
  page.on('requestfailed', (req) => {
    findings.network.push({
      vp: vp.name,
      url: req.url(),
      failure: req.failure()?.errorText,
    });
  });

  // Response 4xx/5xx
  page.on('response', (res) => {
    if (res.status() >= 400) {
      findings.network.push({
        vp: vp.name,
        url: res.url(),
        status: res.status(),
      });
    }
  });

  // Page errors (uncaught exceptions)
  page.on('pageerror', (err) => {
    findings.console.push({
      vp: vp.name,
      type: 'pageerror',
      text: err.message,
    });
  });

  log('→ Navigating...');
  const start = Date.now();
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(3000); // hydration + animations
  const loadTime = Date.now() - start;
  log(`  Load: ${loadTime}ms`);

  // Performance metrics
  const perfMetrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find((p) => p.name === 'first-contentful-paint');
    const lcp = new Promise((resolve) => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        resolve(entries[entries.length - 1]?.startTime ?? null);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => resolve(null), 3000);
    });
    return {
      domContentLoaded: nav?.domContentLoadedEventEnd ?? null,
      load: nav?.loadEventEnd ?? null,
      fcp: fcp?.startTime ?? null,
      ttfb: nav?.responseStart ?? null,
    };
  });
  findings.performance[vp.name] = perfMetrics;
  log(`  Perf: FCP=${perfMetrics.fcp?.toFixed(0)}ms, TTFB=${perfMetrics.ttfb?.toFixed(0)}ms, DCL=${perfMetrics.domContentLoaded?.toFixed(0)}ms`);

  // Full page screenshot
  log('→ Full screenshot...');
  await page.screenshot({
    path: `${OUT}/shots/${vp.name}-full.png`,
    fullPage: true,
  });

  // Above-the-fold
  await page.screenshot({
    path: `${OUT}/shots/${vp.name}-hero.png`,
    fullPage: false,
  });

  // Her major section için scroll + screenshot
  const sectionIds = [
    'sorunlar',
    'yalnizlik-indeksi',
    'nasil-calisir',
    'club-kur',
    'manifesto',
    'donusturucu',
    'trustscore',
    'uygulamada',
    'features',
    'kabile-ticker',
    'karsilastirma',
    'yol-haritasi',
    'sss',
    'not',
    'launch',
  ];

  log('→ Section screenshots...');
  for (const id of sectionIds) {
    try {
      const el = page.locator(`#${id}`);
      if ((await el.count()) === 0) {
        log(`  ⚠ #${id} not found`);
        continue;
      }
      await el.scrollIntoViewIfNeeded({ timeout: 5000 });
      await page.waitForTimeout(700); // let animations settle
      await el.screenshot({
        path: `${OUT}/shots/${vp.name}-section-${id}.png`,
      });
    } catch (e) {
      log(`  ⚠ ${id} screenshot failed: ${e.message.slice(0, 80)}`);
    }
  }

  // A11y scan
  log('→ axe-core a11y scan...');
  try {
    const results = await new AxeBuilder({ page }).analyze();
    findings.a11y.push({
      vp: vp.name,
      violations: results.violations.length,
      incomplete: results.incomplete.length,
      details: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
        sampleTarget: v.nodes[0]?.target[0] ?? null,
      })),
    });
    log(`  Violations: ${results.violations.length}, Incomplete: ${results.incomplete.length}`);
  } catch (e) {
    log(`  ⚠ axe failed: ${e.message}`);
  }

  // Tap target check (mobile)
  if (vp.isMobile) {
    log('→ Tap target size check...');
    const tooSmall = await page.evaluate(() => {
      const clickables = document.querySelectorAll('button, a, [role="button"], input[type="button"]');
      const results = [];
      for (const el of clickables) {
        const rect = el.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          if (rect.width > 0 && rect.height > 0) {
            results.push({
              tag: el.tagName.toLowerCase(),
              text: (el.textContent || '').slice(0, 40).trim(),
              w: Math.round(rect.width),
              h: Math.round(rect.height),
              id: el.id || null,
              class: el.className?.toString?.().slice(0, 80) ?? '',
            });
          }
        }
      }
      return results;
    });
    findings.visual.push({
      vp: vp.name,
      issue: 'tap-target-too-small',
      count: tooSmall.length,
      items: tooSmall.slice(0, 20),
    });
    log(`  Small tap targets: ${tooSmall.length}`);
  }

  // Interaction tests
  log('→ Interactive tests...');

  // Compass mode buttons
  try {
    const compassButtons = page.locator('button[aria-pressed]').filter({
      has: page.locator('text=/DENGE|COŞKU|SAKİN|YAKIN/'),
    });
    const count = await compassButtons.count();
    log(`  Compass buttons found: ${count}`);
    if (count >= 4) {
      for (let i = 0; i < 4; i++) {
        await compassButtons.nth(i).click();
        await page.waitForTimeout(600);
        await page.screenshot({
          path: `${OUT}/shots/${vp.name}-compass-${i}.png`,
          fullPage: false,
        });
      }
      findings.interactions.push({ vp: vp.name, test: 'compass-4-modes', status: 'passed' });
    } else {
      findings.interactions.push({ vp: vp.name, test: 'compass-4-modes', status: 'skipped (not enough buttons)' });
    }
  } catch (e) {
    findings.interactions.push({ vp: vp.name, test: 'compass-4-modes', status: 'failed', error: e.message.slice(0, 120) });
  }

  // Scroll to bottom and check GutterSprout Crown
  try {
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: `${OUT}/shots/${vp.name}-scroll-100.png`,
      fullPage: false,
    });
    findings.interactions.push({ vp: vp.name, test: 'scroll-to-end', status: 'passed' });
  } catch (e) {
    findings.interactions.push({ vp: vp.name, test: 'scroll-to-end', status: 'failed' });
  }

  // LonelinessQuiz
  try {
    await page.locator('#yalnizlik-indeksi').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    // 3 soruyu yanıtla
    for (let q = 0; q < 3; q++) {
      const options = page.locator('#yalnizlik-indeksi button[type="button"]');
      const cnt = await options.count();
      if (cnt >= 3) {
        await options.first().click();
        await page.waitForTimeout(500);
      }
    }
    await page.screenshot({ path: `${OUT}/shots/${vp.name}-quiz-result.png` });
    findings.interactions.push({ vp: vp.name, test: 'loneliness-quiz', status: 'completed' });
  } catch (e) {
    findings.interactions.push({ vp: vp.name, test: 'loneliness-quiz', status: 'failed', error: e.message.slice(0, 120) });
  }

  // FAQ accordion
  try {
    await page.locator('#sss').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const faqs = page.locator('#sss button[aria-expanded]');
    const faqCount = await faqs.count();
    if (faqCount >= 3) {
      await faqs.nth(0).click();
      await page.waitForTimeout(500);
      await faqs.nth(2).click();
      await page.waitForTimeout(500);
      await page.locator('#sss').screenshot({ path: `${OUT}/shots/${vp.name}-faq-open.png` });
      findings.interactions.push({ vp: vp.name, test: 'faq-accordion', status: 'passed' });
    }
  } catch (e) {
    findings.interactions.push({ vp: vp.name, test: 'faq-accordion', status: 'failed', error: e.message.slice(0, 120) });
  }

  // SilentHour toggle
  try {
    const silentBtn = page.locator('button[aria-label*="sessiz"]').first();
    if ((await silentBtn.count()) > 0) {
      await silentBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${OUT}/shots/${vp.name}-silent-open.png`, fullPage: false });
      // Kapat
      await silentBtn.click();
      await page.waitForTimeout(800);
      findings.interactions.push({ vp: vp.name, test: 'silent-hour', status: 'passed' });
    }
  } catch (e) {
    findings.interactions.push({ vp: vp.name, test: 'silent-hour', status: 'failed', error: e.message.slice(0, 120) });
  }

  // Horizontal overflow check (document wider than viewport)
  const hOverflow = await page.evaluate(() => {
    return {
      docWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
  if (hOverflow.overflow) {
    findings.visual.push({
      vp: vp.name,
      issue: 'horizontal-overflow',
      details: hOverflow,
    });
    log(`  ⚠ Horizontal overflow: ${hOverflow.docWidth}px > ${hOverflow.viewportWidth}px`);
  }

  await context.close();
}

(async () => {
  log('ClubBeans Audit — ' + new Date().toISOString());

  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    await auditViewport(browser, vp);
  }

  await browser.close();

  fs.writeFileSync(`${OUT}/findings.json`, JSON.stringify(findings, null, 2));
  log('\n━━━ DONE ━━━');
  log(`Report: ${OUT}/findings.json`);
  log(`Screenshots: ${OUT}/shots/`);
})();
