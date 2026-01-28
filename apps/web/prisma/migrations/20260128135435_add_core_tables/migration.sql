-- AlterTable
ALTER TABLE "users" ADD COLUMN     "notification_email" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notification_telegram" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "telegram_chat_id" VARCHAR(50);

-- CreateTable
CREATE TABLE "watchlist" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "stock_id" UUID NOT NULL,
    "notify_regular" BOOLEAN NOT NULL DEFAULT true,
    "notify_major" BOOLEAN NOT NULL DEFAULT true,
    "notify_equity" BOOLEAN NOT NULL DEFAULT true,
    "notify_securities" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disclosures" (
    "id" UUID NOT NULL,
    "stock_id" UUID NOT NULL,
    "rcept_no" VARCHAR(20) NOT NULL,
    "rcept_dt" DATE NOT NULL,
    "report_nm" VARCHAR(500) NOT NULL,
    "dcm_type" VARCHAR(10),
    "dart_url" VARCHAR(500),
    "ai_summary" TEXT,
    "ai_sentiment" VARCHAR(20),
    "ai_key_figures" JSONB,
    "ai_analysis" TEXT,
    "ai_analyzed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disclosures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_data" (
    "id" UUID NOT NULL,
    "stock_id" UUID NOT NULL,
    "bsns_year" VARCHAR(4) NOT NULL,
    "reprt_code" VARCHAR(10) NOT NULL,
    "revenue" BIGINT,
    "operating_profit" BIGINT,
    "net_income" BIGINT,
    "total_assets" BIGINT,
    "total_liabilities" BIGINT,
    "total_equity" BIGINT,
    "raw_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_reports" (
    "id" UUID NOT NULL,
    "stock_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "report_type" VARCHAR(20) NOT NULL,
    "report_content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_conversations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "disclosure_id" UUID NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "disclosure_id" UUID,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT,
    "channel" VARCHAR(20) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "watchlist_user_id_idx" ON "watchlist"("user_id");

-- CreateIndex
CREATE INDEX "watchlist_stock_id_idx" ON "watchlist"("stock_id");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_user_id_stock_id_key" ON "watchlist"("user_id", "stock_id");

-- CreateIndex
CREATE UNIQUE INDEX "disclosures_rcept_no_key" ON "disclosures"("rcept_no");

-- CreateIndex
CREATE INDEX "disclosures_stock_id_idx" ON "disclosures"("stock_id");

-- CreateIndex
CREATE INDEX "disclosures_rcept_dt_idx" ON "disclosures"("rcept_dt");

-- CreateIndex
CREATE INDEX "disclosures_dcm_type_idx" ON "disclosures"("dcm_type");

-- CreateIndex
CREATE INDEX "financial_data_stock_id_idx" ON "financial_data"("stock_id");

-- CreateIndex
CREATE UNIQUE INDEX "financial_data_stock_id_bsns_year_reprt_code_key" ON "financial_data"("stock_id", "bsns_year", "reprt_code");

-- CreateIndex
CREATE INDEX "ai_reports_stock_id_idx" ON "ai_reports"("stock_id");

-- CreateIndex
CREATE INDEX "ai_reports_user_id_idx" ON "ai_reports"("user_id");

-- CreateIndex
CREATE INDEX "ai_conversations_user_id_idx" ON "ai_conversations"("user_id");

-- CreateIndex
CREATE INDEX "ai_conversations_disclosure_id_idx" ON "ai_conversations"("disclosure_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_disclosure_id_idx" ON "notifications"("disclosure_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disclosures" ADD CONSTRAINT "disclosures_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_data" ADD CONSTRAINT "financial_data_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_reports" ADD CONSTRAINT "ai_reports_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_reports" ADD CONSTRAINT "ai_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_disclosure_id_fkey" FOREIGN KEY ("disclosure_id") REFERENCES "disclosures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_disclosure_id_fkey" FOREIGN KEY ("disclosure_id") REFERENCES "disclosures"("id") ON DELETE SET NULL ON UPDATE CASCADE;
