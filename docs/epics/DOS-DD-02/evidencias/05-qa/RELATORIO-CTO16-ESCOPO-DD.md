# DOS-DD-02.05 — CTO 16 R1 (escopo dueDiligence)

Data: 07/11/2026. Candidato final: worktree `.dos-dd-02-04-cta` / branch `qa/dos-dd-02-05` @ base `7fec6b2` + composição local. Referência: worktree `.dos-dd-02-05-baseline` detached `7fec6b2` (`http://127.0.0.1:3024`). Candidato `http://127.0.0.1:3025`. Chrome `156.0.8078.81`. Sem commit/push/PR/deploy/Wix.

Rodadas CTO15 (`pre-fix`, `post-fix`, `post-fix-cv`) **preservadas**.

## Diff do ajuste (R1)

### `src/components/legacy-page.tsx`
- `optimizeDdLcp = page === "dueDiligence"`.
- Só nessa chave: wrapper `.dd-lcp-opt` / `data-dd-lcp-opt`, body antes do JSON-LD, `site-interactions.js` com `defer`.
- Demais páginas LegacyPage: ordem original JSON-LD → body → tracker → script **sem** defer.

### `src/app/globals.css`
- Seletor global `main > .page-hero ~ section` substituído por `.dd-lcp-opt main > .page-hero ~ section`.

Copy/retrato/FAQ da landing DD **não** alterados.

## Prova de escopo (`cto16-scope-and-qa.json`) — `scopePass: true`

| Rota | `dd-lcp-opt` | JSON-LD antes do H1 | `defer` | `content-visibility` |
| --- | --- | --- | --- | --- |
| `/due-diligence-imobiliaria` | sim | não (H1 antes) | sim | `auto` |
| `/assessoria-em-locacao` | não | sim | não | `visible` |
| `/assessoria-juridica-compra-de-imovel` | não | sim | não | `visible` |
| `/advogada-imobiliaria-curitiba` | não | sim | não | `visible` |
| `/contato` | não | sim | não | `visible` |

## Sonda DD repetida (`perf-dd-h1-probe-cto16-final`)

10× por revisão/perfil, ordem alternada, só DD. LCP = H1; retrato ausente no frio.

| Perfil | Cand med | Base med | Δ | Pares mais lentos |
| --- | --- | --- | --- | --- |
| desktop-cold | 136 | 184 | **−48 ms** | 1/10 |
| mobile-cold | 1196 | 1142 | **+54 ms** | 5/10 |

Mobile: dispersão alta na referência (pares 7–8 com baseline 1800/1940 ms). Sem apagar rodadas. Frente ao pre-fix CTO15 (+92 ms / 8/10) a magnitude cai; frente ao post-fix-cv (−18 ms) há ruído de lab — escopo não remove a otimização da DD.

## QA funcional no build final (desktop + mobile)

Fonte: `cto16-scope-and-qa.json`.

- Âncora `#due-diligence-imobiliaria-contact-title` → formulário
- Teclado preenche nome/e-mail/telefone
- 6× `<details>` FAQ abrem e fecham
- Scroll integral + método: CLS **0**; retrato lazy carrega (dims/alt ok)
- `POST /api/contato` **interceptado** (fulfill local); sem envio real
- 6 FAQs no DOM; `FAQPage` no JSON-LD presente
- H1 canônico preservado

## Typecheck / build

- `cto16-typecheck.txt` — ok
- `cto16-build.txt` — ok

## Gate

Pacote apto a retornar para aceite como base de PR/Preview após R1. Gaps Wix/multicategoria/CTA Preview seguem no card 05. Sem autorização de release.
