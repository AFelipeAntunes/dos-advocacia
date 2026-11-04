import assert from "node:assert/strict";
import test from "node:test";

import {
  destinationIsAlsoSource,
  duplicateSources,
  resolveRedirectChain,
  selfLoops,
  type PathPair
} from "@/lib/redirect-graph";

test("redirect-graph detecta self-loop, origem duplicada e cadeia", () => {
  const bad: PathPair[] = [
    ["/a", "/a"],
    ["/b", "/c"],
    ["/b", "/d"],
    ["/c", "/e"]
  ];
  assert.deepEqual(selfLoops(bad), [["/a", "/a"]]);
  assert.deepEqual(duplicateSources(bad), ["/b"]);
  assert.deepEqual(destinationIsAlsoSource(bad), [
    ["/a", "/a"],
    ["/b", "/c"]
  ]);

  const cycle = resolveRedirectChain(
    [
      ["/x", "/y"],
      ["/y", "/x"]
    ],
    "/x"
  );
  assert.equal(cycle.cycle, true);
  assert.equal(cycle.maxHopsReached, false);
});

test("redirect-graph permite destino compartilhado sem cadeia", () => {
  const shared: PathPair[] = [
    ["/o1", "/final"],
    ["/o2", "/final"]
  ];
  assert.deepEqual(destinationIsAlsoSource(shared), []);
  assert.equal(resolveRedirectChain(shared, "/o1").final, "/final");
  assert.equal(resolveRedirectChain(shared, "/o2").final, "/final");
});

test("redirect-graph distingue limite de saltos de ciclo real (parecer 06)", () => {
  const longChain: PathPair[] = Array.from({ length: 9 }, (_, i) => [
    `/n${i}`,
    `/n${i + 1}`
  ] as const);
  const result = resolveRedirectChain(longChain, "/n0", 8);
  assert.equal(result.cycle, false);
  assert.equal(result.maxHopsReached, true);
  assert.equal(result.final, "/n8");
});
