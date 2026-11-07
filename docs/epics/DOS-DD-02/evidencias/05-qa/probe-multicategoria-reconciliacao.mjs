import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(join(outDir, "multicategoria-publico.json"), "utf8"));

const usable = ["due-diligence-imobiliária", "contratos-imobiliários", "assessoria-para-imobiliárias"];
const bySlug = new Map();

for (const category of usable) {
  for (const slug of raw.perCategory[category].slugs) {
    const entry = bySlug.get(slug) ?? { slug, categories: new Set() };
    entry.categories.add(category);
    bySlug.set(slug, entry);
  }
}

const multi = [...bySlug.values()]
  .filter((e) => e.categories.size > 1)
  .map((e) => ({ slug: e.slug, categories: [...e.categories].sort() }));

const assessoriaDue = multi.filter((e) =>
  e.categories.includes("assessoria-para-imobiliárias")
  && e.categories.includes("due-diligence-imobiliária")
);

const report = {
  reconciledAt: new Date().toISOString(),
  litigioAba: {
    finalUrl: raw.perCategory["litígios-imobiliários"].finalUrl,
    cardCount: raw.perCategory["litígios-imobiliários"].cardCount,
    finding: "Filtro litígios redireciona para /blog canônico; cruzar com essa aba inventa multicategoria falsa."
  },
  historicalPreviewClaim: 3,
  publicIntersectionExcludingLitigios: multi,
  publicIntersectionExcludingLitigiosCount: multi.length,
  assessoriaPlusDueDiligencePublic: assessoriaDue,
  assessoriaPlusDueDiligenceCount: assessoriaDue.length,
  conclusion: multi.length === 0
    ? "Nas três abas públicas utilizáveis, nenhum post aparece em mais de uma categoria. A contagem histórica de 3 multicategoria do inventário Preview não é reproduzível só com abas públicas; exige categoryIds da API."
    : "Há interseção pública real entre abas utilizáveis; listar IDs via API antes do release.",
  gapApi: "Sem .env.local/WIX_API_KEY neste worktree — categoryIds runtime não lidos."
};

writeFileSync(join(outDir, "multicategoria-reconciliacao.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
