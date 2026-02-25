# 공시공시 서비스 오픈 체크리스트

## 범례

- ✅ 완료
- ⬜ 미완료
- ⚠️ 부분 완료 / 검토 필요

---

## 1. 법률 및 규정 준수

### 필수 (출시 전)

- ✅ 개인정보처리방침 페이지 (`/privacy`)
- ✅ 이용약관 페이지 (`/terms`)
- ✅ 투자 면책 고지 페이지 (`/disclaimer`)
- ✅ AI 분석 결과 면책 문구 표시
- ✅ 회원탈퇴 기능 구현 (`/mypage`)
- ✅ 개인정보처리방침 누락 항목 보완 — Supabase/Vercel 국외이전, 안전성 확보 조치 항목
- ✅ 유사투자자문업 해당 여부 법률 검토 — 무료 서비스로 유사투자자문업 비해당 (자본시장법 제101조 "대가" 요건 불충족)
- ✅ 개인정보 수집 동의 절차 — 로그인 화면에 이용약관·개인정보처리방침 동의 간주 문구 표시 (계약 체결 법적 근거)

### 권장 (출시 후)

- ✅ AI 생성 콘텐츠 표시 — AI 공시 요약 모달 및 AI 기업 분석 카드에 "AI 생성" 라벨 추가
- ⬜ 사업자 등록 — 광고 수익 발생 시 필수
- ⬜ 이용약관 변경 고지 시스템

---

## 2. 인증 및 보안

### 필수 (출시 전)

- ✅ Google OAuth 프로덕션 전환 — Cloud Console에서 테스트→프로덕션 완료
- ✅ OAuth Consent Screen 앱 정보 설정 — 홈페이지, 개인정보처리방침, 이용약관 URL 등록
- ✅ Supabase RLS 전체 검증 — 모든 테이블 Row Level Security 활성화 완료
- ✅ Service Role Key 보안 확인 — 클라이언트에 노출되지 않음 (서버 API 라우트에서만 사용)

### 권장 (출시 후)

- ✅ CSP (Content-Security-Policy) 헤더 구현
- ✅ HSTS 헤더 추가 — `max-age=63072000; includeSubDomains; preload`
- ✅ Permissions-Policy 헤더 추가 — `camera=(), microphone=(), geolocation=()`
- ⬜ Rate Limiting 확대 — 현재 AI 요약만 적용, 전체 API로 확대
- ⬜ API Key Rotation 계획 수립

---

## 3. 에러 처리 및 모니터링

### 필수 (출시 전)

- ✅ 404 Not Found 페이지 — `app/not-found.tsx`
- ✅ Error 페이지 — `app/error.tsx`
- ✅ Global Error 페이지 — `app/global-error.tsx`
- ✅ Sentry 에러 트래킹 연동 — 프론트엔드/백엔드 에러 자동 캡처

### 권장 (출시 후)

- ⬜ Uptime 모니터링 — UptimeRobot, Checkly 등
- ⬜ Vercel Log Drain 설정
- ⬜ 에러율 급증 시 Slack/이메일 알림
- ⬜ DB 성능 모니터링 — Supabase Dashboard 쿼리 성능 확인

---

## 4. SEO 및 검색 노출

### 완료 항목

- ✅ sitemap.xml (동적 기업 페이지 포함)
- ✅ robots.txt
- ✅ 메타 태그 (Open Graph, Twitter Card)
- ✅ JSON-LD 구조화 데이터 (Organization, WebSite)
- ✅ Google Search Console 등록
- ✅ Naver Search Advisor 등록
- ✅ 파비콘 아이콘 (180x180 PNG)

### 미완료 항목

- ✅ Google Search Console — sitemap.xml 제출 확인
- ✅ Canonical URL 설정 — 루트 layout `alternates.canonical` + 동적 라우트 개별 설정
- ⬜ Naver Search Advisor — sitemap.xml / RSS 제출
- ⬜ Daum 검색 등록
- ⬜ 페이지별 동적 OG 이미지 생성

---

## 5. 인프라 및 배포

### 확인 항목

- ✅ Vercel 배포 설정
- ✅ 커스텀 도메인 연결
- ✅ SSL/TLS 인증서 (Vercel 자동)
- ✅ DB Connection Pooling (PgBouncer)
- ⬜ Vercel 환경변수 확인 — 모든 시크릿이 Production 환경에 설정되었는지
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `DATABASE_URL`
  - `DIRECT_URL`
  - `DART_API_KEY`
  - `GEMINI_API_KEY`
  - `NEXT_PUBLIC_GA_ID`
- ⬜ Vercel Preview Deployment 보호 — 프리뷰 배포에 인증 적용
- ⬜ DB 백업 전략 — Supabase PITR(Point-in-Time Recovery) 활성화 확인
- ⬜ Supabase Network Restrictions — 허용 IP 제한

---

## 6. 분석 및 마케팅

### 완료 항목

- ✅ Google Analytics 4 연동
- ✅ Vercel Web Analytics
- ✅ Vercel Speed Insights

### 미완료 항목

- ✅ GA4 전환 이벤트 설정 — 관심종목 추가/제거, AI 공시 요약, AI 기업 분석, 검색
- ⬜ Google Search Console 검색 성과 모니터링

---

## 7. 성능 최적화

### 완료 항목

- ✅ 폰트 최적화 (Pretendard local, display: swap)
- ✅ TanStack Query 서버 상태 캐싱
- ✅ Bundle Size 분석 — `@next/bundle-analyzer` 설정 완료

### 미완료 항목

- ⬜ Core Web Vitals 측정 — LCP < 2.5s, INP < 200ms, CLS < 0.1
- ⬜ API 캐싱 전략 통일 — 일부 엔드포인트만 Cache-Control 설정됨
- ⬜ `next/image` 사용 확인 — 외부 이미지에 Image 컴포넌트 적용

---

## 8. UX 및 접근성

### 완료 항목

- ✅ `<html lang="ko">` 설정
- ✅ 반응형 디자인 (모바일/PC)
- ✅ 다크모드 지원
- ✅ 로딩 Skeleton UI

### 미완료 항목

- ⬜ 키보드 내비게이션 확인
- ⬜ 스크린 리더 호환성 (ARIA 레이블)
- ⬜ 색상 대비 WCAG AA 기준 확인
- ⬜ 쿠키 동의 배너

---

## 9. 운영 준비

- ⬜ 서비스 이메일 수신 확인 — `contact@gongsi-gongsi.kr` 작동 여부
- ⬜ DART API 일일 호출 한도 확인 및 모니터링
- ⬜ Gemini API 사용량 관리 — 사용자당/일일 요청 한도
- ⬜ Vercel/Supabase 비용 알림 설정
- ⬜ 장애 대응 절차 문서화
- ⬜ 사용자 피드백 채널 마련

---

## 출시 전 최종 점검 순서

1. ~~**Google OAuth 프로덕션 전환**~~ ✅
2. ~~**Supabase RLS 전체 검증**~~ ✅
3. ~~**에러 페이지 구현** (404, 500)~~ ✅
4. ~~**Sentry 연동**~~ ✅
5. ~~**개인정보처리방침 보완**~~ ✅
6. **Vercel 환경변수 전체 확인**
7. ~~**검색 엔진 sitemap 제출**~~ ✅
8. **서비스 전체 기능 테스트**

---

마지막 업데이트: 2026-02-24
