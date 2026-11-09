# CTO23 — aceite B/D e desempenho de laboratório

09/11/2026. LIMPEZA D ACEITA PELAS EVIDÊNCIAS. GATE DE DESEMPENHO DA LANDING ACEITO NAS CONDIÇÕES CONTROLADAS DO LABORATÓRIO. SEM AUTORIZAÇÃO DE MERGE/PRODUÇÃO.

## Revisão independente

Lidos relatório CTO22-B-D, script da bateria, raw, summary, prova de cache, relatório de âncora e artefatos sanitizados de limpeza. Medianas recalculadas diretamente dos80 registros; nenhuma nova bateria executada pelo CTO.80/80 collectionValid, dez registros por revisão/perfil/estado de cache. LCP H1 nos registros, CLS zero. Scripts usam observadores buffered antes da navegação e proxy de bloqueio nomeado distintamente de TBT.

| Perfil | Baseline LCP ms | Candidato LCP ms | Delta ms | Pares com candidato mais lento |
| --- | ---: | ---: | ---: | ---: |
| desktop frio |298|274|-24|4/10|
| desktop quente |88|86|-2|4/10|
| mobile frio |1414|1290|-124|3/10|
| mobile quente |300|288|-12|2/10|

Referência753bad4/n7nukp43d, árvore idêntica à Production7fec6b2 conforme CTO22; candidato2abfbeb/fp0125m2c. Comparação entre Previews, não promessa de latência de Production nem INP de visitantes reais. Terceiros bloqueados por CDP nas duas revisões; bloqueio de Google Fonts não deve ser apresentado como experiência integral de campo. O layout usa Urbanist via next/font/google, além das referências históricas do HTML legado. Não generalizar os resultados para analytics/serviços externos bloqueados.

Frio: medianas transferidas206890→212057 bytes (+5167); JS155681→155734 bytes (+53), CSS10633→10865 bytes (+232). Quente:1500 bytes em ambas, recursos cachedLike mediana11. A prova confirma que o novo mecanismo não usa context.route e registra aquecimento no mesmo contexto.

## Outlier preservado e rastreado

Mobile frio/run8: candidato LCP10456ms, TTFB9213ms; baseline LCP4404ms, TTFB3149ms. Intervalo resposta→LCP:1243ms candidato contra1255ms baseline. Diferença LCP6052ms acompanha diferença TTFB6064ms. Isso localiza a diferença observada no tempo até a resposta; não prova a causa desse TTFB nem uma regressão de renderização do candidato. Preservar a amostra e registrar a limitação. Não exigir nova bateria completa só para eliminar esse dado.

## Limpeza D

LIMPEZA-D.json registra inventário exato do projeto acidental, exclusão e pós-check. protection-dos-advocacia-pre/post preservam ssoProtection all_except_custom_domains e gitForkProtection true, com protectionBypass passando de uma entrada a vazio. Evidência sustenta aceite documental da limpeza; não houve nova mutação/removal pelo CTO.

O pré-estado continha como chave o valor de um bypass já revogado. Foi sanitizado em protection-dos-advocacia-pre.json pelo CTO; não republicar a cópia não sanitizada. Nenhuma chave ativa foi rotacionada ou exposta neste parecer.

## Âncora — classificação de escopo

Falha remota reproduzida: id existe no div sr-only; navegar pelo fragmento deixa alvo acima do viewport e formulário apenas parcialmente visível. O aceite antigo permanece retirado. Entretanto, copy-final.md:45/79 e o handoff CMO especificam o link visível para #o-que-voce-recebe, não para esse identificador interno do formulário. Nenhum link interno para o alvo do formulário foi encontrado na aplicação/captura. Não existe jornada aprovada quebrada comprovada por esse teste artificial de deep link.

Classificar fragmento do título sr-only como pendência técnica não bloqueante deste lote, sem acrescentar CTA, reescrever copy ou refatorar formulário compartilhado. Confirmar no smoke final que a âncora REAL #o-que-voce-recebe e o acesso comum ao formulário funcionam. Se houver consumidor público real do fragmento do formulário, reavaliar com evidência desse consumidor.

## Handoff final ao Cursor — smoke conectado curto

Não repetir80 medições nem mudar aplicação por este parecer. No candidato2abfbeb:

1. Validar o link visível “Ver o que a análise entrega” para #o-que-voce-recebe em390/1440: heading de destino legível, sem encobrimento pelo header, e campos iniciais do formulário alcançáveis por teclado no fluxo comum. Não exigir um formulário inteiro maior que a tela dentro do viewport.
2. Usando artigos reais já identificados, confirmar no mesmo navegador autenticado um clique compacto DD, final DD, secundário compra e B2B; capturar um evento por clique, posição/slug/destino corretos e ausência de PII/link_url nos novos eventos que não o admitem. Captura local de gtag/dataLayer é instrumentação, não painel GA4. Não clicar em WhatsApp de forma que envie mensagem.
3. Sucesso/erro do formulário somente interceptados e rotulados; confirmar WhatsApp contextual e generate_lead apenas no sucesso. Sem Resend real. Reutilizar testes/provas anteriores quando comprovarem exatamente a revisão; não refazer suítes completas sem mudança.
4. Entregar checklist curto de liberação: SHA/Preview, resultados dos itens acima, alterações locais documentais pendentes de versionamento/sanitização, proposta de datas lastModified a aplicar somente no rollout efetivo. Sem commit/push/merge/deploy/env/Wix. DebugView real e métricas de campo ficam explicitamente para smoke pós-publicação autorizada; não inventar aceite do painel.

Com esse fechamento, devolver ao CTO para preparar o lote concreto de merge/release e solicitar uma única autorização de produção. PR12 permanece em rascunho até então.
