import type { WixBlogCategory, WixBlogPost } from "@/lib/wix/types";

export const BLOG_CATEGORY_DEFINITIONS = [
  { label: "Assessoria para Imobiliárias", slug: "assessoria-para-imobiliárias" },
  { label: "Due Diligence Imobiliária", slug: "due-diligence-imobiliária" },
  { label: "Contratos Imobiliários", slug: "contratos-imobiliários" },
  { label: "Litígios Imobiliários", slug: "litígios-imobiliários" }
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORY_DEFINITIONS)[number]["slug"];

export type BlogCategory = {
  id: string;
  label: string;
  postCount: number;
  slug: BlogCategorySlug;
};

const RELATED_CATEGORY_SLUGS: Record<BlogCategorySlug, readonly BlogCategorySlug[]> = {
  "assessoria-para-imobiliárias": ["contratos-imobiliários"],
  "due-diligence-imobiliária": ["contratos-imobiliários"],
  "contratos-imobiliários": ["due-diligence-imobiliária"],
  "litígios-imobiliários": ["contratos-imobiliários"]
};

export function getBlogCategories(posts: WixBlogPost[], wixCategories: WixBlogCategory[]) {
  return BLOG_CATEGORY_DEFINITIONS.flatMap((definition) => {
    const wixCategory = wixCategories.find((category): category is WixBlogCategory & {
      id: string;
      label: string;
      slug: string;
    } => category.slug === definition.slug && Boolean(category.id && category.label));
    if (!wixCategory?.id) return [];

    const postCount = posts.filter((post) => post.categoryIds?.includes(wixCategory.id)).length;
    if (postCount === 0) return [];

    return [{
      id: wixCategory.id,
      label: wixCategory.label ?? definition.label,
      postCount,
      slug: definition.slug
    }];
  });
}

export function getBlogCategoryBySlug(slug?: string) {
  return BLOG_CATEGORY_DEFINITIONS.find((category) => category.slug === slug);
}

export function getPostCategory(post: WixBlogPost, categories: BlogCategory[]) {
  return categories.find((category) => post.categoryIds?.includes(category.id));
}

export function filterPostsByCategory(posts: WixBlogPost[], category?: BlogCategory) {
  if (!category) return posts;

  return posts.filter((post) => post.categoryIds?.includes(category.id));
}

export function getRelatedPosts(post: WixBlogPost, posts: WixBlogPost[], categories: BlogCategory[]) {
  const currentCategory = getPostCategory(post, categories);
  if (!currentCategory) return [];

  const candidates = posts.filter((candidate) => !isSamePost(candidate, post));
  const sameCategoryPosts = filterPostsByCategory(candidates, currentCategory);
  const correlatedCategories = RELATED_CATEGORY_SLUGS[currentCategory.slug]
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category): category is BlogCategory => Boolean(category));
  const correlatedPosts = correlatedCategories.flatMap((category) => filterPostsByCategory(candidates, category));

  return distinctPosts([...sortByMostRecent(sameCategoryPosts), ...sortByMostRecent(correlatedPosts)]).slice(0, 3);
}

function distinctPosts(posts: WixBlogPost[]) {
  const seen = new Set<string>();

  return posts.filter((post) => {
    const key = post.id ?? post.slug;
    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function isSamePost(left: WixBlogPost, right: WixBlogPost) {
  if (left.id && right.id) return left.id === right.id;
  return left.slug === right.slug;
}

function sortByMostRecent(posts: WixBlogPost[]) {
  return [...posts].sort((left, right) => getPublishedTime(right) - getPublishedTime(left));
}

function getPublishedTime(post: WixBlogPost) {
  const value = post.firstPublishedDate ? new Date(post.firstPublishedDate).getTime() : 0;
  return Number.isNaN(value) ? 0 : value;
}
