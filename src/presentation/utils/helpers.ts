/**
 * Utilitários gerais da aplicação
 * Funções auxiliares para manipulação de strings.
 */

// ============================================================================
// MANIPULAÇÃO DE STRINGS
// ============================================================================

/**
 * Trunca um texto para um comprimento máximo, adicionando "..." no final.
 * @param text - O texto a ser truncado.
 * @param maxLength - O comprimento máximo do texto.
 * @returns O texto truncado.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitaliza a primeira letra de cada palavra em uma string.
 * @param str - A string a ser capitalizada.
 * @returns A string com as palavras capitalizadas.
 */
export const capitalizeWords = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
