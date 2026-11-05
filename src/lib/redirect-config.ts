/**
 * Fonte única e pura dos redirects do site.
 *
 * Este módulo é importado por `next.config.ts` (regras efetivamente servidas) e
 * pelo sitemap (exclusão das origens de consolidação). Não contém segredos,
 * ambiente de cliente ou dependência de servidor, para poder ser reutilizado e
 * testado sem carregar o runtime do Next.js.
 *
 * Cada par é `[origem, destino]`. A origem é o caminho público que redireciona;
 * o destino é o caminho canônico que deve continuar indexável.
 */

export const legacyRedirects = [
  ["/index.html", "/"],
  ["/areas-de-atuacao.html", "/areas-de-atuacao"],
  ["/assessoria-em-locacao.html", "/assessoria-em-locacao"],
  ["/conflitos-imobiliarios.html", "/conflitos-imobiliarios"],
  ["/contato.html", "/contato"],
  ["/conteudos.html", "/blog"],
  ["/contratos-imobiliarios.html", "/contratos-imobiliarios"],
  ["/due-diligence-imobiliaria.html", "/due-diligence-imobiliaria"],
  ["/politica-de-privacidade.html", "/politica-de-privacidade"],
  ["/sobre.html", "/sobre"],
  ["/treinamentos.html", "/treinamentos"]
] as const;

export const postConsolidationRedirects = [
  [
    "/post/compra-de-imóvel-em-inventário-o-risco-que-ninguém-te-conta-antes-de-assinar",
    "/post/compra-de-imóvel-em-inventário-riscos-que-ninguém-te-conta"
  ],
  [
    "/post/contrato-de-gaveta-riscos-jurídicos-que-podem-custar-seu-imóvel",
    "/post/contrato-de-gaveta-você-comprou-pagou-mas-não-é-o-dono-do-imóvel"
  ],
  [
    "/post/permuta-de-imóvel-o-risco-que-a-torna-não-resolve",
    "/post/permuta-de-imóvel-riscos-jurídicos-que-ninguém-conta-antes-de-trocar"
  ],
  [
    "/post/multipropriedade-imobiliária-o-que-parece-férias-pode-virar-dívida",
    "/post/multipropriedade-imobiliária-riscos-jurídicos-que-o-comprador-precisa-conhecer"
  ],
  [
    "/post/cadastro-imobiliario-brasileiro-o-que-o-cib-muda-na-compra-do-seu-imovel",
    "/post/cib-e-cruzamento-de-dados-os-riscos-jurídicos-que-ninguém-avisou-ao-vendedor"
  ],
  [
    "/post/locação-por-temporada-o-prazo-que-vira-residencial-sem-aviso",
    "/post/locação-por-temporada-virou-residencial-a-imobiliária-sabia-do-risco"
  ],
  [
    "/post/atraso-na-entrega-do-imóvel-na-planta-o-risco-oculto",
    "/post/atraso-na-entrega-de-imóvel-na-planta-direitos-do-comprador-que-a-construtora-não-conta"
  ],
  [
    "/post/o-imóvel-estava-alugado-o-comprador-só-descobriu-o-risco-depois-de-assinar-a-escritura",
    "/post/o-imóvel-estava-alugado-o-comprador-assinou-o-inquilino-entrou-na-justiça-para-ficar-com-ele"
  ],
  [
    "/post/o-imóvel-estava-alugado-quando-o-comprador-fechou-o-negócio-o-inquilino-entrou-na-justiça",
    "/post/o-imóvel-estava-alugado-o-comprador-assinou-o-inquilino-entrou-na-justiça-para-ficar-com-ele"
  ],
  [
    "/post/o-imóvel-foi-entregue-com-defeito-o-comprador-só-descobriu-depois-de-assinar-a-escritura-1",
    "/post/o-imóvel-foi-entregue-com-defeito-o-comprador-só-descobriu-depois-de-assinar-a-escritura"
  ],
  [
    "/post/distrato-imobiliário-quanto-a-incorporadora-pode-reter",
    "/post/distrato-de-imóvel-na-planta-a-construtora-quis-reter-50-o-stj-disse-que-não"
  ],
  [
    "/post/distrato-de-imóvel-na-planta-em-2026-quanto-você-tem-direito-a-receber-de-volta",
    "/post/distrato-de-imóvel-na-planta-a-construtora-quis-reter-50-o-stj-disse-que-não"
  ],
  // Lote editorial 1/2/3/8/9/11.
  [
    "/post/o-inquilino-não-paga-não-sai-e-a-imobiliária-fica-no-meio-o-que-fazer-numa-ação-de-despejo",
    "/post/a-imobiliária-pode-ser-responsabilizada-em-uma-ação-de-despejo"
  ],
  [
    "/post/o-inquilino-sublocou-o-imóvel-sem-avisar-e-a-imobiliária-foi-acionada-pelo-locador",
    "/post/sublocação-não-autorizada-o-risco-que-a-imobiliária-assume-sem-perceber"
  ],
  [
    "/post/a-dívida-de-condomínio-era-do-vendedor-e-agora-é-sua",
    "/post/dívida-de-condomínio-e-iptu-na-compra-de-imóvel-quem-paga-a-conta"
  ],
  [
    "/post/financiou-o-imóvel-está-pagando-mas-a-propriedade-ainda-não-é-sua",
    "/post/alienação-fiduciária-de-imóvel-o-risco-real-que-ninguém-te-conta-antes-de-financiar"
  ],
  [
    "/post/o-imóvel-era-da-herança-foi-vendido-antes-da-partilha",
    "/post/compra-de-imóvel-em-inventário-riscos-que-ninguém-te-conta"
  ],
  [
    "/post/passivo-oculto-em-imóvel-o-risco-que-ninguém-conta-antes-da-assinatura",
    "/post/due-diligence-imobiliária-o-que-é-e-por-que-você-precisa-fazer-antes-de-qualquer-compra"
  ],
  // Fusão 7
  [
    "/post/o-vendedor-tinha-dívida-a-compra-foi-feita-o-risco-é-seu",
    "/post/fraude-à-execução-no-imóvel-o-risco-que-pode-te-custar-tudo"
  ]
] as const;
