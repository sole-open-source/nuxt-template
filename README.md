# nuxt-template

A production-ready Nuxt 4 starter template with a layered architecture, full auth system, inset sidebar layout, and shadcn-vue UI.

## Stack

| Layer     | Tool                             |
| --------- | -------------------------------- |
| Framework | Nuxt 4 + Vue 3 (script setup)    |
| Language  | TypeScript (strict)              |
| Styling   | TailwindCSS v4 + shadcn-vue      |
| Forms     | vee-validate + zod               |
| Testing   | Vitest                           |
| Linting   | ESLint (@nuxt/eslint) + Prettier |

## Architecture

```
app/
├── core/          # Infrastructure: api, service, errors, logger, permissions
├── config/        # App config + constants (app, navigation, permissions)
├── types/         # Types shared by more than one slice
├── utils/         # Pure utility functions (date, string) — auto-imported
├── composables/   # Stateful composables (useAuth, useQuery, useDisclosure, ...) — auto-imported
├── features/      # Vertical slices (auth, ...)
├── components/    # UI: ui/ (shadcn), kit/, blocks/, layout/
├── layouts/       # default (sidebar shell), auth (login split screen)
├── middleware/    # auth.global.ts — the page guard
└── pages/         # Routes
server/
├── middleware/    # auth.ts — session resolution + endpoint guard installation
├── utils/         # session, guard, auth-api
├── api/           # JSON endpoints (auth only — add yours here)
└── routes/        # Browser-navigable routes (OAuth start + callback)
```

See [`AGENTS.md`](./AGENTS.md) for the rules and conventions to follow when building here, and
[`app/components/README.md`](./app/components/README.md) for how the component layers fit together.

## Getting started

```sh
cp .env.example .env
bun install
bun run dev
```

The dev server starts on http://localhost:3000.

Set `NUXT_PUBLIC_AUTH_ENABLED=false` to work on the UI without a backend: the auth
middleware is skipped, the page guard stands down, and the whole menu stays visible.

## Environment variables

Every key in `runtimeConfig` (`nuxt.config.ts`) is overridable by an env var —
`NUXT_PUBLIC_API_BASE_URL` sets `runtimeConfig.public.apiBaseUrl`, and so on.

| Variable                            | Description                     | Default       |
| ----------------------------------- | ------------------------------- | ------------- |
| `NUXT_PUBLIC_API_BASE_URL`          | Backend API base URL            | —             |
| `NUXT_AUTH_API_BASE_URL`            | Auth API base URL (if separate) | —             |
| `NUXT_PUBLIC_AUTH_ENABLED`          | Enable/disable auth             | `true`        |
| `NUXT_PUBLIC_AUTH_PASSWORD_ENABLED` | Show password login form        | `true`        |
| `NUXT_PUBLIC_AUTH_GOOGLE_ENABLED`   | Show Google OAuth button        | `false`       |
| `NUXT_PUBLIC_GOOGLE_CLIENT_ID`      | Google OAuth client ID          | —             |
| `NUXT_AUTH_COOKIE_DOMAIN`           | Cookie domain                   | —             |
| `NUXT_AUTH_COOKIE_SECURE`           | Secure cookie flag              | `true`        |
| `NUXT_AUTH_COOKIE_MAX_AGE`          | Cookie lifetime in seconds      | `604800` (7d) |
| `NUXT_AUTH_COOKIE_SAMESITE`         | SameSite policy                 | `lax`         |

## How auth works

The session lives in two httpOnly cookies set by this app's own server routes.
The browser never talks to the auth API directly, which also keeps a separately
hosted auth backend out of CORS.

1. `POST /api/auth/login` calls the auth API, sets the cookies and answers with
   `{ user, accessToken }`.
2. `server/middleware/auth.ts` runs on every request that reaches Nitro: it reads
   the cookies, asks the auth API `/auth/me` who they belong to, and puts the user
   and the guard on `event.context`. Endpoints under `/api/` get a 401; pages get
   redirected to `/login?redirect=…`.
3. `app/plugins/auth.server.ts` hands that user to the Vue app through `useState`,
   so it survives into the browser payload.
4. `app/middleware/auth.global.ts` checks the page against `AUTH_ROUTE_PERMISSIONS`.
   It runs on the server _and_ on every client-side navigation, which is why the
   page decision lives there rather than in the server middleware.
5. Each endpoint you add calls `event.context.requirePermission('…')` for itself —
   `server/api/endpoints.guard.test.ts` fails if one forgets.

Both auth methods are feature-flagged. Set one or both:

```sh
# Password-only
NUXT_PUBLIC_AUTH_PASSWORD_ENABLED=true
NUXT_PUBLIC_AUTH_GOOGLE_ENABLED=false

# Google-only
NUXT_PUBLIC_AUTH_PASSWORD_ENABLED=false
NUXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
```

The auth API is expected to answer:

| Endpoint                  | Request                   | Response           |
| ------------------------- | ------------------------- | ------------------ |
| `POST /auth/login`        | `{ email, password }`     | `{ user, tokens }` |
| `POST /auth/google/login` | `{ code }`                | `{ user, tokens }` |
| `GET /auth/me`            | `Authorization: Bearer …` | `User`             |

`tokens` is `{ access_token, refresh_token, expires_at }`. Change the shape in
`app/features/auth/types.ts` and `server/utils/auth-api.ts` if yours differs —
those two files are the only place that knows it.

## Customization checklist

- [ ] Replace the name and logo in `app/config/app.ts` and `public/logo.svg`
- [ ] Add your nav items in `app/config/navigation.ts`
- [ ] Add your permission keys, roles and route matrix in `app/config/permissions.ts`
- [ ] Set `NUXT_PUBLIC_API_BASE_URL` in `.env`
- [ ] Add feature slices under `app/features/`, with their types in `<slice>/types.ts`

## Scripts

```sh
bun run dev          # Start dev server (port 3000)
bun run build        # Production build
bun run typecheck    # vue-tsc type checking
bun run lint         # ESLint
bun run format       # Prettier
bun run test         # Vitest
```
