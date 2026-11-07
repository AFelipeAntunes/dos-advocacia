# DOS-DD-02.03 — Evidências locais (landing e links)

Card: `03-LANDING-E-LINKS.md` v1.0  
Checkout: worktree `D:\Projetos desenvolvimento\.dos-dd-02-03-landing`  
Branch: `landing/dos-dd-02-03`  
Base: `origin/main` @ `7fec6b2fb2da7dc5408498099e7c4917aa33bb4d`  
Copy aceita: `copy-final.md` SHA-256 `9af22a5932ff9a15f96b1354cdb9f6431d60f0b19a17f7573a2b34c1a00e7165`  
Ambiente das provas: build local + `next start -p 3013` (não é Preview nem Production)

## Arquivos de aplicação alterados

- `src/legacy-pages/due-diligence-imobiliaria.html` — reescrita completa (SEO, schema, copy, FAQ, CTAs, links)
- `src/legacy-pages/index.html` — card Home: H3 “Due diligence imobiliária”, href limpo
- `src/legacy-pages/assessoria-juridica-compra-de-imovel.html` — âncora “análise completa do imóvel e das partes antes da compra”
- `src/legacy-pages/advogada-imobiliaria.html` — demandas + áreas
- `src/legacy-pages/advogada-imobiliaria-curitiba.html` — áreas
- `public/site-interactions.js` — WhatsApp pós-sucesso identifica due diligence
- `src/lib/contact-form.test.ts` — cobertura do formulário/WhatsApp DD
- `PROJECT_CONTEXT.md` — status / alterações / pendências

## Capturas

| Arquivo | Viewport |
| --- | --- |
| `dd-desktop-1440.png` | 1440×900 hero |
| `dd-desktop-1440-full.png` | 1440 full page |
| `dd-tablet-1000.png` | 1000×900 |
| `dd-tablet-768.png` | 768×1024 |
| `dd-mobile-390.png` | 390×844 hero |
| `dd-mobile-390-full.png` | 390 full page |
| `dd-links-atendimento-1440.png` | links compra/contratos |
| `dd-faq-1440.png` | FAQ visível |
| `dd-form-success-intercept.png` | sucesso do form (API interceptada) |

## Provas

- `dom-proof.json` — metadata, schema alinhado (`legalName`, CEP, Google `sameAs`), FAQ×6, form attrs, âncoras, posts 200
- `diff-aplicacao.patch` — diff das mudanças de aplicação
- `validacao.md` — typecheck/build/testes
- `hashes-sha256.txt` — hashes deste pacote

## Operações externas

Nenhuma. Sem commit, push, PR, deploy, env, Wix ou e-mail/WhatsApp reais (form interceptado).

## Gate CTO

Revisar copy renderizada, schema, âncoras institucionais, WhatsApp pós-form e capturas. Liberar integração/PR somente com autorização concreta de Felipe.
