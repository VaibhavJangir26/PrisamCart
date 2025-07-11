-- DropIndex
DROP INDEX "Address_user_id_key";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "created_at" DROP NOT NULL;
