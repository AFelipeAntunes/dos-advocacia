import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
console.log("outDir", outDir);

const base = "http://127.0.0.1:3013/due-diligence-imobiliaria";
const shots = [
  ["dd-desktop-1440.png", 1440, 900, false],
  ["dd-desktop-1440-full.png", 1440, 900, true],
  ["dd-tablet-1000.png", 1000, 900, false],
  ["dd-tablet-768.png", 768, 1024, false],
  ["dd-mobile-390.png", 390, 844, false],
  ["dd-mobile-390-full.png", 390, 844, true]
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const [name, w, h, full] of shots) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(base, { waitUntil: "networkidle" });
  const path = join(outDir, name);
  await page.screenshot({ path, fullPage: full });
  console.log("saved", path);
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base, { waitUntil: "networkidle" });
await page.locator("#atendimento-title").scrollIntoViewIfNeeded();
await page.screenshot({ path: join(outDir, "dd-links-atendimento-1440.png"), fullPage: false });
await page.locator("#faq-title").scrollIntoViewIfNeeded();
await page.screenshot({ path: join(outDir, "dd-faq-1440.png"), fullPage: false });

await page.route("**/api/contato", async (route) => {
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
});
await page.goto(base, { waitUntil: "networkidle" });
await page.evaluate(() => {
  const form = document.querySelector(".js-contact-form");
  if (!form) return;
  const set = (name, value) => {
    const el = form.querySelector(`[name="${name}"]`);
    if (!el) return;
    if (el.type === "checkbox") el.checked = true;
    else el.value = value;
  };
  set("name", "QA Local");
  set("email", "qa@example.test");
  set("phone", "41999999999");
  set("message", "Mensagem de teste local interceptada");
  set("consent", "on");
  const started = form.querySelector('[name="formStartedAt"]');
  if (started) started.value = String(Date.now() - 5000);
});
await page.locator('.js-contact-form button[type="submit"]').click();
await page.waitForSelector('.form-success a[href*="wa.me"]');
await page.screenshot({ path: join(outDir, "dd-form-success-intercept.png"), fullPage: false });
console.log("done");
await browser.close();
