# DOS-DD-02 — integração autorizada em 07/11/2026

Felipe autorizou commit, push, abertura de PR e geração do Preview após o parecer17. Merge e produção não autorizados nesta etapa. Nenhuma mudança de ambiente, domínio, credencial ou Wix incluída nessa autorização.

## Revisão local preparada

- Worktree `.dos-dd-02-04-cta`, branch `qa/dos-dd-02-05`, base e origin/main `7fec6b2fb2da7dc5408498099e7c4917aa33bb4d` sem divergência no preflight.
- Zero PRs abertas no repositório no preflight.
- 114 testes: redirects8, navegação18, sitemap17, Wix56, analytics4, contato11. Mesmas contagens da árvore entregue, sem testes adicionados pelo CTO nesta preparação.
- Typecheck aprovado; build23/23 aprovado. Primeira execução no sandbox falhou com EPERM em mkdir da pasta .next; repetição do mesmo build fora do sandbox passou.
- git diff --check limpo. Nenhuma dependência ou lockfile alterados; package.json somente inclui o teste do tracker no script Wix.
- Escopo técnico/copy/retrato aceitos nos pareceres anteriores. Mobile +54ms na sonda final segue gate aberto.

## Integração em andamento

PR/commit/Preview serão identificados no fechamento. A configuração e credenciais Wix existentes devem ser reutilizadas. Conector Vercel retornou403 para a equipe DOS; dashboard do projeto oficial continua acessível na sessão autenticada do navegador.

Não considerar o build sem Wix local como integração CMS real. Não marcar formulário interceptado como envio Resend, nem laboratório como INP de campo.

## Primeiro Preview confirmado

- Commit de aplicação `74293feef7299bae3997d21853c4fe3d1a7ec710`, autor AFelipeAntunes <a.felipe@outlook.com>.
- PR12 em rascunho: https://github.com/AFelipeAntunes/dos-advocacia/pull/12. Checks Vercel e Preview Comments em SUCCESS.
- Deployment `dpl_knHB4YHjBhQryQQckrpiSSRkjcEw`, Ready, Preview, build26s: https://dos-advocacia-keu822p1e-dos-advocacia.vercel.app.
- Production no dashboard permanece `7fec6b2`, deployment `Bg7sFjDin4Pv8zcPqC3ptbjU8wWN`. Nenhum merge ou promoção.
- Avisos remotos: npm cache-dir desconhecido e script de instalação esbuild não coberto por allowScripts. Build concluiu; nenhuma mudança de política ou dependência aplicada.

## Integração real confirmada nesta sessão

No navegador autenticado, landing com title aprovado, H1, LegalService.legalName, Service/provider e FAQPage. Form page_slug due-diligence-imobiliaria. Os três destinos editoriais da landing abriram como artigos reais.

Habite-se: compacto após três parágrafos de corpo, um compacto e um completo. Cessão: compacto/completo e link adicional de compra presentes.

Leitura somente via conector Wix: 108 posts publicados coletados em três páginas, quatro categorias, três multicategoria reais, zero posts sem categoria. Identidades em evidencias/05-qa/preview-pr12-categorias-wix-20261107.json. Primeiro pedido de posts foi rejeitado por falta de paging.limit explícito; pedido corrigido conforme validação da API, sem mutação.

- Garantia do fiador: Assessoria + Contratos, só CTA B2B, nenhum DD.
- Distrato na planta e Multipropriedade: DD + Contratos, um compacto e um completo DD em cada artigo.

Isso substitui o gap de identificação dos três multicategoria. Não prova combinação Assessoria+DD que não existe nesse catálogo; essa combinação segue coberta por fixture.

## Gaps concretos

1. Landing canonical correto, mas canonical de artigos do Preview usa o host antigo dos-advocacia-git-preview-wix-blog-validation-dos-advocacia.vercel.app. Metadata relativa do artigo resolve pelo metadataBase/SITE_URL existente. Solicitada autorização específica para override SITE_URL apenas na branch qa/dos-dd-02-05; nada alterado até resposta.
2. HTTP automatizado ao Preview retorna302 para SSO. Navegador interno autenticado abre as páginas. Sem desativar proteção ou exportar cookies. Comparação de desempenho controlada não executada remotamente; gate mobile continua aberto.
3. A consulta de dataLayer/gtag pelo escopo de leitura do navegador não demonstrou eventos; isso não comprova defeito da instrumentação. Não atribuir sucesso de GA4 a esta sessão. Testes comportamentais locais passaram, mas GA4/DebugView real segue pendente.

Sem alterações de Wix, credenciais, variáveis, domínio ou Production até este registro.
