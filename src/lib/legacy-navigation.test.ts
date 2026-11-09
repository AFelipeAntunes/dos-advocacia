import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  addInstitutionalLinks,
  institutionalLinks,
  normalizeLegacyLinks
} from "@/lib/legacy-navigation";

type PageFixture = {
  currentPath: string | null;
  file: string;
  route: string;
};

const pages: PageFixture[] = [
  { currentPath: "/", file: "index.html", route: "/" },
  { currentPath: "/advogada-imobiliaria", file: "advogada-imobiliaria.html", route: "/advogada-imobiliaria" },
  { currentPath: null, file: "advogada-imobiliaria-curitiba.html", route: "/advogada-imobiliaria-curitiba" },
  {
    currentPath: "/assessoria-juridica-compra-de-imovel",
    file: "assessoria-juridica-compra-de-imovel.html",
    route: "/assessoria-juridica-compra-de-imovel"
  },
  { currentPath: "/areas-de-atuacao", file: "areas-de-atuacao.html", route: "/areas-de-atuacao" },
  { currentPath: null, file: "contratos-imobiliarios.html", route: "/contratos-imobiliarios" },
  { currentPath: null, file: "assessoria-em-locacao.html", route: "/assessoria-em-locacao" },
  { currentPath: null, file: "conflitos-imobiliarios.html", route: "/conflitos-imobiliarios" },
  { currentPath: "/due-diligence-imobiliaria", file: "due-diligence-imobiliaria.html", route: "/due-diligence-imobiliaria" },
  { currentPath: "/treinamentos", file: "treinamentos.html", route: "/treinamentos" },
  { currentPath: "/contato", file: "contato.html", route: "/contato" },
  { currentPath: "/sobre", file: "sobre.html", route: "/sobre" },
  { currentPath: null, file: "politica-de-privacidade.html", route: "/politica-de-privacidade" },
  {
    currentPath: "/assessoria-juridica-para-imobiliarias",
    file: "assessoria-juridica-para-imobiliarias.html",
    route: "/assessoria-juridica-para-imobiliarias"
  },
  { currentPath: "/blog", file: "conteudos.html", route: "/conteudos" }
];

const expectedSubmenu = [
  "/areas-de-atuacao",
  "/advogada-imobiliaria",
  "/assessoria-juridica-compra-de-imovel",
  "/due-diligence-imobiliaria",
  "/assessoria-juridica-para-imobiliarias"
];

function transform(file: string, currentPath: string) {
  const source = readFileSync(path.join(process.cwd(), "src", "legacy-pages", file), "utf8");
  const body = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(source)?.[1] ?? "";
  return addInstitutionalLinks(normalizeLegacyLinks(body), currentPath);
}

function extractNav(html: string) {
  const nav = /<nav\b[^>]*class=["'][^"']*\bmain-nav\b[^"']*["'][^>]*>[\s\S]*?<\/nav>/i.exec(html)?.[0];
  assert.ok(nav, "main-nav não encontrado");
  return nav;
}

function anchorsOf(html: string) {
  return [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)].map((match) => ({
    current: /aria-current\s*=\s*["']page["']/i.test(match[0]),
    href: /\bhref\s*=\s*(["'])(.*?)\1/i.exec(match[0])?.[2] ?? "",
    text: match[0].replace(/<[^>]+>/g, "").trim()
  }));
}

function maskDetails(html: string) {
  return html.replace(/<details\b[\s\S]*?<\/details>/gi, "");
}

function submenuOf(nav: string) {
  const submenu = /<div class="nav-submenu">([\s\S]*?)<\/div>/i.exec(nav)?.[1];
  assert.ok(submenu, "nav-submenu não encontrado");
  return submenu;
}

function footerNavigationOf(html: string) {
  return (
    /<div class="footer-column">\s*<p class="footer-label">Navegação<\/p>([\s\S]*?)<\/div>/i.exec(html)?.[1] ?? ""
  );
}

for (const page of pages) {
  test(`menu agrupado e sem duplicatas em ${page.route}`, () => {
    const html = transform(page.file, page.route);
    const nav = extractNav(html);
    const topLevel = maskDetails(nav);
    const topLinks = anchorsOf(topLevel);
    const details = [...nav.matchAll(/<details\b/gi)];
    const submenuLinks = anchorsOf(submenuOf(nav));

    assert.equal(topLinks.length + details.length, 6, "entradas principais");
    assert.equal(details.length, 1, "um único grupo de Áreas");
    assert.equal(topLinks.filter((link) => expectedSubmenu.includes(link.href)).length, 0, "links diretos especializados fora do grupo");

    assert.deepEqual(submenuLinks.map((link) => link.href), expectedSubmenu, "destinos do submenu");
    assert.deepEqual(
      submenuLinks.map((link) => link.text),
      ["Todas as áreas de atuação", ...institutionalLinks.map(({ label }) => label)],
      "rótulos do submenu"
    );

    const allHrefs = anchorsOf(nav).map((link) => link.href);
    assert.equal(new Set(allHrefs).size, allHrefs.length, "href duplicado no nav");

    const currents = anchorsOf(nav).filter((link) => link.current);
    if (page.currentPath) {
      assert.equal(currents.length, 1, "um aria-current no nav");
      assert.equal(currents[0].href, page.currentPath, "aria-current no destino correto");
    } else {
      assert.equal(currents.length, 0, "sem aria-current quando a rota não está no nav");
    }

    const footerLinks = anchorsOf(footerNavigationOf(html)).filter((link) =>
      institutionalLinks.some(({ href }) => href === link.href)
    );
    assert.deepEqual(
      footerLinks.map((link) => link.href).sort(),
      institutionalLinks.map(({ href }) => href).sort(),
      "destinos diretos no rodapé"
    );
  });
}

test("remove links especializados em qualquer ordem de atributos", () => {
  const body = `<body><header><nav class="main-nav" id="main-navigation" aria-label="Principal" data-menu>
    <a href="/">Início</a>
    <a class="nav-link" href='/areas-de-atuacao'>Áreas de atuação</a>
    <a href="/sobre">O escritório</a>
    <a href="/treinamentos">Treinamentos</a>
    <a href="/blog">Conteúdos</a>
    <a aria-current="page" class="nav-special" href='/advogada-imobiliaria'>Advogada Imobiliarista</a>
    <a data-x="1" href="/assessoria-juridica-compra-de-imovel" aria-current="page">Compra de imóvel</a>
    <a href="/assessoria-juridica-para-imobiliarias">Jurídico para imobiliárias</a>
    <a class="nav-contact" href="/contato">Fale conosco <span aria-hidden="true">↗</span></a>
  </nav></header><main><a href="/advogada-imobiliaria">link do conteúdo</a></main>
  <footer><div class="footer-column"><p class="footer-label">Navegação</p><a href="/sobre">O escritório</a></div></footer></body>`;

  const html = addInstitutionalLinks(body, "/advogada-imobiliaria");
  const nav = extractNav(html);
  const topLinks = anchorsOf(maskDetails(nav));

  assert.equal(topLinks.length, 5);
  assert.equal([...nav.matchAll(/<details\b/gi)].length, 1);
  assert.deepEqual(anchorsOf(submenuOf(nav)).map((link) => link.href), expectedSubmenu);
  assert.equal(anchorsOf(submenuOf(nav)).filter((link) => link.current).length, 1);
  assert.equal(anchorsOf(submenuOf(nav)).find((link) => link.current)?.href, "/advogada-imobiliaria");
  assert.equal(anchorsOf(nav).filter((link) => link.current).length, 1);
  assert.ok(html.includes('<a href="/advogada-imobiliaria">link do conteúdo</a>'), "conteúdo preservado");
  assert.ok(footerNavigationOf(html).includes('href="/advogada-imobiliaria"'), "rodapé preservado");
});

test("é idempotente e não remove os links do próprio submenu", () => {
  const once = transform("advogada-imobiliaria.html", "/advogada-imobiliaria");
  const twice = addInstitutionalLinks(once, "/advogada-imobiliaria");
  const nav = extractNav(twice);

  assert.deepEqual(anchorsOf(submenuOf(nav)).map((link) => link.href), expectedSubmenu);
  assert.equal(anchorsOf(maskDetails(nav)).length, 5);
  assert.equal(anchorsOf(nav).filter((link) => link.current).length, 1);
});

test("não cria aria-current quando a rota não está no menu", () => {
  const html = transform("advogada-imobiliaria-curitiba.html", "/advogada-imobiliaria-curitiba");
  const nav = extractNav(html);

  assert.equal(anchorsOf(nav).filter((link) => link.current).length, 0);
});
