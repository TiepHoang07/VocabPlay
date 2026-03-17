-- DropForeignKey
ALTER TABLE "MatchingGameScore" DROP CONSTRAINT "MatchingGameScore_userId_fkey";

-- AddForeignKey
ALTER TABLE "MatchingGameScore" ADD CONSTRAINT "MatchingGameScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
