import { useSegments } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useAppStrings } from "./useAppStrings";

/**
 * Hook que gerencia o título da página (aba do navegador)
 * Atualiza dinamicamente baseado na rota atual
 */
export function usePageTitle() {
  const segments = useSegments();
  const appTexts = useAppStrings();

  useEffect(() => {
    // Só atualiza o título em plataformas web
    if (Platform.OS !== "web") {
      return;
    }

    // Constrói o nome da página baseado nos segments da rota
    const pageName = getPageNameFromSegments(segments, appTexts);

    // Atualiza o título da aba do navegador
    if (pageName) {
      document.title = `SeniorEase - ${pageName}`;
    } else {
      document.title = "SeniorEase";
    }
  }, [segments, appTexts]);
}

/**
 * Mapeia os segments de rota para nomes legíveis de página
 */
function getPageNameFromSegments(
  segments: string[],
  appTexts: any,
): string {
  // Remove os parênteses usado nos layout groups
  const cleanSegments = segments
    .map((seg) => seg.replace(/[()]/g, ""))
    .filter((seg) => seg.length > 0);

  // Se não tem segments, é a home
  if (cleanSegments.length === 0) {
    return appTexts.navigation.tasksTabTitle || "Tarefas";
  }

  // Mapeia os segments para nomes de página
  const routeMap: Record<string, string> = {
    // Auth routes
    login: "Login",
    register: "Cadastro",

    // App routes
    tasks: appTexts.navigation.tasksTabTitle || "Tarefas",
    preferences: appTexts.navigation.preferencesTabTitle || "Preferências",
    help: appTexts.navigation.helpTabTitle || "Ajuda",
    profile: appTexts.navigation.profileTabTitle || "Perfil",

    // Modal routes
    "create-task": appTexts.navigation.createTaskHeaderTitle || "Nova Tarefa",
    "task-details": appTexts.navigation.taskDetailsHeaderTitle || "Detalhes da Tarefa",
    "edit-task": appTexts.editTask.screenLabel || "Editar tarefa",
    modal: appTexts.navigation.modalHeaderTitle || "Modal",
  };

  // Pega o último segment significativo (geralmente o mais específico)
  const lastSegment = cleanSegments[cleanSegments.length - 1];

  // Retorna o nome mapeado ou usa o segment como fallback
  return routeMap[lastSegment] || toTitleCase(lastSegment);
}

/**
 * Converte uma string para Title Case
 */
function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
