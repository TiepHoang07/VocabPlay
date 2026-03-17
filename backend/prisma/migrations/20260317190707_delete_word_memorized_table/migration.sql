/*
  Warnings:

  - You are about to drop the `MemorizedWord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MemorizedWord" DROP CONSTRAINT "MemorizedWord_userId_fkey";

-- DropForeignKey
ALTER TABLE "MemorizedWord" DROP CONSTRAINT "MemorizedWord_wordId_fkey";

-- AlterTable
ALTER TABLE "UserWord" ADD COLUMN     "memorized" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "MemorizedWord";
