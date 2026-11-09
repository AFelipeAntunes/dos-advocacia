# Revisão CTO — DOS-DD-02.04

07/11/2026. DEVOLVIDO PARA DUAS CORREÇÕES DIRIGIDAS. Ainda não liberar QA integrado como lote aceito.

## Aceites preservados

Classificador por categoryIds/catálogo, precedência Assessoria > DD > Contratos comprador e os quatro IDs de exceção da matriz estão corretos. ID desconhecido adicional não apaga categoria conhecida. SSR do compacto/final, IDs distintos e roteamento de parâmetros novos seguem o contrato.

Os sete arquivos de aplicação aceitos do card03 foram comparados por SHA-256 entre os worktrees03/04, todos iguais. Nenhum retrabalho da landing solicitado. Manifesto de evidências04 confere.

Repetidos Wix47/47, tracker3/3 e analytics4/4 (54 testes), build23/23 e typecheck, todos passaram. Os três testes de tracker atuais validam SSR/markup e regex de fonte. Nenhum deles dispara clique ou executa useEffect/cleanup.

## R1 — corte de contato incompleto (P2)

Causa em src/lib/wix/rich-content.ts, isCompactInsertionCutBlock. Reconhece FAQ, Leia também e apenas texto começando com “fale com a dra.”. Outros blocos isolados de conversão continuam sendo contados como corpo ou atravessados pela inserção.

Reprodução executada pelo CTO em output/cto-review04/repro.ts:
- Dois PARAGRAPH de corpo + PARAGRAPH contendo somente link “Falar pelo WhatsApp” + texto posterior. Resultado index2. Esperado null, pois não houve terceiro parágrafo de corpo antes do contato.
- Dois PARAGRAPH de corpo + HEADING2 “Fale com o escritório” + texto do contato. Resultado index3. Esperado null.

Corrigir identificação de seção de contato e bloco isolado de conversão por semântica/texto e links, cobrindo o conteúdo suportado e o fallback. Não classificar qualquer parágrafo com link embutido como contato. Manter terceiro parágrafo de corpo, exclusão de listas, cortes FAQ/Leia também e saída curta com só bloco final. Acrescentar testes dos dois casos e do contraste com parágrafo de corpo que apenas contém link editorial.

Não converter o trabalho em refactor amplo do Rich Content. Manter HTML editorial e regras de FAQ/relacionados.

## R2 — prova comportamental do tracker (P2)

A implementação parece coerente por inspeção, mas regex não comprova o contrato de um clique/um evento. Exercitar o componente real e seus listeners numa fixture local com compacto dentro de article__content e final fora dele. Pode usar navegador com gtag interceptado ou harness DOM realista que execute o effect. Não criar rota de QA persistente no release.

Cobertura mínima:
- Clique no link e em span filho do compacto = um click_cta_servico, meio_artigo, destino DD.
- Botão DD e link secundário compra no completo = um evento cada, fim_artigo e destino correspondente.
- WhatsApp novo = um click_whatsapp, fim_artigo e cluster due-diligence, sem link_url/PII/cta_variant.
- B2B final e links editoriais preservam nomes/parâmetros/posições históricos; cards relacionados emitem zero.
- Troca de post e desmontagem/remontagem não acumulam listener nem reutilizam post_slug anterior.
- Evidência de no máximo um compacto/final e IDs sem duplicação.

Colocar os testes permanentes no comando normal da suíte apropriada ou registrar e garantir comando explícito no QA05. Não deixar cobertura crítica descoberta por uma glob que não inclui src/components.

## Inventário e performance

Valores locais14JS/1CSS são inventário, não prova de delta transferido. Há parse de Rich Content adicional no PostPage e novamente no renderer, inclusive em artigos sem plano DD. QA05 deve medir o custo no fluxo real. Não declarar ausência de regressão por contagem de chunks. Medição continua no05, sem solicitar bateria ampla aqui.

## Entrega esperada

Corrigir somente R1/R2, preservar os aceites, repetir testes relevantes/typecheck/build e devolver antes/depois, reprodução corrigida e prova de eventos/cleanup. Nenhum commit/push/PR/deploy ou alteração Wix foi autorizado neste review. Provas reais de multicategoria e propagação do artigo principal permanecem no05.

CTO não alterou código de aplicação nesta revisão. Apenas diagnóstico local e documentação.
