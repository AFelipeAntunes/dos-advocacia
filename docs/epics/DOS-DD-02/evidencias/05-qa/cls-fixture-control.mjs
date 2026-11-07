/**
 * Controle de coleta CLS (CTO 13 R1):
 * prova que o PerformanceObserver + janelas de sessão registram deslocamento conhecido.
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));

const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>CLS fixture control</title>
  <style>
    body { margin: 0; font-family: sans-serif; }
    #box { width: 300px; height: 120px; background: #8fabbc; margin: 24px; }
    #late { display: none; height: 200px; background: #eb574d; margin: 24px; }
  </style>
</head>
<body>
  <div id="late">conteúdo tardio</div>
  <div id="box">âncora estável</div>
  <script>
    setTimeout(() => {
      document.getElementById("late").style.display = "block";
    }, 400);
  </script>
</body>
</html>`;

const INIT = `
window.__perf = { shifts: [], support: false, errors: [] };
try {
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__perf.shifts.push({ t: e.startTime, v: e.value, hadInput: Boolean(e.hadRecentInput) });
    }
  }).observe({ type: "layout-shift", buffered: true });
  window.__perf.support = true;
} catch (err) { window.__perf.errors.push(String(err)); }
`;

const COLLECT = `(() => {
  const shifts = (window.__perf.shifts || []).filter((s) => !s.hadInput);
  let cls = 0, cur = 0, first = null, last = null;
  for (const s of shifts) {
    if (first === null) { first = s.t; last = s.t; cur = s.v; }
    else if (s.t - last < 1000 && s.t - first < 5000) { cur += s.v; last = s.t; }
    else { cls = Math.max(cls, cur); first = s.t; last = s.t; cur = s.v; }
  }
  if (first !== null) cls = Math.max(cls, cur);
  return {
    support: window.__perf.support,
    errors: window.__perf.errors,
    shiftCount: shifts.length,
    cls: Math.round(cls * 10000) / 10000,
    shifts
  };
})()`;

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
await page.addInitScript(INIT);
await page.route("**/cls-fixture-control.html", async (route) => {
  await route.fulfill({ status: 200, contentType: "text/html; charset=utf-8", body: html });
});
await page.goto("http://127.0.0.1/cls-fixture-control.html", { waitUntil: "load" });
await page.waitForTimeout(1500);
const metrics = await page.evaluate(COLLECT);
const chrome = await browser.version();
await context.close();
await browser.close();

const result = {
  probedAt: new Date().toISOString(),
  chrome,
  purpose: "Demonstrate layout-shift PerformanceObserver + session-window CLS on a known fixture",
  expected: "cls > 0 and shiftCount >= 1 when late block appears above stable box",
  passed: Boolean(metrics.support && metrics.cls > 0 && metrics.shiftCount >= 1),
  metrics
};

writeFileSync(join(outDir, "cls-fixture-control.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (!result.passed) process.exitCode = 1;
