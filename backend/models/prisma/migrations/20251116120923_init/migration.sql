/*
  Warnings:

  - You are about to drop the column `createdAt` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `smsSent` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `userPhone` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `venueId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `venueName` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `venueId` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `venueId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `locationLat` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `locationLng` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `mapLink` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `maxCapacity` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `maxPrice` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `minCapacity` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `minPrice` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `originalPrice` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `pricingType` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `specialOffer` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the column `weddingSpecific` on the `wedding_venues` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,venue_id]` on the table `favorites` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `venue_id` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue_id` to the `favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_email` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue_id` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_userId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_venueId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_userId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_venueId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_venueId_fkey";

-- DropIndex
DROP INDEX "favorites_userId_venueId_key";

-- DropIndex
DROP INDEX "wedding_venues_isFeatured_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "createdAt",
DROP COLUMN "smsSent",
DROP COLUMN "updatedAt",
DROP COLUMN "userEmail",
DROP COLUMN "userId",
DROP COLUMN "userName",
DROP COLUMN "userPhone",
DROP COLUMN "venueId",
DROP COLUMN "venueName",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sms_sent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_email" TEXT,
ADD COLUMN     "user_id" TEXT,
ADD COLUMN     "user_name" TEXT,
ADD COLUMN     "user_phone" TEXT,
ADD COLUMN     "venue_id" TEXT NOT NULL,
ADD COLUMN     "venue_name" TEXT,
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "time" DROP NOT NULL;

-- AlterTable
ALTER TABLE "favorites" DROP COLUMN "createdAt",
DROP COLUMN "userId",
DROP COLUMN "venueId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "venue_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "createdAt",
DROP COLUMN "isVerified",
DROP COLUMN "updatedAt",
DROP COLUMN "userEmail",
DROP COLUMN "userId",
DROP COLUMN "userName",
DROP COLUMN "venueId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_email" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT,
ADD COLUMN     "user_name" TEXT NOT NULL,
ADD COLUMN     "venue_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "wedding_venues" DROP COLUMN "createdAt",
DROP COLUMN "isFeatured",
DROP COLUMN "locationLat",
DROP COLUMN "locationLng",
DROP COLUMN "mapLink",
DROP COLUMN "maxCapacity",
DROP COLUMN "maxPrice",
DROP COLUMN "minCapacity",
DROP COLUMN "minPrice",
DROP COLUMN "originalPrice",
DROP COLUMN "pricingType",
DROP COLUMN "reviewCount",
DROP COLUMN "specialOffer",
DROP COLUMN "updatedAt",
DROP COLUMN "viewCount",
DROP COLUMN "weddingSpecific",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location_lat" DOUBLE PRECISION,
ADD COLUMN     "location_lng" DOUBLE PRECISION,
ADD COLUMN     "map_link" TEXT,
ADD COLUMN     "max_capacity" INTEGER,
ADD COLUMN     "max_price" INTEGER,
ADD COLUMN     "min_capacity" INTEGER,
ADD COLUMN     "min_price" INTEGER,
ADD COLUMN     "original_price" INTEGER,
ADD COLUMN     "pricing_type" TEXT,
ADD COLUMN     "review_count" INTEGER DEFAULT 0,
ADD COLUMN     "special_offer" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "view_count" INTEGER DEFAULT 0,
ADD COLUMN     "wedding_specific" JSONB,
ALTER COLUMN "governorate" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "contact" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "originalPrice" INTEGER,
    "discount" INTEGER,
    "features" TEXT[],
    "additionalServices" TEXT[],
    "description" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_venue_id_key" ON "favorites"("user_id", "venue_id");

-- CreateIndex
CREATE INDEX "wedding_venues_is_featured_idx" ON "wedding_venues"("is_featured");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "wedding_venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "wedding_venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "wedding_venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "wedding_venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
