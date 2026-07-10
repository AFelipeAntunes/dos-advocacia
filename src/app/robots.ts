import type { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL ?? "https://www.dosadvocacia.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" }
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl
  };
}
