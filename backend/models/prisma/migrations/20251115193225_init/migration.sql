-- AlterTable
ALTER TABLE "wedding_venues" ADD COLUMN     "locationLat" DOUBLE PRECISION,
ADD COLUMN     "locationLng" DOUBLE PRECISION,
ADD COLUMN     "mapLink" TEXT,
ADD COLUMN     "maxCapacity" INTEGER,
ADD COLUMN     "maxPrice" INTEGER,
ADD COLUMN     "minCapacity" INTEGER,
ADD COLUMN     "minPrice" INTEGER,
ADD COLUMN     "pricingType" TEXT,
ADD COLUMN     "reviewCount" INTEGER DEFAULT 0,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "whatsapp" TEXT;
