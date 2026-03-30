# Tailwind CSS para Web

## Status

✅ **Implementação Completa**

Este projeto agora utiliza **Tailwind CSS apenas na versão web**, mantendo React Native com inline styles no app mobile.

## Arquitetura

### 🌐 Web (`localhost:8085`)

- ✅ Tailwind CSS via `globals.css`
- ✅ PostCSS com autoprefixer
- ✅ Tokens de cores, spacing e tipografia customizados
- ✅ Compatível com todos os componentes

### 📱 App Mobile

- ✅ React Native com inline styles (sem mudanças)
- ✅ Sistema de temas centralizado em TypeScript
- ✅ Dynamic theme colors (light/dark/highContrast)

## Configuração

### Arquivos Principais

1. **`tailwind.config.js`**
   - Definição de tokens customizados
   - Configuração de cores do SeniorEase
   - Content paths para geração de CSS

2. **`postcss.config.js`**
   - Processamento de CSS com Tailwind
   - Autoprefixer para compatibilidade

3. **`src/presentation/theme/globals.css`**
   - Imports @tailwind (base, components, utilities)
   - Camadas de estilos
   - Estilos globais para web

4. **`app/+html.tsx`**
   - Importação de globals.css
   - Documento HTML raiz da web

### Dependências Instaladas

```json
{
   "devDependencies": {
      "tailwindcss": "^3.x",
      "autoprefixer": "^10.x"
   }
}
```

## Como Usar Tailwind na Web

### Classes Tailwind Comuns

```jsx
// Layout e Flexbox
<div className="flex flex-row items-center justify-between gap-4">

// Spacing
<div className="p-4 m-2 gap-md">

// Typography
<h1 className="text-2xl font-bold text-text">Título</h1>

// Colors
<div className="bg-primary text-white">

// Border e Radius
<div className="rounded-lg border border-border">

// Sizing
<div className="w-full h-16 flex-1">
```

### Exemplo Completo (Web Component)

```jsx
// ✅ Para Web - Usar Tailwind
function TaskCard() {
   return (
      <div className="flex flex-col sm:flex-row items-center justify-between rounded-lg border p-4 mb-4 bg-surface gap-4">
         <input type="checkbox" className="w-6 h-6" />
         <span className="text-lg font-bold text-text flex-1">
            Título da Tarefa
         </span>
         <button className="px-4 py-2 bg-error text-white rounded-lg font-bold">
            Excluir
         </button>
      </div>
   );
}
```

### Mantendo Compatibilidade com App Mobile

```jsx
// ❌ EVITE - Usar styles inline sem React Native
<div style={{ flex: 1, padding: 16 }}>

// ✅ USE Tailwind
<div className="flex-1 p-4">
```

## Tokens do Tailwind

### 🎨 Cores

| Nome           | Valor   | Uso                      |
| -------------- | ------- | ------------------------ |
| primary        | #2ecc71 | Botões principais, ações |
| secondary      | #3498db | Botões secundários       |
| accent         | #2ecc71 | Destaques                |
| error          | #e74c3c | Ações destrutivas, erros |
| success        | #27ae60 | Confirmações, sucesso    |
| warning        | #f39c12 | Avisos, cuidado          |
| info           | #3498db | Informações              |
| background     | #f1f5f9 | Fundo da página          |
| surface        | #ffffff | Fundos de componentes    |
| text           | #1a1a1a | Texto principal          |
| text-secondary | #666666 | Texto secundário         |
| border         | #e0e0e0 | Bordas                   |
| muted          | #999999 | Texto desativado         |

### 📏 Spacing

```
xs: 4px
sm: 8px      (p-sm, m-sm)
md: 16px     (p-md, m-md)
lg: 24px     (p-lg, m-lg)
xl: 32px     (p-xl, m-xl)
2xl: 48px    (p-2xl, m-2xl)
3xl: 64px    (p-3xl, m-3xl)
```

### 🔤 Font Sizes

```
xs: 12px     (text-xs)
sm: 14px     (text-sm)
base: 16px   (text-base)
lg: 18px     (text-lg)
xl: 20px     (text-xl)
2xl: 24px    (text-2xl)
3xl: 30px    (text-3xl)
```

### 🔲 Border Radius

```
sm: 8px      (rounded-sm)
md: 12px     (rounded-md)
lg: 16px     (rounded-lg)
xl: 20px     (rounded-xl)
2xl: 24px    (rounded-2xl)
full: 9999px (rounded-full)
```

## Responsividade

Tailwind oferece breakpoints para responsividade:

```jsx
// Mobile-first approach
<div className="
  flex flex-col    // Mobile: coluna
  md:flex-row      // Tablet+: linha
  gap-4
  p-4
  md:p-8           // Padding maior em telas maiores
">
```

### Breakpoints Padrão

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## Testando

### Iniciar Web

```bash
npm run web
# Ou com porta específica
npx expo start --web --port 8085
```

### Iniciar App Mobile

```bash
npm run ios       # iOS
npm run android   # Android
npm start         # Expo Go
```

## Diferenças Web vs App

| Aspecto        | Web             | App Mobile           |
| -------------- | --------------- | -------------------- |
| Framework      | HTML/CSS        | React Native         |
| Styling        | Tailwind CSS    | Inline Styles        |
| Classes        | className       | style object         |
| Responsividade | Media queries   | useWindowDimensions  |
| Temas          | Via CSS classes | Via themeColors hook |

## Estrutura de Pastas

```
senior-ease/
├── app/
│   ├── +html.tsx          # ← Importa globals.css
│   ├── _layout.tsx
│   └── ...
├── src/
│   └── presentation/
│       ├── theme/
│       │   ├── globals.css     # Tailwind directives
│       │   ├── colors.ts       # Cores dinâmicas (app)
│       │   └── spacing.ts
│       └── components/
│           └── ...
├── tailwind.config.js      # ← Configuração Tailwind
├── postcss.config.js       # ← PostCSS config
└── package.json
```

## Guia Rápido de Classes

### Layout

```
flex, flex-row, flex-col, grid
gap-{size}, divide-x, divide-y
```

### Positioning

```
absolute, relative, fixed, sticky
top-{size}, bottom-{size}, left-{size}, right-{size}
```

### Sizing

```
w-{size}, h-{size}, min-w-{size}, max-w-{size}
flex-1, flex-auto, flex-none
```

### Typography

```
text-{size}, font-{weight}, font-{family}
leading-{tight/normal/relaxed}
text-{color}, text-opacity-{value}
```

### Colors

```
bg-{color}, text-{color}, border-{color}
bg-opacity-50
```

### Borders & Shadows

```
border, border-{size}, border-{color}
rounded-{size}
shadow, shadow-lg, shadow-xl
```

### Spacing

```
p-{size}, m-{size}, gap-{size}
px-{size}, py-{size} (padding)
mx-{size}, my-{size} (margin)
```

## Exemplo Prático: Task Card

```jsx
// Task Card Web com Tailwind
export function TaskCard({ task, onDelete, onToggleComplete }) {
   return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border border-border p-4 mb-4 bg-surface gap-4 shadow-md">
         {/* Checkbox */}
         <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => onToggleComplete(task.id, e.target.checked)}
            className="w-7 h-7 cursor-pointer"
         />

         {/* Content */}
         <div className="flex-1">
            <h3 className="text-lg font-bold text-text mb-1">{task.title}</h3>
            {task.dueDate && (
               <p className="text-sm text-text-secondary">
                  Até: {formatDate(task.dueDate)}
               </p>
            )}
         </div>

         {/* Delete Button */}
         <button
            onClick={() => onDelete(task.id)}
            className="px-4 py-2 bg-error text-white rounded-lg font-bold hover:bg-opacity-90 transition"
         >
            Excluir
         </button>
      </div>
   );
}
```

## Dicas & Boas Práticas

1. **Use className em vez de style**

   ```jsx
   ✅ <div className="p-4 rounded-lg">
   ❌ <div style={{ padding: 16 }}>
   ```

2. **Organize classes com linhas**

   ```jsx
   className={`
     flex flex-col
     items-center
     justify-between
     gap-4
     p-4
     rounded-lg
   `}
   ```

3. **Use spread operators para classes dinâmicas**

   ```jsx
   className={`
     base-classes
     ${isActive ? 'bg-primary text-white' : 'bg-gray-100'}
     ${size === 'lg' ? 'p-4' : 'p-2'}
   `}
   ```

4. **Prefira utilitários over custom CSS**
   - Tailwind é mais mantível que CSS custom

5. **Use o Intellisense**
   - Instale extensão "Tailwind CSS IntelliSense"

## Recursos

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind CSS Cheatsheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind UI (Components)](https://tailwindui.com)

## Status do Projeto

✅ Web com Tailwind CSS configurado
✅ App mobile mantém React Native
✅ Sem conflitos entre plataformas
✅ Pronto para expandir componentes web

🎉 **Sistema híbrido funcional e escalável!**
