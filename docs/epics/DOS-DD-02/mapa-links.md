# Mapa de links — DOS-DD-02.01

Data: 2026-11-07. Fontes: HTML de produção `www.dosadvocacia.com.br` e `src/legacy-pages/` em `7fec6b2`.

Legenda: **existe** | **ajustar texto** | **ausente**.

## Landing `/due-diligence-imobiliaria` (estado atual)

| Campo | Valor observado |
| --- | --- |
| Title | Due diligence imobiliária \| Advogado para análise de imóvel |
| Description | Due diligence imobiliária revela dívidas, penhoras e passivos ocultos antes da compra... |
| OG title/description | Iguais ao title/description |
| Canonical | `https://www.dosadvocacia.com.br/due-diligence-imobiliaria` |
| H1 | O imóvel parece certo. Os documentos podem contar *outra história.* (**não** contém o termo de busca) |
| H2 | Preço e localização... / Antes de movimentar patrimônio... / Prefere escrever? (form) |
| H3 | Leitura documental; Informações relevantes; Riscos e prioridades; Orientação estratégica |
| Schema | `BreadcrumbList` + `Service` (provider `LegalService` aninhado). Sem `FAQPage`. Sem `LegalService` raiz com `@id`/CEP como na landing de imobiliárias |
| CTA WhatsApp | quiet-cta: “Falar sobre o investimento pelo WhatsApp” |
| Formulário | Injetado por `getContactFormMarkup('dueDiligence')`: `page_slug=due-diligence-imobiliaria`, `icp=comprador`, `form_location=servico`, `demandType` oculto “Compra, venda ou investimento” |

## Links institucionais que chegam à landing

| Origem | Âncora observada | Status | Texto proposto no handoff CMO | Ação sugerida (sem implementar) |
| --- | --- | --- | --- | --- |
| Home `/` card áreas | “Due diligence e viabilidade para investidores” (+ lead) → `/due-diligence-imobiliaria` | existe | Due diligence imobiliária | Manter link; avaliar só copy do card no card 03 |
| `/assessoria-juridica-compra-de-imovel` | “na matrícula, nas certidões” | existe / ajustar texto | análise completa do imóvel e das partes antes da compra | Ajustar âncora sem criar segundo link |
| `/advogada-imobiliaria` demandas | “Análise de risco na compra de imóvel (due diligence)” | existe / ajustar texto | due diligence imobiliária | Ajustar âncora; já há segundo link “Ver a área” no bloco de áreas |
| `/advogada-imobiliaria` áreas | “Ver a área →” | existe | due diligence imobiliária | Decidir se unifica wording com o link de demandas |
| `/advogada-imobiliaria-curitiba` áreas | “Ver a área →” | existe / ajustar texto | due diligence imobiliária | Ajustar âncora |
| Artigo principal `2bef3905…` | link para `/due-diligence-imobiliaria` no corpo | existe | due diligence imobiliária (conferir) | Não duplicar; coordenar com revisão CMO do post |

## Artigos do lote CMO (7) + destinos editoriais da landing

| Slug | Link editorial `/due-diligence-imobiliaria` | Status |
| --- | --- | --- |
| imóvel-sem-habite-se-… | sim | existe |
| o-imóvel-foi-vendido-o-cônjuge-… | sim | existe |
| o-vendedor-não-pode-comparecer-… | sim | existe |
| cessão-de-direitos-em-imóvel-na-planta-… | não | ausente (prioridade de bloco) |
| contrato-de-gaveta-… | não | ausente (prioridade de bloco) |
| georreferenciamento-rural-… | sim | existe |
| loteamento-irregular-… | sim | existe |
| fraude-à-execução-… (destino landing) | sim | existe |
| compra-de-imóvel-em-inventário-… (destino landing) | sim | existe |
| due-diligence-imobiliária-o-que-é-… (principal) | sim | existe |

## Correção ao diagnóstico do handoff

A afirmação “nenhum post linka para ela” **não se sustenta** no inventário real. Vários posts do lote e as páginas Home/compra/nacional/Curitiba já apontam para `/due-diligence-imobiliaria`. O trabalho de links do card 03 é de **ajuste de âncora e cobertura dos ausentes via CTA SSR**, não de criação em massa de links duplicados.

## Evidências

Arquivos em `evidencias/01-auditoria/*.html` e `landing-capture.json`.
