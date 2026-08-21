/**
 * Trim + lowercase + remove qualquer pontuação (ponto, vírgula, apóstrofo, aspas, etc.)
 * + colapsa espaços internos. Pontuação não deve reprovar uma resposta correta.
 */
export function normalizeToken(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Divide um texto em tokens usando qualquer caractere não-alfabético como separador. */
export function splitAnswerTokens(text: string): string[] {
  return text
    .split(/[^a-zA-Z]+/)
    .map(normalizeToken)
    .filter(Boolean);
}

/**
 * Compara a resposta do estudante com o(s) gabarito(s) esperado(s) por igualdade
 * EXATA de conjunto: precisa conter todos os itens esperados, nem a mais nem a menos.
 * Usado no Tipo A de Prepositions (respostas simples ou compostas).
 */
export function checkSetAnswer(given: string, expectedAnswers: string[]): boolean {
  const givenTokens = new Set(splitAnswerTokens(given));
  if (givenTokens.size === 0) return false;

  const expectedTokens = new Set(expectedAnswers.map(normalizeToken));
  if (givenTokens.size !== expectedTokens.size) return false;

  for (const token of expectedTokens) {
    if (!givenTokens.has(token)) return false;
  }
  return true;
}

/**
 * normalizeToken + trata contrações equivalentes como a mesma resposta
 * (ex.: "I'm"/"Im" e "I am" — após remover pontuação "I'm" vira "im").
 */
function normalizeSentence(text: string): string {
  return normalizeToken(text).replace(/\bim\b/g, 'i am');
}

/**
 * Compara a resposta do estudante com um único gabarito esperado (normalizado),
 * tratando contrações equivalentes (ex.: "I'm" / "I am") como a mesma resposta.
 */
export function checkSingleAnswer(given: string, expected: string): boolean {
  const normGiven = normalizeSentence(given);
  return normGiven !== '' && normGiven === normalizeSentence(expected);
}
