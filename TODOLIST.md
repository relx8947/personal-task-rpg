# Personal Task RPG MVP TODO

Status: MVP implemented as a local-first React application. Backend, public beta operations, and monetization remain post-MVP work.

## Product Definition

- [x] Define the MVP positioning: a personal growth tool that turns real tasks into RPG progression.
- [x] Choose the first target user group: people building personal routines and daily momentum.
- [x] Write the core user loop: create task -> complete task -> gain rewards -> grow character -> review progress.
- [x] Define the MVP success metric: daily quest completion rate and 7-day return behavior.
- [x] Decide the initial tone and theme: modern RPG dashboard with light fantasy language.

## Core Gameplay

- [x] Design the character model: level, XP, coins, energy, title, and basic attributes.
- [x] Define task categories: learning, work, health, creativity, social, and life order.
- [x] Map each task category to character attributes.
- [x] Define task difficulty levels and their reward formulas.
- [x] Define completion rewards: XP, coins, attribute growth, and possible item drops.
- [x] Add a forgiving recovery mechanic with coin-based energy recovery.
- [x] Design the first set of achievements and titles.

## MVP Features

- [x] Create onboarding for first-time users.
- [x] Let users create a character with name, avatar-style emblem, and class.
- [x] Let users create one-time tasks.
- [x] Let users create recurring tasks.
- [x] Let users assign category, difficulty, and estimated time to each task.
- [x] Show a daily quest page with today's tasks.
- [x] Let users mark tasks as complete.
- [x] Apply reward calculation after task completion.
- [x] Show character level, XP progress, coins, and attributes.
- [x] Show a simple inventory or reward log.
- [x] Show basic weekly progress summary.
- [x] Add empty states for new users.
- [x] Add archive/delete flow for tasks.
- [ ] Add full task editing flow.

## Data Model

- [ ] Define `users` for the future cloud version.
- [x] Define `characters`.
- [x] Define `tasks`.
- [x] Model task completion dates on each task for the local MVP.
- [x] Define `skills` or `attributes`.
- [x] Model item drops through reward events.
- [x] Define `achievements`.
- [x] Define `reward_events` for auditability.
- [x] Decide whether the prototype starts with localStorage or Supabase: localStorage.
- [ ] If using Supabase, design Row Level Security policies.

## UX And UI

- [x] Design the main app layout.
- [x] Design the daily quest view.
- [x] Design the task creation flow.
- [x] Design the character panel.
- [x] Design the progress and reward feedback after completing a task.
- [x] Design the weekly summary view.
- [x] Define mobile layout requirements.
- [x] Define desktop layout requirements.
- [x] Pick a visual style that feels game-like without becoming noisy.
- [x] Add empty, success, and disabled states.
- [ ] Add async loading and network error states when backend features exist.

## Technical Setup

- [x] Choose the stack: React, TypeScript, Vite, CSS, localStorage.
- [x] Initialize the frontend project.
- [x] Set up linting.
- [ ] Set up formatting.
- [ ] Set up environment variables when backend or analytics are added.
- [x] Add local development scripts.
- [ ] Add a basic test setup.
- [x] Add project README.
- [x] Add deployment-ready Vite build configuration.

## Implementation Milestones

- [x] Milestone 1: Build a local-only prototype with character, tasks, completion, and XP.
- [x] Milestone 2: Add task recurrence and daily quest generation.
- [x] Milestone 3: Add achievements, reward log, and weekly summary.
- [ ] Milestone 4: Add authentication and cloud sync.
- [x] Milestone 5: Polish UI, onboarding, empty states, and mobile layout.
- [ ] Milestone 6: Deploy a private beta and invite test users.

## Validation

- [x] Test whether completing a task updates XP, coins, and attributes.
- [x] Test whether users can understand XP and attributes from the visible UI.
- [x] Test whether recurring tasks appear in the daily board.
- [ ] Test whether users return the next day without reminders.
- [ ] Interview at least 5 early users.
- [ ] Collect feedback on theme, reward pacing, and task creation friction.
- [ ] Decide which feature should be cut before public launch.

## Launch

- [x] Prepare product copy focused on turning real life into an upgradeable game.
- [ ] Add privacy policy and terms if user accounts are enabled.
- [ ] Add basic analytics.
- [ ] Add feedback channel.
- [ ] Deploy to production.
- [ ] Create a short demo video or GIF.
- [ ] Share with a small beta group.

## Post-MVP Ideas

- [ ] AI task breakdown from large goals.
- [ ] AI-generated adventure journal from completed tasks.
- [ ] Custom skill trees.
- [ ] Theme packs.
- [ ] Friends and party challenges.
- [ ] Calendar integration.
- [ ] Subscription plan.
