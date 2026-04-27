# Ripples — Phase 1 Prisma Schema Draft

> Draft schema design translating the accepted domain decisions into Prisma
> model and enum shapes. This is not yet the migration file. It is the
> implementation blueprint for the next schema pass.

---

## 1. Purpose

This document bridges:

- [SRS](/Users/juliusossim/Documents/ripples/docs/ripples-srs.md)
- [ERD Blueprint](/Users/juliusossim/Documents/ripples/docs/ripples-erd.md)
- [Domain Matrix](/Users/juliusossim/Documents/ripples/docs/ripples-domain-matrix.md)
- [Relationship And Constraints Spec](/Users/juliusossim/Documents/ripples/docs/ripples-relationship-constraints-spec.md)

into a Prisma-oriented Phase 1 schema plan.

This draft answers:

1. which models belong in the first real schema expansion
2. which enums are needed
3. how the current tables should evolve toward the canonical model language
4. what Prisma model shapes should look like before migration work starts

---

## 2. Current Schema Assessment

Current schema strengths:

- authentication foundation exists
- property listing/media basics exist
- event tracking foundation exists

Current schema limitations:

- `PropertyListing` currently conflates `Property` and `Listing`
- no organization layer
- no address model
- no role/permission graph
- no content/social layer
- no wallet/Ripple layer
- no transaction roots
- no creator profile layer

Current models:

- `AuthUser`
- `AuthAccount`
- `AuthSession`
- `OAuthState`
- `PropertyListing`
- `PropertyMedia`
- `PlatformEvent`

Recommended convergence:

| Current           | Canonical Direction               |
| ----------------- | --------------------------------- |
| `AuthUser`        | `User`                            |
| `AuthAccount`     | `AuthIdentity`                    |
| `AuthSession`     | `Session`                         |
| `PropertyListing` | split into `Property` + `Listing` |
| `PlatformEvent`   | evolve into `BehaviorEvent`       |

---

## 3. Phase 1 Schema Scope

## 3.1 Include In Phase 1

- identity and auth roots
- organization and membership roots
- address, assignment, and verification
- property and listing split
- property media
- creator profile
- content/social foundation
- event/impression/trend foundation
- wallet and ledger foundation
- transaction and payment foundation

## 3.2 Defer To Later Phases

- project/unit inventory depth
- full CRM pipeline
- advanced moderation
- supplier/product marketplace depth
- live session full richness
- escrow milestones
- advanced creator campaign objects

These can remain Phase 2+ even if enums are reserved now.

---

## 4. Naming Direction

Recommended naming rules:

- use canonical names, not auth-prefixed or feature-prefixed names
- use nouns for roots
- use explicit join table names
- use singular Prisma model names
- prefer status enums over ad hoc strings

Examples:

- `User`, not `AuthUser`
- `AuthIdentity`, not `AuthAccount`
- `Session`, not `AuthSession`
- `BehaviorEvent`, not `PlatformEvent`
- `ListingAssignment`, not `AssignedListingActor`

---

## 5. Enum Inventory

These are the recommended Phase 1 enums.

```prisma
enum AuthProvider {
  manual
  google
}

enum UserSystemRole {
  user
  admin
}

enum OrganizationType {
  agency
  developer
  owner_company
  shop
  supplier
  brand
}

enum MembershipStatus {
  invited
  active
  suspended
  removed
}

enum OrganizationMembershipRole {
  owner
  admin
  manager
  agent
  creator
  member
}

enum VerificationStatus {
  pending
  in_review
  verified
  rejected
  expired
}

enum AddressAssignmentSubjectType {
  property
  organization
  user_profile
  creator_profile
}

enum AddressAssignmentRole {
  property_location
  registered_address
  operating_address
  billing_address
  shipping_origin
  pickup_address
  profile_address
  service_base
}

enum MediaType {
  image
  video
}

enum PropertyStatus {
  draft
  active
  archived
}

enum PropertyOwnershipRole {
  owner
  co_owner
  manager
}

enum ListingStatus {
  draft
  review
  active
  paused
  under_offer
  sold
  archived
}

enum ListingAssignmentActorType {
  user
  organization
}

enum ListingAssignmentRole {
  owner
  agent
  creator
  agency
  manager
}

enum ContentPostType {
  listing
  campaign
  creator_post
  market_update
}

enum ReactionType {
  like
  love
  wow
  fire
  interested
}

enum TrendWindow {
  m5
  h1
  h24
  d7
}

enum TrendEntityType {
  listing
  property
  content_post
  creator_profile
  product
  live_session
}

enum CurrencyCode {
  NGN
  USD
  GHS
  KES
  ZAR
  GBP
  EUR
  RIPPLE
}

enum PropertyDocumentVerificationStatus {
  pending
  in_review
  verified
  rejected
  expired
}

enum ListingOccupancyModel {
  entire_unit
  room_only
  shared_unit
  landlord_on_site
}

enum ListingSuitabilityTag {
  student_friendly
  couple_friendly
  working_professional_friendly
  family_friendly
}

enum PaymentCadence {
  one_time
  monthly
  quarterly
  biannual
  yearly
  milestone
}

enum PaymentPlanType {
  upfront_only
  installments_allowed
}

enum ListingCompletionState {
  ready_built
  off_plan
  under_construction
}

enum WalletOwnerType {
  user
  organization
}

enum WalletStatus {
  active
  suspended
  closed
}

enum LedgerEntryType {
  reward_credit
  spend_debit
  transfer_in
  transfer_out
  payment_in
  payment_out
  adjustment
}

enum TransactionStatus {
  initiated
  pending_payment
  funded
  completed
  cancelled
  disputed
}

enum TransactionPartyRole {
  buyer
  seller
  agent
  creator
  agency
  platform
}

enum PaymentStatus {
  pending
  succeeded
  failed
  cancelled
  refunded
}

enum EventType {
  view_property
  like_property
  save_property
  share_property
  click_ripple
  contact_seller
  start_transaction
  complete_transaction
}
```

### Enum design notes

- `ReactionType` should stay controlled rather than open-ended, but it should
  be broader than a single `like` so feed and creator engagement can express
  stronger social intent.
- `CurrencyCode` should remain a backend and schema concern, not a frontend
  formatting concern, because pricing, ledgers, payments, wallets, escrow, and
  settlement all depend on it. This enum can later evolve into a normalized
  `Currency` root if regional coverage expands materially.

---

## 6. Phase 1 Model Drafts

## 6.1 Identity And Access

```prisma
model User {
  id            String         @id @default(uuid()) @db.Uuid
  email         String         @unique @db.VarChar(254)
  fullName      String         @db.VarChar(120)
  avatarUrl     String?        @db.VarChar(2048)
  systemRoles   UserSystemRole[] @default([user])
  emailVerified Boolean        @default(false)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  identities    AuthIdentity[]
  sessions      Session[]
  profile       UserProfile?
  creatorProfile CreatorProfile?
  memberships   OrganizationMembership[]
  userRoles     UserRoleMap[]
  wallets       Wallet[]
}

model AuthIdentity {
  id             String       @id @default(uuid()) @db.Uuid
  userId         String       @db.Uuid
  provider       AuthProvider
  providerUserId String       @db.VarChar(255)
  passwordHash   String?
  passwordSalt   String?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerUserId])
  @@index([userId])
}

model Session {
  id               String    @id @default(uuid()) @db.Uuid
  userId           String    @db.Uuid
  refreshTokenHash String    @unique
  expiresAt        DateTime
  revokedAt        DateTime?
  createdAt        DateTime  @default(now())

  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}

model UserProfile {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String   @unique @db.Uuid
  bio         String?  @db.VarChar(1000)
  headline    String?  @db.VarChar(160)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 6.2 Authorization

```prisma
model Role {
  id          String            @id @default(uuid()) @db.Uuid
  key         String            @unique @db.VarChar(80)
  label       String            @db.VarChar(120)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  userRoles   UserRoleMap[]
  permissions RolePermissionMap[]
}

model Permission {
  id          String              @id @default(uuid()) @db.Uuid
  key         String              @unique @db.VarChar(120)
  label       String              @db.VarChar(160)
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  roles       RolePermissionMap[]
}

model UserRoleMap {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String   @db.Uuid
  roleId      String   @db.Uuid
  scope       String?  @db.VarChar(80)
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role        Role     @relation(fields: [roleId], references: [id], onDelete: Restrict)

  @@unique([userId, roleId, scope])
}

model RolePermissionMap {
  id            String      @id @default(uuid()) @db.Uuid
  roleId        String      @db.Uuid
  permissionId  String      @db.Uuid
  createdAt     DateTime    @default(now())

  role          Role        @relation(fields: [roleId], references: [id], onDelete: Restrict)
  permission    Permission  @relation(fields: [permissionId], references: [id], onDelete: Restrict)

  @@unique([roleId, permissionId])
}
```

## 6.3 Organization

```prisma
model Organization {
  id            String                   @id @default(uuid()) @db.Uuid
  type          OrganizationType
  name          String                   @db.VarChar(160)
  slug          String                   @unique @db.VarChar(160)
  createdAt     DateTime                 @default(now())
  updatedAt     DateTime                 @updatedAt

  profile       OrganizationProfile?
  memberships   OrganizationMembership[]
  serviceZones  ServiceZone[]
  wallets       Wallet[]
}

model OrganizationProfile {
  id             String         @id @default(uuid()) @db.Uuid
  organizationId String         @unique @db.Uuid
  description    String?        @db.VarChar(2000)
  logoUrl        String?        @db.VarChar(2048)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  organization   Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model OrganizationMembership {
  id             String                    @id @default(uuid()) @db.Uuid
  organizationId String                    @db.Uuid
  userId         String                    @db.Uuid
  role           OrganizationMembershipRole
  status         MembershipStatus          @default(active)
  createdAt      DateTime                  @default(now())

  organization   Organization              @relation(fields: [organizationId], references: [id], onDelete: Restrict)
  user           User                      @relation(fields: [userId], references: [id], onDelete: Restrict)

  @@unique([organizationId, userId])
  @@index([userId, status])
}
```

## 6.4 Address And Zones

```prisma
model Address {
  id            String               @id @default(uuid()) @db.Uuid
  line1         String               @db.VarChar(180)
  line2         String?              @db.VarChar(180)
  city          String               @db.VarChar(120)
  region        String?              @db.VarChar(120)
  postalCode    String?              @db.VarChar(40)
  country       String               @db.VarChar(120)
  latitude      Float?
  longitude     Float?
  formatted     String?              @db.VarChar(500)
  landmark      String?              @db.VarChar(200)
  createdAt     DateTime             @default(now())
  updatedAt     DateTime             @updatedAt

  assignments   AddressAssignment[]
  verifications AddressVerification[]
}

model AddressAssignment {
  id            String                       @id @default(uuid()) @db.Uuid
  addressId     String                       @db.Uuid
  subjectType   AddressAssignmentSubjectType
  subjectId     String                       @db.Uuid
  role          AddressAssignmentRole
  isPrimary     Boolean                      @default(false)
  createdAt     DateTime                     @default(now())

  address       Address                      @relation(fields: [addressId], references: [id], onDelete: Restrict)

  @@unique([addressId, subjectType, subjectId, role])
  @@index([subjectType, subjectId, role])
}

model AddressVerification {
  id            String               @id @default(uuid()) @db.Uuid
  addressId     String               @db.Uuid
  status        VerificationStatus   @default(pending)
  provider      String?              @db.VarChar(120)
  notes         String?              @db.VarChar(1000)
  verifiedAt    DateTime?
  createdAt     DateTime             @default(now())

  address       Address              @relation(fields: [addressId], references: [id], onDelete: Restrict)

  @@index([addressId, status])
}

model ServiceZone {
  id             String         @id @default(uuid()) @db.Uuid
  organizationId String         @db.Uuid
  name           String         @db.VarChar(120)
  description    String?        @db.VarChar(500)
  geoJson        Json?
  active         Boolean        @default(true)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  organization   Organization   @relation(fields: [organizationId], references: [id], onDelete: Restrict)

  @@index([organizationId, active])
}
```

## 6.5 Property And Listing

```prisma
model Property {
  id            String            @id @default(uuid()) @db.Uuid
  title         String            @db.VarChar(160)
  description   String            @db.VarChar(5000)
  status        PropertyStatus    @default(active)
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  media         PropertyMedia[]
  documents     PropertyDocument[]
  ownerships    PropertyOwnership[]
  listings      Listing[]
}

model PropertyOwnership {
  id            String                @id @default(uuid()) @db.Uuid
  propertyId    String                @db.Uuid
  ownerType     WalletOwnerType
  ownerId       String                @db.Uuid
  role          PropertyOwnershipRole @default(owner)
  active        Boolean               @default(true)
  createdAt     DateTime              @default(now())

  property      Property              @relation(fields: [propertyId], references: [id], onDelete: Restrict)

  @@unique([propertyId, ownerType, ownerId, role, active])
  @@index([ownerType, ownerId])
}

model PropertyMedia {
  id            String      @id @default(uuid()) @db.Uuid
  propertyId    String      @db.Uuid
  url           String      @db.VarChar(2048)
  type          MediaType
  alt           String      @db.VarChar(240)
  sortOrder     Int
  createdAt     DateTime    @default(now())

  property      Property    @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@unique([propertyId, sortOrder])
}

model PropertyDocument {
  id            String      @id @default(uuid()) @db.Uuid
  propertyId    String      @db.Uuid
  kind          String      @db.VarChar(80)
  name          String      @db.VarChar(160)
  url           String      @db.VarChar(2048)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  property      Property    @relation(fields: [propertyId], references: [id], onDelete: Restrict)
  verifications PropertyDocumentVerification[]

  @@index([propertyId, kind])
}

model PropertyDocumentVerification {
  id                 String                             @id @default(uuid()) @db.Uuid
  propertyDocumentId String                             @db.Uuid
  status             PropertyDocumentVerificationStatus @default(pending)
  verifier           String?                            @db.VarChar(120)
  notes              String?                            @db.VarChar(1000)
  isCurrent          Boolean                            @default(true)
  verifiedAt         DateTime?
  createdAt          DateTime                           @default(now())

  propertyDocument   PropertyDocument                   @relation(fields: [propertyDocumentId], references: [id], onDelete: Restrict)

  @@index([propertyDocumentId, status])
  @@index([propertyDocumentId, isCurrent])
}

model Listing {
  id            String                    @id @default(uuid()) @db.Uuid
  propertyId    String                    @db.Uuid
  title         String                    @db.VarChar(160)
  description   String                    @db.VarChar(5000)
  priceAmount   Decimal                   @db.Decimal(18, 2)
  priceCurrency CurrencyCode
  status        ListingStatus             @default(active)
  createdAt     DateTime                  @default(now())
  updatedAt     DateTime                  @updatedAt

  property      Property                  @relation(fields: [propertyId], references: [id], onDelete: Restrict)
  assignments   ListingAssignment[]
  suitability   ListingSuitabilityProfile?
  eligibility   ListingEligibilityPolicy?
  occupancy     ListingOccupancyProfile?
  paymentTerms  ListingPaymentTerms?
}

model ListingAssignment {
  id            String                     @id @default(uuid()) @db.Uuid
  listingId     String                     @db.Uuid
  actorType     ListingAssignmentActorType
  actorId       String                     @db.Uuid
  role          ListingAssignmentRole
  active        Boolean                    @default(true)
  createdAt     DateTime                   @default(now())

  listing       Listing                    @relation(fields: [listingId], references: [id], onDelete: Restrict)

  @@unique([listingId, actorType, actorId, role, active])
  @@index([actorType, actorId])
}

model ListingSuitabilityProfile {
  id            String               @id @default(uuid()) @db.Uuid
  listingId     String               @unique @db.Uuid
  tags          ListingSuitabilityTag[]
  notes         String?              @db.VarChar(500)
  active        Boolean              @default(true)
  createdAt     DateTime             @default(now())
  updatedAt     DateTime             @updatedAt

  listing       Listing              @relation(fields: [listingId], references: [id], onDelete: Restrict)
}

model ListingEligibilityPolicy {
  id            String      @id @default(uuid()) @db.Uuid
  listingId     String      @unique @db.Uuid
  policyText    String      @db.VarChar(2000)
  reviewStatus  VerificationStatus @default(pending)
  active        Boolean     @default(true)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  listing       Listing     @relation(fields: [listingId], references: [id], onDelete: Restrict)
}

model ListingOccupancyProfile {
  id                String                @id @default(uuid()) @db.Uuid
  listingId         String                @unique @db.Uuid
  occupancyModel    ListingOccupancyModel
  landlordLivesOnSite Boolean             @default(false)
  active            Boolean               @default(true)
  createdAt         DateTime              @default(now())
  updatedAt         DateTime              @updatedAt

  listing           Listing               @relation(fields: [listingId], references: [id], onDelete: Restrict)
}

model ListingPaymentTerms {
  id                String                @id @default(uuid()) @db.Uuid
  listingId         String                @unique @db.Uuid
  completionState   ListingCompletionState
  planType          PaymentPlanType
  cadence           PaymentCadence
  minimumUpfrontCycles Int                @default(1)
  installmentCount  Int?
  depositAmount     Decimal?              @db.Decimal(18, 2)
  depositCurrency   CurrencyCode?
  notes             String?               @db.VarChar(1000)
  active            Boolean               @default(true)
  createdAt         DateTime              @default(now())
  updatedAt         DateTime              @updatedAt

  listing           Listing               @relation(fields: [listingId], references: [id], onDelete: Restrict)
}
```

### Design note

`ListingSuitabilityProfile` should be used for positive matching and discovery
signals such as `student_friendly` or `couple_friendly`.

Where a listing needs explicit restrictive tenancy rules, those should be
captured in `ListingEligibilityPolicy` and treated as reviewable policy data
rather than casual free-text merchandising.

`ListingOccupancyProfile` captures conditions such as landlord-on-site or
shared accommodation.

`ListingPaymentTerms` captures annual rent, installment availability, and
off-plan or already-built payment structures without polluting canonical
property truth.

### Duplicate property strategy

Phase 1 should keep one canonical `Property` and allow many `Listing`s to
reference it. Duplicate-property handling should be introduced through
deduplication jobs, review tooling, or future `PropertyDuplicateCandidate`
read-models rather than by overloading the `Listing` model itself.

## 6.6 Creator, Content, And Social

```prisma
model CreatorProfile {
  id            String      @id @default(uuid()) @db.Uuid
  userId        String      @unique @db.Uuid
  bio           String?     @db.VarChar(1000)
  active        Boolean     @default(true)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  user          User        @relation(fields: [userId], references: [id], onDelete: Restrict)
}

model ContentPost {
  id            String          @id @default(uuid()) @db.Uuid
  authorUserId  String?         @db.Uuid
  authorOrgId   String?         @db.Uuid
  type          ContentPostType
  title         String?         @db.VarChar(160)
  body          String?         @db.VarChar(5000)
  targetType    TrendEntityType?
  targetId      String?         @db.Uuid
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  media         ContentMedia[]
}

model ContentMedia {
  id            String      @id @default(uuid()) @db.Uuid
  contentPostId String      @db.Uuid
  url           String      @db.VarChar(2048)
  type          MediaType
  alt           String      @db.VarChar(240)
  sortOrder     Int

  contentPost   ContentPost @relation(fields: [contentPostId], references: [id], onDelete: Cascade)

  @@unique([contentPostId, sortOrder])
}

model Reaction {
  id            String        @id @default(uuid()) @db.Uuid
  userId        String        @db.Uuid
  targetType    TrendEntityType
  targetId      String        @db.Uuid
  kind          ReactionType
  createdAt     DateTime      @default(now())

  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, targetType, targetId, kind])
}

model Save {
  id            String        @id @default(uuid()) @db.Uuid
  userId        String        @db.Uuid
  targetType    TrendEntityType
  targetId      String        @db.Uuid
  createdAt     DateTime      @default(now())

  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, targetType, targetId])
}

model Share {
  id            String        @id @default(uuid()) @db.Uuid
  userId        String        @db.Uuid
  targetType    TrendEntityType
  targetId      String        @db.Uuid
  createdAt     DateTime      @default(now())

  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
}
```

## 6.7 Event, Impressions, And Trends

```prisma
model BehaviorEvent {
  id            String          @id @default(uuid()) @db.Uuid
  userId        String?         @db.Uuid
  sessionId     String          @db.VarChar(160)
  type          EventType
  entityType    TrendEntityType
  entityId      String          @db.Uuid
  metadata      Json
  createdAt     DateTime        @default(now())

  user          User?           @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([entityType, entityId, type])
  @@index([sessionId, createdAt])
}

model FeedImpression {
  id            String          @id @default(uuid()) @db.Uuid
  userId        String?         @db.Uuid
  sessionId     String          @db.VarChar(160)
  surface       String          @db.VarChar(80)
  entityType    TrendEntityType
  entityId      String          @db.Uuid
  createdAt     DateTime        @default(now())

  @@index([entityType, entityId, createdAt])
  @@index([surface, createdAt])
}

model TrendSignal {
  id            String          @id @default(uuid()) @db.Uuid
  entityType    TrendEntityType
  entityId      String          @db.Uuid
  window        TrendWindow
  bucketAt      DateTime
  views         Int             @default(0)
  saves         Int             @default(0)
  shares        Int             @default(0)
  score         Float           @default(0)
  createdAt     DateTime        @default(now())

  @@unique([entityType, entityId, window, bucketAt])
}
```

## 6.8 Wallet, Ripple, Transaction, And Payment

```prisma
model Wallet {
  id            String          @id @default(uuid()) @db.Uuid
  ownerType     WalletOwnerType
  ownerId       String          @db.Uuid
  scope         String          @db.VarChar(80)
  status        WalletStatus    @default(active)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  accounts      WalletAccount[]

  @@unique([ownerType, ownerId, scope])
}

model WalletAccount {
  id            String          @id @default(uuid()) @db.Uuid
  walletId      String          @db.Uuid
  currencyCode  CurrencyCode
  createdAt     DateTime        @default(now())

  wallet        Wallet          @relation(fields: [walletId], references: [id], onDelete: Restrict)
  entries       LedgerEntry[]

  @@unique([walletId, currencyCode])
}

model LedgerEntry {
  id            String          @id @default(uuid()) @db.Uuid
  walletAccountId String        @db.Uuid
  type          LedgerEntryType
  amount        Decimal         @db.Decimal(18, 2)
  referenceType String          @db.VarChar(80)
  referenceId   String          @db.Uuid
  createdAt     DateTime        @default(now())

  walletAccount WalletAccount   @relation(fields: [walletAccountId], references: [id], onDelete: Restrict)

  @@index([walletAccountId, createdAt])
  @@index([referenceType, referenceId])
}

model RippleReward {
  id            String          @id @default(uuid()) @db.Uuid
  beneficiaryUserId String?     @db.Uuid
  beneficiaryCreatorProfileId String? @db.Uuid
  amount        Decimal         @db.Decimal(18, 2)
  reason        String          @db.VarChar(120)
  ledgerEntryId String?         @unique @db.Uuid
  createdAt     DateTime        @default(now())
}

model RippleSpend {
  id            String          @id @default(uuid()) @db.Uuid
  spenderUserId String?         @db.Uuid
  amount        Decimal         @db.Decimal(18, 2)
  purpose       String          @db.VarChar(120)
  ledgerEntryId String?         @unique @db.Uuid
  createdAt     DateTime        @default(now())
}

model Transaction {
  id            String            @id @default(uuid()) @db.Uuid
  status        TransactionStatus @default(initiated)
  currencyCode  CurrencyCode
  totalAmount   Decimal           @db.Decimal(18, 2)
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  parties       TransactionParty[]
  payments      Payment[]
}

model TransactionParty {
  id            String               @id @default(uuid()) @db.Uuid
  transactionId String               @db.Uuid
  actorType     WalletOwnerType
  actorId       String               @db.Uuid
  role          TransactionPartyRole
  createdAt     DateTime             @default(now())

  transaction   Transaction          @relation(fields: [transactionId], references: [id], onDelete: Restrict)

  @@unique([transactionId, actorType, actorId, role])
}

model Payment {
  id            String          @id @default(uuid()) @db.Uuid
  transactionId String?         @db.Uuid
  status        PaymentStatus   @default(pending)
  amount        Decimal         @db.Decimal(18, 2)
  currencyCode  CurrencyCode
  provider      String?         @db.VarChar(80)
  providerRef   String?         @db.VarChar(160)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  transaction   Transaction?    @relation(fields: [transactionId], references: [id], onDelete: SetNull)

  @@index([transactionId])
  @@index([provider, providerRef])
}
```

---

## 7. Migration Strategy From Current Schema

Recommended sequence:

1. rename auth models conceptually in code before physical table rename if needed
2. introduce `Organization`, `UserProfile`, `Role`, `Permission`, and related joins
3. introduce `Address`, `AddressAssignment`, and `AddressVerification`
4. split `PropertyListing` into:
   - `Property`
   - `Listing`
   - migrate current media and price/location fields accordingly
5. rename `PlatformEvent` to `BehaviorEvent` or create a new model and migrate data
6. add wallet, ledger, and transaction foundations

Important note:

The `PropertyListing -> Property + Listing` split is the most important
structural change. The longer the current combined model persists, the more
expensive that split becomes.

---

## 8. Implementation Risks To Watch

- polymorphic joins require careful application-level integrity
- wallet and ledger design should not be rushed
- mixing `UserRole` enum usage with normalized `Role` models should be avoided;
  if `Role` table exists, rely on it for most authorization cases
- `ContentPost` target strategy should be decided before too many post variants
  are implemented

---

## 9. Next Step After This Draft

The next concrete engineering move should be:

1. choose final answers for the remaining four open decisions
2. convert this draft into a revised `apps/api/prisma/schema.prisma`
3. create staged migrations rather than one giant migration
4. update `@org/types` to mirror the settled schema vocabulary
