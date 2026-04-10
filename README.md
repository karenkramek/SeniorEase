# Tech Challenge - Fase 5 (Hackathon) - Grupo 7 - Turma 4FRNT - SeniorEase

SeniorEase: aplicativo acessível para gestão de tarefas, com foco em pessoas idosas e em necessidades de usabilidade, acessibilidade e simplicidade de uso.

[![Expo](https://img.shields.io/badge/Expo-%7E54.0.33-000000?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo Router](https://img.shields.io/badge/Expo_Router-6.0.23-000020?style=flat)](https://docs.expo.dev/router/introduction/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFA611?style=flat&logo=firebase&logoColor=white)](https://firebase.google.com/)

---

## ⚡ Acesso Rápido

- 🌐 [Versão web em produção](https://senior-ease-wheat.vercel.app/)
- 🎬 [Vídeo de demonstração](https://drive.google.com/file/d/12XzweH44k5KaEFHH-QxSvP7Sn-F9Jgl5/view?usp=sharing)
- 🤖 [APK Android (download)](https://expo.dev/artifacts/eas/cw5FBKS8qm6KWBYtQD8tA6.apk)

---

## 📋 Gestão do Projeto

- 📊 [Trello (Fase 5)](https://trello.com/b/Gap1rbA6/fase-5)

---

## 📱 Sobre o Projeto

O **SeniorEase** foi desenvolvido como o **Tech Challenge da Fase 5 (Hackathon)** pelo **Grupo 7 da turma 4FRNT** da Pós-Graduação em Front-End Engineering da FIAP.

O projeto prioriza:

- **Acessibilidade por padrão**: foco em boas práticas WCAG 2.2 AA para fluxo de tarefas, formulários e navegação.
- **Experiência multiplataforma**: app em React Native com suporte a Android, iOS e Web.
- **Arquitetura escalável**: separação por camadas (domain, application, infrastructure, presentation).
- **Segurança e qualidade**: validações, pipeline de qualidade e monitoramento de vulnerabilidades.


## 🧭 Evolução do Tech Challenge

Este repositório representa a Fase 5 da trilha de evolução do grupo:

| Fase | Repositório |
|------|-------------|
| **Fase 1** | [bytebank-fiap](https://github.com/karenkramek/bytebank-fiap) |
| **Fase 2** | [tech-challenge-2](https://github.com/karenkramek/fiap-tech-challenge-2) |
| **Fase 3** | [bytebank-mobile](https://github.com/camp0sfer/bytebank-mobile) |
| **Fase 4** | [fiap-tc-4](https://github.com/tatishinoda/fiap-tc-4) |
| **Fase 5** | *Repositório atual (SeniorEase)* |

---

## 💻 Tecnologias Utilizadas

| Categoria | Tecnologias |
|-----------|-------------|
| **App** | React Native 0.81.5, Expo ~54.0.33, Expo Router ~6.0.23 |
| **Linguagem** | TypeScript |
| **Backend** | Firebase Authentication, Cloud Firestore |
| **Validação de Formulários** | React Hook Form, Zod |
| **Navegação** | Expo Router, React Navigation |
| **Persistência Local** | AsyncStorage |
| **Qualidade** | Jest, Testing Library, ESLint |

---

## 🏗️ Arquitetura e Estrutura

O projeto segue uma estrutura em camadas, separando regra de negócio, casos de uso, adaptadores e interface.

```text
SeniorEase/
├── app/                          # Rotas Expo Router e telas principais
│   ├── (public)/                 # Fluxo público (home, about)
│   ├── (auth)/                   # Fluxo de autenticação (login, registro)
│   └── (app)/                    # Fluxo autenticado (tabs, tarefas, detalhes, modal)
│
├── src/
│   ├── domain/                   # Entidades, enums, exceções e contratos
│   ├── application/useCases/     # Casos de uso de tarefas e preferências
│   ├── infrastructure/           # Implementações concretas, mappers e utilitários
│   ├── lib/                      # Integrações externas (Firebase)
│   └── presentation/             # Componentes, hooks, contextos, tema e i18n
│
├── docs/firebase/                # Regras e índices do Firestore
├── web/index.html                # Template web com CSP
├── vercel.json                   # Configuração de build/headers para deploy web
└── README.md
```

### 🧩 Responsabilidades por Camada

| Camada | Responsabilidade |
|--------|------------------|
| **Domain** | Regras de negócio puras e contratos |
| **Application** | Orquestração dos casos de uso |
| **Infrastructure** | Persistência e adaptadores externos |
| **Presentation** | UI, acessibilidade, temas, fluxos de tela |

---

## ♿ Acessibilidade

Pilares aplicados no SeniorEase:

- **Componentes acessíveis** com labels, hints e estados de erro/foco.
- **Preferências de uso** (fonte, contraste e experiência simplificada).
- **Modais e feedbacks acessíveis** com navegação clara e suporte a teclado na web.
- **Base de internacionalização** centralizada para textos e mensagens.

---

## 🔒 Segurança

### 🛡️ Proteção de Credenciais

- **Husky + Gitleaks** para bloquear commits com secrets sensíveis.
- **`.env` fora de versionamento** e template em `.env.example`.
- **Verificação automática no `postinstall`** (`scripts/check-gitleaks.js`).

### 🌐 Segurança Web

- **CSP** configurada em `web/index.html`.
- **Security headers** configurados em `vercel.json`:
  `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Strict-Transport-Security`.

### 🔍 Auditoria de Dependências

```bash
npm run audit
npm run audit:fix
```

---

## 🚀 Como Executar o Projeto

### ✅ Pre-requisitos

- Node.js 18+
- npm
- Conta Firebase
- Expo Go (opcional para testes em dispositivo)

### 1. 📦 Instalar Dependências

```bash
npm install
```

### 2. ⚙️ Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e preencha com os dados do Firebase:

```bash
cp .env.example .env
```

Variáveis esperadas:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### 3. ▶️ Iniciar o App

```bash
npx expo start
```

Fluxo recomendado no dia a dia:

1. Execute `npx expo start`.
2. No terminal do Expo, use os atalhos interativos: `w` para abrir na Web, `a` para abrir no Android (emulador/dispositivo) e `i` para abrir no iOS (simulador).
3. Para testar no celular físico, abra o Expo Go e escaneie o QR code exibido no terminal.

Alternativas diretas (sem usar os atalhos interativos):

```bash
npm run android
npm run ios
npm run web
```

---

## 🌍 Versão Web e Deploy

### 🧱 Build estático

```bash
npm run build:web
```

Saída gerada em `dist/`.

### 🚢 Deploy no Vercel

Configuração recomendada:

- **Framework Preset**: Other
- **Build Command**: `npm run build:web`
- **Output Directory**: `dist`

O projeto já possui `vercel.json` preparado para roteamento SPA e headers de segurança.

---

## 🧪 Qualidade e Testes

### 🧰 Comandos principais

```bash
npm run lint
npm run test
npm run test:a11y
```

### 🔁 Pipeline de qualidade

Existe workflow para checagens de acessibilidade/qualidade em CI:

- `.github/workflows/a11y-quality.yml`

---

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| App não sobe | Remova `node_modules` e rode `npm install` novamente |
| Erro de Firebase | Verifique `.env` e as credenciais do projeto no console Firebase |
| Erro de cache no Expo | Rode `npx expo start -c` |
| Build web falha | Rode `npm run build:web` localmente e valide variáveis de ambiente |
| Gitleaks bloqueia commit | Remova credenciais reais e use variáveis de ambiente |

---

## 👥 Integrantes do Grupo

| Nome | Email | RM |
|------|-------|----|
| Fernanda Raquel Campos Jiacinto | [fernanda.frcj@gmail.com](mailto:fernanda.frcj@gmail.com) | 366526 |
| Karen Cristina Kramek | [kakakramek@gmail.com](mailto:kakakramek@gmail.com) | 361140 |
| Tatiane Gabrielle Marçal Rodrigues da Costa | [tatiane.costa@alura.com.br](mailto:tatiane.costa@alura.com.br) | 365215 |

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos no Tech Challenge da Pós-Graduação em Front-End Engineering da FIAP.
