-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('YOUTUBE', 'ILLUSTRATION', 'PARENT', 'PUBLIC');

-- AlterTable
ALTER TABLE "VideoLesson" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "contributorId" TEXT,
ADD COLUMN     "payoutAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "payoutStatus" TEXT NOT NULL DEFAULT 'NOT_APPLICABLE',
ADD COLUMN     "targetChildId" TEXT,
ADD COLUMN     "videoType" "VideoType" NOT NULL DEFAULT 'YOUTUBE',
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "youtubeId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payoutAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "payoutStatus" TEXT NOT NULL DEFAULT 'NOT_APPLICABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contribution_contributorId_idx" ON "Contribution"("contributorId");

-- AddForeignKey
ALTER TABLE "VideoLesson" ADD CONSTRAINT "VideoLesson_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoLesson" ADD CONSTRAINT "VideoLesson_targetChildId_fkey" FOREIGN KEY ("targetChildId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
