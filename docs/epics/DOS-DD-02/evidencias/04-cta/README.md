# DOS-DD-02.04 — Evidências locais (CTA SSR e analytics)

Card: `04-CTA-BLOG-E-ANALYTICS.md` v1.0  
Pareceres: 08, 09, 10  
Checkout: `D:\Projetos desenvolvimento\.dos-dd-02-04-cta`  
Branch: `cta/dos-dd-02-04`  
Base: `origin/main` @ `7fec6b2fb2da7dc5408498099e7c4917aa33bb4d`  
Landing 03: preservada neste worktree (parecer 10), sem alterar de novo os HTMLs institucionais além da cópia aceita  
Ambiente: build local (não Preview / não Production)

## Arquivos novos / de aplicação (CTA)

| Arquivo | Papel |
| --- | --- |
| `src/lib/wix/blog-cta-eligibility.ts` | Precedência + allowlist Contratos comprador |
| `src/lib/wix/rich-content.ts` | `fromList`, corte FAQ/Leia também, índice do compacto |
| `src/components/blog-service-cta.tsx` | B2B + compacto DD + completo DD |
| `src/components/wix-rich-content.tsx` | Inserção SSR do compacto |
| `src/components/blog-cta-tracker.tsx` | Multi-escopo + privacidade |
| `src/app/post/[slug]/page.tsx` | Wiring do plano CTA |
| `src/app/globals.css` | Classes do bloco apenas |
| `src/lib/wix/blog-service-cta.test.ts` | Gating / SSR / parágrafos |
| `src/components/blog-cta-tracker.test.ts` | Contrato do tracker |

Landing 03 (preservada, não refeita neste card): HTMLs institucionais + `site-interactions.js` + `contact-form.test.ts`.

## Decisão de analytics / privacidade

| Fluxo | Evento | `cta_position` | `link_url` | `cta_variant` no GA4 |
| --- | --- | --- | --- | --- |
| Link editorial em `.article__content` | `click_cta_servico` | `meio` (histórico) | não | não |
| WhatsApp editorial no corpo | `click_whatsapp` | `fim` (histórico) | **sim** (série legada) | não |
| Compacto DD injetado | `click_cta_servico` | `meio_artigo` | não | não (só `data-cta-variant` no DOM) |
| Completo DD / B2B | `click_cta_servico` | `fim_artigo` | não | não |
| WhatsApp do completo DD | `click_whatsapp` | `fim_artigo` | **não** | não |
| Cards relacionados | — | — | — | zero eventos de serviço |

## Chunks (build local pós-mudança)

Ver `chunks-inventory.txt`. Resumo: 14 JS / 1 CSS em `.next/static`; JS ~646 KB, CSS ~43 KB. Comparação absoluta vs `origin/main` limpo exige segundo build dedicado no card 05; aqui o inventário é do checkout 03+04.

## Validações

Ver `validacao.md`. typecheck + build + wix/analytics/contact/navigation + tracker tests.

## Operações externas

Nenhuma. Sem commit, push, PR, deploy, env ou Wix.

## Gate CTO

Revisar precedência, inserção do 3º parágrafo, tracker multi-bloco, série GA4 e inventário JS/CSS. Liberar integração 03+04 só com autorização concreta de Felipe.
