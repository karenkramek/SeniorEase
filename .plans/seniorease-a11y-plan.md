# Plano de Implementacao - Acessibilidade Web + Nativo

## Objetivo
Garantir acessibilidade consistente nas duas versoes (web e mobile nativo), usando WCAG 2.2 AA como base para web e equivalentes nativos (VoiceOver/TalkBack, foco e navegacao por teclado externo) para iOS e Android.

## Estrategia de plataforma
- Web: conformidade WCAG 2.2 AA com foco em zoom, reflow, contraste, links, teclado e semantica.
- Nativo: equivalencia funcional de acessibilidade com foco em leitor de tela, ordem de foco, nomes acessiveis, estados e alvo de toque.
- Compartilhado: componentes base, tokens de tema, mensagens de erro e regras de qualidade.

## Fases

### 1) Baseline (Dia 1)
- Definir checklist Web (WCAG 2.2 AA) e checklist Nativo (iOS/Android) por tela principal.
- Converter criterios em Definition of Done por plataforma.

### 2) Quick Wins P0/P1 (Semana 1-2)
- Ajustar viewport para permitir zoom e reflow sem bloqueios.
- Corrigir contraste e distinguibilidade de links.
- Melhorar formulario de criacao de tarefa: labels visiveis, validacao com erro textual e estado semantico.
- Garantir foco visivel e fluxo de teclado em modal.
- Padronizar alvo minimo de interacao (44x44 CSS px) nos componentes menores.
- Garantir labels e hints equivalentes no nativo para campos, botoes e alertas.
- Revisar navegacao por leitor de tela no nativo (ordem, nomes e estados).

### 2.1) Padrao de confirmacao e notificacao (implementacao atual)
- Adotar ConfirmModal reutilizavel para fluxos de exclusao e conclusao de tarefa.
- Adotar canal global de notificacao para sucesso/erro/info em web e nativo.
- Remover Alert pontual de telas e consolidar feedback de usuario no canal global.
- Garantir que mensagens de notificacao tenham texto claro, curto e orientado a acao.

### 2.2) Requisitos de acessibilidade para ConfirmModal
- Modal deve abrir com foco inicial no titulo ou primeira acao relevante.
- Ordem de navegacao por teclado deve permanecer dentro do modal enquanto aberto (web).
- Fechamento deve devolver foco ao elemento que abriu o modal.
- Acoes de confirmar/cancelar devem ter nomes acessiveis claros e consistentes.
- Modal deve anunciar contexto de decisao para leitor de tela (titulo + mensagem).

### 2.3) Requisitos de acessibilidade para GlobalNotification
- Banner deve anunciar mensagem automaticamente para leitor de tela.
- Deve existir acao explicita para fechar notificacao com alvo minimo de toque.
- Contraste de texto/icone no banner deve cumprir AA no tema claro e escuro.
- Notificacao nao deve bloquear navegacao principal nem capturar foco indevidamente.
- Tempo de auto-fechamento deve ser suficiente para leitura, com possibilidade de fechamento manual.

### 3) Padronizacao de componentes (Semana 2-4)
- Centralizar regras de acessibilidade nos componentes base.
- Criar tokens para foco, erro e tamanho minimo de alvo.
- Harmonizar tipografia e line-height para leitura em publico senior.
- Definir API unica de acessibilidade para componentes compartilhados (web/nativo).

### 4) Tooling e Qualidade Continua (Semana 3-6)
- Ampliar lint para regras de acessibilidade.
- Adicionar testes automatizados de acessibilidade para web.
- Criar gate de CI para bloquear regressao critica.
- Adicionar smoke tests nativos de acessibilidade (leitor de tela e foco principal).

### 5) Conteudo e Internacionalizacao (Semana 5-8)
- Revisar microcopy de erro/instrucao.
- Expandir ajuda com secao de recursos de acessibilidade.
- Preparar base para i18n.

### 6) Auditoria Final (Semana 8)
- Executar checklist final WCAG 2.2 AA com evidencias por criterio.

## Verificacao
- Lint de acessibilidade sem violacoes de severidade alta.
- Contraste AA validado nas combinacoes criticas.
- Navegacao web completa por teclado.
- Formulario invalido com feedback textual e semantico.
- Zoom/reflow em 200% sem perda funcional.
- Testes automatizados de acessibilidade no pipeline.
- Leitura correta no VoiceOver (iOS) e TalkBack (Android) para fluxos principais.
- Alvos interativos com area minima consistente no nativo.
- ConfirmModal com foco inicial, ordem de foco e retorno de foco validados no web.
- GlobalNotification com anuncio de mensagem validado em leitor de tela.
- Fluxos de excluir/concluir tarefa validados sem uso de Alert nativo direto.

## Matriz de aceite por plataforma

### Web (WCAG)
- Zoom ate 200% sem perda funcional.
- Ordem de tab e foco visivel em todos os fluxos principais.
- Links distinguiveis por mais de cor (ex.: sublinhado).
- Mensagens de erro visiveis e anunciadas.
- ConfirmModal operavel por teclado (tab, enter, espaco, escape quando aplicavel).
- Notificacao global anunciada sem quebrar navegacao da tela.

### Mobile nativo (iOS/Android)
- VoiceOver/TalkBack lendo rotulos e estados corretos.
- Ordem de foco coerente em formularios, listas e modais.
- Botoes e acoes com alvo de toque adequado.
- Feedback de erro e sucesso legivel e anunciavel.
- Modal de confirmacao anunciado com contexto e acoes claras.
- Notificacao global com leitura automatica e acao de fechar acessivel.

## Componentes envolvidos (status atual)
- ConfirmModal criado e integrado em fluxos principais de confirmacao.
- NotificationProvider e hook useNotification ativos no layout raiz.
- GlobalNotification ativo para feedback de sucesso/erro/info.
- TaskList e TaskDetails migrados para o novo padrao de notificacao/confirmacao.
- ConfirmModal com foco inicial no abrir e retorno de foco para ancora apos fechamento (web).
- GlobalNotification com semantica de anuncio reforcada para leitor de tela.
- CreateTask com feedback global de sucesso/erro mantendo validacao inline acessivel.
- TaskCard e StepItem com alvo minimo de toque padronizado (44x44).
- Tipografia base com line-height explicito e caption ampliada para melhor legibilidade.
- PreferencesContext com erro de persistencia exposto para UI.
- PreferencesScreen com banner de erro acessivel para falhas de salvar/carregar preferencias.
- HelpScreen com secao explicita de recursos de acessibilidade para web e nativo.
- Base inicial de i18n criada para strings criticas de feedback/erro/confirmacao.
- CreateTask, TaskList, TaskDetails, Help, Preferences e GlobalNotification usando strings centralizadas.
- Locale simplificado para pt-BR fixo; controle de idioma removido da UI e modelo de preferencias.
- Hook useAppStrings aplicado em fluxos principais com carregamento fixo pt-BR.
- Tab navigator, titulos de header modal e ModalScreen migrados para strings centralizadas.
- TaskCard, StepItem e labels de controles de Preferences migrados para i18n (incluindo accessibilityLabel).
- Infra de testes adicionada com Jest + React Native Testing Library para componentes.
- Cobertura inicial de acessibilidade automatizada implementada para ConfirmModal e GlobalNotification.
- Gate de CI adicionado para lint + typecheck + test:a11y em PR/push.
- Cores de Switch padronizadas por tema via util compartilhado para consistencia no dark mode.
- Cobertura de testes de acessibilidade expandida para TaskCard, StepItem e CreateTask.
- Acentuacao PT-BR normalizada em strings centralizadas e testes de interface.
- Textos diretos residuais revisados: migracao para strings onde aplicavel e correcao de escrita.

## Proximos ajustes recomendados nesses componentes
- Adicionar smoke tests nativos focados em leitura de labels e ordem de foco principal.

## Escopo
- Incluido: experiencia web e mobile nativo do SeniorEase.
- Excluido: redesign visual completo e mudancas arquiteturais nao relacionadas a acessibilidade.
