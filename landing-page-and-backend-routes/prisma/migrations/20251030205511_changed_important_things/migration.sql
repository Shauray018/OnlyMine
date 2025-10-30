/*
  Warnings:

  - You are about to drop the column `nftId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `NFT` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mintAddress]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageUrl` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NFT" DROP CONSTRAINT "NFT_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_nftId_fkey";

-- DropIndex
DROP INDEX "public"."Comment_createdAt_idx";

-- DropIndex
DROP INDEX "public"."Post_nftId_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "nftId",
ADD COLUMN     "aspectRatio" DOUBLE PRECISION DEFAULT 1.0,
ADD COLUMN     "commentsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "isMinted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "mintAddress" TEXT,
ADD COLUMN     "mintedAt" TIMESTAMP(3),
ADD COLUMN     "sharesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "trendingScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "weekNumber" INTEGER,
ADD COLUMN     "weeklyRank" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileImage",
ADD COLUMN     "avatarUrl" TEXT,
ALTER COLUMN "username" SET NOT NULL;

-- DropTable
DROP TABLE "public"."NFT";

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklySelection" (
    "id" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "selectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postIds" TEXT[],
    "collectionAddress" TEXT,

    CONSTRAINT "WeeklySelection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySelection_weekNumber_key" ON "WeeklySelection"("weekNumber");

-- CreateIndex
CREATE INDEX "WeeklySelection_weekNumber_idx" ON "WeeklySelection"("weekNumber");

-- CreateIndex
CREATE INDEX "Like_createdAt_idx" ON "Like"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Post_mintAddress_key" ON "Post"("mintAddress");

-- CreateIndex
CREATE INDEX "Post_trendingScore_idx" ON "Post"("trendingScore");

-- CreateIndex
CREATE INDEX "Post_weekNumber_weeklyRank_idx" ON "Post"("weekNumber", "weeklyRank");

-- CreateIndex
CREATE INDEX "Post_isMinted_idx" ON "Post"("isMinted");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
