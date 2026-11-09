# RELATÓRIO CTO22 — opção B + limpeza D

09/11/2026. Executor: Cursor local. Sem commit/push/merge/deploy/Production/env/Wix.

## Referências

| Papel | URL imutável | SHA | Árvore |
| --- | --- | --- | --- |
| Baseline | `https://dos-advocacia-n7nukp43d-dos-advocacia.vercel.app/due-diligence-imobiliaria` | `753bad4f018ce44172eee5131ce1fee2dd8837e7` | `e49e8c58…` (= Production `7fec6b2`) |
| Candidato | `https://dos-advocacia-fp0125m2c-dos-advocacia.vercel.app/due-diligence-imobiliaria` | `2abfbebab000a89250e0c18a29b06d0a161c6864` | branch `qa/dos-dd-02-05` |

Não se chama o SHA `753bad4` de `7fec6b2`; reporta-se equivalência de árvore apenas. Ambientes Preview ≠ Production (SSO, `SITE_URL` do candidato, fonts Google bloqueadas no lab).

H1 confirmados: baseline “O imóvel parece certo…”; candidato “Due diligence imobiliária antes de comprar…”.

## D — limpeza

Autorizada por Felipe; executada e comprovada. Detalhe: `LIMPEZA-D.json`.

1. Inventário: projeto `preflight-playwright-auth` / `prj_oGSRjIAMCRzwviGYbbJOOCjEj4N5`, deployment `dpl_CMEHKRbujwgfVuSjR88ZhGjQ1D3N`, aliases só no domínio acidental, criado nesta sessão.
2. `vercel project delete preflight-playwright-auth --confirm-name preflight-playwright-auth --scope dos-advocacia` → Deleted.
3. Pós-check: `project ls` mostra somente `dos-advocacia`.
4. Bypass: 1 secret, `createdAt` 2026-11-09T13:29:51Z, scope `automation-bypass`, alinhado ao `vercel curl` involuntário. Valor não revelado.
5. `vercel project protection disable dos-advocacia --protection-bypass …` → `protectionBypass: false`. SSO/`gitForkProtection` do oficial preservados.

## Acesso e cache (pré-bateria)

Método: OIDC `x-vercel-trusted-oidc-idp-token` via `extraHTTPHeaders` (sem `context.route`). Terceiros (GTM/GA/Google Fonts/`vercel.live`/insights) bloqueados por CDP `Network.setBlockedURLs` para o token não sair das duas origens. Sem Automation Bypass.

Prova: `auth-cache-proof.json` — ok.

- Candidate/baseline frio: HTTP 200, sem SSO, 0 origens externas completadas.
- Quente no mesmo contexto: doc transfer 13474 → 300 bytes; `cachedLikeResourceCount` = 11 na 2ª navegação.

## Bateria 80

Script: `perf-preview-battery.mjs`. Raw/summary: `perf-preview-battery-*.json`. Chrome `156.0.8078.81`.

- 10 × baseline/candidate × desktop/mobile × frio/quente = **80/80** válidas (LCP observer + CLS; LCP = `#page-title` em 100%).
- Ordem alternada; mobile CPU 4× + 1,6 Mbps / 750 kbps / 150 ms RTT.
- Frio: cache desabilitado + clear; `cachedLike` mediana 0.
- Quente: warmup + reload; `cachedLike` mediana 11; transfer ~1,46 KB vs ~207 KB no frio.

### Medianas LCP (ms) e delta candidato − baseline

| Perfil | Candidato | Baseline | Δ | CLS med. | proxy med. (≠TBT) |
| --- | ---: | ---: | ---: | --- | --- |
| desktop-cold | 274 | 298 | **−24** | 0 / 0 | 12,5 / 19 |
| desktop-warm | 86 | 88 | **−2** | 0 / 0 | 0 / 0 |
| mobile-cold | 1290 | 1414 | **−124** | 0 / 0 | 466,5 / 533 |
| mobile-warm | 288 | 300 | **−12** | 0 / 0 | 0 / 0 |

Dispersão mobile-cold alta (candidato max 10456 ms; baseline max 4404 ms). Amostras LCP mobile-cold:

- baseline: 1520, 1380, 1448, 1284, 1408, 1424, 1420, 4404, 1404, 1404
- candidate: 1492, 1596, 1320, 1300, 1256, 1272, 1272, 10456, 1280, 1260

Mediana favorece o candidato; o outlier único não foi descartado.

## Âncora dirigida

Script: `anchor-directed.mjs` / `anchor-directed.json`. Capturas: `anchor-desktop.png`, `anchor-mobile.png`.

| Critério | Desktop | Mobile |
| --- | --- | --- |
| Alvo `#due-diligence-imobiliaria-contact-title` existe | sim (`div.sr-only` 1×1) | sim |
| Link interno `href="#…"` | **não** | **não** |
| Navegação por fragmento deixa alvo com topo E fundo no viewport | **não** (top ≈ −649 / −921) | **não** |
| Formulário existe e intersecta viewport após settle | parcialmente (top negativo, bottom no viewport) | parcialmente |

Confirma a errata do CTO20/CTO16: `formAnchorExists=true` e `anchorInView=false`. Nenhuma correção de aplicação neste card de QA.

## Veredito

| Item | Resultado |
| --- | --- |
| D limpeza | **Concluída** (projeto acidental ausente; bypass involuntário revogado; oficial intacto) |
| Acesso OIDC Previews | **Comprovado**, sem bypass |
| Cache frio/quente | **Comprovado** (sem `route`) |
| Desempenho Preview B | **Sem regressão de mediana** LCP/CLS vs baseline n7nukp43d; candidato melhor ou empatado nas 4 células |
| Âncora visual | **Falha reproduzida** (alvo sr-only fora do viewport; sem link interno) |
| Gate publish | **Ainda não** — sem merge/deploy; gaps: outlier mobile-cold, âncora, GA4 real, decisão Felipe |

## Artefatos

- `LIMPEZA-D.json`, `bypass-inventory-sanitized.json`, `protection-dos-advocacia-pre/post.json`
- `auth-cache-proof.mjs` / `.json`
- `perf-preview-battery.mjs` / `-raw.json` / `-summary.json` / `-console.txt`
- `anchor-directed.mjs` / `.json` / `anchor-*.png`
