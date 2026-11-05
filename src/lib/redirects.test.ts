import assert from "node:assert/strict";
import test from "node:test";

import nextConfig, { postConsolidationRedirects } from "../../next.config";
import {
  f7OriginExcluded,
  inventarioHistoricalOrigin,
  inventarioSharedDestination,
  loteForaEscopo,
  loteSeisPares
} from "@/lib/redirect-lote-seis";
import { legacyRedirects, postConsolidationRedirects as configPairs } from "@/lib/redirect-config";
import {
  destinationIsAlsoSource,
  duplicateSources,
  resolveRedirectChain,
  selfLoops,
  type PathPair
} from "@/lib/redirect-graph";

/**
 * Expectativa independente: 12 históricos + 6 do lote (1/2/3/8/9/11).
 * Se `redirect-config.ts` divergir, o teste falha.
 */
const EXPECTED_HISTORICAL: readonly PathPair[] = [
  [
    "/post/compra-de-imóvel-em-inventário-o-risco-que-ninguém-te-conta-antes-de-assinar",
    "/post/compra-de-imóvel-em-inventário-riscos-que-ninguém-te-conta"
  ],
  [
    "/post/contrato-de-gaveta-riscos-jurídicos-que-podem-custar-seu-imóvel",
    "/post/contrato-de-gaveta-você-comprou-pagou-mas-não-é-o-dono-do-imóvel"
  ],
  [
    "/post/permuta-de-imóvel-o-risco-que-a-torna-não-resolve",
    "/post/permuta-de-imóvel-riscos-jurídicos-que-ninguém-conta-antes-de-trocar"
  ],
  [
    "/post/multipropriedade-imobiliária-o-que-parece-férias-pode-virar-dívida",
    "/post/multipropriedade-imobiliária-riscos-jurídicos-que-o-comprador-precisa-conhecer"
  ],
  [
    "/post/cadastro-imobiliario-brasileiro-o-que-o-cib-muda-na-compra-do-seu-imovel",
    "/post/cib-e-cruzamento-de-dados-os-riscos-jurídicos-que-ninguém-avisou-ao-vendedor"
  ],
  [
    "/post/locação-por-temporada-o-prazo-que-vira-residencial-sem-aviso",
    "/post/locação-por-temporada-virou-residencial-a-imobiliária-sabia-do-risco"
  ],
  [
    "/post/atraso-na-entrega-do-imóvel-na-planta-o-risco-oculto",
    "/post/atraso-na-entrega-de-imóvel-na-planta-direitos-do-comprador-que-a-construtora-não-conta"
  ],
  [
    "/post/o-imóvel-estava-alugado-o-comprador-só-descobriu-o-risco-depois-de-assinar-a-escritura",
    "/post/o-imóvel-estava-alugado-o-comprador-assinou-o-inquilino-entrou-na-justiça-para-ficar-com-ele"
  ],
  [
    "/post/o-imóvel-estava-alugado-quando-o-comprador-fechou-o-negócio-o-inquilino-entrou-na-justiça",
    "/post/o-imóvel-estava-alugado-o-comprador-assinou-o-inquilino-entrou-na-justiça-para-ficar-com-ele"
  ],
  [
    "/post/o-imóvel-foi-entregue-com-defeito-o-comprador-só-descobriu-depois-de-assinar-a-escritura-1",
    "/post/o-imóvel-foi-entregue-com-defeito-o-comprador-só-descobriu-depois-de-assinar-a-escritura"
  ],
  [
    "/post/distrato-imobiliário-quanto-a-incorporadora-pode-reter",
    "/post/distrato-de-imóvel-na-planta-a-construtora-quis-reter-50-o-stj-disse-que-não"
  ],
  [
    "/post/distrato-de-imóvel-na-planta-em-2026-quanto-você-tem-direito-a-receber-de-volta",
    "/post/distrato-de-imóvel-na-planta-a-construtora-quis-reter-50-o-stj-disse-que-não"
  ]
];

const EXPECTED_LOTE_SEIS: readonly PathPair[] = loteSeisPares.map((p) => [p.origem, p.destino]);

const EXPECTED_ACTIVE: readonly PathPair[] = [...EXPECTED_HISTORICAL, ...EXPECTED_LOTE_SEIS];

test("preserva os 12 históricos e adiciona exatamente os 6 pares do lote (18 total)", async () => {
  assert.equal(postConsolidationRedirects.length, 18);
  assert.equal(configPairs.length, 18);
  assert.deepEqual([...configPairs], [...EXPECTED_ACTIVE]);
  assert.deepEqual([...configPairs.slice(0, 12)], [...EXPECTED_HISTORICAL]);
  assert.equal(new Set(postConsolidationRedirects.map(([source]) => source)).size, 18);
  assert.deepEqual(selfLoops(EXPECTED_ACTIVE), []);
  assert.deepEqual(duplicateSources(EXPECTED_ACTIVE), []);
  assert.deepEqual(destinationIsAlsoSource(EXPECTED_ACTIVE), []);

  const redirects = await nextConfig.redirects?.();
  assert.ok(redirects);

  for (const [source, destination] of EXPECTED_ACTIVE) {
    assert.deepEqual(
      redirects.find((redirect) => redirect.source === encodeURI(source)),
      { source: encodeURI(source), destination: encodeURI(destination), statusCode: 301 }
    );
  }
});

test("preserva os 11 redirects .html na configuração ativa", async () => {
  assert.equal(legacyRedirects.length, 11);
  const redirects = await nextConfig.redirects?.();
  assert.ok(redirects);
  for (const [source, destination] of legacyRedirects) {
    assert.deepEqual(redirects.find((redirect) => redirect.source === source), {
      source,
      destination,
      permanent: true
    });
  }
});

test("lote seis: identidades literais NFC iguais ao manifesto e encodeURI estável", () => {
  assert.deepEqual(
    loteSeisPares.map((p) => p.par),
    [1, 2, 3, 8, 9, 11]
  );
  for (const pair of loteSeisPares) {
    assert.equal(pair.origem, pair.origem.normalize("NFC"));
    assert.equal(pair.destino, pair.destino.normalize("NFC"));
    assert.notEqual(pair.origem, pair.origem.toUpperCase());
    assert.notEqual(encodeURI(pair.origem), pair.origem);
    assert.equal(encodeURI(pair.origem), encodeURI(decodeURI(encodeURI(pair.origem))));
    assert.equal(encodeURI(pair.destino), encodeURI(decodeURI(encodeURI(pair.destino))));
    assert.match(encodeURI(pair.origem), /%C3%/i);
  }
});

test("F7 e pares 4/5/6/10 permanecem fora do runtime", async () => {
  assert.deepEqual([...loteForaEscopo.semFusao], [4, 5]);
  assert.deepEqual([...loteForaEscopo.retidos], [6, 10]);
  assert.deepEqual([...loteForaEscopo.excluidoDesteLote], [7]);

  const redirects = await nextConfig.redirects?.();
  assert.ok(redirects);
  const sources = new Set(redirects.map((r) => r.source));
  assert.equal(sources.has(encodeURI(f7OriginExcluded)), false);
  assert.equal(sources.has(f7OriginExcluded), false);
});

test("grafo ativo: um salto, sem ciclo; par 9 compartilha destino de inventário", () => {
  for (const [source] of EXPECTED_ACTIVE) {
    const chain = resolveRedirectChain(EXPECTED_ACTIVE, source);
    assert.equal(chain.cycle, false, `ciclo em ${source}`);
    assert.equal(chain.maxHopsReached, false);
    assert.ok(chain.hops.length === 2, `mais de um salto em ${source}: ${chain.hops.join(" -> ")}`);
  }

  const par9 = loteSeisPares.find((p) => p.par === 9);
  assert.ok(par9);
  assert.equal(par9.destino, inventarioSharedDestination);

  const fromHistorical = resolveRedirectChain(EXPECTED_ACTIVE, inventarioHistoricalOrigin);
  const fromNew = resolveRedirectChain(EXPECTED_ACTIVE, par9.origem);
  assert.equal(fromHistorical.final, inventarioSharedDestination);
  assert.equal(fromNew.final, inventarioSharedDestination);
  assert.equal(fromHistorical.hops.length, 2);
  assert.equal(fromNew.hops.length, 2);
});

test("regras Next não usam has/missing que capturariam ou descartariam query", async () => {
  const redirectsFn = nextConfig.redirects;
  assert.ok(redirectsFn);
  const redirects: Array<Record<string, unknown>> = await redirectsFn();
  for (const pair of loteSeisPares) {
    const encoded = encodeURI(pair.origem);
    const found = redirects.filter((r) => r.source === encoded);
    assert.equal(found.length, 1, `regra ausente ou duplicada: ${pair.origem}`);
    assert.equal(found[0].has, undefined);
    assert.equal(found[0].missing, undefined);
    assert.equal(found[0].statusCode, 301);
  }
});
