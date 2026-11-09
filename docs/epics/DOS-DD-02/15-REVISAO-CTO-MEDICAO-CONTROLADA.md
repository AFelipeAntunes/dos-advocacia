# Parecer CTO — revisão R1–R3 do QA05

07/11/2026. R1–R3 DE INSTRUMENTAÇÃO, CONTROLE E INTEGRIDADE ACEITOS. GATE DE DESEMPENHO AINDA ABERTO PARA SONDA DIRIGIDA DA LANDING.

## Conferências independentes

Foram inspecionados perf-lab-controlled.mjs, raw, summary e relatório CTO13. Observadores buffered de LCP/layout-shift/longtask antes da navegação, ausência de fallback FCP, marcação de run inválido e CLS por janela corrigidos. A fixture registrou um shift e CLS0,0581. Quarenta entradas dos três manifestos conferiram sem divergência.

Os dados atuais sustentam as medianas reportadas para due diligence: desktop232→312ms (+80ms/+34,5%) e mobile1272→1540ms (+268ms/+21,1%). Nas cinco comparações pareadas alternadas por perfil, quatro apresentam candidato mais lento, tanto no desktop quanto no mobile. Faixas se sobrepõem, mas isso por si só não elimina a piora observada. As oitenta medidas válidas não equivalem a aceite automático de desempenho.

Em todas as vinte medições da landing, o elemento LCP é o H1. O retrato não foi requisitado no carregamento frio (portraitFound=false). Portanto, esses dados não sustentam atribuir a alta de LCP à foto lazy. A carga ao rolar e a ausência de shifts continuam prova separada.

## Próxima correção dirigida — P1 gate de desempenho

Preservar a aplicação, copy e retrato aceitos enquanto diagnostica. Executar dez novas repetições por revisão e perfil apenas em /due-diligence-imobiliaria, com ordem alternada, cache frio, mesma configuração e recursos dos ambientes equivalentes. Guardar raw/medianas/pares/elemento LCP e manifestos fechados. Não repetir toda a bateria institucional.

Investigar a diferença do H1 em vez de supor causa pela foto. Rastrear navegação/documento → fonte/CSS → pintura/layout → tarefas longas, com timeline/trace suficiente para localizar o atraso. Separar efeito de fonte, layout/renderização, HTML adicional e execução cliente. Não afirmar causalidade de6KB extras apenas por correlação. Bloquear mesmos terceiros nas duas revisões.

Se a piora reaparecer, corrigir a causa local mínima com a copy e enquadramento aprovados e repetir a sonda antes/depois do fix. Se não reaparecer, documentar as duas baterias e a dispersão que justifica classificar a primeira diferença como ruído. Não apagar dados anteriores nem escolher somente a rodada melhor. Não aplicar tolerância percentual ou limiar Web Vitals como substituto do requisito de Felipe de preservar velocidade.

A alta observada na Home mobile (+92ms) permanece anotada. Só ampliar a sonda para Home se a causa localizada indicar efeito compartilhado ou se surgir nova evidência reproduzível. Não requerer rodada completa sem causa.

## Outros gates preservados

Artigos reais com CTA SSR, coleta GA4 e categoryIds/multicategoria continuam no escopo conectado do05. O diagnóstico14 registra title e H2 atuais do artigo principal confirmados em produção, e lastPublishedDate Wix13:55:08BRT. Assim, não manter o título anterior como gap atual. Quantidade/posição de links editoriais pode ser conferida em leitura sem republicação.

O retrato e os cards03/04 permanecem aceitos localmente. O pacote é base para candidato/Preview, mas este parecer não autoriza PR/push/deploy nem declara QA05 encerrado. Primeiro devolver sonda e diagnóstico dirigidos; depois solicitar operação remota concreta ainda necessária.

## Devolutiva esperada

Medidas novas, comparação pareada com a bateria atual, causa rastreada ou conclusão fundamentada de não reprodução, diff mínimo se houver correção, invariantes de copy/retrato/contato e manifestos atualizados. Relatar limitações de laboratório/INP. Sem escrita Wix ou publicação.

CTO atualizou somente documentação nesta revisão.
