# Aceite CTO — DOS-DD-02.04 R1/R2

07/11/2026. R1 E R2 ACEITOS LOCALMENTE. Card04 apto para QA05 em conjunto com03. Nenhuma publicação autorizada por este parecer.

## Prova independente

Reprodução R1 executada pelo CTO com saídas null, null e2 para contato isolado, heading de contato e link editorial embutido, respectivamente. Corrige o defeito registrado no parecer11 sem suprimir o caso editorial aceito.

Inspecionada a função bindBlogCtaTrackerListeners e o useEffect consumidor. O harness chama essa mesma função, dispara eventos com propagação nos ancestrais simulados e executa cleanup. Asserts cobrem compacto/link+span, completo/DD/compra/WhatsApp, B2B, editorial, related e remount/post_slug novo. Trata-se de harness DOM simulado, não navegador ou GA4 real. Essa prova satisfaz R2 localmente; navegador/React e coleta real permanecem no gate05.

test:wix agora inclui src/components/blog-cta-tracker.test.ts. Comparação com a revisão anterior usa47Wix+3tracker separados; agora56 na suíte agrupada. Repetidos56/56Wix e4/4analytics. Build23/23 e typecheck passaram após repetir fora do sandbox Windows por EPERM na pasta.next. Nenhuma mudança de aplicação para resolver essa limitação.

Manifesto04-cta-r1r2 conferido sem divergências. Os sete arquivos de aplicação aceitos do card03 foram novamente comparados por hash entre worktrees03/04, todos iguais. Classificador, quatro IDs de comprador e copy preservados. Nenhuma nova correção solicitada.

## Próxima entrega — card05

O worktree04 já contém03+04 localmente. O executor05 pode usar essa composição como candidato local, desde que registre a base7fec6b2, branch e manifesto de todos os arquivos do diff, confirme main remoto e preserve o trabalho dos executores. Não é necessário repetir a implementação.

Antes de operações remotas, apresentar candidato identificável e obter autorização concreta se ainda ausente. PR/Preview não são inferidos do pedido de review do agente. Nenhuma autorização de deploy ou escrita Wix nesta etapa.

Executar o escopo do05 com atenção especial:
- Repetir cliques em navegador com markup SSR real e ciclo de navegação, sem assumir que harness comprova React/DOM reais.
- Identificar os multicategoria reais ou reconciliar a contagem histórica com catálogo atual em leitura. Sem.env.local não prova indisponibilidade do conector.
- Conferir CMS e site do artigo principal atualizado, com data/hora e identidade. Diagnosticar cache sem repetir publicação.
- Conferir elegibilidade de Contratos por ID e B2B preservado. Não recategorizar artigos para fabricar a amostra.
- Comparação de velocidade baseline versus candidato em mobile/desktop, páginas e artigos do05. O código cliente do tracker e site-interactions mudou, há CSS adicional e parse adicional do Rich Content.
- Nenhuma ausência de regressão pode ser declarada por número de chunks ou builds iguais.
- Manter data do sitemap como pré-release até planejar publicação real. Atualizar datas substanciais das rotas alteradas no rollout.

Devolver relatório consolidado com aceites locais, gaps externos e bloqueadores reais separados. Relatórios anteriores de R1/R2 abertos são históricos quando conflitarem com este aceite.

CTO atualizou apenas documentação neste review. Sem commit/push/PR/deploy/Wix.
