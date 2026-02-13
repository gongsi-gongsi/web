-- AlterTable
ALTER TABLE "search_logs" ADD COLUMN     "corp_code" VARCHAR(8);

-- CreateIndex
CREATE INDEX "search_logs_corp_code_created_at_idx" ON "search_logs"("corp_code", "created_at");
