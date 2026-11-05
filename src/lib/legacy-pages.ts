import "server-only";

import type { Metadata } from "next";
import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { getContactFormMarkup } from "@/lib/contact-form";
import { addInstitutionalLinks, normalizeLegacyLinks } from "@/lib/legacy-navigation";

import { alignOfficeJsonLd, officeName } from "@/lib/office-schema";

export const legacyPageFiles = {
  advogadaImobiliaria: "advogada-imobiliaria.html",
  advogadaImobiliariaCuritiba: "advogada-imobiliaria-curitiba.html",
  assessoriaCompraImovel: "assessoria-juridica-compra-de-imovel.html",
  home: "index.html",
  areas: "areas-de-atuacao.html",
  imobiliarias: "assessoria-juridica-para-imobiliarias.html",
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

function matchValue(source: string, expression: RegExp) {
  return expression.exec(source)?.[1]?.trim();
}

function extractBody(source: string, key: LegacyPageKey) {
  const body = matchValue(source, /<body[^>]*>([\s\S]*?)<\/body>/i) ?? "";
  const withoutLegacyScript = body.replace(
    /<script\b[^>]*src=["']\/script\.js["'][^>]*><\/script>/gi,
    ""
  );

  const normalizedLinks = normalizeLegacyLinks(withoutLegacyScript);
  const currentPath = `/${legacyPageFiles[key].replace(/\.html$/, "")}`;
  const withInstitutionalLinks = addInstitutionalLinks(normalizedLinks, currentPath);
  const formMarkup = getContactFormMarkup(key);
  if (!formMarkup) return withInstitutionalLinks;

  if (key === "contato") {
    return withInstitutionalLinks.replace("<!-- contact-form -->", formMarkup).replace(
      /<form\b[^>]*class=["'][^"']*\bcontact-form\b[^"']*["'][^>]*>[\s\S]*?<\/form>/i,
      formMarkup
    );
  }

  return withInstitutionalLinks.replace(/<\/main>/i, `${formMarkup}</main>`);
}

function extractJsonLd(source: string) {
  return [...source.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim())
    .filter(Boolean)
    .map(alignOfficeJsonLd);
}

const loadLegacyPage = cache(async (key: LegacyPageKey): Promise<LegacyPage> => {
  const file = legacyPageFiles[key];
  const source = await readFile(path.join(process.cwd(), "src", "legacy-pages", file), "utf8");

  return {
    body: extractBody(source, key),
    canonical: matchValue(source, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i),
    description: matchValue(source, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i),
    jsonLd: extractJsonLd(source),
    ogImage: matchValue(source, /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i),
    ogTitle: matchValue(source, /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i),
    title: matchValue(source, /<title>([\s\S]*?)<\/title>/i) ?? officeName
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
      siteName: officeName,
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
