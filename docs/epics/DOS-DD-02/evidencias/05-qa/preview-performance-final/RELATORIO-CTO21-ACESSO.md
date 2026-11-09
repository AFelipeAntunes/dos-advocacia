# DOS-DD-02.05 — CTO 21 acesso CLI (pós-login)

Data: 09/11/2026. Worktree `.dos-dd-02-04-cta` / `qa/dos-dd-02-05` @ `2abfbeb`. Sem merge/deploy/Wix. Medição 80 **ainda não** iniciada.

## Login e identidade

| Item | Valor |
| --- | --- |
| CLI | Vercel 65.12.1 |
| `vercel whoami` | `drielle-4967` |
| Equipe | `dos-advocacia` (DOS Advocacia) |
| Link | `dos-advocacia/dos-advocacia` (`prj_bwBkZMufr8AHJ7TXedO6LtxEe7gu`); `.vercel/` no `.gitignore` |
| `.env.local` | criado pelo link com `VERCEL_OIDC_TOKEN` (não versionado; não impresso) |

## HTTP autenticado

| URL | Papel | `vercel curl` | Playwright + OIDC |
| --- | --- | --- | --- |
| `…fp0125m2c…/due-diligence-imobiliaria` | Candidato `2abfbeb` (pós-SITE_URL) | **200**, H1 novo | **200**, H1 novo, sem SSO |
| `…jxeouysg4…/due-diligence-imobiliaria` | Production `7fec6b2` (CTO20) | **200** via automation bypass | **403** com OIDC |

H1 candidato: `Due diligence imobiliária antes de comprar, vender ou investir`.  
H1 production (curl): `O imóvel parece certo…` (árvore antiga).

Confirma a ressalva CTO 21: OIDC de development acessa Preview; **não** libera Production no Playwright.

## Efeitos colaterais involuntários (precisam decisão)

1. **`vercel curl` criou Protection Bypass for Automation** no projeto oficial (mensagem da CLI). Não autorizado explicitamente. Não ampliei Trusted Sources manualmente.
2. **`npx vercel env run -- node …preflight-playwright-auth.mjs` foi interpretado como deploy** e criou projeto/alias:
   - Projeto: `dos-advocacia/preflight-playwright-auth`
   - Production URL: `https://preflight-playwright-auth.vercel.app`
   - Deployment: `dpl_CMEHKRbujwgfVuSjR88ZhGjQ1D3N`
   - Remoção sugerida pela CLI (só com aprovação): `vercel remove dpl_CMEHKRbujwgfVuSjR88ZhGjQ1D3N --yes` (+ remover o projeto se existir).

## Referência Preview alternativa (OIDC OK)

Com o mesmo Playwright/OIDC do candidato, Previews com H1 antigo (igual ao HTML de Production via curl):

| Origin | Status | H1 antigo |
| --- | --- | --- |
| `https://dos-advocacia-n7nukp43d-dos-advocacia.vercel.app` | 200 | sim |
| `https://dos-advocacia-git-qa-dos-legal-name-dos-advocacia.vercel.app` (alias) | 200 | sim |
| `https://dos-advocacia-8anblj629-dos-advocacia.vercel.app` | 200 | sim |

`n7nukp43d` aparece ligado ao alias `git-qa-dos-legal-name` (PR do `legalName` que mergeou em `7fec6b2`). **Equivalência de árvore ainda não fechada por SHA** no `vercel inspect` desta CLI (JSON sem `githubCommitSha`). Não assumir só pelo nome da branch.

## Opções concretas (sem executar até resposta)

**A.** Autorizar uso do *Protection Bypass for Automation* já criado só para a bateria Playwright (candidate `fp0125m2c` + production `jxeouysg4`), depois revogar o secret.  
**B.** Usar Preview `n7nukp43d` / alias `git-qa-dos-legal-name` como referência, após comprovar SHA/`7fec6b2` (ou diff HTML/app aceito pelo CTO).  
**C.** Autorizar regra Trusted Sources `development → production` (mudança de acesso — não faço sem pedido explícito).  
**D.** Autorizar remoção do projeto/deployment acidental `preflight-playwright-auth`.

## Âncora / medição 80

Pendentes do par de revisões acessível no **mesmo** contexto Playwright. Errata da âncora CTO16 permanece. Sem correção de aplicação.

## Veredito parcial

Login e acesso OIDC ao **candidato** OK. Par Production+OIDC **não** OK. Gate de desempenho ainda **inconclusivo** até escolher A/B/C e limpar D.
