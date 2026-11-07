/**
 * CTO 15 — sonda dirigida LCP H1 em /due-diligence-imobiliaria
 * 10 repetições × revisão × perfil, ordem alternada, cache frio.
 * Rastreia nav → CSS/fonte → H1 no DOM → LCP → long tasks.
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
  })
);

const CANDIDATE = args.candidate || "http://127.0.0.1:3025";
const BASELINE = args.baseline || "http://127.0.0.1:3024";
const RUNS = Number(args.runs || 10);
const PATH = "/due-diligence-imobiliaria";
const LABEL = args.label || "pre-fix";

const profiles = [
  {
    id: "desktop-cold",
    mobile: false,
    settleMs: 1800,
    viewport: { width: 1440, height: 900 }
  },
  {
    id: "mobile-cold",
    mobile: true,
    settleMs: 3500,
    viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  }
];

const INIT = `
window.__probe = {
  support: { lcp: false, longtask: false },
  lcp: null,
  lcpElement: null,
  lcpUrl: null,
  lcpSize: null,
  lcpEntries: [],
  long: [],
  marks: {},
  errors: []
};
try {
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__probe.lcpEntries.push({ t: e.startTime, size: e.size, url: e.url || null });
      if (!window.__probe.lcp || e.startTime >= window.__probe.lcp) {
        window.__probe.lcp = e.startTime;
        window.__probe.lcpSize = e.size;
        window.__probe.lcpUrl = e.url || null;
        window.__probe.lcpElement = e.element
          ? (e.element.id ? "#" + e.element.id : e.element.tagName)
            + " :: " + String(e.element.textContent || "").trim().slice(0, 80)
          : null;
      }
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  window.__probe.support.lcp = true;
} catch (e) { window.__probe.errors.push(String(e)); }
try {
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__probe.long.push({ start: e.startTime, dur: e.duration });
  }).observe({ type: "longtask", buffered: true });
  window.__probe.support.longtask = true;
} catch (e) { window.__probe.errors.push(String(e)); }
`;

const COLLECT = `(() => {
  const nav = performance.getEntriesByType("navigation")[0] || {};
  const paints = Object.fromEntries(performance.getEntriesByType("paint").map((p) => [p.name, p.startTime]));
  const res = performance.getEntriesByType("resource");
  const fonts = res.filter((r) => /\\.(woff2?|ttf|otf)(\\?|$)/.test(r.name) || r.initiatorType === "css" && /font/.test(r.name) || /fonts\\.(gstatic|googleapis)/.test(r.name));
  const css = res.filter((r) => /\\.css(\\?|$)/.test(r.name));
  const scripts = res.filter((r) => r.initiatorType === "script" || /\\.js(\\?|$)/.test(r.name));
  const h1 = document.getElementById("page-title");
  let h1Box = null;
  if (h1) {
    const r = h1.getBoundingClientRect();
    const cs = getComputedStyle(h1);
    h1Box = {
      text: (h1.textContent || "").trim().slice(0, 120),
      top: Math.round(r.top),
      width: Math.round(r.width),
      height: Math.round(r.height),
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      visibility: cs.visibility,
      opacity: cs.opacity
    };
  }
  const html = document.documentElement.outerHTML;
  const h1HtmlIndex = html.indexOf('id="page-title"');
  const jsonLdCount = document.querySelectorAll('script[type="application/ld+json"]').length;
  const jsonLdChars = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .reduce((a, s) => a + (s.textContent || "").length, 0);
  const firstJsonLdIndex = html.indexOf('application/ld+json');
  const bodyDivApprox = html.indexOf('id="conteudo"');
  const p = window.__probe;
  const longBeforeLcp = (p.long || []).filter((l) => l.start < (p.lcp || Infinity));
  return {
    collectionValid: typeof p.lcp === "number" && p.lcp > 0 && p.support.lcp,
    support: p.support,
    errors: p.errors,
    ttfbMs: nav.responseStart != null ? Math.round(nav.responseStart) : null,
    responseEndMs: nav.responseEnd != null ? Math.round(nav.responseEnd) : null,
    domInteractiveMs: nav.domInteractive != null ? Math.round(nav.domInteractive) : null,
    domContentLoadedMs: nav.domContentLoadedEventEnd != null ? Math.round(nav.domContentLoadedEventEnd) : null,
    loadMs: nav.loadEventEnd != null ? Math.round(nav.loadEventEnd) : null,
    fpMs: paints["first-paint"] != null ? Math.round(paints["first-paint"]) : null,
    fcpMs: paints["first-contentful-paint"] != null ? Math.round(paints["first-contentful-paint"]) : null,
    lcpMs: p.lcp != null ? Math.round(p.lcp) : null,
    lcpElement: p.lcpElement,
    lcpSize: p.lcpSize,
    lcpUrl: p.lcpUrl,
    lcpIsH1: Boolean(p.lcpElement && /#page-title|H1/i.test(p.lcpElement)),
    gapLcpMinusFcpMs: (p.lcp != null && paints["first-contentful-paint"] != null)
      ? Math.round(p.lcp - paints["first-contentful-paint"]) : null,
    gapLcpMinusDclMs: (p.lcp != null && nav.domContentLoadedEventEnd != null)
      ? Math.round(p.lcp - nav.domContentLoadedEventEnd) : null,
    h1Box,
    documentChars: html.length,
    h1HtmlIndex,
    firstJsonLdIndex,
    bodyConteudoIndex: bodyDivApprox,
    jsonLdBeforeH1InHtml: firstJsonLdIndex >= 0 && h1HtmlIndex >= 0 && firstJsonLdIndex < h1HtmlIndex,
    jsonLdCount,
    jsonLdChars,
    cssCount: css.length,
    cssTransferBytes: css.reduce((a, r) => a + (r.transferSize || 0), 0),
    cssEncodedBytes: css.reduce((a, r) => a + (r.encodedBodySize || 0), 0),
    fontResources: fonts.map((r) => ({
      name: r.name.replace(location.origin, ""),
      transfer: r.transferSize || 0,
      encoded: r.encodedBodySize || 0,
      start: Math.round(r.startTime),
      duration: Math.round(r.duration),
      responseEnd: Math.round(r.responseEnd)
    })),
    scriptResources: scripts.map((r) => ({
      name: r.name.replace(location.origin, ""),
      transfer: r.transferSize || 0,
      start: Math.round(r.startTime),
      duration: Math.round(r.duration)
    })),
    longTasksBeforeLcp: longBeforeLcp.map((l) => ({ start: Math.round(l.start), dur: Math.round(l.dur) })),
    longTaskProxyBeforeLcpMs: Math.round(longBeforeLcp.filter((l) => l.dur > 50).reduce((a, l) => a + (l.dur - 50), 0)),
    portraitFound: res.some((r) => /retrato-profissional/.test(r.name)),
    measuredUntilMs: Math.round(performance.now())
  };
})()`;

function median(values) {
  const s = [...values].sort((a, b) => a - b);
  if (!s.length) return null;
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
function stats(values) {
  const clean = values.filter((v) => typeof v === "number" && Number.isFinite(v));
  if (!clean.length) return null;
  const med = median(clean);
  const mean = clean.reduce((a, b) => a + b, 0) / clean.length;
  const sd = Math.sqrt(clean.reduce((a, b) => a + (b - mean) ** 2, 0) / clean.length);
  return {
    n: clean.length,
    median: Math.round(med * 10) / 10,
    mean: Math.round(mean * 10) / 10,
    min: Math.min(...clean),
    max: Math.max(...clean),
    sd: Math.round(sd * 10) / 10,
    samples: clean
  };
}

async function measure(browser, origin, label, profile) {
  const context = await browser.newContext(
    profile.mobile
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      : { viewport: { width: 1440, height: 900 } }
  );
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.clearBrowserCache").catch(() => {});
  await cdp.send("Network.setBlockedURLs", {
    urls: [
      "*googletagmanager.com*",
      "*google-analytics.com*",
      "*vercel-insights.com*",
      "*va.vercel-scripts.com*"
    ]
  });
  if (profile.mobile) {
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      latency: 150
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  } else {
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  }

  await page.addInitScript(INIT);
  const started = Date.now();
  let response = null;
  try {
    response = await page.goto(`${origin}${PATH}`, { waitUntil: "load", timeout: 90000 });
  } catch (err) {
    await context.close();
    return {
      originLabel: label,
      profile: profile.id,
      collectionValid: false,
      invalidReason: String(err),
      wallMs: Date.now() - started
    };
  }
  await page.waitForTimeout(profile.settleMs);
  const metrics = await page.evaluate(COLLECT);

  // Lightweight CDP trace snapshot markers (Perf metrics)
  let traceSnippet = null;
  try {
    const { metrics: cdpMetrics } = await cdp.send("Performance.getMetrics");
    traceSnippet = Object.fromEntries(cdpMetrics.map((m) => [m.name, m.value]));
  } catch {
    traceSnippet = null;
  }

  await context.close();
  return {
    originLabel: label,
    origin,
    profile: profile.id,
    status: response?.status() ?? null,
    wallMs: Date.now() - started,
    cdpMetrics: traceSnippet,
    ...metrics
  };
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const chrome = await browser.version();
const raw = [];
const startedAt = new Date().toISOString();
const t0 = Date.now();

try {
  for (const profile of profiles) {
    for (let run = 1; run <= RUNS; run += 1) {
      const order =
        run % 2 === 1
          ? [
              ["baseline", BASELINE],
              ["candidate", CANDIDATE]
            ]
          : [
              ["candidate", CANDIDATE],
              ["baseline", BASELINE]
            ];
      for (const [label, origin] of order) {
        process.stdout.write(`${LABEL} ${profile.id} run${run} ${label}\n`);
        const sample = await measure(browser, origin, label, profile);
        raw.push({ ...sample, run, orderPosition: order.findIndex((x) => x[0] === label) + 1 });
        process.stdout.write(
          `  → valid=${sample.collectionValid} LCP=${sample.lcpMs} el=${sample.lcpElement} FCP=${sample.fcpMs} DCL=${sample.domContentLoadedMs} jsonLdChars=${sample.jsonLdChars} h1Idx=${sample.h1HtmlIndex} jsonBeforeH1=${sample.jsonLdBeforeH1InHtml}\n`
        );
      }
    }
  }
} finally {
  await browser.close();
}

const cells = {};
for (const r of raw) {
  const key = `${r.profile}|${r.originLabel}`;
  (cells[key] ??= []).push(r);
}

const summary = Object.entries(cells).map(([key, rows]) => {
  const [profile, originLabel] = key.split("|");
  const valid = rows.filter((r) => r.collectionValid);
  return {
    profile,
    originLabel,
    runs: rows.length,
    validRuns: valid.length,
    lcp: stats(valid.map((r) => r.lcpMs)),
    fcp: stats(valid.map((r) => r.fcpMs)),
    ttfb: stats(valid.map((r) => r.ttfbMs)),
    dcl: stats(valid.map((r) => r.domContentLoadedMs)),
    gapLcpFcp: stats(valid.map((r) => r.gapLcpMinusFcpMs)),
    jsonLdChars: stats(valid.map((r) => r.jsonLdChars)),
    documentChars: stats(valid.map((r) => r.documentChars)),
    h1HtmlIndex: stats(valid.map((r) => r.h1HtmlIndex)),
    lcpIsH1Count: valid.filter((r) => r.lcpIsH1).length,
    portraitFoundCount: valid.filter((r) => r.portraitFound).length,
    jsonLdBeforeH1Count: valid.filter((r) => r.jsonLdBeforeH1InHtml).length,
    lcpElements: [...new Set(valid.map((r) => r.lcpElement).filter(Boolean))]
  };
});

const paired = [];
for (const profile of profiles) {
  for (let run = 1; run <= RUNS; run += 1) {
    const b = raw.find((r) => r.profile === profile.id && r.run === run && r.originLabel === "baseline");
    const c = raw.find((r) => r.profile === profile.id && r.run === run && r.originLabel === "candidate");
    if (!b || !c) continue;
    paired.push({
      profile: profile.id,
      run,
      baselineLcp: b.lcpMs,
      candidateLcp: c.lcpMs,
      delta: b.lcpMs != null && c.lcpMs != null ? c.lcpMs - b.lcpMs : null,
      candidateSlower: b.lcpMs != null && c.lcpMs != null ? c.lcpMs > b.lcpMs : null,
      baselineLcpElement: b.lcpElement,
      candidateLcpElement: c.lcpElement
    });
  }
}

const rows = profiles.map((profile) => {
  const cand = summary.find((s) => s.profile === profile.id && s.originLabel === "candidate");
  const base = summary.find((s) => s.profile === profile.id && s.originLabel === "baseline");
  const pair = paired.filter((p) => p.profile === profile.id);
  const slower = pair.filter((p) => p.candidateSlower).length;
  return {
    profile: profile.id,
    lcpCandidateMedian: cand?.lcp?.median ?? null,
    lcpBaselineMedian: base?.lcp?.median ?? null,
    lcpDeltaMedian:
      cand?.lcp?.median != null && base?.lcp?.median != null
        ? Math.round((cand.lcp.median - base.lcp.median) * 10) / 10
        : null,
    candidateSlowerPairs: `${slower}/${pair.length}`,
    pairDeltas: pair.map((p) => p.delta),
    fcpCandidateMedian: cand?.fcp?.median ?? null,
    fcpBaselineMedian: base?.fcp?.median ?? null,
    jsonLdCharsCandidate: cand?.jsonLdChars?.median ?? null,
    jsonLdCharsBaseline: base?.jsonLdChars?.median ?? null,
    h1HtmlIndexCandidate: cand?.h1HtmlIndex?.median ?? null,
    h1HtmlIndexBaseline: base?.h1HtmlIndex?.median ?? null,
    lcpIsH1: `${cand?.lcpIsH1Count}/${cand?.validRuns}`,
    portraitFound: `${cand?.portraitFoundCount}/${cand?.validRuns}`
  };
});

const payload = {
  method: "CTO15 directed H1 LCP probe",
  label: LABEL,
  path: PATH,
  candidateOrigin: CANDIDATE,
  baselineOrigin: BASELINE,
  chrome,
  runsPerCell: RUNS,
  startedAt,
  finishedAt: new Date().toISOString(),
  durationMs: Date.now() - t0,
  comparedToCto13: {
    desktop: { baselineMedian: 232, candidateMedian: 312, delta: 80 },
    mobile: { baselineMedian: 1272, candidateMedian: 1540, delta: 268 }
  },
  rows,
  paired,
  summary,
  raw
};

const outName = `perf-dd-h1-probe-${LABEL}.json`;
writeFileSync(join(outDir, outName), JSON.stringify(payload, null, 2));
writeFileSync(
  join(outDir, `perf-dd-h1-probe-${LABEL}-summary.json`),
  JSON.stringify({ comparedAt: payload.finishedAt, chrome, label: LABEL, rows, paired }, null, 2)
);
console.log(JSON.stringify({ outName, chrome, rows, slowerPairs: paired.filter((p) => p.candidateSlower).length + "/" + paired.length }, null, 2));
