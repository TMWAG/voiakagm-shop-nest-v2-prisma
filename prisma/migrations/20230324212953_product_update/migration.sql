-- AlterTable
ALTER TABLE "products" ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "sold" SET DEFAULT 0;