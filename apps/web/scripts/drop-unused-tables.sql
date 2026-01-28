-- 사용하지 않는 테이블 제거
-- Prisma 스키마에 정의되지 않은 테이블들을 삭제합니다

-- 1. 먼저 모든 테이블 목록 확인
DO $$
DECLARE
    r RECORD;
    prisma_tables TEXT[] := ARRAY[
        'users',
        'stocks',
        'watchlist',
        'disclosures',
        'financial_data',
        'ai_reports',
        'ai_conversations',
        'notifications',
        '_prisma_migrations'
    ];
BEGIN
    -- public 스키마의 모든 테이블 순회
    FOR r IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        -- Prisma 테이블이 아닌 경우 삭제
        IF NOT (r.tablename = ANY(prisma_tables)) THEN
            EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
            RAISE NOTICE 'Dropped table: %', r.tablename;
        END IF;
    END LOOP;
END $$;

-- 모든 테이블 목록 출력
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
