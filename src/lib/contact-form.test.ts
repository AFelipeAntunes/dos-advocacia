import assert from "node:assert/strict";
import test from "node:test";

import { getContactFormMarkup } from "@/lib/contact-form";

test("registers the imobiliárias landing with its own origin and ICP", () => {
  const markup = getContactFormMarkup("imobiliarias");

  assert.ok(markup);
  assert.match(markup, /data-page-slug="assessoria-juridica-para-imobiliarias"/);
  assert.match(markup, /data-icp="imobiliaria"/);
  assert.match(markup, /data-form-location="servico"/);
  assert.match(markup, /name="demandType" value="Locação \/ imobiliária"/);
  assert.match(markup, /js-contact-form/);
});

test("keeps the locação form origin separate from the imobiliárias landing", () => {
  const markup = getContactFormMarkup("locacao");

  assert.ok(markup);
  assert.match(markup, /data-page-slug="assessoria-em-locacao"/);
  assert.doesNotMatch(markup, /assessoria-juridica-para-imobiliarias/);
  assert.match(markup, /data-icp="imobiliaria"/);
});

test("keeps the contact page form without an ICP and with the full form location", () => {
  const markup = getContactFormMarkup("contato");

  assert.ok(markup);
  assert.match(markup, /data-form-location="contato"/);
  assert.match(markup, /data-page-slug="contato"/);
  assert.doesNotMatch(markup, /data-icp="imobiliaria"/);
  assert.match(markup, /name="demandType"/);
});

test("does not create a form for pages without a service form config", () => {
  assert.equal(getContactFormMarkup("sobre"), null);
});
