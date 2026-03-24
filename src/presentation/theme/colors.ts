export const Colors = {
  // Tema Claro — otimizado para conforto visual
  light: {
    text: "#1F2933", // Quase preto, menos agressivo que #000
    background: "#F5F7FA", // Branco com leve tom azulado (menos brilho)
    tint: "#1F4E79", // Azul navy suavizado (principal do app)
    icon: "#1F4E79", // Ícones no azul principal
    tabIconDefault: "#9AA5B1", // Cinza neutro e suave
    tabIconSelected: "#1F4E79", // Azul ativo
    success: "#2F7D32", // Verde escuro acessível
    error: "#C53030", // Vermelho forte porém confortável
    warning: "#E67E22", // Laranja (idosos distinguem melhor que amarelo)
    buttonText: "#FFFFFF", // Texto branco para botões
    switchTrackOff: "#9AA5B1", // Trilha inativa visível no fundo claro
    switchTrackOn: "#1F4E79", // Trilha ativa com contraste adequado
    switchThumbOff: "#FFFFFF", // Thumb off claro
    switchThumbOn: "#FFFFFF", // Thumb on claro
  },

  // Tema Escuro — confortável em baixa luz
  dark: {
    text: "#E4E7EB", // Branco acinzentado
    background: "#121417", // Preto suave
    tint: "#6FA8DC", // Azul claro para contraste
    icon: "#6FA8DC",
    tabIconDefault: "#7B8794",
    tabIconSelected: "#6FA8DC",
    success: "#66BB6A",
    error: "#E57373",
    warning: "#FFB74D",
    buttonText: "#121417", // Texto preto para botões
    switchTrackOff: "#5F6C7B", // Trilha inativa acima do fundo escuro
    switchTrackOn: "#8CC8FF", // Trilha ativa mais luminosa
    switchThumbOff: "#E4E7EB", // Thumb off claro para fundo escuro
    switchThumbOn: "#0F1720", // Thumb on escuro para contraste com trilha ativa
  },

  // Alto contraste — acessibilidade máxima
  highContrast: {
    text: "#FFFFFF",
    background: "#000000",
    tint: "#FFD400", // Amarelo forte para ações
    icon: "#FFFFFF",
    tabIconDefault: "#FFFFFF",
    tabIconSelected: "#FFD400",
    success: "#00FF00",
    error: "#FF0000",
    warning: "#FFD400",
    buttonText: "#000000", // Texto preto para botões
    switchTrackOff: "#666666", // Inativo em cinza para evitar ambiguidade com fundo
    switchTrackOn: "#FFD400", // Ativo em amarelo de alto contraste
    switchThumbOff: "#FFFFFF", // Thumb off branco para contraste com trilha cinza
    switchThumbOn: "#000000", // Thumb on preto para contraste máximo com trilha amarela
  },
};
