# Arquitetura do site - DOS Advocacia Imobiliária

> Documento operacional para futuras atualizações. Ler junto com `AGENTS.md` e `PROJECT_CONTEXT.md` antes de alterar código, Wix, Vercel ou DNS.

## Visão geral

O site público é uma aplicação **Next.js 16 App Router** publicada na **Vercel**. O **Wix Blog** é somente o painel editorial: ele continua recebendo rascunhos, imagens e publicações, enquanto leitores e buscadores acessam páginas renderizadas pelo Next.js no domínio da DOS.

```text
Redatora -> Wix Blog -> API Wix (somente servidor) -> Next.js/Vercel -> visitante e buscadores
                                              ^
                           revalidação segura sob demanda
```

Não usar iframe, redirect de leitores ao Wix ou uma segunda origem para os artigos. O contrato público é `/post/[slug]` e o slug deve ser preservado exatamente, inclusive acentos.

## Componentes e responsabilidades

| Camada | Responsabilidade | Não fazer |
| --- | --- | --- |
| `src/legacy-pages/` | Conteúdo institucional preservado e semântica das páginas | Editar links sem atualizar SEO/redirects |
| `src/app/` | Rotas, metadata, sitemap, robots e handlers de servidor | Inserir segredos ou chamadas Wix no cliente |
| `src/lib/wix/` | Cliente Wix, tipos, Rich Content, SEO, assinatura e revalidação | Confiar no corpo do webhook como conteúdo |
| `public/assets/` | Marca e imagens WebP otimizadas | Adicionar originais PNG pesados ou logos com nome antigo |
| Vercel | Build, deploy, Analytics, Speed Insights, ambiente e domínio | Misturar segredos Preview e Production |
| Wix | Backoffice dos artigos | Hospedar a experiência pública após o corte |
| Registro.br | DNS do domínio | Alterar MX, SPF, DKIM, TXT ou e-mail sem necessidade |

## Rotas e SEO

- Institucional: `/`, `/sobre`, `/areas-de-atuacao`, serviços, `/treinamentos` e `/contato`.
- Blog: `/blog` é a listagem editorial; cada artigo é `/post/[slug]`.
- Compatibilidade: `/conteudos` e `/conteudos.html` redirecionam permanentemente para `/blog`.
- Descoberta: `robots.ts` e `sitemap.ts` geram URLs com base em `SITE_URL`. O sitemap só inclui artigos quando a integração Wix estiver configurada.
- Artigos devem preservar metadata, canonical, Open Graph, Twitter e `BlogPosting` JSON-LD. A autoria canônica exibida é **Drielle Pereira**.

## Conteúdo Wix e cache

O servidor consulta a Wix Blog API com os fieldsets de texto, Rich Content, SEO e URL. A renderização de Rich Content é deliberadamente segura: não usa HTML bruto de terceiros.

| Evento | Comportamento |
| --- | --- |
| Listagem/leitura normal | ISR com revalidação de uma hora |
| Webhook Wix válido | Invalida tag do blog, listagem, artigos e sitemap |
| Edição/publicação sem evento nativo | Responsável autorizado chama `POST /api/revalidate/wix-blog` |

O catálogo Wix usado nesta integração disponibilizou eventos de criação e exclusão, mas não de edição/publicação. Por isso a revalidação sob demanda existe como fluxo operacional. A redatora não recebe segredo: publica no Wix e solicita ao responsável “Revalide o blog Wix”.

## Segredos e ambientes

Nunca commitar, exibir, colocar em URL, usar `NEXT_PUBLIC_` ou registrar em logs:

- `WIX_API_KEY`
- `WIX_WEBHOOK_PUBLIC_KEY`
- `WIX_REVALIDATION_SECRET`

Variáveis esperadas: `WIX_API_KEY`, `WIX_SITE_ID`, `WIX_APP_ID`, `WIX_WEBHOOK_PUBLIC_KEY`, `WIX_REVALIDATION_SECRET` e `SITE_URL`.

- **Preview:** usado para validação isolada. Deve permanecer protegido por Vercel Authentication quando não houver teste em andamento.
- **Production:** exige valores próprios e `SITE_URL=https://www.dosadvocacia.com.br`; não copiar o segredo de revalidação do Preview.

## Processo de deploy e DNS

1. Validar localmente com `npm run test:wix`, `npm run typecheck` e `npm run build`.
2. Validar em Preview, incluindo `/blog`, três artigos, `/sitemap.xml`, metadata e uma revalidação autorizada.
3. Integrar a alteração em `main`; o GitHub dispara o deploy Production na Vercel.
4. Configurar variáveis Production e confirmar build verde antes do corte DNS.
5. Adicionar `dosadvocacia.com.br` e `www.dosadvocacia.com.br` na Vercel. No Registro.br, alterar somente os registros web indicados pela Vercel para `@` e `www`.
6. Preservar todos os registros de e-mail. Fazer smoke test do domínio, blog, três artigos, sitemap, Analytics e Speed Insights.

## Rollback

- Conteúdo/cache: revalidar novamente ou remover temporariamente a variável Wix do ambiente afetado.
- Deploy: promover o deployment anterior funcional na Vercel.
- DNS: restaurar somente os registros `@` e `www` anteriores, preservando e-mail.
- Nunca apagar posts, API Keys ou registros DNS como primeira resposta.
