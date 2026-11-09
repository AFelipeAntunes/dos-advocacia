/**
 * CTO24 — prova da âncora #o-que-voce-recebe após scroll-margin scoped.
 * Clique no link + abertura direta do fragmento em 390/768/1000/1440.
 * Falha se o topo do H2 não ficar abaixo do fundo do header ou se o título
 * não couber na área visível sob o header.
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const ORIGIN = process.env.SMOKE_ORIGIN || process.argv.find((a) => a.startsWith("--origin="))?.slice(9) || "http://127.0.0.1:3025";
const PATH = "/due-diligence-imobiliaria";
const ANCHOR = "o-que-voce-recebe";

const viewports = [
  { id: "390", width: 390, height: 844, mobile: true },
  { id: "768", width: 768, height: 1024, mobile: true },
  { id: "1000", width: 1000, height: 800, mobile: false },
  { id: "1440", width: 1440, height: 900, mobile: false }
];

async function settle(page) {
  await page.waitForTimeout(400);
  await page.evaluate(() => document.fonts?.ready?.catch?.(() => {}));
  await page.waitForTimeout(300);
}

async function measure(page) {
  return page.evaluate((anchorId) => {
    const heading = document.getElementById(anchorId);
    const header = document.querySelector(".site-header") || document.querySelector("header");
    const vh = window.innerHeight;
    const headerBox = header ? header.getBoundingClientRect() : null;
    const headerBottom = headerBox ? headerBox.bottom : 0;
    if (!heading) {
      return { headingExists: false, headerBottom, viewportHeight: vh };
    }
    const r = heading.getBoundingClientRect();
    const cs = getComputedStyle(heading);
    const belowHeader = r.top >= headerBottom - 0.5;
    const fitsVisible = r.bottom <= vh && r.height > 0 && r.top < vh;
    const readable =
      belowHeader &&
      fitsVisible &&
      cs.visibility !== "hidden" &&
      cs.display !== "none" &&
      parseFloat(cs.opacity || "1") > 0;
    return {
      headingExists: true,
      text: (heading.textContent || "").trim(),
      hash: location.hash,
      scrollMarginTop: cs.scrollMarginTop,
      header: headerBox
        ? {
            top: Math.round(headerBox.top),
            bottom: Math.round(headerBox.bottom),
            height: Math.round(headerBox.height)
          }
        : null,
      heading: {
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        height: Math.round(r.height)
      },
      viewportHeight: vh,
      belowHeader,
      fitsVisible,
      readable,
      gapBelowHeaderPx: Math.round(r.top - headerBottom)
    };
  }, ANCHOR);
}

async function runCase(browser, vp, mode) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.mobile ? 2 : 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile
  });
  const page = await context.newPage();
  let status = null;

  if (mode === "click") {
    const res = await page.goto(`${ORIGIN}${PATH}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    status = res?.status() ?? null;
    await settle(page);
    const link = page.locator(`a[href="#${ANCHOR}"]`, { hasText: "Ver o que a análise entrega" });
    if ((await link.count()) < 1) {
      await context.close();
      return {
        viewport: vp.id,
        mode,
        status,
        ok: false,
        failReasons: ["link-missing"]
      };
    }
    await link.first().click();
    await settle(page);
  } else {
    const res = await page.goto(`${ORIGIN}${PATH}#${ANCHOR}`, {
      waitUntil: "load",
      timeout: 90000
    });
    status = res?.status() ?? null;
    await settle(page);
    // Sem scroll JS: só o comportamento nativo do fragmento + scroll-margin CSS.
  }

  const m = await measure(page);
  const shotName = `anchor-cto24-${vp.id}-${mode}.png`;
  // Capturas obrigatórias 390/1440; demais também úteis
  if (vp.id === "390" || vp.id === "1440" || !m.readable) {
    await page.screenshot({ path: join(outDir, shotName), fullPage: false });
  }

  const ok =
    status === 200 &&
    m.headingExists &&
    m.hash === `#${ANCHOR}` &&
    m.text === "O que você recebe" &&
    m.belowHeader === true &&
    m.fitsVisible === true &&
    m.readable === true;

  await context.close();
  return {
    viewport: vp.id,
    mode,
    status,
    ok,
    failReasons: [
      status !== 200 ? "bad-status" : null,
      !m.headingExists ? "heading-missing" : null,
      m.hash !== `#${ANCHOR}` ? "hash-mismatch" : null,
      m.belowHeader !== true ? "covered-by-header" : null,
      m.fitsVisible !== true ? "title-not-fully-in-view" : null
    ].filter(Boolean),
    measure: m,
    screenshot: vp.id === "390" || vp.id === "1440" || !ok ? shotName : null
  };
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const chrome = await browser.version();
const results = [];
try {
  for (const vp of viewports) {
    for (const mode of ["click", "direct"]) {
      process.stdout.write(`${vp.id} ${mode}\n`);
      results.push(await runCase(browser, vp, mode));
    }
  }
} finally {
  await browser.close();
}

const ok = results.every((r) => r.ok);
const payload = {
  probedAt: new Date().toISOString(),
  chrome,
  origin: ORIGIN,
  selector: ".dd-lcp-opt #o-que-voce-recebe",
  method: "click link + direct fragment; assert H2.top >= header.bottom and title fits under header",
  ok,
  results
};

writeFileSync(join(outDir, "smoke-anchor-cto24.json"), JSON.stringify(payload, null, 2));
console.log(
  JSON.stringify(
    {
      ok,
      origin: ORIGIN,
      results: results.map((r) => ({
        viewport: r.viewport,
        mode: r.mode,
        ok: r.ok,
        fail: r.failReasons,
        headerBottom: r.measure?.header?.bottom,
        headingTop: r.measure?.heading?.top,
        gap: r.measure?.gapBelowHeaderPx,
        scrollMarginTop: r.measure?.scrollMarginTop
      }))
    },
    null,
    2
  )
);
process.exit(ok ? 0 : 2);
