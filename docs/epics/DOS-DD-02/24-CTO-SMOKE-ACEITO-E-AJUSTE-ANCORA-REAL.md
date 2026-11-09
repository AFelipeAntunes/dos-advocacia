# CTO24 — smoke de eventos/formulário aceito; ajuste local da âncora real

09/11/2026. CTAs/EVENTOS E FORMULÁRIO INTERCEPTADO ACEITOS. CORREÇÃO LOCAL CSS LIBERADA TECNICAMENTE. PRODUÇÃO NÃO LIBERADA.

Lidos RELATORIO-CTO23-SMOKE.md, smoke-cto23.json e CSS/HTML atuais. O bruto confirma ctas.ok=true, form.ok=true, ok geral=false pela âncora. Isso comprova instrumentação no navegador com interceptação/captura local, não DebugView nem envio Resend real. Desempenho80/80 e limpezaD permanecem aceitos conforme CTO23.

## Defeito rastreado

O link aprovado do hero aponta para #o-que-voce-recebe; src/legacy-pages/due-diligence-imobiliaria.html:205 atribui o id ao H2. O header global é sticky, top0, com altura92px em desktop e variante mobile. Não há scroll-margin no H2; .area-row possui regra própria para outros alvos, sem efeito aqui. O smoke registra H2.top=0 depois do clique e cabeçalho sobrepondo79–93px. Defeito visível de navegação real, distinto do fragmento sr-only não bloqueante do formulário.

## Handoff ao Cursor — executar somente este ajuste

1. Adicionar scroll-margin-top somente ao alvo desta landing, com seletor `.dd-lcp-opt #o-que-voce-recebe` ou seletor equivalente igualmente restrito. Usar folga suficiente para a altura efetiva do header com menu fechado mais espaçamento legível. Não aplicar regra global, mudar header, copy, id, href, formulário, JS ou comportamento dos demais serviços. Nenhum novo componente/dependência.
2. Medir clique no link visível e abertura direta do fragmento em390/768/1000/1440. Após estabilizar layout/fontes, afirmar que o topo do H2 está abaixo do fundo do header e que o título cabe na área visível. Teste deve falhar se essa condição não ocorrer; guardar coordenadas do header/título, hash e capturas390/1440. Se o CSS isolado não resolver por causa do layout diferido, devolver causa/alternativa mínima; não improvisar scroll em JS.
3. Executar typecheck e build exigidos pelo AGENTS. Sem repetir80 medições, suítes sem relação ou smoke de formulários/eventos já aceitos, salvo mudança além da propriedade proposta. Conferir delta CSS pequeno e ausência de alteração JS/copy para justificar o reaproveitamento da evidência anterior de desempenho.
4. Registrar diff, provas e pareceres na documentação do projeto. Preservar documentação/evidências locais não commitadas e arquivos .env/.vercel fora dos artefatos. Sem commit/push/merge/deploy/env/Wix por esta devolução.

Não pedir nova aprovação editorial nem autorização genérica de Felipe para esta correção local reversível, já dentro do escopo da landing. Não confundir a liberação técnica local com autorização de publicação.

## Fechamento após retorno

Com o ajuste dirigido aprovado, CTO prepara o commit de release na PR12 incluindo evidências sanitizadas e revisão dos lastModified das rotas realmente alteradas para o rollout autorizado. Produção ainda exige autorização específica do lote concreto. Datas não devem ser registradas como deploy realizado antes de ele acontecer. DebugView real e smoke público seguem a publicação autorizada, sem reabrir as medições aceitas sem motivo.
