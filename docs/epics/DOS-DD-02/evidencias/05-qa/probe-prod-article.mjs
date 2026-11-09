import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });

const slug = "due-diligence-imobiliária-o-que-é-e-por-que-você-precisa-fazer-antes-de-qualquer-compra";
const url = `https://www.dosadvocacia.com.br/post/${encodeURIComponent(slug)}`;
const started = new Date().toISOString();

const res = await fetch(url, { redirect: "manual" });
const html = res.status >= 200 && res.status < 400 ? await (await fetch(url)).text() : "";
const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? null;
const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? null;
const faqCount = (html.match(/application\/ld\+json[\s\S]*?FAQPage/g) ?? []).length;
const faqQuestions = [...html.matchAll(/"@type"\s*:\s*"Question"[\s\S]*?"name"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
const ddLinks = [...html.matchAll(/href="([^"]*due-diligence-imobiliaria[^"]*)"/gi)].map((m) => m[1]);
const canonical = html.match(/rel="canonical"\s+href="([^"]+)"/i)?.[1]
  ?? html.match(/href="([^"]+)"\s+rel="canonical"/i)?.[1]
  ?? null;

const expectedCmo = {
  titleSeo: "O que é due diligence imobiliária e o que ela verifica",
  faqCount: 6,
  linksToServiceMin: 2
};

const report = {
  probedAt: started,
  url,
  httpStatusFirst: res.status,
  location: res.headers.get("location"),
  title,
  h1,
  canonical,
  faqJsonLdHits: faqCount,
  faqQuestions,
  faqQuestionCount: faqQuestions.length,
  dueDiligenceHrefs: [...new Set(ddLinks)],
  dueDiligenceHrefCount: new Set(ddLinks).size,
  expectedCmo,
  matches: {
    titleMatchesCmo: title?.includes(expectedCmo.titleSeo) || title === expectedCmo.titleSeo,
    titleLooksPrevious: /quando fazer|por que você precisa/i.test(title ?? ""),
    faqCountIsSix: faqQuestions.length === 6,
    hasAtLeastTwoServiceLinks: new Set(ddLinks).size >= 2
  }
};

writeFileSync(join(outDir, "artigo-principal-producao.json"), JSON.stringify(report, null, 2));
writeFileSync(join(outDir, "artigo-principal-producao.html"), html.slice(0, 200000));
console.log(JSON.stringify(report, null, 2));
