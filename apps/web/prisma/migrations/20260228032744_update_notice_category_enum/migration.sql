-- 1. 기존 NOTICE, UPDATE → SERVICE 데이터 변환
UPDATE "Notice" SET "category" = 'SERVICE' WHERE "category" IN ('NOTICE', 'UPDATE');

-- 2. 새 enum 타입 생성 (SERVICE, EVENT, MAINTENANCE)
CREATE TYPE "NoticeCategory_new" AS ENUM ('SERVICE', 'EVENT', 'MAINTENANCE');

-- 3. 컬럼을 새 enum 타입으로 변환
ALTER TABLE "Notice"
  ALTER COLUMN "category" TYPE "NoticeCategory_new"
  USING "category"::text::"NoticeCategory_new";

-- 4. 기존 enum 삭제
DROP TYPE "NoticeCategory";

-- 5. 새 enum 이름 변경
ALTER TYPE "NoticeCategory_new" RENAME TO "NoticeCategory";
