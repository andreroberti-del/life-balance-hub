# M7 Balance

App de bem estar do ecossistema Mind7. Ex Life Balance Hub, migrado pro workspace M7 em 2026-04-25.

> Cuide da sua saúde. Ganhe com ela.

## O que está aqui

Repositório principal do app M7 Balance, com web e mobile. Sucessor do `life-balance-hub`, mantém histórico Git completo. Branding em transição (variáveis "Life Balance" no código serão substituídas gradualmente por "M7 Balance" sem quebrar funcionalidade).

## Stack

### Web
- Vite 7 + React 19 + TypeScript
- React Router DOM 7
- Tailwind CSS 4 (via @tailwindcss/vite)
- Recharts 3 pra visualização de dados
- Supabase (auth + DB + edge functions)

### Mobile
- Expo SDK em `apps/mobile`

### Backend
- Supabase Postgres + Edge Functions (Deno)
- 7 functions ativas: garmin auth/webhook/disconnect/callback, zeno-coach (AI Anthropic), scan-food

### AI
- ZENO Coach via Anthropic Claude (Supabase function)

## Features prontas

- Auth completo (Login, SignUp, AuthGuard)
- Onboarding flow 4 steps (Profile, Health, Goals, Supplement)
- Dashboard rico com widgets Garmin, omega ratio chart, daily goals, recent scans
- Scanner de produtos (food + ingredients)
- Protocol 120 (jornada de transformação 120 dias)
- Daily Tracker
- Workout Planner (com wizard, ZENO recommendations, plano completo)
- Community (turmas, leaderboard, levels)
- Profile (health data, metabolic age, peer benchmark)
- Garmin integration (sleep, activity, body composition)
- Multi idioma (EN, PT, ES)

## Setup

### Pré-requisitos
- Node 20+
- npm
- Conta Supabase (free tier serve)

### Primeira vez

```bash
npm install
cp .env.example .env.local
# preenche as 2 variáveis (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)
npm run dev
```

App roda em `http://localhost:5173`.

### Comandos

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Vite dev server |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check |
| `npm run mobile` | Inicia Expo no `apps/mobile` |

### Supabase setup (quando for ativar)

1. Cria projeto em https://supabase.com
2. Pega URL e anon key, coloca em `.env.local`
3. Roda migrations em `supabase/migrations/` (na ordem 001, 002)
4. Deploya as functions em `supabase/functions/` (precisa Supabase CLI)

## Estrutura

```
m7-balance/
├── apps/mobile/              App Expo nativo
├── packages/shared/          Código compartilhado web + mobile
├── public/                   Assets estáticos
├── src/
│   ├── app/
│   │   ├── App.tsx           Root
│   │   ├── routes.tsx        React Router config
│   │   ├── components/       35 componentes React
│   │   ├── contexts/         AuthContext, LanguageContext
│   │   ├── hooks/            useGarmin, etc
│   │   ├── services/         supabase, garmin
│   │   ├── translations/     i18n EN/PT/ES
│   │   └── utils/            gamification, helpers
│   ├── integrations/supabase Client + types gerados
│   └── styles/               Tailwind + theme
├── supabase/
│   ├── migrations/           SQL DDL
│   └── functions/            7 edge functions Deno
├── docs/figma-design-guide.md Guia visual original
└── package.json
```

## Documentos estratégicos

A documentação de produto, estratégia, manifesto Mind7, arquitetura, ICPs, etc está em `../../docs/app-m7-balance/`. Todos os briefings, análises e decisões.

## Status atual

| Item | Status |
|------|--------|
| Migração do repo | ✅ Concluída |
| Build de produção | ✅ Funciona |
| Dev server | ✅ Rodando localmente |
| Branding "M7 Balance" no código | 🟡 Parcial (package.json renomeado, copy ainda diz "Life Balance") |
| Supabase live | 🔴 Pendente (precisa criar projeto Supabase real) |
| Dependências instaladas | ✅ 311 packages, npm |
| Histórico Git preservado | ✅ Origin: github.com/andreroberti-del/life-balance-hub.git |

## Próximos passos imediatos

1. Conectar Supabase real (criar projeto, rodar migrations, atualizar `.env.local`)
2. Substituir copy "Life Balance" por "M7 Balance" nas translations e componentes
3. Aplicar paleta M7 (oliva + amber) em paralelo à neon `#D4FF00` atual, ou consolidar
4. Adicionar features das decisões M7 que faltam:
   - Body capture (4 fotos + avatar paramétrico)
   - Slider morphable de meta visual
   - Predição de ômega 3 antes do BalanceTest (via tabela heurística + LLM)
   - Mapa hábito → negócio do ecossistema Mind7
   - Modo Distribuidor com Lista Quente (já existia em prev/Claude, portar)
5. Renomear repo no GitHub de `life-balance-hub` pra `m7-balance` (preserva histórico)
6. Conectar Vercel ao repo

## Histórico

Repositório original `life-balance-hub` foi clonado e movido pra cá em 2026-04-25. Trabalho prévio do Claude (em pasta `m7-balance-app-prev-claude/`) tem features que podem ser portadas: Lista Quente do distribuidor, body capture com avatar SVG paramétrico, design tokens M7 oliva.
