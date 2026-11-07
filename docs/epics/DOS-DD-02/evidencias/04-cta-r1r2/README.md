# DOS-DD-02.04 — Correção dirigida CTO 11 (R1/R2)

07/11/2026. Somente R1 e R2. Classificador e landing aceitos preservados. Sem publish.

## Checkout

- Worktree: `.dos-dd-02-04-cta`
- Branch: `cta/dos-dd-02-04`
- Base: `origin/main` @ `7fec6b2`

## R1 — corte de contato

Arquivo: `src/lib/wix/rich-content.ts` (`isCompactInsertionCutBlock`)

| Caso CTO | Antes | Depois |
| --- | --- | --- |
| 2 corpos + parágrafo só WhatsApp + texto | index 2 | `null` |
| 2 corpos + H2 “Fale com o escritório” + texto | index 3 | `null` |
| parágrafo de corpo com link editorial embutido | — | continua elegível (3º = index 2) |

Repro: `npx tsx docs/epics/DOS-DD-02/evidencias/04-cta-r1r2/repro-r1.ts`  
Testes permanentes: `R1:` em `src/lib/wix/blog-service-cta.test.ts`

## R2 — prova comportamental do tracker

Arquivos: `src/components/blog-cta-tracker.tsx` (`bindBlogCtaTrackerListeners`) + `src/components/blog-cta-tracker.test.ts`

Provas na suíte `npm run test:wix` (glob passou a incluir o tracker):

- clique no link e no span filho do compacto → 1× `click_cta_servico` `meio_artigo`
- botão DD, compra e WhatsApp no completo → 1 evento cada, `fim_artigo`; WhatsApp com `cluster=due-diligence` sem `link_url`/`cta_variant`
- B2B `fim_artigo`; editorial `meio` / WhatsApp `fim`+`link_url`; related = 0
- remount com novo `post_slug` → cleanup (`added === removed`) e slug novo

## Validações repetidas

- `npm run typecheck` pass
- `npm run test:wix` 56 pass (inclui R1/R2)
- `npm run test:analytics` 4 pass
- `npm run build` 23/23

## Não feito

commit / push / PR / deploy / Wix / medição de performance (card 05)
