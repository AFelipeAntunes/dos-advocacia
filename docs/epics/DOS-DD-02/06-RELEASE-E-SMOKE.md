# DOS-DD-02.06 — Release e fechamento

Versão 1.0. Preparar após QA, executar só com autorização explícita de Felipe sobre candidato identificado.

## Ordem

1. Apresentar SHA, copy/decisões, checks, QA/performance, projeto/ambiente e reversão mínima. Conferir produção e PRs atuais.
2. Atualizar lastModified da landing e de outras rotas com mudança substancial usando a data real planejada para a publicação. Revalidar o diff/teste. Se o dia mudar, corrigir antes de publicar.
3. Abrir PR temporária para main conforme fluxo DOS autorizado. Sem push direto em main e sem bypass. Merge/deploy dependem da autorização do lote.
4. Confirmar Vercel Ready/Production no projeto oficial, SHA e domínio. Smoke público landing e artigos reais, metadata/schema, FAQs H3, navegação, formulário/WhatsApp, blocos por posição e sitemap.
5. Repetir Teste de pesquisa aprimorada nas páginas afetadas. Solicitar indexação da URL existente atualizada e enviar sitemap no Search Console com sessão autorizada. Distinguir solicitado, processado e indexado. Não prometer indexação.
6. Verificar a propagação automática normal do cache. Não repetir escrita CMS para corrigir cache. Qualquer revalidação ou fallback externo deve ter escopo autorizado.
7. Guardar evidência e atualizar PROJECT_CONTEXT.md, docs/ARCHITECTURE.md e índice do épico com estado final por card e pendências reais.

Reversão usa o commit anterior identificado e autorização de Felipe. Não apagar posts, rascunhos, categorias, chaves, branches ou deploys para limpeza automática.

## Resultado

Devolutiva ao CTO e ao CMO separa publicado, testado e medição futura. Registrar data efetiva, SHA, ambiente, URLs e limitações. Comparação local não fecha INP/campo.

## Regras de execução e devolutiva

Leia AGENTS.md, PROJECT_CONTEXT.md, docs/ARCHITECTURE.md e 00-EPICO.md no checkout escolhido. Confirme origin/main, branch, status e conflitos com outros agentes. Este pacote autoriza planejamento e delimita o trabalho futuro. Felipe encaminha os cards e devolve as entregas para review do CTO. Não pressupor aprovação editorial pelo recebimento do handoff.

Use uma branch temporária por frente e worktree dedicado baseado no origin/main vigente. O checkout principal contém trabalho acumulado. Não copiar sua árvore inteira para uma branch nova. Não alterar arquivos de outro agente. Não encerrar processos por nome. Scripts de browser usam perfil próprio e encerram apenas o PID criado.

Commit, push, PR, merge, deploy, env e operações Wix exigem autorização concreta de Felipe. O card de publicação descreve os atos, sem autorizá-los por si. Reutilize a integração Wix/Vercel e o domínio existentes. Preserve os slugs e o conteúdo editorial publicado fora do escopo aprovado.

Devolva card/versão, checkout, branch, SHA/base e estado inicial/final, causa rastreada, arquivos/diff, provas reproduzíveis, testes antes/depois, gaps, decisões e hashes das entregas. Diferencie fixture, build local, Preview e produção. Declare operações externas e commit/push/PR realizados ou ausentes. Termine com o gate solicitado ao CTO. Falta de credencial local não prova indisponibilidade de conector.
