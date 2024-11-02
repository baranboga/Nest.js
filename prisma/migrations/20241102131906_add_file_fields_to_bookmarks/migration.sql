/*
  Warnings:

  - You are about to drop the column `question1` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `question2` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `question3` on the `questions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "questions" DROP COLUMN "question1",
DROP COLUMN "question2",
DROP COLUMN "question3";

-- CreateTable
CREATE TABLE "question_contents" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "question_contents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "question_contents" ADD CONSTRAINT "question_contents_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
