/*
  Warnings:

  - You are about to drop the column `attempts` on the `MatchingGameScore` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `MatchingGameScore` table. All the data in the column will be lost.
  - You are about to drop the column `fastestTime` on the `MatchingGameScore` table. All the data in the column will be lost.
  - You are about to drop the column `highestScore` on the `WordChainScore` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MatchingGameScore" DROP COLUMN "attempts",
DROP COLUMN "completedAt",
DROP COLUMN "fastestTime",
ADD COLUMN     "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fastestTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "highestScore" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WordChainScore" DROP COLUMN "highestScore";
