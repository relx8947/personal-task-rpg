# Personal Task RPG

Personal Task RPG is a local-first web app that turns real-life tasks into daily quests, XP, coins, attributes, achievements, and weekly progress.

The MVP focuses on a complete single-player loop:

1. Create or customize a character.
2. Add one-time or recurring quests.
3. Complete quests on the daily board.
4. Gain XP, coins, attribute growth, achievements, and reward drops.
5. Review weekly progress.

## Features

- Character setup with name and class.
- Daily quest board.
- One-time, daily, weekday, and weekly quests.
- Quest categories mapped to RPG attributes.
- Edit and archive quests.
- Difficulty-based XP and coin rewards.
- Level progression and energy.
- Recovery mechanic using earned coins.
- Achievements and reward log.
- Weekly summary.
- Local persistence with `localStorage`.
- Responsive desktop and mobile layout.

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- lucide-react icons

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

Run tests:

```bash
npm run test
```

Check formatting:

```bash
npm run format:check
```

## Deployment

The app is configured for static hosting. The public repository can be deployed with GitHub Pages by publishing the generated `dist` folder from the `main` branch workflow.

## Product Direction

This version intentionally avoids a backend so the core loop can be tested quickly. A production SaaS version can add authentication, cloud sync, AI task breakdown, payments, social quests, and analytics later.

Recommended next stack for hosted accounts:

- Supabase Auth
- Supabase Postgres
- Row Level Security
- Vercel deployment
- Server functions for AI and payment flows

## License

MIT
