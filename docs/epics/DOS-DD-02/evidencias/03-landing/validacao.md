# Validações DOS-DD-02.03

Data: 2026-11-07  
Comando base: worktree `.dos-dd-02-03-landing`

## Antes / depois (testes)

| Suite | Resultado |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run test:contact` | 11 pass (inclui 2 novos DD) |
| `npm run test:navigation` | 18 pass |
| `npm run test:sitemap` | 17 pass (`/due-diligence-imobiliaria` lastModified permanece 2026-08-02) |
| `npm run build` | pass (rota estática `/due-diligence-imobiliaria`) |

## DOM local (`next start :3013`)

- Title / description / OG / canonical coerentes com copy-final
- 1× H1; 6 FAQs visíveis = FAQPage
- LegalService `@id` `#organization` com `legalName`, `postalCode`, Instagram + Google `sameAs`
- Service com `provider` por referência; `areaServed` Curitiba + Brasil
- Form injetado: `page_slug=due-diligence-imobiliaria`, `icp=comprador`, `form_location=servico`, demanda “Compra, venda ou investimento”
- WhatsApp hero/rodapé = mensagem landing do copy-final
- WhatsApp pós-form (intercept) identifica due diligence, sem PII
- Overflow-X ausente em 1440 / 1000 / 768 / 390

## Posts de destino (produção, HEAD)

| URL | Status | Cadeia |
| --- | --- | --- |
| habite-se | 200 | sem redirect |
| fraude à execução | 200 | sem redirect |
| inventário | 200 | sem redirect |

## Não feito (fora do escopo / autorização)

- commit / push / PR / merge
- Preview / Production / sitemap lastModified de release
- Card 04 (CTA blog SSR)
- Mutações Wix
