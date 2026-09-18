# Bracezin Kiosk project guidelines

## Project overview

This repository is an Angular application with a custom theme system, NgRx state, translation support, and Laravel-style backend integration patterns. The app shell is in `src/app`, shared UI/layout code is organized across layouts and shared modules, and theming assets live in `src/assets/scss` alongside the separate `theme/` folder.

## Architecture

- Keep the app modular: feature modules, layouts, and shared code should stay separated.
- Prefer working within the existing structure in `src/app/pages`, `src/app/layouts`, `src/app/core`, and `src/app/store` rather than introducing a parallel pattern.
- Follow the current routing pattern in `src/app/app-routing.module.ts`: lazy-loaded feature modules with guards for protected routes.
- Respect the existing app bootstrap setup in `src/app/app.module.ts`, including HTTP interceptors, translation setup, and NgRx registration.

## Angular conventions

- Match the project’s naming and structure conventions instead of creating custom one-off patterns.
- Prefer service-layer orchestration over placing API logic directly in components.
- Reuse existing patterns for forms, loading states, error handling, and translated labels before creating new patterns.
- When you need to transform or filter data in templates, move that logic to component methods or shared utilities. Do not use inline template arrow functions.
- Keep changes small and targeted unless the task explicitly requires deeper refactoring.

## Theme and styling

- Make style changes in the existing SCSS structure under `src/assets/scss` unless the task clearly belongs to the separate theme package in `theme/`.
- Keep layout changes compatible with the existing layout system under `src/app/layouts`.
- Preserve the project’s visual hierarchy, spacing system, and design tokens instead of creating unscoped styles.
- Prefer extension of the existing style system over introducing a second styling convention.

## API and Laravel integration

- Treat backend contracts as the source of truth and align Angular models to them.
- Centralize API calls in service files and keep component logic focused on presentation and UI state.
- Support the project’s existing auth flow and HTTP interceptor structure instead of bypassing it with custom ad hoc requests.
- Handle loading, success, and error states consistently across the app.
- If API payloads differ from the UI model, map them explicitly in the service or model layer.

## State management

- Preserve the NgRx setup in `src/app/store` and follow the existing reducer/effect structure.
- Add state changes in the same architectural style as neighboring store modules rather than introducing a new store pattern.
- When a feature requires new state, keep the change aligned with the current naming and effect patterns already used in the project.

## Build and validation

- Use the repository scripts from `package.json` for validation and local verification.
- Preferred commands:
  - `npm run build` for Angular production build validation
  - `npm run test` for unit tests when the relevant tests are present
  - `npm start` or `npm run watch` for local development verification
- After making changes, run the smallest relevant validation command and report the actual result.

## Quality bar

- Do not introduce hardcoded secrets, fake credentials, or local-only API URLs.
- Do not leave debug logs or temporary console output in production code.
- Do not add broad refactors when a focused fix is enough.
- Do not break route guards, lazy loading, translation config, or app initialization.

## Preferred response style for agents

When making code changes, summarize them with:

1. what changed
2. which files were touched
3. any API/backend impact
4. any layout/theme impact
5. validation result
6. follow-up recommendations if needed
