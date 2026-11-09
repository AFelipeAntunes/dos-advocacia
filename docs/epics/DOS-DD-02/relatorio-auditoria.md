# Relatório — DOS-DD-02.01 Auditoria em leitura

Versão do card: **1.0**. Data: **2026-11-07**.

## Devolutiva operacional

| Item | Valor |
| --- | --- |
| Card / versão | DOS-DD-02.01 / 1.0 |
| Checkout | `D:\Projetos desenvolvimento\.dos-dd-02-01-audit` |
| Branch | `audit/dos-dd-02-01` |
| SHA / base | `7fec6b2fb2da7dc5408498099e7c4917aa33bb4d` (= `origin/main` no início) |
| Estado inicial | worktree limpo em origin/main; principal `qa/dos-seo-01-preview` sujo (não reutilizado) |
| Estado final | apenas artefatos sob `docs/epics/DOS-DD-02/` + evidências; **sem** alteração de app, Wix, Vercel, env |
| Operações externas | leitura HTTP de produção; leitura de evidências SEO-01 e backup CMS privado local |
| Commit / push / PR | **ausentes** (não autorizados) |
| Credencial Wix local | **ausente** neste worktree (`.env.local` não encontrado). Conector inferido via produção + inventário Preview 12 + backup 04/11 |

## Causa / escopo

Inventário real de SEO/CTA da landing, links institucionais, IDs/slugs/categorias dos posts do lote CMO, contrato de inserção/tracking e verificação dos títulos SEO de 06/11, **antes** de qualquer implementação.

## Entregas

| Arquivo | Função |
| --- | --- |
| `matriz-artigos.csv` | Elegibilidade por artigo + casos-limite |
| `mapa-links.md` | Links existentes / a ajustar / ausentes |
| `contrato-cta.md` | Precedência, 3º parágrafo, analytics, tracker |
| `relatorio-auditoria.md` | Este relatório |
| `evidencias/01-auditoria/` | HTML produção, JSON de captura, mapa de IDs |

## Achados principais

1. **Landing curta e desalinhada do termo.** H1 atual não contém “due diligence imobiliária”; ~quatro H3 de entregáveis; sem FAQ; schema sem `FAQPage`; formulário e WhatsApp já instrumentáveis (`icp=comprador`).
2. **Links institucionais já existem.** Home, compra, nacional e Curitiba apontam para a landing. Vários âncoras diferem do texto do handoff (ajuste no 03, sem duplicar).
3. **“Nenhum post linka” é falso.** No lote auditado, só **cessão** e **gaveta** estão sem âncora editorial para a landing; os demais já linkam.
4. **IDs completos resolvidos** via chave React dos `blog-card` no HTML/RSC de produção (mapa em `evidencias/01-auditoria/blog-card-id-map.csv`).
5. **Categorias (prova pública):** Due Diligence ou Contratos para o lote de compra; os três títulos B2B de 06/11 caem em Assessoria para Imobiliárias. Filtro Litígios redireciona para `/blog`.
6. **Cinco títulos SEO de 06/11 confirmados** no `<title>` de produção; `og:title` ainda reflete o título CMS/display (comportamento atual de `generateMetadata`).
7. **CTA B2B atual** não aparece nos posts do lote DD/Contratos (`article-service-cta` ausente). Tracker singular e `link_url` no WhatsApp do artigo são riscos do card 04.
8. **Inserção após 3º parágrafo:** todos os posts do lote têm ≥3 parágrafos elegíveis antes do FAQ na heurística HTML; georreferenciamento tem H2 “Leia também” a respeitar.

## Inventário técnico (landing / app)

| Recurso | Observação |
| --- | --- |
| HTML fonte | `src/legacy-pages/due-diligence-imobiliaria.html` |
| CSS app | `src/app/globals.css` (~49 KB); legado referencia `/styles.css` |
| JS interações | `public/site-interactions.js` (~8 KB); form + menu |
| Marca | `/assets/brand/symbol.svg`, `Símbolo_Invertido.svg` |
| Form | injetado em `</main>` por `legacy-pages.ts` |
| Testes base | 13 arquivos, ~82 casos |
| Perf anterior | método lab em DOS-SEO-01 `performance.md`; artigo DD como célula B2C |

## Rich Content / fallback

`WixRichContent` renderiza blocos tipados; fallback parte `contentText`/`excerpt` em parágrafos. FAQ schema só com H2 “Perguntas frequentes” + ≥2 perguntas. “Leia também” editorial permanece no Rich Content; cards relacionados deduplicam no servidor.

## Títulos 06/11

Ver `evidencias/01-auditoria/titulos-06-11-verificacao.json`. Todos os cinco `seoData` relatados batem com o `<title>` público. **Não** há pedido de republicação. Gap residual: painel Search Console/GA4 não foi aberto nesta sessão (métricas do handoff continuam informação CMO).

## Gaps (gate CTO)

1. Aceitar **matriz** e **precedência** (Assessoria vence; Contratos só com persona; Litígios/sem categoria/desconhecida sem CTA).
2. Aceitar definição do **3º parágrafo** e a restrição a `PARAGRAPH` de topo / sem lista.
3. Aceitar contrato de **`cta_position` / `cta_variant`** e remoção de `link_url` nos fluxos novos.
4. Identificar os **3 posts multicategoria** do inventário Preview (API) antes do 04 — nenhum do lote CMO apareceu em duas abas públicas.
5. Decidir tratamento do **artigo principal** `2bef3905…` (CTA vs só revisão CMO).
6. Sem `WIX_API_KEY` local: `categoryIds` ao vivo não relidos; prova = filtros públicos + IDs de categoria do inventário 12 + backup parcial.
7. SHA de **deployment** produção ≠ git SHA visível nos headers; base de código auditada = `7fec6b2` / origin/main.

## Gate solicitado ao CTO

**Aprovar ou corrigir:** matriz-artigos.csv + precedência multicategoria + ponto de inserção do compacto + contrato analytics/privacidade, para liberar cards 03/04. Implementação permanece bloqueada até esse aceite.
