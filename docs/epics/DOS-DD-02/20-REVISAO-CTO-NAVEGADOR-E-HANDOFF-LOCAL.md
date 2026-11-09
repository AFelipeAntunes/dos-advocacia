# CTO20 — devolutiva do agente navegador e handoff ao agente local

08/11/2026. DEVOLUTIVA ACEITA COMO DIAGNÓSTICO DE CAPACIDADE; NÃO É ACEITE DE DESEMPENHO. CARD05 CONTINUA ABERTO.

## O que está comprovado e o que falta

O agente relatou identidade correta das revisões e checagem funcional de retrato/FAQ. Declarou corretamente que não mediu desempenho. Capturas são funcionais; metrics.csv vazio não é benchmark. Os arquivos de scratch não foram fornecidos nem copiados ao worktree nesta revisão, portanto não se atribui conferência independente a esses arquivos.

A referência informada é7fec6b2 e o candidato informado2abfbeb, mas a URL candidata citada pelo agente é fp0125m2c: ela é o Preview posterior ao override de SITE_URL, não o primeiro da PR. Preservar essa identidade no relatório final.

## Correção da prova de âncora

src/lib/contact-form.ts:125 gera um div sr-only com id `${config.pageSlug}-contact-title` dentro da seção. O HTML local de produção .next/server/app/due-diligence-imobiliaria.html contém id due-diligence-imobiliaria-contact-title e o formulário. Não contém link href="#due-diligence-imobiliaria-contact-title". Assim, ausência de id no próprio form/section não prova ausência de alvo no documento, nem ausência de link para esse alvo representa por si só descumprimento da copy aprovada.

Entretanto, evidencias/05-qa/cto16-scope-and-qa.json registra formAnchorExists=true, anchorInView=false e formTop2033 desktop/3491 mobile. O relatório anterior apresentou essa navegação como aprovada sem que os indicadores a sustentassem. Errata CTO: retirar o aceite dessa prova; reproduzir a navegação por fragmento e verificar o alvo de fato visível. Nenhum defeito novo foi corrigido nesta revisão. Código, estilos, sr-only e content-visibility precisam ser considerados na reprodução; causa ainda não isolada.

## Handoff — executar no Cursor/local Windows, não no navegador limitado

Você é o executor de QA local de DOS-DD-02.05. Worktree D:\Projetos desenvolvimento\.dos-dd-02-04-cta, branch qa/dos-dd-02-05. Leia AGENTS.md, PROJECT_CONTEXT.md, docs/ARCHITECTURE.md e pareceres17–20. Preserve alterações documentais/evidências locais não commitadas e outros worktrees.

### 1. Preflight obrigatório, antes de bateria de medições

Confirme revisão/projeto/ambiente atuais. Referências conhecidas:

- Base7fec6b2fb2da7dc5408498099e7c4917aa33bb4d: https://dos-advocacia-jxeouysg4-dos-advocacia.vercel.app/due-diligence-imobiliaria.
- Candidato2abfbebab000a89250e0c18a29b06d0a161c6864: https://dos-advocacia-fp0125m2c-dos-advocacia.vercel.app/due-diligence-imobiliaria.

Use Chrome/Playwright/CDP com perfil isolado. Scripts existentes perf-dd-h1-probe.mjs e perf-lab-controlled.mjs são referências de instrumentação, não prova de autenticação remota ou suporte a cache quente. Confirme primeiro acesso autenticado às DUAS URLs pelo mesmo processo automatizado, sem capturar página SSO como resultado. Reutilize CLI/OIDC autorizado existente e siga a skill Vercel de deployments protegidos quando aplicável. Cabeçalhos de autenticação precisam ficar restritos às origens autorizadas e fora de artefatos/logs. Não copiar cookies/perfil pessoal do navegador, desativar proteção, criar chave ou link público para contornar falta de acesso.

Se esse acesso não estiver disponível, devolver imediatamente o bloqueio exato e o menor passo de autenticação necessário. Não rodar80 páginas de login, não repetir o mesmo pedido a outro agente navegador sem capacidade, nem publicar para conseguir medir.

### 2. Medição, somente depois do preflight

Mesma máquina/Chrome; dez execuções por revisão × desktop/mobile × frio/quente,80 no total, ordem alternada. Desktop1440x900; mobile390x844, CPU4x, download1,6Mbps/upload750kbps/latência150ms. Registrar configuração CDP real; cache quente deve ser aquecido e não limpo/desativado como no frio. Distinguir cache de navegador do estado de CDN, aquecendo ambas as revisões de modo equivalente e registrando cabeçalhos pertinentes quando disponíveis.

Observadores buffered antes da navegação para LCP, CLS e long tasks; sem fallback FCP. Janela declarada; LCP com elemento e URL. Registrar TTFB, bytes e JS/CSS com método explícito de contagem. Bloqueio calculado sem Lighthouse deve ser nomeado proxy, não TBT. Guardar dados brutos, medianas/dispersão/deltas pareados e falhas; sem descartar rodadas desfavoráveis. Nenhuma tolerância nova será considerada aprovação de Felipe.

Scroll e retrato em sonda separada para não alterar o LCP inicial. INP de campo não é comprovado por laboratório. Só ampliar a investigação se houver regressão reproduzível, sem refactor especulativo ou remoção de copy/retrato.

### 3. Reprodução dirigida da âncora

No candidato final, abrir a URL com #due-diligence-imobiliaria-contact-title em desktop/mobile e verificar existência do alvo, posição com limites superior E inferior do viewport, posição e visibilidade do formulário após estabilização de fontes/layout. Comparar com o JSON histórico acima. Uma propriedade testada não basta: o script deve agregar o resultado e falhar se a condição obrigatória não for cumprida. Não usar só rect.top < innerHeight, pois coordenadas negativas também passam nessa condição.

Separar três coisas: alvo id existente, link interno existente, navegação visível funcionando. Não adicionar um botão à copy aprovada apenas porque não há link para o formulário. Se a navegação realmente falhar, devolver causa e proposta mínima ao CTO, sem corrigir aplicação neste card de QA.

### 4. Entrega e limites

Salvar em D:\Projetos desenvolvimento\.dos-dd-02-04-cta\docs\epics\DOS-DD-02\evidencias\05-qa\preview-performance-final\: relatório, script reproduzível, dados brutos, métricas válidas e capturas. Não deixar a única cópia em scratch inacessível. Nenhum secret, cookie, token ou estado de autenticação nos artefatos.

Devolver Referências/SHA | Acesso/método | Resultados antes/depois | Âncora | Gaps | Veredito (apto/regressão reproduzível/inconclusivo). Não encerrar gate com build verde ou métrica ausente.

Sem commit/push/PR novo, merge, deploy, env, Wix, formulário real ou WhatsApp real por este handoff. Processos encerrados somente por PID criado pelo próprio script. Medições isoladas já foram autorizadas por Felipe nesta conversa; não repetir confirmação genérica. Se surgir necessidade de credencial nova ou mudança de acesso/configuração, voltar com a ação concreta necessária.
