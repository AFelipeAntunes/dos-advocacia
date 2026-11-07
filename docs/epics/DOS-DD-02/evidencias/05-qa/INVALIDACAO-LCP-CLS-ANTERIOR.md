# Invalidação — LCP/CLS da bateria anterior (CTO 13 R1)

Data: 2026-11-07.

Os arquivos abaixo preservam a bateria original do card 05 **sem alteração dos números**:

- `INVALIDATED-perf-lab-raw.json`
- `INVALIDATED-perf-lab-summary.json`
- `INVALIDATED-perf-lab-console.txt`
- `INVALIDATED-perf-lab-run.log`

Motivo (parecer CTO 13):

1. `performance.getEntriesByType("largest-contentful-paint")` / `layout-shift` sem PerformanceObserver buffered não coletam LCP/CLS de forma válida; o fallback FCP e CLS=0 por array vazio invalidam a métrica.
2. Comparação localhost candidato × CDN produção mistura origem/rede/terceiros com efeito de código.
3. A tabela do `RELATORIO-CONSOLIDADO.md` inicial não coincidia com o summary da mesma corrida.

A medição corrigida está em:

- `perf-lab-controlled.mjs`
- `perf-lab-controlled-raw.json`
- `perf-lab-controlled-summary.json`
- `RELATORIO-CTO13-R1R2R3.md`

Não usar os arquivos INVALIDATED-* para decisão de regressão LCP/CLS.
