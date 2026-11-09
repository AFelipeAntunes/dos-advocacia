import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { BlogDueDiligenceCompactCta, BlogServiceCta } from "@/components/blog-service-cta";
import { WixRichContent } from "@/components/wix-rich-content";
import { resolveBlogServiceCtaPlan, CONTRATOS_COMPRADOR_POST_IDS } from "@/lib/wix/blog-cta-eligibility";
import { getBlogCategories } from "@/lib/wix/blog-navigation";
import {
  findDueDiligenceCompactInsertionIndex,
  getWixRichContentBlocks
} from "@/lib/wix/rich-content";
import type { WixBlogCategory, WixBlogPost, WixRichContentNode } from "@/lib/wix/types";

const wixCategories: WixBlogCategory[] = [
  { id: "assessoria", label: "Assessoria para Imobiliárias", slug: "assessoria-para-imobiliárias" },
  { id: "due", label: "Due Diligence Imobiliária", slug: "due-diligence-imobiliária" },
  { id: "contratos", label: "Contratos Imobiliários", slug: "contratos-imobiliários" },
  { id: "litigios", label: "Litígios Imobiliários", slug: "litígios-imobiliários" }
];

const buyerContratosId = [...CONTRATOS_COMPRADOR_POST_IDS][0];

const fixtures = {
  b2b: post("post-b2b", ["assessoria"]),
  due: post("post-due", ["due"]),
  contratosBuyer: post("post-contratos-buyer", ["contratos"], buyerContratosId),
  contratosSemPersona: post("post-contratos-sem", ["contratos"], "id-fora-da-allowlist"),
  multicategoria: post("post-multicategoria", ["due", "assessoria"]),
  dueComDesconhecida: post("post-due-unknown", ["due", "fora-do-catalogo"]),
  litigios: post("post-litigios", ["litigios"]),
  semCategoria: post("post-sem-categoria", []),
  categoriaDesconhecida: post("post-categoria-desconhecida", ["fora-do-catalogo"])
};

const categories = getBlogCategories(Object.values(fixtures), wixCategories);

function renderFinal(postFixture: WixBlogPost) {
  return renderToStaticMarkup(createElement(BlogServiceCta, { categories, post: postFixture }));
}

test("keeps the B2B final block for Assessoria and suppresses DD", () => {
  const html = renderFinal(fixtures.b2b);
  assert.match(html, /data-cta-scope="article-service"/);
  assert.match(html, /href="\/assessoria-juridica-para-imobiliarias"/);
  assert.doesNotMatch(html, /due-diligence-imobiliaria/);
  assert.equal(resolveBlogServiceCtaPlan(fixtures.multicategoria, categories)?.kind, "imobiliarias");
  assert.doesNotMatch(renderFinal(fixtures.multicategoria), /article-dd-cta-complete/);
});

test("Due Diligence category receives complete DD block without compra secondary", () => {
  const html = renderFinal(fixtures.due);
  assert.match(html, /id="article-dd-cta-complete"/);
  assert.match(html, /data-cta-position="fim_artigo"/);
  assert.match(html, /href="\/due-diligence-imobiliaria"/);
  assert.match(html, /Conhecer a due diligence imobiliária/);
  assert.match(html, /Falar pelo WhatsApp/);
  assert.doesNotMatch(html, /ver assessoria na compra/);
});

test("Contratos comprador allowlist receives DD complete with compra secondary", () => {
  const html = renderFinal(fixtures.contratosBuyer);
  assert.match(html, /article-dd-cta-complete/);
  assert.match(html, /ver assessoria na compra/);
  assert.match(html, /href="\/assessoria-juridica-compra-de-imovel"/);
});

test("Contratos without buyer proof, Litígios, empty and unknown stay without new blocks", () => {
  assert.equal(renderFinal(fixtures.contratosSemPersona), "");
  assert.equal(renderFinal(fixtures.litigios), "");
  assert.equal(renderFinal(fixtures.semCategoria), "");
  assert.equal(renderFinal(fixtures.categoriaDesconhecida), "");
});

test("unknown extra category id does not erase a known Due Diligence match", () => {
  assert.equal(resolveBlogServiceCtaPlan(fixtures.dueComDesconhecida, categories)?.kind, "due-diligence");
  assert.match(renderFinal(fixtures.dueComDesconhecida), /article-dd-cta-complete/);
});

test("compact CTA SSR markup has unique id and meio_artigo position", () => {
  const html = renderToStaticMarkup(createElement(BlogDueDiligenceCompactCta));
  assert.match(html, /id="article-dd-cta-compact"/);
  assert.match(html, /data-cta-position="meio_artigo"/);
  assert.match(html, /data-cta-scope="due-diligence"/);
  assert.match(html, /Entender a due diligence/);
  assert.match(html, /href="\/due-diligence-imobiliaria"/);
});

test("inserts at most one compact after the third eligible paragraph on the server", () => {
  const nodes = paragraphs(4);
  const blocks = getWixRichContentBlocks({ nodes });
  const index = findDueDiligenceCompactInsertionIndex(blocks);
  assert.equal(index, 2);

  const html = renderToStaticMarkup(
    createElement(WixRichContent, {
      content: { nodes },
      compactAfterBlockIndex: index,
      compactCta: createElement(BlogDueDiligenceCompactCta)
    })
  );

  assert.equal((html.match(/id="article-dd-cta-compact"/g) ?? []).length, 1);
  assert.match(html, /P1[\s\S]*P2[\s\S]*P3[\s\S]*article-dd-cta-compact[\s\S]*P4/);
});

test("short content keeps only the final block opportunity (no compact)", () => {
  const nodes = paragraphs(2);
  assert.equal(findDueDiligenceCompactInsertionIndex(getWixRichContentBlocks({ nodes })), null);
});

test("FAQ and Leia também cut off compact insertion", () => {
  const withFaq: WixRichContentNode[] = [
    ...paragraphs(2),
    {
      id: "faq",
      headingData: { level: 2 },
      nodes: [{ textData: { text: "Perguntas frequentes" }, type: "TEXT" }],
      type: "HEADING"
    },
    ...paragraphs(3, "faq-p")
  ];
  assert.equal(findDueDiligenceCompactInsertionIndex(getWixRichContentBlocks({ nodes: withFaq })), null);

  const withRelated: WixRichContentNode[] = [
    ...paragraphs(2),
    {
      id: "related",
      nodes: [{ textData: { text: "Leia também: outro post" }, type: "TEXT" }],
      type: "PARAGRAPH"
    },
    ...paragraphs(3, "after")
  ];
  assert.equal(findDueDiligenceCompactInsertionIndex(getWixRichContentBlocks({ nodes: withRelated })), null);
});

test("list paragraphs are not counted as eligible body paragraphs", () => {
  const nodes: WixRichContentNode[] = [
    ...paragraphs(2),
    {
      id: "list",
      type: "BULLETED_LIST",
      nodes: [
        {
          id: "li1",
          type: "LIST_ITEM",
          nodes: [{
            id: "li1-p",
            type: "PARAGRAPH",
            nodes: [{ textData: { text: "Item de lista" }, type: "TEXT" }]
          }]
        }
      ]
    },
    ...paragraphs(1, "p3")
  ];
  const blocks = getWixRichContentBlocks({ nodes });
  assert.equal(
    blocks.some((block) => block.kind === "paragraph" && "fromList" in block && block.fromList === true),
    true
  );
  assert.equal(findDueDiligenceCompactInsertionIndex(blocks), 3);
});

test("existing editorial service link does not suppress compact eligibility", () => {
  const nodes: WixRichContentNode[] = [
    paragraphWithLink("P1 com link editorial para due diligence ", "/due-diligence-imobiliaria", "no meio do texto"),
    ...paragraphs(2, "rest")
  ];
  assert.equal(findDueDiligenceCompactInsertionIndex(getWixRichContentBlocks({ nodes })), 2);
});

test("R1: isolated WhatsApp-only conversion paragraph cuts compact before a third body paragraph", () => {
  const nodes: WixRichContentNode[] = [
    ...paragraphs(2),
    {
      id: "wa-only",
      type: "PARAGRAPH",
      nodes: [{
        type: "TEXT",
        textData: {
          text: "Falar pelo WhatsApp",
          decorations: [{
            type: "LINK",
            linkData: { link: { url: "https://wa.me/5541987926468?text=Oi" } }
          }]
        }
      }]
    },
    ...paragraphs(2, "after")
  ];
  assert.equal(findDueDiligenceCompactInsertionIndex(getWixRichContentBlocks({ nodes })), null);
});

test("R1: contact section heading cuts compact before later prose", () => {
  const nodes: WixRichContentNode[] = [
    ...paragraphs(2),
    {
      id: "contact-h2",
      type: "HEADING",
      headingData: { level: 2 },
      nodes: [{ type: "TEXT", textData: { text: "Fale com o escritório" } }]
    },
    ...paragraphs(2, "contact-body")
  ];
  assert.equal(findDueDiligenceCompactInsertionIndex(getWixRichContentBlocks({ nodes })), null);
});

test("R1 contrast: body paragraph that only embeds an editorial link still counts toward the third", () => {
  const nodes: WixRichContentNode[] = [
    ...paragraphs(2),
    paragraphWithLink(
      "Antes de assinar, leia a ",
      "/due-diligence-imobiliaria",
      " due diligence imobiliária com calma."
    )
  ];
  assert.equal(findDueDiligenceCompactInsertionIndex(getWixRichContentBlocks({ nodes })), 2);
});

function post(slug: string, categoryIds: string[], id = slug): WixBlogPost {
  return {
    categoryIds,
    firstPublishedDate: "2026-07-20",
    id,
    slug,
    title: slug
  };
}

function paragraphs(count: number, prefix = "p"): WixRichContentNode[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    type: "PARAGRAPH",
    nodes: [{ textData: { text: `P${index + 1}` }, type: "TEXT" }]
  }));
}

function paragraphWithLink(before: string, href: string, after = ""): WixRichContentNode {
  const nodes: WixRichContentNode[] = [];
  if (before) {
    nodes.push({ type: "TEXT", textData: { text: before } });
  }
  nodes.push({
    type: "TEXT",
    textData: {
      text: href.includes("due-diligence") ? "due diligence" : "serviço",
      decorations: [{ type: "LINK", linkData: { link: { url: href } } }]
    }
  });
  if (after) {
    nodes.push({ type: "TEXT", textData: { text: after } });
  }

  return {
    id: `linked-${nodes.length}`,
    type: "PARAGRAPH",
    nodes
  };
}
