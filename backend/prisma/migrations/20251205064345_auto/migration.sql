-- CreateTable
CREATE TABLE "PlaygroundSnippet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request" JSONB NOT NULL,
    "response" JSONB NOT NULL,

    CONSTRAINT "PlaygroundSnippet_pkey" PRIMARY KEY ("id")
);
