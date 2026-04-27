# Ripples — Scope Ownership Matrix

> Working ownership map for user-facing and platform-facing scope.
> This document defines where code belongs, how the UI layers differ, and which
> boundaries Nx should enforce.

---

## 1. Boundary Ladder

Ripples should use this UI and feature ladder:

```text
ui/primitives -> ui/composed -> ui/web -> features/* -> apps/*
```

Each step is allowed to depend downward, not upward.

Interpretation:

- `ui/primitives`
  Foundation layer. Generic shadcn-installed components, Radix/Base wrappers,
  styling helpers, and design-system-level building blocks.
- `ui/composed`
  Reusable compound UI assembled from primitives. No fetching, routing, auth,
  or workflow ownership.
- `ui/web`
  Reusable web-product layer. Web-only providers, shells, route-adjacent
  controllers, and reusable web UX modules.
- `features/*`
  Product workflows and persona capabilities. This is where business outcomes
  live.
- `apps/*`
  App composition and route entry only.

This means `ui/composed` should not be collapsed into `ui/web`.
It has a valid role as the reusable compound layer between foundation
components and web-product modules.

---

## 2. Package Roles

| Area                | Primary Responsibility                | Should Own                                                                                                                               | Should Not Own                                                  |
| ------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `apps/web`          | app composition and route assembly    | route entry, auth gating decisions, layout composition, app bootstrapping                                                                | reusable business workflows, generic UI libraries               |
| `apps/mobile`       | mobile composition surface            | mobile route assembly, native navigation, mobile bootstrapping                                                                           | shared web UI, backend workflows                                |
| `apps/api`          | durable domain APIs and orchestration | controllers, services, repositories, domain workflows                                                                                    | client rendering concerns                                       |
| `shared/types`      | canonical contracts                   | domain models, DTOs, enums                                                                                                               | UI behavior, fetching                                           |
| `shared/data`       | client data access and mutations      | API hooks, query state, client store, mutation orchestration                                                                             | presentational UI                                               |
| `shared/api-client` | transport client                      | typed request builders, fetch wrappers, auth headers                                                                                     | React hooks, UI state                                           |
| `ui/primitives`     | foundation UI layer                   | shadcn install target, Radix/Base wrappers, generic controls, design-system helpers                                                      | route logic, business workflows, domain-specific screens        |
| `ui/composed`       | reusable compound UI                  | generic cards, carousels, grouped controls, shells, presentational compounds                                                             | fetching, session logic, route ownership, persona workflows     |
| `ui/web`            | reusable web-product layer            | auth shell, session/theme providers, protected route shell, reusable web feed/property modules, web-only UI support such as media upload | domain workflows that belong to one product feature or persona  |
| `features/*`        | product capability layer              | creator dashboard, inquiry/chat flows, live room flows, operator tools, agent workflows                                                  | generic web shell concerns, primitive controls                  |
| `ai/*`              | AI runtime and tooling                | prompts, tools, orchestration, reranking and grounded assistive layers                                                                   | shared business contracts that should live outside the AI layer |

---

## 3. Definitive Difference Between `ui/web` And `features/*`

Use this test:

- Put code in `ui/web` when it answers:
  `How should the web app support or render this kind of interface?`
- Put code in `features/*` when it answers:
  `What can this user or persona accomplish here?`

Another way to say it:

- `ui/web` owns reusable web-product modules
- `features/*` owns specific business capabilities

Examples:

| If the thing is...                     | Put it in...         | Ripples example                                                         |
| -------------------------------------- | -------------------- | ----------------------------------------------------------------------- |
| a reusable auth page or session shell  | `ui/web`             | sign-in page, registration page, protected route, auth layout           |
| a reusable web feed module             | `ui/web`             | generic feed shell, feed state, feed hero, feed filters                 |
| a reusable property publishing module  | `ui/web`             | property create form, property card, media upload composition           |
| a creator workspace                    | `features/dashboard` | creator analytics home, creator content queue, creator performance view |
| a conversation or inquiry workflow     | `features/chat`      | buyer inquiry thread, viewing follow-up, live chat panel                |
| an assistant workflow                  | `features/agents`    | buyer concierge, operator assistant, creator copilot                    |
| app bootstrapping or route composition | `apps/web`           | route tree, app shell composition, public vs authenticated entry        |

---

## 4. Strict Placement Tables

## 4.1 Belongs In `ui/web`

| Kind of code                                      | Why                                         | Ripples examples                                                      |
| ------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------- |
| web-only providers and controllers                | cross-cutting support for many web surfaces | `AuthProvider`, `WebThemeProvider`, session restore controller        |
| reusable auth screens and shells                  | not tied to one feature workflow            | sign-in page, registration page, auth route states                    |
| reusable web feed modules                         | present across multiple discovery surfaces  | feed shell, feed status, feed filtering controls, feed post rendering |
| reusable property publishing and browsing modules | generic web marketplace UI                  | property card, create-property form, media upload integration         |
| reusable web error and recovery surfaces          | cross-cutting web concerns                  | error boundary, API recovery state                                    |

## 4.2 Belongs In `features/*`

| Kind of code                                        | Why                                          | Ripples examples                                          |
| --------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------- |
| persona workspaces                                  | specific user outcome and IA                 | creator dashboard, operator review queue, agent workspace |
| domain workflows with multiple steps or states      | business capability, not generic web support | inquiry flow, viewing scheduling flow, offer-intent flow  |
| real-time product experiences                       | feature-specific orchestration               | live room, host console, audience chat                    |
| assistant experiences with explicit task boundaries | feature outcome, not generic shell           | buyer concierge workflow, creator content helper          |
| capability-specific metrics and actions             | tied to one slice of the product             | creator follower insights, inquiry conversion funnel      |

## 4.3 Never Put These In `ui/web`

| Anti-pattern                               | Where it should go instead  | Ripples example                                  |
| ------------------------------------------ | --------------------------- | ------------------------------------------------ |
| persona-specific business workflow         | `features/*`                | creator earnings panel                           |
| domain orchestration or data workflow      | `shared/data` or `apps/api` | inquiry mutation flow, transaction orchestration |
| generic design-system control              | `ui/primitives`             | generic `ButtonGroup`, `Tooltip`, `Field`        |
| reusable compound that is not web-specific | `ui/composed`               | generic carousel shell, generic summary card     |
| app route entry logic                      | `apps/web`                  | public route vs authenticated route composition  |

## 4.4 Never Put These In `features/*`

| Anti-pattern                     | Where it should go instead           | Ripples example                              |
| -------------------------------- | ------------------------------------ | -------------------------------------------- |
| generic auth shell               | `ui/web`                             | shared sign-in or registration surface       |
| generic feed rendering primitive | `ui/web` or `ui/composed`            | feed post shell or reusable feed card chrome |
| base form controls               | `ui/primitives`                      | input, label, checkbox                       |
| transport/fetch/query code       | `shared/data` or `shared/api-client` | feed query hook, mutation client             |
| app bootstrapping                | `apps/*`                             | root providers and route assembly            |

---

## 5. `ui/primitives` Definition

`ui/primitives` should not be limited to untouched raw shadcn output.

It should contain:

- shadcn-installed components
- thin wrappers over Radix/Base UI primitives
- design-system helpers and variants
- generic foundation components that remain domain-agnostic

It should not contain:

- Ripples feed logic
- auth/session orchestration
- creator or inquiry workflows
- domain-specific cards that only make sense in one product slice

Good fits for `ui/primitives`:

- `Button`
- `Card`
- `Dialog`
- `Field`
- `Empty`
- `Spinner`
- generic `MediaRenderer` if it stays domain-agnostic

Bad fits for `ui/primitives`:

- `FeedPostCard`
- `InquiryThreadPanel`
- `CreatorPerformanceSummary`

---

## 6. `ui/composed` Decision

`ui/composed` should stay as a library, but with a stricter definition.

It should own:

- reusable compounds assembled from `ui/primitives`
- generic shells and grouped UI
- reusable compounds that may later support both web and native variants

It should not own:

- fetching or mutations
- session or route logic
- domain-specific workflows
- imported dumps that have not been adapted to repo standards

Good fits for `ui/composed`:

- generic carousel wrappers
- generic media gallery shells
- generic summary cards
- generic social-interaction bar once decoupled from product logic

Move to `ui/web` instead when the component becomes web-product-specific.
Move to `features/*` instead when the component becomes workflow-specific.

---

## 7. Feature Library Policy

Not every chunk of UI needs its own feature library.

Use a feature library when all of the following are true:

- it owns a distinct product capability or persona workflow
- it has its own state and interaction model
- it is meaningful to build, test, and evolve independently

Do not create or keep a feature library when it is only:

- a placeholder
- one presentational widget
- a wrapper over `ui/web`
- a speculative future area with no owned product slice

In this workspace, real feature boundaries should remain Nx libraries with
their own `package.json`, `project.json`, and `tsconfig` files because Ripples
is already using a package-based workspace model.

Placeholder libraries should either be given a concrete charter or removed.

---

## 8. Immediate Anti-Patterns To Correct

These are worth fixing next:

- `ui/web` should stop re-exporting lower layers such as `@org/data` and
  `@org/ui-primitives` from its root barrel.
- `ui/composed` should be reduced to adapted, actively used compounds only.
- parked dump code and story/demo-only runtime source inside `ui/composed`
  should be isolated or removed
- `features/dashboard`, `features/chat`, and `features/agents` should either
  gain concrete owned workflows or stay empty by design until activated
- Nx tags should enforce the ladder:
  `ui/primitives -> ui/composed -> ui/web -> features/* -> apps/*`

---

## 9. Recommended Tag Model

Keep the existing coarse `scope:*` tags and add a second layer dimension:

- `layer:ui-foundation`
- `layer:ui-composed`
- `layer:ui-web`
- `layer:feature`
- `layer:app`

This gives Nx enough information to enforce the intended architecture instead of
only checking coarse scope buckets.
