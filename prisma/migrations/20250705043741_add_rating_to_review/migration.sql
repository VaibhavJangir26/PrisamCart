-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "comments" TEXT,
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 2;
