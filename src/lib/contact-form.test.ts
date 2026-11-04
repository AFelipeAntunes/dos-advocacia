import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

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

async function submitForm(pageSlug: string, ok = true) {
  let onSubmit: (event: { preventDefault(): void }) => Promise<void> = async () => {};
  const leadEvents: unknown[][] = [];
  class Form {
    dataset = { pageSlug, formLocation: "servico", icp: "imobiliaria" };
    innerHTML = "";
    elements = { namedItem: () => null };
    querySelector() { return null; }
    querySelectorAll() { return []; }
    addEventListener(_name: string, handler: typeof onSubmit) { onSubmit = handler; }
  }
  const form = new Form();
  const values: Record<string, string> = {
    name: "Teste QA", email: "qa@example.test", phone: "41999999999",
    consent: "on", demandType: "Locação / imobiliária", message: "Mensagem privada de teste"
  };
  runInNewContext(readFileSync("public/site-interactions.js", "utf8"), {
    document: {
      querySelector: () => null,
      querySelectorAll: (selector: string) => selector === ".js-contact-form" ? [form] : [],
      addEventListener: () => {}
    },
    window: { gtag: (...args: unknown[]) => leadEvents.push(args) },
    HTMLFormElement: Form, HTMLInputElement: class {}, HTMLButtonElement: class {},
    FormData: class { get(name: string) { return values[name] ?? null; } },
    fetch: async () => ({ ok, json: async () => ({}) })
  });
  await onSubmit({ preventDefault() {} });
  return { markup: form.innerHTML, leadEvents };
}

test("successful landing form identifies the page and contracting intent in WhatsApp without PII", async () => {
  const { markup, leadEvents } = await submitForm("assessoria-juridica-para-imobiliarias");
  const href = markup.match(/href="([^"]+)"/)?.[1];
  assert.ok(href);
  const message = new URL(href).searchParams.get("text") ?? "";
  assert.match(message, /página de Assessoria Jurídica para Imobiliárias/);
  assert.match(message, /já enviei o formulário/);
  assert.match(message, /contratação da assessoria para a minha imobiliária/);
  assert.doesNotMatch(message, /qa@example|41999999999|Mensagem privada|Teste QA/);
  assert.equal(leadEvents.length, 1);
});

test("other forms retain their existing WhatsApp message", async () => {
  const { markup } = await submitForm("contato");
  const href = markup.match(/href="([^"]+)"/)?.[1];
  assert.ok(href);
  assert.equal(new URL(href).searchParams.get("text"), "Olá, enviei uma mensagem pelo site e gostaria de dar sequência ao atendimento.");
});

test("failed submission does not show success WhatsApp CTA or emit a lead", async () => {
  const { markup, leadEvents } = await submitForm("assessoria-juridica-para-imobiliarias", false);
  assert.equal(markup, "");
  assert.equal(leadEvents.length, 0);
});
