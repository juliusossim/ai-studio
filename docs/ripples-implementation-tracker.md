# Ripples — AI Feed Foundations Tracker

> Repo-specific execution tracker derived from the
> [AI Readiness Roadmap](/Users/juliusossim/Documents/ripples/docs/ripples-ai-readiness-roadmap.md).
> This document tracks the feed, event, retrieval, and ranking substrate needed
> to move Ripples from a heuristic feed toward measurable personalization.
>
> This tracker does not represent the full product delivery plan on its own.
> Read it alongside the
> [Product Outcome Tracker](/Users/juliusossim/Documents/ripples/docs/ripples-product-outcome-tracker.md)
> and the
> [Scope Ownership Matrix](/Users/juliusossim/Documents/ripples/docs/ripples-scope-ownership-matrix.md).

---

## 1. Purpose

This document exists to answer:

- what AI and feed-enabling substrate is safe to build now
- what data and contract gaps currently block trustworthy personalization
- which backend and shared package changes should land before reranking or LLM
  layers

This document does not answer:

- whether the app is already usable for buyers, creators, or operators
- whether core product loops are complete
- which package owns each user-facing feature surface

Those questions belong in the companion docs linked above.

---

## 2. How To Use This Document

Each workstream is tagged as one of:

- `Now`
  Safe and necessary to build immediately
- `Next`
  Should begin after current blockers are closed
- `Later`
  Intentionally deferred until prerequisites are in place

Each workstream includes:

- goal
- repo areas
- dependencies
- outputs
- AI readiness effect
- product limitation if absent

Status markers:

- `Not started`
- `In progress`
- `Partially done`
- `Done`
- `Blocked`

---

## 3. Current Repo Baseline

The repo already has these important foundations:

- canonical auth models and repositories
- canonical property and listing foundations
- address assignment and verification foundation
- property document verification foundation
- behavior events
- authenticated, owner-scoped listing media upload and attachment flow
- heuristic feed module
- validated route-level feed and discovery URL contracts in `apps/web`
- a minimal `FeedQueryDto` boundary in `apps/api`
- feed query hook in `shared/data`
- feed UI in `ui/web`
- media upload and rendering primitives
- route boundaries for public discovery, feed, listing detail, creator profile,
  inbox, dashboard, live, notifications, and catalog workflows
- schema-level foundations for `CreatorProfile`, `ContentPost`, `Follow`,
  `FeedImpression`, and `TrendSignal`

The repo does not yet have these core AI-readiness pieces:

- real `LiveSession`
- a complete viewer-aware `FeedQueryDto`
- functioning feed impression capture
- viewer-location-aware feed retrieval
- user/session preference summaries
- computed trend snapshots and trend services
- candidate retrieval services
- ranking feature snapshots
- AI reranking

The repo also has important product limitations that this tracker alone will not
solve:

- the public feed route at `/` is still a placeholder rather than a real
  discovery surface
- the feed is still mostly property inventory with synthetic wrappers
- there is no usable creator, live, conversion, or trust flow yet
- feature packages such as `features/dashboard`, `features/chat`, and
  `features/agents` do not yet have defined product ownership

## 3.1 Substrate Status Snapshot

This tracker should reflect the current app and route reality rather than an
earlier pre-routing baseline.

Status snapshot:

- `Done`
  property and listing persistence foundations
- `Done`
  route-level search contract parsing for discovery, feed, and listing detail
- `Partially done`
  API feed query validation, because `FeedQueryDto` exists but does not yet
  include viewer context or feed mode inputs
- `Partially done`
  media and property interaction substrate, because authenticated writes and
  basic like/save/share/view loops exist but richer feed telemetry does not
- `Partially done`
  creator/content/trend schema foundations, because the schema contains
  `CreatorProfile`, `ContentPost`, `FeedImpression`, `Follow`, and
  `TrendSignal`, but the application layers for them are still largely absent
- `Not started`
  visitor-safe discovery retrieval, impression capture, candidate blending,
  preference summaries, and AI reranking

---

## 4. Success Criteria For This Tracker

This tracker is successful when Ripples has:

- a validated and viewer-aware feed request contract
- trustworthy impression and interaction signals
- viewer-aware retrieval inputs
- real mixed-content inventory
- deterministic candidate pools
- trend and preference read models
- inspectable ranking inputs ready for future reranking

Even after those are complete, Ripples will still need separate product work to
deliver the full expected app outcome.

---

## 5. Now

## 5.1 Feed Query Contract

Status:

- `Partially done`

Goal:

- replace the minimal raw feed query params with an explicit validated query
  contract

Repo areas:

- `apps/api/src/app/feed`
- `shared/types/src/lib/models`
- `shared/api-client/src/lib`
- `shared/data/src/lib/feed`

Build:

- `FeedQueryDto`
- query fields for:
  - `limit`
  - `cursor`
  - `sessionId`
  - optional `viewerLatitude`
  - optional `viewerLongitude`
  - optional `viewerCity`
  - optional `viewerCountry`
  - optional `feedMode`

Dependencies:

- existing feed controller/service
- existing `FeedResponse`
- existing route-level search validation in `apps/web`

Outputs:

- validated feed request contract across route and API boundaries
- stable input surface for later personalization

AI readiness effect:

- establishes viewer context as a first-class ranking input

Product limitation if absent:

- the app can validate basic pagination, but it still cannot reliably support
  anonymous discovery, local relevance, or separate visitor and signed-in feed
  behavior

## 5.2 Feed Impression Tracking

Status:

- `Partially done`

Goal:

- track what the user actually saw, not only what they clicked

Repo areas:

- `apps/api/src/app/events`
- `apps/api/src/app/feed`
- `shared/types/src/lib/models`
- `ui/web/src/lib/feed`

Build:

- `feed_impression` event support
- client-side impression dispatch
- optional `position`, `surface`, `feedMode`, and `viewId` metadata

Dependencies:

- `BehaviorEvent`
- feed rendering in `ui/web`
- existing `FeedImpression` schema foundation

Outputs:

- impression-level signal collection

AI readiness effect:

- critical prerequisite for ranking quality and evaluation

Product limitation if absent:

- trending, discovery analytics, and “why this surfaced” logic remain noisy and
  hard to trust

## 5.3 Viewer-Aware Feed Retrieval

Status:

- `Not started`

Goal:

- make feed generation depend on viewer context instead of returning the same
  ranked feed to everyone

Repo areas:

- `apps/api/src/app/feed`
- `apps/api/src/app/property`
- `shared/data/src/lib/feed`
- `ui/web/src/lib/feed`

Build:

- pass viewer context from frontend to backend
- use viewer location when present
- separate visitor vs signed-in retrieval paths

Dependencies:

- `FeedQueryDto`
- property location data

Outputs:

- visitor feed path
- signed-in feed path
- local relevance hooks in backend

AI readiness effect:

- creates the first real personalization substrate

Product limitation if absent:

- a feed-first marketplace still behaves like one generic ranked list for every
  viewer

## 5.4 Persisted Mixed Feed Content

Status:

- `Partially done`

Goal:

- move feed beyond property-only plus synthetic live/news wrappers

Repo areas:

- `apps/api/prisma/schema.prisma`
- `apps/api/src/app`
- `shared/types/src/lib/models`
- `ui/web/src/lib/feed`

Build:

- `ContentPost`
- content attachment-backed media adoption
- content service and repository
- feed service support for persisted non-property content

Dependencies:

- canonical model agreement already exists
- current schema foundations for `ContentPost` and related feed entities

Outputs:

- real feed inventory beyond property items

AI readiness effect:

- increases candidate diversity and content richness

Product limitation if absent:

- Ripples cannot behave like a true social-commerce feed because live, creator,
  campaign, and user-post surfaces remain decorative instead of real

## 5.5 Feed Event Expansion

Status:

- `Not started`

Goal:

- expand events beyond like/save/share/view on properties

Repo areas:

- `apps/api/src/app/events`
- `shared/types/src/lib/models`
- `ui/web/src/lib/feed`

Build:

- event taxonomy for:
  - `feed_open`
  - `feed_scroll`
  - `hide_feed_item`
  - `dismiss_feed_reason`
  - `view_content_post`
  - `like_content_post`
  - `share_content_post`
  - `follow_creator`

Dependencies:

- persisted content entities
- agreement on the public feed and signed-in feed interaction model

Outputs:

- broader behavioral signal graph

AI readiness effect:

- creates richer behavior patterns for future personalization

Product limitation if absent:

- non-property surfaces cannot be measured cleanly and creator/social loops stay
  underspecified

---

## 6. Next

## 6.1 Live Foundations

Status:

- `Not started`

Goal:

- turn live from feed decoration into a first-class domain

Repo areas:

- `apps/api/prisma/schema.prisma`
- `apps/api/src/app/live`
- `shared/types/src/lib/models`
- `ui/web/src/lib`

Build:

- `LiveSession`
- `LiveViewerSession`
- `LiveChatMessage`
- `LiveReaction`
- `LiveGift`
- `LiveOffer`

Dependencies:

- canonical content direction
- wallet groundwork for gifting

Outputs:

- real live feed items
- real live engagement events

AI readiness effect:

- enables event-native trend and ranking signals

Product limitation if absent:

- live remains a synthetic feed theme and route placeholder instead of a usable
  commerce surface

## 6.2 Creator Foundations

Status:

- `Partially done`

Goal:

- give creators a real identity and attribution surface

Repo areas:

- `apps/api/prisma/schema.prisma`
- `apps/api/src/app`
- `shared/types/src/lib/models`
- `ui/web/src/lib`

Build:

- `CreatorProfile`
- `CreatorProgram`
- creator-follow behavior
- creator attribution on content and campaigns

Dependencies:

- `User`
- `OrganizationMembership`
- social/event taxonomy
- current schema and route placeholder foundations

Outputs:

- creator-aware feed and monetization structure

AI readiness effect:

- enables creator affinity and creator trend models

Product limitation if absent:

- the app cannot support creator-led distribution in a first-class way

## 6.3 Trend Engine

Status:

- `Partially done`

Goal:

- make “trending” computed, cached, and queryable

Repo areas:

- `apps/api/prisma/schema.prisma`
- `apps/api/src/app/feed`
- `apps/api/src/app/events`
- `shared/types/src/lib/models`

Build:

- `TrendSignal`
- `TrendingSnapshot`
- `EntityEngagementSummary`
- trend windows: `5m`, `1h`, `24h`, `7d`

Dependencies:

- expanded event taxonomy
- impressions
- existing `TrendSignal` schema foundation

Outputs:

- property trends
- creator trends
- live trends
- local trend views

AI readiness effect:

- required before any serious reranking logic

Product limitation if absent:

- “trending” remains copywriting instead of a queryable product capability

## 6.4 Session And User Preference Profiles

Status:

- `Not started`

Goal:

- summarize viewer behavior into reusable ranking inputs

Repo areas:

- `apps/api/prisma/schema.prisma`
- `apps/api/src/app/feed`
- `shared/types/src/lib/models`

Build:

- `SessionPreferenceProfile`
- `UserPreferenceProfile`
- `LocationAffinitySummary`
- `CreatorAffinitySummary`
- `ListingTypeAffinitySummary`
- `PriceBandAffinitySummary`

Dependencies:

- impressions
- interaction taxonomy
- location-aware feed requests

Outputs:

- queryable preference summaries

AI readiness effect:

- foundational for deterministic personalization and AI reranking

Product limitation if absent:

- the feed cannot evolve from generic popularity toward repeatable “for you”
  behavior

## 6.5 Deterministic Candidate Retrieval

Status:

- `Not started`

Goal:

- blend feed candidates from multiple sources before any AI layer

Repo areas:

- `apps/api/src/app/feed`
- `shared/types/src/lib/models`

Build:

- candidate source services for:
  - local new listings
  - local trending listings
  - followed creators
  - live momentum
  - saved-similar listings
  - promoted inventory

Dependencies:

- persisted content
- trend snapshots
- preference summaries
- viewer-aware feed query contract

Outputs:

- explicit candidate pools
- source blending strategy

AI readiness effect:

- prerequisite for AI reranking

Product limitation if absent:

- the feed cannot balance freshness, locality, creator relevance, and commerce
  priorities in a controlled way

---

## 7. Later

## 7.1 Ranking Feature Snapshots

Status:

- `Not started`

Goal:

- capture ranking inputs into stable feature projections

Repo areas:

- `apps/api/prisma/schema.prisma`
- `apps/api/src/app/feed`
- `shared/types/src/lib/models`

Build:

- `RankingFeatureSnapshot`
- versioned ranking feature sets

Dependencies:

- trend snapshots
- preference summaries
- candidate retrieval

Outputs:

- inspectable ranking features
- better evaluation and debugging

AI readiness effect:

- strong prerequisite for model-based reranking

Product limitation if absent:

- recommendation quality issues will be hard to audit and explain at scale

## 7.2 AI Reranking

Status:

- `Not started`

Goal:

- use AI to improve ordering of a strong deterministic candidate set

Repo areas:

- `ai/*`
- `apps/api/src/app/feed`
- `shared/types/src/lib/models`

Build:

- personalized reranking service
- ranking evaluation path
- grounded recommendation explanations

Dependencies:

- candidate retrieval
- preference profiles
- trend snapshots
- ranking feature snapshots

Outputs:

- AI-ranked feed ordering

AI readiness effect:

- first true AI ranking layer

Product limitation if absent:

- the app can still be useful, but it will plateau on heuristic ranking alone

## 7.3 Embeddings And Semantic Retrieval

Status:

- `Not started`

Goal:

- add semantic similarity where structured retrieval stops being enough

Repo areas:

- `ai/*`
- `apps/api/src/app`
- `shared/types/src/lib/models`

Build:

- embedding pipeline
- semantic retrieval service
- similar-item features

Dependencies:

- large enough content volume
- real text-rich content and live metadata
- proven semantic retrieval need

Outputs:

- similar listings
- similar content posts
- semantic search support

AI readiness effect:

- enables semantic retrieval use cases

Product limitation if absent:

- discovery remains mostly structured rather than intent-aware

## 7.4 LLM Product Layer

Status:

- `Not started`

Goal:

- add grounded LLM experiences after the platform substrate is mature

Repo areas:

- `ai/core`
- `ai/prompts`
- `ai/tools`
- `apps/api/src/app`
- `ui/web/src/lib`

Build:

- grounded recommendation explanations
- listing and market summaries
- creator assistance
- AI concierge

Dependencies:

- retrieval APIs
- ranking substrate
- semantic search where needed

Outputs:

- user-facing AI experiences

AI readiness effect:

- highest-level intelligence layer

Product limitation if absent:

- the app can still be strong, but it will not yet express the “AI-powered”
  promise in a user-visible way
