-- CreateTable
CREATE TABLE "search_logs" (
    "id" SERIAL NOT NULL,
    "query" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "search_logs_created_at_idx" ON "search_logs"("created_at");

-- CreateIndex
CREATE INDEX "search_logs_query_created_at_idx" ON "search_logs"("query", "created_at");
