-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discount" JSONB,
ADD COLUMN     "localizedDescriptions" JSONB,
ADD COLUMN     "localizedNames" JSONB,
ADD COLUMN     "sizeChart" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Draft';
