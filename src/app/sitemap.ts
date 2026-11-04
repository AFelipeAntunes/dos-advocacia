import type { MetadataRoute } from "next";

import { buildSitemapEntries } from "@/lib/sitemap";
import { isWixBlogConfigured, listWixPosts } from "@/lib/wix/blog";

const siteUrl = process.env.SITE_URL ?? "https://www.dosadvocacia.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isWixBlogConfigured()) return buildSitemapEntries({ siteUrl });

  // Uma única consulta ao Wix por geração; a API nunca é chamada por post.
  const posts = await listWixPosts();
  return buildSitemapEntries({ siteUrl, posts });
}
