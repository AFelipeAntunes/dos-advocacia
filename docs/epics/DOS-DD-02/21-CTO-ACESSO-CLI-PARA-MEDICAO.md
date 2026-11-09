# CTO21 — preflight aceito; autenticação CLI antes da medição

08/11/2026. Relatório CTO20-PREFLIGHT lido integralmente. Diagnóstico de acesso aceito; gate de desempenho e navegação por fragmento continuam inconclusivos. Nenhuma nova rodada de medição solicitada antes de resolver o acesso.

## Próxima tarefa do agente local

1. No mesmo worktree, executar login normal da Vercel CLI já utilizada. Felipe conclui o login/consentimento no navegador; não pedir envio de senha, código, cookie ou token no chat. A sessão do navegador interno não autentica automaticamente a CLI do Cursor.
2. Após login, conferir identidade, versão e ajuda da CLI instalada antes de usar opções. Vincular apenas se necessário ao projeto existente dos-advocacia, equipe dos-advocacia (DOS Advocacia), preservando exclusão Git de .vercel. Não criar projeto, alterar configurações remotas ou puxar segredos de Production.
3. Confirmar primeiro o candidato Preview por HTTP autenticado e depois pelo MESMO contexto Playwright/CDP que fará a medição. HTTP200 deve conter H1 esperado e não página de autenticação. Sucesso de vercel curl não prova que o Playwright recebeu autorização.
4. Restringir o header de autenticação às duas origens exatas aceitas, não a qualquer *.vercel.app nem a serviços externos de fonte/analytics/imagem. Não imprimir ou versionar tokens/estado de autenticação.

## Ressalva da referência Production

A skill Vercel de acesso protegido informa que OIDC de desenvolvimento do mesmo projeto acessa Preview por padrão, mas não libera automaticamente Production protegido. A referência jxeouysg4 é Production, portanto login sozinho não garante acesso às duas revisões.

Não ampliar Trusted Sources nem mudar Deployment Protection por conta própria. Se o acesso normal já permitir ambas as URLs no processo de medição, continuar. Se houver erro de ambiente, identificar antes um Preview existente cuja equivalência de árvore de aplicação com7fec6b2 possa ser comprovada; registrar commit, diferenças de configuração e URL. Não assumir equivalência pelo nome da branch. Se não houver referência equivalente acessível, voltar ao CTO com o diagnóstico exato e as opções concretas, sem criar deployment ou alterar acesso silenciosamente.

Após acesso comprovado às duas revisões, executar o CTO20:80 medições (oito células de dez execuções), cache frio/quente separados, instrumentação antes da navegação e reprodução da âncora. Não confundir80 medições com80 células.

## Limites

Login normal e leituras necessárias ao QA não são autorização para nova chave, configuração de acesso, produção, env, merge, deploy, escrita Wix ou envio real. A navegação por fragmento permanece sem aceite; nenhuma correção de aplicação nesta revisão.

Só documentação alterada pelo CTO. Nenhum comando de login, token ou operação externa executado nesta revisão.
