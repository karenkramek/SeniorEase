import { Platform } from "react-native";

/** Largura máxima do conteúdo no navegador (evita linhas longas e “vazio” no centro). */
export const WEB_CONTENT_MAX_WIDTH = 720;

export function getWebContentShellStyle(): {
  width: "100%";
  maxWidth: number;
  alignSelf: "center";
} | Record<string, never> {
  if (Platform.OS !== "web") {
    return {};
  }
  return {
    width: "100%",
    maxWidth: WEB_CONTENT_MAX_WIDTH,
    alignSelf: "center",
  };
}
