import assert from "node:assert/strict";
import test from "node:test";

import {
  filterPostsByCategory,
  getBlogCategories,
  getPostCategory,
  getRelatedPosts
} from "@/lib/wix/blog-navigation";
import type { WixBlogCategory, WixBlogPost } from "@/lib/wix/types";

const wixCategories: WixBlogCategory[] = [
  { id: "assessoria", label: "Assessoria para Imobiliárias", slug: "assessoria-para-imobiliárias" },
  { id: "due", label: "Due Diligence Imobiliária", slug: "due-diligence-imobiliária" },
  { id: "contratos", label: "Contratos Imobiliários", slug: "contratos-imobiliários" },
  { id: "litigios", label: "Litígios Imobiliários", slug: "litígios-imobiliários" }
];

test("keeps the approved tab order and hides categories without posts", () => {
  const posts = [post("a", "assessoria", "2026-07-20"), post("d", "due", "2026-07-19")];

  const categories = getBlogCategories(posts, wixCategories);

  assert.deepEqual(categories.map((category) => ({ postCount: category.postCount, slug: category.slug })), [
    { postCount: 1, slug: "assessoria-para-imobiliárias" },
    { postCount: 1, slug: "due-diligence-imobiliária" }
  ]);
});

test("filters posts with the Wix category ID instead of their editorial text", () => {
  const posts = [post("due-post", "due", "2026-07-20"), post("contract-post", "contratos", "2026-07-19")];
  const categories = getBlogCategories(posts, wixCategories);
  const dueDiligence = categories.find((category) => category.slug === "due-diligence-imobiliária");

  assert.ok(dueDiligence);
  assert.deepEqual(filterPostsByCategory(posts, dueDiligence).map((item) => item.slug), ["due-post"]);
  assert.equal(getPostCategory(posts[0], categories)?.label, "Due Diligence Imobiliária");
});

test("uses the newest posts in the same category and excludes the current post", () => {
  const current = post("current", "assessoria", "2026-07-20");
  const posts = [
    current,
    post("oldest", "assessoria", "2026-07-10"),
    post("newest", "assessoria", "2026-07-19"),
    post("middle", "assessoria", "2026-07-15")
  ];
  const categories = getBlogCategories(posts, wixCategories);

  assert.deepEqual(getRelatedPosts(current, posts, categories).map((item) => item.slug), [
    "newest",
    "middle",
    "oldest"
  ]);
});

test("fills due diligence related posts with the correlated contracts category", () => {
  const current = post("current", "due", "2026-07-20");
  const posts = [
    current,
    post("same-category", "due", "2026-07-19"),
    post("contract-newest", "contratos", "2026-07-18"),
    post("contract-oldest", "contratos", "2026-07-12")
  ];
  const categories = getBlogCategories(posts, wixCategories);

  assert.deepEqual(getRelatedPosts(current, posts, categories).map((item) => item.slug), [
    "same-category",
    "contract-newest",
    "contract-oldest"
  ]);
});

function post(slug: string, categoryId: string, firstPublishedDate: string): WixBlogPost {
  return {
    categoryIds: [categoryId],
    firstPublishedDate,
    id: slug,
    slug,
    title: slug
  };
}
