import type { NextConfig } from "next";

const legacyRedirects = [
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
  ]
] as const;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "static.wixstatic.com", protocol: "https" }]
  },
  async redirects() {
    return [
      ...legacyRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true
      })),
      ...postConsolidationRedirects.map(([source, destination]) => ({
        source: encodeURI(source),
        destination,
        statusCode: 301 as const
      }))
    ];
  }
};

export default nextConfig;
