import assert from "node:assert/strict";
import test from "node:test";

import { isAuthorizedWixRevalidation, isWixRevalidationConfigured } from "@/lib/wix/revalidation";

const originalSecret = process.env.WIX_REVALIDATION_SECRET;

function setSecret(value?: string) {
  if (value === undefined) {
    delete process.env.WIX_REVALIDATION_SECRET;
    return;
  }

  process.env.WIX_REVALIDATION_SECRET = value;
}

test("requires a configured secret", () => {
  setSecret();
  assert.equal(isWixRevalidationConfigured(), false);
  assert.equal(isAuthorizedWixRevalidation(new Request("https://example.com")), false);
});

test("accepts only the configured bearer or server header", () => {
  setSecret("test-secret");

  assert.equal(isAuthorizedWixRevalidation(new Request("https://example.com", {
    headers: { authorization: "Bearer test-secret" }
  })), true);
  assert.equal(isAuthorizedWixRevalidation(new Request("https://example.com", {
    headers: { "x-revalidation-secret": "test-secret" }
  })), true);
  assert.equal(isAuthorizedWixRevalidation(new Request("https://example.com", {
    headers: { authorization: "Bearer incorrect" }
  })), false);
});

test.after(() => setSecret(originalSecret));
