/*
  Warnings:

  - You are about to drop the `user_disclosure_summaries` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NoticeCategory" AS ENUM ('NOTICE', 'UPDATE', 'EVENT', 'MAINTENANCE');

-- DropForeignKey
ALTER TABLE "user_disclosure_summaries" DROP CONSTRAINT "user_disclosure_summaries_disclosure_id_fkey";

-- DropForeignKey
ALTER TABLE "user_disclosure_summaries" DROP CONSTRAINT "user_disclosure_summaries_user_id_fkey";

-- DropTable
DROP TABLE "user_disclosure_summaries";

-- CreateTable
CREATE TABLE "admin_users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "image_url" VARCHAR(500) NOT NULL,
    "image_mobile_url" VARCHAR(500),
    "link_url" VARCHAR(500),
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notices" (
    "id" UUID NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "category" "NoticeCategory" NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "banners_is_active_order_idx" ON "banners"("is_active", "order");

-- CreateIndex
CREATE INDEX "notices_category_idx" ON "notices"("category");

-- CreateIndex
CREATE INDEX "notices_is_published_idx" ON "notices"("is_published");

-- AddForeignKey
ALTER TABLE "notices" ADD CONSTRAINT "notices_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
