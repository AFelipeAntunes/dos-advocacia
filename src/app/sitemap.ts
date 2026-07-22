import type { MetadataRoute } from "next";

import { isWixBlogConfigured, listWixPosts } from "@/lib/wix/blog";

const siteUrl = process.env.SITE_URL ?? "https://www.dosadvocacia.com.br";
const legacyRoutes = [
  "/",
  "/advogada-imobiliaria",
  "/advogada-imobiliaria-curitiba",
  "/areas-de-atuacao",
  "/assessoria-juridica-compra-de-imovel",
  "/assessoria-em-locacao",
  "/conflitos-imobiliarios",
  "/contato",
  "/contratos-imobiliarios",
  "/due-diligence-imobiliaria",
  "/politica-de-privacidade",
  "/sobre",
  "/treinamentos"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = legacyRoutes.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date("2026-07-10"),
    changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "/" ? 1 : 0.8
  }));

  if (!isWixBlogConfigured()) return staticEntries;

  const posts = await listWixPosts();
  const postEntries = posts.flatMap((post) => {
    if (!post.slug) return [];

    const lastModified = post.lastPublishedDate ? new Date(post.lastPublishedDate) : new Date();
    return [
      {
        url: new URL(`/post/${encodeURIComponent(post.slug)}`, siteUrl).toString(),
        lastModified: Number.isNaN(lastModified.getTime()) ? new Date() : lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7
      }
    ];
  });

  return [...staticEntries, { url: new URL("/blog", siteUrl).toString(), priority: 0.9 }, ...postEntries];
}
