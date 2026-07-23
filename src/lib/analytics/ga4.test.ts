import assert from "node:assert/strict";
import test from "node:test";

import {
  getClusterFromDestination,
  getServiceDestination,
  isWhatsAppUrl
} from "@/lib/analytics/ga4";

test("recognizes only approved internal service destinations", () => {
  const origin = "https://www.dosadvocacia.com.br";

  assert.equal(getServiceDestination("/assessoria-em-locacao", origin), "assessoria-em-locacao");
  assert.equal(getServiceDestination(`${origin}/due-diligence-imobiliaria`, origin), "due-diligence-imobiliaria");
  assert.equal(getServiceDestination("https://example.com/contratos-imobiliarios", origin), null);
  assert.equal(getServiceDestination("/blog", origin), null);
});

test("maps service destinations to the available marketing clusters", () => {
  assert.equal(getClusterFromDestination("assessoria-em-locacao"), "locacao");
  assert.equal(getClusterFromDestination("due-diligence-imobiliaria"), "due-diligence");
  assert.equal(getClusterFromDestination("assessoria-juridica-compra-de-imovel"), "planta");
  assert.equal(getClusterFromDestination("contratos-imobiliarios"), "contratos");
  assert.equal(getClusterFromDestination("conflitos-imobiliarios"), undefined);
});

test("recognizes the approved WhatsApp hosts", () => {
  assert.equal(isWhatsAppUrl("https://wa.me/5541987926468"), true);
  assert.equal(isWhatsAppUrl("https://api.whatsapp.com/send?phone=5541987926468"), true);
  assert.equal(isWhatsAppUrl("https://example.com/wa.me/5541987926468"), false);
});
