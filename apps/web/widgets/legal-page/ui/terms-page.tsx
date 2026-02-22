import Link from 'next/link'

const EFFECTIVE_DATE = '2026년 2월 21일'

export function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 pb-28 md:pb-10">
      <h1 className="text-2xl font-bold">이용약관</h1>
      <p className="text-muted-foreground mt-1 text-sm">시행일: {EFFECTIVE_DATE}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold">제1조 (목적)</h2>
          <p className="mt-2">
            이 약관은 공시공시(이하 &quot;서비스&quot;)가 제공하는 AI 기반 기업 공시 분석 서비스의
            이용 조건 및 절차, 이용자와 서비스 간의 권리·의무 및 책임사항 등을 규정함을 목적으로
            합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">제2조 (정의)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>&quot;서비스&quot;</strong>란 공시공시가 제공하는 기업 공시 정보 분석, AI
              요약, 관심 기업 설정 등 일체의 서비스를 말합니다.
            </li>
            <li>
              <strong>&quot;이용자&quot;</strong>란 이 약관에 따라 서비스가 제공하는 서비스를
              이용하는 회원을 말합니다.
            </li>
            <li>
              <strong>&quot;회원&quot;</strong>이란 서비스에 소셜 계정으로 로그인하여 서비스를
              이용하는 자를 말합니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">제3조 (약관의 효력 및 변경)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이
              발생합니다.
            </li>
            <li>
              서비스는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위에서 약관을 변경할
              수 있으며, 변경된 약관은 적용일자 7일 전부터 서비스 내 공지 또는 이메일을 통해
              고지합니다. 다만, 이용자에게 불리한 변경의 경우에는 30일 전부터 고지합니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold">제4조 (회원가입 및 계정)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>이용자는 카카오 또는 Google 소셜 계정을 통해 회원가입을 할 수 있습니다.</li>
            <li>
              이용자는 소셜 로그인 진행 시 이 약관과 개인정보처리방침의 내용을 확인하고 동의한 후
              서비스를 이용할 수 있습니다.
            </li>
            <li>
              만 14세 미만의 이용자는 서비스에 가입할 수 없습니다. 만 14세 미만임이 확인될 경우
              서비스는 해당 계정을 해지할 수 있습니다.
            </li>
            <li>
              회원은 언제든지 서비스 내에서 탈퇴를 요청할 수 있으며, 서비스는 즉시 회원 탈퇴를
              처리합니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold">제5조 (서비스의 제공)</h2>
          <p className="mt-2">서비스는 다음과 같은 기능을 제공합니다.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>기업 공시 정보 조회 및 검색</li>
            <li>AI 기반 공시 요약 및 분석 (Google Gemini AI 활용)</li>
            <li>관심 기업 설정 및 맞춤 서비스 제공</li>
            <li>재무제표 조회 및 분석</li>
            <li>기타 서비스가 정하는 서비스</li>
          </ul>
          <p className="mt-2">
            본 서비스의 AI 분석 기능은 Google LLC의 Gemini AI를 활용하여 제공됩니다. AI 분석 결과는
            알고리즘에 의해 자동 생성된 것으로, 오류 또는 누락이 있을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">제6조 (서비스의 변경 및 중단)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              서비스는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.
            </li>
            <li>
              서비스는 천재지변, 시스템 장애 등 불가항력적인 사유가 발생한 경우 서비스 제공을
              일시적으로 중단할 수 있습니다.
            </li>
            <li>
              서비스를 영구 종료하는 경우, 종료 30일 전에 서비스 내 공지 또는 이메일을 통해
              이용자에게 고지하며, 보유 중인 개인정보는 종료 후 지체 없이 안전하게 파기합니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold">제7조 (이용자의 의무)</h2>
          <p className="mt-2">이용자는 다음 행위를 하여서는 안 됩니다.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>서비스의 정보를 무단으로 수집, 이용, 배포하는 행위</li>
            <li>서비스의 운영을 방해하는 행위</li>
            <li>타인의 개인정보를 침해하는 행위</li>
            <li>서비스를 이용하여 법령에 위반되는 행위를 하는 것</li>
            <li>기타 서비스가 정한 이용 규정을 위반하는 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">제8조 (투자 관련 면책)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              서비스는 자본시장과 금융투자업에 관한 법률에 따른 투자자문업자 또는 투자일임업자가
              아니며, 서비스에서 제공하는 정보는 투자 권유 또는 투자 자문을 목적으로 하지 않습니다.
            </li>
            <li>
              AI 분석 결과는 알고리즘에 의해 자동 생성된 것으로, 전문 투자자문사의 의견이 아닙니다.
              분석 결과에는 오류, 누락 또는 부정확한 내용이 포함될 수 있으며, 투자 결정에 대한
              책임은 전적으로 이용자 본인에게 있습니다.
            </li>
            <li>
              서비스에서 제공하는 공시 정보는 금융감독원 DART(전자공시시스템) 등 공개 데이터를
              기반으로 하며, 원본 데이터의 오류, 지연, 누락에 대한 책임을 지지 않습니다. 투자 판단을
              위한 공시 원문은 반드시{' '}
              <a
                href="https://dart.fss.or.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-current"
              >
                DART(dart.fss.or.kr)
              </a>
              에서 직접 확인하시기 바랍니다.
            </li>
            <li>
              서비스는 이용자가 서비스를 이용하여 얻은 정보에 대한 정확성, 신뢰성, 완전성을 보증하지
              않으며, 서비스 이용으로 인한 투자 손실에 대해 어떠한 법적·경제적 책임도 지지 않습니다.
            </li>
            <li>
              서비스는 천재지변 또는 이에 준하는 불가항력으로 인해 서비스를 제공할 수 없는 경우
              책임이 면제됩니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold">제9조 (저작권 및 지적재산권)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>서비스가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 서비스에 귀속됩니다.</li>
            <li>
              서비스에서 제공하는 공시 원본 데이터의 저작권은 해당 공시를 제출한 법인 또는
              금융감독원에 있으며, 서비스는 이를 분석·요약하여 제공합니다.
            </li>
            <li>
              이용자는 서비스를 이용함으로써 얻은 정보를 서비스의 사전 승낙 없이 복제, 송신, 출판,
              배포, 방송 등 기타 방법으로 이용하거나 제3자에게 이용하게 할 수 없습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold">제10조 (분쟁 해결)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>서비스와 이용자 간 발생한 분쟁에 대해서는 대한민국 법을 적용합니다.</li>
            <li>
              서비스 이용과 관련하여 발생한 분쟁에 대한 소송은 민사소송법에 따른 관할 법원에
              제기합니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold">부칙</h2>
          <p className="mt-2">이 약관은 {EFFECTIVE_DATE}부터 시행합니다.</p>
        </section>

        <div className="border-border mt-8 border-t pt-6">
          <Link
            href="/privacy"
            className="text-muted-foreground text-sm underline hover:text-current"
          >
            개인정보처리방침 보기
          </Link>
        </div>
      </div>
    </main>
  )
}
