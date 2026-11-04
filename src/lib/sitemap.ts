import type { MetadataRoute } from "next";

import { postConsolidationRedirects } from "@/lib/redirect-config";

/**
 * Builder puro do sitemap.
 *
 * Recebe as rotas institucionais, a lista de posts (quando o Wix está
 * configurado) e os pares de redirect efetivamente servidos. Não lê ambiente,
 * não chama a API Wix e não usa o relógio do build: qualquer data ausente é
 * omitida em vez de inventada.
 */

export type SitemapPost = {
  slug?: string | null;
  lastPublishedDate?: string | null;
};

type InstitutionalRoute = {
  path: string;
  /** Última alteração significativa comprovada, no formato `YYYY-MM-DD`. */
  lastModified?: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
};

const DEFAULT_SITE_URL = "https://www.dosadvocacia.com.br";

/**
 * Última alteração significativa comprovada por rota.
 *
 * Evidência: entradas datadas em `PROJECT_CONTEXT.md`/`docs/ARCHITECTURE.md`
 * conferidas com `git log --numstat` do HTML correspondente em `src/legacy-pages/`.
 * Ajustes globais pouco significativos (por exemplo, a troca do e-mail do rodapé
 * em 2026-08-06) não elevam a data de todas as páginas.
 *
 * Rotas sem comprovação ficam sem `lastModified`:
 * - `/assessoria-em-locacao` e `/assessoria-juridica-para-imobiliarias` têm
 *   alterações locais não publicadas; a data real deve ser registrada no rollout.
 */
const institutionalRoutes: readonly InstitutionalRoute[] = [
  { path: "/", lastModified: "2026-07-17", changeFrequency: "weekly", priority: 1 },
  { path: "/advogada-imobiliaria", lastModified: "2026-08-02", changeFrequency: "monthly", priority: 0.8 },
  { path: "/advogada-imobiliaria-curitiba", lastModified: "2026-08-02", changeFrequency: "monthly", priority: 0.8 },
  { path: "/areas-de-atuacao", lastModified: "2026-07-10", changeFrequency: "monthly", priority: 0.8 },
  { path: "/assessoria-juridica-compra-de-imovel", lastModified: "2026-08-02", changeFrequency: "monthly", priority: 0.8 },
  { path: "/assessoria-em-locacao", changeFrequency: "monthly", priority: 0.8 },
  { path: "/assessoria-juridica-para-imobiliarias", changeFrequency: "monthly", priority: 0.8 },
  { path: "/conflitos-imobiliarios", lastModified: "2026-08-02", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contato", lastModified: "2026-08-06", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contratos-imobiliarios", lastModified: "2026-08-02", changeFrequency: "monthly", priority: 0.8 },
  { path: "/due-diligence-imobiliaria", lastModified: "2026-08-02", changeFrequency: "monthly", priority: 0.8 },
  { path: "/politica-de-privacidade", lastModified: "2026-08-06", changeFrequency: "monthly", priority: 0.8 },
  { path: "/sobre", lastModified: "2026-07-10", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treinamentos", lastModified: "2026-07-10", changeFrequency: "monthly", priority: 0.8 }
];

/**
 * Identidade de URL de um artigo, exatamente como o canonical de
 * `src/app/post/[slug]/page.tsx` a constrói: `encodeURIComponent` sobre o valor
 * recebido do CMS, sem trim, sem decodificação e sem normalização Unicode.
 *
 * NFC e NFD, caixas diferentes e `%` literal são identidades distintas; o
 * sitemap não pode fundi-las nem excluí-las por semelhança.
 */
function postPath(slug: string) {
  return `/post/${encodeURIComponent(slug)}`;
}

/**
 * Forma de path realmente configurada pelo Next para cada origem de
 * consolidação: `encodeURI(source)` em `next.config.ts`. A comparação é literal,
 * sem decodificar e sem fundir barra final, para que uma origem só exclua a URL
 * que ela efetivamente intercepta.
 */
function configuredRedirectPath(source: string) {
  return encodeURI(source);
}

/** Converte uma data `YYYY-MM-DD` em `Date` UTC, sem depender do fuso local. */
function toUtcDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function parseLastModified(value: string | null | undefined) {
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function absoluteUrl(siteUrl: string, path: string) {
  return new URL(path, siteUrl).toString();
}

export type BuildSitemapOptions = {
  siteUrl?: string;
  /**
   * Posts publicados no Wix. `undefined` significa Wix não configurado: o
   * sitemap fica só com as rotas institucionais e não fabrica artigos. Uma
   * lista vazia significa integração ativa sem posts publicados.
   */
  posts?: readonly SitemapPost[] | null;
};

export function buildSitemapEntries({
  siteUrl = DEFAULT_SITE_URL,
  posts
}: BuildSitemapOptions = {}): MetadataRoute.Sitemap {
  const baseUrl = siteUrl.replace(/\/+$/, "");
  const isBlogConfigured = posts !== undefined && posts !== null;
  const redirectOrigins = new Set(
    postConsolidationRedirects.map(([source]) => configuredRedirectPath(source))
  );
  const seenPaths = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of institutionalRoutes) {
    if (redirectOrigins.has(route.path) || seenPaths.has(route.path)) continue;

    seenPaths.add(route.path);
    const entry: MetadataRoute.Sitemap[number] = {
      url: absoluteUrl(baseUrl, route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority
    };

    if (route.lastModified) entry.lastModified = toUtcDate(route.lastModified);
    entries.push(entry);
  }

  if (!isBlogConfigured) return entries;

  entries.push({ url: absoluteUrl(baseUrl, "/blog"), priority: 0.9 });

  for (const post of posts) {
    if (!post.slug) continue;

    const path = postPath(post.slug);

    // Origem de consolidação continua publicada no Wix: fica fora do sitemap.
    // Só a URL emitida idêntica à regra configurada é excluída.
    if (redirectOrigins.has(path) || seenPaths.has(path)) continue;

    seenPaths.add(path);
    const entry: MetadataRoute.Sitemap[number] = {
      url: new URL(path, siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.7
    };

    const lastModified = parseLastModified(post.lastPublishedDate);
    if (lastModified) entry.lastModified = lastModified;
    entries.push(entry);
  }

  return entries;
}
