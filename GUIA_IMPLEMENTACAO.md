# 🔧 GUIA DE IMPLEMENTAÇÃO - Exemplos de Código

## 1. Consolidação de Task Forms

### Passo 1: Verificar TaskForm.tsx Existente

O arquivo `src/presentation/components/TaskForm.tsx` já implementa o padrão correto:

```typescript
interface TaskFormProps {
  task?: Task; // undefined = modo criar, Task = modo editar
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
  showScrollView?: boolean;
}

export function TaskForm({ task, onSuccess, onCancel, ... }: TaskFormProps) {
  const isEditMode = !!task;
  // ... resto do código
}
```

### Passo 2: Remover Componentes Duplicados

**Arquivos a REMOVER:**
- ✂️ `src/presentation/components/CreateTaskForm.tsx`
- ✂️ `src/presentation/components/EditTaskForm.tsx`

### Passo 3: Atualizar Imports

**Em `app/(app)/create-task.tsx`:**
```typescript
// ❌ Antes
import { CreateTaskForm } from "@/presentation/components/CreateTaskForm";

// ✅ Depois
import { TaskForm } from "@/presentation/components/TaskForm";

// E mudar uso:
- <CreateTaskForm onSuccess={...} />
+ <TaskForm onSuccess={...} />
```

**Em `app/(app)/task-details.tsx`:**
```typescript
// ✅ Manter como está (vai usar TaskFormModal novo)
```

---

## 2. Consolidação de Task Modals

### Passo 1: Criar TaskFormModal.tsx NOVO

```typescript
import { Task } from "@/domain/entities/Task";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { BaseModal } from "@/presentation/components/BaseModal";
import { TaskForm } from "@/presentation/components/TaskForm";
import { useAppStrings } from "@/presentation/hooks/useAppStrings";
import React from "react";
import { TouchableOpacity } from "react-native";

interface TaskFormModalProps {
  visible: boolean;
  task?: Task; // undefined = criar, Task = editar
  onClose: () => void;
  onSuccess?: () => void;
  restoreFocusRef?: React.RefObject<React.ElementRef<typeof TouchableOpacity> | null>;
}

export function TaskFormModal({
  visible,
  task,
  onClose,
  onSuccess,
  restoreFocusRef,
}: TaskFormModalProps) {
  const appTexts = useAppStrings();
  const strings = task ? appTexts.editTask : appTexts.createTask;

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      restoreFocusRef={restoreFocusRef}
      maxWidth={600}
      header={
        <AccessibleText 
          type="h2" 
          accessibilityLabel={strings.screenLabel}
        >
          {strings.screenLabel}
        </AccessibleText>
      }
    >
      <TaskForm
        task={task}
        onSuccess={handleSuccess}
        onCancel={onClose}
        isModal={true}
      />
    </BaseModal>
  );
}
```

### Passo 2: Remover Componentes Duplicados

**Arquivos a REMOVER:**
- ✂️ `src/presentation/components/CreateTaskModal.tsx`
- ✂️ `src/presentation/components/EditTaskModal.tsx`

### Passo 3: Atualizar Imports

**Em `app/(app)/(tabs)/tasks.tsx`:**
```typescript
// ❌ Antes
import { CreateTaskModal } from "@/presentation/components/CreateTaskModal";

// ✅ Depois
import { TaskFormModal } from "@/presentation/components/ui/modals/TaskFormModal";

// Uso:
- <CreateTaskModal visible={isCreateModalOpen} onClose={...} />
+ <TaskFormModal visible={isCreateModalOpen} onClose={...} />
```

**Em `src/presentation/components/TaskDetailsModal.tsx`:**
```typescript
// ❌ Antes
import { EditTaskModal } from "@/presentation/components/EditTaskModal";
// ...
<EditTaskModal visible={isEditModalOpen} task={task} onClose={...} />

// ✅ Depois
import { TaskFormModal } from "@/presentation/components/ui/modals/TaskFormModal";
// ...
<TaskFormModal visible={isEditModalOpen} task={task} onClose={...} />
```

---

## 3. Consolidação de Auth Guards

### Passo 1: Remover AuthGuard

**Arquivo a REMOVER:**
- ✂️ `src/presentation/components/auth/AuthGuard.tsx`

### Passo 2: Usar PrivateRoute em todo projeto

**Verificar se PrivateRoute está sendo usado:**
```bash
grep -r "PrivateRoute\|AuthGuard" app/ src/ --include="*.tsx"
```

**Substituir todas as importações:**
```typescript
// ❌ Antes
import { AuthGuard } from "@/presentation/components/auth/AuthGuard";

// ✅ Depois
import { PrivateRoute } from "@/presentation/components/auth/PrivateRoute";
```

---

## 4. Consolidação de Drawers

### Passo 1: Criar AnimatedDrawer.tsx NOVO

```typescript
import { useTheme } from "@/presentation/hooks/useTheme";
import { getColorWithOpacity } from "@/presentation/theme/colors";
import { Spacing } from "@/presentation/theme/spacing";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DrawerDirection = 'left' | 'top';

interface AnimatedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  direction?: DrawerDirection;
  distance?: number; // px to slide
  topOffset?: number; // for 'top' direction
}

export function AnimatedDrawer({
  isOpen,
  onClose,
  children,
  direction = 'left',
  distance = 264,
  topOffset = 0,
}: AnimatedDrawerProps) {
  const { themeColors } = useTheme();
  const insets = useSafeAreaInsets();
  const animationRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animationRef, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen, animationRef]);

  const transform = direction === 'left' 
    ? { translateX: animationRef.interpolate({
        inputRange: [0, 1],
        outputRange: [-distance, 0],
      })}
    : { translateY: animationRef.interpolate({
        inputRange: [0, 1],
        outputRange: [-distance, 0],
      })};

  const overlayOpacity = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const positionStyles = direction === 'left' 
    ? { left: 0, top: insets.top, bottom: 0, width: distance }
    : { left: 0, right: 0, top: topOffset, height: distance };

  return (
    <>
      {isOpen && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: getColorWithOpacity(themeColors.text, 0.5),
              zIndex: 40,
              opacity: overlayOpacity,
            },
          ]}
          pointerEvents={isOpen ? "auto" : "none"}
        >
          <Pressable
            onPress={onClose}
            style={{ flex: 1 }}
            testID="drawer-overlay"
          />
        </Animated.View>
      )}

      {isOpen && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              zIndex: 50,
              pointerEvents: "auto",
            },
          ]}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                backgroundColor: themeColors.background,
                transform: [transform],
                zIndex: 50,
                ...positionStyles,
              },
              direction === 'top' && {
                borderBottomWidth: 1,
                borderBottomColor: getColorWithOpacity(themeColors.icon, 0.35),
                paddingHorizontal: Spacing.large,
                paddingVertical: Spacing.large,
              },
            ]}
            pointerEvents="auto"
          >
            {children}
          </Animated.View>
        </Animated.View>
      )}
    </>
  );
}
```

### Passo 2: Remover componentes duplicados

**Arquivos a adaptar/remover:**
- ✂️ `src/presentation/components/HomeMenuDrawer.tsx` (remover)
- ✂️ `src/presentation/components/MobileMenuDrawer.tsx` (remover)
- ✅ Manter referências nos imports mas usar AnimatedDrawer

### Passo 3: Atualizar Imports

```typescript
// ❌ Antes
import { MobileMenuDrawer } from "@/presentation/components/MobileMenuDrawer";

// ✅ Depois
import { AnimatedDrawer } from "@/presentation/components/ui/drawers/AnimatedDrawer";

// Uso:
- <MobileMenuDrawer isOpen={menuOpen} onClose={closeMenu}>
+ <AnimatedDrawer isOpen={menuOpen} onClose={closeMenu} direction="left">
    {/* menu content */}
  </AnimatedDrawer>
```

---

## 5. Criar Hook useFormState

### Arquivo NOVO: src/presentation/hooks/useFormState.ts

```typescript
import { useState } from 'react';

interface FieldConfig {
  required?: boolean;
  validator?: (value: string) => string | null;
  transform?: (value: string) => string;
}

interface FormConfig {
  [fieldName: string]: FieldConfig;
}

export function useFormState<T extends Record<string, any>>(
  initialValues: T,
  config?: FormConfig
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string | null>>({} as any);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as any);

  const validate = (): boolean => {
    const newErrors: Record<string, string | null> = {};
    
    Object.entries(values).forEach(([key, value]) => {
      const fieldConfig = config?.[key];
      
      if (fieldConfig?.required && !String(value).trim()) {
        newErrors[key] = `${key} é obrigatório`;
      } else if (fieldConfig?.validator) {
        newErrors[key] = fieldConfig.validator(value);
      } else {
        newErrors[key] = null;
      }
    });

    setErrors(newErrors as any);
    return Object.values(newErrors).every(e => e === null);
  };

  const handleChange = (field: keyof T, value: any) => {
    const fieldConfig = config?.[field as string];
    const transformedValue = fieldConfig?.transform 
      ? fieldConfig.transform(value)
      : value;

    setValues(prev => ({ ...prev, [field]: transformedValue }));
    
    if (touched[field]) {
      // Re-validate on change if field was touched
      const fieldConfig = config?.[field as string];
      if (fieldConfig?.validator) {
        setErrors(prev => ({
          ...prev,
          [field]: fieldConfig.validator!(transformedValue)
        }));
      }
    }
  };

  const handleBlur = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const fieldConfig = config?.[field as string];
    if (fieldConfig?.validator) {
      setErrors(prev => ({
        ...prev,
        [field]: fieldConfig.validator!(values[field])
      }));
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({} as any);
    setTouched({} as any);
  };

  return {
    values,
    errors,
    touched,
    validate,
    handleChange,
    handleBlur,
    reset,
    setValues,
    setErrors,
  };
}
```

### Uso em TaskForm:

```typescript
// ❌ Antes
const [title, setTitle] = useState("");
const [titleError, setTitleError] = useState<string | null>(null);
const [description, setDescription] = useState("");
// ... mais estados

// ✅ Depois
const { values, errors, handleChange, validate } = useFormState(
  { title: "", description: "", dueDate: "" },
  {
    title: { required: true },
    description: {},
    dueDate: {}
  }
);

// Uso:
<TextInput
  value={values.title}
  onChangeText={(text) => handleChange('title', text)}
  error={errors.title}
/>
```

---

## 6. Structure de Pastas - Script de Migração

### Shell Script: migrate-folders.sh

```bash
#!/bin/bash

SRC="$PWD/src/presentation/components"

# STEP 1: Criar diretórios
mkdir -p "$SRC/common"
mkdir -p "$SRC/ui/modals"
mkdir -p "$SRC/ui/drawers"
mkdir -p "$SRC/ui/badges"
mkdir -p "$SRC/ui/other"
mkdir -p "$SRC/task"
mkdir -p "$SRC/forms"
mkdir -p "$SRC/navigation"
mkdir -p "$SRC/pages"

# STEP 2: Mover componentes comuns
mv "$SRC/AccessibleButton.tsx" "$SRC/common/"
mv "$SRC/AccessibleText.tsx" "$SRC/common/"
mv "$SRC/ThemedView.tsx" "$SRC/common/"
mv "$SRC/ThemedText.tsx" "$SRC/common/"
mv "$SRC/ExternalLink.tsx" "$SRC/common/"
mv "$SRC/ErrorBoundaryFallback.tsx" "$SRC/common/"

# STEP 3: Mover modals
mv "$SRC/BaseModal.tsx" "$SRC/ui/modals/"
mv "$SRC/ConfirmModal.tsx" "$SRC/ui/modals/"
mv "$SRC/DatePickerModal.tsx" "$SRC/ui/modals/"
mv "$SRC/TaskDetailsModal.tsx" "$SRC/ui/modals/"
# TaskFormModal.tsx será criado novo lá

# STEP 4: Mover drawers
mv "$SRC/MobileMenuDrawer.tsx" "$SRC/ui/drawers/"
mv "$SRC/HomeMenuDrawer.tsx" "$SRC/ui/drawers/"
# AnimatedDrawer.tsx será criado novo lá

# STEP 5: Mover badges
mv "$SRC/DueDateBadge.tsx" "$SRC/ui/badges/"
mv "$SRC/ui/IconSymbol.tsx" "$SRC/ui/badges/" 2>/dev/null || true

# STEP 6: Mover outros UI
mv "$SRC/HapticTab.tsx" "$SRC/ui/other/"
mv "$SRC/ParallaxScrollView.tsx" "$SRC/ui/other/"
mv "$SRC/GlobalNotification.tsx" "$SRC/ui/other/"

# STEP 7: Mover task components
mv "$SRC/TaskCard.tsx" "$SRC/task/"
mv "$SRC/TaskForm.tsx" "$SRC/task/"
mv "$SRC/StepItem.tsx" "$SRC/task/"

# STEP 8: Mover forms
mv "$SRC/AccessibleFormField" "$SRC/forms/"

# STEP 9: Mover navigation
mv "$SRC/HamburgerMenuButton.tsx" "$SRC/navigation/"
mv "$SRC/NavigationMenu.tsx" "$SRC/navigation/"
mv "$SRC/AppHeader.tsx" "$SRC/navigation/"
mv "$SRC/HomeHeader.tsx" "$SRC/navigation/"
mv "$SRC/WebSidebar.tsx" "$SRC/navigation/"

# STEP 10: Mover pages
mv "$SRC/AboutPage.tsx" "$SRC/pages/"
mv "$SRC/HomePage.tsx" "$SRC/pages/"
mv "$SRC/HomeFooter.tsx" "$SRC/pages/"

echo "✅ Pasta estrutura migrada com sucesso!"
```

### Executar:
```bash
chmod +x migrate-folders.sh
./migrate-folders.sh
```

---

## 7. Atualizar Imports - Script Python

### arquivo: update-imports.py

```python
#!/usr/bin/env python3

import os
import re
import sys

# Mapeamento de imports antigos para novos
IMPORT_MAP = {
    # Common
    r"from ['\"]@/presentation/components/AccessibleButton['\"]": 
        "from '@/presentation/components/common/AccessibleButton'",
    r"from ['\"]@/presentation/components/AccessibleText['\"]": 
        "from '@/presentation/components/common/AccessibleText'",
    
    # Modals
    r"from ['\"]@/presentation/components/BaseModal['\"]": 
        "from '@/presentation/components/ui/modals/BaseModal'",
    r"from ['\"]@/presentation/components/ConfirmModal['\"]": 
        "from '@/presentation/components/ui/modals/ConfirmModal'",
    r"from ['\"]@/presentation/components/DatePickerModal['\"]": 
        "from '@/presentation/components/ui/modals/DatePickerModal'",
    r"from ['\"]@/presentation/components/CreateTaskModal['\"]": 
        "from '@/presentation/components/ui/modals/TaskFormModal'",
    r"from ['\"]@/presentation/components/EditTaskModal['\"]": 
        "from '@/presentation/components/ui/modals/TaskFormModal'",
    r"from ['\"]@/presentation/components/TaskDetailsModal['\"]": 
        "from '@/presentation/components/ui/modals/TaskDetailsModal'",
    
    # Drawers
    r"from ['\"]@/presentation/components/MobileMenuDrawer['\"]": 
        "from '@/presentation/components/ui/drawers/AnimatedDrawer'",
    r"from ['\"]@/presentation/components/HomeMenuDrawer['\"]": 
        "from '@/presentation/components/ui/drawers/AnimatedDrawer'",
}

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    for old_import, new_import in IMPORT_MAP.items():
        content = re.sub(old_import, new_import, content)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Updated: {filepath}")
        return True
    return False

def main():
    updated_count = 0
    
    for root, dirs, files in os.walk('.'):
        # Skip node_modules e outras pastas
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.expo', 'dist']]
        
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                if update_file(filepath):
                    updated_count += 1
    
    print(f"\n📊 Total files updated: {updated_count}")

if __name__ == '__main__':
    main()
```

### Executar:
```bash
python3 update-imports.py
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após implementar as mudanças:

```bash
# 1. Lint
npm run lint

# 2. Testes
npm run test

# 3. Teste de acessibilidade
npm run test:a11y

# 4. Verificar se não há imports quebrados
grep -r "CreateTaskForm\|EditTaskForm\|CreateTaskModal\|EditTaskModal\|AuthGuard\|HomeMenuDrawer" src/ app/ 2>/dev/null

# 5. Build web
npm run build:web

# 6. Testar em desenvolvimento
npm run web
# npm run android
# npm run ios
```

---

## 📝 NOTAS IMPORTANTES

1. **Manter histórico git**: Use `git branch refactor/consolidate-components`
2. **Testar incrementalmente**: Faça cada consolidação e teste antes de prosseguir
3. **Comunicar changes**: Avise a equipe sobre as mudanças estruturais
4. **DocumentoDER**: Atualize README se houver guias de componentes
5. **Revalidate**: Execute todos os testes após mudanças

---
