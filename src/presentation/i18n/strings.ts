export const ptBRStrings = {
  common: {
    confirm: "Confirmar",
    cancel: "Cancelar",
    close: "Fechar",
    closeMessage: "Fechar mensagem",
    notPossibleNow: "Não foi possível concluir a operação agora. Tente novamente.",
  },
  navigation: {
    tasksTabTitle: "Tarefas",
    tasksTabA11y: "Aba de tarefas",
    preferencesTabTitle: "Preferências",
    preferencesTabA11y: "Aba de preferências",
    helpTabTitle: "Ajuda",
    helpTabA11y: "Aba de ajuda e dicas",
    modalHeaderTitle: "Modal",
    createTaskHeaderTitle: "Nova Tarefa",
  },
  modalScreen: {
    title: "Este é um modal",
    titleA11y: "Título do modal",
    goHomeButton: "Ir para a tela inicial",
    goHomeButtonA11y: "Botão para ir para a tela inicial",
  },
  createTask: {
    screenLabel: "Tela de criação de tarefa",
    titleLabel: "Título da tarefa *",
    titlePlaceholder: "Título da tarefa",
    titleFieldLabel: "Campo para título da tarefa",
    titleRequiredHint: "Campo obrigatório",
    descriptionLabel: "Descrição da tarefa (opcional)",
    descriptionPlaceholder: "Descrição (opcional)",
    descriptionFieldLabel: "Campo para descrição da tarefa",
    createButton: "Criar Tarefa",
    createButtonA11y: "Botão para criar tarefa",
    titleRequiredError: "Informe um título para criar a tarefa.",
    createSuccess: "Tarefa criada com sucesso.",
    createError: "Não foi possível criar a tarefa.",
    createErrorDetail: "Não foi possível criar a tarefa agora. Tente novamente.",
  },
  taskList: {
    screenTitle: "Tarefas",
    listLabel: "Lista de tarefas",
    noTasks: "Nenhuma tarefa encontrada.",
    noTasksHint: "Crie uma nova tarefa para começar!",
    noTasksHintA11y: "Crie uma nova tarefa para começar",
    newTaskButton: "Nova Tarefa",
    newTaskButtonA11y: "Botão para criar nova tarefa",
    addIconA11y: "Ícone de adicionar",
    taskCompleted: "Tarefa marcada como concluída.",
    taskReopened: "Tarefa reaberta.",
    taskUpdateError: "Não foi possível atualizar a tarefa.",
    taskDeleted: "Tarefa excluída com sucesso.",
    taskDeleteError: "Não foi possível excluir a tarefa.",
    confirmDeleteTitle: "Confirmar exclusão",
    confirmDeleteMessage: "Tem certeza que deseja excluir esta tarefa?",
    confirmDeleteAction: "Excluir",
    confirmCompleteTitle: "Confirmar conclusão",
    confirmCompleteMessage:
      "Tem certeza que deseja marcar esta tarefa como concluída?",
    confirmCompleteAction: "Concluir",
  },
  taskDetails: {
    dueDateLabel: "Prazo",
    stepsLabel: "Etapas",
    completeButton: "Marcar tarefa como concluída",
    completeSuccess: "Parabéns! Você concluiu sua tarefa com sucesso.",
    completeError: "Não foi possível concluir a tarefa.",
    stepUpdateError: "Não foi possível atualizar a etapa.",
    congratsTitle: "Parabéns!",
    congratsBody1: "Você concluiu sua tarefa.",
    congratsBody2: "Ótimo trabalho!",
    completedTag: "Tarefa concluída!",
  },
  preferences: {
    loadError: "Não foi possível carregar as preferências.",
    saveError: "Não foi possível salvar as preferências. Tente novamente.",
    screenLabel: "Tela de preferências",
    title: "Personalização",
    titleA11y: "Título: Personalização",
    darkThemeLabel: "Tema Escuro",
    darkThemeSwitchA11y: "Alternar tema escuro",
    largeFontLabel: "Fonte Grande",
    largeFontSwitchA11y: "Alternar fonte grande",
    highContrastLabel: "Alto Contraste",
    highContrastSwitchA11y: "Alternar alto contraste",
    deleteConfirmationLabel: "Confirmação ao Excluir Tarefa",
    deleteConfirmationSwitchA11y: "Alternar confirmação ao excluir tarefa",
    completeConfirmationLabel: "Confirmação ao Concluir Tarefa",
    completeConfirmationSwitchA11y: "Alternar confirmação ao concluir tarefa",
  },
  taskCard: {
    cardLabelPrefix: "Cartão da tarefa",
    completedA11y: "Tarefa concluída",
    markCompletedA11y: "Marcar como concluída",
    titleLabelPrefix: "Título da tarefa",
    dueDatePrefix: "Vencimento",
    dueDateLabelPrefix: "Vencimento",
    deleteTaskA11yPrefix: "Excluir tarefa",
    deleteAction: "Excluir",
  },
  stepItem: {
    toggleLabelPrefix: "Marcar passo",
    asCompleted: "concluído",
    asNotCompleted: "não concluído",
    titleLabelPrefix: "Título do passo",
  },
  notifications: {
    closeA11y: "Fechar notificação",
    reminderTitle: "Lembrete de tarefa próxima!",
  },
  help: {
    screenLabel: "Tela de ajuda",
    titleA11yPrefix: "Título",
    title: "Ajuda e Dicas",
    intro: "Dúvidas sobre o app? Veja como usar:",
    guideTitle: "Como usar o SeniorEase",
    guideAddTask: "• Adicione tarefas com o botão Nova Tarefa.",
    guideCompleteTask: "• Complete tarefas marcando etapas ou finalizando.",
    guideFilterTask: "• Filtre tarefas para ver as mais importantes ou pendentes.",
    guidePreferences:
      "• Personalize o app nas preferências: fonte, contraste, espaçamento.",
    a11yTitle: "Recursos de acessibilidade",
    a11yFontContrast: "• Fonte grande e alto contraste: ative em Preferências.",
    a11yConfirmations:
      "• Confirmações extras: evite ações acidentais ao excluir ou concluir.",
    a11yWebKeyboard:
      "• Web: use Tab para navegar, Enter ou Espaço para acionar botões.",
    a11yMobileReader:
      "• Mobile: VoiceOver (iOS) e TalkBack (Android) leem labels e estados.",
    a11yAnnouncements:
      "• Notificações e mensagens de erro são anunciadas com prioridade de acessibilidade.",
    footer: "Qualquer dúvida, estamos aqui para ajudar!",
  },
} as const;

export type SupportedLocale = "pt-BR";

type DeepStringSchema<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringSchema<T[K]>;
};

export type AppStrings = DeepStringSchema<typeof ptBRStrings>;

const stringsByLocale: Record<SupportedLocale, AppStrings> = {
  "pt-BR": ptBRStrings,
};

export function normalizeLocale(locale?: string): SupportedLocale {
  if (locale?.toLowerCase().startsWith("pt")) {
    return "pt-BR";
  }

  return "pt-BR";
}

export function detectDeviceLocale(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale || "pt-BR";
  } catch {
    return "pt-BR";
  }
}

export function getStrings(locale?: string): AppStrings {
  const normalized = normalizeLocale(locale ?? detectDeviceLocale());
  return stringsByLocale[normalized] ?? ptBRStrings;
}

export const appStrings = getStrings();
