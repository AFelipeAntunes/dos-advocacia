# CTO25 — ajuste de âncora aceito; composição final da PR12

09/11/2026. AJUSTE LOCAL ACEITO. PREPARAÇÃO DE COMMIT/PREVIEW NA PR12 CONFORME AUTORIZAÇÃO EXISTENTE. SEM MERGE OU PRODUÇÃO.

Revisados diff de globals.css, RELATORIO-CTO24-ANCORA.md e bruto smoke-anchor-cto24.json. Oito de oito combinações (390/768/1000/1440, clique/fragmento direto) passaram; título abaixo do header com23–47px de folga. Regra restrita a .dd-lcp-opt #o-que-voce-recebe,116px desktop e100px até960px. Nenhuma alteração JS/copy/header ou formulário. Typecheck/build aprovados pelo executor; nenhuma nova bateria80 necessária para esta propriedade de navegação.

## Lote concreto

Base7fec6b2; branch qa/dos-dd-02-05, PR12. Inclui landing e links aprovados, retrato, CTAs SSR/classificador/tracker, otimizações DD aceitas e scroll-margin da âncora. Completa documentação CTO20–25 e evidências de preflight, limpezaD,80 medições e smoke conectado. Pré-estado do bypass revogado sanitizado. .gitignore inclui .vercel e .env* para preservar credenciais locais.

Aceites preservados: copy/retrato, seis FAQs/schema, formulário interceptado e eventos em artigos reais, precedência multicategoria, dados institucionais, SITE_URL somente no Preview da branch. Remanescentes operacionais: smoke público, GA4 DebugView e coleta de campo após publicação autorizada. Fragmento sr-only sem consumidor público comprovado permanece pendência técnica não bloqueante.

lastModified deve refletir o rollout autorizado efetivo. Nenhuma data futura é prova de publicação já ocorrida. Preparar a alteração das cinco rotas do lote (DD, home, compra, nacional, Curitiba) no momento do rollout autorizado; não reabrir conteúdo. Não aplicar revalidação ou alterações Wix por conta própria.

## Search Console recebido durante esta revisão

Análise separada no checkout principal: docs/epics/DOS-SEO-01/GSC-VALIDACAO-20261109.md. Dois artigos200/canonical próprio estão fora do sitemap público121URLs, embora apareçam no blog; Preview anterior123URLs os continha. Isso é divergência observada de sitemap, não causa comprovada de não indexação. Confirmar sua presença no sitemap pós-rollout e consultar URL Inspection, sem recriar origens301 ou URLs técnicas. Não introduzir correção de conteúdo/redirect adicional neste lote.

Este parecer não autoriza produção. Depois de identificar o novo commit/Preview e confirmar a âncora no build remoto final, devolver lote para autorização de merge/release por Felipe.
