import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  bindBlogCtaTrackerListeners,
  BlogCtaTracker
} from "@/components/blog-cta-tracker";
import { BlogDueDiligenceCompactCta, BlogServiceCta } from "@/components/blog-service-cta";
import { getBlogCategories } from "@/lib/wix/blog-navigation";
import type { WixBlogCategory, WixBlogPost } from "@/lib/wix/types";

const ORIGIN = "https://www.dosadvocacia.com.br";

const wixCategories: WixBlogCategory[] = [
  { id: "due", label: "Due Diligence Imobiliária", slug: "due-diligence-imobiliária" },
  { id: "assessoria", label: "Assessoria para Imobiliárias", slug: "assessoria-para-imobiliárias" },
  { id: "contratos", label: "Contratos Imobiliários", slug: "contratos-imobiliários" }
];

test("BlogCtaTracker renders nothing on the server", () => {
  assert.equal(renderToStaticMarkup(createElement(BlogCtaTracker, { postSlug: "demo-post" })), "");
});

test("R2 fixture exposes one compact and one complete with unique ids", () => {
  const categories = getBlogCategories(
    [{ categoryIds: ["due"], id: "1", slug: "demo", title: "demo", firstPublishedDate: "2026-01-01" }],
    wixCategories
  );
  const compact = renderToStaticMarkup(createElement(BlogDueDiligenceCompactCta));
  const complete = renderToStaticMarkup(
    createElement(BlogServiceCta, {
      categories,
      post: { categoryIds: ["due"], id: "1", slug: "demo", title: "demo" } satisfies WixBlogPost
    })
  );

  assert.equal((compact.match(/id="article-dd-cta-compact"/g) ?? []).length, 1);
  assert.equal((complete.match(/id="article-dd-cta-complete"/g) ?? []).length, 1);
  assert.doesNotMatch(compact + complete, /id="article-dd-cta-compact".*id="article-dd-cta-compact"/s);
});

test("R2: compact link and child span emit one meio_artigo service event each click", () => {
  const { events, click, cleanup, listenerCounts } = mountTrackerFixture({
    postSlug: "post-dd",
    includeCompact: true,
    includeComplete: true
  });

  click("compact-link");
  assert.equal(events.length, 1);
  assert.deepEqual(events[0], [
    "event",
    "click_cta_servico",
    {
      post_slug: "post-dd",
      destino: "due-diligence-imobiliaria",
      cta_position: "meio_artigo"
    }
  ]);

  events.length = 0;
  click("compact-span");
  assert.equal(events.length, 1);
  assert.equal((events[0][2] as { cta_position: string }).cta_position, "meio_artigo");
  assert.ok(!JSON.stringify(events).includes("link_url"));
  assert.ok(!JSON.stringify(events).includes("cta_variant"));

  cleanup();
  assert.equal(listenerCounts.added, listenerCounts.removed);
});

test("R2: complete DD button, compra secondary and WhatsApp emit one fim_artigo event each", () => {
  const { events, click, cleanup } = mountTrackerFixture({
    postSlug: "post-contratos",
    includeCompact: true,
    includeComplete: true,
    showCompra: true
  });

  click("complete-dd");
  assert.deepEqual(events.at(-1), [
    "event",
    "click_cta_servico",
    {
      post_slug: "post-contratos",
      destino: "due-diligence-imobiliaria",
      cta_position: "fim_artigo"
    }
  ]);

  click("complete-compra");
  assert.deepEqual(events.at(-1), [
    "event",
    "click_cta_servico",
    {
      post_slug: "post-contratos",
      destino: "assessoria-juridica-compra-de-imovel",
      cta_position: "fim_artigo"
    }
  ]);

  click("complete-whatsapp");
  const wa = events.at(-1);
  assert.equal(wa?.[1], "click_whatsapp");
  assert.deepEqual(wa?.[2], {
    post_slug: "post-contratos",
    cluster: "due-diligence",
    cta_position: "fim_artigo"
  });
  assert.ok(!JSON.stringify(wa).includes("link_url"));
  assert.ok(!JSON.stringify(wa).includes("wa.me"));
  assert.ok(!JSON.stringify(wa).includes("cta_variant"));

  cleanup();
});

test("R2: B2B final and editorial links keep historical positions; related emits zero", () => {
  const { events, click, cleanup } = mountTrackerFixture({
    postSlug: "post-b2b",
    includeB2b: true,
    includeEditorial: true,
    includeRelated: true
  });

  click("b2b-link");
  assert.deepEqual(events.at(-1), [
    "event",
    "click_cta_servico",
    {
      post_slug: "post-b2b",
      destino: "assessoria-juridica-para-imobiliarias",
      cta_position: "fim_artigo"
    }
  ]);

  click("editorial-service");
  assert.deepEqual(events.at(-1), [
    "event",
    "click_cta_servico",
    {
      post_slug: "post-b2b",
      destino: "due-diligence-imobiliaria",
      cta_position: "meio"
    }
  ]);

  click("editorial-whatsapp");
  assert.deepEqual(events.at(-1), [
    "event",
    "click_whatsapp",
    {
      post_slug: "post-b2b",
      cluster: "due-diligence",
      cta_position: "fim",
      link_url: "https://wa.me/5541987926468?text=editorial"
    }
  ]);

  const beforeRelated = events.length;
  click("related-card");
  assert.equal(events.length, beforeRelated);

  cleanup();
});

test("R2: remount with new post_slug cleans listeners and does not reuse the previous slug", () => {
  const fixture = mountTrackerFixture({
    postSlug: "slug-a",
    includeCompact: true,
    includeComplete: true
  });

  fixture.click("compact-link");
  assert.equal((fixture.events.at(-1)?.[2] as { post_slug: string }).post_slug, "slug-a");

  const addedBeforeRemount = fixture.listenerCounts.added;
  fixture.cleanup();
  assert.equal(fixture.listenerCounts.added, fixture.listenerCounts.removed);

  const remounted = mountTrackerFixture({
    postSlug: "slug-b",
    includeCompact: true,
    includeComplete: true,
    documentRef: fixture.documentRef,
    listenerCounts: fixture.listenerCounts,
    events: fixture.events
  });

  remounted.events.length = 0;
  remounted.click("compact-link");
  assert.equal((remounted.events.at(-1)?.[2] as { post_slug: string }).post_slug, "slug-b");
  assert.ok(remounted.listenerCounts.added > addedBeforeRemount);
  remounted.cleanup();
  assert.equal(remounted.listenerCounts.added, remounted.listenerCounts.removed);
});

type ListenerCounts = { added: number; removed: number };

type FakeDocumentRef = {
  _all: FakeElement[];
  querySelector(selector: string): FakeElement | null;
  querySelectorAll(selector: string): FakeElement[];
};

type FixtureOptions = {
  documentRef?: FakeDocumentRef;
  events?: unknown[][];
  includeB2b?: boolean;
  includeCompact?: boolean;
  includeComplete?: boolean;
  includeEditorial?: boolean;
  includeRelated?: boolean;
  listenerCounts?: ListenerCounts;
  postSlug: string;
  showCompra?: boolean;
};

function mountTrackerFixture(options: FixtureOptions) {
  const events = options.events ?? [];
  const listenerCounts = options.listenerCounts ?? { added: 0, removed: 0 };
  const dom = options.documentRef
    ? { documentRef: options.documentRef, clickTargets: collectClickTargets(options.documentRef) }
    : createArticleDom({
      includeB2b: options.includeB2b,
      includeCompact: options.includeCompact,
      includeComplete: options.includeComplete,
      includeEditorial: options.includeEditorial,
      includeRelated: options.includeRelated,
      listenerCounts,
      showCompra: options.showCompra
    });

  const cleanup = bindBlogCtaTrackerListeners(dom.documentRef as unknown as Document, options.postSlug, {
    origin: ORIGIN,
    gtag: (...args) => {
      events.push(args);
    }
  });

  return {
    cleanup,
    click(name: string) {
      const target = dom.clickTargets.get(name);
      assert.ok(target, `missing click target ${name}`);
      target.dispatchEvent(new FakeMouseEvent("click", target));
    },
    documentRef: dom.documentRef,
    events,
    listenerCounts
  };
}

function collectClickTargets(documentRef: FakeDocumentRef) {
  const map = new Map<string, FakeElement>();
  for (const node of documentRef._all) {
    if (node.dataset.clickName) map.set(node.dataset.clickName, node);
  }
  return map;
}

function createArticleDom(options: {
  includeB2b?: boolean;
  includeCompact?: boolean;
  includeComplete?: boolean;
  includeEditorial?: boolean;
  includeRelated?: boolean;
  listenerCounts: ListenerCounts;
  showCompra?: boolean;
}) {
  const all: FakeElement[] = [];
  const rootChildren: FakeElement[] = [];

  function track(el: FakeElement) {
    all.push(el);
    return el;
  }

  const articleContent = track(new FakeElement("div", { className: "article__content" }, options.listenerCounts));
  rootChildren.push(articleContent);

  if (options.includeEditorial) {
    const editorialService = track(new FakeElement("a", {
      className: "",
      href: `${ORIGIN}/due-diligence-imobiliaria`,
      clickName: "editorial-service"
    }, options.listenerCounts));
    const editorialWa = track(new FakeElement("a", {
      className: "",
      href: "https://wa.me/5541987926468?text=editorial",
      clickName: "editorial-whatsapp"
    }, options.listenerCounts));
    articleContent.append(editorialService, editorialWa);
  }

  if (options.includeCompact) {
    const compact = track(new FakeElement("aside", {
      className: "article-service-cta article-service-cta--compact",
      ctaScope: "due-diligence",
      ctaPosition: "meio_artigo",
      id: "article-dd-cta-compact"
    }, options.listenerCounts));
    const compactLink = track(new FakeElement("a", {
      href: `${ORIGIN}/due-diligence-imobiliaria`,
      clickName: "compact-link"
    }, options.listenerCounts));
    const compactSpan = track(new FakeElement("span", {
      clickName: "compact-span"
    }, options.listenerCounts));
    compactLink.append(compactSpan);
    compact.append(compactLink);
    articleContent.append(compact);
  }

  if (options.includeComplete) {
    const complete = track(new FakeElement("aside", {
      className: "article-service-cta article-service-cta--due-diligence",
      ctaScope: "due-diligence",
      ctaPosition: "fim_artigo",
      id: "article-dd-cta-complete"
    }, options.listenerCounts));
    complete.append(
      track(new FakeElement("a", {
        href: `${ORIGIN}/due-diligence-imobiliaria`,
        clickName: "complete-dd"
      }, options.listenerCounts))
    );
    if (options.showCompra) {
      complete.append(
        track(new FakeElement("a", {
          href: `${ORIGIN}/assessoria-juridica-compra-de-imovel`,
          clickName: "complete-compra"
        }, options.listenerCounts))
      );
    }
    complete.append(
      track(new FakeElement("a", {
        href: "https://wa.me/5541987926468?text=Ol%C3%A1%2C%20Drielle!",
        clickName: "complete-whatsapp"
      }, options.listenerCounts))
    );
    rootChildren.push(complete);
  }

  if (options.includeB2b) {
    const b2b = track(new FakeElement("aside", {
      className: "article-service-cta",
      ctaScope: "article-service",
      ctaPosition: "fim_artigo"
    }, options.listenerCounts));
    b2b.append(
      track(new FakeElement("a", {
        href: `${ORIGIN}/assessoria-juridica-para-imobiliarias`,
        clickName: "b2b-link"
      }, options.listenerCounts))
    );
    rootChildren.push(b2b);
  }

  if (options.includeRelated) {
    const related = track(new FakeElement("section", { className: "related-posts" }, options.listenerCounts));
    related.append(
      track(new FakeElement("a", {
        href: `${ORIGIN}/due-diligence-imobiliaria`,
        clickName: "related-card"
      }, options.listenerCounts))
    );
    rootChildren.push(related);
  }

  const documentRef: FakeDocumentRef = {
    _all: all,
    querySelector(selector: string) {
      return all.find((node) => node.matches(selector)) ?? null;
    },
    querySelectorAll(selector: string) {
      return all.filter((node) => node.matches(selector));
    }
  };

  return {
    clickTargets: collectClickTargets(documentRef),
    documentRef
  };
}

class FakeMouseEvent {
  target: FakeElement;
  type: string;
  constructor(type: string, target: FakeElement) {
    this.type = type;
    this.target = target;
  }
}

class FakeElement {
  childNodes: FakeElement[] = [];
  className: string;
  dataset: Record<string, string> = {};
  href = "";
  id = "";
  parentNode: FakeElement | null = null;
  tagName: string;
  private listeners = new Map<string, Set<(event: FakeMouseEvent) => void>>();
  private listenerCounts: ListenerCounts;

  constructor(
    tagName: string,
    attrs: {
      className?: string;
      clickName?: string;
      ctaPosition?: string;
      ctaScope?: string;
      href?: string;
      id?: string;
    },
    listenerCounts: ListenerCounts
  ) {
    this.tagName = tagName.toUpperCase();
    this.className = attrs.className ?? "";
    this.href = attrs.href ?? "";
    this.id = attrs.id ?? "";
    this.listenerCounts = listenerCounts;
    if (attrs.ctaScope) this.dataset.ctaScope = attrs.ctaScope;
    if (attrs.ctaPosition) this.dataset.ctaPosition = attrs.ctaPosition;
    if (attrs.clickName) this.dataset.clickName = attrs.clickName;
  }

  append(...nodes: FakeElement[]) {
    for (const node of nodes) {
      node.parentNode = this;
      this.childNodes.push(node);
    }
  }

  matches(selector: string) {
    if (selector === ".article__content") return this.className.split(/\s+/).includes("article__content");
    if (selector === "[data-cta-scope]") return Boolean(this.dataset.ctaScope);
    if (selector === "a[href]") return this.tagName === "A" && Boolean(this.href);
    if (selector.startsWith(".")) return this.className.split(/\s+/).includes(selector.slice(1));
    return false;
  }

  closest(selector: string): FakeElement | null {
    let node: FakeElement | null = this;
    while (node) {
      if (node.matches(selector)) return node;
      node = node.parentNode;
    }
    return null;
  }

  contains(node: FakeElement) {
    let current: FakeElement | null = node;
    while (current) {
      if (current === this) return true;
      current = current.parentNode;
    }
    return false;
  }

  querySelectorAll(selector: string) {
    const found: FakeElement[] = [];
    const walk = (node: FakeElement) => {
      if (node.matches(selector)) found.push(node);
      node.childNodes.forEach(walk);
    };
    this.childNodes.forEach(walk);
    return found;
  }

  addEventListener(type: string, handler: (event: FakeMouseEvent) => void) {
    const set = this.listeners.get(type) ?? new Set();
    set.add(handler);
    this.listeners.set(type, set);
    this.listenerCounts.added += 1;
  }

  removeEventListener(type: string, handler: (event: FakeMouseEvent) => void) {
    const set = this.listeners.get(type);
    if (!set?.delete(handler)) return;
    this.listenerCounts.removed += 1;
  }

  dispatchEvent(event: FakeMouseEvent) {
    let node: FakeElement | null = this;
    while (node) {
      const set = node.listeners.get(event.type);
      if (set) {
        for (const handler of set) handler(event);
      }
      node = node.parentNode;
    }
    return true;
  }
}
