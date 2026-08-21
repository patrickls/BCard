/**
 * Sorteia `count` itens de `pool`, evitando repetir um item já exibido (excludeIds)
 * até que todos os itens do pool tenham aparecido. cycleReset=true indica que o ciclo
 * de "já exibidos" foi reiniciado nesta rodada — o caller deve descartar o histórico
 * de exclusão anterior e recomeçar a partir dos itens retornados.
 */
export function pickRound<T extends { id: string }>(
  pool: T[],
  count: number,
  excludeIds: string[]
): { items: T[]; cycleReset: boolean } {
  const shuffle = <U>(items: U[]): U[] => [...items].sort(() => 0.5 - Math.random());
  const excludeSet = new Set(excludeIds);
  const remaining = pool.filter((item) => !excludeSet.has(item.id));

  if (remaining.length >= count) {
    return { items: shuffle(remaining).slice(0, count), cycleReset: false };
  }

  const shuffledRemaining = shuffle(remaining);
  const usedIds = new Set(shuffledRemaining.map((item) => item.id));
  const fillPool = pool.filter((item) => !usedIds.has(item.id));
  const needed = count - shuffledRemaining.length;
  const fill = shuffle(fillPool).slice(0, needed);

  return { items: [...shuffledRemaining, ...fill], cycleReset: true };
}
