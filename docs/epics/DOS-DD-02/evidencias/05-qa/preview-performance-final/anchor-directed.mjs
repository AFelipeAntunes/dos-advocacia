/**
 * CTO20/22 — reprodução dirigida da âncora #due-diligence-imobiliaria-contact-title
 * no candidato Preview. Exige existência + viewport (topo E fundo) + formulário visível.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const CANDIDATE = "https://dos-advocacia-fp0125m2c-dos-advocacia.vercel.app";
const ANCHOR_ID = "due-diligence-imobiliaria-contact-title";
const PATH = `/due-diligence-imobiliaria#${ANCHOR_ID}`;

const BLOCKED = [
  "*googletagmanager.com*",
  "*google-analytics.com*",
  "*googleapis.com*",
  "*gstatic.com*",
  "*vercel-insights.com*",
  "*va.vercel-scripts.com*",
  "*vercel.live*"
];

function loadOidc() {
  const tmp = join(process.cwd(), ".vercel-oidc-token.tmp");
  if (existsSync(tmp)) return readFileSync(tmp, "utf8").trim();
  return process.env.VERCEL_OIDC_TOKEN || "";
}

const oidc = loadOidc();
if (!oidc) {
  writeFileSync(join(outDir, "anchor-directed.json"), JSON.stringify({ ok: false, error: "missing OIDC" }, null, 2));
  process.exit(1);
}

const profiles = [
  { id: "desktop", viewport: { width: 1440, height: 900 }, mobile: false },
  {
    id: "mobile",
    viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    mobile: true
  }
];

async function probe(browser, profile) {
  const context = await browser.newContext(
    profile.mobile
      ? {
          viewport: { width: 390, height: 844 },
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": oidc }
        }
      : {
          viewport: { width: 1440, height: 900 },
          extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": oidc }
        }
  );
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setBlockedURLs", { urls: BLOCKED });
  if (profile.mobile) {
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      latency: 150
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }

  const url = `${CANDIDATE}${PATH}`;
  const response = await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.fonts?.ready?.catch?.(() => {}));
  await page.waitForTimeout(500);

  const result = await page.evaluate((anchorId) => {
    const el = document.getElementById(anchorId);
    const form =
      document.querySelector("form[data-contact-form], form#contact-form, form[action*='contato']") ||
      document.querySelector("form");
    const link = document.querySelector(`a[href="#${anchorId}"]`);
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    let anchor = null;
    if (el) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const topIn = r.top >= 0 && r.top < vh;
      const bottomIn = r.bottom > 0 && r.bottom <= vh;
      const fullyInView = r.top >= 0 && r.bottom <= vh && r.height > 0;
      const partiallyInView = r.bottom > 0 && r.top < vh && r.height > 0;
      // CTO20: não usar só top < innerHeight (coords negativas passam).
      const visibleByBounds = fullyInView || (partiallyInView && r.top >= -1 && r.bottom <= vh + 1);
      anchor = {
        exists: true,
        tag: el.tagName,
        className: el.className,
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        height: Math.round(r.height),
        width: Math.round(r.width),
        visibility: cs.visibility,
        display: cs.display,
        opacity: cs.opacity,
        srOnlySuspect: /\bsr-only\b/.test(el.className) || cs.position === "absolute" && (r.height < 2 || parseFloat(cs.clip?.match(/\d/) || "1") === 0),
        topInViewport: topIn,
        bottomInViewport: bottomIn,
        fullyInView,
        partiallyInView,
        visibleByBounds
      };
    } else {
      anchor = { exists: false };
    }

    let formInfo = null;
    if (form) {
      const r = form.getBoundingClientRect();
      const cs = getComputedStyle(form);
      formInfo = {
        exists: true,
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        height: Math.round(r.height),
        visibility: cs.visibility,
        display: cs.display,
        opacity: cs.opacity,
        partiallyInView: r.bottom > 0 && r.top < vh && r.height > 0
      };
    } else {
      formInfo = { exists: false };
    }

    return {
      viewport: { width: vw, height: vh },
      hash: location.hash,
      anchorId,
      anchor,
      form: formInfo,
      internalLinkExists: Boolean(link),
      h1: document.getElementById("page-title")?.textContent?.trim() || null
    };
  }, ANCHOR_ID);

  const shot = join(outDir, `anchor-${profile.id}.png`);
  await page.screenshot({ path: shot, fullPage: false });

  const ok =
    result.anchor?.exists === true &&
    result.form?.exists === true &&
    result.anchor.visibleByBounds === true &&
    result.form.partiallyInView === true;

  await context.close();
  return {
    profile: profile.id,
    status: response?.status() ?? null,
    url,
    screenshot: shot,
    ok,
    failReasons: [
      !result.anchor?.exists ? "anchor-missing" : null,
      result.anchor?.exists && !result.anchor.visibleByBounds ? "anchor-not-in-viewport-bounds" : null,
      !result.form?.exists ? "form-missing" : null,
      result.form?.exists && !result.form.partiallyInView ? "form-not-in-viewport" : null
    ].filter(Boolean),
    ...result
  };
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const chrome = await browser.version();
const profilesOut = [];
try {
  for (const profile of profiles) {
    profilesOut.push(await probe(browser, profile));
  }
} finally {
  await browser.close();
}

const ok = profilesOut.every((p) => p.ok);
const payload = {
  probedAt: new Date().toISOString(),
  chrome,
  candidate: CANDIDATE,
  sha: "2abfbebab000a89250e0c18a29b06d0a161c6864",
  method: "fragment navigation + bounds (top AND bottom) after font/layout settle",
  historicalCto16: {
    formAnchorExists: true,
    anchorInView: false,
    formTopDesktop: 2033,
    formTopMobile: 3491
  },
  ok,
  profiles: profilesOut
};

writeFileSync(join(outDir, "anchor-directed.json"), JSON.stringify(payload, null, 2));
console.log(
  JSON.stringify(
    {
      ok,
      profiles: profilesOut.map((p) => ({
        profile: p.profile,
        ok: p.ok,
        failReasons: p.failReasons,
        anchor: p.anchor,
        form: p.form,
        internalLinkExists: p.internalLinkExists
      }))
    },
    null,
    2
  )
);
process.exit(ok ? 0 : 2);
