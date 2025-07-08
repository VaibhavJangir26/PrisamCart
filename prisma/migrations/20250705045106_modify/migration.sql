/*
  Warnings:

  - You are about to alter the column `rating` on the `Reviews` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Reviews" ALTER COLUMN "rating" SET DEFAULT 2,
ALTER COLUMN "rating" SET DATA TYPE INTEGER;
