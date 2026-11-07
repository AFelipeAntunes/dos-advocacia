/**
 * CTO 16 — prova de escopo (outras páginas sem otimização) + QA funcional DD.
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const CANDIDATE = process.argv.find((a) => a.startsWith("--candidate="))?.split("=")[1] || "http://127.0.0.1:3025";

const controlPages = [
  { id: "locacao", path: "/assessoria-em-locacao" },
  { id: "compra", path: "/assessoria-juridica-compra-de-imovel" },
  { id: "curitiba", path: "/advogada-imobiliaria-curitiba" },
  { id: "contato", path: "/contato" }
];

async function inspectMarkup(page, path) {
  await page.goto(`${CANDIDATE}${path}`, { waitUntil: "load", timeout: 60000 });
  return page.evaluate(() => {
    const html = document.documentElement.outerHTML;
    const h1 = html.indexOf('id="page-title"') >= 0 ? html.indexOf('id="page-title"') : html.indexOf("<h1");
    const jsonLd = html.indexOf("application/ld+json");
    const optWrap = Boolean(document.querySelector("[data-dd-lcp-opt], .dd-lcp-opt"));
    const script = document.querySelector('script[src="/site-interactions.js"]');
    const sections = [...document.querySelectorAll("main > .page-hero ~ section")];
    const cv = sections.map((s) => getComputedStyle(s).contentVisibility || getComputedStyle(s).contentVisibility);
    // content-visibility may appear as contentVisibility in CSSOM
    const cvValues = sections.map((s) => {
      const cs = getComputedStyle(s);
      return cs.getPropertyValue("content-visibility") || cs.contentVisibility || "normal";
    });
    return {
      path: location.pathname,
      hasDdLcpOpt: optWrap,
      jsonLdBeforeH1: jsonLd >= 0 && h1 >= 0 ? jsonLd < h1 : null,
      h1Index: h1,
      jsonLdIndex: jsonLd,
      siteInteractionsDefer: script ? script.hasAttribute("defer") : null,
      belowFoldSectionCount: sections.length,
      contentVisibilityValues: [...new Set(cvValues)]
    };
  });
}

async function qaDueDiligence(browser, profile) {
  const context = await browser.newContext(
    profile.mobile
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      : { viewport: { width: 1440, height: 900 } }
  );
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__cls = { shifts: [], support: false };
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          window.__cls.shifts.push({ t: e.startTime, v: e.value, hadInput: Boolean(e.hadRecentInput) });
        }
      }).observe({ type: "layout-shift", buffered: true });
      window.__cls.support = true;
    } catch {}
  });

  const formPosts = [];
  await page.route("**/api/contato", async (route) => {
    formPosts.push({
      method: route.request().method(),
      url: route.request().url(),
      intercepted: true,
      bodyPreview: (route.request().postData() || "").slice(0, 200)
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true })
    });
  });

  await page.goto(`${CANDIDATE}/due-diligence-imobiliaria`, { waitUntil: "load", timeout: 60000 });

  const headChecks = await page.evaluate(() => {
    const faqs = [...document.querySelectorAll(".faq-list details")];
    const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent || "");
    const faqPage = jsonLd.some((t) => /"@type"\s*:\s*"FAQPage"/.test(t));
    const faqQuestions = faqs.map((d) => d.querySelector("summary")?.textContent?.trim() || "");
    return {
      hasDdLcpOpt: Boolean(document.querySelector("[data-dd-lcp-opt], .dd-lcp-opt")),
      faqDetailsCount: faqs.length,
      faqQuestions,
      jsonLdBlocks: jsonLd.length,
      faqPageInJsonLd: faqPage,
      h1: document.getElementById("page-title")?.textContent?.trim() || null,
      formPresent: Boolean(document.querySelector("form.js-contact-form")),
      formAnchorId: "due-diligence-imobiliaria-contact-title",
      formAnchorExists: Boolean(document.getElementById("due-diligence-imobiliaria-contact-title")),
      portrait: (() => {
        const img = document.querySelector('section[aria-labelledby="metodo-title"] img');
        if (!img) return null;
        return {
          src: img.getAttribute("src"),
          alt: img.getAttribute("alt"),
          loading: img.getAttribute("loading"),
          width: img.getAttribute("width"),
          height: img.getAttribute("height")
        };
      })()
    };
  });

  // Anchor navigation to form
  await page.goto(`${CANDIDATE}/due-diligence-imobiliaria#due-diligence-imobiliaria-contact-title`, {
    waitUntil: "load",
    timeout: 60000
  });
  await page.waitForTimeout(400);
  const anchorResult = await page.evaluate(() => {
    const el = document.getElementById("due-diligence-imobiliaria-contact-title");
    const form = document.querySelector("form.js-contact-form");
    const rect = form?.getBoundingClientRect();
    return {
      hash: location.hash,
      anchorInView: el ? el.getBoundingClientRect().top < window.innerHeight : false,
      formTop: rect ? Math.round(rect.top) : null
    };
  });

  // Keyboard to form fields
  await page.locator("#nome").focus();
  await page.keyboard.type("Felipe QA CTO16");
  await page.locator("#email").focus();
  await page.keyboard.type("qa-cto16@example.com");
  await page.locator("#telefone").focus();
  await page.keyboard.type("41999990000");
  const keyboardFilled = await page.evaluate(() => ({
    nome: document.querySelector("#nome")?.value || "",
    email: document.querySelector("#email")?.value || "",
    telefone: document.querySelector("#telefone")?.value || ""
  }));

  // FAQ open/close
  const faqToggle = [];
  const details = page.locator(".faq-list details");
  const faqCount = await details.count();
  for (let i = 0; i < Math.min(faqCount, 6); i += 1) {
    const item = details.nth(i);
    await item.locator("summary").click();
    const open = await item.evaluate((el) => el.open);
    faqToggle.push({ index: i, opened: open });
    await item.locator("summary").click();
    const closed = await item.evaluate((el) => !el.open);
    faqToggle[faqToggle.length - 1].closed = closed;
  }

  // Full scroll with CLS + portrait
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    const max = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, max);
    await new Promise((r) => setTimeout(r, 400));
    document.querySelector('section[aria-labelledby="metodo-title"]')?.scrollIntoView();
    await new Promise((r) => setTimeout(r, 800));
  });

  const scrollCls = await page.evaluate(() => {
    const shifts = (window.__cls?.shifts || []).filter((s) => !s.hadInput);
    let cls = 0;
    let cur = 0;
    let first = null;
    let last = null;
    for (const s of shifts) {
      if (first === null) {
        first = s.t;
        last = s.t;
        cur = s.v;
      } else if (s.t - last < 1000 && s.t - first < 5000) {
        cur += s.v;
        last = s.t;
      } else {
        cls = Math.max(cls, cur);
        first = s.t;
        last = s.t;
        cur = s.v;
      }
    }
    if (first !== null) cls = Math.max(cls, cur);
    const img = document.querySelector('section[aria-labelledby="metodo-title"] img');
    const res = performance.getEntriesByType("resource").find((r) => /retrato-profissional/.test(r.name));
    return {
      cls: Math.round(cls * 10000) / 10000,
      shiftCount: shifts.length,
      observerSupport: Boolean(window.__cls?.support),
      portraitVisible: img ? img.getBoundingClientRect().height > 0 && img.complete : false,
      portraitNatural: img ? img.naturalWidth : 0,
      portraitTransferKb: res ? Number(((res.transferSize || 0) / 1024).toFixed(2)) : null
    };
  });

  // Form submit intercepted (no real send)
  await page.locator("#mensagem").fill("Mensagem de QA CTO16 — interceptação local, sem envio real.");
  await page.locator('input[name="consent"]').check();
  // startedAt must be old enough if min time is 3s
  await page.evaluate(() => {
    const started = document.querySelector('input[name="startedAt"]');
    if (started) started.value = String(Date.now() - 5000);
  });
  await page.locator("[data-submit]").click();
  await page.waitForTimeout(800);

  const formOutcome = await page.evaluate(() => ({
    successVisible: Boolean(document.querySelector(".form-success")),
    statusText: document.querySelector("[data-form-status]")?.textContent?.trim() || null
  }));

  await context.close();
  return {
    profile: profile.id,
    headChecks,
    anchorResult,
    keyboardFilled,
    faqToggle,
    faqTogglePass: faqToggle.length === 6 && faqToggle.every((f) => f.opened && f.closed),
    scrollCls,
    formPosts,
    formOutcome,
    formInterceptedOnly: formPosts.length >= 1 && formPosts.every((p) => p.intercepted)
  };
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const chrome = await browser.version();
const scopePage = await browser.newPage();
const scope = {
  dueDiligence: await inspectMarkup(scopePage, "/due-diligence-imobiliaria"),
  controls: {}
};
for (const p of controlPages) {
  scope.controls[p.id] = await inspectMarkup(scopePage, p.path);
}
await scopePage.close();

const qa = {
  desktop: await qaDueDiligence(browser, { id: "desktop", mobile: false }),
  mobile: await qaDueDiligence(browser, { id: "mobile", mobile: true })
};

await browser.close();

const scopePass =
  scope.dueDiligence.hasDdLcpOpt === true &&
  scope.dueDiligence.siteInteractionsDefer === true &&
  scope.dueDiligence.jsonLdBeforeH1 === false &&
  scope.dueDiligence.contentVisibilityValues.some((v) => String(v).includes("auto")) &&
  Object.values(scope.controls).every(
    (c) =>
      c.hasDdLcpOpt === false &&
      c.siteInteractionsDefer === false &&
      c.jsonLdBeforeH1 === true &&
      c.contentVisibilityValues.every((v) => !String(v).includes("auto"))
  );

const result = {
  probedAt: new Date().toISOString(),
  chrome,
  candidateOrigin: CANDIDATE,
  scopePass,
  scope,
  qa,
  notes: {
    formAnchor: "#due-diligence-imobiliaria-contact-title",
    noRealSubmit: true
  }
};

writeFileSync(join(outDir, "cto16-scope-and-qa.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify({ scopePass, scope: result.scope, qaSummary: {
  desktopFaq: qa.desktop.faqTogglePass,
  mobileFaq: qa.mobile.faqTogglePass,
  desktopCls: qa.desktop.scrollCls.cls,
  mobileCls: qa.mobile.scrollCls.cls,
  desktopIntercept: qa.desktop.formInterceptedOnly,
  mobileIntercept: qa.mobile.formInterceptedOnly,
  desktopFaqs: qa.desktop.headChecks.faqDetailsCount,
  jsonLdFaq: qa.desktop.headChecks.faqPageInJsonLd
} }, null, 2));
if (!scopePass) process.exitCode = 1;
