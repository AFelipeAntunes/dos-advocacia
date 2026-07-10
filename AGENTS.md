# Instruções para agentes — DOS Advocacia Imobiliária

## Leitura obrigatória

Antes de analisar, alterar, publicar ou recomendar qualquer mudança, leia integralmente [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md). Ele é a fonte de verdade para negócio, marca, SEO, arquitetura, estado do repositório e rollout Wix/Vercel.

## Fluxo de trabalho

1. Leia `PROJECT_CONTEXT.md`.
2. Verifique branch, `git status` e escopo do pedido.
3. Identifique impacto em marca, SEO, conteúdo, imagens, Wix, Vercel, domínio ou deploy.
4. Implemente somente a menor mudança segura e reversível.
5. Para código Next, execute `npm run typecheck` e `npm run build`; valide em navegador as páginas visualmente afetadas.
6. Ao concluir, atualize no `PROJECT_CONTEXT.md`: **Status atual**, **Alterações recentes** e **Pendências e recomendações**.
7. Relate o que foi validado e o que permaneceu pendente.

## Marca e conteúdo

- Nome profissional canônico: **Drielle Pereira**. Nunca usar “Drielle Oliveira”.
- Marca e domínio: **DOS Advocacia Imobiliária** / `dosadvocacia.com.br`.
- Tipografia: Urbanist.
- Paleta: `#0b1e47`, `#49596c`, `#8fabbc`, `#194951`, `#eb574d`, `#e4e5df`.
- A voz principal fala diretamente com **você**; Drielle fala em primeira pessoa quando relata experiência ou autoridade profissional.
- A primeira frase de cada bloco deve trazer argumento, situação ou risco concreto. Evite aberturas institucionais lentas.
- Não usar travessão largo, dois-pontos decorativos, paralelismo artificial de três itens nem conectores automáticos como “é importante destacar”, “vale ressaltar”, “nesse contexto”, “além disso” e “por fim”.
- A comunicação deve ser elegante, humana, objetiva e informativa, sem promessas de resultado, superlativos promocionais ou captação antiética.
- Antes de usar novas fotos de turmas, clientes ou terceiros, confirmar autorização de imagem.

## Regras técnicas e SEO

- A arquitetura ativa é Next.js 16 App Router, React 19 e TypeScript; não recriar arquivos HTML na raiz.
- O HTML institucional preservado está em `src/legacy-pages/`. Mudanças visuais devem preservar semântica, responsividade e acessibilidade.
- Preserve títulos, descriptions, canonical, Open Graph, JSON-LD, `robots.ts` e `sitemap.ts` quando uma alteração afetar SEO.
- Toda nova imagem deve ser otimizada e ter `alt` descritivo.
- Preserve a camada visual CSS-first: animar apenas `transform` e `opacity`, manter o LCP independente de JavaScript e respeitar `prefers-reduced-motion`.
- Símbolos oficiais publicados estão em `public/assets/brand/`. Os wordmarks enviados ainda exibem “Drielle Oliveira” e foram isolados em `design-assets/brand-legacy/`; não os mova de volta para `public/` sem a correção gráfica.
- Fotos otimizadas em WebP ficam em `public/assets/images/`. Não versionar os PNGs originais de alta resolução.
- URLs `*.html` antigas devem continuar com redirecionamento 301 específico; não redirecionar todo o acervo para a home.

## Wix Blog e Vercel

- O Wix é o backoffice editorial; a Vercel serve o site público. Nunca usar iframe ou redirecionar leitores ao Wix.
- O padrão de URL aprovado para o acervo é `/post/[slug]`. Existem 86 posts informados; validar a contagem e cada URL com a API antes do corte.
- Slugs são case-sensitive e podem ter acentos. Preserve-os exatamente; apenas decodifique percent-encoding de forma segura para a consulta à API.
- Chaves Wix ficam exclusivamente em `.env.local`/Vercel. Nunca em código cliente, log, commit ou documentação.
- O endpoint `/api/webhook/wix-blog` só pode revalidar após validar o JWT RS256, emissor e audiência. O evento é apenas gatilho: recarregue a fonte Wix, trate duplicatas de forma idempotente e nunca use o corpo do webhook como conteúdo.
- Não ative `/blog`, `/post/[slug]`, sitemap de posts ou webhook em produção sem validar credenciais, conteúdo, imagens, schema e preview.

## Ações que exigem autorização explícita

Não faça sem pedido explícito do usuário:

- commit, push, merge ou criação de pull request;
- deploy, alteração de Vercel, DNS, domínio, HTTPS ou rollback;
- criação/rotação de API Key, Custom App Wix, webhook ou variáveis de ambiente;
- alteração de registros MX, SPF, DKIM, TXT ou dados publicados no Wix;
- inclusão de analytics, formulários externos ou dependências de terceiros.

## Git

- Repositório: `AFelipeAntunes/dos-advocacia` (privado).
- Estratégia: somente `main`; não criar `develop` permanente.
- Para mudanças de maior risco, use branch temporária apenas quando solicitado.
