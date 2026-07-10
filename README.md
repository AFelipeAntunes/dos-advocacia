# DOS Advocacia Imobiliária — protótipo

Site estático, responsivo e sem dependências de build. Abra `index.html` por um servidor HTTP local ou publique a pasta em uma hospedagem estática com suporte a URLs limpas.

## Estrutura

- Home, páginas institucionais, quatro páginas de serviço e uma landing page de treinamentos em HTML semântico;
- Metadados únicos, `canonical`, Open Graph e JSON-LD aderente ao conteúdo visível;
- `robots.txt` e `sitemap.xml` prontos para o domínio canônico;
- Paleta enviada, Urbanist e logotipos oficiais;
- Hero original em `assets/images/hero-dos-advocacia.png` e fotografias autorais otimizadas em WebP para a apresentação da profissional e dos treinamentos.

## Pré-publicação obrigatória

1. O nome profissional canônico definido para o projeto é **Drielle Pereira**. Manter essa grafia nos cabeçalhos, no schema, no Google Business Profile e na autoria dos artigos.
2. Conferir endereço, telefone, e-mail, horário e Instagram antes de publicar. Eles foram espelhados do site atual.
3. Confirmar a autorização de uso das fotografias da profissional e das turmas antes da publicação em produção.
4. Migrar todos os artigos atuais para URLs próprias, com autora, data de publicação/revisão e links internos. Não excluir artigos que já recebem tráfego.
5. Criar redirecionamentos HTTP 301 individuais para cada URL antiga, especialmente posts e páginas de serviço. Não redirecionar todo o acervo para a home.
6. Validar schema no Rich Results Test, sitemap no Search Console e as páginas no URL Inspection depois do lançamento.
7. Revisar a comunicação conforme o Provimento OAB 205/2021 e a política de privacidade de acordo com as ferramentas que forem adicionadas.

## Ver localmente

No PowerShell:

```powershell
py -m http.server 4173
```

Depois, abra `http://localhost:4173`.
