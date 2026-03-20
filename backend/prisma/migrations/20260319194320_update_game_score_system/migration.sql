/*
  Warnings:

  - You are about to drop the column `pairsCount` on the `MatchingGameScore` table. All the data in the column will be lost.
  - You are about to drop the column `timeSeconds` on the `MatchingGameScore` table. All the data in the column will be lost.
  - You are about to drop the column `longestChain` on the `WordChainScore` table. All the data in the column will be lost.
  - Added the required column `fastestTime` to the `MatchingGameScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `MatchingGameScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `WordChainScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatchingGameScore" DROP COLUMN "pairsCount",
DROP COLUMN "timeSeconds",
ADD COLUMN     "fastestTime" INTEGER NOT NULL,
ADD COLUMN     "time" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WordChainScore" DROP COLUMN "longestChain",
ADD COLUMN     "score" INTEGER NOT NULL;
