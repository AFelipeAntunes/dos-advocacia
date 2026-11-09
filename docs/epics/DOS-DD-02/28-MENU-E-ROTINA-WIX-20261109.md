# Due diligence no submenu e rotina editorial Wix

## Pedido e implementação local

Felipe pediu incluir a landing no submenu Áreas de atuação. Base origin/main `749fbfc8e08e559b189de7ad349ff6561032ea9c`, branch `fix/due-diligence-menu-20261109`, worktree isolado `.dos-dd-menu-20261109`.

`institutionalLinks` em `src/lib/legacy-navigation.ts` recebeu Due diligence imobiliária → `/due-diligence-imobiliaria`, após Compra de imóvel. A fonte compartilhada também oferece o link na coluna de navegação do rodapé, sem duplicá-lo quando já existir. Mantidas seis entradas principais; submenu passa de quatro para cinco destinos. A landing recebe aria-current no novo item. Sem CSS/JS cliente/dependências novos.

## Prova

Navegação 18/18 antes e depois, incluindo quinze HTMLs reais e ausência de duplicatas. Ajustado o caso da landing e a expectativa independente do submenu. Typecheck limpo. Primeiro build impedido por EPERM do sandbox ao criar arquivos gerados; repetição fora do sandbox aprovada, 23/23 rotas. Nenhuma correção de aplicação foi necessária para o EPERM.

Build servido localmente: desktop 1280 e mobile390, submenu aberto, link correto e aria-current=page, zero overflow horizontal; link mobile visível entre y321,96 e368,67 em viewport390×844. Evidências em `evidencias/07-menu-20261109/`. Não são capturas de produção. Sem nova bateria LCP: alteração de marcação apenas, sem novo recurso de cliente; não apresentar isso como medição de campo.

## Atualização editorial versus Google

O fluxo previsto dispensa intervenção técnica para cada publicação no Wix. O handler assinado `/api/webhook/wix-blog` invalida tag Wix, blog, artigos e sitemap; conteúdo é relido da API. Blog e artigos declaram revalidate=3600 (ISR sob demanda, não cron e sem prazo máximo rígido). O sitemap não declara intervalo periódico próprio: a atualização por evento é relevante para novas URLs, não presumir que ele se atualiza sozinho a cada hora.

O diagnóstico14 confirmou texto público atualizado, mas não comprovou entrega do evento real nem sua causa de atraso. Não afirmar, com base somente no código, que toda entrega automática foi validada. Próxima publicação editorial legítima pode servir para conferir evento e aparecimento no blog/sitemap, sem republicar apenas para teste ou alterar subscriptions/chaves nesta tarefa. Revalidação manual é contingência, não rotina para a redatora.

Indexação é outra etapa: Google decide quando rastrear e incluir. Pedir rastreamento não garante indexação e solicitações repetidas não aceleram o processo. Fonte oficial: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl . Nenhuma garantia de indexação foi dada.

## Gate

Pronto localmente, sem commit/push/PR/merge/deploy deste ajuste. AGENTS.md exige autorização explícita para essas operações. Publicação da PR12 anterior não cobre automaticamente este novo lote. Documentação pós-release27 permanece local no checkout anterior e no principal; preservada.

## Autorização de publicação
Felipe autorizou explicitamente commit, push, PR, merge e publicação deste lote em09/11/2026, após revisar a prévia local. O estado anterior do Gate acima é histórico; operação em curso, registrar resultado após deploy.

