/**
 * R3 — normaliza hrefs absolutos/relativos do artigo principal em produção
 * e separa corpo editorial de possíveis CTAs/fora do article.
 * Não republica; só evidencia contagem. Gaps de Preview/CMS permanecem separados.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const url =
  "https://www.dosadvocacia.com.br/post/due-diligence-imobili%C3%A1ria-o-que-%C3%A9-e-por-que-voc%C3%AA-precisa-fazer-antes-de-qualquer-compra";

function normalizeHref(href, base) {
  if (!href) return null;
  try {
    const u = new URL(href, base);
    u.hash = "";
    // drop trailing slash except root
    if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
      u.pathname = u.pathname.slice(0, -1);
    }
    return u.toString();
  } catch {
    return href;
  }
}

const res = await fetch(url, { redirect: "follow" });
const html = await res.text();
const base = "https://www.dosadvocacia.com.br";

const articleMatch = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
const articleHtml = articleMatch ? articleMatch[1] : null;

function collectServiceLinks(fragment) {
  if (!fragment) return [];
  const hrefs = [];
  const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(fragment))) {
    const norm = normalizeHref(m[1], base);
    if (!norm) continue;
    if (/\/due-diligence-imobiliaria\/?$/i.test(new URL(norm).pathname)) {
      hrefs.push(norm);
    }
  }
  return [...new Set(hrefs)];
}

const pageLinks = collectServiceLinks(html);
const bodyLinks = collectServiceLinks(articleHtml);

const ctaMarkers = {
  blogServiceCtaPresent: /blog-service-cta|data-cta-servico|cta_servico/i.test(html),
  compactCtaPresent: /cta-compact|blog-cta-compact/i.test(html)
};

const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim() || null;
const faqQuestions = [...html.matchAll(/"@type"\s*:\s*"Question"[\s\S]*?"name"\s*:\s*"([^"]+)"/g)].map(
  (m) => m[1]
);

const result = {
  probedAt: new Date().toISOString(),
  url,
  httpStatus: res.status,
  title,
  faqQuestionCount: faqQuestions.length,
  faqQuestions,
  pageDueDiligenceHrefsNormalized: pageLinks,
  pageDueDiligenceHrefCount: pageLinks.length,
  articleBodyDueDiligenceHrefsNormalized: bodyLinks,
  articleBodyDueDiligenceHrefCount: bodyLinks.length,
  articleElementFound: Boolean(articleHtml),
  ctaMarkers,
  note:
    "Contagem normalizada absolute/relative. Dois registros de serviceLinks na página inteira podem incluir fora do corpo; corpo editorial e CTA SSR ficam separados. Cards 03/04 ainda não estão em produção."
};

writeFileSync(join(outDir, "artigo-principal-normalizado.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
