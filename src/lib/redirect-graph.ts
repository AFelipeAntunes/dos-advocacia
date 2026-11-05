/**
 * Utilitários puros para validar grafos de redirect (ativo + fixture).
 * Sem dependência de Next.js / rede.
 */

export type PathPair = readonly [source: string, destination: string];

export function sourcesOf(pairs: readonly PathPair[]): string[] {
  return pairs.map(([source]) => source);
}

export function destinationsOf(pairs: readonly PathPair[]): string[] {
  return pairs.map(([, destination]) => destination);
}

/** Origem aponta para si mesma. */
export function selfLoops(pairs: readonly PathPair[]): PathPair[] {
  return pairs.filter(([source, destination]) => source === destination);
}

/** Duas regras com a mesma origem. */
export function duplicateSources(pairs: readonly PathPair[]): string[] {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const [source] of pairs) {
    if (seen.has(source)) dupes.push(source);
    seen.add(source);
  }
  return dupes;
}

/**
 * Cadeia/loop: algum destino do conjunto é também origem de outra regra.
 * Destino compartilhado (várias origens → mesmo destino final) é permitido.
 */
export function destinationIsAlsoSource(pairs: readonly PathPair[]): PathPair[] {
  const sourceSet = new Set(sourcesOf(pairs));
  return pairs.filter(([, destination]) => sourceSet.has(destination));
}

/**
 * Resolve saltos seguindo o mapa origem→destino.
 * Ciclo real: destino já visitado. Limite de saltos: `maxHopsReached`, sem
 * classificar como ciclo (ressalva do parecer 06).
 */
export function resolveRedirectChain(
  pairs: readonly PathPair[],
  start: string,
  maxHops = 8
): { final: string; hops: string[]; cycle: boolean; maxHopsReached: boolean } {
  const map = new Map(pairs.map(([source, destination]) => [source, destination] as const));
  const hops: string[] = [start];
  let current = start;
  for (let i = 0; i < maxHops; i++) {
    const next = map.get(current);
    if (!next) return { final: current, hops, cycle: false, maxHopsReached: false };
    if (hops.includes(next)) {
      hops.push(next);
      return { final: next, hops, cycle: true, maxHopsReached: false };
    }
    hops.push(next);
    current = next;
  }
  return { final: current, hops, cycle: false, maxHopsReached: true };
}
