-- CreateEnum
CREATE TYPE "UserProfileMediaRole" AS ENUM ('avatar', 'banner', 'gallery');

-- CreateEnum
CREATE TYPE "OrganizationMediaRole" AS ENUM ('logo', 'banner', 'gallery');

-- CreateEnum
CREATE TYPE "ContentMediaRole" AS ENUM ('cover', 'gallery', 'inline');

-- CreateTable
CREATE TABLE "UserProfileMediaAttachment" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "mediaAssetId" UUID NOT NULL,
    "role" "UserProfileMediaRole" NOT NULL DEFAULT 'gallery',
    "alt" VARCHAR(240) NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfileMediaAttachment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "UserProfileMediaAttachment_sortOrder_slot_check" CHECK ("sortOrder" >= 0 AND "sortOrder" < 6)
);

-- CreateTable
CREATE TABLE "OrganizationMediaAttachment" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "mediaAssetId" UUID NOT NULL,
    "role" "OrganizationMediaRole" NOT NULL DEFAULT 'gallery',
    "alt" VARCHAR(240) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationMediaAttachment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "OrganizationMediaAttachment_sortOrder_slot_check" CHECK ("sortOrder" >= 0 AND "sortOrder" < 6)
);

-- CreateTable
CREATE TABLE "ContentMediaAttachment" (
    "id" UUID NOT NULL,
    "contentPostId" UUID NOT NULL,
    "mediaAssetId" UUID NOT NULL,
    "role" "ContentMediaRole" NOT NULL DEFAULT 'gallery',
    "alt" VARCHAR(240) NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentMediaAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfileMediaAttachment_userId_sortOrder_key" ON "UserProfileMediaAttachment"("userId", "sortOrder");

-- CreateIndex
CREATE INDEX "UserProfileMediaAttachment_mediaAssetId_idx" ON "UserProfileMediaAttachment"("mediaAssetId");

-- CreateIndex
CREATE INDEX "UserProfileMediaAttachment_userId_sortOrder_idx" ON "UserProfileMediaAttachment"("userId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMediaAttachment_organizationId_sortOrder_key" ON "OrganizationMediaAttachment"("organizationId", "sortOrder");

-- CreateIndex
CREATE INDEX "OrganizationMediaAttachment_mediaAssetId_idx" ON "OrganizationMediaAttachment"("mediaAssetId");

-- CreateIndex
CREATE INDEX "OrganizationMediaAttachment_organizationId_sortOrder_idx" ON "OrganizationMediaAttachment"("organizationId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ContentMediaAttachment_contentPostId_sortOrder_key" ON "ContentMediaAttachment"("contentPostId", "sortOrder");

-- CreateIndex
CREATE INDEX "ContentMediaAttachment_mediaAssetId_idx" ON "ContentMediaAttachment"("mediaAssetId");

-- CreateIndex
CREATE INDEX "ContentMediaAttachment_contentPostId_role_sortOrder_idx" ON "ContentMediaAttachment"("contentPostId", "role", "sortOrder");

-- AddForeignKey
ALTER TABLE "UserProfileMediaAttachment" ADD CONSTRAINT "UserProfileMediaAttachment_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileMediaAttachment" ADD CONSTRAINT "UserProfileMediaAttachment_mediaAssetId_fkey"
FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMediaAttachment" ADD CONSTRAINT "OrganizationMediaAttachment_organizationId_fkey"
FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMediaAttachment" ADD CONSTRAINT "OrganizationMediaAttachment_mediaAssetId_fkey"
FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentMediaAttachment" ADD CONSTRAINT "ContentMediaAttachment_contentPostId_fkey"
FOREIGN KEY ("contentPostId") REFERENCES "ContentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentMediaAttachment" ADD CONSTRAINT "ContentMediaAttachment_mediaAssetId_fkey"
FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
