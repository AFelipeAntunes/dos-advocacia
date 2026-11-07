# DOS-DD-02.05 — Integração e QA do candidato

Versão 1.0. Executar após review das frentes 03/04.

## Trabalho e provas

Integrar somente diffs aceitos em branch candidata com SHA identificável e main atualizado. Inspecionar PRs concorrentes. Commit/push/Preview só quando autorizados. Reutilizar projeto oficial dos-advocacia/dos-advocacia e credenciais existentes.

Reexecutar suítes relevantes do package.json (Wix, analytics, contato, navegação, sitemap, redirects), typecheck e build. Registrar antes/depois com base idêntica. Artigos reais B2C/B2B/multicategoria e amostra dos sete prioritários precisam de prova em Preview conectado, sem alterar categorias para fabricar aprovação.

Conferir toda a cadeia artigo → serviço → formulário/sucesso/WhatsApp. Eventos com interceptação provam contrato de emissão, não coleta GA4 no painel. Não fazer contatos reais de clientes. Registrar gaps de acesso de modo específico.

Capturas 1440/390 e verificação 768/1000, FAQ por teclado, links, IDs e console. Uma H1, canonical, metadata, JSON-LD, breadcrumb e seis FAQs consistentes. Preservar Leia também e não duplicar relacionados.

Comparar main publicado e candidato com builds produção, Chrome/perfil isolado, mesma máquina, ordem alternada, cinco execuções por página/perfil com cache frio. Separar cache quente se usado. Mobile 390x844 DPR2 CPU4x, 1,6Mbps down / 750kbps up / 150ms RTT; desktop1440x900 sem throttling. Incluir landing due diligence, Home, landing imobiliárias como controle, artigo comprador real, B2B e multicategoria.

Coletar LCP, CLS, TTFB, long tasks brutas e janela do proxy de bloqueio, recursos/JS/CSS/imagens. Não chamar o proxy de TBT Lighthouse ou INP. Identificar SHA e origem de cada amostra. Se houver piora, repetir sonda dirigida para separar ruído de regressão e rastrear custo novo. Nenhuma tolerância de 10% ou 50ms é autorização automática para lentidão. Regressão reproduzível volta ao executor.

## Aceite

Relatório consolidado, resultados brutos e scripts reproduzíveis, baseline identificada, mapa de gaps e decisão CTO. Usar catálogo real quando houver credencial, sem afirmar que fixture ou artigo404 representa o fluxo publicado. Não liberar release por build verde isolado.

## Regras de execução e devolutiva

Leia AGENTS.md, PROJECT_CONTEXT.md, docs/ARCHITECTURE.md e 00-EPICO.md no checkout escolhido. Confirme origin/main, branch, status e conflitos com outros agentes. Este pacote autoriza planejamento e delimita o trabalho futuro. Felipe encaminha os cards e devolve as entregas para review do CTO. Não pressupor aprovação editorial pelo recebimento do handoff.

Use uma branch temporária por frente e worktree dedicado baseado no origin/main vigente. O checkout principal contém trabalho acumulado. Não copiar sua árvore inteira para uma branch nova. Não alterar arquivos de outro agente. Não encerrar processos por nome. Scripts de browser usam perfil próprio e encerram apenas o PID criado.

Commit, push, PR, merge, deploy, env e operações Wix exigem autorização concreta de Felipe. O card de publicação descreve os atos, sem autorizá-los por si. Reutilize a integração Wix/Vercel e o domínio existentes. Preserve os slugs e o conteúdo editorial publicado fora do escopo aprovado.

Devolva card/versão, checkout, branch, SHA/base e estado inicial/final, causa rastreada, arquivos/diff, provas reproduzíveis, testes antes/depois, gaps, decisões e hashes das entregas. Diferencie fixture, build local, Preview e produção. Declare operações externas e commit/push/PR realizados ou ausentes. Termine com o gate solicitado ao CTO. Falta de credencial local não prova indisponibilidade de conector.
