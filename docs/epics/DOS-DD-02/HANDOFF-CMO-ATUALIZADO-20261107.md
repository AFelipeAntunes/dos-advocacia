# Handoff - Página de due diligence imobiliária

Nov 6, 2026 · @Dra. Dri ou Felipão?

## Resumo

A due diligence é o serviço que o escritório mais quer vender, mas a página dela fica em torno da posição 70 no Google, e os posts que trazem quase todo o tráfego não levam o leitor até ela. Este handoff pede duas mudanças: reescrever a página e fazer os posts de compra apontarem para ela.

Dados do Search Console (04/08 a 03/11/2026):

| O que | Número |
| --- | --- |
| Cliques totais do site | 416 |
| Cliques que foram para posts do blog | cerca de 400 |
| Impressões da busca "due diligence imobiliária" | 180, na posição média de 73,5 |
| Impressões de /due-diligence-imobiliaria (todas as buscas) | 308, posição média de 69,8, 1 clique |
| Formulários enviados no GA4 (90 dias) | 4, todos de páginas de serviço ou contato, nenhum de post |

A página atual tem cerca de 350 palavras, o H1 não contém o termo, não tem perguntas frequentes, não diz quando contratar e nenhum post linka para ela. A página de assessoria para imobiliárias, feita no mesmo padrão proposto aqui, já gerou 2 dos 4 formulários do período.

## Especificação de SEO e implementação

A URL /due-diligence-imobiliaria continua a mesma. Muda o conteúdo, os metadados e os dados estruturados, no mesmo padrão de /assessoria-juridica-para-imobiliarias.

| Item | Valor |
| --- | --- |
| URL | /due-diligence-imobiliaria (não muda) |
| Palavra-chave principal | due diligence imobiliária |
| Secundárias | advogado para due diligence imobiliária, due diligence de imóvel na compra, análise jurídica de imóvel antes da compra |
| Persona | Comprador, investidor e imobiliária que intermedeia uma venda de valor alto |
| Etapa do funil e intenção | Fundo do funil, intenção transacional |
| Title (52 caracteres) | Due diligence imobiliária \| Curitiba e todo o Brasil |
| Meta description (157 caracteres) | Due diligence imobiliária antes de comprar ou investir. Análise da matrícula, do vendedor e dos riscos que não aparecem no anúncio. Curitiba e todo o Brasil. |
| H1 | Na próxima seção, junto com a copy |
| Tamanho | Cerca de 1.100 palavras de texto visível |
| Formulário e WhatsApp | Manter os atuais, com o evento `click_whatsapp` e `generate_lead` |

### Implementação

1. Reescrever `src/legacy-pages/due-diligence-imobiliaria.html` com a copy da próxima seção, mantendo header, footer, formulário e classes.
2. Atualizar title, meta description e `og:title` juntos, e registrar a data no `PROJECT_CONTEXT.md`.
3. Atualizar `lastModified` da rota no `sitemap.ts` para a data do deploy.
4. Perguntas frequentes como subtítulos H3, como na landing de imobiliárias.

### Dados estruturados

- `LegalService` com o mesmo `@id`, nome público, `legalName` e CEP 80420-907 já publicados nas outras páginas
- `Service` com `serviceType` "Due diligence imobiliária", `areaServed` Curitiba e Brasil e `provider` apontando para o `LegalService`
- `FAQPage` com as perguntas da copy
- `BreadcrumbList` com Início e Áreas de atuação

### Links internos que chegam à página

| Origem | Texto do link |
| --- | --- |
| Post "Due diligence imobiliária: o que é..." | due diligence imobiliária (já existe, conferir) |
| /assessoria-juridica-compra-de-imovel | análise completa do imóvel e das partes antes da compra |
| /advogada-imobiliaria e /advogada-imobiliaria-curitiba | due diligence imobiliária |
| Home, card de áreas | Due diligence imobiliária |
| Posts de compra e venda | Bloco de serviço da seção 4 |

A página nova linka /assessoria-juridica-compra-de-imovel, /contratos-imobiliarios e 3 posts: imóvel sem habite-se, fraude à execução e compra de imóvel em inventário.

## Copy da página

Texto pronto para o HTML. A tag de cada título está entre parênteses. A frase de experiência foi confirmada pela Drielle em 07/11/2026 (mais de 10 anos, igual às outras páginas do site). O trecho do prazo também foi confirmado em 07/11/2026. A copy está liberada para publicação. Os dispositivos legais citados foram conferidos no Planalto em 05/11/2026.

**Eyebrow** · Para compradores, investidores e imobiliárias · Curitiba e Brasil

### Due diligence imobiliária antes de comprar, vender ou investir (H1)

O anúncio mostra o imóvel. A matrícula, o histórico de quem vende e as obrigações que acompanham o bem contam outra parte da história. E é essa parte que decide se o negócio é seguro.

Due diligence imobiliária é a análise jurídica do imóvel e das partes antes da assinatura. Ela mostra o que precisa ser resolvido, negociado ou reconsiderado enquanto ainda dá tempo.

**Botão principal** · Conversar sobre o imóvel que estou avaliando (WhatsApp com a mensagem "Olá, Drielle! Vim pelo site e quero conversar sobre uma due diligence imobiliária.")

**Link secundário** · Ver o que a análise entrega (âncora para a seção "O que você recebe")

### O que a due diligence imobiliária analisa (H2)

A análise olha para três frentes ao mesmo tempo. Separadas, cada uma pode parecer em ordem. Juntas, mostram o risco real.

#### O imóvel (H3)

A matrícula mostra o que foi registrado até a data em que a certidão foi emitida. Uma construção não averbada, uma área diferente da registrada ou um ônus antigo mudam o valor e a viabilidade do negócio. Link para o post sobre imóvel sem habite-se.

#### Quem vende (H3)

Há riscos que nunca chegam à matrícula. A lei considera fraude à execução a venda feita quando já tramitava contra o vendedor uma ação capaz de reduzi-lo à insolvência (art. 792, IV, do CPC). Regime de casamento, herança ainda não partilhada e venda por procuração também mudam quem precisa assinar. Link para o post sobre fraude à execução.

#### O que acompanha o imóvel (H3)

Dívidas de condomínio e de IPTU, um contrato de locação em vigor e restrições de uso não aparecem na visita. Aparecem depois, quando o imóvel já é seu. Link para o post sobre compra de imóvel em inventário.

### Quando contratar (H2)

O momento certo é antes de pagar sinal ou assinar proposta. Depois disso, o que poderia ser condição do negócio vira problema para resolver.

A análise costuma fazer mais diferença quando

- o imóvel vem de inventário ou herança
- a compra é para investimento ou envolve valor alto
- o imóvel está na planta, em loteamento ou é rural
- quem vende é empresa, está representado por procurador ou tem histórico de dívidas
- o negócio tem prazo curto e pressão para fechar

### O que você recebe (H2)

1. Leitura documental. Organização e verificação dos documentos do imóvel e das partes.
2. Informações relevantes. O que os documentos mostram e o que muda na sua decisão.
3. Riscos e prioridades. O que precisa ser resolvido antes da assinatura e o que pode entrar na negociação.
4. Orientação estratégica. O caminho jurídico para seguir, ajustar ou não fechar o negócio.

Ao final, você sabe o que está em ordem, o que precisa ser resolvido e o que pode ser negociado. A decisão continua sendo sua, agora com os riscos à vista.

### Por que eu faço due diligence desse jeito (H2)

São mais de 10 anos de experiência ligada ao mercado imobiliário, começando dentro de imobiliárias, antes da advocacia. Vi de perto negócios que pareciam fechados travarem no cartório ou no banco por um documento que ninguém tinha olhado antes. Essa vivência define o método: a análise dos documentos anda junto com a leitura da negociação, para identificar o risco antes da assinatura.

Por isso a análise não termina na lista de certidões. Ela termina na pergunta que importa para quem vai assinar. Este negócio fecha com segurança, ou o que precisa mudar antes?

Dra. Drielle Pereira, advogada imobiliarista, OAB/PR 76.982.

### Para quem é (H2)

- Quem vai comprar para morar e não quer descobrir o problema depois da escritura
- Investidores que avaliam mais de um imóvel e precisam comparar o risco de cada um
- Imobiliárias e corretores que querem levar um negócio de valor alto até a escritura sem surpresa
- Quem vai vender e quer antecipar o que o comprador vai questionar

### Atendimento em Curitiba e em todo o Brasil (H2)

O escritório fica no Batel, em Curitiba. A análise é documental e atende imóveis em qualquer cidade do país. O primeiro retorno acontece em até 24 horas úteis.

### Perguntas frequentes (H2)

#### O que é due diligence imobiliária? (H3)

É a análise jurídica do imóvel, de quem vende e das obrigações ligadas ao bem, feita antes da assinatura. O objetivo é identificar riscos que não aparecem no anúncio nem na visita e mostrar o que precisa ser resolvido ou negociado antes de o dinheiro mudar de mãos.

#### A due diligence imobiliária é obrigatória por lei? (H3)

Não. Desde a Lei 14.382/2022, certidões forenses ou de distribuidores judiciais não são exigidas para caracterizar a boa-fé de quem compra (art. 54, §2º, da Lei 13.097/2015). Os riscos fora da matrícula continuam previstos em lei, como a fraude à execução (art. 792, IV, do CPC). A análise existe para enxergar esses riscos antes de pagar.

#### Quanto tempo leva a análise? (H3)

Depende da documentação disponível e de quantas pessoas e imóveis estão envolvidos. O prazo é combinado no início, depois da primeira leitura do caso.

#### A due diligence substitui as certidões e a escritura? (H3)

Não. Os documentos exigidos para a escritura continuam necessários. A due diligence lê esses documentos em conjunto, cruza com o histórico das partes e aponta o que eles, isolados, não mostram.

#### A imobiliária pode contratar a due diligence de um negócio que intermedeia? (H3)

Pode. Para a imobiliária, a análise antes da proposta reduz o risco de o negócio cair na escritura e protege a relação com comprador e vendedor. O escritório atua ao lado da imobiliária, sem tomar o lugar dela na negociação.

#### A análise atende imóveis fora de Curitiba? (H3)

Sim. A análise é documental e pode ser feita a distância para imóveis em qualquer cidade do Brasil. Quando o caso exige um ato presencial, isso é avaliado antes.

### Antes do sinal, uma conversa (H2)

Se você está perto de assinar uma proposta ou pagar sinal, este é o momento de olhar os documentos. Depois, a mesma análise serve para remediar, não para decidir.

**Botão** · Conversar sobre o imóvel pelo WhatsApp

**Texto de apoio** · Retorno em até 24 horas úteis. Atendimento em Curitiba e online para todo o Brasil.

## Posts de compra levando à due diligence

Os posts de compra e venda trazem a maior parte do tráfego e terminam sem caminho para o serviço. A proposta é estender o bloco de serviço que já existe nos posts para imobiliárias, sem mexer no texto do Wix.

### Regra por categoria

| Categoria do post (Wix) | Bloco exibido | Destino |
| --- | --- | --- |
| Assessoria para Imobiliárias | Atual, sem mudança | /assessoria-juridica-para-imobiliarias |
| Due Diligence Imobiliária | Novo bloco de due diligence | /due-diligence-imobiliaria |
| Contratos Imobiliários (posts para comprador) | Novo bloco de due diligence | /due-diligence-imobiliaria, com link secundário para /assessoria-juridica-compra-de-imovel |
| Litígios e demais | Sem bloco | - |

### Posição

Hoje o bloco aparece só depois do conteúdo, e quase nenhum leitor chega lá com intenção de contato. A proposta é renderizar uma versão compacta do bloco depois do terceiro parágrafo e manter a versão completa no fim. A inserção é feita no servidor, na renderização do Rich Content, sem alterar o conteúdo do Wix.

### Texto do bloco

- **Compacto (depois do 3º parágrafo):** "Vai comprar ou investir? A due diligence imobiliária analisa o imóvel, quem vende e o que acompanha o bem antes da assinatura." Link "Entender a due diligence"
- **Completo (fim do post):** "Antes do sinal, uma conversa. Se você está perto de assinar uma proposta, este é o momento de olhar os documentos." Botão "Conhecer a due diligence imobiliária" para a página e link "Falar pelo WhatsApp"

Usar o evento `click_cta_servico` já existente, com um parâmetro que diferencie a posição (compacto ou completo), para medir qual converte.

### Posts para conferir depois do deploy

Se algum destes não estiver nas duas categorias acima, a Drielle ajusta a categoria no Wix:

| Post | Impressões (3 meses) |
| --- | --: |
| Imóvel sem habite-se | 4.882 |
| Venda sem assinatura do cônjuge | 3.124 |
| Cessão de direitos em imóvel na planta | 2.782 |
| Vendedor representado por procurador | 1.393 |
| Contrato de gaveta | 327 |
| Georreferenciamento rural | 413 |
| Loteamento irregular | 145 |

## Registro das alterações e próximos passos

### Alterações já feitas no Wix em 06/11/2026

Títulos SEO (seoData title) de 5 posts com impressão e sem clique, trocados via API com UPDATE\_PUBLISH. Slugs, conteúdo e meta descriptions foram mantidos. Registrar esta data no log de testes de título do PROJECT\_CONTEXT.md e medir CTR na janela de 4 semanas (até 04/12/2026), comparando com as 4 semanas anteriores.

| Post (id) | Título anterior | Título novo |
| --- | --- | --- |
| 74602f53 | Comprar imóvel sem Habite-se: o risco que aparece depois da escritura \| DOS Advocacia | Imóvel sem habite-se pode ser financiado? Riscos na compra |
| 33142df0 | Caução na locação: o que a lei permite a imobiliária reter (e o que não) \| DOS Advocacia | Caução em dinheiro na locação: regras para a imobiliária |
| 2ec331ee | Outorga Conjugal na Venda de Imóvel: o risco que pode anular o negócio \| Drielle Pereira | Venda de imóvel sem assinatura do cônjuge pode ser anulada? |
| b121964f | Vistoria de imóvel alugado: até onde vai a responsabilidade da imobiliária \| DOS Advocacia | Vistoria de imóvel alugado: responsabilidade da imobiliária |
| 2fd857fc | Inadimplência do locatário: o que a imobiliária pode e não pode fazer | Inadimplência do aluguel: o que a imobiliária pode fazer |

O CTO não precisa agir nesses 5 posts. O webhook de Post Updated já revalida as páginas.

### Diagnóstico geral dos títulos SEO do blog

Dos 106 posts consultados, 68 têm título SEO acima de 60 caracteres e 27 ainda carregam sufixo de marca ("| DOS Advocacia" ou "| Drielle Pereira"). O sufixo ocupa espaço que o Google corta no resultado e repete a marca que o próprio site já acrescenta. Proposta de limpeza em lote, aguardando aprovação da Dra. Drielle antes de executar.

### Próximos passos

1. **CTO** implementa a página de due diligence e o bloco de serviço nos posts, conforme as seções acima.
2. **Dra. Drielle** confirmou em 07/11/2026 a frase de experiência e o prazo combinado caso a caso. Nada pendente na copy.
3. **CMO** revisou e publicou em 07/11/2026 o post antigo de due diligence (id 2bef3905), agora com ângulo informativo ("o que é / o que verifica"), dois links para /due-diligence-imobiliaria, FAQ de 6 perguntas e citações conferidas. Slug mantido. Título SEO novo: "O que é due diligence imobiliária e o que ela verifica".
4. **CMO** executa a limpeza em lote dos títulos SEO, se aprovada.
5. **Agente navegador** solicita indexação da nova página no Search Console logo após o deploy.
