# DOS Advocacia Imobiliária

Site institucional da DOS Advocacia Imobiliária, com Drielle Pereira como profissional apresentada no projeto. O site é desenvolvido em **Next.js 16 (App Router)** para publicação na Vercel e está preparado para usar o Wix Blog como painel editorial em uma etapa posterior.

## Continuidade para agentes

Antes de qualquer análise ou alteração, leia integralmente [AGENTS.md](AGENTS.md) e [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md). O contexto registra as decisões de marca, o estado técnico, as fases de migração, os riscos de SEO e as pendências operacionais.

## Executar localmente

Requer Node.js 20.9 ou superior.

```powershell
npm install
npm run dev -- --port 4173
```

Abra `http://localhost:4173`.

Validações de produção:

```powershell
npm run typecheck
npm run build
```

## Arquitetura atual

- Next.js 16, React 19, TypeScript e App Router;
- páginas institucionais preservadas em rotas limpas, com o HTML previamente aprovado mantido em `src/legacy-pages/` e renderizado no servidor;
- imagens, logotipos e manifesto em `public/`;
- metadados, canonical, Open Graph, JSON-LD, `robots.txt` e `sitemap.xml` gerados pelo App Router;
- redirecionamentos permanentes das antigas URLs `*.html` para as rotas limpas;
- base segura para Wix Blog em `src/lib/wix/` e webhook em `src/app/api/webhook/wix-blog/`.

As páginas `/blog` e `/post/[slug]` permanecem indisponíveis até a configuração da integração Wix. Isso evita publicar conteúdo parcial, expor credenciais ou indexar páginas sem a fonte editorial validada.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` somente quando a integração for autorizada. Nunca versione valores reais.

| Variável | Finalidade |
| --- | --- |
| `WIX_API_KEY` | Chave de API Wix com permissão mínima **Read Blog**. |
| `WIX_SITE_ID` | Site ID correspondente ao Wix Blog. |
| `WIX_APP_ID` | App ID da Custom App Wix que assina os webhooks. |
| `WIX_WEBHOOK_PUBLIC_KEY` | Chave pública usada para validar o JWT do webhook. |
| `SITE_URL` | URL canônica. Usar o domínio público somente depois do corte de DNS. |

As chaves são usadas apenas em módulos de servidor. O webhook valida JWT RS256, emissor e audiência, ignora o corpo como fonte de conteúdo e consulta o Wix antes de revalidar cache, listagem e sitemap.

## Próxima etapa: integração editorial Wix

1. Criar/configurar a Custom App e a API Key de leitura do Wix Blog.
2. Validar, com o acervo real, os 86 posts publicados e as URLs atuais `/post/[slug]`.
3. Preservar cada slug exatamente como está, incluindo caracteres acentuados; não normalizar nem recriar URLs sem necessidade.
4. Validar título, descrição, autora, datas, imagens, Rich Content, HTML, sitemap e eventuais redirecionamentos 301.
5. Configurar os eventos de post criado, atualizado e excluído no endpoint público da Vercel.
6. Testar em preview antes de qualquer alteração de DNS.

Não houve deploy, alteração de domínio, DNS, Wix ou credenciais nesta migração.
