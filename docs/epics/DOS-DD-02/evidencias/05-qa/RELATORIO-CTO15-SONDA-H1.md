# DOS-DD-02.05 — Sonda dirigida CTO 15 (LCP H1 / due diligence)

Data: 07/11/2026. Candidato: `qa/dos-dd-02-05` @ `7fec6b2` + composição local. Baseline isolada: detached `7fec6b2` em `:3024`. Chrome `156.0.8078.81`. Sem commit/push/PR/deploy.

Copy, retrato e cards 03/04 **preservados**.

## Método

- Somente `/due-diligence-imobiliaria`
- 10 repetições × revisão × perfil (desktop-cold / mobile-cold)
- Ordem alternada, cache frio, mesmos bloqueios de terceiros do lab controlado
- Script: `perf-dd-h1-probe.mjs`
- Artefatos: `perf-dd-h1-probe-pre-fix*.json`, `perf-dd-h1-probe-post-fix*.json`, `perf-dd-h1-probe-post-fix-cv*.json`

## Diagnóstico (pre-fix)

| Achado | Evidência |
| --- | --- |
| LCP = H1 `#page-title` em 40/40 | `lcpIsH1` |
| Retrato **não** no cold load | `portraitFound` 0/10 |
| LCP ≡ FCP (sem late paint de fonte no H1) | gaps LCP−FCP = 0 |
| Documento candidato ~2× (≈65 KB vs ≈33 KB) | `documentChars` |
| JSON-LD candidato 4138 chars vs baseline 1142; estava **antes** do H1 | `jsonLdBeforeH1InHtml=true` |
| CSS/fonte quase iguais; atraso mobile correlaciona com DOM/layout sob CPU 4×, não com a foto | fonts ~28 KB woff2 nas duas revisões |

### Medianas pre-fix vs bateria CTO13

| Perfil | CTO13 Δ | Pre-fix Δ | Pares mais lentos |
| --- | --- | --- | --- |
| desktop | +80 ms | **−34 ms** | 2/10 |
| mobile | +268 ms | **+92 ms** | **8/10** |

Desktop CTO13 **não** reproduziu. Mobile **reapareceu** (menor magnitude).

## Correções mínimas (sem tocar copy/retrato)

1. `legacy-page.tsx`: renderizar o **body antes** do JSON-LD (H1 descoberto mais cedo no HTML).
2. `legacy-page.tsx`: `site-interactions.js` com **`defer`**.
3. `globals.css`: `content-visibility: auto` + `contain-intrinsic-size: auto 800px` em `main > .page-hero ~ section` (abaixo da dobra; H1 permanece no hero).

Tentativa intermediária só com (1): mobile ainda +150 ms / 8/10 — JSON-LD antecipado **não** bastava. A causa dominante no mobile foi o **custo de layout/paint do DOM longo** sob throttle; (3) endereça isso.

## Pós-fix (`post-fix-cv`)

| Perfil | LCP cand med | LCP base med | Δ | Pares mais lentos |
| --- | --- | --- | --- | --- |
| desktop-cold | 150 | 202 | **−52 ms** | **0/10** |
| mobile-cold | 1140 | 1158 | **−18 ms** | **3/10** |

LCP continua no H1; retrato ausente no frio; após scroll do método: CLS 0, dims reservadas, WebP ~144 KB, alt canônico.

## Invariantes

- H1: `Due diligence imobiliária antes de comprar, vender ou investir`
- Retrato: `drielle-pereira-retrato-profissional.webp`, lazy, 1600×1600, alt canônico
- Sem alteração de FAQ/copy comercial

## Limitações

- Lab local `next start`, não CDN/INP de campo
- `content-visibility` eleva DCL reportado no candidato mobile (próximo do LCP); o sinal de aceite aqui é LCP/CLS do H1 e ausência de regressão pareada
- Home mobile (+92 ms na bateria 13) não foi ampliada (sem evidência de causa compartilhada exigindo rodada completa)

## Gate CTO

1. Aceitar a sonda + fix mínimo (JSON-LD após body, defer do interactions, content-visibility abaixo do hero) como fechamento do gate de desempenho da landing DD, ou apontar regressão residual.
2. Operação remota (Preview/Wix/artigos) permanece autorização separada.
3. Não publicar por este relatório.
