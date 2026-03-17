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

## Estrutura do Projeto

- **src/domain**: entidades, enums e interfaces de repositórios.
- **src/application**: casos de uso (useCases) para tarefas, preferências e usuário.
- **src/infrastructure**: repositórios, serviços e storage.
- **src/presentation**: componentes, contextos, hooks, navegação, telas, tema e utilitários.
- **assets**: imagens e ícones.
- **app**: roteamento e telas principais.

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
