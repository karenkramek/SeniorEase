export const ptBRStrings = {
  common: {
    confirm: "Confirmar",
    cancel: "Cancelar",
    ok: "OK",
    close: "Fechar",
    closeMessage: "Fechar mensagem",
    notPossibleNow:
      "Não foi possível concluir a operação agora. Tente novamente.",
    appTitle: "SeniorEase",
    emailLabel: "E-mail",
    passwordLabel: "Senha",
    nameLabel: "Nome completo",
    showPasswordA11y: "Mostrar senha",
    hidePasswordA11y: "Ocultar senha",
    emailInvalidError: "Por favor, insira um e-mail válido.",
    passwordMinError: "A senha deve ter pelo menos 6 caracteres.",
    titleA11yPrefix: "Título",
    taskCompletedA11y: "Tarefa concluída",
    deleteAction: "Excluir",
    togglePasswordHint: "Alternar visibilidade da senha",
  },
  navigation: {
    mainNavigationA11y: "Navegação principal do aplicativo",
    tasksTabTitle: "Tarefas",
    tasksTabA11y: "Aba de tarefas",
    preferencesTabTitle: "Preferências",
    preferencesTabA11y: "Aba de preferências",
    helpTabTitle: "Ajuda",
    helpTabA11y: "Aba de ajuda e dicas",
    profileTabTitle: "Perfil",
    profileTabA11y: "Aba de perfil do usuário",
    modalHeaderTitle: "Modal",
    createTaskHeaderTitle: "Nova Tarefa",
    taskDetailsHeaderTitle: "Detalhes da Tarefa",
    menuOpenA11y: "Abrir menu",
    menuCloseA11y: "Fechar menu",
  },
  modalScreen: {
    title: "Este é um modal",
    titleA11y: "Título do modal",
    goHomeButton: "Ir para a tela inicial",
    goHomeButtonA11y: "Botão para ir para a tela inicial",
  },
  createTask: {
    screenLabel: "Nova tarefa",
    titleLabel: "Título da tarefa *",
    titleFieldLabel: "Título da tarefa",
    titleFieldA11yHint: "Digite o título da tarefa, este campo é obrigatório",
    titleRequiredHint: "Campo obrigatório",
    descriptionLabel: "Descrição da tarefa (opcional)",
    descriptionPlaceholder: "Descrição (opcional)",
    descriptionFieldA11yLabel: "Descrição da tarefa",
    descriptionFieldA11yHint: "Digite detalhes opcionais sobre a tarefa",
    createButton: "Criar Tarefa",
    createButtonA11y: "Botão para criar tarefa",
    titleRequiredError: "Informe um título para criar a tarefa.",
    createSuccess: "Tarefa criada com sucesso.",
    createError: "Não foi possível criar a tarefa.",
    createErrorDetail:
      "Não foi possível criar a tarefa agora. Tente novamente.",
    dueDateLabel: "Data de Vencimento (opcional)",
    dueDateA11yLabel: "Data de vencimento da tarefa",
    dueDateA11yHintSelected: "Data selecionada",
    dueDateA11yHintNone: "nenhuma",
    dueDateA11yHintAction: "Toque para abrir o seletor de data",
    dueDatePlaceholder: "Selecione uma data",
    dueDateInvalidError: "Data de vencimento inválida",
  },
  editTask: {
    screenLabel: "Editar tarefa",
    titleLabel: "Título da tarefa *",
    titleFieldLabel: "Título da tarefa",
    titleFieldA11yHint: "Digite o título da tarefa, este campo é obrigatório",
    descriptionLabel: "Descrição da tarefa (opcional)",
    descriptionPlaceholder: "Descrição (opcional)",
    descriptionFieldA11yLabel: "Descrição da tarefa",
    descriptionFieldA11yHint: "Digite detalhes opcionais sobre a tarefa",
    editButton: "Salvar Alterações",
    editButtonA11y: "Botão para salvar alterações da tarefa",
    titleRequiredError: "Informe um título para salvar a tarefa.",
    editSuccess: "Tarefa atualizada com sucesso.",
    editError: "Não foi possível atualizar a tarefa.",
    editErrorDetail:
      "Não foi possível atualizar a tarefa agora. Tente novamente.",
    dueDateLabel: "Data de Vencimento (opcional)",
    dueDateA11yLabel: "Data de vencimento da tarefa",
    dueDateA11yHintSelected: "Data selecionada",
    dueDateA11yHintNone: "nenhuma",
    dueDateA11yHintAction: "Toque para abrir o seletor de data",
    dueDatePlaceholder: "Selecione uma data",
    dueDateInvalidError: "Data de vencimento inválida",
    completedTaskError: "Não é possível editar uma tarefa concluída.",
  },
  taskList: {
    filterByLabel: "Filtrar por",
    filtersA11y: "Filtros de tarefas",
    allFilterLabel: "Todas",
    pendingFilterLabel: "Pendentes",
    completedFilterLabel: "Concluídas",
    upcomingFilterLabel: "Próximas",
    listLabel: "Lista de tarefas",
    noTasks: "Nenhuma tarefa encontrada.",
    noTasksHint: "Crie uma nova tarefa para começar!",
    noTasksHintA11y: "Crie uma nova tarefa para começar",
    newTaskButtonA11y: "Botão para criar nova tarefa",
    addIconA11y: "Ícone de adicionar",
    taskCompleted: "Tarefa concluída!",
    taskReopened: "Tarefa reaberta.",
    taskUpdateError: "Não foi possível atualizar a tarefa.",
    taskDeleted: "Tarefa excluída com sucesso.",
    taskDeleteError: "Não foi possível excluir a tarefa.",
    confirmDeleteTitle: "Confirmar exclusão",
    confirmDeleteMessage: "Tem certeza que deseja excluir esta tarefa?",
    confirmCompleteTitle: "Confirmar conclusão",
    confirmCompleteMessage: "Deseja concluír esta tarefa?",
    confirmCompleteAction: "Concluir",
  },
  taskDetails: {
    dueDateLabel: "Prazo",
    notFound: "Tarefa não encontrada.",
    stepsLabel: "Etapas",
    completeButton: "Concluír Tarefa",
    completeButtonA11y: "Botão para concluír tarefa",
    editButton: "Editar Tarefa",
    editButtonA11y: "Botão para editar tarefa",
    completeError: "Não foi possível concluir a tarefa.",
    stepUpdateError: "Não foi possível atualizar a etapa.",
    completedTag: "Tarefa concluída!",
    descriptionLabel: "Descrição",
  },
  profile: {
    userLabel: "Usuário",
    nameA11yPrefix: "Nome",
    userIconA11y: "Ícone do usuário",
    logoutButton: "Sair",
    logoutButtonA11y: "Botão para sair da conta",
    logoutIconA11y: "Ícone de sair",
  },
  authLogin: {
    formTitle: "Entrar na conta",
    emailFieldHint: "Digite seu e-mail cadastrado para fazer login",
    passwordFieldHint: "Digite sua senha com no mínimo 6 caracteres",
    submitButton: "Entrar",
    registerLink: "Não tem uma conta? Cadastre-se",
    loginErrorTitle: "Erro no Login",
  },
  authRegister: {
    formTitle: "Crie sua conta",
    nameFieldHint: "Digite seu nome completo com no mínimo 3 caracteres",
    emailFieldHint: "Digite um e-mail válido para criar sua conta",
    passwordFieldHint: "Digite uma senha com no mínimo 6 caracteres",
    confirmPasswordPlaceholder: "Confirme a senha",
    confirmPasswordFieldLabel: "Confirmar senha",
    confirmPasswordFieldHint: "Digite a mesma senha novamente para confirmar",
    toggleConfirmPasswordHint: "Alternar visibilidade da confirmação de senha",
    submitButton: "Cadastrar",
    loginLink: "Já tem uma conta? Faça login",
    successTitle: "Cadastro Realizado!",
    successBody:
      "Sua conta foi criada com sucesso. Você será redirecionado para o login.",
    registerErrorTitle: "Erro no Cadastro",
    nameMinError: "O nome deve ter pelo menos 3 caracteres.",
    confirmPasswordRequiredError: "A confirmação de senha é necessária.",
    passwordMismatchError: "As senhas não coincidem.",
  },
  datePicker: {
    title: "Selecionar data",
    dayLabel: "Dia",
    selectDayA11y: "Selecionar dia",
    monthLabel: "Mês",
    selectMonthA11y: "Selecionar mês",
    yearLabel: "Ano",
    selectYearA11y: "Selecionar ano",
    cancelA11y: "Cancelar seleção de data",
    confirmA11y: "Confirmar data selecionada",
  },
  preferences: {
    loadError: "Não foi possível carregar as preferências.",
    saveError: "Não foi possível salvar as preferências. Tente novamente.",
    screenLabel: "Tela de preferências",
    title: "Personalização",
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
    viewDetailsA11yPrefix: "Ver detalhes da tarefa",
    markCompletedA11y: "Marcar como concluída",
    titleLabelPrefix: "Título da tarefa",
    dueDatePrefix: "Vencimento",
    deleteTaskA11yPrefix: "Excluir tarefa",
  },
  taskStatus: {
    pendingLabel: "Pendente",
    completedLabel: "Concluída",
    pendingDescription: "Tarefas que ainda não foram iniciadas",
    completedDescription: "Tarefas que já foram finalizadas",
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
    title: "Ajuda e Dicas",
    intro: "Dúvidas sobre o app? Veja como usar:",
    guideTitle: "Como usar o SeniorEase",
    guideAddTask: "• Adicione tarefas com o botão Nova Tarefa.",
    guideCompleteTask: "• Complete tarefas.",
    guideFilterTask:
      "• Filtre tarefas para ver as mais importantes ou pendentes.",
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
