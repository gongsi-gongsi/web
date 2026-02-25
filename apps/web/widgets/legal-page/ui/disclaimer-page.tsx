import Link from 'next/link'

const EFFECTIVE_DATE = '2026년 2월 22일'

export function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 pb-28 md:pb-10">
      <h1 className="text-2xl font-bold">투자 면책 고지</h1>
      <p className="mt-1 text-sm text-muted-foreground">시행일: {EFFECTIVE_DATE}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold">1. 서비스 성격</h2>
          <p className="mt-2">
            공시공시(이하 &quot;서비스&quot;)는 DART(전자공시시스템)에 공개된 기업 공시 정보를 AI
            기술을 활용하여 요약·분석하는 정보 제공 서비스입니다. 본 서비스는{' '}
            <strong>
              「자본시장과 금융투자업에 관한 법률」에 따른 투자자문업 또는 투자일임업에 해당하지
              않으며
            </strong>
            , 금융위원회 또는 금융감독원에 등록된 투자자문사가 아닙니다.
          </p>
          <p className="mt-2">
            본 서비스는 불특정 다수인을 대상으로 하는{' '}
            <strong>&lsquo;정보 제공 서비스&rsquo;</strong>이며, 개별적인 투자 상담이나 1:1 자문
            행위를 하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. 투자 권유 아님</h2>
          <p className="mt-2">
            본 서비스에서 제공하는 모든 정보(AI 요약, 감성 분석, 핵심 수치, 기업 분석 등)는{' '}
            <strong>특정 금융투자상품의 매수·매도 또는 투자 전략에 대한 권유가 아닙니다.</strong>{' '}
            제공되는 정보는 참고 목적으로만 활용되어야 하며, 어떠한 경우에도 투자 의사결정의 유일한
            근거로 사용되어서는 안 됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. AI 생성 콘텐츠</h2>
          <p className="mt-2">
            본 서비스의 분석 결과는 <strong>인공지능(AI)에 의해 자동 생성</strong>됩니다. AI 분석은
            다음과 같은 한계를 가질 수 있습니다:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>공시 원문의 해석 오류 또는 맥락 누락</li>
            <li>감성 분석(호재/악재/중립) 판단의 부정확성</li>
            <li>핵심 수치의 추출 또는 계산 오류</li>
            <li>최신 시장 상황이나 외부 요인의 미반영</li>
            <li>데이터 학습 시점에 따른 정보의 시차</li>
          </ul>
          <p className="mt-2">
            AI가 생성한 분석 결과는 전문 애널리스트의 분석을 대체할 수 없으며, 반드시{' '}
            <Link
              href="https://dart.fss.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              DART 전자공시시스템
            </Link>
            의 원문을 직접 확인하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. 투자 책임</h2>
          <p className="mt-2">
            <strong>투자 판단과 그에 따른 결과에 대한 모든 책임은 이용자 본인에게 있습니다.</strong>{' '}
            본 서비스는 이용자의 투자 결과에 대해 어떠한 법적 책임도 부담하지 않습니다. 투자는 원금
            손실의 위험이 있으며, 과거의 실적이 미래의 수익을 보장하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. 정보의 정확성</h2>
          <p className="mt-2">
            본 서비스는 제공하는 정보의 정확성, 완전성, 적시성을 보장하지 않습니다. DART에서
            제공하는 원본 데이터의 오류, 지연, 누락이 발생할 수 있으며, AI 처리 과정에서 추가적인
            오류가 발생할 수 있습니다. 중요한 투자 결정 시에는 반드시 공시 원문과 다수의 신뢰할 수
            있는 출처를 교차 확인하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. 데이터 출처 및 제3자 정보</h2>
          <p className="mt-2">
            본 서비스는{' '}
            <Link
              href="https://opendart.fss.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              금융감독원 전자공시시스템(DART)의 Open API
            </Link>
            를 활용하며, 제공되는 정보의 원천 데이터는 금융감독원 및 각 공시 기업에 저작권이
            있습니다.
          </p>
          <p className="mt-2">
            본 서비스에서 제공하는 기업 정보, 재무 데이터, 주가 정보 등은 DART, 한국거래소 등 외부
            기관의 데이터에 기반합니다. 해당 기관의 데이터 정책 변경, 서비스 중단 등에 의해 정보
            제공이 제한될 수 있으며, 이에 대해 서비스는 책임을 부담하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">7. 관련 법령 안내</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              자본시장과 금융투자업에 관한 법률 (
              <Link
                href="https://law.go.kr/LSW/lsInfoP.do?lsiSeq=277365"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                법령 보기
              </Link>
              )
            </li>
            <li>
              전자금융거래법 (
              <Link
                href="https://law.go.kr/LSW/lsInfoP.do?lsiSeq=258801"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                법령 보기
              </Link>
              )
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">8. 문의</h2>
          <p className="mt-2">
            본 면책 고지에 대한 문의는{' '}
            <Link href="mailto:loma1016@gmail.com" className="text-primary underline">
              loma1016@gmail.com
            </Link>
            로 연락해 주시기 바랍니다.
          </p>
        </section>
      </div>
    </main>
  )
}
