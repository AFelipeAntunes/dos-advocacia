/**
 * Sonda dirigida do retrato profissional na landing DD — DOS-DD-02.05
 * O lab frio não rola até a seção; lazy loading exige scroll para observar o recurso.
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const CANDIDATE = "http://127.0.0.1:3025";
const BASELINE = "https://www.dosadvocacia.com.br";
const PATH = "/due-diligence-imobiliaria";
const RUNS = 3;

async function probe(browser, origin, profile) {
  const context = await browser.newContext(
    profile.mobile
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      : { viewport: { width: 1440, height: 900 } }
  );
  const page = await context.newPage();
  if (profile.mobile) {
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      latency: 150
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }
  const response = await page.goto(`${origin}${PATH}`, { waitUntil: "load", timeout: 60000 });
  const section = page.locator('section[aria-labelledby="metodo-title"]');
  let sectionPresent = false;
  let visible = false;
  try {
    await section.waitFor({ state: "attached", timeout: 5000 });
    sectionPresent = true;
    await section.scrollIntoViewIfNeeded();
    const img = section.locator("img");
    await img.waitFor({ state: "visible", timeout: 10000 });
    visible = true;
  } catch {
    // Produção ainda sem a seção/retrato do candidato local.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }
  await page.waitForTimeout(1500);
  const data = await page.evaluate(() => {
    const portrait = performance.getEntriesByType("resource")
      .find((r) => /drielle-pereira-retrato-profissional\.webp/.test(r.name));
    const anyDrielle = performance.getEntriesByType("resource")
      .filter((r) => /drielle-pereira.*\.webp/.test(r.name))
      .map((r) => ({
        name: r.name.split("/").pop(),
        transferKb: Number(((r.transferSize || 0) / 1024).toFixed(2)),
        durationMs: Math.round(r.duration)
      }));
    const el = document.querySelector('section[aria-labelledby="metodo-title"] img');
    return {
      imgPresent: Boolean(el),
      src: el?.getAttribute("src") ?? null,
      alt: el?.getAttribute("alt") ?? null,
      width: el?.getAttribute("width") ?? null,
      height: el?.getAttribute("height") ?? null,
      loading: el?.getAttribute("loading") ?? null,
      portraitFound: Boolean(portrait),
      portraitTransferKb: portrait ? Number(((portrait.transferSize || 0) / 1024).toFixed(2)) : null,
      portraitDurationMs: portrait ? Math.round(portrait.duration) : null,
      drielleWebpResources: anyDrielle
    };
  });
  await context.close();
  return { status: response?.status() ?? null, sectionPresent, visible, ...data };
}

const browser = await chromium.launch({ headless: true });
const report = {
  probedAt: new Date().toISOString(),
  note: "Scroll até #metodo-title para forçar lazy load do retrato profissional.",
  cells: []
};

for (const profile of [
  { id: "desktop", mobile: false },
  { id: "mobile", mobile: true }
]) {
  for (const [label, origin] of [
    ["candidate", CANDIDATE],
    ["baseline", BASELINE]
  ]) {
    const samples = [];
    for (let i = 0; i < RUNS; i += 1) {
      process.stdout.write(`${profile.id} ${label} #${i + 1}\n`);
      samples.push(await probe(browser, origin, profile));
    }
    report.cells.push({ profile: profile.id, origin: label, samples });
  }
}

writeFileSync(join(outDir, "portrait-resource-probe.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
