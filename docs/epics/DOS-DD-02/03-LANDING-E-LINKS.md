# DOS-DD-02.03 — Landing e links institucionais

Versão 1.0. Implementação local após aceite dos cards 01/02 no alcance indicado.

## Dono e arquivos

src/legacy-pages/due-diligence-imobiliaria.html e mudanças necessárias nos HTMLs institucionais de Home, compra, nacional e Curitiba. Arquivos compartilhados de CSS/sitemap/documentação precisam de coordenação com integração. Não criar rota nova nem copiar a identidade de outro escritório.

## Critérios de aceite

- Preservar /due-diligence-imobiliaria, canonical próprio, header, footer, estilo e formulário gerado pelo mecanismo compartilhado. Uma H1 e seis perguntas H3, com FAQ visível igual ao FAQPage.
- Title, description e OG coerentes com versão editorial. Nome público e razão social vêm de src/lib/office-schema.ts, incluindo CEP e perfil oficial. LegalService com @id consistente, Service com provider por referência, areaServed Curitiba/Brasil e breadcrumb coerente com a navegação visível.
- CTAs e WhatsApp contextualizam due diligence também no botão pós-sucesso do formulário. Preservar page_slug due-diligence-imobiliaria, icp comprador, demanda existente e evento generate_lead apenas depois da resposta de sucesso.
- Reusar links existentes e ajustar âncoras conforme mapa. Conferir destinos dos três posts em 200 e sem cadeia. Preservar clusters compra/nacional/Curitiba e não alterar texto de FAQ/schema de outra landing por atalho.
- Sem novos assets, dependências ou JS cliente para layout. LCP continua disponível em SSR. Viewports 390 e 1440, mais intermediário 768/1000, sem overflow ou regressão do menu/rodapé/formulário.
- Registrar lastModified só com data efetiva no release. Preview não comprova data de produção.

Rodar typecheck/build e testes específicos de contato/navegação afetados. Capturas desktop/mobile e prova DOM de metadata/schema/FAQs/links. Nenhum envio real de e-mail/WhatsApp é necessário para teste local, usar interceptação rotulada. Gate CTO antes da integração.

## Regras de execução e devolutiva

Leia AGENTS.md, PROJECT_CONTEXT.md, docs/ARCHITECTURE.md e 00-EPICO.md no checkout escolhido. Confirme origin/main, branch, status e conflitos com outros agentes. Este pacote autoriza planejamento e delimita o trabalho futuro. Felipe encaminha os cards e devolve as entregas para review do CTO. Não pressupor aprovação editorial pelo recebimento do handoff.

Use uma branch temporária por frente e worktree dedicado baseado no origin/main vigente. O checkout principal contém trabalho acumulado. Não copiar sua árvore inteira para uma branch nova. Não alterar arquivos de outro agente. Não encerrar processos por nome. Scripts de browser usam perfil próprio e encerram apenas o PID criado.

Commit, push, PR, merge, deploy, env e operações Wix exigem autorização concreta de Felipe. O card de publicação descreve os atos, sem autorizá-los por si. Reutilize a integração Wix/Vercel e o domínio existentes. Preserve os slugs e o conteúdo editorial publicado fora do escopo aprovado.

Devolva card/versão, checkout, branch, SHA/base e estado inicial/final, causa rastreada, arquivos/diff, provas reproduzíveis, testes antes/depois, gaps, decisões e hashes das entregas. Diferencie fixture, build local, Preview e produção. Declare operações externas e commit/push/PR realizados ou ausentes. Termine com o gate solicitado ao CTO. Falta de credencial local não prova indisponibilidade de conector.


## Atualização CTO de 07/11/2026

Aplicar a copy consolidada da versão nova do CMO. Os dois avisos anteriores de confirmação foram superados. O parecer08 permite esta frente após consolidação do02, enquanto a prova de multicategoria é complementada separadamente. Corrigir links existentes conforme mapa auditado, sem duplicação.


## Aceite CTO do card02 em 07/11/2026

Parecer09-ACEITE-CTO-COPY-CARD02.md aceita copy-final.md v1.0 (SHA-256 9af22a5932ff9a15f96b1354cdb9f6431d60f0b19a17f7573a2b34c1a00e7165). Implementação local liberada conforme os escopos e dependências dos pareceres08/09. Nenhum novo aceite das duas confirmações editoriais é necessário.
