import { Platform } from "react-native";

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "bold" as const,
    lineHeight: 48, // 1.5x para melhor legibilidade
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold" as const,
    lineHeight: 36, // 1.5x para melhor legibilidade
  },
  body: {
    fontSize: 16,
    lineHeight: 24, // 1.5x para melhor legibilidade
  },
  /** Rótulos com quebra de linha (ex.: preferências + switch): entrelinha mais próxima. */
  bodyCompact: {
    fontSize: 16,
    lineHeight: 21,
  },
  caption: {
    fontSize: 14,
    lineHeight: 21, // 1.5x para melhor legibilidade
  },
};

/**
 * Web: Atkinson Hyperlegible (app/+html.tsx) — alta legibilidade, inclusive dislexia.
 * Nativo: undefined usa a fonte do sistema (SF Pro / Roboto).
 */
export function getUiFontFamily(): string | undefined {
  if (Platform.OS === "web") {
    return '"Atkinson Hyperlegible", "Segoe UI", system-ui, -apple-system, sans-serif';
  }
  return undefined;
}
