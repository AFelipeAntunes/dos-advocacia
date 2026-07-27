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

export const MINIMUM_POSTS_PER_CATEGORY_TAB = 3;

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

export function getPostCategory(post: WixBlogPost, categories: BlogCategory[]) {
  return categories.find((category) => post.categoryIds?.includes(category.id));
}

export function filterPostsByCategory(posts: WixBlogPost[], category?: BlogCategory) {
  if (!category) return posts;

  return posts.filter((post) => post.categoryIds?.includes(category.id));
}

export function getBlogCategoryTabs(categories: BlogCategory[]) {
  return categories.filter((category) => category.postCount >= MINIMUM_POSTS_PER_CATEGORY_TAB);
}

export function getRelatedPosts(
  post: WixBlogPost,
  posts: WixBlogPost[],
  categories: BlogCategory[],
  excludedSlugs: Iterable<string> = []
) {
  const currentCategory = getPostCategory(post, categories);
  if (!currentCategory) return [];

  const exclusions = new Set(excludedSlugs);
  const candidates = posts.filter((candidate) => !isSamePost(candidate, post)
    && (!candidate.slug || !exclusions.has(candidate.slug)));
  const sameCategoryPosts = filterPostsByCategory(candidates, currentCategory);
  const correlatedCategories = RELATED_CATEGORY_SLUGS[currentCategory.slug]
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category): category is BlogCategory => Boolean(category));
  const correlatedPosts = correlatedCategories.flatMap((category) => filterPostsByCategory(candidates, category));

  return distinctPosts([
    ...sortByRelevanceAndMostRecent(post, sameCategoryPosts),
    ...sortByRelevanceAndMostRecent(post, correlatedPosts)
  ]).slice(0, 3);
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

function sortByRelevanceAndMostRecent(post: WixBlogPost, posts: WixBlogPost[]) {
  return [...posts].sort((left, right) => {
    const relevance = getRelatedScore(post, right) - getRelatedScore(post, left);
    return relevance || getPublishedTime(right) - getPublishedTime(left);
  });
}

function getRelatedScore(post: WixBlogPost, candidate: WixBlogPost) {
  return sharedCount(getTopicTerms(post.title), getTopicTerms(candidate.title)) * 1000
    + sharedCount(post.tagIds, candidate.tagIds) * 50
    + sharedCount(post.hashtags, candidate.hashtags) * 20;
}

const TOPIC_STOPWORDS = new Set([
  "a", "administradora", "advocacia", "advogada", "ao", "aos", "as", "com", "como", "comprador", "contrato",
  "da", "das", "de", "do", "dos", "e", "em", "imobiliaria", "imovel", "juridica", "juridico", "locacao",
  "locatario", "na", "nao", "nas", "no", "nos", "o", "os", "para", "por", "proprietario", "que", "quem", "risco",
  "riscos", "um", "uma", "vendedor"
]);

function getTopicTerms(value?: string) {
  return new Set(
    (value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR")
      .split(/[^a-z0-9]+/)
      .filter((term) => term.length >= 3 && !TOPIC_STOPWORDS.has(term))
  );
}

function sharedCount<T>(left?: Iterable<T>, right?: Iterable<T>) {
  if (!left || !right) return 0;

  const values = new Set(left);
  return [...right].filter((value) => values.has(value)).length;
}

function getPublishedTime(post: WixBlogPost) {
  const value = post.firstPublishedDate ? new Date(post.firstPublishedDate).getTime() : 0;
  return Number.isNaN(value) ? 0 : value;
}
