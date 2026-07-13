# Handoff — Wix Blog como CMS e Next.js/Vercel como site público
> Nota de validacao (2026-07-11): branch criada apenas para gerar um Vercel Preview deployment de validacao da integracao Wix Blog em ambiente nao-Production. Nenhuma alteracao funcional de codigo nesta branch.
## Objetivo desta etapa

Manter o Wix Blog como painel editorial para a redatora e entregar cada artigo em HTML renderizado pelo Next.js, no mesmo domínio público. O leitor não deve ver Wix, iframe ou redirecionamento.

Fluxo aprovado:

```text
Redatora publica no Wix Blog
  → Wix emite evento assinado
  → POST /api/webhook/wix-blog na Vercel
  → Next consulta o Wix novamente
  → revalida artigo, /blog e /sitemap.xml
  → Google encontra /post/[slug]
```

## Limites e autorizações

O agente pode navegar, auditar e reunir dados no Wix e na Vercel. Antes de executar, deve solicitar confirmação explícita para:

- criar API Key, Custom App ou webhook;
- salvar qualquer segredo na Vercel;
- publicar, promover deployment, alterar domínio ou DNS;
- alterar registros MX, SPF, DKIM ou TXT.

Nunca registrar em chat, Git, `PROJECT_CONTEXT.md`, capturas de tela ou logs: API key, chave pública completa, token, segredo ou cabeçalho de webhook. Relatar apenas nomes de variáveis, IDs não sensíveis e os últimos quatro caracteres de um ID quando necessário.

## Estado técnico já disponível

| Recurso | Local | Estado |
| --- | --- | --- |
| Leitura de posts | `src/lib/wix/blog.ts` | Implementada, porém sem credenciais |
| Página de listagem | `src/app/blog/page.tsx` | Retorna 404 enquanto o Wix não estiver configurado |
| Página de artigo | `src/app/post/[slug]/page.tsx` | Renderiza texto de fallback; Rich Content e mídia precisam de validação real |
| Sitemap | `src/app/sitemap.ts` | Inclui posts somente após configuração e auditoria |
| Webhook | `src/app/api/webhook/wix-blog/route.ts` | Falha fechado e valida JWT RS256 antes de revalidar |
| Variáveis esperadas | `.env.example` | `WIX_API_KEY`, `WIX_SITE_ID`, `WIX_APP_ID`, `WIX_WEBHOOK_PUBLIC_KEY`, `SITE_URL` |

O contrato de URL público é `/post/[slug]`. Os slugs devem ser preservados exatamente, inclusive maiúsculas, acentos e caracteres especiais.

## Fase 1 — Descoberta no Wix, sem alterar nada

No navegador, entrar no painel do Wix do site da DOS e reunir os itens abaixo. Preferir uma planilha ou relatório estruturado; não copiar conteúdo integral dos 86 artigos para o chat.

1. Confirmar se o Wix Blog está instalado e se há exatamente 86 posts publicados.
2. Exportar ou registrar para todos os posts: título, slug, URL pública atual, status, primeira publicação, última atualização, autora, categoria, imagem de capa e description de SEO, se disponível.
3. Escolher três amostras para teste:
   - um artigo apenas com texto;
   - um artigo com imagem e links;
   - um artigo com formatação rica, embed, tabela, citação ou mídia.
4. Registrar as URLs atuais do Wix e comparar com o destino esperado `https://www.dosadvocacia.com.br/post/[slug]`.
5. Listar as aplicações instaladas e confirmar que Wix Blog continua ativo.
6. Localizar no painel a área de Developer Center, API Keys, Apps e Webhooks. Apenas registrar o caminho encontrado nesta fase.

### Entregável da descoberta

O agente deve retornar uma tabela com estas colunas:

| Campo | Obrigatório |
| --- | --- |
| Quantidade de posts publicados | Sim |
| Slugs duplicados ou ausentes | Sim |
| URLs atuais que diferem de `/post/[slug]` | Sim |
| Campos disponíveis na API para imagem, SEO, autora e Rich Content | Sim |
| IDs do site/app não sensíveis | Sim |
| Três posts de amostra e suas características | Sim |
| Riscos de conteúdo ou SEO encontrados | Sim |

**Gate 1:** não criar credenciais nem fazer alteração técnica enquanto a auditoria de URLs e conteúdo não estiver concluída.

## Fase 2 — Confirmar o contrato da API antes de ligar o site

Com a documentação oficial aberta e o resultado da Fase 1, o agente deve verificar o contrato atual da Wix Blog API para:

- listar posts publicados com paginação;
- buscar post pelo slug;
- obter título, slug, excerpt, datas, autora, minutos de leitura, imagem de capa, SEO e Rich Content;
- autenticação de servidor com API Key e `wix-site-id`;
- criação de subscriptions/webhooks e formato de assinatura entregue.

Não presumir endpoint, nome de campo ou formato do webhook. Comparar cada item com `src/lib/wix/blog.ts` e `src/lib/wix/webhook.ts` e apontar objetivamente qualquer divergência antes de editar código.

### Critérios de decisão de renderer

- Se `contentText` reproduzir apenas texto simples, implementar renderer seguro para a estrutura Rich Content real antes da ativação.
- Imagens devem usar URL confiável, `alt` quando disponível, dimensões conhecidas e otimização do Next.
- Links internos do conteúdo devem continuar no mesmo domínio e links externos precisam manter `rel` apropriado.
- Não injetar HTML vindo do Wix com `dangerouslySetInnerHTML` sem sanitização e auditoria.
- Cada artigo deve ter `BlogPosting` JSON-LD, canonical, Open Graph, autora, data de publicação e data de atualização derivados do conteúdo real.

**Gate 2:** o código deve ser ajustado e revisado se a API real não corresponder ao modelo atual. Não configurar variáveis na Vercel antes dessa compatibilidade ser comprovada com as três amostras.

## Fase 3 — Criar credenciais com menor privilégio

**Pré-requisito concluído:** a preparação técnica foi implementada e validada localmente com `npm run test:wix`, `npm run typecheck` e `npm run build`, sem credenciais Wix. O próximo agente não deve reimplementar o renderer ou o webhook sem evidência do ambiente Preview.

Após autorização explícita:

1. Criar ou confirmar uma Wix Custom App vinculada somente ao site da DOS.
2. Criar API Key de servidor com o menor escopo possível para leitura de Wix Blog. Não conceder escrita, pagamentos, contatos ou acesso administrativo não necessário.
3. Obter o `WIX_SITE_ID` e o `WIX_APP_ID` da configuração oficial.
4. Criar a assinatura dos eventos de post criado, atualizado e excluído usando o mecanismo atual documentado pela Wix.
5. Obter a chave pública usada para validar o JWT, quando o mecanismo escolhido a fornecer, e conferir algoritmo, issuer e audience contra a documentação.

Armazenar localmente somente em `.env.local` não versionado. Para cada variável, confirmar que `.gitignore` a exclui.

## Fase 4 — Preview isolado na Vercel

Após autorização explícita para variáveis de ambiente:

1. Criar uma Preview Deployment a partir de uma branch temporária, sem mexer na `main` até a validação.
2. Na Vercel, adicionar exclusivamente ao ambiente **Preview**:

```text
WIX_API_KEY=
WIX_SITE_ID=
WIX_APP_ID=
WIX_WEBHOOK_PUBLIC_KEY=
SITE_URL=<URL HTTPS exata do preview>
```

3. Rodar o deployment e acessar `/blog`, os três posts de amostra e `/sitemap.xml` no preview.
4. Conferir resposta 200, canonical apontando para o ambiente que está em validação, título, description, imagem, autoria, datas, conteúdo e links.
5. Testar slug com acento e percent-encoding, se existir no acervo.

### Teste do webhook em preview

Configurar temporariamente a URL:

```text
https://<preview>.vercel.app/api/webhook/wix-blog
```

Publicar ou editar um post de teste não crítico. Verificar:

- o Wix entrega evento assinado;
- a resposta do endpoint é 200 e `{ "revalidated": true }`;
- a página do post, `/blog` e `/sitemap.xml` refletem a mudança;
- token inválido recebe 401;
- sem credenciais o endpoint responde 503;
- reentregar o mesmo evento não cria conteúdo duplicado nem erro.

Não enviar payloads jurídicos, tokens ou cabeçalhos completos para logs externos.

**Gate 3:** os três posts, o sitemap e o webhook precisam passar em Preview antes de qualquer variável Production, DNS ou domínio.

## Fase 5 — Auditoria SEO antes do corte

Criar um inventário de migração com as 86 linhas e estas colunas:

| URL Wix atual | URL Next final | Código esperado | Ação |
| --- | --- | --- | --- |
| URL original | `/post/[slug]` | 200 se equivalente, 301 só se divergir | preservar, redirecionar ou corrigir |

Validar também:

- nenhum artigo válido retorna 404;
- não há canonical duplicada ou apontando ao Wix depois do corte;
- `/sitemap.xml` possui todas as URLs canônicas e nenhuma URL de preview;
- `robots.txt` permite os crawlers desejados;
- Rich Results Test valida o `BlogPosting` de pelo menos uma amostra;
- Search Console receberá o sitemap somente após o domínio apontar para a Vercel;
- Vercel Analytics e Speed Insights continuam ativos.

## Fase 6 — Produção e DNS

Somente após autorização explícita e aprovação do Gate 3:

1. Adicionar `dosadvocacia.com.br` e `www.dosadvocacia.com.br` ao projeto Vercel.
2. Copiar os registros solicitados pela Vercel.
3. No DNS administrado pelo Wix, modificar somente os registros de site `@` e `www` indicados pela Vercel.
4. Preservar integralmente MX, SPF, DKIM, TXT e qualquer registro de e-mail.
5. Na Vercel Production, definir `SITE_URL=https://www.dosadvocacia.com.br` e as variáveis Wix aprovadas.
6. Alterar o webhook Wix para `https://www.dosadvocacia.com.br/api/webhook/wix-blog`.
7. Manter o site Wix publicado como contingência, porém sem o domínio público apontar para ele.

### Smoke test de produção

- `https://www.dosadvocacia.com.br/` responde 200;
- `https://www.dosadvocacia.com.br/blog` responde 200;
- três artigos de amostra respondem 200 com conteúdo correto;
- `/sitemap.xml` contém o blog e os artigos;
- uma publicação Wix atualiza a página pública;
- Search Console inspeciona uma URL e recebe sitemap;
- não há alteração em e-mail corporativo.

## Rollback

Se houver erro crítico de conteúdo, indexação, webhook ou domínio:

1. Não apagar posts nem credenciais.
2. Desativar a subscription do webhook ou remover temporariamente as variáveis Wix do ambiente afetado, conforme a causa.
3. Reverter o deployment Vercel para o último deployment funcional, se necessário.
4. Se o domínio já tiver sido cortado e houver indisponibilidade, restaurar apenas os registros `@` e `www` anteriores, preservando todos os registros de e-mail.
5. Registrar URL afetada, horário, causa, ação e resultado antes de retomar.

## Resultado das Fases 1 e 2 — 11 de julho de 2026

Auditoria concluída sem criar credenciais, webhooks, variáveis, deployment ou DNS:

- **86 posts publicados** confirmados. Há 2 rascunhos e 19 itens na lixeira, fora do escopo da migração.
- As URLs públicas atuais já usam `/post/[slug]`; não há redirecionamentos 301 por mudança de path a criar.
- Não foram encontrados slugs duplicados. Há dois títulos quase idênticos, diferenciados pelo sufixo `-1`, que devem ser revisados editorialmente.
- O acervo contém predominantemente texto, uma ou duas imagens, links e citações. A amostra não encontrou tabelas ou embeds, mas o renderer deve aceitar Rich Content futuro de forma segura.
- O perfil de escritora publicado ainda exibe **Dra. Drielle Oliveira** em 85 posts e um post tem autoria `drielle90`. Corrigir os perfis no Wix antes do corte de DNS é requisito de marca.
- O modelo atual da API precisa de `fieldsets` para receber conteúdo, Rich Content, SEO, mídia e URL. Sem isso, o site novo não renderizaria o conteúdo real.
- O endpoint do webhook deve verificar assinatura JWT, mas não deve presumir `issuer`, `audience` ou validade de 60 segundos antes de validar o token real. Também deve responder rapidamente, sem uma consulta síncrona ao Wix no caminho crítico.

## Revalidação para edições sem webhook nativo

O catálogo do Wix confirmou apenas eventos de criação e exclusão de posts. Enquanto não houver evento nativo de edição/publicação, usar a rota interna `POST /api/revalidate/wix-blog` após uma alteração editorial.

- A rota exige `Authorization: Bearer <WIX_REVALIDATION_SECRET>` ou o cabeçalho de servidor `x-revalidation-secret` com o mesmo valor.
- O segredo existe somente em variáveis de ambiente do destino correspondente; nunca no Wix, navegador, URL, chat, Git ou `NEXT_PUBLIC_`.
- A chamada invalida a tag do Wix Blog, `/blog`, `/post/[slug]` e `/sitemap.xml`. Não recebe ou grava o conteúdo do artigo.
- Procedimento para a redatora: publicar/editar no Wix e avisar o responsável: **"Revalide o blog Wix"**. O responsável autorizado executa a chamada segura e confirma a URL atualizada.
- O ISR continua sendo contingência. Para produção, criar outro segredo distinto somente quando o corte for aprovado.

### Estado de validação em Preview - 13 de julho de 2026

- O endpoint respondeu HTTP 200 com `{ "revalidated": true }` no deployment de Preview da branch `preview/wix-blog-validation`.
- `WIX_REVALIDATION_SECRET` foi armazenado como Sensitive e apenas em Preview. Não há valor de revalidação em Production.
- Os dois webhooks Wix exclusivos da validação (criação e exclusão) foram removidos após o teste. A proteção por login do Preview foi reativada.
- Não houve alteração em Production, domínio, DNS, e-mail, posts Wix ou perfis de autora.
- O alias de branch e URLs imutáveis de Preview não devem ser usados em webhook permanente. Antes da produção, refazer a validação com a URL canônica aprovada e um segredo diferente.

## Prompt de configuração para o próximo agente

```text
Leia integralmente AGENTS.md, PROJECT_CONTEXT.md e docs/WIX_BLOG_INTEGRATION_HANDOFF.md.

Objetivo: configurar e validar a integração em Preview, depois de receber autorização explícita para criar recursos no Wix e na Vercel.

Antes de qualquer alteração, confirme que a main contém a preparação técnica e que `npm run test:wix`, `npm run typecheck` e `npm run build` estão verdes.

Fora de escopo sem autorização explícita: domínio, DNS, produção, alteração de posts, perfis de autora ou dados do Wix.

Ao receber autorização para Preview, crie a API Key de leitura mínima, a Custom App e o webhook de Preview conforme as Fases 3 e 4. Nunca exponha segredos, tokens, chaves completas, payloads de webhook ou dados pessoais de clientes.
Nunca exponha segredos, tokens, chaves completas, payloads de webhook ou dados pessoais de clientes.
Execute typecheck, build e testes relevantes. Faça commit e push somente se eu autorizar explicitamente.
```

### Corte de Production concluído — 13 de julho de 2026

- Production foi publicada a partir de `main` no projeto oficial da Vercel. As variáveis necessárias foram aplicadas como Sensitive em Production e houve redeploy posterior para que o build as consumisse.
- `SITE_URL` de Production usa `https://www.dosadvocacia.com.br`; `WIX_REVALIDATION_SECRET` é diferente do Preview e não foi revelado.
- Vercel recebeu `dosadvocacia.com.br` e `www.dosadvocacia.com.br`. A raiz está em redirect 308 para `www`.
- No Registro.br foram alterados somente `A dosadvocacia.com.br -> 216.198.79.1` e `CNAME www.dosadvocacia.com.br -> 82aaee17cb676f6c.vercel-dns-017.com.`. MX, SPF, TXT de verificação e `autodiscover` permaneceram inalterados.
- Smoke test público aprovado: `/`, `/blog`, um artigo real, `/sitemap.xml` e `/robots.txt` responderam 200. O artigo conferido possui canonical, description, Open Graph e `BlogPosting`; o sitemap o contém.
- Nenhum webhook Wix foi cadastrado em Production. O fluxo seguro para edição/publicação segue sendo revalidação sob demanda até existir evento nativo de update/publish e uma nova validação da assinatura.
