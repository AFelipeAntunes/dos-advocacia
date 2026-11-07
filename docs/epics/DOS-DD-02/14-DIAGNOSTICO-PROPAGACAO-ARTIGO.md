# Diagnóstico de propagação do artigo principal

Consulta de07/11/2026, solicitada por Felipe. Não foi realizada escrita CMS, publicação ou alteração de configuração.

## Resultado comprovado

GET público retornou200 com title “O que é due diligence imobiliária e o que ela verifica” e H2 “Perguntas frequentes sobre due diligence imobiliária”. Esses valores já estavam corretos antes de qualquer revalidação manual nesta sessão.

GET Post Wix via conector retornou200 para2bef3905-1bef-411f-8dc5-356a9c4ef189, slug preservado, lastPublishedDate2026-11-07T16:55:08.221Z (13:55:08 em São Paulo) e hasUnpublishedChanges=false. Display title diferente do SEO title é comportamento esperado do código.

## Ações solicitadas e limites

1. POST /api/revalidate/wix-blog autorizado pelo usuário, mas não executado. O código aceita Bearer ou x-revalidation-secret e exige WIX_REVALIDATION_SECRET. Nenhum.env.local foi encontrado nos três checkouts examinados. A variável existe como Secret Production no painel Vercel, com Copy to Clipboard desabilitado. Não foi rotacionada, revelada ou exposta.
2. Logs13h54 não confirmados. A consulta pelo conector Vercel retornou403 no time dos-advocacia. A recuperação authorize_team_access retornou404 Team not found. A sessão autenticada do navegador abriu os Request Logs do projeto correto, porém o intervalo local13:44–14:04 foi recusado como Outside of allowed range. Não interpretar falta de acesso como ausência de entrega.
3. Não comprovado que o webhook não chegou. Configuração ativa e entrega no painel do app Wix ainda não verificadas. Documentação Post Updated diz que dispara quando um post é atualizado, sem filtro editor/API documentado nessa página. Não inventar chave de ativação “somente API” ou causa raiz.
4. Valores públicos solicitados confirmados.

## Continuidade

O gap de propagação divergente do parecer08/13 foi superado quanto aos dois campos públicos. A origem do atraso permanece aberta. Fechar apenas com acesso seguro ao token em ambiente operacional autorizado e histórico do webhook/app, ou novo teste autorizado de entrega. Não republicar o post apenas para testar nem alterar subscriptions/chaves sem autorização de configuração.

Fontes do contrato:
https://dev.wix.com/docs/api-reference/business-solutions/blog/posts-stats/get-post
https://dev.wix.com/docs/api-reference/business-solutions/blog/posts-stats/post-updated
Código em src/app/api/revalidate/wix-blog/route.ts, src/app/api/webhook/wix-blog/route.ts e src/lib/wix/revalidation.ts.
