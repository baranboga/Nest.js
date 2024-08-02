-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_categoryId_fkey";

-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
