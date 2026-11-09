/**
 * Laboratório de velocidade DOS-DD-02.05
 * Método alinhado a DOS-SEO-01/12-preview-real/performance.md:
 * - Chrome headless Playwright
 * - cold: novo contexto a cada run
 * - mobile: 390x844, deviceScaleFactor 2, CPU 4x, 1.6Mbps/750kbps/150ms RTT
 * - desktop: 1440x900, sem throttling
 * - 5 execuções por célula
 * Proxy de bloqueio = soma (duration-50) das long tasks >50ms na janela pós-load (não é TBT Lighthouse).
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const RUNS = 5;
const CANDIDATE = "http://127.0.0.1:3025";
const BASELINE = "https://www.dosadvocacia.com.br";

const pages = [
  { id: "home", path: "/" },
  { id: "due-diligence", path: "/due-diligence-imobiliaria" },
  { id: "imobiliarias", path: "/assessoria-juridica-para-imobiliarias" },
  { id: "compra", path: "/assessoria-juridica-compra-de-imovel" }
];

const profiles = [
  { id: "desktop-cold", mobile: false },
  { id: "mobile-cold", mobile: true }
];

async function measure(browser, origin, path, profile) {
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
  await cdp.send("Performance.enable");
  if (profile.mobile) {
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      latency: 150
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }

  await page.addInitScript(() => {
    window.__longTasks = [];
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) window.__longTasks.push(entry.duration);
        }
      });
      observer.observe({ type: "longtask", buffered: true });
    } catch {}
  });

  const started = Date.now();
  const response = await page.goto(`${origin}${path}`, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(2000);
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paints = performance.getEntriesByType("paint");
    const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
    const lcp = lcpEntries.at(-1)?.startTime ?? paints.find((p) => p.name === "first-contentful-paint")?.startTime ?? null;
    const cls = performance.getEntriesByType("layout-shift")
      .filter((e) => !e.hadRecentInput)
      .reduce((sum, e) => sum + e.value, 0);
    const longTasks = window.__longTasks || [];
    const proxy = longTasks.reduce((sum, d) => sum + Math.max(0, d - 50), 0);
    const transfer = performance.getEntriesByType("resource").reduce((sum, r) => sum + (r.transferSize || 0), 0);
    const js = performance.getEntriesByType("resource")
      .filter((r) => r.initiatorType === "script" || /\.js(\?|$)/.test(r.name))
      .reduce((sum, r) => sum + (r.transferSize || 0), 0);
    const css = performance.getEntriesByType("resource")
      .filter((r) => r.initiatorType === "link" || /\.css(\?|$)/.test(r.name))
      .reduce((sum, r) => sum + (r.transferSize || 0), 0);
    const portrait = performance.getEntriesByType("resource")
      .find((r) => /drielle-pereira-retrato-profissional\.webp/.test(r.name));
    return {
      lcpMs: lcp == null ? null : Math.round(lcp),
      cls: Number(cls.toFixed(4)),
      ttfbMs: nav ? Math.round(nav.responseStart) : null,
      proxyMs: Math.round(proxy),
      jsKb: Number((js / 1024).toFixed(2)),
      cssKb: Number((css / 1024).toFixed(2)),
      transferKb: Number((transfer / 1024).toFixed(2)),
      longTaskCount: longTasks.length,
      portraitProfissionalFound: Boolean(portrait),
      portraitProfissionalTransferKb: portrait
        ? Number(((portrait.transferSize || 0) / 1024).toFixed(2))
        : null,
      portraitProfissionalDurationMs: portrait ? Math.round(portrait.duration) : null
    };
  });

  await context.close();
  return {
    status: response?.status() ?? null,
    elapsedMs: Date.now() - started,
    ...metrics
  };
}

function summarize(samples) {
  const nums = (key) => samples.map((s) => s[key]).filter((v) => typeof v === "number");
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
  const pick = (key) => {
    const arr = nums(key);
    return {
      min: arr.length ? Math.min(...arr) : null,
      max: arr.length ? Math.max(...arr) : null,
      avg: arr.length ? Number(avg(arr).toFixed(1)) : null,
      samples: arr
    };
  };
  return {
    lcpMs: pick("lcpMs"),
    cls: pick("cls"),
    ttfbMs: pick("ttfbMs"),
    proxyMs: pick("proxyMs"),
    jsKb: pick("jsKb"),
    cssKb: pick("cssKb")
  };
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const results = {
  method: "playwright-lab DOS-DD-02.05",
  candidateOrigin: CANDIDATE,
  baselineOrigin: BASELINE,
  candidateShaBase: "7fec6b2 + uncommitted 03+04 local",
  baselineLabel: "production www.dosadvocacia.com.br (publicado)",
  runsPerCell: RUNS,
  startedAt: new Date().toISOString(),
  cells: []
};

for (const profile of profiles) {
  for (const page of pages) {
    for (const [label, origin] of [["candidate", CANDIDATE], ["baseline", BASELINE]]) {
      const samples = [];
      for (let i = 0; i < RUNS; i += 1) {
        process.stdout.write(`${profile.id} ${label} ${page.id} #${i + 1}\n`);
        samples.push(await measure(browser, origin, page.path, profile));
      }
      results.cells.push({
        page: page.id,
        path: page.path,
        profile: profile.id,
        origin: label,
        summary: summarize(samples),
        samples
      });
    }
  }
}

results.finishedAt = new Date().toISOString();
writeFileSync(join(outDir, "perf-lab-raw.json"), JSON.stringify(results, null, 2));

const rows = [];
for (const page of pages) {
  for (const profile of profiles) {
    const cand = results.cells.find((c) => c.page === page.id && c.profile === profile.id && c.origin === "candidate");
    const base = results.cells.find((c) => c.page === page.id && c.profile === profile.id && c.origin === "baseline");
    rows.push({
      page: page.id,
      profile: profile.id,
      lcpCandidateAvg: cand.summary.lcpMs.avg,
      lcpBaselineAvg: base.summary.lcpMs.avg,
      lcpDelta: cand.summary.lcpMs.avg != null && base.summary.lcpMs.avg != null
        ? Number((cand.summary.lcpMs.avg - base.summary.lcpMs.avg).toFixed(1))
        : null,
      clsCandidateAvg: cand.summary.cls.avg,
      clsBaselineAvg: base.summary.cls.avg,
      proxyCandidateAvg: cand.summary.proxyMs.avg,
      proxyBaselineAvg: base.summary.proxyMs.avg,
      ttfbCandidateAvg: cand.summary.ttfbMs.avg,
      ttfbBaselineAvg: base.summary.ttfbMs.avg,
      jsCandidateAvgKb: cand.summary.jsKb.avg,
      jsBaselineAvgKb: base.summary.jsKb.avg,
      cssCandidateAvgKb: cand.summary.cssKb.avg,
      cssBaselineAvgKb: base.summary.cssKb.avg
    });
  }
}
writeFileSync(join(outDir, "perf-lab-summary.json"), JSON.stringify({ comparedAt: results.finishedAt, rows }, null, 2));
console.log(JSON.stringify({ comparedAt: results.finishedAt, rows }, null, 2));
await browser.close();
