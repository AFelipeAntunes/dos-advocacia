import type { WixBlogPost } from "@/lib/wix/types";

export type WixPostsPage = {
  posts?: WixBlogPost[];
  metaData?: { offset?: number; total?: number };
};

/** Keeps the API's order and exact slugs; filters invalid rows after paging. */
export async function loadWixPostPages(
  fetchPage: (offset: number) => Promise<WixPostsPage | null>
) {
  const posts: WixBlogPost[] = [];
  let offset = 0;

  for (;;) {
    const response = await fetchPage(offset);
    if (!response) break;
    if (response.metaData?.offset !== undefined && response.metaData.offset !== offset) {
      throw new Error("Wix Blog returned an unexpected paging offset.");
    }

    const page = response.posts ?? [];
    const total = response.metaData?.total;
    const hasTotal = typeof total === "number" && Number.isFinite(total) && total >= 0;
    if (!page.length) {
      if (hasTotal && offset < total) throw new Error("Wix Blog returned an incomplete post inventory.");
      break;
    }

    posts.push(...page);
    offset += page.length;
    if (hasTotal ? offset >= total : page.length < 100) break;
  }

  return posts.filter((post) => Boolean(post.slug && post.title));
}
