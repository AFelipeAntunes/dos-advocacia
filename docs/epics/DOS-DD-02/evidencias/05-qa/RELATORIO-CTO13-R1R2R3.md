# DOS-DD-02.05 — Correção CTO 13 (R1–R3)

Data: 07/11/2026. Worktree candidato: `D:\Projetos desenvolvimento\.dos-dd-02-04-cta` (`qa/dos-dd-02-05` @ base `7fec6b2` + composição local 03+04+retrato). Worktree baseline isolada: `D:\Projetos desenvolvimento\.dos-dd-02-05-baseline` (detached `7fec6b2`). Sem commit, push, PR, deploy ou mutação Wix.

Aplicação e retrato aceitos **preservados** (sem alteração de copy/layout nesta correção).

## R1 — instrumentação LCP/CLS

| Item | Resultado |
| --- | --- |
| Observadores | `PerformanceObserver` buffered para `largest-contentful-paint`, `layout-shift` e `longtask` instalados **antes** da navegação (`perf-lab-controlled.mjs`) |
| LCP | Entrada real + elemento/URL/size; **sem** fallback FCP; run inválido se LCP ausente |
| CLS | Janelas de sessão (gap 1s / janela 5s), exclui `hadRecentInput`; shifts brutos guardados |
| Controle de coleta | `cls-fixture-control.json`: support=true, cls=0,0581, shiftCount=1, **passed=true** (Chrome 156.0.8078.81) |
| Retrato / scroll | `perf-portrait-scroll.json`: observador ativo; após scroll+decode no candidato CLS=0, shiftCount=0; dims 1600×1600 reservadas; WebP ~144,09 KB lazy |
| Dados antigos | Preservados com prefixo `INVALIDATED-*` + `INVALIDACAO-LCP-CLS-ANTERIOR.md` (números **não** reescritos) |

Bateria controlada: **80/80** runs com `collectionValid=true`.

## R2 — comparação institucional controlada

Ambientes equivalentes:

| Lado | Origem | Build |
| --- | --- | --- |
| Baseline | `http://127.0.0.1:3024` | `next start` em worktree detached `7fec6b2` |
| Candidato | `http://127.0.0.1:3025` | `next start` no worktree QA com manifesto local |

Condições comuns: mesma máquina, Chrome `156.0.8078.81`, builds de produção, ordem **alternada** por paridade do run, 5×/célula, cold cache, bloqueio de GTM/GA/Vercel insights. Mobile 390×844 DPR2 CPU4× 1,6Mbps/750kbps/150ms; desktop 1440×900 sem throttle. CSS filtrado por `.css`; documento incluso no transfer. JS reporta transfer **e** encoded (não atribuir “queda” só por transferSize parcial).

### Medianas LCP (ms) — fonte única `perf-lab-controlled-summary.json`

| Página | Desktop Δ med | Mobile Δ med | CLS cand / base |
| --- | --- | --- | --- |
| home | +12 | +92 | 0 / 0 |
| due-diligence | +80 | +268 | 0 / 0 |
| imobiliarias (controle) | −40 | −152 | 0 / 0 |
| compra | −4 | −156 | 0 / 0 |

Dispersão e faixas: ver `rows[].lcpCandidateRange` / `lcpBaselineRange` / `sd` no summary. Raw completo: `perf-lab-controlled-raw.json`.

Observações de laboratório (não confundir com regressão automática):

- Landing DD do candidato carrega conteúdo/retrato aceitos ausentes no `7fec6b2` puro; transfer DD candidato ~195,8 KB vs baseline ~189,6 KB.
- Proxy de long tasks (não é TBT) varia entre runs; usar LCP/CLS/transfer como sinais principais.
- Retrato lazy abaixo da dobra: cold lab sem scroll não carrega o WebP; sonda com scroll confirma carga sem CLS na decodificação.

## R3 — consistência das evidências

1. Tabela deste relatório = `perf-lab-controlled-summary.json` (mesma execução `comparedAt=2026-11-07T18:52:38.077Z`).
2. Relatório consolidado anterior mantido como histórico; seção de performance lá aponta invalidação e redireciona para este arquivo.
3. Manifestos regenerados após fechar este pacote (`candidato-manifesto-sha256.txt`, `evidencias-sha256.txt`, `evidencias-pack-sha256.txt`) com timestamps no cabeçalho.
4. Artigo principal (produção): `artigo-principal-normalizado.json` — hrefs absolute/relative normalizados; **1** link canônico DD no `<article>` e na página; CTA SSR do card 04 ausente em produção (esperado). Contagem anterior de “2 service links no browser” não deve ser misturada sem separar corpo vs fora do article.

## Gaps de artigos reais (separados — sem Preview/Wix neste pacote)

Estes **não** fecham R1–R3 e permanecem pendentes de operação remota autorizada:

1. Multicategoria por `categoryIds` via API Wix (sem `.env.local` neste worktree).
2. Fluxo artigo → CTA SSR card 04 → formulário/WhatsApp em posts B2C/B2B/multicategoria reais no Preview.
3. GA4 DebugView real.
4. Sitemap dates / publicação.

## Operações externas

Nenhuma. Baseline worktree local criada só para medição (`\.dos-dd-02-05-baseline`). Sem PR/Preview/deploy.

## Gate CTO

1. Aceitar R1–R3 da instrumentação + bateria institucional controlada + hashes, ou apontar falha residual de coleta/comparação.
2. Autorizar (ou negar) Preview com Wix para a bateria de artigos reais — operação remota distinta.
3. Não tratar “base apta a PR” como QA05 completo nem release autorizado.
