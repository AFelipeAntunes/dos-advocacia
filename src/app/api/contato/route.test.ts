import assert from "node:assert/strict";
import test from "node:test";

import { POST } from "./route";

function requestWith(body: Record<string, unknown>) {
  return new Request("http://localhost/api/contato", {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST"
  });
}

function validPayload() {
  return {
    city: "Curitiba",
    consent: true,
    demandType: "Compra, venda ou investimento",
    email: "lead@example.com",
    formLocation: "contato",
    icp: "",
    message: "Gostaria de compreender os documentos antes de assinar.",
    name: "Pessoa Interessada",
    pageSlug: "contato",
    phone: "41999999999",
    startedAt: Date.now() - 5000,
    state: "PR",
    website: ""
  };
}

test("rejects invalid fields before touching Resend", async () => {
  const response = await POST(requestWith({ ...validPayload(), email: "invalido" }));
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.fieldErrors.email[0], "Informe um e-mail válido.");
});

test("rejects the honeypot and submissions made too quickly", async () => {
  const honeypot = await POST(requestWith({ ...validPayload(), website: "bot" }));
  const tooFast = await POST(requestWith({ ...validPayload(), startedAt: Date.now() }));

  assert.equal(honeypot.status, 400);
  assert.equal(tooFast.status, 400);
});
