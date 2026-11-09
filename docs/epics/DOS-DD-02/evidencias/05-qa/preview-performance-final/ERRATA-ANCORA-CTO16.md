# Errata — prova de âncora CTO 16 / parecer 20

08/11/2026.

O relatório CTO 16 tratou a navegação `#due-diligence-imobiliaria-contact-title` como parte do QA aprovado. Os indicadores em `../cto16-scope-and-qa.json` não sustentam visibilidade:

| Perfil | formAnchorExists | anchorInView | formTop |
| --- | --- | --- | --- |
| desktop | true | **false** | 2033 |
| mobile | true | **false** | 3491 |

Aceite dessa prova: **retirado**.

Notas CTO 20:

- O id existe no `div.sr-only` gerado em `src/lib/contact-form.ts` (não no atributo do `<form>`).
- Ausência de `href="#due-diligence-imobiliaria-contact-title"` na copy **não** é, por si, descumprimento do texto aprovado.
- Critério de “em viewport” deve usar limites superior **e** inferior; não apenas `top < innerHeight`.
- Reprodução no Preview `fp0125m2c` e eventual causa (sr-only, content-visibility, layout) ficam para após autenticação; sem patch de aplicação neste card de QA.
