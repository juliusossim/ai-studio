-- CreateEnum
CREATE TYPE "MediaAssetIntent" AS ENUM ('listing', 'catalog', 'post', 'profile', 'event_cover', 'live');

-- CreateEnum
CREATE TYPE "MediaAssetStatus" AS ENUM ('pending_upload', 'uploaded', 'processing', 'ready', 'rejected', 'deleted');

-- CreateEnum
CREATE TYPE "MediaModerationStatus" AS ENUM ('pending', 'approved', 'flagged', 'rejected');

-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('s3');

-- CreateEnum
CREATE TYPE "MediaAssetSource" AS ENUM ('device', 'dropbox', 'google_drive', 'direct_url', 'generated');

-- CreateEnum
CREATE TYPE "MediaDerivativeRole" AS ENUM ('thumbnail', 'preview', 'poster', 'feed_card', 'gallery', 'video_720');

-- CreateEnum
CREATE TYPE "PropertyMediaRole" AS ENUM ('cover', 'gallery');

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" UUID NOT NULL,
    "ownerUserId" UUID NOT NULL,
    "intent" "MediaAssetIntent" NOT NULL,
    "type" "MediaType" NOT NULL,
    "source" "MediaAssetSource" NOT NULL,
    "storageProvider" "StorageProvider" NOT NULL,
    "bucket" VARCHAR(160) NOT NULL,
    "objectKey" VARCHAR(1024) NOT NULL,
    "status" "MediaAssetStatus" NOT NULL DEFAULT 'pending_upload',
    "mimeType" VARCHAR(255) NOT NULL,
    "verifiedFormat" VARCHAR(40),
    "sizeBytes" BIGINT,
    "checksum" VARCHAR(255),
    "width" INTEGER,
    "height" INTEGER,
    "durationMs" INTEGER,
    "blurhash" VARCHAR(255),
    "moderationStatus" "MediaModerationStatus" NOT NULL DEFAULT 'pending',
    "originalName" VARCHAR(255),
    "publicUrl" VARCHAR(2048),
    "rejectionReason" VARCHAR(500),
    "processedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaDerivative" (
    "id" UUID NOT NULL,
    "mediaAssetId" UUID NOT NULL,
    "role" "MediaDerivativeRole" NOT NULL,
    "bucket" VARCHAR(160) NOT NULL,
    "objectKey" VARCHAR(1024) NOT NULL,
    "mimeType" VARCHAR(255) NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "sizeBytes" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaDerivative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyMediaAttachment" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "mediaAssetId" UUID NOT NULL,
    "alt" VARCHAR(240) NOT NULL,
    "role" "PropertyMediaRole" NOT NULL DEFAULT 'gallery',
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "PropertyMediaAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MediaAsset_ownerUserId_intent_status_idx" ON "MediaAsset"("ownerUserId", "intent", "status");

-- CreateIndex
CREATE INDEX "MediaAsset_status_createdAt_idx" ON "MediaAsset"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_storageProvider_bucket_objectKey_key" ON "MediaAsset"("storageProvider", "bucket", "objectKey");

-- CreateIndex
CREATE UNIQUE INDEX "MediaDerivative_mediaAssetId_role_key" ON "MediaDerivative"("mediaAssetId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyMediaAttachment_propertyId_sortOrder_key" ON "PropertyMediaAttachment"("propertyId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyMediaAttachment_propertyId_mediaAssetId_key" ON "PropertyMediaAttachment"("propertyId", "mediaAssetId");

-- CreateIndex
CREATE INDEX "PropertyMediaAttachment_propertyId_sortOrder_idx" ON "PropertyMediaAttachment"("propertyId", "sortOrder");

-- CreateIndex
CREATE INDEX "PropertyMediaAttachment_mediaAssetId_idx" ON "PropertyMediaAttachment"("mediaAssetId");

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_ownerUserId_fkey"
FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaDerivative" ADD CONSTRAINT "MediaDerivative_mediaAssetId_fkey"
FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyMediaAttachment" ADD CONSTRAINT "PropertyMediaAttachment_propertyId_fkey"
FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyMediaAttachment" ADD CONSTRAINT "PropertyMediaAttachment_mediaAssetId_fkey"
FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Guard against silent data loss during the hard cutover.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "PropertyMedia" LIMIT 1) THEN
    RAISE EXCEPTION
      'Cannot apply media_asset_cutover while legacy PropertyMedia rows still exist. Migrate or archive those rows first.';
  END IF;
END $$;

-- DropTable
DROP TABLE "PropertyMedia";
