# Contexto do projeto — DOS Advocacia Imobiliária

> Fonte de verdade operacional. Todo agente deve ler este arquivo antes de iniciar uma tarefa e atualizá-lo ao final.

## 1. Objetivo

Manter uma presença digital premium para advocacia imobiliária, com foco em conversas qualificadas por WhatsApp, entendimento claro da atuação jurídica e indexação confiável por buscadores e sistemas de IA. A comunicação deve transmitir técnica, proximidade e visão prática, sem promessas de resultado.

## 2. Identidade e comunicação

| Item | Decisão atual |
| --- | --- |
| Nome profissional | **Drielle Pereira** |
| Marca | DOS Advocacia Imobiliária |
| Domínio canônico planejado | `https://www.dosadvocacia.com.br` |
| Atuação | Curitiba/PR e atendimento em todo o Brasil |
| Tipografia | Urbanist |
| Tom | Direto, consultivo e humano; segunda pessoa como voz principal e primeira pessoa da Drielle em trechos de autoridade |
| Regra crítica | Nunca usar “Drielle Oliveira” em texto, metadados, schema ou novos arquivos |

Paleta: `#0b1e47`, `#49596c`, `#8fabbc`, `#194951`, `#eb574d`, `#e4e5df`.

## 3. Público e proposta de valor

Públicos prioritários: imobiliárias e administradoras, corretores, compradores, vendedores, investidores e equipes de locação em Curitiba e região.

Proposta: orientar decisões imobiliárias antes que riscos contratuais, documentais ou operacionais se transformem em conflito.

## 4. Arquitetura implementada

O projeto usa **Next.js 16.2.10, React 19.2.7 e TypeScript** com App Router e publicação na Vercel. A camada institucional foi modernizada em voz, imagens e microinterações, preservando arquitetura, rotas, renderização no servidor e fundação SEO.

| Área | Implementação atual |
| --- | --- |
| Páginas institucionais | Rotas App Router que renderizam o HTML preservado em `src/legacy-pages/` |
| Estilos | `src/app/globals.css`, Urbanist via `next/font` e animações CSS-first com redução de movimento |
| Interações de navegação e revelação | `public/site-interactions.js`, JavaScript nativo sem hidratação React |
| Metadados e schema institucional | Extraídos das páginas preservadas por `src/lib/legacy-pages.ts` |
| Imagens, marca e manifesto | `public/assets/` e `public/site.webmanifest` |
| SEO técnico | `src/app/robots.ts`, `src/app/sitemap.ts`, metadata do App Router e redirects em `next.config.ts` |
| Blog futuro | `/blog`, `/post/[slug]`, `src/lib/wix/` e webhook em `src/app/api/webhook/wix-blog/route.ts` |

Rotas institucionais: `/`, `/sobre`, `/areas-de-atuacao`, `/contratos-imobiliarios`, `/assessoria-em-locacao`, `/conflitos-imobiliarios`, `/due-diligence-imobiliaria`, `/treinamentos`, `/conteudos`, `/contato` e `/politica-de-privacidade`.

As antigas URLs `*.html` possuem redirecionamentos permanentes específicos para as rotas limpas. Não há redirecionamento genérico para a home.

## 5. Treinamentos e imagens

`/treinamentos` é uma landing page consultiva para quem decide contratar treinamento jurídico presencial e in company para equipes de locação de imobiliárias e administradoras. A abertura parte do custo operacional de um time despreparado; os módulos entram como prova após o diagnóstico.

Módulos apresentados:

1. Encerramento da locação sem improviso;
2. As três relações da locação;
3. Garantias locatícias na prática;
4. Inadimplência e limites administrativos;
5. A vistoria como prova.

O conteúdo foi estruturado a partir de `TREINAMENTOS.docx`. O treinamento prepara a equipe para reconhecer riscos; não substitui assessoria jurídica, revisão contratual ou atuação em litígios. As fotos foram otimizadas para WebP. Confirmar autorizações de imagem antes de produção.

## 6. Dados públicos exibidos

> Confirmar antes de produção.

- WhatsApp: `+55 41 98792-6468`
- E-mail: `drielle@dosadvocacia.com.br`
- Instagram: `https://www.instagram.com/drielleadvimobiliaria/`
- Endereço: Av. do Batel, 1230, Conj. 508, Batel - Curitiba/PR
- Horário: segunda a sexta, 10h às 18h
- Rodapé: `© 2024 DOS Advocacia Imobiliária.`

## 7. SEO e GEO

- Manter uma única `H1`, titles/descriptions específicos, canonical, Open Graph, Twitter Card e JSON-LD coerentes com o conteúdo visível.
- Toda URL indexável deve entrar no sitemap gerado por `src/app/sitemap.ts`.
- Usar HTML renderizado pelo servidor para posts, com data, autoria, links internos e resposta objetiva à intenção de busca.
- Antes do corte, comparar títulos, descriptions, conteúdo, imagem, autora, datas e canonical do Wix com a nova renderização.
- Validar schema no Rich Results Test, sitemap no Search Console e rotas no URL Inspection após publicação.
- Revisar conteúdo conforme Provimento OAB 205/2021 e a política de privacidade conforme as ferramentas adicionadas.

## 8. Blog Wix como CMS e Vercel como site público

### Decisão arquitetural

O Wix deixa de hospedar o site público após o corte de DNS, mas continua sendo o painel editorial. A redatora cria rascunhos, adiciona imagens e publica no Wix; o visitante lê no domínio principal, em páginas Next renderizadas pela Vercel, sem iframe ou redirecionamento.

```text
Redatora → Wix Blog → API de servidor → Next.js/Vercel → visitante e Google
                     ↓
          webhook JWT validado (gatilho)
                     ↓
      nova leitura Wix + revalidação de post, blog e sitemap
```

### Contrato de URL e inventário

- Inventário informado: **86 posts publicados** no Wix.
- URL pública a preservar: `/post/[slug]`.
- Slug é case-sensitive e pode conter acentos/caracteres especiais. Não normalizar, recriar ou traduzir o slug.
- A rota Next decodifica percent-encoding com segurança antes da consulta e torna a codificar somente para compor URLs.
- Não há redirecionamento previsto para URLs já equivalentes. Mapear e implementar 301 somente em divergências reais de slug/URL após a auditoria.

### Base técnica concluída nesta etapa

- Dependências Next, React, TypeScript e `jose` adicionadas; Node mínimo 20.9.
- API Wix isolada em módulos de servidor com `WIX_API_KEY` e `WIX_SITE_ID`.
- Rotas `/blog` e `/post/[slug]` com metadata, listagem, geração de parâmetros, conteúdo textual de fallback e cache por tag.
- Sitemap que inclui as páginas institucionais e, após credenciais, lista posts publicados com seus slugs reais.
- Endpoint `POST /api/webhook/wix-blog` preparado para validar a assinatura JWT RS256 com a chave pública configurada, sem presumir claims não documentadas.
- Webhook falha fechado quando credenciais não existem, não utiliza seu corpo como conteúdo e revalida a tag, `/blog`, `/post/[slug]` e `/sitemap.xml` sem consulta síncrona antes da resposta.
- Nenhuma credencial, integração externa, analytics, deploy ou DNS foi configurado.

### Limite intencional desta etapa

Sem credenciais, `/blog` e `/post/[slug]` retornam 404 e o sitemap contém apenas páginas institucionais. É deliberado: evita indexação de conteúdo parcial e impede ativar uma integração sem validação real. A renderização atual usa `contentText`/`excerpt` como fallback seguro; na integração deve ser validado e, se necessário, complementado para a estrutura Rich Content, imagens, links e mídia do acervo real.

## 9. Roteiro para a próxima etapa

O handoff operacional completo, incluindo gates, segurança de credenciais, auditoria de conteúdo, preview, SEO, DNS e rollback está em [`docs/WIX_BLOG_INTEGRATION_HANDOFF.md`](docs/WIX_BLOG_INTEGRATION_HANDOFF.md). As Fases 1 e 2 já foram concluídas; a próxima etapa externa é configurar credenciais apenas em Preview.

1. Criar ou confirmar uma Wix Custom App e API Key de servidor com privilégio mínimo **Read Blog**.
2. Configurar em ambiente local e preview: `WIX_API_KEY`, `WIX_SITE_ID`, `WIX_APP_ID`, `WIX_WEBHOOK_PUBLIC_KEY` e `SITE_URL`; nunca commitar valores.
3. Consultar List Posts e Get Post By Slug, confirmar os 86 posts, suas URLs exatas, campos de SEO, data, autora, imagem e Rich Content.
4. Validar o renderer dos posts com amostra representativa e depois com o acervo completo; ajustar somente o necessário para preservar conteúdo e links.
5. Configurar no Wix eventos de post criado, atualizado e excluído para o endpoint de preview; testar assinatura válida, rejeição de assinatura inválida e reentregas duplicadas.
6. Conferir que a publicação/edição no Wix atualiza artigo, listagem e sitemap. Tratar a consulta ao Wix como reconciliação idempotente.
7. Gerar a planilha de migração SEO e redirecionamentos 301 apenas para divergências reais.
8. Validar Vercel Preview, GA4, Search Console e Vercel Analytics, mantendo o Wix Analytics como histórico.
9. Somente com autorização explícita, adicionar domínio na Vercel e alterar no DNS do Wix apenas `@` e `www`, preservando MX, SPF, DKIM e TXT existentes. Manter o site Wix publicado para contingência.

## 10. Git, hospedagem e operação

| Item | Estado |
| --- | --- |
| Repositório | `https://github.com/AFelipeAntunes/dos-advocacia` |
| Visibilidade | Privado |
| Branch padrão | `main` |
| Estratégia | Somente `main`; sem `develop` permanente |
| Commit inicial | `729867e — feat(site): publica site institucional da Drielle Pereira` |
| Deploy Vercel | Projeto configurado; publicação depende do push da migração para `main` |
| Domínio e DNS | Permanecem no Wix; nenhuma alteração feita |

Comandos locais:

```powershell
npm install
npm run dev -- --port 4173
npm run typecheck
npm run build
```

## 11. Status atual

- Site institucional em Next.js com nova voz consultiva, copy orientada a situações reais de risco e experiência da Drielle apresentada em primeira pessoa.
- Camada visual modernizada sem bibliotecas de animação: logo oficial, Urbanist via `next/font`, imagens WebP, entrada CSS do hero, microinterações, View Transitions nativas e suporte a `prefers-reduced-motion`.
- Páginas, metadata, JSON-LD, assets e redirects de URLs HTML incluídos na nova estrutura.
- Base técnica de Wix Blog, rotas, sitemap dinâmico e webhook seguro implementada, porém **inativa por ausência intencional de credenciais Wix**.
- Nome profissional padronizado para **Drielle Pereira**; fotos e treinamentos presentes; rodapé em 2024.
- Repositório privado usa somente `main`; pushes nessa branch disparam publicação na Vercel.
- Vercel Web Analytics e Speed Insights integrados ao layout; a coleta começa após o deploy válido e visitas reais.
- CTAs de WhatsApp nas páginas de serviços e treinamentos usam mensagens pré-preenchidas com o contexto da página. Links globais de contato permanecem genéricos.
- Domínio, DNS, GA4, Search Console e integração Wix ainda não configurados.

## 12. Alterações recentes

### 2026-07-10 — Migração técnica Next.js e fundação Wix Blog

- Migração do site estático para Next.js 16 App Router, React 19 e TypeScript.
- HTML institucional preservado internamente, assets movidos para `public/` e redirects 301 configurados para as antigas URLs `.html`.
- Criados `/blog`, `/post/[slug]`, sitemap dinâmico, `robots.ts`, módulos de servidor Wix e webhook com validação JWT.
- Criados `.env.example`, `package.json`, `next.config.ts` e scripts de validação.
- Atualizado Next.js para 16.2.10 e substituído PostCSS transitivo pela versão corrigida 8.5.16; `npm audit --omit=dev` sem vulnerabilidades.
- Adicionado `@vercel/speed-insights` e o componente global `<SpeedInsights />` no layout.
- Executados com sucesso `npm run typecheck` e `npm run build` sem credenciais Wix.
- Sem alteração de conteúdo Wix, domínio, DNS, Vercel, credenciais, deploy, commit ou push.

### 2026-07-10 - Revisão de voz, marca e experiência visual

- Reescritas Home, Sobre, Áreas de atuação, quatro páginas de serviços, Treinamentos, Conteúdos e Contato com voz direta em segunda pessoa e autoridade da Drielle em primeira pessoa.
- Diferencial da experiência dentro de imobiliária levado para a primeira dobra e aplicado como eixo narrativo do site.
- Removidos travessões largos e expressões proibidas da copy; CTAs passaram a ser convites consultivos sem promessa de resultado.
- Símbolo oficial incorporado ao cabeçalho e rodapé com o nome canônico em texto HTML. Os wordmarks enviados ainda exibem “Drielle Oliveira”, foram isolados em `design-assets/brand-legacy/` e não podem ser publicados até a correção gráfica.
- Novas fotos da Drielle e dos treinamentos convertidas para WebP, com originais pesados fora do diretório público.
- Urbanist passou a ser servido pelo `next/font`; hero principal foi reduzido de aproximadamente 1,8 MB para cerca de 73 KB em WebP.
- Adicionadas microinterações CSS-first, View Transitions, scroll reveal progressivo e tratamento explícito para redução de movimento.
- Interações simples foram movidas de um Client Component para JavaScript nativo, evitando hidratação React apenas para menu e scroll reveal.
- `robots.ts` passou a liberar explicitamente OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot e Claude-User. A política para bots de treinamento permanece uma decisão separada.
- Validação final local em build de produção: TypeScript e build aprovados, 17 rotas geradas, `npm audit --omit=dev` com zero vulnerabilidades e QA de voz sem nome antigo, travessão largo ou expressões proibidas.
- Lighthouse da Home em desktop: Performance 99, Acessibilidade 96, Boas Práticas 100 e SEO 100; LCP 0,7 s, CLS 0 e TBT 100 ms.
- Lighthouse mobile apresentou variação relevante do ambiente local. A melhor execução limpa registrou Performance 95, Acessibilidade 96, Boas Práticas 100 e SEO 100; LCP 2,7 s, CLS 0 e TBT 130 ms. O LCP ficou 0,2 s acima do alvo laboratorial e deve ser acompanhado no Speed Insights com tráfego real.
- Como o Wix Blog continua inativo sem credenciais, não existe post representativo renderizável para a auditoria obrigatória. `/conteudos` foi usado como página editorial substituta; a auditoria de um `/post/[slug]` permanece gate da integração Wix.

### 2026-07-10 - Ajuste de enquadramento dos treinamentos

- Hero de `/treinamentos` passou a usar `treinamento-juridico-equipe-locacao.webp`, com enquadramento vertical direcionado ao grupo.
- Bloco de treinamento da Home passou a usar somente a foto horizontal da turma com certificados.
- Removidos o recorte de mesa, a foto secundária desfavorável e a legenda sobreposta aos rostos.

### 2026-07-10 - Mensuração e conversão por WhatsApp

- Adicionado `@vercel/analytics` ao layout global, em conjunto com o Speed Insights, para medir visitas e visualizações de página somente nos deployments da Vercel.
- Corrigida a especificidade de `.text-link-light`, garantindo contraste alto para CTAs de texto em fundos escuros em todas as páginas.
- CTAs principais de Contratos Imobiliários, Assessoria em Locação, Conflitos Imobiliários, Due Diligence, Áreas de Atuação e Treinamentos agora iniciam o WhatsApp com mensagens que identificam a origem e a intenção do contato.

### 2026-07-10 - Handoff da integração Wix Blog

- Criado `docs/WIX_BLOG_INTEGRATION_HANDOFF.md` com as fases de descoberta, confirmação de contrato da API, credenciais mínimas, preview, webhook, auditoria SEO, produção e rollback.
- O handoff bloqueia credenciais, variáveis Vercel, webhook, deploy e DNS até haver evidência de compatibilidade com três posts de amostra e autorização explícita.

### 2026-07-11 - Auditoria Wix Blog e próximo gate técnico

- Auditoria de leitura confirmou 86 posts publicados, todos já no padrão `/post/[slug]`; não há redirecionamentos 301 de path a criar. Há dois rascunhos e 19 itens na lixeira fora do escopo.
- A amostra de conteúdo mostrou texto, imagens, links e citações. A implementação precisa suportar Rich Content seguro antes da ativação, mesmo sem tabelas ou embeds no acervo atual.
- A API Wix exige `fieldsets` para devolver conteúdo, Rich Content, SEO, mídia e URL. A camada atual não os solicita e precisa ser corrigida antes de criar credenciais.
- O webhook atual pressupõe claims e uma validade curta não confirmadas para o JWT e faz consulta síncrona antes da resposta. A próxima etapa técnica deve validar somente a assinatura documentada e responder sem bloquear em consulta ao Wix.
- 85 posts exibem a autora antiga "Dra. Drielle Oliveira" e um exibe `drielle90`. Corrigir os perfis no Wix é pendência obrigatória de marca antes do corte de DNS.

### 2026-07-11 - Preparação técnica Wix Blog

- As consultas de posts agora pedem os fieldsets `CONTENT_TEXT`, `RICH_CONTENT`, `SEO` e `URL`, e os tipos incluem mídia, Rich Content e SEO.
- Implementado renderer seguro, sem HTML injetado, para parágrafos, títulos, links, citações e imagens do formato Ricos auditado. Conteúdos futuros fora desse conjunto exigem validação antes de publicação.
- `/blog` e `/post/[slug]` estão preparados para imagem de capa, metadata, Open Graph, Twitter Card e `BlogPosting` com autora canônica Drielle Pereira.
- Webhook passou a validar somente a assinatura RS256 e a revalidar caches sem consulta síncrona ao Wix antes da resposta.
- Adicionado `tsx` como dependência de desenvolvimento e o comando `npm run test:wix` para fixtures de texto, links, citação e imagem.

### 2026-07-13 - Revalidação editorial sob demanda

- Adicionada a rota interna `POST /api/revalidate/wix-blog`, protegida por `WIX_REVALIDATION_SECRET` exclusivamente no servidor. Ela invalida a tag do Wix Blog, listagem, artigos e sitemap sem aceitar conteúdo no corpo da requisição.
- A redatora continua trabalhando apenas no Wix. Após publicar ou editar, ela solicita ao responsável técnico/assistente autorizado a revalidação do blog; o segredo não é compartilhado, incluído em links, logs ou variáveis `NEXT_PUBLIC_`.
- Como o catálogo Wix atual não oferece evento de post atualizado/publicado, a rota segura é o caminho imediato; o ISR permanece como contingência.
- A rota foi validada em Preview com resposta HTTP 200 e sem exposição de segredo. `WIX_REVALIDATION_SECRET` está marcado como Sensitive e limitado a Preview; não há variável equivalente em Production.
- Os webhooks temporários de criação e exclusão foram removidos do Wix após a validação. A Vercel Authentication de Preview foi reativada; Production, domínio, DNS, e-mail e posts Wix permaneceram inalterados.

### 2026-07-13 - Conteúdos ligados ao blog e arquitetura registrada

- `/conteudos` e a URL legada `/conteudos.html` agora direcionam permanentemente para `/blog`; links institucionais de Conteúdos também passam a levar à listagem real de artigos.
- A abertura da listagem foi reescrita para orientar o visitante a reconhecer riscos antes de decidir sobre um imóvel, sem promessas de resultado.
- Criado `docs/ARCHITECTURE.md` como referência canônica de rotas, SEO, Wix, cache, segredos, Preview, Production, DNS e rollback. `AGENTS.md` e `README.md` passaram a exigir sua leitura antes de alterações futuras.

### 2026-07-10 — Governança e continuidade

- Criados e mantidos `AGENTS.md` e `PROJECT_CONTEXT.md` como entrada operacional para futuros agentes.
- Definida a estratégia Git: somente `main`.

## 13. Pendências e recomendações

### Estado de produção confirmado — 13 de julho de 2026

- O site público está ativo em `https://www.dosadvocacia.com.br` no projeto oficial da Vercel. `https://dosadvocacia.com.br` responde com redirecionamento permanente 308 para `www`.
- No Registro.br, somente os registros web foram alterados: `A dosadvocacia.com.br -> 216.198.79.1` e `CNAME www.dosadvocacia.com.br -> 82aaee17cb676f6c.vercel-dns-017.com.`. MX Microsoft 365, SPF, verificações TXT e `autodiscover` foram preservados.
- As variáveis Wix e `SITE_URL` foram configuradas em Production; `WIX_REVALIDATION_SECRET` é distinto do Preview e permanece Sensitive. Um redeploy de Production foi necessário após incluir as variáveis, pois elas são capturadas no build.
- Smoke test público aprovado: home, blog, artigo real, sitemap e robots responderam 200; artigo possui canonical, description, Open Graph e `BlogPosting`; sitemap contém a URL do artigo.
- Não há webhook Wix permanente em Production. O catálogo atual não oferece evento de edição/publicação; para alterações editoriais usar a revalidação segura sob demanda, conforme `docs/ARCHITECTURE.md`.

- Monitorar a propagação de DNS pelos resolvedores externos e as primeiras métricas de Vercel Analytics e Speed Insights.
- Repetir Lighthouse e validar `BlogPosting` em um `/post/[slug]` real assim que as credenciais Wix forem habilitadas.
- Confirmar dados públicos, autorizações de imagem e conformidade OAB/LGPD antes do lançamento.
- Solicitar versões corrigidas dos logotipos horizontais com “Drielle Pereira”; até lá, preservar a composição símbolo + texto usada no site.
- Decidir e documentar separadamente a política para bots de treinamento como GPTBot, ClaudeBot, Google-Extended e CCBot.
- Não criar outro CMS: a decisão atual é manter Wix Blog como painel editorial integrado ao Next/Vercel.
- Antes de qualquer alteração de conteúdo no Wix, manter o procedimento de revalidação sob demanda. Reavaliar webhook somente se o catálogo Wix passar a oferecer evento de atualização/publicação ou se sua assinatura for validada novamente no ambiente alvo.
