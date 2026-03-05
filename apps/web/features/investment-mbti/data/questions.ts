export type Axis = 'GV' | 'SL' | 'FT' | 'RI'
export type Tendency = 'G' | 'V' | 'S' | 'L' | 'F' | 'T' | 'R' | 'I'

export interface QuestionOption {
  text: string
  tendency: Tendency
  score: number
}

export interface Question {
  id: number
  axis: Axis
  weight: 1 | 2
  isKeyQuestion: boolean
  text: string
  options: {
    A: QuestionOption
    B: QuestionOption
  }
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    axis: 'GV',
    weight: 2,
    isKeyQuestion: true,
    text: '투자에서 가장 중요하게 생각하는 것은 무엇인가요?',
    options: {
      A: { text: '높은 수익률 가능성을 추구한다', tendency: 'G', score: 2 },
      B: { text: '원금 손실을 최소화한다', tendency: 'V', score: 2 },
    },
  },
  {
    id: 2,
    axis: 'GV',
    weight: 1,
    isKeyQuestion: false,
    text: '보유 종목이 20% 하락했을 때 당신의 반응은?',
    options: {
      A: { text: '추가 매수 기회로 본다', tendency: 'G', score: 1 },
      B: { text: '더 떨어지기 전에 손절을 고민한다', tendency: 'V', score: 1 },
    },
  },
  {
    id: 3,
    axis: 'GV',
    weight: 1,
    isKeyQuestion: false,
    text: '신규 상장(IPO) 종목에 대한 나의 태도는?',
    options: {
      A: { text: '공모주 청약에 적극 참여한다', tendency: 'G', score: 1 },
      B: { text: '상장 후 충분히 검증된 뒤 관심 갖는다', tendency: 'V', score: 1 },
    },
  },
  {
    id: 4,
    axis: 'GV',
    weight: 2,
    isKeyQuestion: false,
    text: '투자 포트폴리오에서 허용 가능한 최대 손실 수준은?',
    options: {
      A: { text: '30% 이상도 감수할 수 있다', tendency: 'G', score: 2 },
      B: { text: '10% 이내로 제한하고 싶다', tendency: 'V', score: 2 },
    },
  },
  {
    id: 5,
    axis: 'SL',
    weight: 2,
    isKeyQuestion: true,
    text: '주식을 평균 얼마나 보유하나요 (또는 보유할 계획인가요)?',
    options: {
      A: { text: '며칠~몇 주 이내', tendency: 'S', score: 2 },
      B: { text: '6개월 이상', tendency: 'L', score: 2 },
    },
  },
  {
    id: 6,
    axis: 'SL',
    weight: 1,
    isKeyQuestion: false,
    text: '주식 시장을 하루에 얼마나 자주 확인하나요?',
    options: {
      A: { text: '수시로 (5회 이상)', tendency: 'S', score: 1 },
      B: { text: '가끔 (1~2회 이하)', tendency: 'L', score: 1 },
    },
  },
  {
    id: 7,
    axis: 'SL',
    weight: 2,
    isKeyQuestion: false,
    text: '투자 시 가장 중요하게 보는 것은?',
    options: {
      A: { text: '단기 주가 흐름과 모멘텀', tendency: 'S', score: 2 },
      B: { text: '기업의 장기 성장 잠재력', tendency: 'L', score: 2 },
    },
  },
  {
    id: 8,
    axis: 'SL',
    weight: 1,
    isKeyQuestion: false,
    text: '시장이 갑자기 큰 폭으로 하락할 때 나의 행동은?',
    options: {
      A: { text: '빠르게 대응하여 포지션을 조정한다', tendency: 'S', score: 1 },
      B: { text: '장기적 관점을 유지하며 흔들리지 않는다', tendency: 'L', score: 1 },
    },
  },
  {
    id: 9,
    axis: 'FT',
    weight: 2,
    isKeyQuestion: true,
    text: '주식 매수를 결정할 때 주로 활용하는 정보는?',
    options: {
      A: { text: '재무제표, 실적, 사업모델 등 기업 분석', tendency: 'F', score: 2 },
      B: { text: '차트 패턴, 거래량, 이동평균선 등 기술적 지표', tendency: 'T', score: 2 },
    },
  },
  {
    id: 10,
    axis: 'FT',
    weight: 1,
    isKeyQuestion: false,
    text: '기업을 처음 볼 때 가장 먼저 확인하는 것은?',
    options: {
      A: { text: '영업이익, PER, PBR 등 밸류에이션', tendency: 'F', score: 1 },
      B: { text: '주가 차트와 최근 거래 패턴', tendency: 'T', score: 1 },
    },
  },
  {
    id: 11,
    axis: 'FT',
    weight: 2,
    isKeyQuestion: false,
    text: '투자 공부를 어떤 방식으로 주로 하나요?',
    options: {
      A: { text: '사업보고서, 공시, 뉴스 등 기업 분석', tendency: 'F', score: 2 },
      B: { text: '차트 분석, 보조지표, 매매 기법 학습', tendency: 'T', score: 2 },
    },
  },
  {
    id: 12,
    axis: 'RI',
    weight: 2,
    isKeyQuestion: true,
    text: '투자 결정을 내리는 나만의 방식은?',
    options: {
      A: { text: '미리 정해둔 기준과 규칙에 따라 결정한다', tendency: 'R', score: 2 },
      B: { text: '그때그때 상황과 직감에 따라 유연하게 결정한다', tendency: 'I', score: 2 },
    },
  },
  {
    id: 13,
    axis: 'RI',
    weight: 1,
    isKeyQuestion: false,
    text: '주변에서 특정 종목 투자 성공 소식을 들었을 때?',
    options: {
      A: { text: '냉정하게 본인 기준으로 판단 후 결정한다', tendency: 'R', score: 1 },
      B: { text: '나도 좋은 기회일 수 있어 빠르게 검토한다', tendency: 'I', score: 1 },
    },
  },
  {
    id: 14,
    axis: 'RI',
    weight: 2,
    isKeyQuestion: false,
    text: '투자 손실이 발생했을 때 나의 심리 상태는?',
    options: {
      A: { text: '감정을 통제하고 원칙대로 대응한다', tendency: 'R', score: 2 },
      B: { text: '불안하거나 조급해지는 감정이 생긴다', tendency: 'I', score: 2 },
    },
  },
  {
    id: 15,
    axis: 'RI',
    weight: 1,
    isKeyQuestion: false,
    text: '포트폴리오를 어떻게 관리하나요?',
    options: {
      A: { text: '정해둔 비중 비율을 엄격하게 유지한다', tendency: 'R', score: 1 },
      B: { text: '시장 상황에 맞게 유연하게 조정한다', tendency: 'I', score: 1 },
    },
  },
]

export const TOTAL_QUESTIONS = QUESTIONS.length
