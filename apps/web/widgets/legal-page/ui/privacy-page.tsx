import Link from 'next/link'

const EFFECTIVE_DATE = '2026년 2월 21일'

export function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 pb-28 md:pb-10">
      <h1 className="text-2xl font-bold">개인정보처리방침</h1>
      <p className="text-muted-foreground mt-1 text-sm">시행일: {EFFECTIVE_DATE}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold">1. 개인정보의 수집 및 이용 목적</h2>
          <p className="mt-2">
            공시공시(이하 &quot;서비스&quot;)는 다음의 목적을 위해 개인정보를 처리합니다. 처리하고
            있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우
            별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>회원 가입 및 관리: 소셜 로그인을 통한 본인 확인, 서비스 제공</li>
            <li>서비스 제공: 관심 기업 설정, AI 공시 분석 등 맞춤 서비스 제공</li>
            <li>서비스 개선: 서비스 이용 통계 분석 및 개선</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. 수집하는 개인정보 항목</h2>
          <p className="mt-2">서비스는 소셜 로그인을 통해 다음의 정보를 수집합니다.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>카카오 로그인:</strong> 이메일, 닉네임, 프로필 이미지
            </li>
            <li>
              <strong>Google 로그인:</strong> 이메일, 이름, 프로필 이미지
            </li>
            <li>
              <strong>자동 수집 정보:</strong> 접속 IP, 쿠키, 서비스 이용 기록, 접속 일시, 기기
              정보, 브라우저 종류
            </li>
            <li>
              <strong>Google Analytics를 통한 수집:</strong> 페이지 방문 기록, 체류 시간, 유입 경로,
              이벤트 데이터
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. 개인정보의 보유 및 이용 기간</h2>
          <p className="mt-2">
            이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용 목적이 달성되면 지체 없이
            파기합니다. 단, 관계 법령에 의해 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안
            보존합니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>회원 탈퇴 시: 즉시 파기</li>
            <li>로그인 기록: 3개월 (통신비밀보호법 제15조의2, 전기통신사업법 시행령 제41조)</li>
            <li>Google Analytics 데이터: Google의 데이터 보존 정책에 따름 (최대 14개월)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. 개인정보의 제3자 제공</h2>
          <p className="mt-2">
            서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 다음의 경우에는
            예외로 합니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따른 요청</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. 개인정보 처리 위탁</h2>
          <p className="mt-2">
            서비스는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="border-border w-full border-collapse border text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="border-border border px-3 py-2 text-left">수탁업체</th>
                  <th className="border-border border px-3 py-2 text-left">위탁 업무</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-border border px-3 py-2">Google LLC</td>
                  <td className="border-border border px-3 py-2">
                    서비스 이용 통계 분석 (Google Analytics), AI 기반 공시 요약 분석 (Gemini AI)
                  </td>
                </tr>
                <tr>
                  <td className="border-border border px-3 py-2">Kakao Corp.</td>
                  <td className="border-border border px-3 py-2">소셜 로그인 인증 처리</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. 개인정보의 국외 이전</h2>
          <p className="mt-2">서비스는 다음과 같이 개인정보를 국외로 이전하여 처리하고 있습니다.</p>
          <div className="mt-3 overflow-x-auto">
            <table className="border-border w-full border-collapse border text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="border-border border px-3 py-2 text-left">이전받는 자</th>
                  <th className="border-border border px-3 py-2 text-left">이전 국가</th>
                  <th className="border-border border px-3 py-2 text-left">이전 목적</th>
                  <th className="border-border border px-3 py-2 text-left">이전 항목</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-border border px-3 py-2">Google LLC</td>
                  <td className="border-border border px-3 py-2">미국</td>
                  <td className="border-border border px-3 py-2">서비스 이용 분석, AI 공시 요약</td>
                  <td className="border-border border px-3 py-2">
                    쿠키 식별자, 접속 IP, 페이지 방문 기록, 기기 정보
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold">7. 개인정보의 파기 절차 및 방법</h2>
          <p className="mt-2">
            서비스는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을
            때에는 지체 없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 개인정보는 복구 및
            재생이 되지 않도록 기술적 방법을 이용하여 안전하게 삭제합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">8. 이용자의 권리와 행사 방법</h2>
          <p className="mt-2">이용자는 개인정보 주체로서 다음과 같은 권리를 행사할 수 있습니다.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리 정지 요구</li>
          </ul>
          <p className="mt-3">
            위 권리 행사는 개인정보 보호책임자에게 이메일(contact@gongsi-gongsi.kr)로 요청할 수
            있으며, 서비스는 요청을 접수한 날로부터 10일 이내에 처리 결과를 이메일로 통보합니다.
            다만, 법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위해 불가피한 경우 권리 행사가
            제한될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">9. 만 14세 미만 아동의 개인정보</h2>
          <p className="mt-2">
            서비스는 만 14세 미만 아동의 회원가입을 제한합니다. 만 14세 미만 아동의 개인정보를
            수집하지 않으며, 만 14세 미만임이 확인될 경우 해당 계정을 해지하고 수집된 개인정보를
            즉시 파기합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">10. 쿠키 및 자동 수집 장치</h2>
          <p className="mt-2">
            서비스는 이용자의 서비스 이용 편의 제공 및 통계 분석을 위해 쿠키(cookie)를 사용합니다.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>
              <strong>세션 쿠키:</strong> 로그인 상태 유지를 위해 사용되며, 브라우저 종료 시
              삭제됩니다.
            </li>
            <li>
              <strong>분석 쿠키 (Google Analytics):</strong> 서비스 이용 통계 분석을 위해 _ga, _gid
              등의 쿠키가 사용됩니다. 이 쿠키는 이용자의 페이지 방문, 체류 시간 등의 행동 데이터를
              수집하여 Google LLC 서버로 전송합니다.
            </li>
          </ul>
          <p className="mt-3">
            이용자는 웹 브라우저 설정을 통해 쿠키를 차단할 수 있으나, 쿠키를 차단할 경우 로그인 등
            일부 서비스 이용이 제한될 수 있습니다. Google Analytics의 데이터 수집을 거부하려면{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-current"
            >
              Google Analytics 차단 브라우저 부가 기능
            </a>
            을 설치할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">11. 개인정보 보호책임자</h2>
          <p className="mt-2">
            서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의
            불만 처리 및 피해 구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>성명: 김현재</li>
            <li>직책: 서비스 운영자</li>
            <li>이메일: contact@gongsi-gongsi.kr</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">12. 권익 침해 구제 방법</h2>
          <p className="mt-2">
            이용자는 개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의할 수 있습니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              개인정보 침해신고센터 (한국인터넷진흥원):{' '}
              <a
                href="https://privacy.kisa.or.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-current"
              >
                privacy.kisa.or.kr
              </a>
              , 국번없이 118
            </li>
            <li>
              개인정보 분쟁조정위원회:{' '}
              <a
                href="https://www.kopico.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-current"
              >
                www.kopico.go.kr
              </a>
              , 1833-6972
            </li>
            <li>
              개인정보보호위원회:{' '}
              <a
                href="https://www.pipc.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-current"
              >
                www.pipc.go.kr
              </a>
              , 1740
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">13. 개인정보처리방침의 변경</h2>
          <p className="mt-2">
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제
            및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 서비스 내 공지 또는 이메일을 통하여
            고지합니다.
          </p>
        </section>

        <div className="border-border mt-8 border-t pt-6">
          <Link
            href="/terms"
            className="text-muted-foreground text-sm underline hover:text-current"
          >
            이용약관 보기
          </Link>
        </div>
      </div>
    </main>
  )
}
