# DOS-DD-02.01 — Auditoria em leitura

Versão 1.0. Não implementar landing, CTA, analytics nem alterar Wix.

## Trabalho

1. Confirmar SHA publicado e main. Capturar title, description, OG, canonical, H1-H3, schema, links, CTA e campos de origem do formulário da landing atual.
2. Inventariar links existentes vindos de Home, compra, nacional, Curitiba e artigo principal. Distinguir link existente, texto a ajustar e link ausente.
3. Ler categorias e artigos Wix com conector disponível ou fonte pública, sem expor credenciais. Resolver IDs completos e slugs exatos dos sete posts listados pelo CMO, dos três destinos editoriais da landing e do artigo principal (prefixo 2bef3905).
4. Entregar CSV com id, slug, categorias IDs, persona, prova do público/trecho, elegibilidade, bloco atual/novo, precedência multicategoria e justificativa. Incluir Contratos B2B/B2C, Due Diligence + Assessoria, desconhecida, sem categoria e Litígios. Não recategorizar artigo para satisfazer o teste.
5. Definir operacionalmente o terceiro parágrafo como terceiro bloco textual de corpo renderizado, não vazio. Excluir headings, lista editorial representada de modo distinto, imagem e blockquote. Não inserir no meio de FAQ, Leia também ou contato. Com menos de três parágrafos elegíveis anteriores a essas seções, manter só bloco final. Propor ajuste se o contrato real do parser exigir e obter aceite CTO.
6. Capturar inventário técnico de JS/CSS/imagens, método de performance anterior e provas do Rich Content/fallback. Identificar testes existentes e contagem base.
7. Conferir em leitura os cinco títulos relatados em 06/11, com data/fonte. Ausência de prova gera gap, não pedido de republicação.

## Entregas e aceite

relatorio-auditoria.md, matriz-artigos.csv, mapa-links.md, contrato-cta.md e evidências com data/identidade/fonte. Cada novo CTA deve ter decisão de elegibilidade comprovada. Gate CTO sobre matriz, precedência e ponto de inserção. Nenhuma escrita externa.

## Regras de execução e devolutiva

Leia AGENTS.md, PROJECT_CONTEXT.md, docs/ARCHITECTURE.md e 00-EPICO.md no checkout escolhido. Confirme origin/main, branch, status e conflitos com outros agentes. Este pacote autoriza planejamento e delimita o trabalho futuro. Felipe encaminha os cards e devolve as entregas para review do CTO. Não pressupor aprovação editorial pelo recebimento do handoff.

Use uma branch temporária por frente e worktree dedicado baseado no origin/main vigente. O checkout principal contém trabalho acumulado. Não copiar sua árvore inteira para uma branch nova. Não alterar arquivos de outro agente. Não encerrar processos por nome. Scripts de browser usam perfil próprio e encerram apenas o PID criado.

Commit, push, PR, merge, deploy, env e operações Wix exigem autorização concreta de Felipe. O card de publicação descreve os atos, sem autorizá-los por si. Reutilize a integração Wix/Vercel e o domínio existentes. Preserve os slugs e o conteúdo editorial publicado fora do escopo aprovado.

Devolva card/versão, checkout, branch, SHA/base e estado inicial/final, causa rastreada, arquivos/diff, provas reproduzíveis, testes antes/depois, gaps, decisões e hashes das entregas. Diferencie fixture, build local, Preview e produção. Declare operações externas e commit/push/PR realizados ou ausentes. Termine com o gate solicitado ao CTO. Falta de credencial local não prova indisponibilidade de conector.
