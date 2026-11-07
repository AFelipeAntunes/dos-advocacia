import { InstitutionalCtaTracker } from "@/components/institutional-cta-tracker";
import { getLegacyPage, type LegacyPageKey } from "@/lib/legacy-pages";

type LegacyPageProps = {
  page: LegacyPageKey;
};

const legacyPageSlugs: Record<LegacyPageKey, string> = {
  home: "home",
  advogadaImobiliaria: "advogada-imobiliaria",
  advogadaImobiliariaCuritiba: "advogada-imobiliaria-curitiba",
  assessoriaCompraImovel: "assessoria-juridica-compra-de-imovel",
  areas: "areas-de-atuacao",
  imobiliarias: "assessoria-juridica-para-imobiliarias",
  locacao: "assessoria-em-locacao",
  conflitos: "conflitos-imobiliarios",
  contato: "contato",
  conteudos: "blog",
  contratos: "contratos-imobiliarios",
  dueDiligence: "due-diligence-imobiliaria",
  notFound: "404",
  treinamentos: "treinamentos",
  sobre: "sobre",
  privacidade: "politica-de-privacidade"
};

export async function LegacyPage({ page }: LegacyPageProps) {
  const legacyPage = await getLegacyPage(page);
  const optimizeDdLcp = page === "dueDiligence";

  const jsonLd = legacyPage.jsonLd.map((schema, index) => (
    <script
      key={`${page}-${index}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema }}
    />
  ));

  const body = (
    <div dangerouslySetInnerHTML={{ __html: legacyPage.body }} suppressHydrationWarning />
  );

  const tracker = <InstitutionalCtaTracker pageSlug={legacyPageSlugs[page]} />;
  const interactions = optimizeDdLcp ? (
    <script src="/site-interactions.js" defer />
  ) : (
    <script src="/site-interactions.js" />
  );

  // CTO 16 R1: body-before-JSON-LD, defer and content-visibility only on dueDiligence.
  if (optimizeDdLcp) {
    return (
      <div className="dd-lcp-opt" data-dd-lcp-opt="">
        {body}
        {jsonLd}
        {tracker}
        {interactions}
      </div>
    );
  }

  return (
    <>
      {jsonLd}
      {body}
      {tracker}
      {interactions}
    </>
  );
}
