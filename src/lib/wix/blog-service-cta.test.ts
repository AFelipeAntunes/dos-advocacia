import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { BlogServiceCta } from "@/components/blog-service-cta";
import { getBlogCategories } from "@/lib/wix/blog-navigation";
import type { WixBlogCategory, WixBlogPost } from "@/lib/wix/types";

const wixCategories: WixBlogCategory[] = [
  { id: "assessoria", label: "Assessoria para Imobiliárias", slug: "assessoria-para-imobiliárias" },
  { id: "due", label: "Due Diligence Imobiliária", slug: "due-diligence-imobiliária" },
  { id: "contratos", label: "Contratos Imobiliários", slug: "contratos-imobiliários" },
  { id: "litigios", label: "Litígios Imobiliários", slug: "litígios-imobiliários" }
];

const fixtures = {
  b2b: post("post-b2b", ["assessoria"]),
  b2c: post("post-b2c", ["due"]),
  multicategoria: post("post-multicategoria", ["due", "assessoria"]),
  semCategoria: post("post-sem-categoria", []),
  categoriaDesconhecida: post("post-categoria-desconhecida", ["fora-do-catalogo"])
};

const categories = getBlogCategories(Object.values(fixtures), wixCategories);

function render(postFixture: WixBlogPost) {
  return renderToStaticMarkup(createElement(BlogServiceCta, { categories, post: postFixture }));
}

test("renders the service block on the server for the approved B2B category", () => {
  const html = render(fixtures.b2b);

  assert.match(html, /data-cta-scope="article-service"/);
  assert.match(html, /href="\/assessoria-juridica-para-imobiliarias"/);
  assert.equal((html.match(/assessoria-juridica-para-imobiliarias/g) ?? []).length, 1);

  const anchor = /<a\b[^>]*href="\/assessoria-juridica-para-imobiliarias"[^>]*>([\s\S]*?)<\/a>/.exec(html);
  assert.ok(anchor, "service block link was not rendered");
  assert.equal(anchor[1].trim(), "Assessoria jurídica para imobiliárias");
});

test("renders the block when the approved category is one of several", () => {
  const html = render(fixtures.multicategoria);

  assert.match(html, /data-cta-scope="article-service"/);
  assert.match(html, /href="\/assessoria-juridica-para-imobiliarias"/);
});

test("does not render the block outside the approved category", () => {
  assert.equal(render(fixtures.b2c), "");
  assert.equal(render(fixtures.semCategoria), "");
  assert.equal(render(fixtures.categoriaDesconhecida), "");
});

function post(slug: string, categoryIds: string[]): WixBlogPost {
  return {
    categoryIds,
    firstPublishedDate: "2026-07-20",
    id: slug,
    slug,
    title: slug
  };
}
