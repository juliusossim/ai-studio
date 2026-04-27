# Ripples — Media Platform Implementation Spec

> Production implementation spec for Ripples media storage, upload, processing,
> and delivery.
> This document complements the
> [Product Outcome Tracker](/Users/juliusossim/Documents/ripples/docs/ripples-product-outcome-tracker.md)
> and the
> [Web Routing Plan](/Users/juliusossim/Documents/ripples/docs/ripples-web-routing-plan.md)
> by defining the media architecture required for listings, catalog items,
> creator content, and future live-commerce surfaces.
> Concrete rollout steps live in the
> [Media Platform Execution Plan](/Users/juliusossim/Documents/ripples/docs/ripples-media-implementation-plan.md).

---

## 1. Purpose

Ripples is a media-first product. Listings, catalog items, creator posts, and
live surfaces all depend on reliable upload and delivery.

The current API stores uploaded files on the local server filesystem and returns
API-hosted URLs from [media.service.ts](/Users/juliusossim/Documents/ripples/apps/api/src/app/media/media.service.ts).
That is acceptable for local development, but it is not the production target.

This spec defines the production target:

- object storage for binary media
- relational storage for metadata and state
- direct client upload through short-lived signed URLs
- asynchronous verification and derivative generation
- CDN-backed delivery

Ripples will adopt this as a hard cutover, not a bridge-phase product flow.

---

## 2. Core Decisions

## 2.1 Canonical Decisions

- Ripples will not store original media binaries in the relational database.
- Ripples will not rely on API-local filesystem storage in production.
- The API will store metadata, lifecycle state, and permissions only.
- Clients will upload directly to object storage using short-lived signed URLs
  issued by the API.
- The API will finalize uploads and enqueue post-processing jobs.
- Public or semi-public reads will be served through a CDN or storage-backed
  delivery domain, not through the Nest API file server.

## 2.2 Provider Direction

Ripples should implement against an S3-compatible storage adapter boundary.

Recommended initial providers:

- `AWS S3`
  Safest industry-default path and best ecosystem depth
- `Cloudflare R2`
  Good fit if egress economics and CDN proximity matter more

The application should depend on a `StorageAdapter` contract so the provider can
change without rewriting the media domain.

## 2.3 First Production Scope

The first production slice should support:

- image upload for listings and catalog items
- short-lived single-part signed uploads
- DB metadata records
- upload finalization
- async inspection and thumbnail generation
- eventual moderation hook

Video support should be a second phase once the processing pipeline exists.

---

## 3. Non-Goals

The first production media platform does not need to include:

- advanced video transcoding
- live stream ingest
- drag-and-drop multipart resumable uploads for every file size
- public anonymous write uploads
- user-managed object keys

Those can be added later without changing the core architecture.

---

## 4. Production Architecture

```text
web/mobile client
  -> API upload intent request
  -> signed upload URL / upload session
  -> direct upload to object storage
  -> API completion call
  -> background processing
  -> metadata/state updates
  -> CDN-backed read URLs
```

### 4.1 Layers

- `apps/api`
  Auth, authorization, upload intent validation, signed URL issuance,
  upload completion, metadata lifecycle, processing orchestration
- `shared/types`
  Media contracts, upload session contracts, asset state contracts
- object storage
  Original files and generated derivatives
- worker/queue layer
  Signature verification, moderation, thumbnail generation, video processing
- CDN / asset domain
  Delivery for public-ready or signed-read assets

---

## 5. Data Model

Ripples should add a first-class `MediaAsset` domain record.

## 5.1 MediaAsset

Required fields:

- `id`
- `ownerUserId`
- `kind`
  `image` | `video`
- `source`
  `device` | `dropbox` | `google-drive` | `direct-url` | `generated`
- `intent`
  `listing` | `catalog` | `post` | `profile` | `event-cover` | `live`
- `storageProvider`
- `bucket`
- `objectKey`
- `status`
  `pending_upload` | `uploaded` | `processing` | `ready` | `rejected` | `deleted`
- `mimeType`
- `verifiedFormat`
- `sizeBytes`
- `checksum`
- `width`
- `height`
- `durationMs`
- `blurhash`
- `moderationStatus`
  `pending` | `approved` | `flagged` | `rejected`
- `createdAt`
- `updatedAt`

Optional fields:

- `publicUrl`
  only if the delivery strategy exposes a stable public CDN URL
- `rejectionReason`
- `processedAt`
- `deletedAt`

## 5.2 DerivativeAsset

Ripples should model generated derivatives explicitly rather than overloading
the original object.

Required fields:

- `id`
- `mediaAssetId`
- `role`
  `thumbnail` | `preview` | `poster` | `feed-card` | `gallery` | `video-720`
- `bucket`
- `objectKey`
- `mimeType`
- `width`
- `height`
- `sizeBytes`
- `createdAt`

## 5.3 Domain Attachments

Media should attach to product objects through relationship tables or owned
collections, not by embedding storage keys in unrelated records.

Required attachment targets:

- listing/property media
- catalog/product media
- creator profile media
- post/ripple media
- event/live cover media

For listings and future catalog items, attachments should reference `mediaAssetId`
as the canonical source of truth. Ripples should not continue accepting
user-supplied media URLs as product write input once implementation begins.

The current `Media` shape in
[media.types.ts](/Users/juliusossim/Documents/ripples/shared/types/src/lib/models/media.types.ts)
is too presentation-oriented for the full platform. It should remain as a
client-facing read model, while the storage lifecycle model becomes richer.

---

## 6. Storage Key Design

Clients must never choose object keys.

The API should generate deterministic, ownership-scoped keys.

Recommended patterns:

- `users/{userId}/listings/{listingId}/original/{assetId}`
- `users/{userId}/catalog/{catalogItemId}/original/{assetId}`
- `users/{userId}/posts/{postId}/original/{assetId}`
- `users/{userId}/profile/{assetId}`
- `events/{eventId}/cover/{assetId}`
- `derived/{assetId}/thumbnail-640.webp`
- `derived/{assetId}/poster.webp`

Benefits:

- cleaner authorization checks
- easier cleanup and retention
- provider-neutral storage organization
- no filename trust

---

## 7. Upload Contract

Ripples should replace the current API file-throughput pattern in
[media.controller.ts](/Users/juliusossim/Documents/ripples/apps/api/src/app/media/media.controller.ts)
with an intent-based upload flow.

This replacement should be the canonical implementation path, not a sidecar flow.

## 7.1 Initiate Upload

Route:

- `POST /api/media/uploads/initiate`

Purpose:

- authorize the upload
- create a `MediaAsset` in `pending_upload`
- generate a signed URL or upload session
- return the upload contract to the client

Request shape:

- `intent`
- `kind`
- `fileName`
- `mimeType`
- `sizeBytes`
- `ownerContext`
  listing draft, catalog draft, profile, post draft, and so on

Response shape:

- `mediaAssetId`
- `objectKey`
- `uploadMethod`
  `put` | `multipart`
- `uploadUrl`
- `uploadHeaders`
- `expiresAt`
- optional multipart session info

Rules:

- request must be authenticated
- file type and size must be allowlisted by `intent`
- object key must be server-generated
- signed URL must be short-lived
- upload ownership must resolve to the authenticated principal or a valid
  organization context
- the resulting `MediaAsset.ownerUserId` must remain the canonical ownership
  source for later listing/catalog attachment checks

## 7.2 Complete Upload

Route:

- `POST /api/media/uploads/:mediaAssetId/complete`

Purpose:

- verify the object exists
- verify expected size/checksum if available
- verify actual object content, not only declared metadata
- persist `verifiedFormat`
- move the asset into the verified lifecycle without auto-approving moderation
- enqueue processing

Request shape:

- optional client checksum
- optional multipart completion metadata

Response shape:

- `mediaAssetId`
- `status`
- `processingStatus`

Rules:

- completion must require an authenticated owner or valid org context
- completion must fail if the stored object bytes do not match a supported media
  signature
- completion must not treat upload success as moderation approval
- completion may set a stable delivery URL only after object ownership and
  verification checks pass
- moderation should remain `pending` until the processing pipeline or review
  policy clears it

## 7.3 Abort Upload

Route:

- `POST /api/media/uploads/:mediaAssetId/abort`

Purpose:

- invalidate the session
- clean up partial multipart uploads
- mark abandoned asset records accordingly

---

## 8. Read Contract

Ripples should not treat stored object URLs as permanent client truth.

The client-facing read model should be a resolved media presentation contract.

## 8.1 Read Model

The existing `Media` interface should evolve toward:

- `id`
- `type`
- `alt`
- `url`
  delivery URL, not raw storage URL
- `width`
- `height`
- `durationMs`
- `placeholder`
- `role`
  `cover`, `gallery`, `thumbnail`, `poster`

## 8.2 Read Policy

Allowed patterns:

- stable CDN URL for intentionally public derivatives
- short-lived signed read URL for protected originals or restricted assets

Avoid:

- storage-provider URLs leaking directly into write models
- API file serving through `sendFile()` for production delivery

---

## 9. Processing Pipeline

After upload completion, Ripples should enqueue a background job.

## 9.1 Required Processing Steps

For images:

- verify magic bytes and actual format
- inspect size and dimensions
- reject unsupported content
- create thumbnails and feed/card derivatives
- strip or normalize metadata where appropriate
- compute placeholder data
- run moderation or queue moderation
- mark `ready`

For video later:

- verify container and codec
- extract duration and poster
- create delivery variants
- queue moderation
- mark `ready`

## 9.2 Status Transitions

```text
pending_upload
  -> uploaded
  -> processing
  -> ready

pending_upload
  -> aborted

uploaded or processing
  -> rejected

ready
  -> deleted
```

If verification or moderation fails, the asset must not become feed-visible.

In the current hardening model, upload completion is allowed to verify content
and finalize the asset record, but it must not silently treat that transition
as moderation approval. The distinction between "verified upload" and
"moderation approved" is part of the production contract and should remain
explicit in later queue-based processing.

---

## 10. Security Requirements

## 10.1 Upload Security

- authenticated upload initiation only
- upload intent must map to a valid owner context
- per-user and per-intent quotas
- strict file-size caps
- strict type allowlists
- server-generated object keys only
- short-lived signed URLs
- no raw Host-header-derived media URLs
- bucket private by default

## 10.2 Delivery Security

- originals private by default
- derived assets public only when product policy allows it
- signed read URLs for restricted media
- signed URLs treated as bearer tokens

## 10.3 Operational Safety

- abandoned upload cleanup
- derivative cleanup on asset deletion
- audit fields for who uploaded and attached the media
- moderation state must gate feed visibility

## 10.4 Ownership And Write Security

- product creation routes that attach media must be authenticated
- listing/property creation must only accept assets owned by the submitting user
  or an explicitly allowed org context
- property creation must write the canonical ownership record in the same
  transaction as the property and listing records
- asset ownership checks must happen at write time, not only at upload time

## 10.5 Event And Analytics Security

- raw event ingestion must not trust client-supplied `userId` when an
  authenticated principal is present
- the server should derive the event user identity from the authenticated
  session
- raw event listing should not be public; admin-only access is the minimum safe
  baseline
- public product interaction endpoints should emit bounded, product-specific
  events rather than exposing generic event ingestion as an open public surface

---

## 11. Storage Adapter Boundary

Ripples should implement a provider-neutral adapter in the API.

Recommended interface surface:

- `createUploadIntent(input)`
- `completeUpload(input)`
- `abortUpload(input)`
- `createReadUrl(input)`
- `headObject(input)`
- `deleteObject(input)`

The application should depend on this contract rather than directly on S3 or R2
SDK calls in controllers or feature services.

Initial concrete adapter target:

- S3-compatible adapter

That keeps the code open to `AWS S3` and `Cloudflare R2`.

---

## 12. Repo Ownership

## 12.1 `apps/api`

Own:

- media metadata domain
- upload initiation/finalization routes
- storage adapter integration
- processing job scheduling
- authorization

Should not own:

- large-file streaming through the API in production
- durable local filesystem storage
- permanent static file delivery

## 12.2 `shared/types`

Own:

- upload initiation request/response contracts
- media read-model contracts
- asset status and intent enums

## 12.3 `ui/web`

Own:

- client upload UX
- progress handling
- retry and cancel affordances
- create-property and future create-catalog upload integration

The current listing form mapper in
[create-property-form.mapper.ts](/Users/juliusossim/Documents/ripples/ui/web/src/lib/property/create-property/create-property-form.mapper.ts)
still assumes media is a direct URL string on submit. That must change once the
media asset contract exists.

---

## 13. Route And Product Integration

This media platform must support the route plan already defined in
[ripples-web-routing-plan.md](/Users/juliusossim/Documents/ripples/docs/ripples-web-routing-plan.md).

Must-have product surfaces:

- `/dashboard/listings/new`
- `/dashboard/listings/import`
- `/dashboard/catalog/new`
- `/dashboard/catalog/import`
- future creator/post publishing flows
- future live-event cover and replay flows

The current feed create panel in
[feed-create-panel.tsx](/Users/juliusossim/Documents/ripples/ui/web/src/lib/feed/feed-create/feed-create-panel.tsx)
should be treated as a temporary publisher surface, not the final media
workflow.

---

## 14. Rollout Plan

## Phase 1 — Metadata And Adapter Boundary

- add `MediaAsset` and derivative models
- introduce storage adapter interface
- keep current API-mediated upload temporarily if necessary
- persist metadata separately from local file paths

Output:

- storage-ready domain model

## Phase 2 — Signed Upload Flow

- add initiate/complete/abort endpoints
- move client to direct upload
- stop returning API-hosted local file URLs as canonical asset URLs

Output:

- production-safe upload path

## Phase 3 — Processing Pipeline

- add async worker jobs
- verify content after upload
- generate thumbnails
- add moderation state

Output:

- ready-state media lifecycle

## Phase 4 — Catalog And Multi-Surface Adoption

- adopt the same platform for listings and catalog items
- wire future creator/post surfaces to the same media asset model

Output:

- one media platform across product surfaces

## Phase 5 — Video And Advanced Delivery

- add video ingest and poster generation
- add transcoding and derivative delivery variants
- move to signed delivery where needed

Output:

- media platform ready for richer commerce and live surfaces

---

## 15. Migration From Current Implementation

Current state:

- API receives file bytes directly
- API writes files to local disk
- API returns local-server-backed URLs

Migration path:

1. introduce metadata records, storage adapter, and `mediaAssetId`-based contracts
2. switch web create-property flow directly to upload-initiate/direct-upload/complete
3. switch property creation to finalized `mediaAssetId` references only
4. remove direct API file persistence and local file serving

---

## 16. Immediate Repo Changes To Expect

Packages and areas likely to change first:

- `apps/api/src/app/media`
- `apps/api/src/app/property`
- `apps/api/src/app/catalog` when introduced
- `shared/types/src/lib/models/media.types.ts`
- `shared/api-client`
- `shared/data`
- `ui/web/src/lib/property/create-property`
- `ui/web/src/lib/feed/feed-create`

---

## 17. Open Decisions

These should be confirmed before implementation:

1. Provider choice for first production deploy: `S3` or `R2`
2. Whether first rollout supports images only, or images plus limited video
3. Whether delivery URLs are public CDN URLs or signed-read URLs by default
4. Which queue/worker mechanism Ripples will use for processing jobs
5. Whether moderation is blocking in the first rollout or only advisory

---

## 18. Source References

- AWS S3 presigned uploads:
  [docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- AWS multipart upload:
  [docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html)
- Google Cloud Storage signed URLs:
  [docs.cloud.google.com/storage/docs/access-control/signed-urls](https://docs.cloud.google.com/storage/docs/access-control/signed-urls)
- Cloudflare R2 presigned URLs:
  [developers.cloudflare.com/r2/api/s3/presigned-urls/](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
