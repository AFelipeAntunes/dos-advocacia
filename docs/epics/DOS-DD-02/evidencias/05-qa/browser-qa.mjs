import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
const base = "http://127.0.0.1:3025";
const origin = "https://www.dosadvocacia.com.br";

const browser = await chromium.launch({ headless: true });
const report = { startedAt: new Date().toISOString(), checks: [] };

function note(name, data) {
  report.checks.push({ name, ...data });
  console.log(name, JSON.stringify(data));
}

async function shot(page, name) {
  await page.screenshot({ path: join(outDir, name), fullPage: false });
}

// Landing due diligence
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const events = [];
  await page.addInitScript(() => {
    window.__qaEvents = [];
    window.gtag = (...args) => window.__qaEvents.push(args);
  });
  await page.goto(`${base}/due-diligence-imobiliaria`, { waitUntil: "networkidle" });
  const meta = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector("h1")?.textContent?.trim(),
    h1Count: document.querySelectorAll("h1").length,
    faq: document.querySelectorAll(".faq-list details").length,
    faqH3: [...document.querySelectorAll(".faq-list details summary h3")].map((el) => el.textContent?.trim()),
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    form: {
      pageSlug: document.querySelector(".js-contact-form")?.getAttribute("data-page-slug"),
      icp: document.querySelector(".js-contact-form")?.getAttribute("data-icp")
    },
    schemaLegalName: (() => {
      try {
        const data = JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent || "{}");
        const graph = data["@graph"] || [data];
        return graph.find((n) => n["@type"] === "LegalService")?.legalName;
      } catch { return null; }
    })(),
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  }));
  await shot(page, "qa-dd-desktop-1440.png");

  // FAQ keyboard
  const firstSummary = page.locator(".faq-list details summary").first();
  await firstSummary.focus();
  await page.keyboard.press("Enter");
  const open = await page.locator(".faq-list details[open]").count();
  note("landing-due-diligence", { ...meta, faqOpenAfterEnter: open });

  // Form intercept
  await page.route("**/api/contato", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.evaluate(() => {
    const form = document.querySelector(".js-contact-form");
    const set = (name, value) => {
      const el = form?.querySelector(`[name="${name}"]`);
      if (!el) return;
      if (el.type === "checkbox") el.checked = true;
      else el.value = value;
    };
    set("name", "QA");
    set("email", "qa@example.test");
    set("phone", "41999999999");
    set("message", "teste interceptado");
    set("consent", "on");
    const started = form?.querySelector('[name="formStartedAt"]');
    if (started) started.value = String(Date.now() - 5000);
  });
  await page.locator('.js-contact-form button[type="submit"]').click();
  await page.waitForSelector(".form-success a[href*='wa.me']");
  const wa = await page.locator(".form-success a[href*='wa.me']").getAttribute("href");
  note("landing-form-success", {
    waText: wa ? new URL(wa).searchParams.get("text") : null,
    intercepted: true
  });
  await shot(page, "qa-dd-form-success.png");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/due-diligence-imobiliaria`, { waitUntil: "networkidle" });
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  await shot(page, "qa-dd-mobile-390.png");
  note("landing-mobile", { overflowX: mobileOverflow });
  await page.close();
}

// Institutional anchors
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const pages = {
    home: `${base}/`,
    compra: `${base}/assessoria-juridica-compra-de-imovel`,
    nacional: `${base}/advogada-imobiliaria`,
    curitiba: `${base}/advogada-imobiliaria-curitiba`
  };
  const anchors = {};
  for (const [key, url] of Object.entries(pages)) {
    await page.goto(url, { waitUntil: "networkidle" });
    anchors[key] = await page.evaluate(() => [...document.querySelectorAll('a[href*="due-diligence-imobiliaria"]')].map((a) => ({
      href: a.getAttribute("href"),
      text: (a.textContent || "").replace(/\s+/g, " ").trim()
    })));
  }
  note("institutional-anchors", anchors);
  await page.close();
}

// Production posts for CTA presence cannot render candidate without Wix.
// Document gap and verify production article navigation chain to service.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    window.__qaEvents = [];
    window.gtag = (...args) => window.__qaEvents.push(args);
  });
  const slug = "due-diligence-imobiliária-o-que-é-e-por-que-você-precisa-fazer-antes-de-qualquer-compra";
  await page.goto(`https://www.dosadvocacia.com.br/post/${encodeURIComponent(slug)}`, { waitUntil: "networkidle" });
  const prod = await page.evaluate(() => ({
    title: document.title,
    compact: Boolean(document.querySelector("#article-dd-cta-compact")),
    complete: Boolean(document.querySelector("#article-dd-cta-complete")),
    b2b: Boolean(document.querySelector('[data-cta-scope="article-service"]')),
    serviceLinks: [...document.querySelectorAll('a[href*="due-diligence-imobiliaria"]')].length,
    leiaTambem: /leia também/i.test(document.body.innerText)
  }));
  note("production-article-principal-cta-state", {
    ...prod,
    note: "Produção ainda sem card04; compacto/completo ausentes é esperado até release."
  });

  // Click editorial service link if present and capture gtag on production (may use old tracker)
  const link = page.locator('a[href*="due-diligence-imobiliaria"]').first();
  if (await link.count()) {
    await link.click({ trial: true }).catch(() => {});
  }
  await page.close();
}

// Intermediate viewports on landing
{
  const page = await browser.newPage();
  for (const [w, h, name] of [[768, 1024, "qa-dd-tablet-768.png"], [1000, 900, "qa-dd-tablet-1000.png"]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(`${base}/due-diligence-imobiliaria`, { waitUntil: "networkidle" });
    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    await shot(page, name);
    note(`viewport-${w}`, { overflowX });
  }
  await page.close();
}

report.finishedAt = new Date().toISOString();
writeFileSync(join(outDir, "browser-qa.json"), JSON.stringify(report, null, 2));
await browser.close();
console.log("browser-qa done");
