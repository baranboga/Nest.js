/*
  Warnings:

  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "questions";

-- CreateTable
CREATE TABLE "question" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);
