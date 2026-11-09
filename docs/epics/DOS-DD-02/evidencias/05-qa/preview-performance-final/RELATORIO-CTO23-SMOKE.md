# RELATÓRIO CTO23 — smoke conectado curto

09/11/2026. Sem nova bateria 80. Sem mutação de aplicação. Sem Resend/WhatsApp real. Sem commit/push/merge/deploy.

## Identidade

| Campo | Valor |
| --- | --- |
| SHA | `2abfbebab000a89250e0c18a29b06d0a161c6864` |
| Preview | `https://dos-advocacia-fp0125m2c-dos-advocacia.vercel.app` |
| Branch | `qa/dos-dd-02-05` |
| Chrome | ver `smoke-cto23.json` |
| Auth | OIDC `extraHTTPHeaders` (sem bypass) |

## 1. Âncora real `#o-que-voce-recebe`

Link visível “Ver o que a análise entrega” presente em 1440 e 390. Clique define hash correto; H2 “O que você recebe” existe; campo inicial do formulário recebe foco por teclado.

**Falha de critério CTO:** após o clique, o H2 fica com `top: 0` sob o header sticky (~79–93 px). Sem `scroll-margin` no alvo. Link/hash/teclado ok; encobrimento pelo header **não** ok.

Capturas: `smoke-anchor-desktop.png`, `smoke-anchor-mobile.png`.

Proposta mínima (somente se Felipe autorizar no lote de release): `scroll-margin-top` no `#o-que-voce-recebe` (ou equivalente na seção), sem reescrever copy nem CTAs. Não aplicado neste smoke.

Fragmento sr-only do formulário permanece pendência técnica não bloqueante (CTO23).

## 2. CTAs em artigos reais + eventos (dataLayer/gtag local)

| Clique | Artigo | Evento | `cta_position` | `destino` / slug | `link_url`/PII |
| --- | --- | --- | --- | --- | --- |
| Compacto DD | Habite-se | `click_cta_servico` ×1 | `meio_artigo` | `due-diligence-imobiliaria` | ausentes |
| Final DD | Habite-se | `click_cta_servico` ×1 | `fim_artigo` | `due-diligence-imobiliaria` | ausentes |
| Secundário compra | Cessão | `click_cta_servico` ×1 | `fim_artigo` | `assessoria-juridica-compra-de-imovel` | ausentes |
| B2B | Fiador | `click_cta_servico` ×1 | `fim_artigo` | `assessoria-juridica-para-imobiliarias` | ausentes |

Inventário: Habite-se compacto+completo; Cessão com compra; Fiador só B2B (sem DD). WhatsApp contextual inspecionado (`wa.me` + `text=`), **não clicado**.

Instrumentação local ≠ DebugView GA4.

## 3. Formulário (interceptado)

Em `/due-diligence-imobiliaria`, `POST /api/contato` mockado:

- Erro 400: status “Dados inválidos.”; **zero** `generate_lead`.
- Sucesso 200: UI de sucesso; WhatsApp contextual DD; **um** `generate_lead` com só `page_slug`, `tipo_demanda`, `icp`, `form_location` (sem PII/`link_url`).
- WhatsApps de página com mensagem de imóvel/DD confirmados por href, sem envio.

Testes unitários `test:contact` / tracker R2 da mesma revisão permanecem válidos como prova de código; este smoke cobre Preview conectado.

## Checklist de liberação (para o CTO montar o lote)

- [x] D limpeza aceita (CTO23)
- [x] Desempenho lab Preview aceito (CTO23; 80/80; medianas sem piora)
- [x] CTAs/eventos Preview smoke
- [x] Formulário interceptado + generate_lead só no sucesso
- [ ] Âncora `#o-que-voce-recebe` sem encobrimento do header (gap UX; proposta `scroll-margin-top`)
- [ ] Autorização única de merge/produção (PR12 ainda rascunho)
- [ ] lastModified no `sitemap` = data do deploy efetivo (não preencher agora)
- [ ] Smoke pós-publicação: DebugView GA4 real + métricas de campo

### lastModified — proposta

Aplicar **somente no rollout efetivo**, na data civil do deploy autorizado, nas rotas com mudança substancial deste lote (no mínimo `/due-diligence-imobiliaria`; conferir Home/compra/nacional/Curitiba se o diff de release as incluir). Não usar a data deste smoke.

### Documentação local pendente de versionamento

Sem commit neste handoff. Pendente versionar quando autorizado:

- Pareceres `20`–`23` CTO
- `evidencias/05-qa/preview-performance-final/` (inclui `protection-*-pre.json` já sanitizado; não republicar cópia com secret)
- `evidencias/05-qa/site-url-preview-20261108/`
- `PROJECT_CONTEXT.md`, `00-EPICO.md`, `.gitignore`, `19-PREVIEW-SITE-URL-…`

## Veredito smoke

| Item | Resultado |
| --- | --- |
| 1 Âncora aprovada | **Parcial** — link/hash/teclado ok; H2 sob header sticky |
| 2 CTAs/eventos | **Pass** |
| 3 Formulário | **Pass** |
| Publish | **Não** — devolver ao CTO para lote de release + uma autorização de produção |

Artefato bruto: `smoke-cto23.json` / `smoke-cto23.mjs`.
