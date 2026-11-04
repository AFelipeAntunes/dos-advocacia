import assert from "node:assert/strict";
import test from "node:test";
import { loadWixPostPages } from "@/lib/wix/post-pagination";

const rows = Array.from({ length: 113 }, (_, i) => ({ slug: `post-${i}`, title: `Post ${i}` }));

test("loads the real inventory boundary of 100 + 13 posts in order", async () => {
  const offsets: number[] = [];
  const posts = await loadWixPostPages(async (offset) => {
    offsets.push(offset);
    return { posts: rows.slice(offset, offset + 100), metaData: { total: 113, offset } };
  });
  assert.deepEqual(offsets, [0, 100]);
  assert.deepEqual(posts, rows);
});

test("does not fetch another page when the declared inventory fits one response", async () => {
  let calls = 0;
  const posts = await loadWixPostPages(async () => {
    calls++;
    return { posts: rows.slice(0, 100), metaData: { total: 100, offset: 0 } };
  });
  assert.equal(calls, 1);
  assert.equal(posts.length, 100);
});

test("uses raw row counts for offsets before filtering invalid posts", async () => {
  const source = [...rows];
  source[0] = { slug: "", title: "Invalid row" };
  const posts = await loadWixPostPages(async (offset) => ({
    posts: source.slice(offset, offset + 100), metaData: { total: 113, offset }
  }));
  assert.equal(posts.length, 112);
  assert.equal(posts.at(-1)?.slug, "post-112");
});

test("without totals checks the next page after an exact 100-row response", async () => {
  const offsets: number[] = [];
  const posts = await loadWixPostPages(async (offset) => {
    offsets.push(offset);
    return { posts: offset === 0 ? rows.slice(0, 100) : [] };
  });
  assert.deepEqual(offsets, [0, 100]);
  assert.equal(posts.length, 100);
});

test("rejects a missing or misaddressed second page instead of accepting a partial inventory", async () => {
  await assert.rejects(loadWixPostPages(async (offset) => ({
    posts: offset === 0 ? rows.slice(0, 100) : [], metaData: { total: 113, offset }
  })), /incomplete post inventory/);
  await assert.rejects(loadWixPostPages(async () => ({
    posts: rows.slice(0, 100), metaData: { total: 113, offset: 0 }
  })), /unexpected paging offset/);
});
