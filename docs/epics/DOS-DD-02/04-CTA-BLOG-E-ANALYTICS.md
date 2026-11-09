# DOS-DD-02.04 — CTA SSR e medição

Versão 1.0. Uma única frente para classificador, renderer e eventos. Matriz 01 aceita é requisito.

## Arquivos a inspecionar

blog-service-cta.tsx, wix-rich-content.tsx, blog-cta-tracker.tsx, post/[slug]/page.tsx, lib/wix/blog-navigation.ts, lib/wix/rich-content.ts e lib/analytics/ga4.ts. Estilos restritos a classes do bloco. Evitar abstração paralela ao parser existente.

## Critérios de aceite

- Assessoria para Imobiliárias mantém o bloco final B2B atual. Due Diligence elegível recebe compacto e final. Contratos recebe os novos blocos só para comprador comprovado, com link secundário de compra no final. Persona desconhecida, Litígios e sem categoria ficam sem bloco novo.
- Aplicar precedência multicategoria aceita pelo CTO e exibir no máximo um bloco por posição. Não usar só getPostCategory para decidir persona. Resolver IDs das categorias pelo catálogo Wix, sem depender do nome exibido.
- Compacto após terceiro parágrafo elegível conforme contrato 01. Fallback textual também coberto. Conteúdo curto preserva bloco final. Não alterar bytes editoriais no Wix nem inserir CTA dentro da FAQ/Leia também, nem alterar extração de FAQ e relacionados.
- Cada bloco tem identificador HTML único. O tracker atende múltiplos blocos, cliques em texto e elementos filhos, montagem/desmontagem e navegação entre posts. Clique em CTA injetado dentro de article__content gera exatamente um evento pelo escopo correto.
- Manter nomes click_cta_servico e click_whatsapp. Para serviço enviar post_slug, destino e cta_position. Proposta meio_artigo/fim_artigo aceita no contrato, sem novo parâmetro desnecessário. WhatsApp usa cluster e posição apropriados. Não enviar mensagem, telefone pessoal, texto jurídico ou URL com payload do WhatsApp.
- Registrar a compatibilidade com link_url histórico do tracker atual e a decisão de privacidade da mudança. Não alterar séries de outros fluxos silenciosamente. Links editoriais comuns mantêm meio, B2B final mantém fim_artigo e relacionados geram zero eventos de serviço.
- SSR em todos os blocos. Sem alteração de schema BlogPosting, canonical, SEO title, conteúdo e sem nova consulta CMS por bloco.

Testes exigidos para regressões específicas do novo comportamento: gating/precedência, SSR, três parágrafos e conteúdo curto, FAQ/Leia também, IDs únicos e um evento por clique/posição. Fixture sozinha não fecha a integração real. Devolver inventário de JS/CSS e comparação de chunks.

## Regras de execução e devolutiva

Leia AGENTS.md, PROJECT_CONTEXT.md, docs/ARCHITECTURE.md e 00-EPICO.md no checkout escolhido. Confirme origin/main, branch, status e conflitos com outros agentes. Este pacote autoriza planejamento e delimita o trabalho futuro. Felipe encaminha os cards e devolve as entregas para review do CTO. Não pressupor aprovação editorial pelo recebimento do handoff.

Use uma branch temporária por frente e worktree dedicado baseado no origin/main vigente. O checkout principal contém trabalho acumulado. Não copiar sua árvore inteira para uma branch nova. Não alterar arquivos de outro agente. Não encerrar processos por nome. Scripts de browser usam perfil próprio e encerram apenas o PID criado.

Commit, push, PR, merge, deploy, env e operações Wix exigem autorização concreta de Felipe. O card de publicação descreve os atos, sem autorizá-los por si. Reutilize a integração Wix/Vercel e o domínio existentes. Preserve os slugs e o conteúdo editorial publicado fora do escopo aprovado.

Devolva card/versão, checkout, branch, SHA/base e estado inicial/final, causa rastreada, arquivos/diff, provas reproduzíveis, testes antes/depois, gaps, decisões e hashes das entregas. Diferencie fixture, build local, Preview e produção. Declare operações externas e commit/push/PR realizados ou ausentes. Termine com o gate solicitado ao CTO. Falta de credencial local não prova indisponibilidade de conector.


## Atualização CTO de 07/11/2026

O contrato técnico vinculante está no parecer08. cta_variant não é parâmetro aprovado. WhatsApp novo usa fim_artigo. Links editoriais embutidos não constituem corte automático nem suprimem o compacto. Matriz pública não prova exclusividade de categoria. Artigo principal é elegível e a propagação da revisão informada fica para conferência CMS/site antes do05.


## Aceite CTO do card02 em 07/11/2026

Parecer09-ACEITE-CTO-COPY-CARD02.md aceita copy-final.md v1.0 (SHA-256 9af22a5932ff9a15f96b1354cdb9f6431d60f0b19a17f7573a2b34c1a00e7165). Implementação local liberada conforme os escopos e dependências dos pareceres08/09. Nenhum novo aceite das duas confirmações editoriais é necessário.
