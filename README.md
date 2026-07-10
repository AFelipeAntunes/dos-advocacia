# DOS Advocacia Imobiliária

Site institucional da DOS Advocacia Imobiliária, com Drielle Pereira como profissional apresentada no projeto. Desenvolvido em **Next.js 16 (App Router)** para publicação na Vercel, combina conteúdo renderizado no servidor, identidade visual própria e uma fundação segura para usar o Wix Blog como painel editorial.

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

O checklist do projeto também inclui `npm audit --omit=dev`, QA visual em desktop/mobile, teste de `prefers-reduced-motion`, validação de canonical/schema/robots/sitemap e Lighthouse. Um post real só pode ser auditado depois da ativação segura do Wix Blog.

## Arquitetura atual

- Next.js 16, React 19, TypeScript e App Router;
- páginas institucionais em rotas limpas, com o conteúdo aprovado mantido em `src/legacy-pages/` e renderizado no servidor;
- imagens, logotipos e manifesto em `public/`;
- tipografia Urbanist servida por `next/font`, imagens WebP e microinterações CSS-first com `prefers-reduced-motion`;
- menu e scroll reveal em JavaScript nativo, sem hidratar um Client Component para interações simples;
- metadados, canonical, Open Graph, JSON-LD, `robots.txt` e `sitemap.xml` gerados pelo App Router;
- redirecionamentos permanentes das antigas URLs `*.html` para as rotas limpas;
- base segura para Wix Blog em `src/lib/wix/` e webhook em `src/app/api/webhook/wix-blog/`.

As páginas `/blog` e `/post/[slug]` permanecem indisponíveis até a configuração da integração Wix. Isso evita publicar conteúdo parcial, expor credenciais ou indexar páginas sem a fonte editorial validada. O site institucional, porém, já está preparado para receber esse acervo sem mudar o domínio público.

## Voz e identidade

- Nome profissional: **Drielle Pereira**.
- Tipografia: **Urbanist**.
- Paleta: `#0b1e47`, `#49596c`, `#8fabbc`, `#194951`, `#eb574d`, `#e4e5df`.
- Voz principal em segunda pessoa, com primeira pessoa da Drielle em trechos de experiência.
- Copy orientada a riscos concretos, sem promessa de resultado, superlativos promocionais ou instruções que substituam assessoria jurídica.
- Símbolo oficial em `public/assets/brand/` e imagens otimizadas em `public/assets/images/`. Os wordmarks com sobrenome antigo estão preservados, mas fora da área pública, em `design-assets/brand-legacy/`.

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
