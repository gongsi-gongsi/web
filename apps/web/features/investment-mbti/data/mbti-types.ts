export type MbtiType =
  | 'GSFR'
  | 'GSFI'
  | 'GSTR'
  | 'GSTI'
  | 'GLFR'
  | 'GLFI'
  | 'GLTR'
  | 'GLTI'
  | 'VSFR'
  | 'VSFI'
  | 'VSTR'
  | 'VSTI'
  | 'VLFR'
  | 'VLFI'
  | 'VLTR'
  | 'VLTI'

export interface MbtiTypeData {
  code: MbtiType
  /** 유형 대표명 (예: '저격수형') */
  name: string
  /** 유형 부제 (예: '퀀트 스나이퍼') */
  subtitle: string
  /** 한 줄 태그라인 */
  tagline: string
  /** 유형 설명 */
  description: string
  strengths: string[]
  weaknesses: string[]
  /** "이 성향의 투자자들이 주로 관심 갖는 경향" 섹션 텍스트 */
  tendency: string
  /** Tailwind bg 클래스 (테마색) */
  themeColor: string
  /** 이미지 경로 — public/images/mbti/{TYPE}.png */
  imagePath: string
  /** 이미지 없을 때 fallback 이모지 */
  emoji: string
}

export const MBTI_TYPES: Record<MbtiType, MbtiTypeData> = {
  GSFR: {
    code: 'GSFR',
    name: '저격수형',
    subtitle: '퀀트 스나이퍼',
    tagline: '숫자로 검증한 타이밍에만 방아쇠를 당긴다',
    description:
      '기업 실적과 밸류에이션 데이터를 분석하여 단기 이익실현 기회를 체계적으로 포착. 감정 개입 없이 수치 기반으로 엄격하게 매매합니다.',
    strengths: ['체계적 분석', '손절 원칙 준수', '감정 매매 최소화'],
    weaknesses: ['과도한 분석에 따른 기회 손실 가능'],
    tendency:
      '실적 발표 시즌(어닝시즌) 전후 급등락이 예상되는 섹터, 영업이익 개선이 수치로 확인되는 중소형주, 이벤트 드리븐(실적·M&A·공시) 특성의 종목에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-amber-500',
    imagePath: '/images/mbti/GSFR.png',
    emoji: '🎯',
  },
  GSFI: {
    code: 'GSFI',
    name: '서퍼형',
    subtitle: '뉴스 서퍼',
    tagline: '기업 분석은 하되, 타이밍은 감각으로',
    description:
      '기업 기본기를 파악하지만 최종 매매 타이밍은 뉴스·공시·트렌드 감각으로 결정. 빠른 판단력이 강점입니다.',
    strengths: ['정보 통합력', '빠른 의사결정'],
    weaknesses: ['직관 과신으로 인한 손실 위험'],
    tendency:
      '핫이슈·테마주·공시 직후 단기 급등 가능성 있는 종목, 실적 서프라이즈 직후 모멘텀 유지 종목, 정책 수혜 발표 직후 관련 섹터에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-sky-500',
    imagePath: '/images/mbti/GSFI.png',
    emoji: '🏄',
  },
  GSTR: {
    code: 'GSTR',
    name: '마법사형',
    subtitle: '차트 전략가',
    tagline: '차트가 말하면 규칙대로 진입한다',
    description:
      '기술적 분석 시스템을 구축하고 신호에 따라 규칙적으로 매매. 손절·익절 기준을 엄수합니다.',
    strengths: ['일관된 매매 원칙', '리스크 관리 체계적'],
    weaknesses: ['돌발 이슈에 대한 유연성 부족'],
    tendency:
      '거래량이 풍부하고 기술적 패턴이 뚜렷한 대형주·우량주, 섹터 로테이션 흐름 내 선도주, 변동성이 높은 ETF·파생상품에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-purple-600',
    imagePath: '/images/mbti/GSTR.png',
    emoji: '🔮',
  },
  GSTI: {
    code: 'GSTI',
    name: '라이더형',
    subtitle: '모멘텀 라이더',
    tagline: '상승 흐름에 올라타는 것이 전략이다',
    description:
      '차트 패턴과 직관을 결합하여 모멘텀 강한 종목에 빠르게 진입. 시장 흐름 파악 능력이 탁월합니다.',
    strengths: ['추세 포착력', '빠른 대응'],
    weaknesses: ['추격매수·충동매매 위험', '변동성 리스크'],
    tendency:
      '강한 상승 추세에 있는 테마주·소형성장주, 거래량 폭발 신호 이후 모멘텀 지속 종목, 시장 주도 테마 내 급등 후보군에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-red-500',
    imagePath: '/images/mbti/GSTI.png',
    emoji: '🏍️',
  },
  GLFR: {
    code: 'GLFR',
    name: '천문학자형',
    subtitle: '성장주 사냥꾼',
    tagline: '미래 가치를 지금 사서 천천히 기다린다',
    description:
      '실적·사업모델 분석을 통해 고성장 가능성 기업을 발굴하고 장기 보유. 체계적 포트폴리오 관리가 특징입니다.',
    strengths: ['복리 효과', '높은 기대수익', '체계적 관리'],
    weaknesses: ['장기 보유 중 단기 손실 감내 어려움'],
    tendency:
      'AI·2차전지·바이오·신재생에너지 등 고성장 섹터의 선도 기업, 매출 성장률 높은 중소·중견 성장주, 해외 나스닥 성장주에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-indigo-600',
    imagePath: '/images/mbti/GLFR.png',
    emoji: '🔭',
  },
  GLFI: {
    code: 'GLFI',
    name: '발굴자형',
    subtitle: '비전 발굴자',
    tagline: '좋은 기업이라는 확신이 오면 길게 간다',
    description:
      '기업 분석을 기반으로 하되 최종 투자 결정은 직관적 확신에 의존. 남들이 모를 때 선제 발굴하는 스타일입니다.',
    strengths: ['남다른 종목 발굴', '조기 진입'],
    weaknesses: ['직관에 의한 편향', '과신 위험'],
    tendency:
      '아직 시장에서 주목받지 못한 저평가 성장주, 새로운 사업모델을 가진 중소형 기업, 해외 동종업체 대비 저평가된 국내 종목에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-amber-600',
    imagePath: '/images/mbti/GLFI.png',
    emoji: '⛏️',
  },
  GLTR: {
    code: 'GLTR',
    name: '건축가형',
    subtitle: '체계적 성장 투자자',
    tagline: '좋은 기업에도 좋은 타이밍에 진입한다',
    description:
      '장기 성장 종목이라도 기술적 분석으로 최적 진입 타이밍 포착. 원칙에 따른 분할매수가 특징입니다.',
    strengths: ['장기 성장 + 기술적 타이밍 최적화'],
    weaknesses: ['완벽한 타이밍 추구로 기회 놓칠 수 있음'],
    tendency:
      '장기 우상향 추세의 업종 대표주, 조정 후 추세 재개 구간의 성장주, 기술적 지지선에서 장기 홀딩 가능한 섹터 대표 종목에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-orange-500',
    imagePath: '/images/mbti/GLTR.png',
    emoji: '🏗️',
  },
  GLTI: {
    code: 'GLTI',
    name: '항해사형',
    subtitle: '트렌드 장기 투자자',
    tagline: '시대의 흐름을 읽고 차트로 진입 시점을 잡는다',
    description:
      '시대적 메가트렌드를 직관으로 포착하고, 차트 분석으로 진입 타이밍을 결정. 장기 추세에 편승하는 스타일입니다.',
    strengths: ['트렌드 포착력', '장기 수익 추구'],
    weaknesses: ['섹터 과열 시 고점 매수 위험'],
    tendency:
      '글로벌 메가트렌드(AI, 전기차, 반도체) 관련 성장주, 시장 테마 초기 진입 후 장기 보유 전략, 글로벌 ETF 및 섹터 ETF에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-cyan-500',
    imagePath: '/images/mbti/GLTI.png',
    emoji: '⛵',
  },
  VSFR: {
    code: 'VSFR',
    name: '검도가형',
    subtitle: '보수적 스윙 트레이더',
    tagline: '단기로 매매하되, 안전한 종목만 고른다',
    description:
      '재무 건전성이 검증된 기업을 선별 후 단기 스윙 트레이딩. 엄격한 손절 원칙으로 리스크를 관리합니다.',
    strengths: ['낮은 리스크', '안정적 종목 선택'],
    weaknesses: ['수익률 제한', '안전 편향'],
    tendency:
      '대형우량주의 단기 조정 후 반등 구간, 배당수익률이 높은 고배당주의 단기 매매 기회, 시가총액 상위 종목의 단기 이벤트 매매에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-slate-600',
    imagePath: '/images/mbti/VSFR.png',
    emoji: '⚔️',
  },
  VSFI: {
    code: 'VSFI',
    name: '낚시꾼형',
    subtitle: '안정형 모멘텀 포착자',
    tagline: '믿을 수 있는 종목의 짧은 기회를 빠르게 잡는다',
    description:
      '검증된 대형주·우량주 위주로 직관적 단기 기회 포착. 안정성과 기동성을 동시에 추구합니다.',
    strengths: ['리스크 제한', '빠른 대응'],
    weaknesses: ['직관 과신', '기회비용'],
    tendency:
      '코스피 대형주의 실적발표 전후 단기 이벤트, 안정적 현금흐름 기업의 일시 조정 구간, 공기업·금융주의 배당락 전후 단기 전략에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-green-600',
    imagePath: '/images/mbti/VSFI.png',
    emoji: '🎣',
  },
  VSTR: {
    code: 'VSTR',
    name: '바둑기사형',
    subtitle: '안전 차트 트레이더',
    tagline: '정해진 원칙 안에서 가장 안전한 수만 둡니다',
    description:
      '기술적 분석 원칙에 따라 안전한 구간에서만 단기 매매. 손실 제한을 최우선으로 합니다.',
    strengths: ['체계적 리스크 관리', '일관성'],
    weaknesses: ['보수적 기회 접근으로 수익률 제한'],
    tendency:
      '지지/저항 구간이 명확한 박스권 종목, 변동성이 낮고 유동성이 풍부한 대형주 기술적 매매, 인버스·채권 ETF 등 헤지 수단에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-zinc-600',
    imagePath: '/images/mbti/VSTR.png',
    emoji: '⚫',
  },
  VSTI: {
    code: 'VSTI',
    name: '기상예보관형',
    subtitle: '직관형 차트 안전 투자자',
    tagline: '시장의 날씨를 읽고, 맑을 때만 나섭니다',
    description:
      '차트 분석을 기반으로 하되 감각적으로 안전하다고 느끼는 구간에서 단기 진입. 불확실성을 회피합니다.',
    strengths: ['직관적 리스크 감지', '손실 회피'],
    weaknesses: ['과도한 안전 추구로 기회 손실'],
    tendency:
      '이동평균선 수렴·정배열 구간의 안정주, 거래량 수반한 박스권 돌파 종목, 코스피200 구성 대형주의 안전한 기술적 매매에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-sky-400',
    imagePath: '/images/mbti/VSTI.png',
    emoji: '🌤️',
  },
  VLFR: {
    code: 'VLFR',
    name: '현인형',
    subtitle: '가치 장기 투자자',
    tagline: '좋은 기업을 적정 가격에 사서 오래 기다린다',
    description:
      '재무 건전성·배당·해자(경쟁 우위)를 분석하여 저평가 우량주에 장기 투자. 가장 고전적인 가치투자 스타일입니다.',
    strengths: ['리스크 최소화', '장기 복리', '심리적 안정'],
    weaknesses: ['단기 시장 트렌드 수익 기회 놓침'],
    tendency:
      'PBR 1배 이하의 저평가 우량주, 꾸준한 배당 성장 역사를 가진 고배당주, 독과점 시장 지위를 가진 소비재·금융·통신주에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-rose-700',
    imagePath: '/images/mbti/VLFR.png',
    emoji: '🦉',
  },
  VLFI: {
    code: 'VLFI',
    name: '정원사형',
    subtitle: '직관형 가치 투자자',
    tagline: '이 기업은 좋다는 확신이 오면 길게 안고 간다',
    description:
      '기업 분석은 하되, 최종 결정은 직관적 확신에 의존. 안정적인 기업 위주로 장기 보유하는 스타일입니다.',
    strengths: ['편안한 투자 심리', '안정 종목 집중'],
    weaknesses: ['직관 편향', '정보 업데이트 부족'],
    tendency:
      '브랜드 파워가 강한 소비재 대기업, 안정적 수익 구조의 리츠(REITs)·인프라 기업, 국내외 지수 추종 ETF에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-green-500',
    imagePath: '/images/mbti/VLFI.png',
    emoji: '🌱',
  },
  VLTR: {
    code: 'VLTR',
    name: '시계공형',
    subtitle: '인덱스 원칙 투자자',
    tagline: '시장 평균을 이기기보다 안정적 성장을 추구한다',
    description:
      '기술적 타이밍을 활용한 적립식 투자. 체계적 자산배분과 리밸런싱으로 리스크를 관리합니다.',
    strengths: ['감정 배제', '체계적 자산관리'],
    weaknesses: ['초과수익 제한'],
    tendency:
      '코스피200·S&P500·나스닥100 지수 추종 ETF, 기술적 타이밍을 이용한 ETF 분할매수, 채권+주식 혼합 포트폴리오 자산배분에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-blue-600',
    imagePath: '/images/mbti/VLTR.png',
    emoji: '⚙️',
  },
  VLTI: {
    code: 'VLTI',
    name: '등산가형',
    subtitle: '직관형 장기 안전 투자자',
    tagline: '시장 분위기를 읽으며 안전하게 장기 적립',
    description:
      '시장 전반의 흐름을 직관적으로 파악하며 안전한 장기 투자 기회를 포착. 과욕 없이 꾸준히 나아갑니다.',
    strengths: ['심리적 안정', '장기 적립 습관'],
    weaknesses: ['시장 고점 판단 어려움', '타이밍 편향'],
    tendency:
      '시장 조정기마다 분할 매수 전략을 취하는 대형주·ETF, 거시경제 흐름 연동 섹터 (금·원자재·리츠), 배당+성장 균형형 포트폴리오에 관심을 갖는 경향이 있습니다.',
    themeColor: 'bg-teal-500',
    imagePath: '/images/mbti/VLTI.png',
    emoji: '🏔️',
  },
}

export const ALL_MBTI_TYPES = Object.keys(MBTI_TYPES) as MbtiType[]

/**
 * 문자열이 유효한 MbtiType인지 검사합니다.
 * @param value - 검사할 문자열
 * @returns value가 16개 유형 중 하나이면 true
 */
export function isMbtiType(value: string): value is MbtiType {
  return value in MBTI_TYPES
}
