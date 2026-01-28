-- 현재 DB의 모든 테이블 목록
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
