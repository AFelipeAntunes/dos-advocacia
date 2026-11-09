/**
 * CTO22 — prova de auth OIDC sem context.route (cache HTTP intacto).
 * Header via extraHTTPHeaders; terceiros bloqueados via CDP setBlockedURLs.
 * Não imprime tokens. Não usa Automation Bypass.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const CANDIDATE_ORIGIN = "https://dos-advocacia-fp0125m2c-dos-advocacia.vercel.app";
const BASELINE_ORIGIN = "https://dos-advocacia-n7nukp43d-dos-advocacia.vercel.app";
const ALLOWED = new Set([CANDIDATE_ORIGIN, BASELINE_ORIGIN]);
const PATH = "/due-diligence-imobiliaria";

const BLOCKED = [
  "*googletagmanager.com*",
  "*google-analytics.com*",
  "*googleapis.com*",
  "*gstatic.com*",
  "*fonts.googleapis.com*",
  "*fonts.gstatic.com*",
  "*vercel-insights.com*",
  "*va.vercel-scripts.com*",
  "*vercel.live*",
  "*facebook.net*",
  "*doubleclick.net*",
  "*hotjar.com*",
  "*clarity.ms*"
];

function loadOidc() {
  const tmp = join(process.cwd(), ".vercel-oidc-token.tmp");
  if (existsSync(tmp)) {
    const t = readFileSync(tmp, "utf8").trim();
    if (t) return t;
  }
  const envLocal = join(process.cwd(), ".env.local");
  if (existsSync(envLocal)) {
    for (const line of readFileSync(envLocal, "utf8").split(/\r?\n/)) {
      if (!line.startsWith("VERCEL_OIDC_TOKEN=")) continue;
      let v = line.slice("VERCEL_OIDC_TOKEN=".length).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (v) return v;
    }
  }
  return "";
}

const oidc = loadOidc();
if (!oidc) {
  writeFileSync(
    join(outDir, "auth-cache-proof.json"),
    JSON.stringify({ ok: false, error: "missing OIDC token file" }, null, 2)
  );
  process.exit(1);
}

async function openAuthedContext(browser, { cacheDisabled }) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    extraHTTPHeaders: {
      "x-vercel-trusted-oidc-idp-token": oidc
    }
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled });
  if (cacheDisabled) {
    await cdp.send("Network.clearBrowserCache").catch(() => {});
  }
  await cdp.send("Network.setBlockedURLs", { urls: BLOCKED });

  const externalCompleted = [];
  cdp.on("Network.responseReceived", (e) => {
    try {
      const u = new URL(e.response.url);
      if (!ALLOWED.has(u.origin) && !e.response.url.startsWith("data:")) {
        externalCompleted.push(u.origin);
      }
    } catch {
      /* ignore */
    }
  });

  return { context, page, cdp, externalCompleted };
}

async function navigateAndCollect(page, origin) {
  let status = null;
  const onResponse = (res) => {
    if (res.url().startsWith(origin + PATH) && status == null) status = res.status();
  };
  page.on("response", onResponse);
  await page.goto(`${origin}${PATH}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(1000);
  page.off("response", onResponse);
  const info = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] || {};
    const res = performance.getEntriesByType("resource");
    const cachedLike = res.filter(
      (r) => (r.transferSize || 0) === 0 && (r.encodedBodySize || 0) > 0
    ).length;
    const h1 = document.getElementById("page-title")?.textContent?.trim() || null;
    const isSso =
      /vercel\.com\/sso|Sign in to Vercel|Authentication Required|Deployment Protection/i.test(
        document.documentElement.outerHTML
      );
    return {
      h1,
      title: document.title,
      isSso,
      hasDdLcpOpt: Boolean(document.querySelector("[data-dd-lcp-opt], .dd-lcp-opt")),
      formAnchorExists: Boolean(
        document.getElementById("due-diligence-imobiliaria-contact-title")
      ),
      documentTransfer: nav.transferSize || 0,
      resourceCount: res.length,
      cachedLikeResourceCount: cachedLike
    };
  });
  return { status, ...info };
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const chrome = await browser.version();
const results = {
  probedAt: new Date().toISOString(),
  chrome,
  method: "extraHTTPHeaders+CDP-blocklist-no-route",
  allowedOrigins: [...ALLOWED],
  blockedPatterns: BLOCKED
};

try {
  {
    const { context, page, externalCompleted } = await openAuthedContext(browser, {
      cacheDisabled: true
    });
    results.candidateCold = await navigateAndCollect(page, CANDIDATE_ORIGIN);
    results.candidateCold.externalCompletedOrigins = [...new Set(externalCompleted)];
    await context.close();
  }

  {
    const { context, page, externalCompleted } = await openAuthedContext(browser, {
      cacheDisabled: false
    });
    const warmFirst = await navigateAndCollect(page, CANDIDATE_ORIGIN);
    const warmSecond = await navigateAndCollect(page, CANDIDATE_ORIGIN);
    results.candidateWarm = {
      firstDocumentTransfer: warmFirst.documentTransfer,
      secondDocumentTransfer: warmSecond.documentTransfer,
      firstCachedLike: warmFirst.cachedLikeResourceCount,
      secondCachedLike: warmSecond.cachedLikeResourceCount,
      firstResourceCount: warmFirst.resourceCount,
      secondResourceCount: warmSecond.resourceCount,
      secondStatus: warmSecond.status,
      secondH1: warmSecond.h1,
      secondIsSso: warmSecond.isSso,
      cacheHitEvidence:
        warmSecond.cachedLikeResourceCount > 0 ||
        (warmSecond.documentTransfer === 0 && warmFirst.documentTransfer > 0) ||
        warmSecond.cachedLikeResourceCount > warmFirst.cachedLikeResourceCount,
      externalCompletedOrigins: [...new Set(externalCompleted)]
    };
    await context.close();
  }

  {
    const { context, page, externalCompleted } = await openAuthedContext(browser, {
      cacheDisabled: true
    });
    results.baselineCold = await navigateAndCollect(page, BASELINE_ORIGIN);
    results.baselineCold.externalCompletedOrigins = [...new Set(externalCompleted)];
    await context.close();
  }
} finally {
  await browser.close();
}

const ok =
  results.candidateCold?.status === 200 &&
  results.baselineCold?.status === 200 &&
  !results.candidateCold?.isSso &&
  !results.baselineCold?.isSso &&
  /due diligence imobiliária antes de comprar/i.test(results.candidateCold?.h1 || "") &&
  Boolean(results.baselineCold?.h1) &&
  results.candidateWarm?.secondStatus === 200 &&
  !results.candidateWarm?.secondIsSso &&
  (results.candidateCold?.externalCompletedOrigins || []).length === 0 &&
  (results.baselineCold?.externalCompletedOrigins || []).length === 0 &&
  (results.candidateWarm?.externalCompletedOrigins || []).length === 0 &&
  Boolean(results.candidateWarm?.cacheHitEvidence);

results.ok = ok;
results.note =
  "No Playwright route(); HTTP cache remains available. OIDC via extraHTTPHeaders. Third-party origins blocked via CDP so the token is not sent externally. Google Fonts blocked; Next/font self-host remains.";

writeFileSync(join(outDir, "auth-cache-proof.json"), JSON.stringify(results, null, 2));
console.log(
  JSON.stringify(
    {
      ok,
      candidate: {
        status: results.candidateCold?.status,
        h1: results.candidateCold?.h1,
        isSso: results.candidateCold?.isSso,
        external: results.candidateCold?.externalCompletedOrigins?.length || 0
      },
      baseline: {
        status: results.baselineCold?.status,
        h1: results.baselineCold?.h1,
        isSso: results.baselineCold?.isSso,
        external: results.baselineCold?.externalCompletedOrigins?.length || 0
      },
      warm: {
        cacheHitEvidence: results.candidateWarm?.cacheHitEvidence,
        firstDoc: results.candidateWarm?.firstDocumentTransfer,
        secondDoc: results.candidateWarm?.secondDocumentTransfer,
        secondCachedLike: results.candidateWarm?.secondCachedLike
      }
    },
    null,
    2
  )
);
process.exit(ok ? 0 : 1);
