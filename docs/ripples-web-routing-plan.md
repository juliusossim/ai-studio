# Ripples — Web Routing Plan

> Routing plan for the web app using React Router Framework Mode.
> This document turns the product outcome tracker into a concrete route model
> before implementation begins.

---

## 1. Decision

Ripples should use **React Router Framework Mode** for the web app.

This is the right fit for the intended product outcome because Ripples needs:

- public discovery entry
- nested layouts and access boundaries
- route modules with loaders, actions, pending UI, and error boundaries
- future flexibility for SPA, SSR, and static rendering
- production-friendly route conventions instead of a router that is optimized
  mainly for typed URL state

Primary references:

- [Picking a Mode](https://reactrouter.com/start/modes)
- [Framework Routing](https://reactrouter.com/start/framework/routing)
- [Route Module](https://reactrouter.com/start/framework/route-module)
- [Type Safety](https://reactrouter.com/explanation/type-safety)

---

## 2. Routing Principles

### 2.1 Route Modules Stay In `apps/web`

Route modules and route composition belong in `apps/web`.

That means:

- `apps/web` owns `root.tsx`, `routes.ts`, layout routes, and route module
  files
- `ui/web` provides reusable web-product UI used by route modules
- `features/*` provides workflow surfaces used by route modules
- `shared/data` and `shared/api-client` provide fetching and mutation logic

Route modules should stay thin.
They should compose loaders, actions, metadata, redirects, and the top-level
screen for a route, but they should not absorb reusable UI ownership away from
`ui/web` or workflow ownership away from `features/*`.

### 2.2 URL Ownership Rules

Use URL concerns consistently:

- **Path params**
  For identity and hierarchy
- **Search params**
  For shareable, bookmarkable, restorable UI state
- **Navigation state**
  For transient, non-shareable context like `returnTo`
- **Local component state**
  For ephemeral UI behavior only

### 2.3 Search Params Need Validation

Framework Mode gives strong route module typing, but search params still need
discipline at the app boundary.

Ripples should validate route-level search params with Zod-backed parsing
helpers and expose normalized values to route components.

### 2.4 Public Discovery Comes First

The route tree should reflect the product outcome tracker, not the current app.

That means:

- `/` is a public discovery surface
- sign-in is a continuation aid, not the first screen
- authenticated routes unlock richer loops instead of gating the whole product

### 2.5 Use Route Boundaries To Express Product Slices

Top-level routes should correspond to product slices that users recognize:

- discovery
- listing detail
- creator profile
- inbox and inquiry follow-up
- saved and return loops
- live participation
- dashboard workspace
- settings and account

Comments, reactions, filters, and many modal states do not all need their own
top-level routes, but the route tree must leave room for them.

---

## 3. Access Model

Ripples should start with four route boundary types.

| Boundary        | Purpose                                                        | Example routes                                          |
| --------------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| `root`          | global document, providers, error boundary, scroll restoration | all routes                                              |
| `public` layout | visitor-safe discovery and public detail pages                 | `/`, `/listings/:listingId`, `/creators/:creatorHandle` |
| `auth` layout   | sign-in and registration surfaces                              | `/sign-in`, `/register`                                 |
| `app` layout    | signed-in workspace routes                                     | `/feed`, `/saved`, `/inbox`, `/dashboard`, `/settings`  |

Important policy:

- public routes stay public even if signed-in users can visit them
- authenticated routes redirect intentionally rather than silently failing
- conversion routes may begin from public pages, but must support redirecting to
  auth and then returning to the intended action

---

## 4. Canonical Must-Have Route Tree

This is the first route tree Ripples should implement.

```text
root
├─ public-layout
│  ├─ /
│  ├─ /sign-in
│  ├─ /register
│  ├─ /listings/:listingId
│  ├─ /listings/:listingId/inquire
│  ├─ /listings/:listingId/request-viewing
│  ├─ /creators/:creatorHandle
│  └─ /live/:liveId
├─ app-layout
│  ├─ /feed
│  ├─ /saved
│  ├─ /inbox
│  ├─ /inbox/:threadId
│  ├─ /notifications
│  ├─ /dashboard
│  ├─ /dashboard/listings
│  ├─ /dashboard/listings/new
│  ├─ /dashboard/listings/import
│  ├─ /dashboard/content
│  ├─ /dashboard/catalog
│  ├─ /dashboard/catalog/new
│  ├─ /dashboard/catalog/import
│  ├─ /dashboard/engagement
│  ├─ /dashboard/followers
│  └─ /settings
└─ not-found
```

This tree intentionally includes some `Next` routes from the product outcome
tracker.
They should exist as boundaries now even if some initially render placeholders.
That avoids redesigning the route model once live, dashboard, and notifications
arrive.

---

## 5. Route-By-Route Scope

## 5.1 Public Discovery And Auth

| Route       | Access | Why it exists                                        | Product slice               |
| ----------- | ------ | ---------------------------------------------------- | --------------------------- |
| `/`         | public | default discovery-first entry with real feed content | discovery-first feed access |
| `/sign-in`  | public | explicit auth entry with redirect support            | auth continuation           |
| `/register` | public | account creation without hiding discovery            | auth continuation           |

Notes:

- `/` should be the canonical public feed route
- `/sign-in` and `/register` should accept `redirectTo` search state for
  returning users to their intended route after auth

## 5.2 Feed And Return Loops

| Route            | Access        | Why it exists                                     | Product slice                  |
| ---------------- | ------------- | ------------------------------------------------- | ------------------------------ |
| `/feed`          | authenticated | personalized signed-in feed and richer actions    | discovery plus retention       |
| `/saved`         | authenticated | saved items and re-entry into browsing/conversion | return loops                   |
| `/notifications` | authenticated | product return loop and event center              | notifications and return loops |

Notes:

- `/feed` is not the public landing page
- `/saved` is important early because it turns discovery into a usable loop
- `/notifications` can start as a simple center before deeper delivery work

## 5.3 Listing And Conversion

| Route                                  | Access        | Why it exists                     | Product slice                        |
| -------------------------------------- | ------------- | --------------------------------- | ------------------------------------ |
| `/listings/:listingId`                 | public        | listing detail and trust surface  | property detail, trust, social proof |
| `/listings/:listingId/inquire`         | auth-required | first inquiry conversion entry    | inquiry and conversion intent        |
| `/listings/:listingId/request-viewing` | auth-required | viewing and schedule-intent entry | inquiry and conversion intent        |

Notes:

- listing detail must remain public
- inquiry and viewing routes should preserve `redirectTo` when auth is needed
- successful inquiry and viewing creation should redirect into the relevant
  `/inbox/:threadId` conversation

## 5.4 Creator Identity

| Route                      | Access | Why it exists                                       | Product slice                    |
| -------------------------- | ------ | --------------------------------------------------- | -------------------------------- |
| `/creators/:creatorHandle` | public | visible creator identity, attribution, follow entry | creator identity and attribution |

Notes:

- use a stable public handle in the URL instead of an opaque internal id where
  possible
- creator profile should aggregate posted content, promoted inventory, and
  follow state

## 5.5 Messaging And Follow-Up

| Route              | Access        | Why it exists                                     | Product slice           |
| ------------------ | ------------- | ------------------------------------------------- | ----------------------- |
| `/inbox`           | authenticated | thread list and inbox shell                       | inquiry follow-up       |
| `/inbox/:threadId` | authenticated | active inquiry, viewing, or live follow-up thread | conversion continuation |

Notes:

- this is the durable destination after inquiry and viewing actions
- `features/chat` should own the workflow surface rendered inside these routes

## 5.6 Live Commerce

| Route           | Access                                     | Why it exists                                       | Product slice     |
| --------------- | ------------------------------------------ | --------------------------------------------------- | ----------------- |
| `/live/:liveId` | public with richer signed-in participation | live session detail, attendance, and commerce hooks | live commerce MVP |

Notes:

- users should be able to open a live session publicly
- participation actions can require auth
- this route should be a first-class surface, not just an expanded feed card

## 5.7 Dashboard And Settings

| Route                        | Access        | Why it exists                                      | Product slice                   |
| ---------------------------- | ------------- | -------------------------------------------------- | ------------------------------- |
| `/dashboard`                 | authenticated | top-level workspace entry for creator or operator  | dashboard definition            |
| `/dashboard/listings`        | authenticated | listing inventory workspace                        | dashboard definition            |
| `/dashboard/listings/new`    | authenticated | create a single property or listing entry          | listing lifecycle               |
| `/dashboard/listings/import` | authenticated | multi-entry property intake and bulk listing setup | listing lifecycle               |
| `/dashboard/content`         | authenticated | post, campaign, and content management             | dashboard definition            |
| `/dashboard/catalog`         | authenticated | product and commerce catalog workspace             | product catalog                 |
| `/dashboard/catalog/new`     | authenticated | create a single catalog product                    | product catalog                 |
| `/dashboard/catalog/import`  | authenticated | bulk product or catalog entry workflow             | product catalog                 |
| `/dashboard/engagement`      | authenticated | performance and conversion summaries               | dashboard definition            |
| `/dashboard/followers`       | authenticated | creator audience and follow loop monitoring        | creator identity plus dashboard |
| `/settings`                  | authenticated | account, profile, and preference management        | account support                 |

Notes:

- `features/dashboard` should own the screens within these routes
- the dashboard tree gives the currently empty feature library a concrete URL
  charter from the start
- listing creation should not stay buried inside a feed panel long term
- product catalog creation is a separate workspace concern from creator content
  and should not be folded into `/dashboard/content`

---

## 6. Exact URL And Search Contracts

These are the first route contracts Ripples should treat as canonical.

### 6.1 `/`

Public discovery feed.

Path params:

- none

Search schema:

| Param         | Type    | Allowed values                                  | Default   | Purpose                      |
| ------------- | ------- | ----------------------------------------------- | --------- | ---------------------------- |
| `content`     | enum    | `all`, `listings`, `campaigns`, `posts`, `live` | `all`     | top-level discovery mode     |
| `sort`        | enum    | `for-you`, `newest`, `popular`, `most-saved`    | `for-you` | ordering mode                |
| `cursor`      | string  | opaque server cursor                            | absent    | infinite-scroll continuation |
| `city`        | string  | normalized city slug or query text              | absent    | discovery filter             |
| `listingType` | enum    | `buy`, `rent`, `shortlet`, `land`               | absent    | marketplace filter           |
| `priceMin`    | integer | `>= 0`                                          | absent    | lower price bound            |
| `priceMax`    | integer | `>= 0`                                          | absent    | upper price bound            |

Rules:

- if `priceMin > priceMax`, drop both and use defaults
- if `cursor` is present, treat it as stronger than derived pagination
- anonymous users should still get stable, parseable URL state here

### 6.2 `/feed`

Signed-in feed with personalization and return-loop behaviors.

Path params:

- none

Search schema:

| Param     | Type   | Allowed values                                  | Default   | Purpose                      |
| --------- | ------ | ----------------------------------------------- | --------- | ---------------------------- |
| `tab`     | enum   | `for-you`, `following`, `saved-signals`         | `for-you` | signed-in feed mode          |
| `content` | enum   | `all`, `listings`, `campaigns`, `posts`, `live` | `all`     | content filter               |
| `sort`    | enum   | `for-you`, `newest`, `popular`, `most-saved`    | `for-you` | ordering mode                |
| `cursor`  | string | opaque server cursor                            | absent    | infinite-scroll continuation |

Rules:

- `/feed` is the authenticated counterpart to `/`
- `tab` is allowed here but not on `/`
- when `tab=following`, personalization should bias creator-follow data instead
  of generic discovery ranking

### 6.3 `/listings/:listingId`

Public listing detail route.

Path params:

| Param       | Type   | Rule                        |
| ----------- | ------ | --------------------------- |
| `listingId` | string | canonical stable listing id |

Search schema:

| Param    | Type    | Allowed values                                     | Default | Purpose                  |
| -------- | ------- | -------------------------------------------------- | ------- | ------------------------ |
| `from`   | enum    | `feed`, `saved`, `creator`, `live`, `notification` | absent  | shareable source context |
| `media`  | integer | `>= 0`                                             | `0`     | initial media index      |
| `intent` | enum    | `view`, `inquire`, `book-viewing`, `share`         | `view`  | detail-entry intent      |

Rules:

- keep the path canonical as `:listingId` for now
- if later SEO needs a slug, adopt `:listingSlug-:listingId` without changing the
  logical route ownership
- `intent` may pre-open the relevant call to action, but must not create hidden
  side effects

### 6.4 Other Initial Search Contracts

| Route                      | Search params                                                  | Purpose                     |
| -------------------------- | -------------------------------------------------------------- | --------------------------- |
| `/saved`                   | `content`, `sort`                                              | saved inventory filtering   |
| `/creators/:creatorHandle` | `tab` with `overview`, `listings`, `posts`, `live`             | profile section state       |
| `/inbox`                   | `filter` with `all`, `unread`, `inquiries`, `viewings`, `live` | inbox grouping              |
| `/dashboard/listings`      | `status`, `sort`                                               | listing workspace filtering |
| `/dashboard/catalog`       | `status`, `sort`, `kind`                                       | product catalog filtering   |
| `/dashboard/engagement`    | `range`, `tab`                                                 | dashboard summaries         |

Rules:

- use search params only for state worth sharing or restoring
- use `cursor` only on feed-like routes
- do not place auth/session state in the URL
- avoid overloading one route with unrelated UI modes

---

## 7. Creation And Catalog Routes

These routes answer the creation question directly.

### 7.1 New Property Or Listing Entry

Use:

- `/dashboard/listings/new`

This route should own single-entry property or listing creation.

Why:

- publishing is a signed-in workspace action
- the current repo already has a reusable property creation form in `ui/web`
- listing creation is part of inventory management, not public browsing

### 7.2 Multiple Property Entry Or Bulk Listing Intake

Use:

- `/dashboard/listings/import`

This route should own:

- bulk upload
- CSV or structured import later
- repeated multi-entry listing intake
- draft review before publish

This is better than overloading `/dashboard/listings/new` with both single and
bulk workflows.

### 7.3 New Product Entry

Use:

- `/dashboard/catalog/new`

This route should own single product creation for commerce inventory such as
materials, furniture, and related catalog items referenced in the SRS.

### 7.4 Multiple Product Or Catalog Entry

Use:

- `/dashboard/catalog/import`

This route should own:

- multi-product entry
- catalog batch upload
- supplier or brand inventory ingestion
- future spreadsheet-driven catalog creation

### 7.5 Why Not `/dashboard/content/new`

`/dashboard/content` should remain for creator posts, campaigns, and social
content management.

It should not absorb:

- listing inventory creation
- product catalog creation
- bulk import workflows

That split keeps the workspace aligned to actual business objects:

- listings
- content
- catalog

---

## 8. What Should Not Be A Top-Level Route Yet

These concerns should stay nested or local until the product demands otherwise:

- comment composer state
- single reaction toggles
- feed card expansion state
- temporary share UI
- hover previews
- minor dashboard widget state

These deserve route treatment later only if they become durable, shareable,
deep-link-worthy user destinations.

---

## 9. Recommended Route Module Layout

When implementation starts, use React Router Framework Mode conventions in
`apps/web` and keep route UI ownership in the existing libraries.

Suggested shape:

```text
apps/web/
├─ app/
│  ├─ root.tsx
│  ├─ routes.ts
│  ├─ routes/
│  │  ├─ public-layout.tsx
│  │  ├─ auth-layout.tsx
│  │  ├─ app-layout.tsx
│  │  ├─ home.tsx
│  │  ├─ sign-in.tsx
│  │  ├─ register.tsx
│  │  ├─ listing-detail.tsx
│  │  ├─ listing-inquire.tsx
│  │  ├─ listing-request-viewing.tsx
│  │  ├─ creator-profile.tsx
│  │  ├─ live-detail.tsx
│  │  ├─ feed.tsx
│  │  ├─ saved.tsx
│  │  ├─ inbox.tsx
│  │  ├─ inbox-thread.tsx
│  │  ├─ notifications.tsx
│  │  ├─ dashboard.tsx
│  │  ├─ dashboard-listings.tsx
│  │  ├─ dashboard-listings-new.tsx
│  │  ├─ dashboard-listings-import.tsx
│  │  ├─ dashboard-content.tsx
│  │  ├─ dashboard-catalog.tsx
│  │  ├─ dashboard-catalog-new.tsx
│  │  ├─ dashboard-catalog-import.tsx
│  │  ├─ dashboard-engagement.tsx
│  │  ├─ dashboard-followers.tsx
│  │  └─ settings.tsx
```

Ownership rule:

- route modules in `apps/web/app/routes/*`
- reusable auth, feed, property, and shell UI from `ui/web`
- chat workflows from `features/chat`
- dashboard workflows from `features/dashboard`

---

## 10. First Implementation Sequence

Implement the router in this order:

1. root route, document shell, and global providers
2. public discovery route at `/`
3. `/sign-in` and `/register`
4. authenticated app layout and `/feed`
5. `/listings/:listingId`
6. `/listings/:listingId/inquire`
7. `/inbox` and `/inbox/:threadId`
8. `/creators/:creatorHandle`
9. `/saved`
10. `/dashboard/listings/new` as the first publishing route
11. placeholder boundaries for `/notifications`, `/live/:liveId`,
    `/dashboard`, `/dashboard/catalog`, and `/settings`

This order supports the `Now` product slices first while reserving the route
model for the `Next` slices.

---

## 11. Immediate Follow-On Decisions

Before code implementation starts, these decisions should be locked:

1. canonical discovery enums for `content`, `sort`, and feed `tab`
2. canonical listing URL key: `:listingId` only, or slug plus id
3. canonical creator URL key: `:creatorHandle` with fallback resolution rules
4. auth redirect contract: `redirectTo` only, or `redirectTo` plus source
5. whether inquiry and request-viewing render as full pages or modal routes
6. whether listing import and catalog import start as full upload routes or
   simple placeholder boundaries

These are small enough to settle immediately and important enough that we
should not improvise them during implementation.
