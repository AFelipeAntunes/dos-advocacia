# Parecer CTO 16 — sonda H1 e escopo da otimização

07/11/2026. SONDA ACEITA COMO EVIDÊNCIA LOCAL. AJUSTE DE ESCOPO ANTES DO ACEITE FINAL DO QA05.

## Resultado conferido

Inspecionados relatório CTO15, script, summary post-fix-cv e diff real. O summary registra LCP desktop 202→150 ms (-52 ms; zero de dez pares mais lentos) e mobile 1158→1140 ms (-18 ms; três de dez pares mais lentos). Não houve nova execução independente nesta revisão. Retrato e copy permanecem aceitos. A comparação anterior não deve ser apagada.

O comportamento é compatível com custo adicional de renderização abaixo da dobra. DOM maior e melhora com content-visibility sustentam essa hipótese; não isolam por si só uma causa exclusiva, porque ordem de marcação, script e CSS mudaram em conjunto.

## R1 — limitar o alcance da correção

O seletor novo em src/app/globals.css:315 (`main > .page-hero ~ section`) também alcança seções de outras páginas, incluindo locação, compra, Curitiba e contato. Em src/components/legacy-page.tsx, a mudança de ordem body/JSON-LD e defer também se aplica a todas as páginas LegacyPage. A sonda apresentada cobre somente due diligence; não comprova esse alcance compartilhado. Não há prova de defeito nessas outras rotas, mas o gate delas não pode ser inferido desta sonda.

Recomendação mínima: restringir as três otimizações à chave `dueDiligence`, usando classe/atributo exclusivo para o CSS. Preservar marcação e carregamento das demais páginas. Não refatorar o componente nem mudar copy/retrato. Alternativa de manter a otimização global exigiria QA e controles adicionais, sem necessidade para este card.

## Devolução ao Cursor

1. Aplicar somente R1 acima e demonstrar que outras páginas não recebem o novo content-visibility nem alteração de ordem/defer por esta otimização.
2. Repetir apenas a sonda DD, dez execuções por revisão/perfil, com build final e referência identificados. Preservar dados de todas as rodadas. Não repetir a bateria completa.
3. No build final, verificar desktop/mobile: navegação por âncora ao formulário, teclado até seus campos, FAQ abrindo/fechando, scroll integral com observador de CLS e retrato; formulário com interceptação identificada, sem envio real. Conferir seis FAQs e JSON-LD presentes no HTML. Registrar resultados, não apenas screenshot do topo.
4. Typecheck e build, hashes atualizados e relatório curto com diff do ajuste. Nenhuma publicação, commit, push, PR, Wix ou ambiente nesta devolução.

## Gate seguinte

Após esse ajuste dirigido, pacote pode retornar para aceite como base de PR/Preview. Integração Wix real/multicategoria/CTA e smoke de Preview continuam no card05; o aceite local não é autorização de release. Produção não foi alterada nesta revisão.
