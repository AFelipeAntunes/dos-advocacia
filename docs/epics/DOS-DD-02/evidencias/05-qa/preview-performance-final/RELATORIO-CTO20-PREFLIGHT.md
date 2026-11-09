# DOS-DD-02.05 — CTO 20 preflight (bloqueio de acesso)

Data: 08/11/2026. Worktree: `D:\Projetos desenvolvimento\.dos-dd-02-04-cta`. Branch: `qa/dos-dd-02-05` @ `2abfbebab000a89250e0c18a29b06d0a161c6864`. Sem commit/push/PR/deploy/env/Wix nesta devolução.

## Referências / SHA

| Papel | SHA | URL usada |
| --- | --- | --- |
| Base | `7fec6b2fb2da7dc5408498099e7c4917aa33bb4d` | https://dos-advocacia-jxeouysg4-dos-advocacia.vercel.app/due-diligence-imobiliaria |
| Candidato (aplicação = lote PR; commit documental SITE_URL) | `2abfbebab000a89250e0c18a29b06d0a161c6864` | https://dos-advocacia-fp0125m2c-dos-advocacia.vercel.app/due-diligence-imobiliaria |

Identidade: `fp0125m2c` é o Preview **após** o override de `SITE_URL` (parecer 19), não o primeiro Preview da PR (`keu822p1e` / `74293fe`). Preservado conforme CTO 20.

## Acesso / método

| Checagem | Resultado |
| --- | --- |
| `npx vercel whoami` | **Logged out** (`preflight-vercel-whoami.txt`) |
| `.vercel/project.json` neste worktree | ausente |
| `VERCEL_TOKEN` / `VERCEL_OIDC_TOKEN` no ambiente | ausentes |
| HEAD candidato (sem auth) | **302** → `https://vercel.com/sso-api?url=...fp0125m2c...` |
| HEAD baseline (sem auth) | **302** → `https://vercel.com/sso-api?url=...jxeouysg4...` |

Cabeçalhos brutos: `preflight-candidate-headers.txt`, `preflight-baseline-headers.txt`. Nenhum cookie/token capturado.

**Bloqueio exato:** Deployment Protection (Vercel Authentication / SSO) nas duas URLs + CLI Vercel deslogada neste ambiente Windows. Sem OIDC Trusted Sources disponível para Playwright/CDP.

**Menor passo de autenticação (sem nova chave pública / sem desligar proteção):**

1. No mesmo worktree (ou após `npx vercel link` ao projeto oficial `dos-advocacia` / equipe DOS Advocacia): `npx vercel login` com a conta já autorizada no projeto.
2. Confirmar: `npx vercel whoami` e acesso com `npx vercel curl` às duas URLs (200 HTML da landing, não página SSO).
3. Para a bateria Playwright: `npx vercel env run --` injetando `x-vercel-trusted-oidc-idp-token` só nas origens `*.vercel.app` autorizadas (skill `access-protected-vercel-deployment`). Não copiar cookies do navegador pessoal; não criar bypass secret; não pedir desativar proteção.

Medição 80 células e âncora no Preview **não** foram executadas — conforme handoff CTO 20 (“se acesso não disponível, devolver imediatamente”).

## Resultados antes/depois

Não há medição remota nesta devolução. Artefatos locais anteriores (CTO 13/15/16) permanecem em `evidencias/05-qa/` e **não** foram apagados. Gate mobile Preview continua aberto.

## Âncora — errata

Fonte histórica `cto16-scope-and-qa.json` (local `:3025`, não Preview):

- `formAnchorExists: true` (id `due-diligence-imobiliaria-contact-title` no `div.sr-only` gerado por `contact-form.ts`)
- `anchorInView: false`
- `formTop`: 2033 (desktop) / 3491 (mobile)

**Errata CTO 20 aplicada:** a navegação por fragmento **não** foi aceita como prova. O critério `rect.top < innerHeight` era insuficiente e, no JSON, `anchorInView` já era `false`. Separar: (1) id existe no documento; (2) link `href="#…"` interno — **ausente** na copy aprovada (não é defeito por si); (3) navegação visível funcionando — **não comprovada**. Reprodução no Preview candidato fica pendente do preflight. Sem correção de aplicação neste card.

## Gaps

1. Autenticação Vercel CLI / OIDC local para as duas Previews protegidas.
2. Bateria 10× revisão × desktop/mobile × frio/quente (80) no Preview equivalente.
3. Reprodução dirigida da âncora no candidato `fp0125m2c` com limites superior **e** inferior do viewport.
4. GA4/DebugView real e demais gates conectados do card 05 (já conhecidos).

## Veredito

**Inconclusivo** para desempenho Preview e para âncora remota — bloqueado no preflight de acesso.  
**Apto** apenas como devolutiva de capacidade/diagnóstico (alinhado ao CTO 20: “não é aceite de desempenho”; card 05 continua aberto).

Sem commit, push, PR novo, merge, deploy, env, Wix, formulário real ou WhatsApp real.
