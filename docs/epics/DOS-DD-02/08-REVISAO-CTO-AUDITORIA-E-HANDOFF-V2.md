# Parecer CTO — DOS-DD-02.01 e revisão do handoff

Versão 1.0, 07/11/2026. Aceite técnico da auditoria no alcance das evidências coletadas, com ajustes obrigatórios ao contrato para implementação. Não é autorização de publicação.

## Conferências independentes

Todos os hashes do manifesto evidencias/01-auditoria/hashes-sha256.txt conferiram. Origin/main remoto continua 7fec6b2. IDs públicos e associação por filtros são evidência pública, não releitura dos categoryIds da API. Não chamar a prova indireta de conector verificado.

A nova versão do CMO modifica a frase de experiência, retira os avisos das duas confirmações Drielle e declara a copy liberada. Também informa publicação do artigo principal em 07/11. Os demais requisitos permanecem. A versão original foi preservada e a recebida está em HANDOFF-CMO-ATUALIZADO-20261107.md.

As confirmações editoriais relatadas no documento substituem a pendência dos dois avisos. Não solicitar novamente esses aceites nem inventar nova redação jurídica/comercial. Alterações materiais posteriores exigem revisão própria.

Na conferência pública deste review, o artigo principal retornou HTTP200, title “Due diligence imobiliária: o que é e quando fazer”, FAQPage com sete perguntas e um link HTML absoluto para o serviço. O documento novo informa title “O que é due diligence imobiliária e o que ela verifica”, seis perguntas e dois links. O HTML bruto foi preservado em evidencias/02-review-cto/artigo-principal-publico.html. Não afirmar que a nova versão propagou nem republicar para resolver cache. Comparar GET CMS e site com data/hora, então diagnosticar a revalidação existente. Não foi realizada escrita externa nesta revisão.

## Decisões técnicas finais para o card 04

1. **Precedência.** Se houver Assessoria para Imobiliárias, manter o bloco B2B e suprimir DD. Depois avaliar Due Diligence; depois Contratos com persona comprador comprovada por lista de IDs reais revisada. Apenas Litígios, categoria ausente ou todas desconhecidas ficam sem CTA novo. Um ID desconhecido adicional não apaga uma categoria conhecida. Não exigir exclusividade de categoria por inferência de aba pública.

2. **Matriz.** Aceita como inventário público dos artigos identificados e proposta de persona. A alegação n/a_single_cat é provisória enquanto não houver fonte que enumere todos os categoryIds. Para novos blocos DD usar catálogo e categoryIds reais recebidos em runtime. Para Contratos, falhar fechado fora da lista de compradores da matriz. Não inferir persona de título ou da primeira categoria em runtime. Fixtures cobrem combinações desconhecidas. Identificar os três multicategoria históricos ou demonstrar inventário atualizado que explique a diferença antes do gate de integração/publicação do 05. Isso não bloqueia preparar a landing ou os testes locais do classificador.

3. **Terceiro parágrafo.** Aceita inserção após terceiro parágrafo textual de corpo elegível antes de FAQ/Leia também/contato. O parser atual achata listas. Preservar proveniência de PARAGRAPH de topo e excluir todos os ancestrais de lista, sem reestruturar o HTML editorial por conveniência. Fallback textual pode contar parágrafos não vazios respeitando os cortes. Não usar helper privado isFaqCta como API existente exportada.

4. **Ponto de corte.** Um link editorial embutido em um parágrafo não é um bloco de conversão. Não interromper por qualquer href de serviço/WhatsApp. O corte de contato exige identificar o bloco isolado de conversão ou a seção semântica. Implementação deve demonstrar que artigos que já linkam ao serviço continuam recebendo o compacto após o terceiro parágrafo quando elegíveis. Contagem apenas pelo HTML da auditoria não prova o comportamento do Rich Content/listas.

5. **Quantidade e copy.** Máximo de um compacto e um completo DD por artigo. Um link editorial existente não suprime automaticamente o compacto. Reutilizar os textos de CTA aprovados no handoff e preservar links editoriais e Leia também. O artigo principal, por ser da categoria DD e informativo, é elegível à mesma regra. Sua atualização relatada precisa ser reconciliada antes da prova real e medição, sem bloquear a landing.

6. **Analytics.** Não adicionar cta_variant. click_cta_servico envia post_slug, destino e cta_position=meio_artigo (compacto) ou fim_artigo (completo). O link secundário para compra envia seu próprio destino. WhatsApp novo do bloco completo usa click_whatsapp com post_slug, cluster derivado do destino DD já configurado e cta_position=fim_artigo. Links editoriais históricos mantêm valores de posição existentes. Eventos dos escopos novos não enviam link_url, mensagem nem PII. Manter decisões de compatibilidade dos escopos legados explicitadas em diff. Usar marcadores DOM de variante é permitido sem transformá-los em parâmetro GA4.

7. **Um clique, um evento.** Selecionar múltiplos blocos e dar precedência ao escopo de serviço dentro do conteúdo. Evitar dupla emissão pelo listener do artigo. Preferir filtro de escopo ao bloqueio genérico de propagação. Testar elementos filhos, montagem/desmontagem e navegação entre artigos.

## Estado por frente

- 01 aceito como auditoria pública, com as ressalvas e o contrato deste parecer.
- 02 liberado para consolidar a copy nova e produzir versão final identificável. As duas confirmações relatadas não devem ser reabertas. Sem publicação.
- 03 liberado após a consolidação pontual do 02. Não depende da resolução de multicategoria para implementar a landing localmente.
- 04 liberado para implementação local após matriz/contrato deste parecer e copy de CTA congelada. O complemento de prova CMS/multicategoria deve chegar antes do aceite integrado.
- 05 exige artigos reais, evidência da atualização do post principal e multicategoria, além de QA/performance.
- 06 depende de QA e autorização operacional concreta. Nenhum ato de publicação foi autorizado por este parecer.
- 07 registra os cinco títulos de 06/11 confirmados no title público pela auditoria. A data e a mutação CMS permanecem informação do CMO. Registra também a revisão do principal como informada, com propagação divergente.

## Próxima entrega

Encaminhar 02 com o handoff atualizado e este parecer para consolidação local. Entregar copy-final.md, matriz de decisões com confirmação relatada pelo CMO em07/11 e lista de links exatos. Preparar o complemento de prova do artigo principal/multicategoria em leitura quando houver sessão conectada. Não repetir a auditoria já aceita nem reescrever posts.
