# Contrato de CTA e inserção — DOS-DD-02.01

Proposta operacional para aceite CTO. Nenhuma implementação neste card.

## Estado atual (código `7fec6b2`)

| Peça | Comportamento |
| --- | --- |
| `BlogServiceCta` | Só se `isImobiliariasPost` (categoryId de Assessoria para Imobiliárias). Um bloco no fim, fora do Rich Content, classe `.article-service-cta` |
| `BlogCtaTracker` | Um listener em `.article__content` e um em `.article-service-cta` (querySelector **singular**) |
| `click_whatsapp` (artigo) | `post_slug`, `cluster?`, `cta_position=fim`, **`link_url`** |
| `click_cta_servico` (meio) | links de serviço em `.article__content` → `cta_position=meio` |
| `click_cta_servico` (fim) | links em `.article-service-cta` → `cta_position=fim_artigo` |
| Rich Content | Parser em `getWixRichContentBlocks`: `paragraph`, `heading`, `blockquote`, `image`. Listas Wix não viram bloco próprio; caem em nós filhos |

## Classificador proposto (precedência)

Ordem de decisão, sem recategorizar post:

1. **Sem `categoryIds` ou categoria desconhecida** → nenhum bloco novo; B2B atual também ausente.
2. **Contém Assessoria para Imobiliárias** (`d3ccf9b7-7097-45c8-97f6-d102bc5fc8e2`) → manter bloco B2B atual; **suprimir** CTA Due Diligence (mesmo se também tiver Due Diligence ou Contratos).
3. **Contém Due Diligence Imobiliária** (`8c2ee73c-4740-4d24-8b95-54c0bb24b1ba`) e passou no passo 2 → elegível ao novo CTA DD.
4. **Contém Contratos Imobiliários** (`5622eb6a-8cb7-4bfa-92b1-7f694afc7de5`) **e** persona comprador comprovada na matriz → elegível ao novo CTA DD; link secundário completo para `/assessoria-juridica-compra-de-imovel`.
5. **Contratos sem persona comprovada** → sem novo CTA.
6. **Só Litígios** (`2077ef1a-3096-4792-90c7-4e9eaa601618`) ou demais → sem novo CTA.

Gate: CTO confirma esta precedência antes do card 04.

## Definição operacional do “terceiro parágrafo”

No renderer SSR, percorrer `getWixRichContentBlocks(richContent, fallback)` **na ordem**:

1. Contar apenas blocos `kind === "paragraph"` com texto não vazio após trim.
2. **Excluir da contagem e da inserção**: `heading`, `image`, `blockquote`.
3. **Não inserir** depois que aparecer, no fluxo de blocos:
   - `heading` nível 2 cujo texto (pt-BR, casefold) começa com `perguntas frequentes`;
   - bloco cujo texto começa com `leia também` (parágrafo ou heading);
   - bloco classificado como CTA/contato (`isFaqCta` / WhatsApp / destinos de serviço), se aparecer antes do ponto de inserção.
4. Se existirem **≥ 3** parágrafos elegíveis **antes** dessas seções de corte → inserir o CTA **compacto imediatamente após o 3º** parágrafo elegível.
5. Se existirem **&lt; 3** parágrafos elegíveis antes do corte → **não** inserir compacto; manter só o bloco completo no fim.
6. O bloco **completo** permanece **depois** do Rich Content e **antes** do link “Prefere escrever?”, espelhando a posição atual do `BlogServiceCta`, com classe própria distinguível (proposta: `.article-service-cta` + `data-cta-variant="due-diligence-completo"` e compacto `data-cta-variant="due-diligence-compacto"` / `data-cta-position` explícito).

### Ajuste sugerido ao parser (aceite CTO)

Listas (`BULLETED_LIST` / `ORDERED_LIST` / `LIST_ITEM`) hoje são achatadas em parágrafos filhos. Para não contar item de lista como “parágrafo de corpo”, o card 04 deve:

- ou ignorar nós cujo ancestral imediato seja lista;  
- ou só contar `PARAGRAPH` de topo sob o documento.

**Pedido de aceite:** validar a regra “somente `PARAGRAPH` de topo / sem ancestral de lista” antes de codificar.

## Variantes de bloco

| Variante | Posição | Conteúdo (copy final no card 02) | Destino |
| --- | --- | --- | --- |
| Compacto | após 3º parágrafo elegível | texto curto + link “Entender a due diligence” | `/due-diligence-imobiliaria` |
| Completo | fim do artigo | texto + botão página + link WhatsApp | página + `wa.me` contextual |

Posts que **já** têm âncora editorial para `/due-diligence-imobiliaria` no corpo: o compacto não deve repetir a mesma frase âncora; preferir wording distinto aprovado no card 02, ou só o bloco completo (decisão editorial).

## Analytics e privacidade

Proposta alinhada ao épico, sem quebrar série histórica:

| Evento | Onde | `cta_position` | Parâmetros permitidos | Proibido |
| --- | --- | --- | --- | --- |
| `click_cta_servico` | compacto | `meio_artigo` | `post_slug`, `destino=due-diligence-imobiliaria`, opcional `cta_variant=compacto` | PII, mensagem, `link_url` |
| `click_cta_servico` | completo (página) | `fim_artigo` | `post_slug`, `destino`, opcional `cta_variant=completo` | idem |
| `click_whatsapp` | completo / editorial | manter `fim` **ou** mapear explícito (aceite) | `post_slug`, `cluster?` | **remover `link_url` nos fluxos novos**; não enviar texto da mensagem |

Valores históricos `meio` e `fim_artigo` dos cliques editoriais e B2B atuais **permanecem**. Novos blocos usam `meio_artigo` / `fim_artigo` com `cta_variant` para diferenciar compacto/completo sem apagar a série.

### Tracker

`document.querySelector(".article-service-cta")` singular **quebra** com dois blocos. Card 04 deve:

- usar `querySelectorAll` nos escopos de serviço;  
- ou classes distintas com listeners separados;  
- garantir que clique no compacto **não** borbulhe para o listener de `.article__content` (escopo inequívoco / `stopPropagation` só se necessário após prova).

## Testes existentes (contagem base)

| Suíte | Arquivo | Papel |
| --- | --- | --- |
| CTA B2B | `src/lib/wix/blog-service-cta.test.ts` | presença/ausência do bloco |
| Categorias | `src/lib/wix/blog-navigation.test.ts` | `isImobiliariasPost`, multicategoria B2B |
| Rich Content / FAQ | `src/lib/wix/rich-content.test.ts` | blocos, FAQ, Leia também |
| GA4 helpers | `src/lib/analytics/ga4.test.ts` | destinos e cluster |
| Totais neste SHA | 13 arquivos `*.test.ts`, ~82 casos `test(`/`it(` | base para expansão no 04/05 |

## Performance (referência anterior)

Método documentado em `DOS-SEO-01/evidencias/12-preview-real/performance.md`: laboratório Chrome, proxy de long tasks &gt;50 ms, LCP/CLS/TTFB/JS. Artigo B2C due diligence mobile/cold LCP ~756–796 ms naquela bateria. Card 05 deve repetir o **mesmo método** contra referência identificável, incluindo páginas com compacto+completo.

## Fora deste contrato

Copy final, frase autobiográfica, prazo 24h, republicação Wix, deploy.
