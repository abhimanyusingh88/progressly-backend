/*
  Warnings:

  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "dailyTrack" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studyTime" INTEGER NOT NULL,
    "breakTime" INTEGER NOT NULL,
    "totalTime" INTEGER NOT NULL,
    "completionPercent" INTEGER NOT NULL,
    "streak" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "dailyTrack_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dailyTrack" ADD CONSTRAINT "dailyTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
