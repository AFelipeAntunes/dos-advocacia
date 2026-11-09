/**
 * CTO21 — prova Playwright/CDP com o mesmo mecanismo de auth da medição.
 * Não imprime tokens. Header só nas duas origens exatas.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const CANDIDATE_ORIGIN = "https://dos-advocacia-fp0125m2c-dos-advocacia.vercel.app";
const BASELINE_ORIGIN = "https://dos-advocacia-jxeouysg4-dos-advocacia.vercel.app";
const PATH = "/due-diligence-imobiliaria";

function loadEnvLocal() {
  const candidates = [
    join(process.cwd(), ".env.local"),
    join(outDir, "..", "..", "..", "..", "..", "..", ".env.local")
  ];
  const envPath = candidates.find((p) => existsSync(p));
  if (!envPath) return;
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
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

loadEnvLocal();

const oidc = process.env.VERCEL_OIDC_TOKEN || "";
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "";
const mode = bypass ? "automation-bypass" : oidc ? "oidc" : "none";

if (mode === "none") {
  writeFileSync(
    join(outDir, "preflight-playwright-auth.json"),
    JSON.stringify(
      {
        probedAt: new Date().toISOString(),
        ok: false,
        mode,
        error: "No VERCEL_OIDC_TOKEN or VERCEL_AUTOMATION_BYPASS_SECRET in env"
      },
      null,
      2
    )
  );
  console.log(JSON.stringify({ ok: false, mode, hasOidc: false, hasBypass: false }));
  process.exit(1);
}

const authHeader =
  mode === "automation-bypass"
    ? { "x-vercel-protection-bypass": bypass }
    : { "x-vercel-trusted-oidc-idp-token": oidc };

async function probe(browser, origin, label) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    // Restrict auth header to this exact origin only (Playwright applies to all requests
    // from the context — we route-filter below).
  });

  await context.route("**/*", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const headers = { ...req.headers() };
    const isAllowedOrigin = url.origin === CANDIDATE_ORIGIN || url.origin === BASELINE_ORIGIN;
    if (isAllowedOrigin) {
      Object.assign(headers, authHeader);
    } else {
      delete headers["x-vercel-protection-bypass"];
      delete headers["x-vercel-trusted-oidc-idp-token"];
      delete headers["x-vercel-protection-bypass".toLowerCase()];
    }
    await route.continue({ headers });
  });

  const page = await context.newPage();
  let status = null;
  page.on("response", (res) => {
    if (res.url().startsWith(origin + PATH) && status == null) status = res.status();
  });
  await page.goto(`${origin}${PATH}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(800);
  const info = await page.evaluate(() => {
    const h1 = document.getElementById("page-title")?.textContent?.trim() || null;
    const title = document.title;
    const bodyText = (document.body?.innerText || "").slice(0, 200);
    const isSso =
      /vercel\.com\/sso|Sign in to Vercel|Authentication Required|Deployment Protection/i.test(
        document.documentElement.outerHTML
      );
    return {
      h1,
      title,
      isSso,
      hasDdLcpOpt: Boolean(document.querySelector("[data-dd-lcp-opt], .dd-lcp-opt")),
      formAnchorExists: Boolean(document.getElementById("due-diligence-imobiliaria-contact-title"))
    };
  });
  await context.close();
  return { label, origin, status, ...info };
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const chrome = await browser.version();
let candidate;
let baseline;
try {
  candidate = await probe(browser, CANDIDATE_ORIGIN, "candidate");
  baseline = await probe(browser, BASELINE_ORIGIN, "baseline");
} finally {
  await browser.close();
}

const ok =
  candidate.status === 200 &&
  baseline.status === 200 &&
  !candidate.isSso &&
  !baseline.isSso &&
  /due diligence imobiliária antes de comprar/i.test(candidate.h1 || "") &&
  /imóvel parece certo/i.test(baseline.h1 || "");

const result = {
  probedAt: new Date().toISOString(),
  chrome,
  mode,
  hasOidc: Boolean(oidc),
  hasBypass: Boolean(bypass),
  authHeaderName:
    mode === "automation-bypass" ? "x-vercel-protection-bypass" : "x-vercel-trusted-oidc-idp-token",
  originsAllowed: [CANDIDATE_ORIGIN, BASELINE_ORIGIN],
  ok,
  candidate,
  baseline,
  note: "Token values never written. vercel curl previously returned 200 for both URLs."
};

writeFileSync(join(outDir, "preflight-playwright-auth.json"), JSON.stringify(result, null, 2));
console.log(
  JSON.stringify({
    ok,
    mode,
    hasOidc: Boolean(oidc),
    hasBypass: Boolean(bypass),
    candidate: { status: candidate.status, h1: candidate.h1, isSso: candidate.isSso },
    baseline: { status: baseline.status, h1: baseline.h1, isSso: baseline.isSso }
  })
);
process.exit(ok ? 0 : 1);
