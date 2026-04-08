/**
 * Acessibilidade (a11y) - Tokens WCAG 2.2 AA
 *
 * Define padrões visuais e semânticos para conformidade com WCAG 2.2 AA:
 * - Focus indicators: outline visível (2.4.7 Focus Visible)
 * - Error states: cor + ícone/texto (1.4.1 Use of Color)
 * - Touch targets: mínimo 44x44 CSS px (2.5.5 Target Size)
 */

export const A11yTokens = {
  // Focus indicator - visível em todas as interações (2.4.7 Focus Visible)
  focus: {
    outlineWidth: 3,
    outlineColor: '#FFFFFF', // Navy azul (alto contraste)
    outlineStyle: 'solid' as const,
  },

  // Estado de erro - requer ícone/texto além de cor (1.4.1 Use of Color)
  error: {
    color: '#C53030', // Vermelho WCAG AA
    icon: 'error-outline', // Material icon
  },

  // Estado de sucesso
  success: {
    color: '#2F7D32', // Verde WCAG AA
    icon: 'check-circle', // Material icon
  },

  // Estado de aviso
  warning: {
    color: '#E67E22', // Laranja WCAG AA
    icon: 'warning', // Material icon
  },

  // Alvo de interação mínimo (2.5.5 Target Size)
  touchTarget: {
    minWidth: 44,
    minHeight: 44,
    minPadding: 8, // 44 = conteúdo + padding
  },

  // ARIA atributos para semântica
  aria: {
    invalid: 'true',
    describedby: 'error-message',
    label: 'screen-reader-label',
    live: 'polite' as const,
  },
};

/**
 * Utilitários para aplicar tokens de a11y em componentes
 */
export const getA11yFocusStyle = () => ({
  outlineWidth: A11yTokens.focus.outlineWidth,
  outlineColor: A11yTokens.focus.outlineColor,
});

export const getA11yTouchTargetStyle = (content?: { width: number; height: number }) => {
  if (!content) {
    return {
      minWidth: A11yTokens.touchTarget.minWidth,
      minHeight: A11yTokens.touchTarget.minHeight,
    };
  }

  // Se o conteúdo já atinge 44x44, apenas retorna
  if (content.width >= 44 && content.height >= 44) {
    return {};
  }

  // Senão, adiciona padding para atingir mínimo
  return {
    minWidth: Math.max(content.width + A11yTokens.touchTarget.minPadding * 2, 44),
    minHeight: Math.max(content.height + A11yTokens.touchTarget.minPadding * 2, 44),
  };
};
