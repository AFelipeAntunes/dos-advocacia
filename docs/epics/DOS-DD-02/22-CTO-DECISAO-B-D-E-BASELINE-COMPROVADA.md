# CTO22 — opção B e limpeza D

09/11/2026. DECISÃO TÉCNICA: B PARA A MEDIÇÃO. FELIPE AUTORIZOU D EM RESPOSTA EXPLÍCITA NESTE CHAT. A/C NÃO LIBERADAS. EXECUTOR: CURSOR LOCAL.

## Baseline comprovada pelo CTO

Não é mais uma inferência por H1 ou nome de branch:

- O arquivo inspect-n7nukp43d.json identifica o deployment dpl_9aWQv8qyqtpVZ6PE9crUak4VfU2Y, URL imutável https://dos-advocacia-n7nukp43d-dos-advocacia.vercel.app, Preview/READY no projeto oficial.
- GitHub combined status do commit753bad4f018ce44172eee5131ce1fee2dd8837e7 aponta para https://vercel.com/dos-advocacia/dos-advocacia/9aWQv8qyqtpVZ6PE9crUak4VfU2Y.
- GitHub deployment7572307270 tem esse SHA e ambiente Preview – dos-advocacia; último status success, environment_url e target_url apontam para o mesmo n7nukp43d.
- `git rev-parse '753bad4^{tree}' '7fec6b2^{tree}'` retornou para AMBOS e49e8c58cf6250c7d41d61b404b3c4fe5e231594. `git diff --name-only 753bad4 7fec6b2` vazio.

Portanto, a árvore completa de código da referência Preview é idêntica à árvore publicada7fec6b2. Isso não transforma ambientes/configuração em idênticos; registrar essas diferenças e confirmar rota/H1/assets/configuração relevante na medição. Usar URL imutável, não alias móvel. Não chamar o SHA753bad4 de7fec6b2; reportar ambos com a equivalência de árvore.

## Ordem ao Cursor — continuar sem nova rodada de decisão A/B/C

1. Referência de medição: https://dos-advocacia-n7nukp43d-dos-advocacia.vercel.app/due-diligence-imobiliaria (753bad4, árvore=Production7fec6b2).
2. Candidato: https://dos-advocacia-fp0125m2c-dos-advocacia.vercel.app/due-diligence-imobiliaria (2abfbeb).
3. Usar o acesso OIDC já comprovado aos Previews. NÃO usar o bypass criado involuntariamente, nem criar/ampliar regra Trusted Sources development→production. Não tentar outras sintaxes de CLI sem conferir a ajuda da versão65.12.1 instalada.
4. Não reutilizar cegamente o preflight na bateria: ele usa context.route para headers. A documentação oficial informa que habilitar routing desativa HTTP cache: https://playwright.dev/docs/api/class-browsercontext#browser-context-route. Validar um método de autenticação restrito às origens exatas que permita cache quente real antes de qualificar as medições como frio/quente. Confirmar por evidência de rede. Não enviar token a analytics/fontes/imagens externas e não exportar cookies ou autenticação.
5. Com acesso e cache corretos, executar as80 medições do CTO20 e a reprodução dirigida da âncora. Apenas scripts de QA/documentação; aplicação/copy/retrato intactos. Guardar raw, método e resultados no destino do CTO20.

## D — limpeza autorizada por Felipe, ainda não executada pelo CTO

Autorização recebida: remover exclusivamente dos-advocacia/preflight-playwright-auth (deployment dpl_CMEHKRbujwgfVuSjR88ZhGjQ1D3N) e revogar somente o bypass criado involuntariamente nesta execução. Projeto oficial dos-advocacia e suas credenciais/ambientes preservados.

Antes de excluir, confirmar nome E ID do projeto acidental, vínculo do deployment e inventário de domínios/integrações/variáveis. Se houver recursos que não correspondam ao acidente descrito, parar somente a limpeza divergente e devolver os fatos; continuar a medição B se independente. Inspecionar valor de secret não é necessário. Executar exclusão pelo método oficial da CLI/API previamente conferido; confirmar ausência do projeto/deployment e presença intacta do projeto oficial.

Identificar o bypass criado pela execução a partir de metadados/horário/logs, sem revelar seu valor. Revogar apenas ele; não revogar chaves preexistentes ou segredos Wix/Resend. Se não puder distinguir com segurança, manter somente essa revogação pendente e reportar identificação necessária. Não chamar novamente vercel curl se a CLI recriar o bypass automaticamente; medir com OIDC dos Previews.

Não publicar secrets nem logs brutos que os contenham. Relatar cada ação da limpeza com ID/estado sem valores sensíveis. Não tratar autorização como prova de exclusão concluída.

## Devolução

B: SHA/árvore de referência, candidato, acesso OIDC, cache frio/quente comprovado,80 execuções, deltas/dispersão e âncora. D: projeto/deployment removidos ou bloqueio concreto, bypass específico revogado ou identificação pendente. Commit/push/merge/deploy/Production e novas configurações continuam fora desta etapa. Nenhuma mutação externa executada pelo CTO nesta revisão; leituras Git/GitHub e documentação apenas.
