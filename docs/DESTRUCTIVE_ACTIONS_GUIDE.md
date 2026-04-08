# Guia de Cores e Acessibilidade para Ações Destrutivas

## 📋 Paleta de Cores de Erro (Delete/Destrutivo)

Este projeto utiliza cores de erro harmônicas com a identidade visual (verde teal) e otimizadas para usuários idosos.

### Cores por Tema

| Tema                         | Cor            | Hex       | Propósito                                   |
| ---------------------------- | -------------- | --------- | ------------------------------------------- |
| **Modo Claro (Native/Web)**  | Vermelho Terra | `#C73D1D` | Ícones de delete, textos de ação destrutiva |
| **Modo Escuro (Native/Web)** | Coral/Salmão   | `#FF7F5C` | Ícones de delete, textos de ação destrutiva |
| **Alto Contraste**           | Vermelho Puro  | `#FF0000` | Máximo contraste para acessibilidade        |

### Características das Cores

✅ **Harmonia Visual**

- Combinam bem com a paleta verde-teal do projeto (#0F766E)
- Tons quentes e naturais para não parecer agressivos
- Adequados para interface voltada a idosos

✅ **Acessibilidade**

- Razão de contraste WCAG AA/AAA atendida em todos os temas
- Adaptação automática para modo alto contraste
- Distinguível para daltônicos (não confia apenas em cor)

✅ **Legibilidade**

- Cores suficientemente saturadas para clareza visual
- Não causam fadiga em leitura prolongada
- Diferenciam-se bem do background

## 🎨 Como Usar Componentes de Ação Destrutiva

### 1. **DestructiveButton** (Recomendado)

Para ações de delete/remover em isolamento:

```tsx
import { DestructiveButton } from "@/presentation/components/DestructiveButton";

<DestructiveButton
   title="Excluir"
   onPress={handleDelete}
   accessibilityLabel="Excluir tarefa"
   accessibilityHint="Ação irreversível. Confirme antes de prosseguir."
/>;
```

### 2. **AccessibleButton** com Variante `destructive`

Para maior controle de estilo:

```tsx
import { AccessibleButton } from "@/presentation/components/AccessibleButton";

<AccessibleButton
   title="Remover"
   variant="destructive"
   onPress={handleDelete}
   accessibilityLabel="Remover item"
/>;
```

### 3. **ConfirmModal** com `isDestructive`

Para confirmações de delete com modal:

```tsx
<ConfirmModal
   visible={showDeleteConfirm}
   title="Excluir Tarefa?"
   message="Esta ação não pode ser desfeita."
   confirmText="Excluir"
   cancelText="Cancelar"
   isDestructive={true}
   onConfirm={handleConfirmDelete}
   onCancel={handleCancelDelete}
/>
```

## ♿ Padrões de Acessibilidade

### Para Usuários Idosos

1. **Alvo de Toque Mínimo**: 44x44px (ou `sharedStyles.touchTargetMin`)
2. **Tamanho de Fonte**: Mínimo 16px para ação destrutiva
3. **Espaçamento**: Gap mínimo de 12px entre botões
4. **Feedback Háptico**: Botões usam `Haptics.ImpactAsync` automático
5. **Labels Claros**: Sempre incluir `accessibilityLabel` e `accessibilityHint`

### Labels de Acessibilidade

```tsx
// ❌ Ruim - não descreve a ação
accessibilityLabel = "Botão";

// ✅ Bom - claro e específico
accessibilityLabel = "Excluir tarefa";
accessibilityHint = "Ação irreversível. Confirme antes de prosseguir.";
```

### Contraste de Cores

Todas as cores de erro atendem ou excedem:

- **WCAG AA**: Razão de contraste ≥ 4.5:1 para texto
- **WCAG AAA**: Razão de contraste ≥ 7:1 para texto (em modo alto contraste)

## 🎯 Checklist de Implementação

Ao adicionar um novo botão de delete, verifique:

- [ ] Cor usa `themeColors.error` (automático com variantes)
- [ ] Alvo de toque é ≥ 44x44px
- [ ] `accessibilityLabel` descritivo
- [ ] `accessibilityHint` explica que é irreversível (se aplicável)
- [ ] Confirmação modal (se ação crítica)
- [ ] Feedback háptico presente
- [ ] Testado em modo alto contraste
- [ ] Testado em modo claro e escuro
- [ ] Testado em mobile (< 640px), tablet e web

## 🧪 Testando as Cores

### No VS Code

1. Abra `src/presentation/theme/colors.ts`
2. Verifique as cores em `nativeLight`, `nativeDark` e `Colors.highContrast`
3. Use ferramentas como Contrast Ratio Checker para validar

### No Dispositivo/Browser

1. Ative modo escuro do SO
2. Ative modo alto contraste (nas preferências de acessibilidade)
3. Verifique legibilidade dos ícones e textos
4. Teste com diferentes combinações de temas

## 📚 Referências Externas

- [WCAG 2.1 Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project - Color](https://www.a11yproject.com/checklist/#ensure-text-has-sufficient-color-contrast)
