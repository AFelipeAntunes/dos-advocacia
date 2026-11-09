# PR12 — rollout autorizado em09/11/2026

Felipe autorizou merge, publicação, atualização dos lastModified no rollout e smoke/revalidação do sitemap se necessária. Domínio, DNS, credenciais e conteúdo Wix não fazem parte desta mudança.

## Preflight

PR12 main←qa/dos-dd-02-05, base7fec6b2 e candidatof5f3d7e conferidos; PR sem conflito. Preview oficial6jyj6gmyb conferido, âncora remota aprovada. Gates locais/Preview dos pareceres23–25 preservados.

Cinco rotas recebem lastModified2026-11-09 no rollout autorizado: /, /due-diligence-imobiliaria, /assessoria-juridica-compra-de-imovel, /advogada-imobiliaria e /advogada-imobiliaria-curitiba. Outras rotas e datas Wix preservadas. Publicação ainda em andamento no momento deste registro; registrar resultado efetivo após deploy.

## Verificações do rollout

Confirmar commit final/checks, merge por PR sem bypass e deployment Production do projeto oficial dos-advocacia/dos-advocacia. Smoke HTTP/metadata/schema, âncora, CTAs em artigos reais e sitemap/robots no domínio oficial. Os dois artigos do relatório GSC (marinha/falecimento) precisam aparecer no sitemap após o build ou revalidação autorizada. Não reiniciar validação global no Search Console por este aceite.

Formulário real e DebugView não se confundem com testes interceptados; respeitar autorização de envio real e declarar limitações se o painel não estiver acessível. INP de campo depende de tráfego posterior.

## Reversão

Referência estável anterior7fec6b2. Diante de falha crítica, registrar URL/status/log sem secretos e interromper o encerramento. Qualquer rollback deve respeitar o escopo de autorização operacional; não alterar Wix/DNS para remediar problema de deploy.
