# Search Console — validação recebida em09/11/2026

## Fonte e alcance

Planilha original preservada: C:\Users\Felipe Antunes\Downloads\dosadvocacia.com.br-Coverage-Validation-2026-11-09.xlsx. SHA256775af4d5533f80a4d05d70edde5cec713584591d26e93191f40bb4042d0de833. Aba Tabela A2:C29:28 URLs,26 Pendente e2 Falha. Aba Metadados B2: Rastreada, mas não indexada no momento; B3: Todas as páginas conhecidas. O email não declara falha de todas as páginas do site. Nenhuma mutação no arquivo.

Os dois itens Falha são Tabela A28:C29, ambos com último rastreamento07/11/2026. Os26 restantes continuam Pendente no export, não são26 falhas comprovadas.

## Conferência pública09/11

Sondas HTTP comuns, não Googlebot/URL Inspection. Dados em evidencias/gsc-validacao-20261109/public-checks.json.26 URLs consultadas; dois endpoints técnicos antigos de _api deliberadamente não consultados, inclusive access-tokens.

| Grupo do export | Resultado atual | Conduta |
| --- | --- | --- |
|2 Falha: terreno de marinha e falecimento do locador|200, HTML com conteúdo, canonical próprio, sem noindex na resposta; ambos aparecem em /blog mas faltam no sitemap público|Investigar sincronização sitemap/cache e URL Inspection de cada artigo|
|8 posts Pendente ainda atuais|200 e presentes no sitemap|Não tratar como erro técnico comprovado nem refazer conteúdo às cegas; examinar seleção canônica/último rastreio no GSC|
|14 URLs Pendente antigas (9 posts,2 categorias,3 páginas antigas de compradores)|301 em um salto para destino200, ausentes do sitemap|Preservar redirects; não republicar origens para indexá-las|
|site.webmanifest Pendente|200, tipo manifest, fora do sitemap|Não é página editorial cuja indexação seja objetivo|
|blog-feed.xml Pendente|404/noindex e fora do sitemap|Não recriar feed apenas para satisfazer índice; necessidade de consumidor continua questão funcional separada|
|2 URLs _api antigas|fora do sitemap, sondagem omitida|Não solicitar indexação de endpoints técnicos|

Sitemap público atual:121 URLs. Preview fp0125m2c conferido em08/11 tinha123 URLs/108 posts. robots.txt permite / e declara sitemap oficial; não foi identificado bloqueio global de rastreamento nas sondas.

### Falhas prioritárias

- https://www.dosadvocacia.com.br/post/imovel-em-terreno-de-marinha — title Imóvel em terreno de marinha: laudêmio e risco na compra; canonical próprio; HTML200; fora do sitemap.
- https://www.dosadvocacia.com.br/post/falecimento-do-locador-a-imobiliária-continua-repassando — title Falecimento do locador e a administração do imóvel alugado; canonical próprio codificado no HTML;200; fora do sitemap.

Ausência no sitemap é uma divergência observável, não causa demonstrada de não indexação. Ambos têm links no /blog; falta de descoberta não pode ser inferida. Código atual de revalidação manual e webhook já chama revalidateTag(wix-blog) e revalidatePath(/sitemap.xml); não há justificativa para criar outra integração antes de verificar execução real/cache.

## Próxima ação de diagnóstico, sem mutação

Na propriedade oficial do Search Console, inspecionar individualmente os dois artigos: razão atual, última captura, indexação permitida, canonical declarado/escolhido pelo Google e sitemap detectado. Separar resultado indexado do teste ao vivo. Consultar registros do webhook/revalidação e estado servido do sitemap. Se sincronização for corrigida pelo rollout autorizado da PR12, confirmar presença dos dois artigos no smoke antes de reenviar o sitemap. Se exigir revalidação operacional antes do rollout, executar somente pelo fluxo autenticado existente e dentro de autorização operacional específica; não criar chave, publicar site nem mudar robots.

Não reiniciar validação global ou solicitar indexação de todas as28 URLs sem essa classificação. Atualizar conteúdo/Wix depende de diagnóstico e aceite editorial. Nenhuma garantia de indexação ou prazo.

## Fontes oficiais

- https://support.google.com/webmasters/answer/7440203?hl=en — status Crawled/currently not indexed e validação de problemas.
- https://support.google.com/webmasters/answer/9012289?hl=en — distinguir inspeção da versão indexada do teste ao vivo; solicitação não garante inclusão.

Somente leitura pública/arquivo e documentação nesta análise. Sem Search Console write, revalidação, Wix, commit, deploy ou produção.
