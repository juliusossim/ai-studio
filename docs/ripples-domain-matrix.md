# Ripples — Domain Model Matrix

> Structured model classification and relationship blueprint for Ripples. This
> document bridges the SRS and ERD into an implementation-ready design view.

---

## 1. Model Categories

Ripples models should be classified into five groups:

- `Root Entity`
  A primary persisted business object with its own lifecycle and identity.
- `Join Entity`
  A persisted relationship between two or more roots, often carrying role or
  attribution data.
- `Value Object`
  A reusable embedded structure that expresses meaning without independent
  lifecycle identity.
- `Enum / Status`
  A constrained set of allowed values controlling behavior or lifecycle.
- `Derived / Read Model`
  A computed or projection-oriented model optimized for ranking, display, or
  analytics.

---

## 2. Core Domain Matrix

## 2.1 Identity And Access

| Model            | Category    | Purpose                               | Owner / Parent           | Notes                                                         |
| ---------------- | ----------- | ------------------------------------- | ------------------------ | ------------------------------------------------------------- |
| `User`           | Root Entity | Canonical human identity              | none                     | One base identity for all personas                            |
| `AuthIdentity`   | Root Entity | Login/provider credential binding     | `User`                   | Supports manual and social auth                               |
| `Session`        | Root Entity | Auth session lifecycle                | `User`                   | Refresh token / device session                                |
| `UserProfile`    | Root Entity | Public-facing user profile            | `User`                   | Bio, avatar, social presence                                  |
| `Role`           | Root Entity | Named access role                     | none                     | `agent`, `admin`, `creator`, etc.                             |
| `Permission`     | Root Entity | Fine-grained capability               | none                     | `listing.publish`, `wallet.manage`                            |
| `UserRole`       | Join Entity | Assigns role to user                  | `User`, `Role`           | May include scope or source                                   |
| `RolePermission` | Join Entity | Maps role to permission               | `Role`, `Permission`     | Explicit authorization graph                                  |
| `Verification`   | Root Entity | Verification / trust state            | `User` or `Organization` | Should be split where compliance behavior diverges materially |
| `Device`         | Root Entity | Optional client/device trust metadata | `User`                   | Useful for security and analytics                             |

### Core constraints

- `User.email` should be unique if stored on the user record
- `AuthIdentity(provider, providerSubject)` must be unique
- `UserRole(userId, roleId, scope)` should be unique per scope
- `RolePermission(roleId, permissionId)` must be unique

### Core relationships

- one `User` to many `AuthIdentity`
- one `User` to many `Session`
- one `User` to one `UserProfile`
- many `User` to many `Role` through `UserRole`
- many `Role` to many `Permission` through `RolePermission`

---

## 2.2 Organization And Participation

| Model                    | Category    | Purpose                         | Owner / Parent         | Notes                                             |
| ------------------------ | ----------- | ------------------------------- | ---------------------- | ------------------------------------------------- |
| `Organization`           | Root Entity | Canonical business actor        | none                   | Covers agency, developer, supplier, owner company |
| `OrganizationProfile`    | Root Entity | Public organization profile     | `Organization`         | Branding, description, trust signals              |
| `OrganizationMembership` | Join Entity | User membership in organization | `User`, `Organization` | Carries role and membership state                 |
| `Team`                   | Root Entity | Subdivision inside organization | `Organization`         | Sales, creator ops, support                       |
| `TeamMembership`         | Join Entity | User membership in team         | `User`, `Team`         | Optional nested role                              |

### Core constraints

- `Organization.slug` should be unique if public URLs use it
- `OrganizationMembership(userId, organizationId)` should be unique per active membership
- `Team(name, organizationId)` should be unique within an organization

### Core relationships

- one `Organization` to one `OrganizationProfile`
- one `Organization` to many `Team`
- many `User` to many `Organization` through `OrganizationMembership`
- many `User` to many `Team` through `TeamMembership`

---

## 2.3 Address And Geography

| Model                 | Category     | Purpose                               | Owner / Parent                 | Notes                                                                   |
| --------------------- | ------------ | ------------------------------------- | ------------------------------ | ----------------------------------------------------------------------- |
| `Address`             | Root Entity  | Canonical postal/location address     | none                           | Lightly normalized reusable location object                             |
| `AddressAssignment`   | Join Entity  | Attaches address to a subject         | `Address`, polymorphic subject | Supports property, organization, user profile, and future profile roles |
| `AddressVerification` | Root Entity  | Verification workflow for address     | `Address`                      | Separate from subject verification                                      |
| `GeoPoint`            | Value Object | Latitude/longitude coordinate         | embedded                       | Reusable location primitive                                             |
| `Country`             | Root Entity  | Country reference data                | none                           | Usually static reference                                                |
| `Region`              | Root Entity  | State/province reference              | `Country`                      | Optional normalization                                                  |
| `City`                | Root Entity  | City reference data                   | `Region` or `Country`          | Useful for search and filters                                           |
| `Neighborhood`        | Root Entity  | Local area reference                  | `City`                         | Useful for premium discovery                                            |
| `ServiceArea`         | Root Entity  | Area served by user/org               | `User` or `Organization`       | Can be polygon or named areas                                           |
| `ServiceZone`         | Root Entity  | Delivery or fulfillment coverage zone | `Organization`                 | Important for shops and supplier logistics                              |

### Recommendation

Start with:

- `Address` as a lightly normalized root entity
- `AddressAssignment` as a polymorphic join
- `AddressVerification` as a separate root
- `GeoPoint` as a value object
- city / country fields denormalized where helpful

Normalize `Country`, `City`, `Neighborhood` only when search and analytics
pressure makes it worthwhile.

### Core constraints

- `AddressAssignment(addressId, subjectType, subjectId, role)` should be unique
- each subject should have at most one active primary address per role
- each `Property` should have exactly one active `property_location` assignment
- each `Organization` should have at most one active primary
  `registered_address` and one `operating_address`
- `AddressVerification` should retain history, with at most one active current
  verification record

### Core relationships

- one `Address` to many `AddressAssignment`
- one `Address` to many `AddressVerification`
- one `Organization` to many `ServiceZone`
- one `ServiceZone` may contain many geographic coverage definitions

---

## 2.4 Property Domain

| Model                          | Category                    | Purpose                                      | Owner / Parent                      | Notes                                             |
| ------------------------------ | --------------------------- | -------------------------------------------- | ----------------------------------- | ------------------------------------------------- |
| `Property`                     | Root Entity                 | Real-world real estate asset                 | none                                | Canonical asset, separate from listing            |
| `PropertyOwnership`            | Join Entity                 | Ownership relation                           | `Property`, `User` / `Organization` | Supports multiple owners                          |
| `PropertyMedia`                | Root Entity                 | Media for property                           | `Property`                          | Images, videos, floor plans                       |
| `PropertyDocument`             | Root Entity                 | Legal/marketing docs                         | `Property`                          | Title, permits, brochures                         |
| `PropertyDocumentVerification` | Root Entity                 | Authenticity review for property documents   | `PropertyDocument`                  | Separate from address and identity verification   |
| `PropertyDuplicateCandidate`   | Derived / Read Model        | Duplicate detection cluster or review signal | derived from `Property`             | Supports canonical merge and moderation workflows |
| `PropertyFeature`              | Root Entity or Value Object | Structured physical features                 | `Property`                          | Beds, baths, parking, size                        |
| `PropertyAmenity`              | Root Entity or Join Entity  | Amenities                                    | `Property`                          | Pool, gym, solar, waterfront                      |
| `DevelopmentProject`           | Root Entity                 | Developer project umbrella                   | `Organization`                      | Estates, towers, phases                           |
| `ProjectPhase`                 | Root Entity                 | Project lifecycle phase                      | `DevelopmentProject`                | Launch, construction, completed                   |
| `PropertyUnit`                 | Root Entity                 | Unit inside project/property                 | `DevelopmentProject` or `Property`  | Apartments, suites, lots                          |
| `InventoryUnit`                | Root Entity                 | Sellable stock record                        | `PropertyUnit`                      | Availability and commercial state                 |

### Core constraints

- a `Property` should always have a canonical owner relation
- `PropertyOwnership(propertyId, ownerId, ownerType)` should be unique per active owner assignment
- `PropertyMedia.sortOrder` should be unique within `propertyId`
- `PropertyDocumentVerification(propertyDocumentId, isCurrent)` should allow at most one current active verification
- `PropertyUnit(unitCode, projectId)` should be unique within project

### Core relationships

- one `Property` to many `PropertyMedia`
- one `Property` to many `PropertyDocument`
- one `Property` to many `PropertyOwnership`
- one `PropertyDocument` to many `PropertyDocumentVerification`
- one `DevelopmentProject` to many `ProjectPhase`
- one `DevelopmentProject` to many `PropertyUnit`
- one `PropertyUnit` to one or many `InventoryUnit`

---

## 2.5 Listing Domain

| Model                       | Category                    | Purpose                                     | Owner / Parent                     | Notes                                                            |
| --------------------------- | --------------------------- | ------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| `Listing`                   | Root Entity                 | Market offer for property or unit           | `Property` or `PropertyUnit`       | Separate commercial lifecycle                                    |
| `ListingVersion`            | Root Entity                 | Auditable listing revisions                 | `Listing`                          | Optional but recommended                                         |
| `ListingAssignment`         | Join Entity                 | Assigns participants to listing             | `Listing`, `User` / `Organization` | Agent, creator, manager, agency                                  |
| `ListingPrice`              | Root Entity or Value Object | Pricing state                               | `Listing`                          | Ask, rent, fees, deposit                                         |
| `ListingSuitabilityProfile` | Root Entity                 | Positive suitability and discovery signals  | `Listing`                          | Student-friendly, couple-friendly, working-professional-friendly |
| `ListingEligibilityPolicy`  | Root Entity                 | Explicit restrictive policy or tenancy rule | `Listing`                          | Sensitive and reviewable where required                          |
| `ListingOccupancyProfile`   | Root Entity                 | Occupancy arrangement and co-living context | `Listing`                          | Room-only, entire-unit, landlord-on-site, shared occupancy       |
| `ListingPaymentTerms`       | Root Entity                 | Commercial payment structure                | `Listing`                          | Upfront periods, deposits, installments, off-plan schedules      |
| `ListingPromotion`          | Root Entity                 | Boost and promotion settings                | `Listing`                          | Paid boosts, featured placements                                 |
| `ListingAvailability`       | Root Entity                 | Commercial availability                     | `Listing`                          | Active, booked, reserved                                         |
| `ListingShareProgram`       | Root Entity                 | Creator/affiliate commission program        | `Listing`                          | Share-and-earn rules                                             |
| `ListingMetrics`            | Derived / Read Model        | Aggregated listing metrics                  | `Listing`                          | Views, saves, lead stats                                         |
| `ListingTag`                | Root Entity or Join Entity  | Editorial tag                               | `Listing`                          | Luxury, waterfront, urgent                                       |
| `ListingCollection`         | Root Entity                 | Curated listing set                         | `Organization` or `User`           | Campaigns and collections                                        |

### Core constraints

- only one active primary listing should exist for the same property and commercial context unless multi-channel behavior is intended
- `ListingAssignment(listingId, actorId, actorType, role)` should be unique per active assignment
- one active `ListingOccupancyProfile` should exist per listing
- one active `ListingPaymentTerms` should exist per listing
- one active `ListingSuitabilityProfile` should exist per listing
- boosts and promotion windows must not overlap unintentionally for the same paid slot

### Core relationships

- one `Property` to many `Listing`
- one `PropertyUnit` to many `Listing`
- one `Listing` to many `ListingAssignment`
- one `Listing` to many `ListingVersion`
- one `Listing` to zero or one active `ListingSuitabilityProfile`
- one `Listing` to zero or one active `ListingEligibilityPolicy`
- one `Listing` to zero or one active `ListingOccupancyProfile`
- one `Listing` to zero or one active `ListingPaymentTerms`
- one `Listing` to many `ListingPromotion`
- one `Listing` to zero or one active `ListingShareProgram`

---

## 2.6 Product Commerce Domain

| Model              | Category                    | Purpose                     | Owner / Parent                | Notes                            |
| ------------------ | --------------------------- | --------------------------- | ----------------------------- | -------------------------------- |
| `Product`          | Root Entity                 | Sellable non-property item  | none                          | Furniture, materials, appliances |
| `ProductCategory`  | Root Entity                 | Product classification      | none                          | Furniture, lighting, tiles       |
| `ProductVariant`   | Root Entity                 | SKU-level variant           | `Product`                     | Color, finish, size              |
| `ProductMedia`     | Root Entity                 | Product media               | `Product`                     | Images and videos                |
| `ProductInventory` | Root Entity                 | Stock state                 | `ProductVariant`              | Optional per location            |
| `ProductPrice`     | Root Entity or Value Object | Commercial pricing          | `Product` or `ProductVariant` | Retail, promo, bundle            |
| `Brand`            | Root Entity                 | Brand/manufacturer identity | none                          | Reusable commerce brand          |
| `Supplier`         | Root Entity                 | Seller/supplier actor       | `Organization`                | Often backed by organization     |
| `ProductAttribute` | Root Entity or Value Object | Flexible product specs      | `Product` / `Variant`         | Material, finish, weight         |
| `ProductBundle`    | Root Entity                 | Grouped offer               | `Organization`                | Furniture kits, finishing packs  |
| `ProductReview`    | Root Entity                 | User review                 | `Product`                     | Optional in later phase          |

### Core constraints

- `Product.slug` should be unique if public-facing
- `ProductVariant(sku)` should be globally unique if SKU exists
- `ProductInventory(productVariantId, locationId)` should be unique per stock location

---

## 2.7 Social, Feed, And Content Domain

| Model          | Category             | Purpose                         | Owner / Parent                    | Notes                               |
| -------------- | -------------------- | ------------------------------- | --------------------------------- | ----------------------------------- |
| `ContentPost`  | Root Entity          | Canonical social/content object | `User` or `Organization`          | Feed-first content unit             |
| `ContentMedia` | Root Entity          | Media for content               | `ContentPost`                     | Images, videos, live clips          |
| `FeedItem`     | Derived / Read Model | Surface projection for feed     | derived                           | Could be persisted cache            |
| `Comment`      | Root Entity          | Discussion object               | `ContentPost` or entity target    | Threadable                          |
| `Reaction`     | Join Entity          | Like/reaction relation          | `User`, target entity             | May support multiple reaction kinds |
| `Save`         | Join Entity          | Save/bookmark relation          | `User`, target entity             | User-specific interest              |
| `Share`        | Root Entity          | Trackable share action          | `User`, target entity             | Supports attribution                |
| `Follow`       | Join Entity          | Follow relation                 | `User`, target entity             | User follows user/org/creator       |
| `Hashtag`      | Root Entity          | Hashtag vocabulary              | none                              | Optional normalization              |
| `Mention`      | Join Entity          | Mention relation                | `ContentPost`, target entity      | User or organization mention        |
| `Campaign`     | Root Entity          | Marketing campaign              | `Organization`                    | Ties posts, creators, listings      |
| `ReferralLink` | Root Entity          | Share/attribution link          | `Listing`, `CreatorProfile`, etc. | Creator and campaign attribution    |

### Core constraints

- `Reaction(userId, targetId, targetType, kind)` should be unique
- `Save(userId, targetId, targetType)` should be unique
- `Follow(followerId, targetId, targetType)` should be unique
- `ReferralLink.code` should be unique

---

## 2.8 Live Domain

| Model                  | Category    | Purpose                              | Owner / Parent                        | Notes                                 |
| ---------------------- | ----------- | ------------------------------------ | ------------------------------------- | ------------------------------------- |
| `LiveSession`          | Root Entity | Live event / sales session           | `User` or `Organization`              | First-class commerce and content unit |
| `LiveSchedule`         | Root Entity | Planned timing metadata              | `LiveSession`                         | Scheduled and recurring logic         |
| `LiveHost`             | Join Entity | Host assignment                      | `LiveSession`, `User`                 | Can support organizations later       |
| `LiveCoHost`           | Join Entity | Co-host assignment                   | `LiveSession`, `User`                 | Many possible                         |
| `LiveListingSpotlight` | Join Entity | Featured listing/product during live | `LiveSession`, target entity          | Important for commerce                |
| `LiveViewerSession`    | Root Entity | Viewer attendance record             | `LiveSession`, `User` / guest session | Needed for live analytics             |
| `LiveChatMessage`      | Root Entity | Live chat message                    | `LiveSession`, sender                 | Real-time messaging                   |
| `LiveReaction`         | Root Entity | Real-time reaction stream            | `LiveSession`, sender                 | Hearts, emojis, etc.                  |
| `LiveQuestion`         | Root Entity | Audience Q&A                         | `LiveSession`, sender                 | May be moderated                      |
| `LivePoll`             | Root Entity | Poll object                          | `LiveSession`                         | Optional later phase                  |
| `LiveOffer`            | Root Entity | Time-bound commercial offer          | `LiveSession`                         | Pinned offers and urgency             |
| `LiveGift`             | Root Entity | Ripple gift during live              | `LiveSession`, sender, receiver       | Revenue-critical                      |
| `LiveReplay`           | Root Entity | Replay artifact                      | `LiveSession`                         | Playback and discovery                |
| `LiveConversionEvent`  | Root Entity | Purchase/inquiry linked to live      | `LiveSession`, entity                 | Ties live to revenue                  |

### Core constraints

- a `LiveSession` must have at least one active host
- `LiveViewerSession(sessionId, viewerId or guestSessionId)` should be unique per attendance session
- `LiveGift` must always reference a ledger-backed payment or wallet movement

---

## 2.9 Creator Economy Domain

| Model                   | Category             | Purpose                                     | Owner / Parent                                | Notes                             |
| ----------------------- | -------------------- | ------------------------------------------- | --------------------------------------------- | --------------------------------- |
| `CreatorProfile`        | Root Entity          | Creator-facing persona/profile              | `User`                                        | Optional persona layer            |
| `CreatorProgram`        | Root Entity          | Enrollment into creator monetization        | `CreatorProfile`                              | Enables payout and policy gating  |
| `PromotionAssignment`   | Join Entity          | Creator assigned to promote target          | `CreatorProfile`, target                      | Listing/product/campaign          |
| `ReferralAttribution`   | Root Entity          | Attribution chain for engagement/conversion | target flow                                   | Commerce-critical                 |
| `CommissionRule`        | Root Entity          | Earning formula                             | `Campaign` / `ListingShareProgram` / platform | Percentage or fixed               |
| `CommissionLedgerEntry` | Root Entity          | Earned commission record                    | `CreatorProfile`, `Transaction`               | Must be auditable                 |
| `CreatorMetrics`        | Derived / Read Model | Aggregated creator performance              | `CreatorProfile`                              | Followers, conversion, engagement |
| `CreatorReputation`     | Derived / Read Model | Trust and quality score                     | `CreatorProfile`                              | Anti-fraud and trust weighting    |

### Core constraints

- `CreatorProfile(userId)` should be unique
- `PromotionAssignment(creatorProfileId, targetId, targetType)` should be unique per active program context
- `CommissionLedgerEntry(sourceId, sourceType, beneficiaryId)` should be idempotent-safe

---

## 2.10 Wallet, Ripple, Payment, And Transaction Domain

| Model              | Category    | Purpose                              | Owner / Parent                   | Notes                               |
| ------------------ | ----------- | ------------------------------------ | -------------------------------- | ----------------------------------- |
| `Wallet`           | Root Entity | Wallet owned by user or organization | `User` or `Organization`         | Top-level account container         |
| `WalletAccount`    | Root Entity | Currency-specific wallet account     | `Wallet`                         | Supports `RIPPLE` and possibly fiat |
| `LedgerEntry`      | Root Entity | Immutable financial entry            | `WalletAccount`                  | Foundation of financial correctness |
| `RippleTransfer`   | Root Entity | User-to-user Ripple movement         | wallet entities                  | Peer transfer                       |
| `GiftTransaction`  | Root Entity | Gift event                           | sender, receiver, wallet entries | Especially live and creator gifting |
| `RippleReward`     | Root Entity | Reward credit                        | `User` / `CreatorProfile`        | Growth incentives and earnings      |
| `RippleSpend`      | Root Entity | Spend record                         | wallet entities                  | Boosts, purchases, live support     |
| `PaymentMethod`    | Root Entity | Funding method                       | `User` / `Organization`          | Card, bank, etc.                    |
| `Payment`          | Root Entity | Payment attempt/result               | `Transaction` or wallet funding  | External or internal settlement     |
| `EscrowAccount`    | Root Entity | Held funds for transaction           | `Transaction`                    | Controlled release                  |
| `EscrowMilestone`  | Root Entity | Release condition                    | `EscrowAccount`                  | Multi-step release                  |
| `Transaction`      | Root Entity | Business transaction root            | none                             | Property, product, service, booking |
| `TransactionItem`  | Join Entity | Target items in transaction          | `Transaction`, target entity     | Listing, unit, product, service     |
| `TransactionParty` | Join Entity | Participants in transaction          | `Transaction`, actor             | Buyer, seller, agent, creator       |
| `Payout`           | Root Entity | External payout request/result       | `Wallet` or beneficiary          | Creator and seller withdrawals      |
| `Settlement`       | Root Entity | Allocation result                    | `Transaction`                    | Distribution to parties             |
| `Refund`           | Root Entity | Reversal / refund                    | `Payment`                        | Full or partial                     |
| `Dispute`          | Root Entity | Escalation record                    | `Transaction` / `EscrowAccount`  | Trust and compliance                |

### Core constraints

- one owner should have at most one primary `Wallet` per scope
- `WalletAccount(walletId, currencyCode)` must be unique
- `LedgerEntry` must be immutable after posting
- `TransactionParty(transactionId, actorId, actorType, role)` should be unique
- `EscrowAccount(transactionId)` should be unique when escrow is required

### Financial design rule

`Ripple` must never be represented only as:

- `user.balance`
- `creator.points`

It must be derivable from ledger entries or safely denormalized from them.

---

## 2.11 Trending, Recommendation, And Analytics Domain

| Model                   | Category                     | Purpose                           | Owner / Parent               | Notes                                |
| ----------------------- | ---------------------------- | --------------------------------- | ---------------------------- | ------------------------------------ |
| `BehaviorEvent`         | Root Entity                  | Canonical behavioral event stream | actor / session              | Foundation of trending and analytics |
| `FeedImpression`        | Root Entity                  | Feed delivery event               | user/session + target entity | Exposure logging                     |
| `ContentInteraction`    | Derived / Read Model or Root | Normalized interaction projection | target entity                | May stay derived or be persisted     |
| `TrendSignal`           | Derived / Read Model         | Rolling signal aggregate          | entity + window              | 5m, 1h, 24h, 7d                      |
| `TrendingSnapshot`      | Derived / Read Model         | Ranked cached surface output      | context + time window        | Homepage/feed/search                 |
| `LiveTrendMetrics`      | Derived / Read Model         | Live-specific trend metrics       | `LiveSession`                | Viewer growth, watch time, gifts     |
| `CreatorTrendMetrics`   | Derived / Read Model         | Creator-specific trend metrics    | `CreatorProfile`             | Follower velocity, conversion        |
| `RecommendationProfile` | Root Entity or Derived       | Personalization state             | `User`                       | Feature vector / preference state    |
| `PreferenceSignal`      | Root Entity                  | Explicit or implicit preference   | `User`                       | Search, save, view, purchase         |
| `SavedSearch`           | Root Entity                  | Saved search preference           | `User`                       | Alertable query                      |
| `AlertSubscription`     | Root Entity                  | Notification subscription         | `User`                       | Triggered on updates                 |

### Core constraints

- `TrendSignal(entityType, entityId, window, computedAtBucket)` should be unique
- `TrendingSnapshot(surface, segment, window, generatedAtBucket)` should be unique
- `FeedImpression(user/session, surface, target)` must be deduplicated enough to avoid inflation

### Trendable entity set

The system should support trending for:

- `Listing`
- `Property`
- `ContentPost`
- `LiveSession`
- `CreatorProfile`
- `Product`

---

## 2.12 Trust, Compliance, And Moderation Domain

| Model              | Category    | Purpose                        | Owner / Parent          | Notes                            |
| ------------------ | ----------- | ------------------------------ | ----------------------- | -------------------------------- |
| `KycProfile`       | Root Entity | Individual identity compliance | `User`                  | Wallet and payout gating         |
| `KybProfile`       | Root Entity | Business compliance            | `Organization`          | Enterprise onboarding            |
| `IdentityDocument` | Root Entity | Uploaded identity docs         | `KycProfile`            | Passport, ID, etc.               |
| `BusinessDocument` | Root Entity | Uploaded org docs              | `KybProfile`            | CAC/incorporation/tax docs       |
| `License`          | Root Entity | Professional license           | `User` / `Organization` | Agent, broker, developer permits |
| `OwnershipProof`   | Root Entity | Property ownership evidence    | `PropertyOwnership`     | Important for trust              |
| `ModerationCase`   | Root Entity | Moderation workflow            | target entity           | Content, listing, user, live     |
| `FraudSignal`      | Root Entity | Risk or abuse signal           | target entity           | Device, wallet, user, listing    |
| `AuditLog`         | Root Entity | Immutable action audit         | any critical domain     | Admin and finance support        |

---

## 2.13 CRM, Messaging, And Conversion Domain

| Model                | Category    | Purpose                       | Owner / Parent              | Notes                          |
| -------------------- | ----------- | ----------------------------- | --------------------------- | ------------------------------ |
| `Lead`               | Root Entity | Qualified or raw prospect     | listing/product/live source | Core commercial object         |
| `Inquiry`            | Root Entity | Contact or interest event     | target entity               | May become lead                |
| `ViewingAppointment` | Root Entity | Property viewing booking      | `Listing` / `Property`      | Time-based scheduling          |
| `Conversation`       | Root Entity | Messaging thread              | participants                | Could be listing-anchored      |
| `Message`            | Root Entity | Message in thread             | `Conversation`              | Text/media/system              |
| `Deal`               | Root Entity | Pipeline / negotiation record | `Lead` / `Transaction`      | Sales workflow                 |
| `PipelineStage`      | Root Entity | Stage taxonomy                | `Organization` or platform  | Qualified, negotiating, closed |
| `Task`               | Root Entity | Follow-up task                | user/org owner              | CRM workflow                   |
| `Reminder`           | Root Entity | Timed reminder                | task/conversation/lead      | Optional scheduling            |
| `Note`               | Root Entity | Internal note                 | lead/deal/listing           | Agent and team support         |

---

## 2.14 Notifications

| Model                    | Category    | Purpose                       | Owner / Parent | Notes                         |
| ------------------------ | ----------- | ----------------------------- | -------------- | ----------------------------- |
| `Notification`           | Root Entity | User-facing notification      | `User`         | In-app and delivery source    |
| `NotificationPreference` | Root Entity | Channel and event preferences | `User`         | Email, push, SMS, in-app      |
| `DeliveryAttempt`        | Root Entity | Delivery outcome              | `Notification` | Email/push transport record   |
| `NotificationTemplate`   | Root Entity | Reusable template             | platform       | Localized and typed templates |

---

## 3. Enum And Status Inventory

These should be explicit and centralized where possible.

### Identity / Access

- `UserStatus`
- `RoleScope`
- `VerificationStatus`
- `MembershipStatus`
- `AddressAssignmentRole`
- `AddressVerificationStatus`

### Property / Listing

- `PropertyStatus`
- `ListingStatus`
- `ListingAssignmentRole`
- `PropertyOwnershipRole`
- `PropertyDocumentVerificationStatus`
- `ListingOccupancyModel`
- `ListingSuitabilityTag`
- `PaymentCadence`
- `PaymentPlanType`
- `ListingCompletionState`

### Product

- `ProductStatus`
- `InventoryStatus`

### Content / Social

- `ContentType`
- `ReactionType`
- `CommentStatus`

### Live

- `LiveSessionStatus`
- `LiveOfferStatus`
- `LiveGiftStatus`

### Finance

- `CurrencyCode`
- `WalletStatus`
- `LedgerEntryType`
- `PaymentStatus`
- `EscrowStatus`
- `TransactionStatus`
- `PayoutStatus`
- `RefundStatus`
- `DisputeStatus`

### Analytics

- `TrendWindow`
- `TrendEntityType`
- `EventType`

---

## 4. Value Object Inventory

These should usually be embedded or standardized reusable structures.

- `Money`
- `GeoPoint`
- `AddressParts`
- `MediaReference`
- `TimeRange`
- `ContactInfo`
- `AttributionContext`
- `RankingScoreBreakdown`

---

## 5. Launch Priority Matrix

## Phase 1 — Must Exist

- `User`
- `AuthIdentity`
- `Session`
- `Organization`
- `OrganizationMembership`
- `Property`
- `PropertyMedia`
- `Listing`
- `ListingAssignment`
- `ContentPost`
- `Reaction`
- `Save`
- `Share`
- `Lead`
- `Inquiry`
- `BehaviorEvent`
- `FeedImpression`
- `TrendSignal`
- `Wallet`
- `WalletAccount`
- `LedgerEntry`
- `RippleReward`
- `RippleSpend`
- `Payment`
- `Transaction`

## Phase 2 — Strongly Recommended

- `DevelopmentProject`
- `PropertyUnit`
- `CreatorProfile`
- `PromotionAssignment`
- `ReferralAttribution`
- `LiveSession`
- `LiveViewerSession`
- `LiveChatMessage`
- `LiveGift`
- `EscrowAccount`
- `EscrowMilestone`
- `Payout`
- `CommissionRule`
- `CommissionLedgerEntry`

## Phase 3 — Expansion

- `Product`
- `ProductVariant`
- `Supplier`
- `Campaign`
- `Deal`
- `PipelineStage`
- `SavedSearch`
- `Notification`
- `ModerationCase`
- `FraudSignal`

---

## 6. Locked Design Decisions

The following decisions are now considered resolved for the next design phase:

1. `Verification` should be split where compliance behavior differs materially.
2. `Address` should be lightly normalized as a root entity.
3. `AddressAssignment` should be a polymorphic join.
4. `AddressVerification` should be a separate root entity.
5. `ContentPost` references should follow a polymorphic-or-hybrid strategy.
6. `LedgerEntry` should be strongly typed and non-polymorphic.
7. `LiveSession` should remain a first-class root entity.
8. `CreatorProfile` should be an opt-in one-to-one root tied to `User`.
9. `CommissionRule` should remain a separate normalized root.

## 7. Relationship Decisions Still To Finalize

These decisions should be made before schema implementation:

1. Should `ContentPost` references be fully polymorphic or hybrid with explicit
   nullable foreign keys for the highest-value targets?
2. Should `LedgerEntry` be fully double-entry or single-account with balanced
   transfer records in the first version?
3. Should `LiveSession` support both user hosts and organization hosts directly,
   or always through user hosts acting on behalf of organizations?
4. Should `ListingShareProgram` and `CommissionRule` be separate or merged?

---

## 8. Next Implementation Step

After this matrix, the next design artifact should define:

1. exact cardinalities
2. unique indexes
3. delete behavior
4. lifecycle transition rules
5. whether each derived model is materialized or computed on demand
