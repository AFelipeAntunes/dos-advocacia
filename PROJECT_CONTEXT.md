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
| Tom | Elegante, direto, humano, seguro e sem juridiquês desnecessário |
| Regra crítica | Nunca usar “Drielle Oliveira” em texto, metadados, schema ou novos arquivos |

Paleta: `#0b1e47`, `#49596c`, `#8fabbc`, `#194951`, `#eb574d`, `#e4e5df`.

## 3. Público e proposta de valor

Públicos prioritários: imobiliárias e administradoras, corretores, compradores, vendedores, investidores e equipes de locação em Curitiba e região.

Proposta: orientar decisões imobiliárias antes que riscos contratuais, documentais ou operacionais se transformem em conflito.

## 4. Arquitetura implementada

O projeto migrou do site estático para **Next.js 16.2.10, React 19.2.7 e TypeScript**, usando App Router e pronto para Vercel. A migração preserva o visual e as páginas institucionais existentes; não representa uma reformulação de identidade ou conteúdo.

| Área | Implementação atual |
| --- | --- |
| Páginas institucionais | Rotas App Router que renderizam o HTML preservado em `src/legacy-pages/` |
| Estilos | `src/app/globals.css` |
| Interações de navegação e revelação | `src/components/site-interactions.tsx` |
| Metadados e schema institucional | Extraídos das páginas preservadas por `src/lib/legacy-pages.ts` |
| Imagens, marca e manifesto | `public/assets/` e `public/site.webmanifest` |
| SEO técnico | `src/app/robots.ts`, `src/app/sitemap.ts`, metadata do App Router e redirects em `next.config.ts` |
| Blog futuro | `/blog`, `/post/[slug]`, `src/lib/wix/` e webhook em `src/app/api/webhook/wix-blog/route.ts` |

Rotas institucionais: `/`, `/sobre`, `/areas-de-atuacao`, `/contratos-imobiliarios`, `/assessoria-em-locacao`, `/conflitos-imobiliarios`, `/due-diligence-imobiliaria`, `/treinamentos`, `/conteudos`, `/contato` e `/politica-de-privacidade`.

As antigas URLs `*.html` possuem redirecionamentos permanentes específicos para as rotas limpas. Não há redirecionamento genérico para a home.

## 5. Treinamentos e imagens

`/treinamentos` é uma landing page comercial para treinamento jurídico presencial e in company para equipes de locação de imobiliárias e administradoras.

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
- Endereço: Av. do Batel, 1230, Conj. 508, Batel — Curitiba/PR
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
- Endpoint `POST /api/webhook/wix-blog` preparado para validar JWT RS256 com chave pública, `issuer` `wix.com`, `audience` do App ID e janela curta de validade.
- Webhook falha fechado quando credenciais não existem, não utiliza seu corpo como conteúdo, consulta a fonte Wix e somente então revalida a tag, `/blog`, `/post/[slug]` e `/sitemap.xml`.
- Nenhuma credencial, integração externa, analytics, deploy ou DNS foi configurado.

### Limite intencional desta etapa

Sem credenciais, `/blog` e `/post/[slug]` retornam 404 e o sitemap contém apenas páginas institucionais. É deliberado: evita indexação de conteúdo parcial e impede ativar uma integração sem validação real. A renderização atual usa `contentText`/`excerpt` como fallback seguro; na integração deve ser validado e, se necessário, complementado para a estrutura Rich Content, imagens, links e mídia do acervo real.

## 9. Roteiro para a próxima etapa

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

- Site institucional migrado para Next.js, com design e conteúdo institucional preservados.
- Páginas, metadata, JSON-LD, assets e redirects de URLs HTML incluídos na nova estrutura.
- Base técnica de Wix Blog, rotas, sitemap dinâmico e webhook seguro implementada, porém **inativa por ausência intencional de credenciais Wix**.
- Nome profissional padronizado para **Drielle Pereira**; fotos e treinamentos presentes; rodapé em 2024.
- Repositório privado usa somente `main`. As alterações desta migração ainda não foram commitadas, enviadas ou implantadas.
- Speed Insights integrado ao layout; a coleta começa após o primeiro deploy válido e visitas reais.
- Domínio, DNS, GA4, Search Console, Vercel Analytics e integração Wix ainda não configurados.

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

### 2026-07-10 — Governança e continuidade

- Criados e mantidos `AGENTS.md` e `PROJECT_CONTEXT.md` como entrada operacional para futuros agentes.
- Definida a estratégia Git: somente `main`.

## 13. Pendências e recomendações

- Executar o roteiro da seção 9 antes de colocar o blog ou o domínio público em produção.
- Confirmar dados públicos, autorizações de imagem e conformidade OAB/LGPD antes do lançamento.
- Não criar outro CMS: a decisão atual é manter Wix Blog como painel editorial integrado ao Next/Vercel.
- Não fazer DNS ou deploy até haver preview validado, plano de rollback e autorização explícita.
