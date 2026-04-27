# Ripples — Product Outcome Tracker

> Product-delivery tracker for the user-facing Ripples app.
> This document complements the
> [AI Feed Foundations Tracker](/Users/juliusossim/Documents/ripples/docs/ripples-implementation-tracker.md)
> by focusing on expected outcome, usability, and feature completeness.
> Route planning for these product slices is captured in the
> [Web Routing Plan](/Users/juliusossim/Documents/ripples/docs/ripples-web-routing-plan.md).
> Media storage, upload, and delivery architecture is captured in the
> [Media Platform Spec](/Users/juliusossim/Documents/ripples/docs/ripples-media-platform-spec.md).

---

## 1. Purpose

Ripples is expected to become a feed-first, social-commerce real estate
platform rather than only a ranked listings surface.

This document tracks the user-facing product slices required to make that true:

- discovery
- creator and social participation
- live commerce
- conversion
- trust and operations

---

## 2. App Outcome To Design Toward

Ripples should feel usable when:

- a visitor can open the app and immediately discover meaningful feed content
- a signed-in user can save, share, follow, and return to a better feed
- a creator can publish, attribute, and grow distribution
- a buyer can move from interest to inquiry, viewing, live attendance, and
  offer intent
- operations can verify, moderate, and observe what is happening

If a workstream improves ranking quality but does not improve one of those
outcomes, it is necessary infrastructure rather than complete product scope.

---

## 3. Current App Reality

The current app already provides:

- auth and session handling
- property creation with media upload
- a feed UI with ranked property cards
- like, save, share, and view interactions on property items

The current app is still missing important product outcome slices:

- anonymous discovery-first entry
- real multi-content feed inventory
- creator identity and follow loops
- comments and community interactions
- real live rooms and live participation
- inquiry, viewing booking, and conversion flows
- trust, moderation, notifications, and operator tooling
- a defined role for `dashboard`, `chat`, `agents`, and `mobile`

---

## 4. How To Use This Document

Each product slice is tagged as one of:

- `Now`
  Needed to make the current app materially more usable
- `Next`
  Needed soon after the current experience is coherent
- `Later`
  Valuable, but should not displace more important usability gaps

Each slice includes:

- goal
- user outcome
- repo areas
- dependencies
- outputs
- usability effect

Status markers:

- `Not started`
- `In progress`
- `Partially done`
- `Done`
- `Blocked`

---

## 5. Now

## 5.1 Discovery-First Feed Access

Status:

- `Not started`

Goal:

- let visitors discover the product before forcing authentication

User outcome:

- a new user can open Ripples, browse a real feed, and understand why the app
  is worth joining

Repo areas:

- `apps/web/src/app`
- `ui/web/src/lib/feed`
- `ui/web/src/lib/session`
- `shared/data/src/lib/feed`
- `apps/api/src/app/feed`

Build:

- public or semi-public feed route
- visitor feed shell and sign-up prompts
- visitor-safe feed query path
- graceful transition from visitor session to authenticated session

Dependencies:

- feed query contract
- visitor feed retrieval path

Outputs:

- discovery-first landing experience
- usable visitor browsing loop

Usability effect:

- aligns the app with a feed-first marketplace instead of an auth-first
  workspace

## 5.2 Real Multi-Content Feed

Status:

- `Not started`

Goal:

- make the feed feel like a living social-commerce stream, not only a listings
  board

User outcome:

- buyers and creators see more than property cards, including creator posts,
  campaigns, and live inventory

Repo areas:

- `apps/api/src/app/feed`
- `apps/api/src/app/content`
- `shared/types/src/lib/models`
- `ui/web/src/lib/feed`

Build:

- real `ContentPost` surfaces
- real `campaign` and `user-post` item rendering
- inventory rules for when each content type appears
- feed empty states that reflect different content modes

Dependencies:

- persisted mixed feed content

Outputs:

- usable multi-content feed
- surface-specific rendering and interaction rules

Usability effect:

- makes Ripples feel social and dynamic rather than synthetic

## 5.3 Infinite Scroll And Session Continuity

Status:

- `Not started`

Goal:

- make feed consumption continuous instead of single-page and fragile

User outcome:

- a viewer can keep browsing, resume where they left off, and accumulate real
  session behavior

Repo areas:

- `shared/api-client/src/lib`
- `shared/data/src/lib/feed`
- `ui/web/src/lib/feed`

Build:

- infinite-query client support
- load-more or auto-fetch on scroll
- cursor state retention
- scroll/session continuity hooks

Dependencies:

- stable feed cursor contract
- impression tracking

Outputs:

- continuous feed browsing
- stronger session signal quality

Usability effect:

- upgrades the app from demo feed to actual browsing product

## 5.4 Accurate Feed Exposure And Interaction UX

Status:

- `Not started`

Goal:

- make feed analytics and action affordances reflect what users really do

User outcome:

- the app tracks exposure, saving, sharing, and dismissal in a believable way

Repo areas:

- `ui/web/src/lib/feed`
- `apps/api/src/app/events`
- `shared/types/src/lib/models`

Build:

- viewport-based impressions
- share UX with real share intents
- save state persistence
- hide or dismiss actions
- clearer post-action feedback

Dependencies:

- expanded event taxonomy

Outputs:

- trustworthy interaction capture
- better feed controls for users

Usability effect:

- improves both ranking quality and felt product polish

## 5.5 Creator Identity And Attribution

Status:

- `Not started`

Goal:

- make creator-led distribution visible in the product

User outcome:

- a user can tell who posted or promoted something, follow them, and discover
  more from them

Repo areas:

- `apps/api/src/app`
- `shared/types/src/lib/models`
- `ui/web/src/lib/feed`
- `features/dashboard`

Build:

- creator profile carding
- attribution on posts, campaigns, and promoted listings
- follow creator flow
- minimal creator profile surface

Dependencies:

- creator foundations
- feed event expansion

Outputs:

- visible distribution layer
- creator-oriented feed interactions

Usability effect:

- unlocks the “creator-led promotion” promise in the SRS

## 5.6 Inquiry And Conversion Intent

Status:

- `Not started`

Goal:

- let a user move from feed interest into real commercial next steps

User outcome:

- a buyer can inquire, request a viewing, or express intent without leaving the
  product loop

Repo areas:

- `apps/api/src/app/property`
- `apps/api/src/app/transactions`
- `shared/types/src/lib/models`
- `ui/web/src/lib/feed`
- `features/chat`

Build:

- inquiry CTA on feed items
- request-viewing or schedule-intent flow
- transaction-intent event capture
- handoff to messaging or follow-up workflow

Dependencies:

- auth and identity
- event taxonomy support

Outputs:

- first discovery-to-conversion path
- conversion intent signals

Usability effect:

- turns Ripples from a browsing surface into an actionable marketplace

---

## 6. Next

## 6.1 Commenting And Social Proof

Status:

- `Not started`

Goal:

- add community interaction around listings and content

User outcome:

- users can comment, react, and evaluate momentum through visible social proof

Repo areas:

- `apps/api/src/app/content`
- `shared/types/src/lib/models`
- `ui/web/src/lib/feed`

Build:

- comment threads
- reactions for non-property items
- social proof counts and states

Dependencies:

- persisted content entities
- creator attribution

Outputs:

- richer social layer

Usability effect:

- supports community participation rather than one-way browsing

## 6.2 Live Commerce MVP

Status:

- `Not started`

Goal:

- make live a usable experience instead of a feed decoration

User outcome:

- users can join a live session, participate, and respond to live offers

Repo areas:

- `apps/api/src/app/live`
- `shared/types/src/lib/models`
- `ui/web/src/lib`
- `features/chat`

Build:

- live session detail surface
- live attendance
- chat and reactions
- host spotlight on listings
- live offer or CTA surface

Dependencies:

- live foundations
- creator foundations

Outputs:

- live participation loop
- live commerce signals

Usability effect:

- aligns the app with the live-selling promise in the SRS

## 6.3 Notifications And Return Loops

Status:

- `Not started`

Goal:

- create reasons for users to come back to the app

User outcome:

- users are notified about follows, replies, live events, offers, and listing
  changes

Repo areas:

- `apps/api/src/app`
- `shared/types/src/lib/models`
- `ui/web/src/lib`
- `features/dashboard`

Build:

- notification model and delivery rules
- notification center
- event-to-notification mapping

Dependencies:

- comments, follows, live, and conversion events

Outputs:

- product return loop

Usability effect:

- improves retention and repeat engagement

## 6.4 Trust And Verification Surfaces

Status:

- `Not started`

Goal:

- expose quality and trust signals to buyers and operators

User outcome:

- a viewer can tell whether a listing or actor is verified and what confidence
  signals exist

Repo areas:

- `apps/api/src/app/property`
- `shared/types/src/lib/models`
- `ui/web/src/lib/feed`
- `features/dashboard`

Build:

- verification badges and explanations
- listing trust indicators
- moderation or review states where needed

Dependencies:

- verification foundation

Outputs:

- visible trust system

Usability effect:

- reduces friction in high-stakes real estate decisions

## 6.5 Dashboard Definition

Status:

- `Not started`

Goal:

- give `features/dashboard` a concrete product role

User outcome:

- creators, agents, or operators have a focused place to monitor listings,
  content, and engagement

Repo areas:

- `features/dashboard`
- `ui/web`
- `shared/data`

Build:

- persona-specific dashboard IA
- reusable dashboard cards and summaries
- metrics linked to actual product loops

Dependencies:

- notifications
- trend summaries
- creator attribution

Outputs:

- non-placeholder dashboard feature

Usability effect:

- turns a currently empty surface into a meaningful workspace

---

## 7. Later

## 7.1 Ripple Economy Surfaces

Status:

- `Not started`

Goal:

- make Ripple rewards and spend flows visible when the surrounding marketplace
  loops are ready

User outcome:

- users can understand, earn, and spend Ripple value inside meaningful product
  actions

Repo areas:

- `apps/api/src/app`
- `shared/types/src/lib/models`
- `features/dashboard`
- `ui/web`

Build:

- wallet balances
- reward explanations
- spend surfaces for boosts, gifts, or commissions

Dependencies:

- conversion and creator economy foundations
- wallet groundwork

Outputs:

- usable Ripple economy surfaces

Usability effect:

- supports retention and creator incentives without appearing premature

## 7.2 Agent-Assisted Experiences

Status:

- `Not started`

Goal:

- define where `features/agents` adds product value instead of existing as a
  placeholder

User outcome:

- users receive agent help for discovery, summarization, or workflow assistance
  in a grounded way

Repo areas:

- `features/agents`
- `ai/*`
- `ui/web`
- `apps/api`

Build:

- agent entry point and task boundaries
- grounded retrieval hooks
- measurable assistant use cases

Dependencies:

- product retrieval APIs
- trustworthy ranking and explanation substrate

Outputs:

- non-placeholder agent feature

Usability effect:

- makes AI visible only when the product can support it well

## 7.3 Mobile Outcome Definition

Status:

- `Not started`

Goal:

- define the mobile app as a real product surface rather than a repo placeholder

User outcome:

- the most valuable discovery, live, and notification loops work well on mobile

Repo areas:

- `apps/mobile`
- `ui/native`
- shared packages that support mobile parity

Build:

- mobile-first product slice definition
- scope parity rules versus web
- notification and feed priorities for mobile

Dependencies:

- visitor discovery, feed continuity, and notification foundations

Outputs:

- mobile product direction with clear boundaries

Usability effect:

- prevents a second app surface from drifting without a purpose
