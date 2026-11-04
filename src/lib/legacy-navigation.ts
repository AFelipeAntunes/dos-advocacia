export const legacyLinkMap: Record<string, string> = {
  "/areas-de-atuacao.html": "/areas-de-atuacao",
  "/assessoria-em-locacao.html": "/assessoria-em-locacao",
  "/conflitos-imobiliarios.html": "/conflitos-imobiliarios",
  "/contato.html": "/contato",
  "/conteudos.html": "/blog",
  "/contratos-imobiliarios.html": "/contratos-imobiliarios",
  "/due-diligence-imobiliaria.html": "/due-diligence-imobiliaria",
  "/politica-de-privacidade.html": "/politica-de-privacidade",
  "/sobre.html": "/sobre",
  "/treinamentos.html": "/treinamentos"
};

export const areasPath = "/areas-de-atuacao";

export const institutionalLinks = [
  { href: "/advogada-imobiliaria", label: "Advogada Imobiliarista" },
  { href: "/assessoria-juridica-compra-de-imovel", label: "Compra de imóvel" },
  { href: "/assessoria-juridica-para-imobiliarias", label: "Jurídico para imobiliárias" }
] as const;

const specializedHrefs = new Set<string>(institutionalLinks.map(({ href }) => href));
const detailsPattern = /<details\b[\s\S]*?<\/details>/gi;
const anchorPattern = /<a\b[^>]*>[\s\S]*?<\/a>/gi;
const areasAnchorPattern = /<a\b[^>]*\bhref=["']\/areas-de-atuacao["'][^>]*>[\s\S]*?<\/a>/i;
const mainNavPattern = /<nav\b[^>]*class=["'][^"']*\bmain-nav\b[^"']*["'][^>]*>[\s\S]*?<\/nav>/i;
const footerNavPattern = /<div class="footer-column">\s*<p class="footer-label">Navegação<\/p>[\s\S]*?<\/div>/i;

export function normalizeLegacyLinks(body: string) {
  return Object.entries(legacyLinkMap).reduce(
    (html, [legacyPath, routePath]) => html.replaceAll(legacyPath, routePath),
    body
  );
}

/**
 * Agrupa os destinos institucionais em Áreas de atuação.
 *
 * O HTML preservado de algumas páginas ainda traz os links especializados
 * diretos no nav. Eles são removidos antes da montagem do submenu para que o
 * grupo seja a única ocorrência e para que exista no máximo um aria-current.
 */
export function addInstitutionalLinks(body: string, currentPath: string) {
  const withMenuLinks = body.replace(mainNavPattern, (navigation) => {
    const groups: string[] = [];
    const masked = navigation.replace(detailsPattern, (group) => {
      groups.push(group);
      return `\u0000${groups.length - 1}\u0000`;
    });

    const withoutDirectLinks = masked.replace(anchorPattern, (anchor) => {
      const href = readHref(anchor);
      return href && specializedHrefs.has(href) ? "" : anchor;
    });

    const withAreasGroup = withoutDirectLinks.replace(areasAnchorPattern, () => buildAreasGroup(currentPath));

    return withAreasGroup.replace(/\u0000(\d+)\u0000/g, (_, index: string) => groups[Number(index)]);
  });

  return withMenuLinks.replace(footerNavPattern, (navigation) =>
    institutionalLinks.reduce((result, { href, label }) => {
      if (result.includes(`href="${href}"`)) return result;

      return result.replace(/<\/div>$/i, `<a href="${href}">${label}</a></div>`);
    }, navigation)
  );
}

function readHref(anchor: string) {
  return /\bhref\s*=\s*(["'])(.*?)\1/i.exec(anchor)?.[2];
}

function buildAreasGroup(currentPath: string) {
  const currentAttribute = (href: string) => (href === currentPath ? ' aria-current="page"' : "");
  const links = institutionalLinks
    .map(({ href, label }) => `<a href="${href}"${currentAttribute(href)}>${label}</a>`)
    .join("");

  return `<details class="nav-group" data-nav-group>
        <summary>Áreas de atuação</summary>
        <div class="nav-submenu">
          <a href="${areasPath}"${currentAttribute(areasPath)}>Todas as áreas de atuação</a>${links}
        </div>
      </details>`;
}
