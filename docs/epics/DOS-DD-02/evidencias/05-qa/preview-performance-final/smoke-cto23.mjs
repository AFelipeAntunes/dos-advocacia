/**
 * CTO23 — smoke conectado curto no Preview candidato 2abfbeb/fp0125m2c.
 * Sem bateria 80, sem mutação de aplicação, sem Resend/WhatsApp real.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const ORIGIN = "https://dos-advocacia-fp0125m2c-dos-advocacia.vercel.app";
const SHA = "2abfbebab000a89250e0c18a29b06d0a161c6864";
const BLOCKED = [
  "*googletagmanager.com*",
  "*google-analytics.com*",
  "*vercel-insights.com*",
  "*va.vercel-scripts.com*",
  "*vercel.live*"
];

const ARTICLES = {
  ddHabiteSe: "imóvel-sem-habite-se-riscos-jurídicos-que-o-comprador-precisa-conhecer",
  ddCesao: "cessão-de-direitos-em-imóvel-na-planta-o-que-muda-quando-o-comprador-não-é-o-original",
  b2bFiador: "garantia-do-fiador-na-renovação-do-contrato-de-aluguel"
};

function loadOidc() {
  const tmp = join(process.cwd(), ".vercel-oidc-token.tmp");
  if (existsSync(tmp)) return readFileSync(tmp, "utf8").trim();
  return process.env.VERCEL_OIDC_TOKEN || "";
}

const oidc = loadOidc();
if (!oidc) {
  writeFileSync(join(outDir, "smoke-cto23.json"), JSON.stringify({ ok: false, error: "missing OIDC" }, null, 2));
  process.exit(1);
}

const GTAGE_INIT = `
window.__gtagEvents = [];
window.dataLayer = window.dataLayer || [];
window.gtag = function(){ window.__gtagEvents.push(Array.from(arguments)); try { window.dataLayer.push(arguments); } catch(e) {} };
`;

const HOOK_GTAG = `(() => {
  window.__gtagEvents = window.__gtagEvents || [];
  if (window.__gtagHooked) {
    return { hooked: true, already: true, dataLayerLen: (window.dataLayer || []).length };
  }
  window.__gtagHooked = true;
  const wrap = (fn) => function() {
    try { window.__gtagEvents.push(Array.from(arguments)); } catch (e) {}
    if (typeof fn === "function") return fn.apply(this, arguments);
  };
  window.gtag = wrap(window.gtag);
  return { hooked: typeof window.gtag === "function", already: false, dataLayerLen: (window.dataLayer || []).length };
})()`;

function sanitizeEventParams(params) {
  if (!params || typeof params !== "object") return params;
  const out = { ...params };
  for (const k of Object.keys(out)) {
    if (/name|email|phone|telefone|mensagem|message|pii/i.test(k)) out[k] = "[redacted-key]";
  }
  return out;
}

async function hookGtag(page) {
  return page.evaluate(HOOK_GTAG);
}

async function openPage(browser, { mobile }) {
  const context = await browser.newContext(
    mobile
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
  await page.addInitScript(GTAGE_INIT);
  return { context, page };
}

async function smokeAnchor(browser) {
  const results = [];
  for (const mobile of [false, true]) {
    const { context, page } = await openPage(browser, { mobile });
    const url = `${ORIGIN}/due-diligence-imobiliaria`;
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(800);

    const link = page.locator('a[href="#o-que-voce-recebe"]', { hasText: "Ver o que a análise entrega" });
    const linkCount = await link.count();
    await link.first().click();
    await page.waitForTimeout(700);
    await page.evaluate(() => document.fonts?.ready?.catch?.(() => {}));
    await page.waitForTimeout(300);

    const measure = await page.evaluate(() => {
      const heading = document.getElementById("o-que-voce-recebe");
      const header =
        document.querySelector("header") ||
        document.querySelector("[data-site-header]") ||
        document.querySelector(".site-header");
      const form = document.querySelector("form[data-contact-form], form");
      const vh = window.innerHeight;
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
      let headingInfo = null;
      if (heading) {
        const r = heading.getBoundingClientRect();
        const cs = getComputedStyle(heading);
        headingInfo = {
          exists: true,
          text: (heading.textContent || "").trim(),
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          height: Math.round(r.height),
          visible:
            r.bottom > headerBottom + 2 &&
            r.top < vh &&
            r.height > 0 &&
            cs.visibility !== "hidden" &&
            cs.display !== "none" &&
            parseFloat(cs.opacity || "1") > 0,
          notCoveredByHeader: r.top >= headerBottom - 1
        };
      }
      let formKeyboard = null;
      if (form) {
        const first =
          form.querySelector("input:not([type=hidden]):not([tabindex='-1']), select, textarea");
        if (first) {
          first.focus();
          const active = document.activeElement === first;
          const r = first.getBoundingClientRect();
          formKeyboard = {
            field: first.getAttribute("name") || first.id || first.tagName,
            focused: active,
            partiallyInView: r.bottom > 0 && r.top < vh
          };
        }
      }
      return {
        hash: location.hash,
        headerBottom: Math.round(headerBottom),
        heading: headingInfo,
        formKeyboard,
        formExists: Boolean(form)
      };
    });

    const shot = join(outDir, `smoke-anchor-${mobile ? "mobile" : "desktop"}.png`);
    await page.screenshot({ path: shot, fullPage: false });

    const linkAndHashOk =
      res?.status() === 200 &&
      linkCount >= 1 &&
      measure.hash === "#o-que-voce-recebe" &&
      measure.heading?.exists &&
      measure.heading.text === "O que você recebe";
    const headerClear = Boolean(measure.heading?.notCoveredByHeader && measure.heading?.visible);
    const formKeyboardOk = Boolean(measure.formExists && measure.formKeyboard?.focused);
    const ok = linkAndHashOk && headerClear && formKeyboardOk;

    results.push({
      profile: mobile ? "mobile-390" : "desktop-1440",
      status: res?.status() ?? null,
      linkVisibleCount: linkCount,
      ok,
      linkAndHashOk,
      headerClear,
      formKeyboardOk,
      failReasons: [
        res?.status() !== 200 ? "bad-status" : null,
        linkCount < 1 ? "link-missing" : null,
        measure.hash !== "#o-que-voce-recebe" ? "hash-mismatch" : null,
        !measure.heading?.visible ? "heading-not-visible" : null,
        measure.heading && !measure.heading.notCoveredByHeader ? "covered-by-header" : null,
        !measure.formKeyboard?.focused ? "form-field-not-focusable" : null
      ].filter(Boolean),
      note: !headerClear
        ? "Link e hash corretos; H2 fica sob header sticky (sem scroll-margin no alvo). Gap de UX, sem mudança de app neste smoke."
        : null,
      measure,
      screenshot: shot
    });
    await context.close();
  }
  return results;
}

async function clickAndCapture(page, selector, label) {
  await hookGtag(page);
  await page.evaluate(() => {
    window.__gtagEvents = [];
  });
  const loc = page.locator(selector).first();
  const count = await loc.count();
  if (!count) return { label, ok: false, error: "selector-missing", selector, events: [] };

  // Diagnóstico do destino resolvido no mesmo origin do Preview.
  const hrefInfo = await loc.evaluate((el, origin) => {
    const href = el.getAttribute("href") || "";
    let destination = null;
    try {
      const url = new URL(href, origin);
      destination = url.origin === origin ? url.pathname.replace(/^\/|\/$/g, "") : `cross-origin:${url.origin}`;
    } catch {
      destination = "bad-url";
    }
    const scope = el.closest("[data-cta-scope]");
    return {
      href,
      destination,
      hasScope: Boolean(scope),
      scopePosition: scope?.dataset.ctaPosition || null,
      listenersLikely: Boolean(scope)
    };
  }, ORIGIN);

  // Impede navegação sem bloquear o bubble do tracker (não usar stopPropagation).
  await loc.evaluate((el) => {
    el.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
      },
      { capture: true, once: true }
    );
  });
  await loc.click({ force: true });
  await page.waitForTimeout(400);
  const eventsRaw = await page.evaluate(() =>
    (window.__gtagEvents || [])
      .filter((a) => a[0] === "event")
      .map((a) => ({ name: a[1], params: a[2] || {} }))
  );
  const seen = new Set();
  const events = [];
  for (const ev of eventsRaw) {
    const key = JSON.stringify(ev);
    if (seen.has(key)) continue;
    seen.add(key);
    events.push(ev);
  }
  return {
    label,
    ok: events.length === 1,
    selector,
    eventCount: events.length,
    rawEventCount: eventsRaw.length,
    events,
    hrefInfo
  };
}

async function smokeCtas(browser) {
  const { context, page } = await openPage(browser, { mobile: false });
  const out = { articles: {}, clicks: [] };

  // Habite-se: compacto + final DD
  {
    const slug = ARTICLES.ddHabiteSe;
    const res = await page.goto(`${ORIGIN}/post/${encodeURI(slug)}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000
    });
    await page.waitForTimeout(1000);
    const inventory = await page.evaluate(() => ({
      compact: Boolean(document.querySelector('[data-cta-variant="due-diligence-compacto"]')),
      complete: Boolean(document.querySelector('[data-cta-variant="due-diligence-completo"]')),
      compra: Boolean(document.querySelector('[data-cta-destination="assessoria-juridica-compra-de-imovel"]')),
      b2b: Boolean(document.querySelector('[data-cta-variant="imobiliarias"]')),
      wa: document.querySelector("[data-cta-whatsapp]")?.getAttribute("href") || null,
      h1: document.querySelector("h1")?.textContent?.trim() || null
    }));
    out.articles.habiteSe = { slug, status: res?.status() ?? null, inventory };
    await page.waitForTimeout(500);
    await hookGtag(page);

    const compact = await clickAndCapture(
      page,
      '[data-cta-variant="due-diligence-compacto"] a[data-cta-destination="due-diligence-imobiliaria"]',
      "compacto-dd"
    );
    const finalDd = await clickAndCapture(
      page,
      '[data-cta-variant="due-diligence-completo"] a.button[data-cta-destination="due-diligence-imobiliaria"]',
      "final-dd"
    );
    out.clicks.push(compact, finalDd);
  }

  // Cessão: secundário compra
  {
    const slug = ARTICLES.ddCesao;
    const res = await page.goto(`${ORIGIN}/post/${encodeURI(slug)}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000
    });
    await page.waitForTimeout(1000);
    const inventory = await page.evaluate(() => ({
      compact: Boolean(document.querySelector('[data-cta-variant="due-diligence-compacto"]')),
      complete: Boolean(document.querySelector('[data-cta-variant="due-diligence-completo"]')),
      compra: Boolean(document.querySelector('[data-cta-destination="assessoria-juridica-compra-de-imovel"]')),
      wa: document.querySelector("[data-cta-whatsapp]")?.getAttribute("href") || null,
      h1: document.querySelector("h1")?.textContent?.trim() || null
    }));
    out.articles.cesao = { slug, status: res?.status() ?? null, inventory };
    await page.waitForTimeout(500);
    await hookGtag(page);
    const compra = await clickAndCapture(
      page,
      '[data-cta-destination="assessoria-juridica-compra-de-imovel"]',
      "secundario-compra"
    );
    out.clicks.push(compra);
    // Inspect WhatsApp href without navigating
    out.whatsappContextual = {
      hrefPresent: Boolean(inventory.wa),
      isWaMe: Boolean(inventory.wa && /wa\.me|api\.whatsapp\.com/i.test(inventory.wa)),
      hasEncodedText: Boolean(inventory.wa && /[?&]text=/i.test(inventory.wa)),
      clicked: false
    };
  }

  // Fiador: B2B
  {
    const slug = ARTICLES.b2bFiador;
    const res = await page.goto(`${ORIGIN}/post/${encodeURI(slug)}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000
    });
    await page.waitForTimeout(1000);
    const inventory = await page.evaluate(() => ({
      compact: Boolean(document.querySelector('[data-cta-variant="due-diligence-compacto"]')),
      complete: Boolean(document.querySelector('[data-cta-variant="due-diligence-completo"]')),
      b2b: Boolean(document.querySelector('[data-cta-variant="imobiliarias"]')),
      h1: document.querySelector("h1")?.textContent?.trim() || null
    }));
    out.articles.fiador = { slug, status: res?.status() ?? null, inventory };
    await page.waitForTimeout(500);
    await hookGtag(page);
    const b2b = await clickAndCapture(
      page,
      '[data-cta-variant="imobiliarias"] a.button',
      "b2b-imobiliarias"
    );
    out.clicks.push(b2b);
  }

  // Validate event contracts
  out.eventChecks = out.clicks.map((c) => {
    const ev = c.events?.[0];
    const params = ev?.params || {};
    const forbidden = ["link_url", "name", "email", "phone", "telefone", "message", "mensagem"].filter(
      (k) => k in params
    );
    const expected = {
      "compacto-dd": {
        name: "click_cta_servico",
        cta_position: "meio_artigo",
        destino: "due-diligence-imobiliaria"
      },
      "final-dd": {
        name: "click_cta_servico",
        cta_position: "fim_artigo",
        destino: "due-diligence-imobiliaria"
      },
      "secundario-compra": {
        name: "click_cta_servico",
        cta_position: "fim_artigo",
        destino: "assessoria-juridica-compra-de-imovel"
      },
      "b2b-imobiliarias": { name: "click_cta_servico", cta_position: "fim_artigo" }
    }[c.label];

    const ok =
      c.ok &&
      ev?.name === expected?.name &&
      params.cta_position === expected.cta_position &&
      (expected.destino ? params.destino === expected.destino : true) &&
      Boolean(params.post_slug) &&
      forbidden.length === 0 &&
      (c.events?.length || 0) === 1;

    return {
      label: c.label,
      ok,
      eventCount: c.eventCount,
      event: ev
        ? { name: ev.name, params: sanitizeEventParams(params) }
        : null,
      forbiddenKeysPresent: forbidden,
      expected
    };
  });

  out.ok =
    out.eventChecks.every((e) => e.ok) &&
    out.articles.habiteSe?.inventory?.compact &&
    out.articles.habiteSe?.inventory?.complete &&
    out.articles.cesao?.inventory?.compra &&
    out.articles.fiador?.inventory?.b2b &&
    !out.articles.fiador?.inventory?.compact &&
    out.whatsappContextual?.hrefPresent &&
    out.whatsappContextual?.clicked === false;

  await context.close();
  return out;
}

async function smokeForm(browser) {
  const { context, page } = await openPage(browser, { mobile: false });
  await page.goto(`${ORIGIN}/due-diligence-imobiliaria`, {
    waitUntil: "domcontentloaded",
    timeout: 90000
  });
  await page.waitForTimeout(800);

  // Scroll form into view via normal page flow (not sr-only fragment)
  await page.locator("form").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const waBefore = await page.evaluate(() => {
    const links = [...document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]')];
    return links.slice(0, 5).map((a) => ({
      text: (a.textContent || "").trim().slice(0, 80),
      hasTextParam: /[?&]text=/i.test(a.href),
      mentionsDd: /due diligence|análise do imóvel/i.test(decodeURIComponent(a.href))
    }));
  });

  // Error path: invalid payload, intercept still returns error; no generate_lead
  await hookGtag(page);
  await page.evaluate(() => {
    window.__gtagEvents = [];
  });
  await page.route("**/api/contato", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ error: "Dados inválidos.", fieldErrors: { email: ["Informe um e-mail válido."] } })
    });
  });

  // Fill enough to pass client validation then get server error
  const form = page.locator("form").first();
  await form.locator('[name="name"]').fill("Felipe Teste Smoke");
  await form.locator('[name="email"]').fill("felipe@example.com");
  await form.locator('[name="phone"]').fill("41999999999");
  const demandSelect = form.locator("select[name='demandType']");
  if (await demandSelect.count()) {
    await demandSelect.selectOption({ index: 1 });
  }
  // Landing DD usa demandType oculto pré-definido; não tentar fill em input hidden.
  await form.locator('[name="message"]').fill("Mensagem de smoke com mais de dez caracteres.");
  const consent = form.locator('[name="consent"]');
  if (await consent.count()) await consent.check({ force: true });

  // Bypass honeypot timing if present by setting startedAt in the past via evaluate before submit
  await page.evaluate(() => {
    const started = document.querySelector('[name="startedAt"]');
    if (started) started.value = String(Date.now() - 10000);
  });

  await form.locator("[data-submit]").click();
  await page.waitForTimeout(500);
  const errorEvents = await page.evaluate(() =>
    (window.__gtagEvents || []).filter((a) => a[0] === "event" && a[1] === "generate_lead")
  );
  const errorStatus = await page.locator("[data-form-status]").textContent().catch(() => "");

  await page.unroute("**/api/contato");

  // Success path
  await hookGtag(page);
  await page.evaluate(() => {
    window.__gtagEvents = [];
  });
  await page.route("**/api/contato", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true })
    });
  });

  // Re-fill if form still present (error path keeps form)
  const formStill = await page.locator("form").count();
  if (formStill) {
    await page.evaluate(() => {
      const started = document.querySelector('[name="startedAt"]');
      if (started) started.value = String(Date.now() - 10000);
    });
    await form.locator("[data-submit]").click();
    await page.waitForTimeout(600);
  }

  const successEventsRaw = await page.evaluate(() =>
    (window.__gtagEvents || [])
      .filter((a) => a[0] === "event" && a[1] === "generate_lead")
      .map((a) => ({ name: a[1], params: a[2] || {} }))
  );
  const successSeen = new Set();
  const successEvents = [];
  for (const ev of successEventsRaw) {
    const key = JSON.stringify(ev);
    if (successSeen.has(key)) continue;
    successSeen.add(key);
    successEvents.push(ev);
  }
  const successUi = await page.evaluate(() => {
    const success = document.querySelector(".form-success");
    const wa = success?.querySelector('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
    let decoded = null;
    if (wa) {
      try {
        decoded = decodeURIComponent(new URL(wa.href).searchParams.get("text") || "");
      } catch {
        decoded = null;
      }
    }
    return {
      successVisible: Boolean(success),
      waPresent: Boolean(wa),
      waText: decoded,
      contextualDd: Boolean(decoded && /due diligence|análise do imóvel/i.test(decoded))
    };
  });

  const lead = successEvents[0];
  const leadParams = lead?.params || {};
  const leadKeys = Object.keys(leadParams);
  const allowed = new Set(["page_slug", "tipo_demanda", "icp", "form_location"]);
  const extraKeys = leadKeys.filter((k) => !allowed.has(k));
  const forbiddenPii = ["name", "email", "phone", "telefone", "message", "mensagem", "link_url"].filter(
    (k) => k in leadParams
  );

  const result = {
    pageSlugExpected: "due-diligence-imobiliaria",
    whatsappOnPage: waBefore,
    errorPath: {
      generateLeadCount: errorEvents.length,
      statusText: (errorStatus || "").trim().slice(0, 120),
      ok: errorEvents.length === 0
    },
    successPath: {
      generateLeadCount: successEvents.length,
      event: lead ? { name: lead.name, params: sanitizeEventParams(leadParams) } : null,
      extraKeys,
      forbiddenPii,
      ui: successUi,
      ok:
        successEvents.length === 1 &&
        leadParams.page_slug === "due-diligence-imobiliaria" &&
        Boolean(leadParams.tipo_demanda) &&
        Boolean(leadParams.form_location) &&
        extraKeys.length === 0 &&
        forbiddenPii.length === 0 &&
        successUi.successVisible &&
        successUi.contextualDd
    }
  };
  result.ok = result.errorPath.ok && result.successPath.ok;
  await context.close();
  return result;
}

const browser = await chromium.launch({ headless: true, channel: "chrome" });
const chrome = await browser.version();
const startedAt = new Date().toISOString();
let anchor;
let ctas;
let form;
try {
  process.stdout.write("anchor...\n");
  anchor = await smokeAnchor(browser);
  process.stdout.write("ctas...\n");
  ctas = await smokeCtas(browser);
  process.stdout.write("form...\n");
  form = await smokeForm(browser);
} finally {
  await browser.close();
}

const payload = {
  probedAt: startedAt,
  finishedAt: new Date().toISOString(),
  chrome,
  candidate: {
    sha: SHA,
    preview: ORIGIN,
    deploymentHint: "fp0125m2c"
  },
  method: "OIDC extraHTTPHeaders; gtag stub local; /api/contato intercepted; WhatsApp not navigated",
  anchor,
  ctas,
  form,
  ok: anchor.every((a) => a.ok) && Boolean(ctas?.ok) && Boolean(form?.ok)
};

writeFileSync(join(outDir, "smoke-cto23.json"), JSON.stringify(payload, null, 2));
console.log(
  JSON.stringify(
    {
      ok: payload.ok,
      anchor: anchor.map((a) => ({ profile: a.profile, ok: a.ok, fail: a.failReasons })),
      ctasOk: ctas?.ok,
      eventChecks: ctas?.eventChecks,
      formOk: form?.ok,
      formErrorOk: form?.errorPath?.ok,
      formSuccessOk: form?.successPath?.ok
    },
    null,
    2
  )
);
process.exit(payload.ok ? 0 : 2);
