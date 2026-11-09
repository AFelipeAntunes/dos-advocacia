/**
 * Reconciliação pública de multicategoria sem API Wix:
 * cruza cards das abas /blog?categoria=* e lista posts que aparecem em >1 categoria.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });

const categories = [
  "due-diligence-imobiliária",
  "contratos-imobiliários",
  "assessoria-para-imobiliárias",
  "litígios-imobiliários"
];

const bySlug = new Map();

function extractCards(html, category) {
  const re = /href="(\/post\/[^"]+)"/g;
  const slugs = new Set();
  let match;
  while ((match = re.exec(html))) {
    let slug;
    try {
      slug = decodeURIComponent(match[1].replace(/^\/post\//, "").replace(/\/$/, ""));
    } catch {
      slug = match[1].replace(/^\/post\//, "").replace(/\/$/, "");
    }
    slugs.add(slug);
    const entry = bySlug.get(slug) ?? { slug, categories: new Set() };
    entry.categories.add(category);
    bySlug.set(slug, entry);
  }
  return [...slugs];
}

const fetchedAt = new Date().toISOString();
const perCategory = {};

for (const category of categories) {
  const url = `https://www.dosadvocacia.com.br/blog?categoria=${encodeURIComponent(category)}`;
  const res = await fetch(url);
  const html = await res.text();
  const redirectedHome = /canonical[^>]+href="https:\/\/www\.dosadvocacia\.com\.br\/blog"/i.test(html)
    && !html.includes(`categoria=${category}`)
    && res.url.replace(/\/$/, "").endsWith("/blog");
  const slugs = extractCards(html, category);
  perCategory[category] = {
    url,
    status: res.status,
    finalUrl: res.url,
    cardCount: slugs.length,
    slugs,
    note: slugs.length < 3 ? "aba pode estar oculta/redirecionada por regra de mínimo 3 posts" : "ok"
  };
}

const multi = [...bySlug.values()]
  .filter((entry) => entry.categories.size > 1)
  .map((entry) => ({ slug: entry.slug, categories: [...entry.categories].sort() }));

const report = {
  fetchedAt,
  method: "cruzamento público das abas /blog?categoria= (não enumera categoryIds da API)",
  historicalClaim: "inventário Preview citava 3 posts multicategoria",
  perCategory,
  multicategoryPublicIntersection: multi,
  multicategoryPublicCount: multi.length,
  gap: "Sem WIX_API_KEY/.env.local neste worktree; interseção de abas públicas ≠ categoryIds runtime. Contagem 0 nas abas não prova ausência de multicategoria na API."
};

writeFileSync(join(outDir, "multicategoria-publico.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
