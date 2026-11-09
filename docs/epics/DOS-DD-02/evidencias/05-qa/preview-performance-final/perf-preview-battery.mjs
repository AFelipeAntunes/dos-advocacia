/**
 * CTO22/CTO20 — 80 medições Preview: 10× × baseline/candidate × desktop/mobile × frio/quente.
 * Auth: OIDC extraHTTPHeaders + CDP blocklist (sem route, cache quente real).
 * LCP via PerformanceObserver buffered; sem fallback FCP. Proxy≠TBT.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const RUNS = Number(process.env.RUNS || 10);
const PATH = "/due-diligence-imobiliaria";
const CANDIDATE = "https://dos-advocacia-fp0125m2c-dos-advocacia.vercel.app";
const BASELINE = "https://dos-advocacia-n7nukp43d-dos-advocacia.vercel.app";
const ALLOWED = new Set([CANDIDATE, BASELINE]);

const BLOCKED = [
  "*googletagmanager.com*",
  "*google-analytics.com*",
  "*googleapis.com*",
  "*gstatic.com*",
  "*fonts.googleapis.com*",
  "*fonts.gstatic.com*",
  "*vercel-insights.com*",
  "*va.vercel-scripts.com*",
  "*vercel.live*",
  "*facebook.net*",
  "*doubleclick.net*",
  "*hotjar.com*",
  "*clarity.ms*"
];

function loadOidc() {
  const tmp = join(process.cwd(), ".vercel-oidc-token.tmp");
  if (existsSync(tmp)) {
    const t = readFileSync(tmp, "utf8").trim();
    if (t) return t;
  }
  return process.env.VERCEL_OIDC_TOKEN || "";
}

const oidc = loadOidc();
if (!oidc) {
  console.error("missing OIDC token");
  process.exit(1);
}

const profiles = [
  {
    id: "desktop-cold",
    mobile: false,
    warm: false,
    settleMs: 1800,
    viewport: { width: 1440, height: 900 }
  },
  {
    id: "desktop-warm",
    mobile: false,
    warm: true,
    settleMs: 1800,
    viewport: { width: 1440, height: 900 }
  },
  {
    id: "mobile-cold",
    mobile: true,
    warm: false,
    settleMs: 3500,
    viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  },
  {
    id: "mobile-warm",
    mobile: true,
    warm: true,
    settleMs: 3500,
    viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  }
];

const INIT = `
window.__perf = {
  lcp: null, lcpTime: 0, lcpElement: null, lcpSize: null, lcpUrl: null, lcpEntries: [],
  shifts: [], long: [],
  support: { lcp: false, layoutShift: false, longtask: false },
  errors: []
};
try {
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__perf.lcpEntries.push({ startTime: e.startTime, size: e.size, url: e.url || null });
      if (e.startTime >= window.__perf.lcpTime) {
        window.__perf.lcp = e.startTime;
        window.__perf.lcpTime = e.startTime;
        window.__perf.lcpSize = e.size;
        window.__perf.lcpUrl = e.url || null;
        window.__perf.lcpElement = e.element
          ? ((e.element.id ? "#" + e.element.id : e.element.tagName)
            + " :: " + String(e.element.textContent || "").trim().slice(0, 100))
          : null;
      }
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  window.__perf.support.lcp = true;
} catch (err) { window.__perf.errors.push("lcp:" + String(err)); }
try {
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__perf.shifts.push({ t: e.startTime, v: e.value, hadInput: Boolean(e.hadRecentInput) });
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
  const isCss = (r) => /\\.css(\\?|$)/.test(r.name);
  const shifts = (window.__perf.shifts || []).filter((s) => !s.hadInput);
  let cls = 0, cur = 0, first = null, last = null;
  for (const s of shifts) {
    if (first === null) { first = s.t; last = s.t; cur = s.v; }
    else if (s.t - last < 1000 && s.t - first < 5000) { cur += s.v; last = s.t; }
    else { cls = Math.max(cls, cur); first = s.t; last = s.t; cur = s.v; }
  }
  if (first !== null) cls = Math.max(cls, cur);
  const p = window.__perf;
  const lcpValid = typeof p.lcp === "number" && p.lcp > 0 && p.support.lcp;
  const cachedLike = res.filter((r) => (r.transferSize || 0) === 0 && (r.encodedBodySize || 0) > 0).length;
  const h1 = document.getElementById("page-title")?.textContent?.trim() || null;
  const isSso = /vercel\\.com\\/sso|Sign in to Vercel|Authentication Required|Deployment Protection/i.test(document.documentElement.outerHTML);
  return {
    collectionValid: lcpValid && p.support.layoutShift && !isSso,
    invalidReason: isSso ? "sso-page" : (!p.support.lcp ? "lcp-observer-unsupported" : (!lcpValid ? "lcp-entry-missing" : (!p.support.layoutShift ? "cls-observer-unsupported" : null))),
    support: p.support,
    observerErrors: p.errors,
    h1,
    isSso,
    ttfbMs: nav.responseStart != null ? Math.round(nav.responseStart) : null,
    loadMs: nav.loadEventEnd != null ? Math.round(nav.loadEventEnd) : null,
    lcpMs: lcpValid ? Math.round(p.lcp) : null,
    lcpElement: p.lcpElement,
    lcpUrl: p.lcpUrl,
    lcpSize: p.lcpSize,
    lcpIsH1: Boolean(p.lcpElement && /#page-title|H1/i.test(p.lcpElement)),
    cls: Math.round(cls * 10000) / 10000,
    proxyMs: Math.round((p.long || []).filter((l) => l.dur > 50).reduce((a, l) => a + (l.dur - 50), 0)),
    longTaskCount: (p.long || []).filter((l) => l.dur > 50).length,
    measuredUntilMs: Math.round(performance.now()),
    documentTransferBytes: nav.transferSize || 0,
    transferBytes: Math.round((nav.transferSize || 0) + sum(res, (r) => r.transferSize)),
    encodedBytes: Math.round((nav.encodedBodySize || 0) + sum(res, (r) => r.encodedBodySize)),
    jsTransferBytes: Math.round(sum(res.filter(isScript), (r) => r.transferSize)),
    cssTransferBytes: Math.round(sum(res.filter(isCss), (r) => r.transferSize)),
    cachedLikeResourceCount: cachedLike,
    resourceCount: res.length,
    hasDdLcpOpt: Boolean(document.querySelector("[data-dd-lcp-opt], .dd-lcp-opt")),
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

async function measureOnce(browser, origin, label, profile, run, orderPosition) {
  const contextOpts = profile.mobile
    ? {
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": oidc }
      }
    : {
        viewport: { width: 1440, height: 900 },
        extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": oidc }
      };

  const context = await browser.newContext(contextOpts);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setBlockedURLs", { urls: BLOCKED });

  const externalCompleted = [];
  cdp.on("Network.responseReceived", (e) => {
    try {
      const u = new URL(e.response.url);
      if (!ALLOWED.has(u.origin) && !e.response.url.startsWith("data:")) {
        externalCompleted.push(u.origin);
      }
    } catch {
      /* ignore */
    }
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
  if (profile.warm) {
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: false });
    try {
      await page.goto(`${origin}${PATH}`, { waitUntil: "load", timeout: 90000 });
      await page.waitForTimeout(Math.min(profile.settleMs, 1200));
    } catch {
      /* warm-up failure handled on measured nav */
    }
  } else {
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.clearBrowserCache").catch(() => {});
  }

  const started = Date.now();
  let response = null;
  try {
    if (profile.warm) {
      response = await page.reload({ waitUntil: "load", timeout: 90000 });
    } else {
      response = await page.goto(`${origin}${PATH}`, { waitUntil: "load", timeout: 90000 });
    }
  } catch (err) {
    await context.close();
    return {
      originLabel: label,
      origin,
      path: PATH,
      profile: profile.id,
      run,
      orderPosition,
      status: null,
      wallMs: Date.now() - started,
      collectionValid: false,
      invalidReason: "navigation-failed:" + String(err),
      lcpMs: null,
      cls: null,
      externalCompletedOrigins: [...new Set(externalCompleted)]
    };
  }

  await page.waitForTimeout(profile.settleMs);
  const metrics = await page.evaluate(COLLECT);
  const sample = {
    originLabel: label,
    origin,
    path: PATH,
    profile: profile.id,
    run,
    orderPosition,
    status: response?.status() ?? null,
    wallMs: Date.now() - started,
    externalCompletedOrigins: [...new Set(externalCompleted)],
    ...metrics
  };
  if ((sample.externalCompletedOrigins || []).length > 0 && sample.collectionValid) {
    sample.collectionValid = false;
    sample.invalidReason = "external-origin-completed";
  }
  await context.close();
  return sample;
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const chromeVersion = await browser.version();
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
      for (let i = 0; i < order.length; i += 1) {
        const [label, origin] = order[i];
        process.stdout.write(`${profile.id} run${run} ${label}\n`);
        const sample = await measureOnce(browser, origin, label, profile, run, i + 1);
        raw.push(sample);
        process.stdout.write(
          `  → valid=${sample.collectionValid} status=${sample.status} LCP=${sample.lcpMs} CLS=${sample.cls} proxy=${sample.proxyMs} cacheLike=${sample.cachedLikeResourceCount} h1IsLcp=${sample.lcpIsH1}\n`
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
  const validRows = rows.filter((r) => r.collectionValid);
  return {
    profile,
    originLabel,
    runs: rows.length,
    validRuns: validRows.length,
    invalidRuns: rows.length - validRows.length,
    invalidReasons: [...new Set(rows.filter((r) => !r.collectionValid).map((r) => r.invalidReason))],
    lcp: stats(validRows.map((r) => r.lcpMs)),
    cls: stats(validRows.map((r) => r.cls)),
    proxyMs: stats(validRows.map((r) => r.proxyMs)),
    ttfbMs: stats(validRows.map((r) => r.ttfbMs)),
    transferKb: stats(validRows.map((r) => (r.transferBytes || 0) / 1024)),
    jsTransferKb: stats(validRows.map((r) => (r.jsTransferBytes || 0) / 1024)),
    cssTransferKb: stats(validRows.map((r) => (r.cssTransferBytes || 0) / 1024)),
    cachedLike: stats(validRows.map((r) => r.cachedLikeResourceCount || 0)),
    lcpIsH1Rate: validRows.length
      ? Math.round((validRows.filter((r) => r.lcpIsH1).length / validRows.length) * 100) / 100
      : null,
    lcpElements: [...new Set(validRows.map((r) => r.lcpElement).filter(Boolean))].slice(0, 6),
    h1Samples: [...new Set(validRows.map((r) => r.h1).filter(Boolean))].slice(0, 2)
  };
});

const rows = [];
for (const profile of profiles) {
  const cand = summary.find((c) => c.profile === profile.id && c.originLabel === "candidate");
  const base = summary.find((c) => c.profile === profile.id && c.originLabel === "baseline");
  const delta = (a, b) =>
    a?.median != null && b?.median != null ? Math.round((a.median - b.median) * 100) / 100 : null;
  rows.push({
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
    transferCandidateMedianKb: cand?.transferKb?.median ?? null,
    transferBaselineMedianKb: base?.transferKb?.median ?? null,
    cachedLikeCandidateMedian: cand?.cachedLike?.median ?? null,
    cachedLikeBaselineMedian: base?.cachedLike?.median ?? null,
    validCandidateRuns: cand?.validRuns ?? 0,
    validBaselineRuns: base?.validRuns ?? 0,
    lcpIsH1Candidate: cand?.lcpIsH1Rate ?? null,
    lcpIsH1Baseline: base?.lcpIsH1Rate ?? null
  });
}

const payload = {
  method: "CTO22 Preview battery B (OIDC extraHTTPHeaders, no route, CDP blocklist)",
  references: {
    baseline: {
      url: BASELINE + PATH,
      sha: "753bad4f018ce44172eee5131ce1fee2dd8837e7",
      treeEqualsProduction: "7fec6b2fb2da7dc5408498099e7c4917aa33bb4d",
      tree: "e49e8c58cf6250c7d41d61b404b3c4fe5e231594"
    },
    candidate: {
      url: CANDIDATE + PATH,
      sha: "2abfbebab000a89250e0c18a29b06d0a161c6864"
    }
  },
  auth: {
    mode: "oidc",
    header: "x-vercel-trusted-oidc-idp-token",
    routeUsed: false,
    bypassUsed: false,
    blockedExternal: BLOCKED
  },
  chrome: chromeVersion,
  runsPerCell: RUNS,
  totalExpected: RUNS * 2 * profiles.length,
  totalActual: raw.length,
  order: "alternating baseline/candidate by run parity",
  cdp: {
    desktop: "no throttle",
    mobile: "CPU 4x; 1.6Mbps down / 750kbps up / 150ms RTT"
  },
  startedAt,
  finishedAt: new Date().toISOString(),
  durationMs: Date.now() - t0,
  raw,
  summary,
  rows
};

writeFileSync(join(outDir, "perf-preview-battery-raw.json"), JSON.stringify(payload, null, 2));
writeFileSync(
  join(outDir, "perf-preview-battery-summary.json"),
  JSON.stringify(
    {
      comparedAt: payload.finishedAt,
      chrome: chromeVersion,
      references: payload.references,
      auth: payload.auth,
      rows,
      summary
    },
    null,
    2
  )
);
console.log(JSON.stringify({ comparedAt: payload.finishedAt, totalActual: raw.length, rows }, null, 2));
