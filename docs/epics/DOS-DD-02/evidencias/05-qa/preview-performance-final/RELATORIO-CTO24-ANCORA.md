# RELATÓRIO CTO24 — ajuste local da âncora real

09/11/2026. Correção CSS local reversível. Sem commit/push/merge/deploy. Produção não liberada.

## Diff de aplicação

Somente `src/app/globals.css`:

```css
/* CTO 24: âncora aprovada do hero DD abaixo do header sticky (menu fechado). */
.dd-lcp-opt #o-que-voce-recebe {
  scroll-margin-top: 7.25rem; /* 92px header desktop + folga legível */
}
@media (max-width: 960px) {
  .dd-lcp-opt #o-que-voce-recebe {
    scroll-margin-top: 6.25rem; /* 78px header mobile + folga legível */
  }
}
```

- Seletor restrito a `.dd-lcp-opt #o-que-voce-recebe` (landing DD via `LegacyPage`).
- Sem alteração de header, copy, id, href, formulário, JS, dependências ou outros serviços.
- Valores efetivos medidos: `116px` (≥1000px) e `100px` (≤960px).

## Provas

Origem local pós-`npm run build` + `next start -p 3025`. Script: `smoke-anchor-cto24.mjs`. Bruto: `smoke-anchor-cto24.json`.

Critério: após settle de layout/fontes, `H2.top >= header.bottom` e título integralmente na área visível sob o header. Clique no link “Ver o que a análise entrega” e abertura direta `#o-que-voce-recebe`.

| Viewport | Modo | header.bottom | H2.top | gap | scroll-margin | ok |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| 390 | click | 79 | 118 | 39 | 100px | sim |
| 390 | direct | 79 | 126 | 47 | 100px | sim |
| 768 | click | 79 | 105 | 26 | 100px | sim |
| 768 | direct | 79 | 102 | 23 | 100px | sim |
| 1000 | click | 93 | 122 | 29 | 116px | sim |
| 1000 | direct | 93 | 119 | 26 | 116px | sim |
| 1440 | click | 93 | 129 | 36 | 116px | sim |
| 1440 | direct | 93 | 121 | 28 | 116px | sim |

Capturas 390/1440: `anchor-cto24-390-click.png`, `anchor-cto24-390-direct.png`, `anchor-cto24-1440-click.png`, `anchor-cto24-1440-direct.png`.

## Validação AGENTS

- `npm run typecheck` — ok
- `npm run build` — ok (23 rotas)

## Desempenho / evidências anteriores

Delta CSS mínimo, sem JS/copy. Justifica reaproveitar a bateria 80/80 e o smoke de CTAs/formulário do CTO23 sem reexecução. LCP da dobra fria não depende deste `scroll-margin` abaixo da dobra.

CTAs/eventos e formulário interceptado permanecem aceitos (CTO23/24). Fragmento sr-only do formulário segue pendência técnica não bloqueante.

## Veredito

Âncora real `#o-que-voce-recebe` corrigida localmente e comprovada em 390/768/1000/1440 (click + direct). Pronto para o CTO incluir no commit de release da PR12 com evidências sanitizadas e lastModified na data do rollout autorizado. Produção ainda exige autorização específica do lote. Sem DebugView neste passo.
