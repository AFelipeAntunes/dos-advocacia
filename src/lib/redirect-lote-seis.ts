/**
 * Identidade documental dos seis pares deste lote (1, 2, 3, 8, 9, 11).
 * Fonte: manifesto E1 + matriz E2. F7 permanece fora.
 *
 * Os pares ativos vivem em `redirect-config.ts`; este módulo só ancora
 * expectativas de teste e a matriz de entrega, sem segunda fonte de verdade
 * para o Next.
 */

export type LoteSeisPar = {
  readonly par: 1 | 2 | 3 | 8 | 9 | 11;
  readonly origem: string;
  readonly destino: string;
  readonly statusCode: 301;
};

/** Expectativa independente — literais NFC do manifesto/matriz aprovados. */
export const loteSeisPares = [
  {
    par: 1,
    origem:
      "/post/o-inquilino-não-paga-não-sai-e-a-imobiliária-fica-no-meio-o-que-fazer-numa-ação-de-despejo",
    destino: "/post/a-imobiliária-pode-ser-responsabilizada-em-uma-ação-de-despejo",
    statusCode: 301
  },
  {
    par: 2,
    origem: "/post/o-inquilino-sublocou-o-imóvel-sem-avisar-e-a-imobiliária-foi-acionada-pelo-locador",
    destino: "/post/sublocação-não-autorizada-o-risco-que-a-imobiliária-assume-sem-perceber",
    statusCode: 301
  },
  {
    par: 3,
    origem: "/post/a-dívida-de-condomínio-era-do-vendedor-e-agora-é-sua",
    destino: "/post/dívida-de-condomínio-e-iptu-na-compra-de-imóvel-quem-paga-a-conta",
    statusCode: 301
  },
  {
    par: 8,
    origem: "/post/financiou-o-imóvel-está-pagando-mas-a-propriedade-ainda-não-é-sua",
    destino: "/post/alienação-fiduciária-de-imóvel-o-risco-real-que-ninguém-te-conta-antes-de-financiar",
    statusCode: 301
  },
  {
    par: 9,
    origem: "/post/o-imóvel-era-da-herança-foi-vendido-antes-da-partilha",
    destino: "/post/compra-de-imóvel-em-inventário-riscos-que-ninguém-te-conta",
    statusCode: 301
  },
  {
    par: 11,
    origem: "/post/passivo-oculto-em-imóvel-o-risco-que-ninguém-conta-antes-da-assinatura",
    destino:
      "/post/due-diligence-imobiliária-o-que-é-e-por-que-você-precisa-fazer-antes-de-qualquer-compra",
    statusCode: 301
  }
] as const satisfies readonly LoteSeisPar[];

export const loteForaEscopo = {
  semFusao: [4, 5] as const,
  retidos: [6, 10] as const,
  excluidoDesteLote: [7] as const
} as const;

/** Redirect histórico que já aponta ao destino do par 9 (sem cadeia). */
export const inventarioHistoricalOrigin =
  "/post/compra-de-imóvel-em-inventário-o-risco-que-ninguém-te-conta-antes-de-assinar" as const;

export const inventarioSharedDestination =
  "/post/compra-de-imóvel-em-inventário-riscos-que-ninguém-te-conta" as const;

/** Origem F7 — deve permanecer fora da configuração ativa neste lote. */
export const f7OriginExcluded =
  "/post/o-vendedor-tinha-dívida-a-compra-foi-feita-o-risco-é-seu" as const;
