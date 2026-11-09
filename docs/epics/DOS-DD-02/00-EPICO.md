# DOS-DD-02 — Due diligence imobiliária e conversão do blog

Versão 1.0, planejamento CTO de 07/11/2026. Estado PREPARADO PARA AGENTES. Implementação e publicação ainda não iniciadas por este planejamento.

## Objetivo e escopo

Reescrever a página existente /due-diligence-imobiliaria e conectar artigos de compra ao serviço, preservando a separação entre conteúdo informativo e contratação, os canais de contato e o desempenho mobile/desktop. Fonte de demanda em HANDOFF-ORIGINAL-CMO.md, recebida como referência do CMO.

Baseline técnico consultado em leitura no worktree .dos-seo-finalizacao. origin/main remoto confirmado em 7fec6b2fb2da7dc5408498099e7c4917aa33bb4d em 07/11. O checkout principal está em qa/dos-seo-01-preview com alterações locais anteriores. Os agentes devem partir do main remoto atualizado, sem reaproveitar a base antiga do principal.

## Parecer CTO

Viável com evolução do HTML institucional, renderer SSR e classificador de CTA existentes. Nenhuma rota, CMS ou infraestrutura nova é necessária.

O H1 atual não contém o termo de busca. A Home e a landing de compra já possuem links para o serviço no código consultado. O handoff também reconhece o link no artigo principal de due diligence. Portanto, a afirmação de ausência total de links precisa ser substituída pelo inventário real. Não criar links duplicados.

Categorias são identificadas por categoryIds Wix. Contratos Imobiliários reúne intenções diferentes e não autoriza exibir CTA de comprador em todo o catálogo. O card 01 deve produzir matriz por artigo e resolver casos multicategoria antes de qualquer implementação do bloco.

O tracker atual seleciona um único .article-service-cta e mantém listeners no conteúdo e no bloco. Um CTA compacto dentro do conteúdo exige escopo inequívoco, múltiplos blocos e exclusão de dupla contagem. Há link_url no evento WhatsApp do artigo. Os novos fluxos devem ter contrato de privacidade explícito e nenhum dado de mensagem/PII.

As métricas Search Console/GA4 e as cinco alterações Wix de 06/11 são informações fornecidas pelo CMO. Não foram verificadas no painel nesta análise. Os IDs no handoff são prefixos e precisam ser resolvidos para identidades completas.

## Frentes, dependências e gates

| Card | Entrega | Dependência |
| --- | --- | --- |
| 01 | Auditoria e matriz de elegibilidade dos artigos | Primeiro envio |
| 02 | Copy final e decisões Drielle/CMO | Pode preparar junto do 01 |
| 03 | Landing, SEO, schema e links institucionais | 01 e versão editorial revisada do 02 |
| 04 | CTA no blog e analytics, na mesma frente técnica | Matriz 01 aceita e contrato editorial 02 |
| 05 | Integração, QA e comparação de velocidade | 03 e 04 aceitos pelo CTO |
| 06 | Plano e execução autorizada de release | 05 aceito, copy confirmada e autorização Felipe |
| 07 | Acompanhamento de SEO/conversão e títulos | Registro pode começar agora, resultados após janela |

03 e 04 podem usar worktrees separados após os gates. O dono do 03 altera o HTML da landing e páginas institucionais. O dono do 04 altera componentes, renderer Rich Content, tracker e estilos restritos ao CTA. globals.css, package.json e docs compartilhadas devem ter um único responsável de integração, coordenado pelo CTO. Não executar analytics e inserção Rich Content em frentes concorrentes sobre a mesma cadeia de dados.

## Decisões que precisam constar da revisão

- Drielle confirma a frase autobiográfica e o prazo combinado caso a caso, assinalados pelo CMO.
- Confirmar se os quatro entregáveis, atendimento documental nacional, atendimento a vendedor e retorno em 24 horas úteis correspondem ao serviço. A confirmação antiga de outra landing não resolve automaticamente o escopo novo.
- A redação jurídica sobre boa-fé, concentração na matrícula e fraude à execução exige validação oficial atual e aceite editorial. Evitar promessa de negócio seguro ou roteiro para o leitor fazer a análise sozinho.
- Proposta técnica conservadora para multicategoria com Assessoria para Imobiliárias mantém o bloco B2B atual e suprime o novo CTA B2C. Card 01 submete a matriz ao CTO, sem presumir elegibilidade pela primeira categoria.
- Categoria Contratos sem persona comprovada fica sem novo CTA. Validar relação de posts e configuração mínima existente antes de escolher mecanismo de exceção por ID.
- Manter cta_position existente. Proposta para o novo CTA usa meio_artigo e fim_artigo, com mapeamento explícito compacto/completo. Preservar os valores históricos dos cliques editoriais e do B2B.
- lastModified deve corresponder ao deploy efetivo, não à data do handoff. Não preencher data futura como fato consumado.

## Fora deste lote

Limpeza em massa dos 68 títulos longos ou 27 sufixos, reescrita do post de due diligence pelo CMO, reclassificações Wix sem aprovação, novas fusões, redirects, novas fotos, rodapé automático e mudanças no perfil Google. As cinco alterações já relatadas não devem ser repetidas.

A revisão do post informativo é uma frente editorial do CMO, com entrega e aprovação próprias. Coordenar datas com o card 07 para não atribuir todos os efeitos à landing.

## Definição de pronto

Copy final identificada e confirmada, contratos/matriz aceitos, fluxo real do artigo até serviço/contato comprovado, nenhum evento duplicado, SEO/schema e acessibilidade corretos, comparação mobile/desktop contra referência identificada, release autorizado e smoke público. Ranking e conversão só podem ser avaliados após coleta. O protocolo local de browser não equivale a INP de campo.


## Atualização CTO de 07/11/2026

A revisão do CMO está preservada em HANDOFF-CMO-ATUALIZADO-20261107.md. As duas confirmações Drielle foram relatadas e a copy liberada pelo CMO. O card 01 foi revisado com hashes conferidos. O parecer 08-REVISAO-CTO-AUDITORIA-E-HANDOFF-V2.md prevalece sobre propostas anteriores do contrato e sobre pendências editoriais superadas. CMS/multicategoria e propagação do artigo principal seguem provas de integração, não motivo para refazer a auditoria ou paralisar a landing local.


## Aceite CTO do card02 em 07/11/2026

Parecer09-ACEITE-CTO-COPY-CARD02.md aceita copy-final.md v1.0 (SHA-256 9af22a5932ff9a15f96b1354cdb9f6431d60f0b19a17f7573a2b34c1a00e7165). Implementação local liberada conforme os escopos e dependências dos pareceres08/09. Nenhum novo aceite das duas confirmações editoriais é necessário.


## Aceite CTO do card03 em07/11/2026

Parecer10 aceita a landing local. Repetidos46testes, build23 e typecheck, FAQ/schema/formulário conferidos em navegador. Próxima entrega é card04; integração/QA05 e release06 permanecem gates próprios.


## Review CTO do card04 em07/11/2026

Devolvido para R1 corte de contato e R2 prova comportamental do tracker, conforme parecer11. Classificador, copy e card03 preservados. QA05 ainda aguarda aceite04.


## Aceite CTO R1/R2 em07/11/2026

Parecer12 aceita04 localmente com56Wix+4analytics, build23/typecheck.03 preservado por hash. Próxima entrega é QA05 sobre composição local03+04, mantendo gates de evidência real/Preview/performance e autorizações operacionais.


## Review CTO do QA05 e retrato em07/11/2026

Parecer13 aceita retrato e preserva cards03/04. Medição devolvida R1–R3 por LCP/CLS coletados incorretamente, comparação local/CDN sem controle e relatório/manifesto divergentes. Conclusão de ausência de regressão permanece aberta.


## Revisão CTO da bateria controlada em07/11/2026

Parecer15 aceita instrumentação e integridade R1–R3, mantendo desempenho aberto por DD+80msdesktop/+268msmobile. Requer somente sonda dirigida10execuções/revisão/perfil e rastreio do H1 como LCP. Retrato aceito e não carregado na dobra fria.


## Parecer16 — sonda H1
Sonda local com melhora aceita como evidência. Aceite final QA05 aguarda limitar otimizações à DD, sonda dirigida final e smoke de âncoras/FAQ/formulário/scroll. Ver 16-REVISAO-CTO-SONDA-H1.md. Preview e produção não liberados nesta revisão.


## Parecer17 — escopo DD aceito
R1 do CTO16 fechado por revisão de código/evidências. Base local de PR/Preview aceita tecnicamente; card05 não encerrado. Mobile final +54 ms (5/10) permanece gate aberto para comparação equivalente no Preview, sem novo refactor especulativo. Operações Git/Preview dependem de autorização específica. Ver 17-ACEITE-CTO-ESCOPO-DD-E-GATE-PREVIEW.md.


## Integração PR12 —07/11/2026
Commit74293fe e Preview Ready; aceites reais de artigos/multicategoria registrados no18. Canonical dos artigos revela SITE_URL genérica antiga; override solicitado só para qa/dos-dd-02-05. Release, desempenho mobile final e GA4 real não aprovados. Sem merge/produção.


## CTO20 — medição não executada e errata da âncora
Devolutiva do navegador é diagnóstico de capacidade, não benchmark. Próximo executor local/CDP; preflight autenticado primeiro. Prova antiga de navegação ao formulário não passou (anchorInView=false), apesar de alvo existente. Handoff completo no20. Sem alteração de aplicação/produção.


## CTO22 — B comprovada; D autorizado ao executor
Referência n7nukp43d/753bad4 tem árvore Git idêntica à Production7fec6b2. Medir Preview×Preview com OIDC, sem A/C. D autorizado por Felipe de forma restrita; executar e comprovar, não marcar concluído. Ver22 para cache quente, limites e limpeza.


## CTO23 — B/D e desempenho localizados aceitos
80 medições conferidas; quatro medianas sem piora. Outlier preservado com diferença concentrada emTTFB. Fragmento sr-only não é CTA aprovado: não bloqueante, aceite antigo retirado. Smoke conectado curto e preparação de release no23; nenhum merge/produção autorizado.


## CTO24 — smoke aceito, âncora real com correção local
Eventos e formulário interceptados aceitos. Liberado ajuste CSS isolado de scroll-margin-top em o-que-voce-recebe e QA dirigido; sem repetir bateria80. Próximo retorno fecha preparação de release pelo CTO, sem produção automática. Ver24.
