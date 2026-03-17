-- DropForeignKey
ALTER TABLE "MemorizedWord" DROP CONSTRAINT "MemorizedWord_userId_fkey";

-- DropForeignKey
ALTER TABLE "WordChainScore" DROP CONSTRAINT "WordChainScore_userId_fkey";

-- AddForeignKey
ALTER TABLE "MemorizedWord" ADD CONSTRAINT "MemorizedWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordChainScore" ADD CONSTRAINT "WordChainScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
