-- CreateTable
CREATE TABLE "stocks" (
    "id" UUID NOT NULL,
    "stock_code" VARCHAR(10) NOT NULL,
    "corp_code" VARCHAR(8) NOT NULL,
    "corp_name" VARCHAR(100) NOT NULL,
    "market" VARCHAR(20),
    "sector" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stocks_stock_code_key" ON "stocks"("stock_code");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_corp_code_key" ON "stocks"("corp_code");

-- CreateIndex
CREATE INDEX "stocks_stock_code_idx" ON "stocks"("stock_code");

-- CreateIndex
CREATE INDEX "stocks_corp_code_idx" ON "stocks"("corp_code");

-- CreateIndex
CREATE INDEX "stocks_corp_name_idx" ON "stocks"("corp_name");
