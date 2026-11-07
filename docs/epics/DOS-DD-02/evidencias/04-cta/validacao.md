# Validações DOS-DD-02.04

Data: 2026-11-07  
Checkout: `.dos-dd-02-04-cta` / `cta/dos-dd-02-04` @ base `7fec6b2`

## Suites

| Comando | Resultado |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run test:wix` | 47 pass (inclui 11 novos/ampliados de CTA) |
| `npx tsx --test src/components/blog-cta-tracker.test.ts` | 3 pass |
| `npm run test:analytics` | 4 pass |
| `npm run test:contact` | 11 pass (landing 03) |
| `npm run test:navigation` | 18 pass |
| `npm run build` | pass (23 rotas) |

## Cobertura dos critérios do card

- Assessoria → só B2B; multicategoria Assessoria+DD suprime DD
- Due Diligence → compacto (se ≥3 parágrafos) + completo
- Contratos allowlist → completo + “ver assessoria na compra”
- Contratos fora da allowlist / Litígios / vazio / só desconhecida → sem bloco
- ID desconhecido extra não apaga categoria conhecida
- Compacto após 3º parágrafo; corta em FAQ / Leia também; listas não contam
- Conteúdo curto: sem compacto
- Link editorial embutido não suprime compacto
- IDs únicos `article-dd-cta-compact` / `article-dd-cta-complete`
- Tracker: `querySelectorAll([data-cta-scope])`; escopo injetado não borbulha para listener editorial
- Sem `cta_variant` no GA4; WhatsApp novo sem `link_url`

## Gaps conscientes (card 05)

- Fixture ≠ posts reais com categoryIds multicategoria ao vivo
- Sem medição Lighthouse/performance neste card
- Sem Preview conectado / GA4 DebugView
