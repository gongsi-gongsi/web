-- CreateTable
CREATE TABLE "user_disclosure_summaries" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "disclosure_id" UUID NOT NULL,
    "summary" TEXT NOT NULL,
    "sentiment" VARCHAR(20) NOT NULL,
    "key_figures" JSONB NOT NULL,
    "analysis" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_disclosure_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_disclosure_summaries_user_id_idx" ON "user_disclosure_summaries"("user_id");

-- CreateIndex
CREATE INDEX "user_disclosure_summaries_disclosure_id_idx" ON "user_disclosure_summaries"("disclosure_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_disclosure_summaries_user_id_disclosure_id_key" ON "user_disclosure_summaries"("user_id", "disclosure_id");

-- AddForeignKey
ALTER TABLE "user_disclosure_summaries" ADD CONSTRAINT "user_disclosure_summaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_disclosure_summaries" ADD CONSTRAINT "user_disclosure_summaries_disclosure_id_fkey" FOREIGN KEY ("disclosure_id") REFERENCES "disclosures"("id") ON DELETE CASCADE ON UPDATE CASCADE;
