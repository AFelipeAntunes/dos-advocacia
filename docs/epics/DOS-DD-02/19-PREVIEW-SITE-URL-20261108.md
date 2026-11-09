# Override SITE_URL do Preview — 08/11/2026

Felipe autorizou SITE_URL=https://www.dosadvocacia.com.br exclusivamente no Preview da branch qa/dos-dd-02-05, com geração de outro Preview. Production e credenciais excluídas do escopo.

## Configuração aplicada

Projeto oficial dos-advocacia na equipe DOS Advocacia. Criada variável Config SITE_URL, vinculada somente à Preview Branch qa/dos-dd-02-05. A tela confirmou sucesso e mostrou a nova linha com esse escopo. Entradas genéricas de Preview, outras branches e Production preservadas.

Redeploy manual do deployment f0ce238 abriu confirmação adicional por e-mail. Fluxo cancelado sem solicitar ou consultar código. Novo build será gerado pelo fluxo Git existente, mediante este commit documental na branch autorizada, sem mudança de aplicação.

## Validação após o build

- Commit documental `2abfbebab000a89250e0c18a29b06d0a161c6864`, aplicação inalterada em relação a74293fe/f0ce238. Build oficial Ready em26s,08/11/2026 às10:35BRT, deployment `B5czTCAa9sSmMErMEc8iNdkXFfi5`, branch qa/dos-dd-02-05.
- Preview oficial: https://dos-advocacia-fp0125m2c-dos-advocacia.vercel.app/due-diligence-imobiliaria.
- Artigo principal: title aprovado; canonical e og:url em https://www.dosadvocacia.com.br/post/ com slug exato codificado. BlogPosting contém domínio oficial e nenhum host preview-wix-blog-validation. Compacto/completo presentes uma vez cada.
- Artigo de fraude: canonical e og:url também corrigidos para o domínio oficial.
- Landing: canonical oficial, title/H1 aprovados, FAQPage com seis perguntas.
- Sitemap:123 URLs,108 posts, zero duplicatas, somente host www.dosadvocacia.com.br, landing uma vez.
- Capturas em evidencias/05-qa/site-url-preview-20261108/ (override-branch.jpg e landing-preview.jpg).

O status GitHub com nome Vercel – dos-advocacia apontou para um projeto homônimo sob felipe-antunes-projects. Ele não foi usado como prova do projeto oficial. A identidade/Ready acima foi confirmada diretamente no dashboard dos-advocacia/dos-advocacia e no Preview de sufixo dos-advocacia. Nenhuma configuração do homônimo foi alterada.

O gap anterior de velocidade mobile e o GA4/DebugView real continuam abertos; este ajuste de URL não os encerra. Nenhuma suíte repetida por este commit exclusivamente documental/configuração externa; testes114/typecheck/build anteriores não apresentados como nova medição.

Resultado: correção de SITE_URL validada no Preview. Evidências e fechamento pós-build são documentos locais nesta rodada; o commit2abfbeb contém o registro pré-build. PR12 continua em rascunho, sem merge. Rever lastModified no rollout real.

Sem merge, publicação de produção, escrita Wix, mudança de domínio ou credencial.
