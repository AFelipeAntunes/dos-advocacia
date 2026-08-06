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

  return (
    <>
      {legacyPage.jsonLd.map((schema, index) => (
        <script
          key={`${page}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      ))}
      <div dangerouslySetInnerHTML={{ __html: legacyPage.body }} suppressHydrationWarning />
      <InstitutionalCtaTracker pageSlug={legacyPageSlugs[page]} />
      <script src="/site-interactions.js" />
    </>
  );
}
