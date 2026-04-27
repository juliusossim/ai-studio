# Ripples — Media Platform Execution Plan

> Concrete implementation plan for the
> [Media Platform Spec](/Users/juliusossim/Documents/ripples/docs/ripples-media-platform-spec.md).
> This document turns the target architecture into a repo-by-repo rollout plan
> with exact file targets, contract changes, and migration checkpoints.

---

## 1. Goal

Ship the first production media platform for Ripples as the new canonical
listing flow.

The execution order should:

- minimize churn across `apps/api`, `shared/types`, `shared/api-client`,
  `shared/data`, and `ui/web`
- move directly to `mediaAssetId`-based listing creation
- remove API-local media upload as a product path

---

## 2. Delivery Sequence

Implementation should happen in four sequential workstreams:

1. schema and type foundations
2. API media domain and storage adapter
3. client upload contract migration
4. hard cutover of property creation and removal of local-file uploads

Each workstream should be independently mergeable.

---

## 3. Workstream 1 — Schema And Type Foundations

Goal:

- add a first-class media domain model that becomes the canonical listing media
  source

## 3.1 Prisma Schema Changes

Current schema anchors:

- `PropertyMedia` in
  [schema.prisma](/Users/juliusossim/Documents/ripples/apps/api/prisma/schema.prisma:272)
- `ContentMedia` in
  [schema.prisma](/Users/juliusossim/Documents/ripples/apps/api/prisma/schema.prisma:717)

Recommended new enums:

- `MediaAssetIntent`
  `listing` | `catalog` | `post` | `profile` | `event_cover` | `live`
- `MediaAssetStatus`
  `pending_upload` | `uploaded` | `processing` | `ready` | `rejected` | `deleted`
- `MediaModerationStatus`
  `pending` | `approved` | `flagged` | `rejected`
- `StorageProvider`
  `s3`

Recommended new models:

- `MediaAsset`
- `MediaDerivative`
- `PropertyMediaAttachment`
- later `ContentMediaAttachment` and catalog equivalents

Recommended first-pass `MediaAsset` fields:

- `id`
- `ownerUserId`
- `intent`
- `type`
- `source`
- `storageProvider`
- `bucket`
- `objectKey`
- `status`
- `mimeType`
- `verifiedFormat`
- `sizeBytes`
- `checksum`
- `width`
- `height`
- `durationMs`
- `blurhash`
- `moderationStatus`
- `createdAt`
- `updatedAt`
- `deletedAt`

Recommended first-pass `MediaDerivative` fields:

- `id`
- `mediaAssetId`
- `role`
- `bucket`
- `objectKey`
- `mimeType`
- `width`
- `height`
- `sizeBytes`
- `createdAt`

## 3.2 Relationship Strategy

Do not use bridge fields as the product path.

Instead:

- introduce `PropertyMediaAttachment`
- reference `mediaAssetId` directly
- remove media URL/type from property creation input

The same pattern should later apply to content and catalog media attachments.

## 3.3 Shared Type Changes

Current type anchors:

- [media.types.ts](/Users/juliusossim/Documents/ripples/shared/types/src/lib/models/media.types.ts)
- [property.types.ts](/Users/juliusossim/Documents/ripples/shared/types/src/lib/models/property.types.ts)

Add new shared contracts:

- `MediaAssetIntent`
- `MediaAssetStatus`
- `MediaModerationStatus`
- `StorageProvider`
- `MediaUploadInitiateRequest`
- `MediaUploadInitiateResponse`
- `MediaUploadCompleteRequest`
- `MediaUploadCompleteResponse`
- `MediaAssetSummary`

Preserve existing:

- `Media`

But mark `UploadedMediaAsset` as legacy-only until it is removed.

Add new write contracts so product creation references `mediaAssetId`, not URLs.

## 3.4 Files To Change

- [schema.prisma](/Users/juliusossim/Documents/ripples/apps/api/prisma/schema.prisma)
- [media.types.ts](/Users/juliusossim/Documents/ripples/shared/types/src/lib/models/media.types.ts)
- [property.types.ts](/Users/juliusossim/Documents/ripples/shared/types/src/lib/models/property.types.ts)
- [shared/types index exports](/Users/juliusossim/Documents/ripples/shared/types/src/lib/models/index.ts)

## 3.5 Exit Criteria

- Prisma schema contains `MediaAsset` and derivative support
- schema contains `PropertyMediaAttachment`
- shared contracts exist for initiate/complete upload flows
- shared property creation contracts accept `mediaAssetId` references

---

## 4. Workstream 2 — API Media Domain And Storage Adapter

Goal:

- introduce a provider-neutral media platform in the API as the canonical media
  write path

## 4.1 New API Structure

Inside `apps/api/src/app/media`, add:

- `media-asset.repository.ts`
- `storage/storage-adapter.ts`
- `storage/s3-storage-adapter.ts`
- `dto/initiate-media-upload.dto.ts`
- `dto/complete-media-upload.dto.ts`
- `dto/abort-media-upload.dto.ts`
- `media-upload.service.ts`
- `media-asset.mapper.ts`

Remove the current direct-upload service path from product flow planning.

## 4.2 Storage Adapter Contract

First interface shape:

```ts
export interface StorageAdapter {
  createUploadIntent(input: CreateUploadIntentInput): Promise<CreateUploadIntentResult>;
  headObject(input: HeadStoredObjectInput): Promise<StoredObjectMetadata | undefined>;
  deleteObject(input: DeleteStoredObjectInput): Promise<void>;
}
```

The first concrete implementation should be:

- `S3StorageAdapter`

Even if Ripples later chooses R2, an S3-compatible adapter keeps the first
implementation stable.

## 4.3 New API Routes

Add:

- `POST /api/media/uploads/initiate`
- `POST /api/media/uploads/:mediaAssetId/complete`
- `POST /api/media/uploads/:mediaAssetId/abort`
- `GET /api/media/:mediaAssetId`

The existing direct upload and local file-serving routes should be removed as
part of the cutover.

## 4.4 Authorization Rules

Required for `initiate`:

- authenticated user
- valid upload intent
- valid owner context
- file size and type allowlist

Required for `complete`:

- authenticated user
- asset owned by requester or an allowed organization context
- asset currently in `pending_upload`
- stored object bytes must verify against a supported media signature
- completion must not auto-set moderation to `approved`

## 4.5 Env Surface

Extend
[api-env.config.ts](/Users/juliusossim/Documents/ripples/apps/api/src/app/telemetry/config/api-env.config.ts)
with provider config such as:

- `MEDIA_STORAGE_PROVIDER`
- `MEDIA_STORAGE_BUCKET`
- `MEDIA_STORAGE_REGION`
- `MEDIA_STORAGE_ENDPOINT`
- `MEDIA_STORAGE_PUBLIC_BASE_URL`
- `MEDIA_STORAGE_ACCESS_KEY_ID`
- `MEDIA_STORAGE_SECRET_ACCESS_KEY`
- `MEDIA_UPLOAD_URL_TTL_SECONDS`

## 4.6 Files To Change

- `apps/api/src/app/media/*`
- `apps/api/src/app/telemetry/config/api-env.config.ts`
- `apps/api/.env.example`
- `apps/api/.env.production.example`

## 4.7 Exit Criteria

- API can create upload intents
- API can finalize uploaded assets with ownership and signature verification
- API exposes the canonical media write surface

## 4.8 Hardening Decisions Already Locked

These rules are no longer optional design intentions; they are production
constraints for implementation:

- upload initiation is authenticated only
- upload completion is owner-scoped
- upload completion must verify actual object content before finalization
- moderation must remain separate from upload completion
- raw generic event ingestion must be authenticated
- raw event listing must be restricted, with admin-only access as the minimum
  baseline

---

## 5. Workstream 3 — Client Upload Contract Migration

Goal:

- switch web upload UX from API file upload to direct object-storage upload

## 5.1 Current Client Anchors

Current flow lives in:

- [api-client.ts](/Users/juliusossim/Documents/ripples/shared/api-client/src/lib/api-client.ts)
- [property-mutations.ts](/Users/juliusossim/Documents/ripples/shared/data/src/lib/property/property-mutations.ts)
- [create-property-form.tsx](/Users/juliusossim/Documents/ripples/ui/web/src/lib/property/create-property/create-property-form.tsx)
- [feed-create-panel.tsx](/Users/juliusossim/Documents/ripples/ui/web/src/lib/feed/feed-create/feed-create-panel.tsx)

Current assumption:

- client sends raw files to `/api/media/uploads`
- API returns `UploadedMediaAsset[]`
- property form submits those URLs directly

That assumption must be removed completely.

## 5.2 New Client Flow

Replace `uploadMedia(files)` with:

1. initiate media upload for each file
2. upload file directly to signed URL
3. complete upload for each `mediaAssetId`
4. return finalized asset summaries to the form

## 5.3 Shared API Client Changes

Add new client methods:

- `initiateMediaUpload(input, accessToken?)`
- `completeMediaUpload(mediaAssetId, input, accessToken?)`
- `abortMediaUpload(mediaAssetId, accessToken?)`

Deprecate:

- `uploadMedia(files, accessToken?)`

Then remove it entirely once the cutover lands.

## 5.4 Shared Data Changes

Replace the current `useUploadMediaMutation()` with either:

- a small orchestrated helper hook
- or a `useDirectMediaUploadMutation()` that performs initiate/upload/complete

The mutation result should return finalized media asset summaries, not raw local
API upload URLs.

## 5.5 Web Form Changes

The property form mapper in
[create-property-form.mapper.ts](/Users/juliusossim/Documents/ripples/ui/web/src/lib/property/create-property/create-property-form.mapper.ts)
currently emits:

- `media: { url, type, alt }[]`

That should be replaced with:

- `media: { mediaAssetId, alt, role? }[]`

This is not a bridge phase. `CreatePropertyRequest` should change directly.

## 5.6 Files To Change

- `shared/api-client/src/lib/api-client.types.ts`
- `shared/api-client/src/lib/api-client.ts`
- `shared/api-client` tests
- `shared/data/src/lib/property/property-mutations.ts`
- `shared/data/src/lib/property/property-mutations.types.ts`
- `ui/web/src/lib/property/create-property/*`
- `ui/web/src/lib/feed/feed-create/*`

## 5.7 Exit Criteria

- listing create flow uploads directly to object storage
- property submit no longer depends on API-hosted local file URLs
- current create-property UX still works for the user

---

## 6. Workstream 4 — Property Persistence Migration

Goal:

- switch property persistence directly to media asset references

## 6.1 Current Persistence

Property creation currently stores media directly in `PropertyMedia` from
`CreatePropertyDto` URL values in
[property.repository.ts](/Users/juliusossim/Documents/ripples/apps/api/src/app/property/property.repository.ts).

## 6.2 New Persistence

Property creation should validate:

- each submitted `mediaAssetId` exists
- each asset is owned by the submitting user or allowed org context
- each asset is in `ready` state
- each asset intent is compatible with `listing`

Then property persistence should:

- create attachment rows referencing `mediaAssetId`
- create `PropertyOwnership` for the submitting principal in the same
  transaction
- derive listing read media from attached assets and ready derivatives

## 6.3 Read Model Direction

`PropertyMedia` should not remain the canonical persistence model.

The target is:

- property media attachments reference `mediaAssetId`
- property read models resolve presentation media from finalized assets and
  derivatives

This is the production shape to build toward immediately.

## 6.4 Files To Change

- `apps/api/src/app/property/dto/create-property.dto.ts`
- `apps/api/src/app/property/property.repository.ts`
- `apps/api/src/app/property/property.service.ts`
- `apps/api/src/app/property/property.controller.ts`
- `apps/api/src/app/events/events.controller.ts`
- `shared/types/src/lib/models/property.types.ts`
- `ui/web property submission types/mappers`

## 6.5 Exit Criteria

- new properties reference media assets safely
- property creation is authenticated and owner-scoped
- property creation writes canonical ownership
- listing read model resolves from asset-backed attachments
- no dependence on local upload URLs remains

---

## 7. Cutover Endpoint Plan

Current legacy endpoints:

- `POST /api/media/uploads`
- `GET /api/media/uploads/:fileName`

Cutover sequence:

1. ship initiate/complete/abort media routes
2. migrate web listing creation to the new flow
3. remove tests that assume API-local upload URLs
4. delete local filesystem persistence
5. delete local file serving routes

---

## 8. Recommended Pull Request Sequence

PR 1:

- add `MediaAsset`, `MediaDerivative`, and `PropertyMediaAttachment`
- change shared property/media contracts to `mediaAssetId`-based writes

PR 2:

- add storage adapter boundary and canonical API upload routes

PR 3:

- migrate shared/api-client, shared/data, and web create-property flow to direct
  upload orchestration

PR 4:

- switch property persistence and reads to asset-backed attachments

PR 5:

- remove legacy API-local upload serving

This sequence keeps each PR reviewable and reduces rollback risk.

---

## 9. Testing Plan

## 9.1 Prisma / Repository

- media asset creation
- upload completion state transitions
- asset ownership validation
- property attachment validation

## 9.2 API

- initiate upload auth failure
- initiate upload validation failure
- complete upload success/failure
- abort upload success/failure
- legacy routes removed once the cutover lands

## 9.3 Client

- direct upload orchestration
- retry and failure handling
- property submit payload shape
- UI progress and error messaging

---

## 10. Immediate First Commit Recommendation

The best first implementation commit is:

- add shared media upload contracts
- change property write contracts to `mediaAssetId`
- add Prisma `MediaAsset`, `MediaDerivative`, and `PropertyMediaAttachment`

Why:

- it establishes the final write model first
- it prevents more URL-based listing code from accumulating
- it keeps storage SDK wiring for the next step

---

## 11. Next Decisions Still Required

Before coding beyond Workstream 1, confirm:

1. provider choice: `S3` or `R2`
2. first upload scope: images only or images plus limited video
3. the exact final shape of `CreatePropertyRequest` for `mediaAssetId`
   attachments, alt text, and optional media roles
4. queue choice for processing jobs

Until those are locked, the schema and shared contracts are still the right
place to start.
