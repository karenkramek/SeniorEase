# SeniorEase

Aplicativo acessível para gestão de tarefas, focado em idosos e pessoas com necessidades especiais.

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o app:
   ```bash
   npx expo start
   ```

## Versão Web (build estático)

Para gerar os arquivos da versão web:

```bash
npm run build:web
```

O resultado será exportado na pasta `dist/`.

## Deploy no Vercel

Este projeto já está preparado para deploy estático com o arquivo `vercel.json`.

### Passo a passo

1. Suba o projeto para um repositório no GitHub (se ainda não estiver).
2. No Vercel, clique em **Add New... > Project**.
3. Importe o repositório `SeniorEase`.
4. Confirme as configurações do projeto:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build:web`
   - **Output Directory**: `dist`
5. Clique em **Deploy**.

Após o deploy, o Vercel gera uma URL pública para acessar a versão web.

## Estrutura do Projeto

```
app/                        # Roteamento Expo Router
├── (auth)/                 # Telas públicas: login e cadastro
└── (app)/
    ├── (tabs)/             # Tarefas, Preferências, Ajuda, Perfil
    ├── create-task.tsx     # Criação de tarefa
    └── task-details.tsx    # Detalhes de uma tarefa

src/
├── domain/                 # Regras de negócio puras
│   ├── entities/           # Task, User, Preferences
│   ├── enums/              # TaskStatus, TaskFilter
│   └── repositories/       # Interfaces IAuthRepository, ITaskRepository, IPreferencesRepository
├── application/
│   └── useCases/           # Casos de uso: tarefas (criar, concluir, excluir...) e preferências
├── infrastructure/
│   ├── mappers/            # TaskMapper, UserMapper
│   └── repositories/       # Implementações Firebase: Auth, Task, Preferences
├── lib/
│   └── firebase.ts         # Configuração Firebase (Auth + Firestore)
└── presentation/
    ├── components/         # AccessibleButton, AccessibleText, TaskCard, ConfirmModal, AuthGuard...
    ├── contexts/           # AuthContext, PreferencesContext, TaskRepositoryContext
    ├── hooks/              # useAuth, useTasks, useTheme, usePreferences...
    ├── theme/              # colors.ts, sharedStyles.ts, spacing.ts, typography.ts
    └── utils/              # alert, format, helpers, icons, filterLabels, taskFilters

docs/firebase/              # firestore.rules e firestore.indexes.json
assets/images/              # Ícones e imagens do app
```

## Acessibilidade

- Propriedades de acessibilidade em botões, textos, switches e navegação.
- Feedback visual e tátil para ações importantes.
- Suporte a fonte grande, alto contraste e espaçamento amplo via preferências do usuário.
- Componentes `AccessibleButton` e `AccessibleText` com ajuste automático de escala e contraste.

## Estilos Compartilhados

- Estilos centralizados em `src/presentation/theme/sharedStyles.ts`.
- Temas, cores e espaçamentos em `colors.ts`, `spacing.ts`, `typography.ts`.
- Três paletas: `light`, `dark` e `highContrast`.

## Boas Práticas

- Separe responsabilidades em pastas específicas.
- Use nomes claros e padronizados.
- Centralize temas e estilos.
- Revise periodicamente para remover código não utilizado.
- Atualize esta documentação conforme novas funcionalidades.

## Dicas

- Utilize os estilos compartilhados para containers, botões, listas e inputs.
- Garanta acessibilidade em todos os componentes interativos.
- Prefira `AccessibleText` a `ThemedText` nas telas do app (dentro de `(app)/`).

## Comunidade e Recursos

- [Expo documentation](https://docs.expo.dev/)
- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)
