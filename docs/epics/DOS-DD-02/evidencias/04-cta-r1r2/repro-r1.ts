/**
 * Reprodução CTO 11 R1 (corrigida).
 * Antes: index 2 / 3. Depois: null / null; contraste editorial permanece 2.
 * Executar na raiz do worktree: npx tsx docs/epics/DOS-DD-02/evidencias/04-cta-r1r2/repro-r1.ts
 */
import assert from "node:assert/strict";

import {
  findDueDiligenceCompactInsertionIndex,
  getWixRichContentBlocks
} from "@/lib/wix/rich-content";
import type { WixRichContentNode } from "@/lib/wix/types";

function paragraphs(count: number, prefix = "p"): WixRichContentNode[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    type: "PARAGRAPH",
    nodes: [{ textData: { text: `Corpo ${index + 1}` }, type: "TEXT" }]
  }));
}

const whatsappOnly: WixRichContentNode[] = [
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

const contactHeading: WixRichContentNode[] = [
  ...paragraphs(2),
  {
    id: "contact-h2",
    type: "HEADING",
    headingData: { level: 2 },
    nodes: [{ type: "TEXT", textData: { text: "Fale com o escritório" } }]
  },
  ...paragraphs(2, "contact-body")
];

const embeddedEditorial: WixRichContentNode[] = [
  ...paragraphs(2),
  {
    id: "embedded",
    type: "PARAGRAPH",
    nodes: [
      { type: "TEXT", textData: { text: "Antes de assinar, leia a " } },
      {
        type: "TEXT",
        textData: {
          text: "due diligence",
          decorations: [{
            type: "LINK",
            linkData: { link: { url: "/due-diligence-imobiliaria" } }
          }]
        }
      },
      { type: "TEXT", textData: { text: " imobiliária com calma." } }
    ]
  }
];

const result = {
  beforeCTO: {
    caseWhatsAppOnly: 2,
    caseContactHeading: 3,
    note: "Valores reportados pelo CTO no parecer 11 antes da correção"
  },
  after: {
    caseWhatsAppOnly: findDueDiligenceCompactInsertionIndex(getWixRichContentBlocks({ nodes: whatsappOnly })),
    caseContactHeading: findDueDiligenceCompactInsertionIndex(getWixRichContentBlocks({ nodes: contactHeading })),
    caseEmbeddedEditorial: findDueDiligenceCompactInsertionIndex(getWixRichContentBlocks({ nodes: embeddedEditorial }))
  }
};

console.log(JSON.stringify(result, null, 2));

assert.equal(result.after.caseWhatsAppOnly, null);
assert.equal(result.after.caseContactHeading, null);
assert.equal(result.after.caseEmbeddedEditorial, 2);
console.log("R1 repro OK");
