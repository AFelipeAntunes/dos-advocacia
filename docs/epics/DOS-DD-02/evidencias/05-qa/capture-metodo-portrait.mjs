/**
 * Capturas da seção método com retrato — DOS-DD-02.05
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const origin = "http://127.0.0.1:3025";

const browser = await chromium.launch({ headless: true });
const report = { captures: [] };

async function capture(name, viewport) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: viewport.width <= 390 ? 2 : 1
  });
  try {
    const page = await context.newPage();
    await page.goto(`${origin}/due-diligence-imobiliaria`, { waitUntil: "networkidle", timeout: 60000 });
    await page.addStyleTag({
      content: ".site-header,.site-nav-toggle{visibility:hidden!important;pointer-events:none!important}"
    });
    const section = page.locator('section[aria-labelledby="metodo-title"]');
    await section.evaluate((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo(0, Math.max(0, top));
    });
    await page.waitForTimeout(500);
    const img = section.locator("img");
    await img.waitFor({ state: "visible", timeout: 15000 });
    const meta = await img.evaluate((el) => ({
      src: el.getAttribute("src"),
      alt: el.getAttribute("alt"),
      width: el.getAttribute("width"),
      height: el.getAttribute("height"),
      loading: el.getAttribute("loading"),
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      complete: el.complete
    }));
    const layout = await section.evaluate((el) => {
      const grid = el.querySelector(".dd-method-layout");
      const style = grid ? getComputedStyle(grid) : null;
      const figure = el.querySelector("figure");
      const copy = el.querySelector(".dd-method-copy");
      const fr = figure?.getBoundingClientRect();
      const cr = copy?.getBoundingClientRect();
      return {
        columns: style?.gridTemplateColumns,
        figureTop: fr?.top ?? null,
        copyTop: cr?.top ?? null,
        figureLeft: fr?.left ?? null,
        copyLeft: cr?.left ?? null,
        photoAboveText: fr != null && cr != null ? fr.bottom <= cr.top + 8 : null,
        photoBesideText: fr != null && cr != null ? Math.abs(fr.top - cr.top) < 120 && fr.right <= cr.left + 8 : null
      };
    });
    const file = join(outDir, name);
    await section.screenshot({ path: file });
    return { file: name, meta, layout, viewport };
  } finally {
    await context.close().catch(() => {});
  }
}

try {
  const desktop = await capture("metodo-portrait-desktop-1440.png", { width: 1440, height: 900 });
  const mobile = await capture("metodo-portrait-mobile-390.png", { width: 390, height: 844 });
  report.captures.push(desktop, mobile);
  writeFileSync(join(outDir, "metodo-portrait-meta.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close().catch(() => {});
}
