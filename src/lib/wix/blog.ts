import "server-only";

import type { WixBlogPost } from "@/lib/wix/types";

export type { WixBlogPost } from "@/lib/wix/types";

export const WIX_BLOG_TAG = "wix-blog";
const WIX_POST_FIELDSETS = ["CONTENT_TEXT", "RICH_CONTENT", "SEO", "URL"];

type WixListPostsResponse = {
  posts?: WixBlogPost[];
};

type WixGetPostResponse = {
  post?: WixBlogPost;
};

type WixApiConfig = {
  apiKey: string;
  siteId: string;
};

function getWixApiConfig(): WixApiConfig | null {
  const apiKey = process.env.WIX_API_KEY;
  const siteId = process.env.WIX_SITE_ID;

  if (!apiKey || !siteId) return null;

  return { apiKey, siteId };
}

export function isWixBlogConfigured() {
  return getWixApiConfig() !== null;
}

export function decodeWixSlug(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function wixFetch<T>(path: string, options?: RequestInit) {
  const config = getWixApiConfig();
  if (!config) return null;

  const response = await fetch(`https://www.wixapis.com${path}`, {
    ...options,
    headers: {
      Authorization: config.apiKey,
      "wix-site-id": config.siteId,
      ...options?.headers
    },
    next: { tags: [WIX_BLOG_TAG] }
  });

  if (!response.ok) {
    throw new Error(`Wix Blog request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

function fieldsetsQuery() {
  return WIX_POST_FIELDSETS.map((fieldset) => `fieldsets=${fieldset}`).join("&");
}

export async function listWixPosts() {
  const response = await wixFetch<WixListPostsResponse>(
    `/v3/posts?paging.limit=100&${fieldsetsQuery()}`
  );
  return response?.posts?.filter((post) => Boolean(post.slug && post.title)) ?? [];
}

export async function getWixPostBySlug(rawSlug: string) {
  const slug = decodeWixSlug(rawSlug);
  const response = await wixFetch<WixGetPostResponse>(
    `/v3/posts/slugs/${encodeURIComponent(slug)}?${fieldsetsQuery()}`
  );
  return response?.post ?? null;
}
