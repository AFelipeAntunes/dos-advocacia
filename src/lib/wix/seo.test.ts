import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { getPostSeoTitle } from "@/lib/wix/seo";
import type { WixBlogPost, WixSeoData } from "@/lib/wix/types";

/** Mirrors `generateMetadata` in `src/app/post/[slug]/page.tsx` without importing the route. */
function resolveDocumentTitle(post: WixBlogPost) {
  return getPostSeoTitle(post) ?? `${post.title} | DOS Advocacia Imobiliária`;
}

test("reads the audited Wix string title with Unicode and trims only its boundary", () => {
  const title = "Due diligence imobiliária: o que é e por que fazer antes de comprar | DOS Advocacia";
  assert.equal(getPostSeoTitle({ seoData: { tags: [{ type: "title", children: `  ${title}  ` }] } }), title);
});

test("does not truncate a long SEO title or strip its brand", () => {
  const title = "Assessoria jurídica para imobiliárias, administradoras e equipes de locação | DOS Advocacia Imobiliária";
  assert.equal(getPostSeoTitle({ seoData: { tags: [{ type: "title", children: title }] } }), title);
});

test("without SEO data or a title tag leaves the existing fallback to the consumer", () => {
  for (const post of [{}, { seoData: {} }, { seoData: { tags: [] } }, { seoData: { tags: [{ type: "meta", props: { name: "title", content: "Não é title" } }] } }]) {
    assert.equal(getPostSeoTitle(post), undefined);
  }
});

test("empty or whitespace-only title is not an override", () => {
  for (const children of ["", " \n\t "]) {
    assert.equal(getPostSeoTitle({ seoData: { tags: [{ type: "title", children }] } }), undefined);
  }
});

test("disabled title tags are not rendered even with valid text", () => {
  assert.equal(getPostSeoTitle({ seoData: { tags: [{ type: "title", children: "Desabilitado", disabled: true }] } }), undefined);
  assert.equal(getPostSeoTitle({ seoData: { tags: [{ type: "title", children: "Ativo", disabled: false }] } }), "Ativo");
});

test("malformed children fail closed instead of joining or coercing objects", () => {
  for (const children of [null, 42, {}, ["Título"], [{ children: ["Título"] }]]) {
    // Deliberately malformed wire payloads: the client casts JSON, so guard at this boundary.
    const seoData = { tags: [{ type: "title", children }] } as unknown as WixSeoData;
    assert.equal(getPostSeoTitle({ seoData }), undefined);
  }
});

test("malformed tag collection and null tag do not throw", () => {
  for (const tags of [{}, "title", [null]]) {
    const post = { seoData: { tags } } as unknown as WixBlogPost;
    assert.equal(getPostSeoTitle(post), undefined);
  }
});

test("only an enabled title string can override and source data stays unchanged", () => {
  const post: WixBlogPost = { title: "H1 editorial", slug: "Post-%-Imóvel", seoData: { tags: [
    { type: "script", children: "Não é título" },
    { type: "title", children: "Inativo", disabled: true },
    { type: "title", children: "Compra & venda <segura> \"Drielle\"" }
  ] } };
  const before = structuredClone(post);
  assert.equal(getPostSeoTitle(post), "Compra & venda <segura> \"Drielle\"");
  assert.deepEqual(post, before);
});

test("generateMetadata consumer: SEO title wins document title; OG/Twitter/H1 stay display", () => {
  const post: WixBlogPost = {
    title: "Due Diligence Imobiliária: o que é e por que você precisa fazer antes de qualquer compra",
    slug: "due-diligence-imobiliária-o-que-é-e-por-que-você-precisa-fazer-antes-de-qualquer-compra",
    seoData: {
      tags: [{ type: "title", children: "Due diligence imobiliária: o que é e quando fazer", disabled: false }]
    }
  };

  assert.equal(resolveDocumentTitle(post), "Due diligence imobiliária: o que é e quando fazer");
  assert.equal(post.title, "Due Diligence Imobiliária: o que é e por que você precisa fazer antes de qualquer compra");
  assert.notEqual(resolveDocumentTitle(post), `${post.title} | DOS Advocacia Imobiliária`);
});

test("generateMetadata consumer: missing SEO title keeps the exact previous fallback", () => {
  const post: WixBlogPost = {
    title: "Garantia do fiador na renovação do contrato de aluguel",
    slug: "garantia-do-fiador-na-renovação-do-contrato-de-aluguel",
    seoData: { tags: [] }
  };

  assert.equal(getPostSeoTitle(post), undefined);
  assert.equal(resolveDocumentTitle(post), "Garantia do fiador na renovação do contrato de aluguel | DOS Advocacia Imobiliária");
});

test("lote editorial 13: raw seoData.tags title children become document titles without retitling display", () => {
  const fixturePath = join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../docs/epics/DOS-SEO-01/evidencias/14-card06/lote13-display-vs-seo.json"
  );
  const fixture = JSON.parse(readFileSync(fixturePath, "utf8")) as {
    rows: Array<{ item: string; slug: string; display: string; seo: string; disabled: boolean }>;
  };

  assert.equal(fixture.rows.length, 13);

  for (const row of fixture.rows) {
    const post: WixBlogPost = {
      title: row.display,
      slug: row.slug,
      seoData: { tags: [{ type: "title", children: row.seo, disabled: row.disabled }] }
    };

    assert.equal(getPostSeoTitle(post), row.seo, row.item);
    assert.equal(resolveDocumentTitle(post), row.seo, row.item);
    assert.equal(post.title, row.display, row.item);
  }
});
