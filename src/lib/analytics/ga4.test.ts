import assert from "node:assert/strict";
import test from "node:test";

import {
  getClusterFromDestination,
  getInstitutionalPostDestination,
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

test("recognizes opted-in institutional post destinations and preserves accents", () => {
  const origin = "https://www.dosadvocacia.com.br";

  assert.equal(
    getInstitutionalPostDestination(
      "/post/compra-de-im%C3%B3vel-em-invent%C3%A1rio-riscos-que-ningu%C3%A9m-te-conta",
      origin
    ),
    "compra-de-imóvel-em-inventário-riscos-que-ninguém-te-conta"
  );
  assert.equal(
    getInstitutionalPostDestination("https://example.com/post/fora-do-site", origin),
    null
  );
  assert.equal(getInstitutionalPostDestination("/blog", origin), null);
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
