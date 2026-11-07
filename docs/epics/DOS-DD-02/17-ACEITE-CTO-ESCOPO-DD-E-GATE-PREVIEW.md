# Parecer CTO 17 — escopo DD aceito; integração seguinte

07/11/2026. R1 DO PARECER16 ACEITO. PACOTE LOCAL ACEITO COMO BASE DE PR/PREVIEW, SEM ACEITE DE RELEASE.

## Conferência independente dos artefatos

Revisados diff de LegacyPage/globals.css, RELATORIO-CTO16-ESCOPO-DD.md, cto16-scope-and-qa.json, summary da sonda final e log de build. Sem reexecução independente de navegador, build ou medições nesta revisão.

O código condiciona ordem body/JSON-LD e defer a `page === "dueDiligence"`. CSS restrito a `.dd-lcp-opt main > .page-hero ~ section`. Controles de locação, compra, Curitiba e contato registram ausência do wrapper, ordem anterior, script sem defer e content-visibility visible. R1 fechado; não solicitar nova rodada local do mesmo ajuste.

Evidências do executor registram seis FAQs, schema FAQPage, âncora/formulário, teclado, scroll com CLS zero e retrato. Formulário interceptado não equivale a envio real.

## Desempenho: distinção necessária

Summary final: desktop 184→136 ms (-48 ms; 1/10 pares mais lentos); mobile 1142→1196 ms (+54 ms; 5/10 pares mais lentos). Os deltas pareados mobile são -36, +48, +28, +16, +72, +80, -540, -684, -108, -12 ms. Portanto, nem uma média puxada pelos dois extremos favoráveis nem a simples classificação como ruído comprovam preservação da velocidade. A diferença entre medianas é +54 ms; não confundir com mediana dos deltas pareados.

A nova amostra é mista e as rodadas anteriores permanecem disponíveis. Não há justificativa para novo refactor local especulativo. O gate mobile continua aberto para comparação identificada no Preview; não declarar “sem regressão” ou “gate satisfeito” nesta etapa.

## Handoff para a etapa conectada do card05

Após autorização operacional de Felipe para commit/push/PR e Preview deste lote:

1. Identificar base e candidato reais, conferir alterações locais selecionadas e PRs/conflitos atuais. Não levar o checkout principal antigo inteiro nem fazer merge automático.
2. Criar revisão identificável do candidato e Preview no projeto oficial existente, preservando credenciais e domínio. Não recriar integração Wix. Alteração de env exige autorização específica se ainda necessária.
3. Validar artigos reais B2B/DD/Contratos comprador e multicategoria, precedência, compacto após terceiro parágrafo elegível, CTA final, relacionados e cliques sem duplicação/PII. Fixture não fecha esses critérios. Separar GA4 interceptado de painel real.
4. Comparar DD mobile/desktop em revisões equivalentes com configuração comum, dados brutos e ordem alternada. Não comparar build local diretamente com CDN pública como teste causal. Registrar também CLS no scroll, bytes, TTFB e bloqueio conforme card05. Reaproveitar protocolo existente; não reabrir copy/retrato nem exigir refactor sem causa reproduzida.
5. Voltar ao CTO com revisão identificada, URLs, evidências e conclusão explícita do gate mobile. lastModified só deve refletir publicação efetiva no rollout. Merge/deploy de produção dependem de aprovação específica após review.

## Estado

Aceite local não encerra o card05. Pendentes integração conectada e desempenho mobile final. Nenhum commit, push, PR, deploy ou escrita Wix realizado pelo CTO nesta revisão.
