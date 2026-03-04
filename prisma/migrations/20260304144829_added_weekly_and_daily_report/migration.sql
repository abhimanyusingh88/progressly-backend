-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Age" TEXT,
ADD COLUMN     "AlmaMater" TEXT,
ADD COLUMN     "Bio" TEXT,
ADD COLUMN     "Gender" TEXT,
ADD COLUMN     "Image" TEXT,
ADD COLUMN     "Nationality" TEXT,
ADD COLUMN     "Pronounce" TEXT,
ADD COLUMN     "links" TEXT,
ADD COLUMN     "maxQualification" TEXT,
ADD COLUMN     "userName" TEXT;

-- AlterTable
ALTER TABLE "dailyTrack" ADD COLUMN     "totalBreak" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "weeklyReport" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "hoursStudied" INTEGER NOT NULL,
    "totalBreaks" INTEGER NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "badgesEarned" INTEGER NOT NULL,
    "averageCompletionPercentage" INTEGER NOT NULL,
    "bestDay" TEXT NOT NULL,
    "consistencyScore" INTEGER NOT NULL,
    "suggestions" TEXT NOT NULL,
    "worstDay" TEXT NOT NULL,
    "topSubject" TEXT NOT NULL,
    "lowestSubject" TEXT NOT NULL,
    "averageStudyTime" INTEGER NOT NULL,
    "percentile" INTEGER NOT NULL,
    "user_Id" INTEGER NOT NULL,

    CONSTRAINT "weeklyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dailyReport" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "hoursStudied" INTEGER NOT NULL,
    "totalBreaks" INTEGER NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "badgesEarned" INTEGER NOT NULL,
    "averageCompletionPercentage" INTEGER NOT NULL,
    "suggestions" TEXT NOT NULL,
    "topSubject" TEXT NOT NULL,
    "lowestSubject" TEXT NOT NULL,
    "user_Id" INTEGER NOT NULL,

    CONSTRAINT "dailyReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "weeklyReport" ADD CONSTRAINT "weeklyReport_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dailyReport" ADD CONSTRAINT "dailyReport_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
