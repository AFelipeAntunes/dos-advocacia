/**
 * Sonda dirigida do retrato (CTO 13 R1):
 * scroll até a seção método, acompanha shifts durante scroll/decodificação,
 * confirma carga lazy do WebP com dimensões reservadas.
 *
 * Compara candidato local × baseline local (não CDN) quando --baseline for passado.
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
const ASSET = "drielle-pereira-retrato-profissional.webp";

const INIT = `
window.__perf = { shifts: [], support: false };
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
  window.__perf.support = true;
} catch {}
`;

function sessionCls(shifts) {
  const clean = shifts.filter((s) => !s.hadInput);
  let cls = 0;
  let cur = 0;
  let first = null;
  let last = null;
  for (const s of clean) {
    if (first === null) {
      first = s.t;
      last = s.t;
      cur = s.v;
    } else if (s.t - last < 1000 && s.t - first < 5000) {
      cur += s.v;
      last = s.t;
    } else {
      cls = Math.max(cls, cur);
      first = s.t;
      last = s.t;
      cur = s.v;
    }
  }
  if (first !== null) cls = Math.max(cls, cur);
  return { cls: Math.round(cls * 10000) / 10000, shiftCount: clean.length, shifts: clean };
}

async function probe(browser, origin, mobile, label) {
  const context = await browser.newContext(
    mobile
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      : { viewport: { width: 1440, height: 900 } }
  );
  const page = await context.newPage();
  await page.addInitScript(INIT);
  await page.goto(`${origin}/due-diligence-imobiliaria`, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(800);

  const before = await page.evaluate(() => ({
    support: window.__perf?.support || false,
    shifts: [...(window.__perf?.shifts || [])]
  }));

  const section = page.locator('section[aria-labelledby="metodo-title"]');
  const sectionExists = (await section.count()) > 0;
  let imgMeta = null;
  let resource = null;
  let afterScroll = null;

  if (sectionExists) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    const img = section.locator("img");
    if ((await img.count()) > 0) {
      await img.waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
      imgMeta = await img.evaluate((el) => ({
        src: el.getAttribute("src"),
        alt: el.getAttribute("alt"),
        widthAttr: el.getAttribute("width"),
        heightAttr: el.getAttribute("height"),
        loading: el.getAttribute("loading"),
        decoding: el.getAttribute("decoding"),
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
        complete: el.complete,
        clientWidth: el.clientWidth,
        clientHeight: el.clientHeight
      }));
    }
    afterScroll = await page.evaluate((asset) => {
      const entry = performance.getEntriesByType("resource").find((r) => r.name.includes(asset));
      return {
        support: window.__perf?.support || false,
        shifts: [...(window.__perf?.shifts || [])],
        resource: entry
          ? {
              name: entry.name,
              transferKb: Number(((entry.transferSize || 0) / 1024).toFixed(2)),
              encodedBodyKb: Number(((entry.encodedBodySize || 0) / 1024).toFixed(2)),
              durationMs: Math.round(entry.duration)
            }
          : null
      };
    }, ASSET);
    resource = afterScroll.resource;
  }

  const clsBefore = sessionCls(before.shifts || []);
  const clsAfter = sessionCls(afterScroll?.shifts || before.shifts || []);
  await context.close();

  return {
    label,
    origin,
    mobile,
    sectionExists,
    imgMeta,
    resource,
    observerSupport: before.support,
    clsBeforeScroll: clsBefore.cls,
    clsAfterScrollDecode: clsAfter.cls,
    shiftCountBefore: clsBefore.shiftCount,
    shiftCountAfter: clsAfter.shiftCount,
    shiftsDuringProbe: clsAfter.shifts.slice(0, 20),
    dimensionsReserved:
      imgMeta != null &&
      imgMeta.widthAttr === "1600" &&
      imgMeta.heightAttr === "1600" &&
      Number(imgMeta.clientWidth) > 0 &&
      Number(imgMeta.clientHeight) > 0
  };
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const chrome = await browser.version();
const samples = [];
try {
  samples.push(await probe(browser, CANDIDATE, false, "candidate"));
  samples.push(await probe(browser, CANDIDATE, true, "candidate"));
  samples.push(await probe(browser, BASELINE, false, "baseline"));
  samples.push(await probe(browser, BASELINE, true, "baseline"));
} finally {
  await browser.close();
}

const results = {
  probedAt: new Date().toISOString(),
  chrome,
  asset: ASSET,
  note: "CLS zero no cold load sem scroll não prova ausência de shift no lazy load; esta sonda acompanha shifts no scroll/decodificação.",
  samples
};

writeFileSync(join(outDir, "perf-portrait-scroll.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
