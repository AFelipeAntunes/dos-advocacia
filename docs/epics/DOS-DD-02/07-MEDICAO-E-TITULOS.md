# DOS-DD-02.07 — Registro de experimentos e acompanhamento

Versão 1.0. Não executar mudanças em massa de títulos ou conteúdo.

## Registro do CMO recebido em 07/11

Dados declarados para 04/08–03/11/2026: 416 cliques totais, cerca de400 no blog, consulta due diligence180impressões/posição73,5, landing308impressões/posição69,8/1clique, quatro formulários90dias. Fonte HANDOFF-ORIGINAL-CMO.md. Export/painéis não verificados pelo CTO nesta preparação.

Cinco títulos relatados como publicados em 06/11 via UPDATE_PUBLISH. Registrar prefixos de ID e título novo conforme original, resolver identidades completas por leitura e preservar SEO title/slug/body/description. O site usa o SEO title habilitado sem acrescentar sufixo quando há override. Não remover sufixo automaticamente por supor que o site sempre acrescenta marca.

Registrar evidência de leitura CMS versus title público e propagação. Não repetir publicação. A indicação de 68 titles longos e27sufixos é inventário declarado, sujeito a validação. Mais de60caracteres por si não constitui defeito técnico nem autoriza truncamento.

## Janelas e atribuição

Para os títulos, comparar 07/11–04/12/2026 (28dias após a alteração) com 09/10–05/11/2026 (28dias anteriores), excluindo06/11 de transição. O CMO pode manter outra janela, desde que mesma duração e datas explícitas. Não usar os totais de90dias como baseline de28dias.

Para a landing e os CTAs, a janela começa na data real do deploy, com leitura em4–6semanas. Registrar alterações simultâneas por artigo e data (titles, CTA, categoria e reescrita pelo CMO) para não atribuir todo efeito a uma única ação.

Medir consultas e páginas separadas, CTR/impressões/cliques, artigos com CTA→landing, WhatsApp e generate_lead com página de origem, compactos versus finais via cta_position e manutenção dos artigos B2B. Denominadores e volume devem constar da análise. Não afirmar causalidade só por melhora agregada.

## Entregas

Log de cinco testes de título em PROJECT_CONTEXT.md com data e fonte, plano de mensuração e relatório no fim da janela. Revisão do post informativo pelo CMO (prefixo2bef3905) depende de versão aprovada, backup CMS, operação autorizada e verificação própria. Limpeza em lote dos outros titles depende de aprovação Drielle e card separado.

## Regras de execução e devolutiva

Leia AGENTS.md, PROJECT_CONTEXT.md, docs/ARCHITECTURE.md e 00-EPICO.md no checkout escolhido. Confirme origin/main, branch, status e conflitos com outros agentes. Este pacote autoriza planejamento e delimita o trabalho futuro. Felipe encaminha os cards e devolve as entregas para review do CTO. Não pressupor aprovação editorial pelo recebimento do handoff.

Use uma branch temporária por frente e worktree dedicado baseado no origin/main vigente. O checkout principal contém trabalho acumulado. Não copiar sua árvore inteira para uma branch nova. Não alterar arquivos de outro agente. Não encerrar processos por nome. Scripts de browser usam perfil próprio e encerram apenas o PID criado.

Commit, push, PR, merge, deploy, env e operações Wix exigem autorização concreta de Felipe. O card de publicação descreve os atos, sem autorizá-los por si. Reutilize a integração Wix/Vercel e o domínio existentes. Preserve os slugs e o conteúdo editorial publicado fora do escopo aprovado.

Devolva card/versão, checkout, branch, SHA/base e estado inicial/final, causa rastreada, arquivos/diff, provas reproduzíveis, testes antes/depois, gaps, decisões e hashes das entregas. Diferencie fixture, build local, Preview e produção. Declare operações externas e commit/push/PR realizados ou ausentes. Termine com o gate solicitado ao CTO. Falta de credencial local não prova indisponibilidade de conector.


## Atualização CTO de 07/11/2026

A auditoria01 confirmou os cinco titles públicos de06/11, sem republicação. A revisão do artigo principal declarada no novo handoff ainda diverge da resposta pública conferida pelo CTO. Registrar separadamente data CMS relatada e data da propagação comprovada; não misturar a intervenção com o experimento dos cinco títulos.
