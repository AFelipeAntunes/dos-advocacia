import assert from "node:assert/strict";
import test from "node:test";

import { getWixFaqItems, getWixRichContentBlocks, resolveWixImageUrl } from "@/lib/wix/rich-content";

test("renders the audited simple text shape as a paragraph", () => {
  const blocks = getWixRichContentBlocks({
    nodes: [{ id: "p1", nodes: [{ textData: { text: "Texto simples" }, type: "TEXT" }], type: "PARAGRAPH" }]
  });

  assert.deepEqual(blocks, [{
    id: "p1",
    kind: "paragraph",
    runs: [{ bold: false, italic: false, text: "Texto simples", underline: false }]
  }]);
});

test("preserves rich links and text decorations", () => {
  const blocks = getWixRichContentBlocks({
    nodes: [{
      id: "p-link",
      nodes: [{
        textData: {
          decorations: [{
            linkData: { link: { target: "BLANK", url: "https://example.com" } },
            type: "LINK"
          }, { type: "BOLD" }],
          text: "Leia a fonte"
        },
        type: "TEXT"
      }],
      type: "PARAGRAPH"
    }]
  });

  assert.equal(blocks[0]?.kind, "paragraph");
  assert.deepEqual((blocks[0] as { runs: unknown[] }).runs, [{
    bold: true,
    href: "https://example.com",
    italic: false,
    target: "BLANK",
    text: "Leia a fonte",
    underline: false
  }]);
});

test("supports the audited blockquote and image shapes", () => {
  const blocks = getWixRichContentBlocks({
    nodes: [
      {
        id: "quote",
        nodes: [{ id: "quote-p", nodes: [{ textData: { text: "Citação" }, type: "TEXT" }], type: "PARAGRAPH" }],
        type: "BLOCKQUOTE"
      },
      {
        id: "image",
        imageData: { altText: "Equipe em treinamento", image: { height: 600, src: { id: "abc123" }, width: 900 } },
        type: "IMAGE"
      }
    ]
  });

  assert.equal(blocks[0]?.kind, "blockquote");
  assert.deepEqual(blocks[1], {
    alt: "Equipe em treinamento",
    height: 600,
    id: "image",
    kind: "image",
    src: "abc123",
    width: 900
  });
  assert.equal(resolveWixImageUrl("wix:image://v1/abc123/original.jpg"), "https://static.wixstatic.com/media/abc123");
  assert.equal(resolveWixImageUrl("https://example.com/image.jpg"), undefined);
});

test("extracts FAQ answers until the next question or level-two heading", () => {
  const faqItems = getWixFaqItems({
    nodes: [
      heading("intro", 2, "Introdução"),
      paragraph("intro-text", "Texto anterior."),
      heading("faq", 2, "Perguntas frequentes sobre compra de imóvel"),
      heading("q1", 3, "Primeira pergunta?"),
      paragraph("a1-1", "Primeira parte da resposta."),
      paragraph("a1-2", "Segunda parte."),
      heading("q2", 3, "Segunda pergunta?"),
      paragraph("a2", "Outra resposta."),
      heading("conclusion", 2, "Conclusão"),
      paragraph("after", "Este texto não pertence à resposta.")
    ]
  });

  assert.deepEqual(faqItems, [
    { answer: "Primeira parte da resposta. Segunda parte.", question: "Primeira pergunta?" },
    { answer: "Outra resposta.", question: "Segunda pergunta?" }
  ]);
});

test("requires at least two FAQ pairs and excludes conversion paragraphs", () => {
  const oneItem = getWixFaqItems({
    nodes: [
      heading("faq", 2, "Perguntas frequentes"),
      heading("q1", 3, "Pergunta única?"),
      paragraph("a1", "Resposta única.")
    ]
  });
  assert.deepEqual(oneItem, []);

  const twoItems = getWixFaqItems({
    nodes: [
      heading("faq", 2, "Perguntas frequentes"),
      heading("q1", 3, "Primeira pergunta?"),
      paragraph("a1", "Primeira resposta."),
      linkedParagraph("cta", "Fale com a Dra. Drielle pelo WhatsApp", "https://api.whatsapp.com/send?phone=5541987926468"),
      heading("q2", 3, "Segunda pergunta?"),
      paragraph("a2", "Segunda resposta."),
      linkedParagraph("related", "Leia também: outro conteúdo", "/post/outro-conteudo")
    ]
  });

  assert.deepEqual(twoItems, [
    { answer: "Primeira resposta.", question: "Primeira pergunta?" },
    { answer: "Segunda resposta.", question: "Segunda pergunta?" }
  ]);
});

test("supports published Wix FAQs whose questions are bold paragraphs", () => {
  const faqItems = getWixFaqItems({
    nodes: [
      heading("faq", 2, "Perguntas frequentes"),
      boldParagraph("q1", "A primeira pergunta publicada?"),
      paragraph("a1", "A primeira resposta publicada."),
      boldParagraph("q2", "A segunda pergunta publicada?"),
      paragraph("a2", "A segunda resposta publicada.")
    ]
  });

  assert.deepEqual(faqItems, [
    { answer: "A primeira resposta publicada.", question: "A primeira pergunta publicada?" },
    { answer: "A segunda resposta publicada.", question: "A segunda pergunta publicada?" }
  ]);
});

function heading(id: string, level: number, text: string) {
  return {
    headingData: { level },
    id,
    nodes: [{ textData: { text }, type: "TEXT" }],
    type: "HEADING"
  };
}

function paragraph(id: string, text: string) {
  return {
    id,
    nodes: [{ textData: { text }, type: "TEXT" }],
    type: "PARAGRAPH"
  };
}

function linkedParagraph(id: string, text: string, url: string) {
  return {
    id,
    nodes: [{
      textData: {
        decorations: [{ linkData: { link: { url } }, type: "LINK" }],
        text
      },
      type: "TEXT"
    }],
    type: "PARAGRAPH"
  };
}

function boldParagraph(id: string, text: string) {
  return {
    id,
    nodes: [{ textData: { decorations: [{ type: "BOLD" }], text }, type: "TEXT" }],
    type: "PARAGRAPH"
  };
}
