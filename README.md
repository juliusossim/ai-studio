# Ripples

Ripples is a feed-first, AI-powered real estate platform for social discovery, sharing, and
conversion.

The product direction is:

- Feed-first property discovery instead of CRUD-first browsing
- Every listing is content
- Sharing creates measurable ripple effects
- Event tracking powers ranking, personalization, and conversion analytics
- AI is a core platform layer, starting with heuristics and evolving toward learned ranking

## Workspace

This is an Nx monorepo using pnpm workspaces.

```sh
pnpm install
pnpm dev
```

The `dev` script runs the web and API servers together:

```sh
pnpm dev
```

For web-side environment variables, copy [apps/web/.env.example](apps/web/.env.example) to
`apps/web/.env`. That file includes the optional Google Drive and Dropbox picker keys used by the
listing media uploader.

For API-side environment variables, copy [apps/api/.env.example](apps/api/.env.example) to
`apps/api/.env` for local development. A production-oriented template now lives at
[apps/api/.env.production.example](apps/api/.env.production.example).

The API env surface is grouped like this:

- runtime identity: `NODE_ENV`, `PORT`, `LOG_LEVEL`
- data and auth secrets: `DATABASE_URL`, `AUTH_JWT_SECRET`, `AUTH_PASSWORD_PEPPER`
- browser/session policy: `WEB_ORIGIN`, `AUTH_CORS_ORIGINS`, `AUTH_COOKIE_SECURE`,
  `AUTH_COOKIE_SAME_SITE`
- auth timings: `AUTH_ACCESS_TOKEN_TTL_SECONDS`, `AUTH_REFRESH_TOKEN_TTL_SECONDS`,
  `GOOGLE_OAUTH_STATE_TTL_SECONDS`
- observability and shutdown: `RIPPLES_SHUTDOWN_TIMEOUT_MS`, `SENTRY_ENABLED`, `SENTRY_DSN`,
  `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE`, `SENTRY_SAMPLE_RATE`, `SENTRY_SHUTDOWN_TIMEOUT_MS`

The API env loader now supports layered files with app-level precedence:
`apps/api/.env.{environment}.local`, `apps/api/.env.local`, `apps/api/.env.{environment}`,
`apps/api/.env`, then the equivalent workspace-root files.

For production deploys, set `SENTRY_RELEASE` to the deployed commit SHA or release id and keep
`SENTRY_ENVIRONMENT` aligned with the real deployment environment such as `production` or
`staging`. The CI workflow now exports `SENTRY_RELEASE=${GITHUB_SHA}` and `SENTRY_ENVIRONMENT=ci`
so any future API boot or release-aware job has consistent release context.

## Current Architecture

```text
apps/
  web/
  mobile/
  api/

ai/
  core/
  functions/
  prompts/
  tools/

features/
  agents/
  chat/
  dashboard/

shared/
  api-client/
  config/
  types/
  utils/

ui/
  primitives/
  web/
  native/
  hooks/
```

Apps are composition surfaces. Reusable UI, shared types, utilities, and domain contracts belong in
workspace packages.

## Roadmap Anchor

See these docs together for the current product and implementation direction:

- [docs/ripples-v2-blueprint.md](docs/ripples-v2-blueprint.md)
- [docs/ripples-implementation-tracker.md](docs/ripples-implementation-tracker.md)
- [docs/ripples-product-outcome-tracker.md](docs/ripples-product-outcome-tracker.md)
- [docs/ripples-media-platform-spec.md](docs/ripples-media-platform-spec.md)
- [docs/ripples-media-implementation-plan.md](docs/ripples-media-implementation-plan.md)
- [docs/ripples-web-routing-plan.md](docs/ripples-web-routing-plan.md)
- [docs/ripples-scope-ownership-matrix.md](docs/ripples-scope-ownership-matrix.md)

## Useful Commands

```sh
pnpm nx sync:check
pnpm nx run-many -t typecheck
pnpm nx run-many -t test
pnpm nx run-many -t lint
pnpm nx run-many -t build
```
