-- 공지사항 카테고리 enum 생성 (SERVICE, EVENT, MAINTENANCE)
CREATE TYPE "NoticeCategory" AS ENUM ('SERVICE', 'EVENT', 'MAINTENANCE');

-- 공지사항 테이블 생성
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

-- 인덱스 생성
CREATE INDEX "notices_category_idx" ON "notices"("category");
CREATE INDEX "notices_is_published_idx" ON "notices"("is_published");

-- 외래키 추가
ALTER TABLE "notices" ADD CONSTRAINT "notices_author_id_fkey"
    FOREIGN KEY ("author_id") REFERENCES "admin_users"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
