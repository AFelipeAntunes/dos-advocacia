# DOS Advocacia Imobiliária

Site institucional da DOS Advocacia Imobiliária, com Drielle Pereira como profissional apresentada no projeto. Desenvolvido em **Next.js 16 (App Router)** para publicação na Vercel, combina conteúdo renderizado no servidor, identidade visual própria e uma fundação segura para usar o Wix Blog como painel editorial.

## Continuidade para agentes

Antes de qualquer análise ou alteração, leia integralmente [AGENTS.md](AGENTS.md), [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) e [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). O contexto registra as decisões de marca, o estado técnico, as fases de migração, os riscos de SEO e as pendências operacionais.

## Executar localmente

Requer Node.js 20.9 ou superior.

```powershell
npm install
npm run dev -- --port 4173
```

Abra `http://localhost:4173`.

Validações de produção:

```powershell
npm run test:wix
npm run test:analytics
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
- cluster SEO com `/advogada-imobiliaria` como página nacional e `/advogada-imobiliaria-curitiba` como página-satélite, mantendo os slugs já indexados;
- landing `/assessoria-juridica-compra-de-imovel` para compradores, proprietários e investidores, ligada à página nacional e à due diligence sem alterar os slugs existentes;
- redirecionamentos permanentes das antigas URLs `*.html` para as rotas limpas;
- base segura para Wix Blog em `src/lib/wix/` e webhook em `src/app/api/webhook/wix-blog/`.

O site público está ativo em `https://www.dosadvocacia.com.br`. O Wix permanece como painel editorial, enquanto `/blog` e `/post/[slug]` são renderizados pelo Next.js na Vercel. O cache editorial usa ISR de uma hora, recebe revalidação on-demand pelo webhook Wix Blog `Post Updated` e mantém uma rota interna protegida como contingência.

O GA4 usa o fluxo web `G-37RDFTHKL8`. Nos artigos, cliques em WhatsApp geram `click_whatsapp` com `post_slug`, `cta_position`, `link_url` e `cluster` quando inferível; links para serviços geram `click_cta_servico` com `post_slug`, `destino` e `cta_position`. O primeiro é a conversão principal e deve permanecer marcado como evento-chave no painel GA4.

As páginas institucionais estratégicas são `/advogada-imobiliaria`, como página nacional, `/advogada-imobiliaria-curitiba`, como satélite local, e `/assessoria-juridica-compra-de-imovel`, como landing transacional de compra. Menu, rodapé, canonical, Open Graph, JSON-LD e sitemap devem permanecer coerentes entre essas rotas.

## Voz e identidade

- Nome profissional: **Drielle Pereira**.
- Descritor profissional preferido: **advogada imobiliarista**. A marca **DOS Advocacia Imobiliária** e os slugs existentes permanecem inalterados.
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
| `WIX_APP_ID` | App ID da Custom App Wix, necessário para a configuração e auditoria no painel. |
| `WIX_WEBHOOK_PUBLIC_KEY` | Chave pública usada para validar o JWT do webhook. |
| `WIX_REVALIDATION_SECRET` | Segredo exclusivamente de servidor para invalidar o cache editorial sob demanda. |
| `SITE_URL` | URL canônica. Usar o domínio público somente depois do corte de DNS. |

As chaves são usadas apenas em módulos de servidor. O webhook valida a assinatura JWT RS256 com a chave pública, ignora o corpo como fonte de conteúdo e invalida cache, listagem e sitemap sem consultar o Wix antes da resposta.

### Atualização editorial imediata

O Wix continua sendo o único painel da redatora. Depois de publicar ou editar um artigo, ela pode solicitar ao responsável técnico: **"Revalide o blog Wix"**. O responsável usa a rota interna `POST /api/revalidate/wix-blog` com o segredo `WIX_REVALIDATION_SECRET`, armazenado apenas na Vercel. A rota invalida o cache do blog, dos artigos e do sitemap sem receber nem registrar o conteúdo do post.

Não compartilhar esse segredo, não criar links com ele e não chamar a rota pelo navegador. O Wix oferece o evento Blog `Post Updated`; a Custom App deve assiná-lo com destino a `https://www.dosadvocacia.com.br/api/webhook/wix-blog`. O ISR e a rota interna permanecem como contingências se a entrega do webhook falhar.

## Operação editorial Wix

1. A redatora publica ou edita o artigo no Wix.
2. O evento `Post Updated` chama `/api/webhook/wix-blog`, que valida a assinatura e invalida a tag do blog, a listagem, os artigos e o sitemap.
3. Se o webhook não for entregue, um responsável autorizado chama `POST /api/revalidate/wix-blog` sem expor o segredo.
4. Conferir o artigo, a listagem e o sitemap no domínio público.
5. Preservar cada slug exatamente como está, incluindo caracteres acentuados; não normalizar nem recriar URLs sem necessidade.
6. Validar title, description, autora, datas, imagens, Rich Content, canonical e `BlogPosting` em mudanças estruturais do renderer.

Posts B2B direcionados a imobiliárias e administradoras preservam esse posicionamento. Alterações de título e abertura dos posts B2C são feitas no Wix pela responsável editorial e exigem revalidação posterior; não devem ser reproduzidas como conteúdo estático no repositório.

Pushes em `main` disparam o deploy de produção do projeto oficial na Vercel. Alterações de domínio, DNS, Wix, credenciais ou variáveis de ambiente continuam exigindo autorização explícita e validação específica.
