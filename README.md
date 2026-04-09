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

## 🔒 Segurança

O SeniorEase adota práticas de desenvolvimento seguro com foco em prevenção de
vazamento de credenciais, proteção da camada web e monitoramento contínuo de
dependências.

### Proteção de Credenciais e Dados

- **Gitleaks + Husky**: bloqueio de commits com secrets expostos.
- **Gitignore para ambiente local**: `.env` e arquivos sensíveis fora do versionamento.
- **Configuração customizada de detecção**: regras para chaves Firebase, API keys,
  JWT, chaves AWS e private keys.

Arquivos relacionados:

- `.husky/pre-commit`
- `.gitleaks.toml`
- `.gitignore`

### Segurança Web e Aplicação

- **CSP (Content Security Policy)**: restrição de origens confiáveis para scripts,
  conexões, imagens e fontes.
- **Security Headers**: `X-Frame-Options`, `X-Content-Type-Options`,
  `X-XSS-Protection` e `Strict-Transport-Security`.

Arquivos relacionados:

- `web/index.html` (template web com políticas de segurança)
- `vercel.json` (headers aplicados no deploy)

### NPM Audit (Dependências)

- **Monitoramento contínuo de vulnerabilidades** nas dependências do projeto.
- **Fluxo recomendado**: executar auditoria regularmente e corrigir com cautela,
  principalmente quando houver updates com potencial breaking change.

Comandos disponíveis:

```bash
npm run audit
npm run audit:fix
```

### Como Validar Localmente

Observacao: apos `npm install`, os hooks do Husky sao preparados automaticamente
e o projeto executa uma checagem do Gitleaks no `postinstall`.

1. Instale o Gitleaks:

   macOS:

   ```bash
   brew install gitleaks
   ```

   Windows (PowerShell):

   ```powershell
   winget install gitleaks
   ```

   Alternativa no Windows (Chocolatey):

   ```powershell
   choco install gitleaks
   ```

2. Verifique se os hooks do Husky estao ativos (opcional):

   ```bash
   npm run prepare
   ```

3. Execute a auditoria de dependências:

   ```bash
   npm run audit
   ```

## Estrutura do Projeto

```
app/                        # Roteamento Expo Router
├── (public)/               # Telas públicas: home e sobre
│   ├── home.tsx
│   └── about.tsx
├── (auth)/                 # Autenticação: login e cadastro
│   ├── login.tsx
│   └── register.tsx
└── (app)/
    ├── (tabs)/             # Tarefas, Preferências, Ajuda, Perfil
    │   ├── tasks.tsx
    │   ├── preferences.tsx
    │   ├── help.tsx
    │   └── profile.tsx
    ├── create-task.tsx     # Criação de tarefa
    ├── edit-task.tsx       # Edição de tarefa
    ├── task-details.tsx    # Detalhes de uma tarefa
    └── modal.tsx           # Modal genérico
src/
├── domain/                 # Regras de negócio puras
│   ├── entities/           # Task, User, Preferences
│   ├── enums/              # TaskStatus, TaskFilter
│   ├── exceptions/         # Exceções de domínio
│   └── repositories/       # Interfaces IAuthRepository, ITaskRepository, IPreferencesRepository
├── application/
│   └── useCases/           # Casos de uso: tarefas (criar, concluir, excluir...) e preferências
├── infrastructure/
│   ├── mappers/            # TaskMapper, UserMapper
│   ├── repositories/       # Implementações Firebase: Auth, Task, Preferences
│   └── utils/              # Utilitários de infraestrutura
├── lib/
│   └── firebase.ts         # Configuração Firebase (Auth + Firestore)
└── presentation/
    ├── components/         # Componentes por domínio: auth, home, pages, shared, task, ui
    ├── constants/          # Constantes de apresentação
    ├── contexts/           # AuthContext, PreferencesContext, TaskRepositoryContext, NotificationContext
    ├── hooks/              # useAuth, useTaskList, useTheme, usePreferences, useNotification...
    ├── i18n/               # strings.ts — internacionalização
    ├── theme/              # colors.ts, sharedStyles.ts, spacing.ts, typography.ts, a11y-tokens.ts...
    └── utils/              # alert, format, helpers, icons, filterLabels, taskFilters
docs/firebase/              # firestore.rules e firestore.indexes.json
assets/images/              # Ícones e imagens do app
```

## Acessibilidade

- Propriedades de acessibilidade em botões, textos, switches e navegação.
- Feedback visual, tátil e sonoro para ações importantes.
- Fontes grandes, alto contraste e espaçamento amplo.

## Estilos Compartilhados

- Estilos centralizados em `src/presentation/theme/sharedStyles.ts`.
- Temas, cores e espaçamentos em `colors.ts`, `spacing.ts`, `typography.ts`.

## Boas Práticas

- Separe responsabilidades em pastas específicas.
- Use nomes claros e padronizados.
- Centralize temas e estilos.
- Revise periodicamente para remover código não utilizado.
- Atualize esta documentação conforme novas funcionalidades.

## Dicas

- Utilize os estilos compartilhados para containers, botões, listas e inputs.
- Garanta acessibilidade em todos os componentes interativos.

## Comunidade e Recursos

- [Expo documentation](https://docs.expo.dev/)
- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)
