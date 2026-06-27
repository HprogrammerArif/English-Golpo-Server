-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "isLearned" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SentencePattern" (
    "id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "patternBn" TEXT NOT NULL,
    "exampleEn" TEXT NOT NULL,
    "exampleBn" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SentencePattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMistake" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "englishText" TEXT NOT NULL,
    "banglaText" TEXT NOT NULL,
    "incorrectCount" INTEGER NOT NULL DEFAULT 1,
    "corrected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMistake_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMistake_userId_type_englishText_key" ON "UserMistake"("userId", "type", "englishText");

-- AddForeignKey
ALTER TABLE "UserMistake" ADD CONSTRAINT "UserMistake_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
