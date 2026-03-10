-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWord" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "partOfSpeech" TEXT,
    "example" TEXT,
    "phonetic" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemorizedWord" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" INTEGER NOT NULL,
    "memorizedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemorizedWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordChainScore" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "longestChain" INTEGER NOT NULL,
    "highestScore" INTEGER NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordChainScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchingGameScore" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "pairsCount" INTEGER NOT NULL,
    "timeSeconds" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchingGameScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserWord_userId_idx" ON "UserWord"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWord_userId_word_key" ON "UserWord"("userId", "word");

-- CreateIndex
CREATE INDEX "MemorizedWord_userId_idx" ON "MemorizedWord"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MemorizedWord_userId_wordId_key" ON "MemorizedWord"("userId", "wordId");

-- CreateIndex
CREATE INDEX "WordChainScore_userId_idx" ON "WordChainScore"("userId");

-- CreateIndex
CREATE INDEX "MatchingGameScore_userId_idx" ON "MatchingGameScore"("userId");

-- AddForeignKey
ALTER TABLE "UserWord" ADD CONSTRAINT "UserWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorizedWord" ADD CONSTRAINT "MemorizedWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorizedWord" ADD CONSTRAINT "MemorizedWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "UserWord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordChainScore" ADD CONSTRAINT "WordChainScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingGameScore" ADD CONSTRAINT "MatchingGameScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
