import "server-only";

import type { Metadata } from "next";
import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const legacyPageFiles = {
  advogadaImobiliaria: "advogada-imobiliaria.html",
  advogadaImobiliariaCuritiba: "advogada-imobiliaria-curitiba.html",
  home: "index.html",
  areas: "areas-de-atuacao.html",
  locacao: "assessoria-em-locacao.html",
  conflitos: "conflitos-imobiliarios.html",
  contato: "contato.html",
  conteudos: "conteudos.html",
  contratos: "contratos-imobiliarios.html",
  dueDiligence: "due-diligence-imobiliaria.html",
  privacidade: "politica-de-privacidade.html",
  sobre: "sobre.html",
  treinamentos: "treinamentos.html",
  notFound: "404.html"
} as const;

export type LegacyPageKey = keyof typeof legacyPageFiles;

type LegacyPage = {
  body: string;
  canonical?: string;
  description?: string;
  jsonLd: string[];
  ogImage?: string;
  ogTitle?: string;
  title: string;
};

const legacyLinkMap: Record<string, string> = {
  "/areas-de-atuacao.html": "/areas-de-atuacao",
  "/assessoria-em-locacao.html": "/assessoria-em-locacao",
  "/conflitos-imobiliarios.html": "/conflitos-imobiliarios",
  "/contato.html": "/contato",
  "/conteudos.html": "/blog",
  "/contratos-imobiliarios.html": "/contratos-imobiliarios",
  "/due-diligence-imobiliaria.html": "/due-diligence-imobiliaria",
  "/politica-de-privacidade.html": "/politica-de-privacidade",
  "/sobre.html": "/sobre",
  "/treinamentos.html": "/treinamentos"
};

function matchValue(source: string, expression: RegExp) {
  return expression.exec(source)?.[1]?.trim();
}

function extractBody(source: string) {
  const body = matchValue(source, /<body[^>]*>([\s\S]*?)<\/body>/i) ?? "";
  const withoutLegacyScript = body.replace(
    /<script\b[^>]*src=["']\/script\.js["'][^>]*><\/script>/gi,
    ""
  );

  const normalizedLinks = Object.entries(legacyLinkMap).reduce(
    (html, [legacyPath, routePath]) => html.replaceAll(legacyPath, routePath),
    withoutLegacyScript
  );

  return addNationalLandingLinks(normalizedLinks);
}

const nationalLandingPath = "/advogada-imobiliaria";
const nationalLandingLink = `<a href="${nationalLandingPath}">Advogada Imobiliária</a>`;

function addNationalLandingLinks(body: string) {
  const withMenuLink = body.replace(
    /<nav\b[^>]*class=["'][^"']*\bmain-nav\b[^"']*["'][^>]*>[\s\S]*?<\/nav>/i,
    (navigation) => {
      if (navigation.includes(`href="${nationalLandingPath}"`)) return navigation;

      return navigation.replace(
        /(<a\b[^>]*class=["'][^"']*\bnav-contact\b)/i,
        `${nationalLandingLink}$1`
      );
    }
  );

  return withMenuLink.replace(
    /<div class="footer-column">\s*<p class="footer-label">Navegação<\/p>[\s\S]*?<\/div>/i,
    (navigation) => {
      if (navigation.includes(`href="${nationalLandingPath}"`)) return navigation;

      return navigation.replace(/<\/div>$/i, `${nationalLandingLink}</div>`);
    }
  );
}

function extractJsonLd(source: string) {
  return [...source.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim())
    .filter(Boolean);
}

const loadLegacyPage = cache(async (key: LegacyPageKey): Promise<LegacyPage> => {
  const file = legacyPageFiles[key];
  const source = await readFile(path.join(process.cwd(), "src", "legacy-pages", file), "utf8");

  return {
    body: extractBody(source),
    canonical: matchValue(source, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i),
    description: matchValue(source, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i),
    jsonLd: extractJsonLd(source),
    ogImage: matchValue(source, /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i),
    ogTitle: matchValue(source, /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i),
    title: matchValue(source, /<title>([\s\S]*?)<\/title>/i) ?? "DOS Advocacia Imobiliária"
  };
});

export async function getLegacyPage(key: LegacyPageKey) {
  return loadLegacyPage(key);
}

export async function getLegacyMetadata(key: LegacyPageKey): Promise<Metadata> {
  const page = await loadLegacyPage(key);

  return {
    title: page.title,
    description: page.description,
    alternates: page.canonical ? { canonical: page.canonical } : undefined,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      title: page.ogTitle ?? page.title,
      description: page.description,
      url: page.canonical,
      siteName: "DOS Advocacia Imobiliária",
      images: page.ogImage ? [{ url: page.ogImage }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: page.ogTitle ?? page.title,
      description: page.description,
      images: page.ogImage ? [page.ogImage] : undefined
    }
  };
}
