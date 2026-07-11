import assert from "node:assert/strict";
import test from "node:test";

import { getWixRichContentBlocks, resolveWixImageUrl } from "@/lib/wix/rich-content";

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
