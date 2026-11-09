# CTO 21 — status do login CLI

08/11/2026. Worktree `.dos-dd-02-04-cta`.

## Tentativas

Três fluxos `npx vercel login` (device OAuth) foram iniciados neste ambiente. Em todos, a CLI ficou em espera ~10 min e saiu com código 1 sem registrar sessão.

Códigos gerados (já expirados): `FWNQ-BCJR`, `RCCP-FKJL`, `LWZF-XNKP`.

## Estado atual

`npx vercel whoami` → **Logged out**.

Sem sessão CLI, não há `vercel curl` nem header OIDC para Playwright. Bateria CTO 20 e âncora Preview **não** iniciadas.

## O que falta (ação humana)

1. Responder neste chat quando puder autorizar, ou
2. Rodar localmente `npx vercel login`, concluir o device link no navegador e avisar.

Depois do login bem-sucedido, o agente retoma: whoami → link ao projeto `dos-advocacia` (só se necessário) → HTTP autenticado no candidato `fp0125m2c` → mesmo contexto Playwright → checagem da referência Production/`jxeouysg4` ou Preview equivalente a `7fec6b2` → medições CTO 20.
