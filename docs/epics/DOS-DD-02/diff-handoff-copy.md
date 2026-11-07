# Diff do handoff → copy-final — DOS-DD-02.02

Comparação entre `HANDOFF-ORIGINAL-CMO.md`, `HANDOFF-CMO-ATUALIZADO-20261107.md` e `copy-final.md`.

## 1. Mudanças CMO (original → atualizado 07/11)

| Trecho | Original | Atualizado |
| --- | --- | --- |
| Abertura da copy | Marcadores ⚠️ para Drielle; dispositivos conferidos no Planalto em 05/11 | Sem ⚠️; “frase de experiência foi confirmada… (mais de 10 anos…)”; “prazo também foi confirmado”; “copy está liberada” |
| H2 experiência | “Antes de advogar, trabalhei dentro de imobiliárias…” + ⚠️ | “São mais de 10 anos de experiência ligada ao mercado imobiliário, começando dentro de imobiliárias, antes da advocacia… Essa vivência define o método…” |
| FAQ prazo | “…combinado caso a caso.” + ⚠️ | “…combinado no início, depois da primeira leitura do caso.” (sem ⚠️) |
| Próximos passos | Drielle ainda confirma os dois pontos | “Dra. Drielle confirmou em 07/11/2026…”; CMO informa revisão/publicação do post `2bef3905` |

## 2. Delta da consolidação card 02 (atualizado → copy-final)

| Item | Handoff atualizado | Copy-final | Motivo |
| --- | --- | --- | --- |
| Link inventário | Em **“O que acompanha o imóvel”** (IPTU/condomínio/locação) | Em **“Quem vende”**, junto de herança ainda não partilhada / quem precisa assinar | Card 02: inventário com herança/assinaturas, não como suporte de IPTU/locação |
| Link fraude | Em “Quem vende” | Mantido em “Quem vende” | Coerente com art. 792, IV |
| Link habite-se | Em “O imóvel” | Mantido | Sem mudança |
| “O que acompanha…” | Tinha link inventário | **Sem** link de post dos três | Não inventar terceiro destino |
| Paths | “Link para o post sobre…” (sem slug) | Slugs exatos da auditoria 01 | Card 02: não inferir slug do título |
| WhatsApp landing | Mensagem em texto | URL `wa.me` percent-encoded | Implementável no card 03 |
| WhatsApp blog | Só rótulo “Falar pelo WhatsApp” | Rótulo + mensagem operacional no padrão da landing | Congelar copy do bloco para o 04 |
| Âncora “O que você recebe” | Implícita | `#o-que-voce-recebe` | Hero secundário |
| Analytics do handoff | “parâmetro que diferencie compacto/completo” | Removido da copy publicável; contrato = parecer 08 (`meio_artigo`/`fim_artigo`, sem `cta_variant` no GA4) | Parecer CTO prevalece |
| Forma | Mistura brief + copy | Só seções publicáveis + lista de links | Card 02 |

## 3. Trecho textual do delta de inventário

**Antes (handoff atualizado):**

> #### Quem vende (H3)  
> … quem precisa assinar. Link para o post sobre fraude à execução.  
> #### O que acompanha o imóvel (H3)  
> Dívidas de condomínio e de IPTU… Link para o post sobre compra de imóvel em inventário.

**Depois (copy-final):**

> #### Quem vende  
> … quem precisa assinar. Veja também: [fraude…](/post/fraude-à-execução-…) e [inventário…](/post/compra-de-imóvel-em-inventário-…).  
> #### O que acompanha o imóvel  
> Dívidas de condomínio e de IPTU… *(sem link de post)*

## 4. Itens intencionalmente não alterados

- Title, description, H1, FAQs (texto), entregáveis, CTAs de rótulo da landing, bloco compacto/completo do blog (texto do handoff).
- Frase de experiência e prazo confirmados em 07/11.
- Sem nova redação jurídica além do reposicionamento de link.

## 5. Divergência informativa (fora do escopo de reescrita)

Parecer 08: site público do artigo principal ainda diverge do relato CMO de publicação (title/FAQ/links). Registrado; **não** republicar neste card.
