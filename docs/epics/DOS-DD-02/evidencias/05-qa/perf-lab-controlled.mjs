/**
 * DOS-DD-02.05 R1/R2 — laboratório controlado (parecer CTO 13)
 *
 * - PerformanceObserver buffered para LCP, layout-shift e longtask (antes da navegação)
 * - LCP real; sem fallback FCP; execução marcada inválida se LCP ausente
 * - CLS por janelas de sessão (gap 1s / janela 5s), exclui hadRecentInput
 * - Compara candidato local × baseline 7fec6b2 local (ambientes equivalentes)
 * - Ordem alternada por run; 5 execuções/célula; medianas + dispersão
 * - CSS filtrado por .css; documento incluso no transfer total
 *
 * Proxy de bloqueio = soma (duration-50) das long tasks >50ms. Não é TBT Lighthouse.
 *
 * Uso:
 *   node perf-lab-controlled.mjs --candidate=http://127.0.0.1:3025 --baseline=http://127.0.0.1:3024
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync, renameSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const RUNS = 5;

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
  })
);

const CANDIDATE = args.candidate || "http://127.0.0.1:3025";
const BASELINE = args.baseline || "http://127.0.0.1:3024";

const pages = [
  { id: "home", path: "/" },
  { id: "due-diligence", path: "/due-diligence-imobiliaria" },
  { id: "imobiliarias", path: "/assessoria-juridica-para-imobiliarias" },
  { id: "compra", path: "/assessoria-juridica-compra-de-imovel" }
];

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
window.__perf = {
  lcp: null,
  lcpTime: 0,
  lcpElement: null,
  lcpSize: null,
  lcpUrl: null,
  lcpEntries: [],
  shifts: [],
  long: [],
  support: { lcp: false, layoutShift: false, longtask: false },
  errors: []
};
try {
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__perf.lcpEntries.push({
        startTime: e.startTime,
        size: e.size,
        url: e.url || null,
        id: e.id || null
      });
      if (e.startTime >= window.__perf.lcpTime) {
        window.__perf.lcp = e.startTime;
        window.__perf.lcpTime = e.startTime;
        window.__perf.lcpSize = e.size;
        window.__perf.lcpUrl = e.url || null;
        window.__perf.lcpElement = e.element
          ? (e.element.tagName
            + (e.element.className ? "." + String(e.element.className).trim().split(/\\s+/).join(".") : "")
            + " :: " + String(e.element.currentSrc || e.element.src || e.element.textContent || "").slice(0, 120))
          : null;
      }
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  window.__perf.support.lcp = true;
} catch (err) { window.__perf.errors.push("lcp:" + String(err)); }
try {
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__perf.shifts.push({
        t: e.startTime,
        v: e.value,
        hadInput: Boolean(e.hadRecentInput)
      });
    }
  }).observe({ type: "layout-shift", buffered: true });
  window.__perf.support.layoutShift = true;
} catch (err) { window.__perf.errors.push("cls:" + String(err)); }
try {
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__perf.long.push({ start: e.startTime, dur: e.duration });
    }
  }).observe({ type: "longtask", buffered: true });
  window.__perf.support.longtask = true;
} catch (err) { window.__perf.errors.push("longtask:" + String(err)); }
`;

const COLLECT = `(() => {
  const nav = performance.getEntriesByType("navigation")[0] || {};
  const res = performance.getEntriesByType("resource");
  const sum = (arr, f) => arr.reduce((a, x) => a + (f(x) || 0), 0);
  const isScript = (r) => r.initiatorType === "script" || /\\.js(\\?|$)/.test(r.name);
  const isCss = (r) => /\\.css(\\?|$)/.test(r.name) || (r.initiatorType === "link" && /\\.css(\\?|$)/.test(r.name));
  const shifts = (window.__perf.shifts || []).filter((s) => !s.hadInput);
  let cls = 0, cur = 0, first = null, last = null;
  const windows = [];
  for (const s of shifts) {
    if (first === null) { first = s.t; last = s.t; cur = s.v; }
    else if (s.t - last < 1000 && s.t - first < 5000) { cur += s.v; last = s.t; }
    else {
      windows.push({ start: first, end: last, value: cur });
      cls = Math.max(cls, cur);
      first = s.t; last = s.t; cur = s.v;
    }
  }
  if (first !== null) {
    windows.push({ start: first, end: last, value: cur });
    cls = Math.max(cls, cur);
  }
  const p = window.__perf;
  const lcpValid = typeof p.lcp === "number" && p.lcp > 0 && p.support.lcp;
  const transferZeroSuspect = res.filter((r) => (r.transferSize || 0) === 0 && (r.encodedBodySize || 0) > 0).length;
  return {
    collectionValid: lcpValid && p.support.layoutShift,
    invalidReason: !p.support.lcp
      ? "lcp-observer-unsupported"
      : (!lcpValid ? "lcp-entry-missing" : (!p.support.layoutShift ? "cls-observer-unsupported" : null)),
    support: p.support,
    observerErrors: p.errors,
    ttfbMs: nav.responseStart != null ? Math.round(nav.responseStart) : null,
    loadMs: nav.loadEventEnd != null ? Math.round(nav.loadEventEnd) : null,
    lcpMs: lcpValid ? Math.round(p.lcp) : null,
    lcpElement: p.lcpElement,
    lcpUrl: p.lcpUrl,
    lcpSize: p.lcpSize,
    lcpEntryCount: (p.lcpEntries || []).length,
    lcpEntriesRaw: (p.lcpEntries || []).slice(-3),
    cls: Math.round(cls * 10000) / 10000,
    shiftCount: shifts.length,
    shiftWindows: windows,
    shiftsRaw: shifts.slice(0, 40),
    proxyMs: Math.round((p.long || []).filter((l) => l.dur > 50).reduce((a, l) => a + (l.dur - 50), 0)),
    longTasks: (p.long || []).map((l) => ({ start: Math.round(l.start), dur: Math.round(l.dur) })),
    longTaskCount: (p.long || []).filter((l) => l.dur > 50).length,
    measuredUntilMs: Math.round(performance.now()),
    documentTransferBytes: nav.transferSize || 0,
    transferBytes: Math.round((nav.transferSize || 0) + sum(res, (r) => r.transferSize)),
    encodedBytes: Math.round((nav.encodedBodySize || 0) + sum(res, (r) => r.encodedBodySize)),
    jsTransferBytes: Math.round(sum(res.filter(isScript), (r) => r.transferSize)),
    jsEncodedBytes: Math.round(sum(res.filter(isScript), (r) => r.encodedBodySize)),
    cssTransferBytes: Math.round(sum(res.filter(isCss), (r) => r.transferSize)),
    cssEncodedBytes: Math.round(sum(res.filter(isCss), (r) => r.encodedBodySize)),
    imageTransferBytes: Math.round(sum(res.filter((r) => r.initiatorType === "img" || /\\.(webp|png|jpg|jpeg|svg|avif)(\\?|$)/.test(r.name)), (r) => r.transferSize)),
    transferZeroSuspectCount: transferZeroSuspect,
    resourceCount: res.length,
    portraitFound: res.some((r) => /drielle-pereira-retrato-profissional\\.webp/.test(r.name))
  };
})()`;

function median(values) {
  const s = [...values].sort((a, b) => a - b);
  const n = s.length;
  if (!n) return null;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

function stats(values) {
  const clean = values.filter((v) => typeof v === "number" && Number.isFinite(v));
  if (!clean.length) return null;
  const med = median(clean);
  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const mean = clean.reduce((a, b) => a + b, 0) / clean.length;
  const sd = Math.sqrt(clean.reduce((a, b) => a + (b - mean) ** 2, 0) / clean.length);
  return {
    n: clean.length,
    median: Math.round(med * 100) / 100,
    mean: Math.round(mean * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    sd: Math.round(sd * 100) / 100,
    samples: clean
  };
}

async function measure(browser, origin, path, profile, label) {
  const context = await browser.newContext(
    profile.mobile
      ? {
          viewport: { width: 390, height: 844 },
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true
        }
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
    response = await page.goto(`${origin}${path}`, { waitUntil: "load", timeout: 90000 });
  } catch (err) {
    await context.close();
    return {
      originLabel: label,
      origin,
      path,
      profile: profile.id,
      status: null,
      wallMs: Date.now() - started,
      collectionValid: false,
      invalidReason: "navigation-failed:" + String(err),
      lcpMs: null,
      cls: null
    };
  }
  await page.waitForTimeout(profile.settleMs);
  const metrics = await page.evaluate(COLLECT);
  await context.close();
  return {
    originLabel: label,
    origin,
    path,
    profile: profile.id,
    status: response?.status() ?? null,
    wallMs: Date.now() - started,
    ...metrics
  };
}

function archiveInvalidated(name) {
  const src = join(outDir, name);
  if (!existsSync(src)) return;
  const dest = join(outDir, "INVALIDATED-" + name);
  if (existsSync(dest)) {
    renameSync(dest, join(outDir, `INVALIDATED-${Date.now()}-${name}`));
  }
  renameSync(src, dest);
}

// Preserve previous lab outputs with invalidation marker (do not edit numbers in place).
for (const name of ["perf-lab-raw.json", "perf-lab-summary.json", "perf-lab-console.txt", "perf-lab-run.log"]) {
  archiveInvalidated(name);
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const chromeVersion = await browser.version();
const raw = [];
const startedAt = new Date().toISOString();
const t0 = Date.now();

try {
  for (const profile of profiles) {
    for (const page of pages) {
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
          process.stdout.write(`${profile.id} ${page.id} run${run} ${label}\n`);
          const sample = await measure(browser, origin, page.path, profile, label);
          raw.push({
            ...sample,
            page: page.id,
            run,
            orderPosition: order.findIndex((x) => x[0] === label) + 1
          });
          process.stdout.write(
            `  → valid=${sample.collectionValid} LCP=${sample.lcpMs} CLS=${sample.cls} proxy=${sample.proxyMs} TTFB=${sample.ttfbMs}\n`
          );
        }
      }
    }
  }
} finally {
  await browser.close();
}

const cells = {};
for (const r of raw) {
  const key = `${r.page}|${r.profile}|${r.originLabel}`;
  (cells[key] ??= []).push(r);
}

const summary = Object.entries(cells).map(([key, rows]) => {
  const [page, profile, originLabel] = key.split("|");
  const validRows = rows.filter((r) => r.collectionValid);
  return {
    page,
    profile,
    originLabel,
    runs: rows.length,
    validRuns: validRows.length,
    invalidRuns: rows.length - validRows.length,
    lcp: stats(validRows.map((r) => r.lcpMs)),
    cls: stats(validRows.map((r) => r.cls)),
    proxyMs: stats(validRows.map((r) => r.proxyMs)),
    ttfbMs: stats(validRows.map((r) => r.ttfbMs)),
    transferKb: stats(validRows.map((r) => (r.transferBytes || 0) / 1024)),
    jsTransferKb: stats(validRows.map((r) => (r.jsTransferBytes || 0) / 1024)),
    jsEncodedKb: stats(validRows.map((r) => (r.jsEncodedBytes || 0) / 1024)),
    cssTransferKb: stats(validRows.map((r) => (r.cssTransferBytes || 0) / 1024)),
    imageTransferKb: stats(validRows.map((r) => (r.imageTransferBytes || 0) / 1024)),
    lcpElements: [...new Set(validRows.map((r) => r.lcpElement).filter(Boolean))].slice(0, 4),
    transferZeroSuspectMax: Math.max(0, ...rows.map((r) => r.transferZeroSuspectCount || 0))
  };
});

const rows = [];
for (const page of pages) {
  for (const profile of profiles) {
    const cand = summary.find((c) => c.page === page.id && c.profile === profile.id && c.originLabel === "candidate");
    const base = summary.find((c) => c.page === page.id && c.profile === profile.id && c.originLabel === "baseline");
    const delta = (a, b) =>
      a?.median != null && b?.median != null ? Math.round((a.median - b.median) * 100) / 100 : null;
    rows.push({
      page: page.id,
      profile: profile.id,
      lcpCandidateMedian: cand?.lcp?.median ?? null,
      lcpBaselineMedian: base?.lcp?.median ?? null,
      lcpDeltaMedian: delta(cand?.lcp, base?.lcp),
      lcpCandidateRange: cand?.lcp ? [cand.lcp.min, cand.lcp.max] : null,
      lcpBaselineRange: base?.lcp ? [base.lcp.min, base.lcp.max] : null,
      lcpCandidateSd: cand?.lcp?.sd ?? null,
      lcpBaselineSd: base?.lcp?.sd ?? null,
      clsCandidateMedian: cand?.cls?.median ?? null,
      clsBaselineMedian: base?.cls?.median ?? null,
      proxyCandidateMedian: cand?.proxyMs?.median ?? null,
      proxyBaselineMedian: base?.proxyMs?.median ?? null,
      ttfbCandidateMedian: cand?.ttfbMs?.median ?? null,
      ttfbBaselineMedian: base?.ttfbMs?.median ?? null,
      jsTransferCandidateMedianKb: cand?.jsTransferKb?.median ?? null,
      jsTransferBaselineMedianKb: base?.jsTransferKb?.median ?? null,
      jsEncodedCandidateMedianKb: cand?.jsEncodedKb?.median ?? null,
      jsEncodedBaselineMedianKb: base?.jsEncodedKb?.median ?? null,
      cssTransferCandidateMedianKb: cand?.cssTransferKb?.median ?? null,
      cssTransferBaselineMedianKb: base?.cssTransferKb?.median ?? null,
      transferCandidateMedianKb: cand?.transferKb?.median ?? null,
      transferBaselineMedianKb: base?.transferKb?.median ?? null,
      validCandidateRuns: cand?.validRuns ?? 0,
      validBaselineRuns: base?.validRuns ?? 0
    });
  }
}

const payload = {
  method: "DOS-DD-02.05 controlled lab (CTO 13 R1/R2)",
  invalidatesPriorLab: {
    note: "LCP/CLS da bateria anterior (localhost×CDN, getEntriesByType/FCP fallback) são inválidos. Arquivos preservados com prefixo INVALIDATED-.",
    files: [
      "INVALIDATED-perf-lab-raw.json",
      "INVALIDATED-perf-lab-summary.json",
      "INVALIDATED-perf-lab-console.txt",
      "INVALIDATED-perf-lab-run.log"
    ]
  },
  candidateOrigin: CANDIDATE,
  baselineOrigin: BASELINE,
  candidateLabel: "qa/dos-dd-02-05 worktree uncommitted @ base 7fec6b2 (manifesto fechado)",
  baselineLabel: "isolated worktree detached 7fec6b2 production build",
  chrome: chromeVersion,
  runsPerCell: RUNS,
  order: "alternating baseline/candidate by run parity",
  blockedExternal: ["googletagmanager", "google-analytics", "vercel-insights", "va.vercel-scripts"],
  startedAt,
  finishedAt: new Date().toISOString(),
  durationMs: Date.now() - t0,
  raw,
  summary,
  rows
};

writeFileSync(join(outDir, "perf-lab-controlled-raw.json"), JSON.stringify(payload, null, 2));
writeFileSync(
  join(outDir, "perf-lab-controlled-summary.json"),
  JSON.stringify(
    {
      comparedAt: payload.finishedAt,
      chrome: chromeVersion,
      candidateOrigin: CANDIDATE,
      baselineOrigin: BASELINE,
      rows
    },
    null,
    2
  )
);
console.log(JSON.stringify({ comparedAt: payload.finishedAt, chrome: chromeVersion, rows }, null, 2));
