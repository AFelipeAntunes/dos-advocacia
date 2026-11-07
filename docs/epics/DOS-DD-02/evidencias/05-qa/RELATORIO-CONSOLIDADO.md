# DOS-DD-02.05 — Relatório consolidado de QA

Data: 07/11/2026. Worktree: `D:\Projetos desenvolvimento\.dos-dd-02-04-cta`. Branch: `qa/dos-dd-02-05`. Base: `origin/main` `7fec6b2`. Estado: composição local não commitada dos cards 03+04+R1/R2 + retrato na seção método. Sem commit, push, PR, deploy ou mutação Wix.

## Escopo executado

1. Suítes locais (typecheck, build, wix/analytics/contact/navigation/sitemap/redirects) — evidências `typecheck.txt`, `build.txt`, `test-*.txt`, `build-after-portrait.txt`.
2. Browser QA da landing `/due-diligence-imobiliaria` (H1, FAQ×6, canonical, schema `legalName`, formulário, âncoras, viewports 1440/1000/768/390) — `browser-qa.json` + capturas `qa-dd-*.png`.
3. Multicategoria pública reconciliada (excluindo aba litígios que redireciona a `/blog`) — `multicategoria-reconciliacao.json`.
4. Artigo principal em produção — `artigo-principal-producao.json`.
5. Retrato profissional na seção “Por que eu faço due diligence desse jeito” — HTML/CSS mínimos + capturas `metodo-portrait-*.png`.
6. Perf lab candidato (`:3025`) × produção — `perf-lab-raw.json`, `perf-lab-summary.json`; sonda dirigida do WebP — `portrait-resource-probe.json`.

## Retrato (instrução imediata)

| Requisito | Resultado |
| --- | --- |
| Asset | `public/assets/images/drielle-pereira-retrato-profissional.webp` (1600×1600, existente) |
| Desktop | foto ao lado do texto (`photoBesideText: true`) |
| Mobile | foto acima do texto (`photoAboveText: true`) |
| Alt | exatamente `Drielle Pereira, advogada imobiliarista` |
| width/height | `1600` / `1600` |
| loading | `lazy` + `decoding="async"` |
| Escopo | só seção método + CSS `.dd-method-*` |

Capturas: `metodo-portrait-desktop-1440.png`, `metodo-portrait-mobile-390.png` (+ `metodo-portrait-meta.json`).

## Performance

> **CTO 13:** a bateria LCP/CLS abaixo e os arquivos `INVALIDATED-perf-lab-*` estão **invalidados** (coleta sem PerformanceObserver adequado + comparação localhost×CDN + inconsistência relatório/summary). Números históricos **não** foram reescritos. Medição corrigida: `RELATORIO-CTO13-R1R2R3.md` + `perf-lab-controlled-summary.json`.

Método original (inválido para LCP/CLS): Playwright Chromium, cold context, 5 runs/célula; mobile 390×844 DPR2 CPU4× 1,6Mbps/750kbps/150ms; desktop 1440×900 sem throttle. Proxy = soma `(duration-50)` de long tasks >50ms (não é TBT Lighthouse).

Médias LCP (ms) candidato − baseline **(INVÁLIDAS — preservar só como histórico)**:

| Página | Desktop Δ | Mobile Δ |
| --- | --- | --- |
| home | +57,6 | −137,6 |
| due-diligence | −32,8 | −35,2 |
| imobiliarias (controle) | −72,0 | −980,0 |
| compra | −74,4 | −438,4 |

Observações históricas (não usar para gate):

- CLS médio 0 nas células reportadas da bateria inválida.
- Comparação era candidato `:3025` × produção CDN.
- Retrato aceito visualmente permanece; prova de CLS no scroll/decode está na correção R1 (`perf-portrait-scroll.json`).

Páginas de artigo/blog reais **não** entraram no lab institucional (gap separado; ver `RELATORIO-CTO13-R1R2R3.md`).

## Multicategoria e artigo principal

- Interseções públicas reais (excluindo litígios): 3 posts (Contratos+DD ×2; Assessoria+Contratos ×1). Assessoria+DD público = 0.
- Gap: `categoryIds` via API não lidos sem `WIX_API_KEY` neste worktree.
- Artigo principal em produção: title SEO alinhado ao CMO, 6 FAQs; links de serviço para DD ainda abaixo do mínimo editorial (1 href canônico no probe; browser registrou 2 service links na página). Compacto/completo do card 04 ausentes em produção (esperado pré-release).

## Aceites locais preservados

- Classificador SSR e blocos CTA do card 04 (pareceres 10–12 / aceite R1-R2).
- Landing DD do card 03 (copy, FAQ, schema, âncoras).
- Diff mínimo do retrato não toca classificador nem blog.

## Gaps / bloqueadores externos

1. Sem `.env.local` / chave Wix no worktree → sem prova de `categoryIds` runtime nem Preview de posts com CTA SSR.
2. Produção ainda sem card 03/04/retrato → baseline de conteúdo difere do candidato na landing DD.
3. Lab local vs CDN/produção: TTFB/proxy não são comparáveis 1:1; LCP/CLS/transfer são os sinais principais.
4. Artigos B2C/B2B/multicategoria com markup CTA do card 04 exigem Preview autorizado com credenciais.
5. Coleta GA4 real / DebugView não exercitada neste pacote (interceptação browser apenas).
6. Datas de sitemap substanciais das rotas alteradas ficam para o card de publicação.

## Operações externas

Nenhuma: sem commit, push, PR, deploy, DNS, env ou Wix.

## Gate CTO

Pedir ao CTO:

1. Aceitar R1–R3 em `RELATORIO-CTO13-R1R2R3.md` (instrumentação + lab institucional controlado + hashes), preservados os aceites de aplicação/retrato.
2. Autorizar (ou negar) Preview com credenciais Wix para gaps de artigos reais (multicategoria/CTA) — operação remota distinta.
3. Não liberar release só por build/suítes verdes; não confundir base apta a PR com QA05 completo.

Hashes: `candidato-manifesto-sha256.txt`, `evidencias-sha256.txt`, `evidencias-pack-sha256.txt`.
