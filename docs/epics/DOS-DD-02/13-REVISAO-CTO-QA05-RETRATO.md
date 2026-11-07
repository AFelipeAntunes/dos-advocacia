# Revisão CTO — DOS-DD-02.05 e retrato

07/11/2026. RETRATO ACEITO VISUALMENTE. QA05 DEVOLVIDO NA MEDIÇÃO/RELATÓRIO. Aplicação permanece base apta à preparação de PR/Preview, sem autorização de execução remota por este parecer. Release ainda não liberado.

## Aceites preservados

Capturas metodo-portrait-desktop-1440.png e metodo-portrait-mobile-390.png examinadas. Desktop com retrato ao lado, mobile acima, enquadramento correto. Asset já existente com lazy, decoding async e1600x1600. CSS restrito dd-method, breakpoint usa estrutura existente. Cards03/04 e R1/R2 não são reabertos.

candidato-manifesto-sha256.txt18/18 e evidencias-sha256.txt10/10 conferem. Novo retrato muda o baseline visual anteriormente aceito, e será considerado na medição corrigida. Não alterar copy nem refazer layout por causa do problema de coleta.

## R1 — coleta de LCP e CLS inválida (P1)

Em perf-lab.mjs, measure() coleta performance.getEntriesByType("largest-contentful-paint") e performance.getEntriesByType("layout-shift"). Esses tipos exigem PerformanceObserver. O fallback atual transforma first-contentful-paint em lcpMs. A soma de array vazio para CLS gera zero sem medição válida.

Fonte técnica consultada:
https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByType

Reinstalar observadores de LCP, layout-shift e longtask antes da navegação, com buffered, gravar entradas brutas e suporte observado. LCP deve registrar entrada real e elemento quando disponível, sem substituir por FCP. Ausência de coleta gera gap/execução inválida. CLS deve usar janelas de sessão, excluir hadRecentInput e ter janela de observação explícita. O script anterior do projeto já usa PerformanceObserver, verificar antes de reescrever.

Guardar um controle de coleta que demonstre observador operando e, para CLS, deslocamento conhecido em fixture própria. Preservar os dados antigos com aviso de invalidação para LCP/CLS. Não editar números antigos para aparentarem medição corrigida.

A sonda lazy com scroll comprova carga/visibilidade do recurso, mas não comprova CLS zero. Acompanhar shifts durante o scroll e decodificação também, com dimensão reservada.

## R2 — comparação controlada (P2)

O laboratório compara localhost:3025 com CDN pública e executa todas as rodadas do candidato antes da referência. Isso confunde rede/CDN/origem/terceiros e ordem com o efeito do código. A ressalva sobre TTFB não torna a comparação LCP equivalente.

Reconstruir baseline7fec6b2 em árvore isolada e comparar com o candidato de manifesto fechado, mesmo Chrome/versão/máquina, builds produção, dependências pelo lock, políticas de recursos iguais e ordem alternada. Cinco execuções/célula, mobile390x844DPR2CPU4x1,6Mbps/750kbps/150ms e desktop1440x900. Reportar medianas e dispersão, identificar revisão e navegador reais e guardar medidas brutas. Se comparar via Preview/prod, mesma origem de acesso/topologia e controle equivalente ou declarar medição observacional complementar.

Medir JS/CSS/recursos completos. A expressão CSS atual inclui todo initiatorType=link, podendo contar fonte ou outros recursos. Filtrar CSS propriamente e incluir o documento no total transferido. Origem externa sem Timing-Allow-Origin pode ter transferSize zero: não deduzir redução real de JS por comparação parcial. Não atribuir11KB de queda à aplicação sem rastrear recursos.

Artigos B2C/B2B/multicategoria permanecem gates de Preview conectado, e precisam entrar na bateria final conforme05. Pode concluir primeiro a bateria institucional controlada sem credenciais CMS. Não refazer suites de aplicação sem motivo novo.

## R3 — consistência e integridade das evidências (P2)

A tabela do RELATORIO-CONSOLIDADO.md não coincide com perf-lab-summary.json. Exemplo Home desktop: relatório+57,6ms, summary−61,6ms. DD mobile: relatório−35,2ms, summary−1618,4ms. Identificar execução de origem e gerar tabela da mesma fonte final.

evidencias-pack-sha256.txt9entradas tem duas divergências: RELATORIO-CONSOLIDADO.md e candidato-manifesto-sha256.txt. Regenerar manifestos após fechar o relatório e registrar fontes antes/depois com timestamps reais.

A alegação de artigo principal com apenas um href canônico precisa normalizar URLs absolutas/relativas do HTML antes de contar. Dois registros de serviceLinks na página podem incluir bloco fora do corpo. Separar corpo editorial e CTA SSR e comparar com CMS/readback. Não republicar para reparar cache. Manter validação API dos categoryIds reais ou evidência equivalente completa, sem tratar ausência de.env.local como prova de ausência de conector.

## Gate e próxima entrega

Devolver R1–R3 da instrumentação, medição controlada institucional e relatório/manifestos consistentes. Os aceites de aplicação e retrato são preservados. Multicategoria real, CMS/cache e fluxo artigo→CTA em navegador conectado seguem pendentes. Quando a revisão corrigida chegar, solicitar somente a operação remota que ainda exigir autorização de Felipe sobre candidato identificável. Não confundir “base apta a PR” com QA05 completo ou release autorizado.

CTO apenas revisou fontes, capturas e manifests, sem implementação ou operação externa neste parecer.
