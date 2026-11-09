import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const envPath = join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 1) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

const token = process.env.VERCEL_OIDC_TOKEN || "";
const origins = [
  "https://dos-advocacia-n7nukp43d-dos-advocacia.vercel.app",
  "https://dos-advocacia-git-qa-dos-legal-name-dos-advocacia.vercel.app",
  "https://dos-advocacia-8anblj629-dos-advocacia.vercel.app"
];

if (!token) {
  console.log(JSON.stringify({ ok: false, error: "no oidc" }));
  process.exit(1);
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const out = [];
for (const origin of origins) {
  const context = await browser.newContext();
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    const headers = { ...route.request().headers() };
    if (origins.includes(url.origin)) {
      headers["x-vercel-trusted-oidc-idp-token"] = token;
    } else {
      delete headers["x-vercel-trusted-oidc-idp-token"];
    }
    await route.continue({ headers });
  });
  const page = await context.newPage();
  let status = null;
  page.on("response", (r) => {
    if (r.url().includes("/due-diligence-imobiliaria") && status == null) status = r.status();
  });
  try {
    await page.goto(`${origin}/due-diligence-imobiliaria`, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });
    await page.waitForTimeout(500);
    const info = await page.evaluate(() => ({
      h1: document.getElementById("page-title")?.textContent?.trim() || null,
      isSso: /Sign in to Vercel|sso-api|Authentication Required/i.test(
        document.documentElement.outerHTML
      )
    }));
    out.push({ origin, status, ...info });
  } catch (e) {
    out.push({ origin, error: String(e).slice(0, 200) });
  }
  await context.close();
}
await browser.close();
writeFileSync(join(outDir, "probe-alt-baselines.json"), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
