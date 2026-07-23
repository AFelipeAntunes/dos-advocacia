import assert from "node:assert/strict";
import test from "node:test";

import nextConfig, { postConsolidationRedirects } from "../../next.config";

test("configura os 12 redirects de consolidação com status 301", async () => {
  assert.equal(postConsolidationRedirects.length, 12);
  assert.equal(new Set(postConsolidationRedirects.map(([source]) => source)).size, 12);

  const redirects = await nextConfig.redirects?.();
  assert.ok(redirects);

  for (const [source, destination] of postConsolidationRedirects) {
    assert.deepEqual(
      redirects.find((redirect) => redirect.source === encodeURI(source)),
      { source: encodeURI(source), destination: encodeURI(destination), statusCode: 301 }
    );
  }
});
