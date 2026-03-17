-- DropForeignKey
ALTER TABLE "UserWord" DROP CONSTRAINT "UserWord_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserWord" ADD CONSTRAINT "UserWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
