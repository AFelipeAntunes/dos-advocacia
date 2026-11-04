import assert from "node:assert/strict";
import test from "node:test";

import nextConfig from "../../next.config";
import { legacyRedirects, postConsolidationRedirects } from "@/lib/redirect-config";
import { buildSitemapEntries, type SitemapPost } from "@/lib/sitemap";

const siteUrl = "https://www.dosadvocacia.com.br";

const redirectOrigins = postConsolidationRedirects.map(([source]) => source);
const redirectDestinations = [...new Set(postConsolidationRedirects.map(([, destination]) => destination))];

function post(slug: string, lastPublishedDate?: string | null): SitemapPost {
  return { slug, lastPublishedDate };
}

/** As fixtures usam o formato de redirect (`/post/...`); o Wix entrega o slug. */
function slugFromPath(path: string) {
  return path.replace(/^\/post\//, "");
}

function pathOf(url: string) {
  return new URL(url).pathname;
}

function urls(entries: ReturnType<typeof buildSitemapEntries>) {
  return entries.map((entry) => entry.url);
}

function postPaths(entries: ReturnType<typeof buildSitemapEntries>) {
  return entries.map((entry) => pathOf(entry.url)).filter((path) => path.startsWith("/post/"));
}

function iso(value: string | Date | undefined) {
  return value === undefined ? undefined : new Date(value).toISOString();
}

const sharedFraudDestination =
  "/post/o-imóvel-estava-alugado-o-comprador-assinou-o-inquilino-entrou-na-justiça-para-ficar-com-ele";
const inventoryDestination = "/post/compra-de-imóvel-em-inventário-riscos-que-ninguém-te-conta";

test("sem Wix configurado o sitemap institucional é válido e não cria posts", () => {
  const entries = buildSitemapEntries({ siteUrl });
  const paths = entries.map((entry) => pathOf(entry.url));

  assert.equal(entries.length, 14);
  assert.ok(!paths.some((path) => path.startsWith("/post/")));
  assert.ok(!paths.includes("/blog"));
  assert.equal(new Set(paths).size, paths.length);

  for (const entry of entries) {
    assert.ok(entry.url.startsWith(`${siteUrl}/`), entry.url);
    assert.equal(new URL(entry.url).origin, siteUrl);
  }
});

test("inclui a landing de imobiliárias exatamente uma vez e sem data inventada", () => {
  const entries = buildSitemapEntries({ siteUrl });
  const landingEntries = entries.filter(
    (entry) => pathOf(entry.url) === "/assessoria-juridica-para-imobiliarias"
  );

  assert.equal(landingEntries.length, 1);
  assert.equal(landingEntries[0].priority, 0.8);
  assert.equal(landingEntries[0].changeFrequency, "monthly");
  assert.ok(!("lastModified" in landingEntries[0]));
});

test("exclui as 18 origens de consolidação quando o CMS devolve o mesmo slug", () => {
  const posts = [...redirectOrigins, ...redirectDestinations].map((path) => post(slugFromPath(path)));
  const entries = buildSitemapEntries({ siteUrl, posts });
  const paths = postPaths(entries);

  assert.equal(redirectOrigins.length, 18);

  for (const origin of redirectOrigins) {
    // A URL emitida é a mesma forma que o Next configura para a origem.
    assert.equal(`/post/${encodeURIComponent(slugFromPath(origin))}`, encodeURI(origin));

    assert.ok(!paths.includes(encodeURI(origin)), `origem publicada no sitemap: ${origin}`);
    assert.ok(!urls(entries).includes(`${siteUrl}${encodeURI(origin)}`), `origem publicada: ${origin}`);
  }
});

test("preserva todos os destinos, inclusive o compartilhado e o de inventário", () => {
  const posts = [...redirectOrigins, ...redirectDestinations].map((path) => post(slugFromPath(path)));
  const entries = buildSitemapEntries({ siteUrl, posts });
  const paths = postPaths(entries);

  for (const destination of redirectDestinations) {
    const expected = `/post/${encodeURIComponent(slugFromPath(destination))}`;
    assert.equal(
      paths.filter((path) => path === expected).length,
      1,
      `destino ausente ou duplicado: ${destination}`
    );
  }

  assert.ok(paths.includes(`/post/${encodeURIComponent(slugFromPath(sharedFraudDestination))}`));
  assert.ok(paths.includes(`/post/${encodeURIComponent(slugFromPath(inventoryDestination))}`));
});

test("post normal permanece com prioridade e frequência originais", () => {
  const entries = buildSitemapEntries({ siteUrl, posts: [post("vistoria-de-saida-do-imovel-alugado")] });
  const entry = entries.find(
    (candidate) => pathOf(candidate.url) === "/post/vistoria-de-saida-do-imovel-alugado"
  );

  assert.ok(entry);
  assert.equal(entry.priority, 0.7);
  assert.equal(entry.changeFrequency, "monthly");
});

test("URL do post é exatamente a identidade do canonical, codificada uma única vez", () => {
  const slug = "compra-de-imóvel-em-inventário-riscos-que-ninguém-te-conta";
  const entries = buildSitemapEntries({ siteUrl, posts: [post(slug), post(slug)] });
  const posts = entries.filter((entry) => pathOf(entry.url).startsWith("/post/"));

  assert.equal(posts.length, 1, "o mesmo slug repetido deve gerar uma única URL");
  assert.equal(posts[0].url, new URL(`/post/${encodeURIComponent(slug)}`, siteUrl).toString());
  assert.ok(!posts[0].url.includes("%25"));
  assert.ok(posts[0].url.includes("%C3%B3"));
});

test("NFC e NFD do mesmo texto geram duas URLs distintas, sem dedupe", () => {
  const nfc = "teste-imóvel";
  const nfd = nfc.normalize("NFD");

  assert.notEqual(nfc, nfd);

  const entries = buildSitemapEntries({ siteUrl, posts: [post(nfc), post(nfd)] });
  const paths = postPaths(entries);

  assert.equal(paths.length, 2);
  assert.deepEqual(new Set(paths), new Set([`/post/${encodeURIComponent(nfc)}`, `/post/${encodeURIComponent(nfd)}`]));
  assert.ok(paths.includes("/post/teste-im%C3%B3vel"));
  assert.ok(paths.includes("/post/teste-imo%CC%81vel"));
});

test("caixa distinta gera duas URLs", () => {
  const entries = buildSitemapEntries({ siteUrl, posts: [post("Post-A"), post("post-a")] });
  const paths = postPaths(entries);

  assert.equal(paths.length, 2);
  assert.deepEqual(new Set(paths), new Set(["/post/Post-A", "/post/post-a"]));
});

test("percentual literal no slug é codificado uma vez e não é decodificado", () => {
  const entries = buildSitemapEntries({
    siteUrl,
    posts: [post("desconto-100%-imovel"), post("c%F3digo-literal")]
  });
  const paths = postPaths(entries);

  assert.equal(paths.length, 2);
  assert.ok(paths.includes("/post/desconto-100%25-imovel"));
  assert.ok(paths.includes("/post/c%25F3digo-literal"));
  assert.ok(!paths.includes("/post/desconto-100%-imovel"));
  assert.ok(!paths.includes("/post/código-literal"));
});

test("origem acentuada não exclui URL que difere por NFC/NFD, caixa ou percentual", () => {
  const origin = redirectOrigins[0];
  const slug = slugFromPath(origin);
  const nfd = slug.normalize("NFD");
  const caseVariant = `X${slug}`;
  const percentVariant = encodeURIComponent(slug);

  assert.notEqual(nfd, slug);
  assert.notEqual(percentVariant, slug);

  const entries = buildSitemapEntries({
    siteUrl,
    posts: [post(nfd), post(caseVariant), post(percentVariant)]
  });
  const paths = postPaths(entries);

  assert.equal(paths.length, 3, "uma origem não pode eliminar slugs de identidade distinta");
  assert.ok(paths.includes(`/post/${encodeURIComponent(nfd)}`));
  assert.ok(paths.includes(`/post/${encodeURIComponent(caseVariant)}`));
  assert.ok(paths.includes(`/post/${encodeURIComponent(percentVariant)}`));
  assert.ok(!paths.includes(encodeURI(origin)));
});

test("a origem exclui apenas a URL idêntica à configurada, inclusive codificada", () => {
  const origin = redirectOrigins[0];
  const slug = slugFromPath(origin);
  const entries = buildSitemapEntries({ siteUrl, posts: [post(slug), post(slugFromPath(redirectDestinations[0]))] });
  const paths = postPaths(entries);

  assert.ok(!paths.includes(encodeURI(origin)), "origem não foi excluída");
  assert.ok(
    paths.includes(`/post/${encodeURIComponent(slugFromPath(redirectDestinations[0]))}`),
    "destino foi excluído junto da origem"
  );
});

test("datas institucionais são por rota e não mudam entre execuções", () => {
  const first = buildSitemapEntries({ siteUrl });
  const second = buildSitemapEntries({ siteUrl });
  const byPath = new Map(first.map((entry) => [pathOf(entry.url), entry]));

  assert.deepEqual(first, second);
  assert.equal(iso(byPath.get("/sobre")?.lastModified), "2026-07-10T00:00:00.000Z");
  assert.equal(iso(byPath.get("/contato")?.lastModified), "2026-08-06T00:00:00.000Z");
  assert.equal(iso(byPath.get("/due-diligence-imobiliaria")?.lastModified), "2026-08-02T00:00:00.000Z");

  // Rotas com alteração local ainda não publicada: sem data até o rollout.
  for (const route of ["/", "/advogada-imobiliaria", "/advogada-imobiliaria-curitiba", "/areas-de-atuacao", "/treinamentos", "/assessoria-em-locacao", "/assessoria-juridica-para-imobiliarias"]) {
    assert.ok(!("lastModified" in byPath.get(route)!), route);
  }
});

test("data conhecida do Wix é preservada e estável", () => {
  const known = "2026-05-17T20:10:16.291Z";
  const first = buildSitemapEntries({ siteUrl, posts: [post("post-conhecido", known)] });
  const second = buildSitemapEntries({ siteUrl, posts: [post("post-conhecido", known)] });
  const entry = first.find((candidate) => pathOf(candidate.url) === "/post/post-conhecido");

  assert.ok(entry);
  assert.equal(iso(entry.lastModified), known);
  assert.deepEqual(first, second);
});

test("data ausente ou inválida não vira relógio atual", () => {
  const before = Date.now();
  const entries = buildSitemapEntries({
    siteUrl,
    posts: [post("sem-data"), post("data-invalida", "não é uma data"), post("data-vazia", "")]
  });
  const after = Date.now();
  const posts = entries.filter((entry) => pathOf(entry.url).startsWith("/post/"));

  assert.equal(posts.length, 3);

  for (const entry of posts) {
    assert.ok(!("lastModified" in entry), `lastModified fabricado em ${entry.url}`);
  }

  assert.ok(after >= before);
});

test("/blog entra apenas com Wix configurado e continua sem lastModified", () => {
  const withoutWix = buildSitemapEntries({ siteUrl });
  const withEmptyCatalog = buildSitemapEntries({ siteUrl, posts: [] });
  const blogEntry = withEmptyCatalog.find((entry) => pathOf(entry.url) === "/blog");

  assert.ok(!withoutWix.some((entry) => pathOf(entry.url) === "/blog"));
  assert.ok(blogEntry);
  assert.equal(blogEntry.priority, 0.9);
  assert.ok(!("lastModified" in blogEntry));
});

test("os 11 redirects .html continuam configurados e não entram no sitemap", async () => {
  assert.equal(legacyRedirects.length, 11);
  assert.ok(legacyRedirects.every(([source]) => source.endsWith(".html")));

  const redirects = await nextConfig.redirects?.();
  assert.ok(redirects);

  for (const [source, destination] of legacyRedirects) {
    assert.deepEqual(
      redirects.find((redirect) => redirect.source === source),
      { source, destination, permanent: true }
    );
  }

  const entries = buildSitemapEntries({ siteUrl, posts: [post("post-comum")] });
  assert.ok(!entries.some((entry) => entry.url.endsWith(".html")));
});

test("siteUrl com barra final não duplica barras", () => {
  const entries = buildSitemapEntries({ siteUrl: `${siteUrl}/` });

  for (const entry of entries) {
    assert.ok(!entry.url.replace(siteUrl, "").startsWith("//"), entry.url);
  }
});
