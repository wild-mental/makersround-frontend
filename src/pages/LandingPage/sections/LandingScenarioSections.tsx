/**
 * 고객 시나리오(problem-section) 및 AI 심사위원단(makers-section).
 * 모듈 최상단에 정의하여 LandingPage 리렌더 시 컴포넌트 타입이 바뀌지 않게 함 (캐러셀 리마운트 방지).
 */

import React, { memo, useEffect, useRef } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { Button } from '../../../components/ui';
import { logComponentRender } from '../../../utils/abTestDebugLogger';
import {
  Rocket,
  User,
  Star,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Users,
  BarChart3,
  Target,
  Heart,
  Cpu,
} from 'lucide-react';

// ---- M.A.K.E.R.S 위원회 (makers 섹션 전용) ----
const makersCommittee = [
  { letter: 'M', name: 'Marketability', korean: '시장성', icon: TrendingUp, color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30', description: '시장 규모, 고객 수요, 경쟁 상황, 타깃 시장 분석' },
  { letter: 'A', name: 'Ability', korean: '수행능력', icon: Users, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30', description: '팀 구성, 창업자의 역량, 실행 가능성, 인프라 보유' },
  { letter: 'K', name: 'Key Technology', korean: '핵심기술', icon: Cpu, color: 'from-cyan-500 to-teal-600', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/30', description: '기술의 혁신성, 차별화, 지식재산권, 기술 보호' },
  { letter: 'E', name: 'Economics', korean: '경제성', icon: BarChart3, color: 'from-emerald-500 to-green-600', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/30', description: '매출·손익 계획, 자금 조달, 투자 회수, 재무 건전성' },
  { letter: 'R', name: 'Realization', korean: '실현가능성', icon: Target, color: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30', description: '사업 추진 일정, 단계별 실행 계획, 리스크 관리' },
  { letter: 'S', name: 'Social Impact', korean: '사회적가치', icon: Heart, color: 'from-pink-500 to-rose-600', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/30', description: '일자리 창출, 지역 균형, ESG, 정부 정책 방향' },
];

const makersDetailData = [
  {
    letter: 'M',
    name: 'Marketability',
    korean: '시장성 전문 AI',
    color: 'from-purple-500 to-violet-600',
    image: '/assets/juror-single/j1_market_tr.png',
    trainingData: '2.3M+',
    trainingDesc: '시장 분석 보고서, 산업 리서치, VC 투자 데이터',
    accuracy: '96.2%',
    benchmarks: ['TAM/SAM/SOM 산출', '경쟁사 분석', '타깃 고객 세분화'],
    specialFeature: '최신 프론티어 AI 3종 전이학습',
    validationScore: '92.8',
    description: '국내외 120만 건의 시장 리서치 데이터로 학습된 AI가 실시간으로 시장 규모, 성장률, 경쟁 구도를 분석합니다. 정부지원사업 심사위원 출신 전문가 30여 명의 피드백으로 미세 튜닝되었습니다.',
  },
  {
    letter: 'A',
    name: 'Ability',
    korean: '수행능력 전문 AI',
    color: 'from-blue-500 to-indigo-600',
    image: '/assets/juror-single/j2_ability_tr.png',
    trainingData: '1.8M+',
    trainingDesc: '창업 팀 분석, HR 데이터, 성공 사례 연구',
    accuracy: '94.7%',
    benchmarks: ['팀 역량 평가', '실행 가능성 분석', '인프라 보유 판단'],
    specialFeature: '연쇄창업자 성공 패턴 학습',
    validationScore: '91.3',
    description: '실리콘밸리 스타트업 5만 개사의 팀 구성과 성공/실패 데이터를 학습. 창업자의 백그라운드, 팀 구성, 역할 분담을 분석하여 실행 가능성을 점수화합니다.',
  },
  {
    letter: 'K',
    name: 'Key Technology',
    korean: '핵심기술 전문 AI',
    color: 'from-cyan-500 to-teal-600',
    image: '/assets/juror-single/j3_keytech_tr.png',
    trainingData: '3.1M+',
    trainingDesc: '특허 데이터, 기술 논문, R&D 보고서',
    accuracy: '97.1%',
    benchmarks: ['기술 혁신성 평가', '특허 회피 분석', 'IP 보호 전략'],
    specialFeature: 'KIPRIS 연동 실시간 특허 검색',
    validationScore: '94.6',
    description: '국내외 특허 300만 건 및 기술 논문 데이터로 학습. 기술의 혁신성, 진입장벽, 지식재산권 보호 가능성을 종합 평가합니다.',
  },
  {
    letter: 'E',
    name: 'Economics',
    korean: '경제성 전문 AI',
    color: 'from-emerald-500 to-green-600',
    image: '/assets/juror-single/j4_economy_tr.png',
    trainingData: '2.7M+',
    trainingDesc: '재무제표, 투자 라운드, 손익 분석 데이터',
    accuracy: '95.8%',
    benchmarks: ['Unit Economics 검증', 'BEP 분석', 'LTV/CAC 최적화'],
    specialFeature: '업종별 벤치마크 내장',
    validationScore: '93.2',
    description: '국내 스타트업 재무데이터 10만 건 및 상장사 재무제표로 학습. 현실적인 매출 추정, 손익분기점 분석, 자금 조달 계획을 점검합니다.',
  },
  {
    letter: 'R',
    name: 'Realization',
    korean: '실현가능성 전문 AI',
    color: 'from-orange-500 to-amber-600',
    image: '/assets/juror-single/j5_realization_tr.png',
    trainingData: '1.5M+',
    trainingDesc: '프로젝트 마일스톤, 리스크 관리 사례',
    accuracy: '93.4%',
    benchmarks: ['실행 계획 검증', '리스크 요인 분석', '마일스톤 현실성'],
    specialFeature: 'OKR/KPI 기반 목표 설정 지원',
    validationScore: '90.7',
    description: '실제 스타트업 실행 데이터와 프로젝트 관리 사례로 학습. 추진 일정의 현실성, 리스크 관리 방안, 단계별 실행 계획을 평가합니다.',
  },
  {
    letter: 'S',
    name: 'Social Impact',
    korean: '사회적가치 전문 AI',
    color: 'from-pink-500 to-rose-600',
    image: '/assets/juror-single/j6_social_tr.png',
    trainingData: '1.2M+',
    trainingDesc: 'ESG 보고서, 사회적기업 사례, 정부 정책',
    accuracy: '92.9%',
    benchmarks: ['일자리 창출 효과', '지역 균형 발전', 'ESG 적합성'],
    specialFeature: '정부 정책 방향 실시간 반영',
    validationScore: '89.5',
    description: 'ESG 평가, 사회적기업 성공 사례, 정부 정책 문서로 학습. 일자리 창출, 지역사회 기여, 환경 영향 등 사회적 가치를 종합 평가합니다.',
  },
];

interface Review {
  name: string;
  role: string;
  content: string;
}

interface AutoScrollCarouselProps {
  reviews: Review[];
  color: string;
  direction: 'left' | 'right';
}

const AutoScrollCarousel: React.FC<AutoScrollCarouselProps> = ({ reviews, color, direction }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });

  const speed = 0.5;
  const allReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      if (!isPausedRef.current && !isDraggingRef.current && container && container.scrollWidth > 0) {
        container.scrollLeft += speed;
        const oneSetWidth = container.scrollWidth / 4;

        if (container.scrollLeft >= oneSetWidth * 2) {
          container.scrollLeft -= oneSetWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += oneSetWidth;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    isDraggingRef.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    const container = containerRef.current;
    if (container) {
      dragStartRef.current = {
        x: e.pageX - container.offsetLeft,
        scrollLeft: container.scrollLeft,
      };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const container = containerRef.current;
    if (container) {
      const x = e.pageX - container.offsetLeft;
      let walk = (x - dragStartRef.current.x) * 2;
      if (direction === 'right') {
        walk = -walk;
      }
      container.scrollLeft = dragStartRef.current.scrollLeft - walk;
    }
  };

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto cursor-grab active:cursor-grabbing select-none"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        transform: direction === 'right' ? 'scaleX(-1)' : 'none',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div
        className="flex gap-6"
        style={{
          width: 'max-content',
          transform: direction === 'right' ? 'scaleX(-1)' : 'none',
        }}
      >
        {allReviews.map((review, reviewIndex) => (
          <div key={reviewIndex} className="flex items-center gap-6">
            {reviewIndex > 0 && reviewIndex % reviews.length === 0 && (
              <div className="flex-shrink-0 flex flex-col items-center justify-center px-4">
                <div className={`w-px h-20 bg-gradient-to-b from-transparent via-${color}-500/50 to-transparent`} />
                <div className={`text-${color}-400/50 text-xs mt-2`}>●</div>
                <div className={`w-px h-20 bg-gradient-to-b from-transparent via-${color}-500/50 to-transparent`} />
              </div>
            )}
            <div
              className={`flex-shrink-0 w-[612px] glass-card rounded-2xl p-8 border border-${color}-500/20 hover:border-${color}-500/40 transition-all select-none`}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg text-white/80 leading-relaxed mb-6 select-none">"{review.content}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className={`w-12 h-12 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
                  <User className="w-6 h-6 text-white/60" />
                </div>
                <div>
                  <div className="font-semibold text-white">{review.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const scenarioReviewGroups = [
  {
    group: 'Group 1',
    title: '예비창업패키지 & 정부지원사업 지원자',
    persona: '김예비 유형',
    color: 'emerald',
    reviews: [
      { name: '이*우', role: '예비창업패키지 준비 / IT 플랫폼', content: '마감 3일 남기고 멘붕이었는데, \'Basic 기능\'으로 10분 만에 HWP 초안 뽑고 소름 돋았습니다. 줄 간격, 폰트 깨짐 없이 공공기관 양식 그대로 나오네요. 덕분에 내용 다듬는 데만 집중해서 마감 1시간 전에 여유 있게 제출했습니다.' },
      { name: '박*현', role: '청년창업사관학교 지원 / 제조 스타트업', content: '솔직히 처음엔 짜증 났습니다. \'Pro 기능\' 쓰는데 점수가 72점이라며 계속 반려당했거든요. 근데 AI가 지적해 준 \'경쟁사 대비 차별점\'을 고치고 나니 비로소 글이 논리적으로 변하더군요. 결국 합격했습니다. 그 깐깐함이 신의 한 수였어요.' },
      { name: '최*진', role: '초기창업패키지 / 에듀테크', content: 'Social Impact 위원이 \'ESG 및 일자리 창출 효과\'를 구체적인 숫자로 제안해 줘서 놀랐습니다. 교육 사업이라 막연하게만 썼던 가치를 정량화하니 심사위원들이 보는 눈이 달라지는 게 느껴졌습니다.' },
      { name: '김*수', role: '로컬 크리에이터 지원 / 관광업', content: '시장 분석이 제일 어려웠는데, Marketability 위원이 최신 관광 트렌드 통계를 긁어와서 근거로 넣어주니 신뢰도가 확 올라갔습니다. 혼자 구글링할 땐 안 나오던 자료들이라 너무 유용했습니다.' },
      { name: '정*영', role: '예비 창업자 / 생활 소비재', content: '컨설팅 업체에 300만 원 부르는 거 보고 포기했다가 메이커스 라운드를 썼습니다. 비용은 1/10도 안 되는데 퀄리티는 훨씬 낫네요. 특히 \'실현 가능성\' 파트에서 구체적인 마일스톤 잡아주는 게 진짜 전문가 같았습니다.' },
      { name: '오*민', role: 'R&D 과제 기획 / 헬스케어', content: '기술은 자신 있는데 사업계획서로 푸는 게 고역이었습니다. Key Technology 위원이 제 기술 용어를 심사위원이 이해하기 쉬운 비즈니스 언어로 번역해 줘서, 기술성 평가에서 만점을 받았습니다.' },
      { name: '강*호', role: '재도전성공패키지 / 모빌리티', content: '지난번 탈락 이유를 몰랐는데, 이번에 시뮬레이션 돌려보고 알았습니다. 제가 \'자금 조달 계획\'이 너무 부실했더군요. Economics 위원이 지적해 준 대로 수정해서 이번엔 서류 통과했습니다.' },
    ],
  },
  {
    group: 'Group 2',
    title: '기술 검증 & 피벗이 필요한 재창업가',
    persona: '최민혁 유형',
    color: 'blue',
    reviews: [
      { name: '황*석', role: 'AI 솔루션 개발 / CTO 출신', content: '개발자라 그런지 \'감\'으로 사업하는 걸 싫어합니다. 여기는 6개 에이전트가 각기 다른 관점으로 데이터를 들이대며 팩폭을 날려줍니다. 뼈는 좀 아팠지만, 덕분에 개발 착수 전에 타겟 시장을 B2C에서 B2B로 바꿀 수 있었습니다.' },
      { name: '윤*재', role: '블록체인 스타트업 / 연쇄창업가', content: '과거엔 팀원들끼리 \'이거 될 거야\'라며 희망 회로만 돌렸는데, Makers Round는 냉정하더군요. \'Ability 위원\'이 팀 내 마케팅 역량 부족을 지적해 줘서, 급하게 그로스 마케터를 영입하는 계기가 됐습니다.' },
      { name: '서*준', role: '핀테크 / 백엔드 개발자', content: '기술적 우위만 강조하던 제 IR 자료가 쓰레기였다는 걸 깨달았습니다. \'고객이 왜 돈을 내야 하는가\'에 대한 질문을 끊임없이 던지는 피드백 루프 덕분에 진짜 PMF를 고민하게 되었습니다.' },
      { name: '임*호', role: '하드웨어 스타트업 / 엔지니어', content: '특허만 믿고 있었는데, Key Technology 위원이 \'특허 회피 가능성\'에 대한 리스크를 짚어줬을 때 소름 돋았습니다. 덕분에 방어 논리를 미리 준비해서 투자자 미팅 때 잘 넘어갔습니다.' },
      { name: '권*우', role: 'SaaS 서비스 / 3년 차 개발', content: '프리미엄 컨설팅 연계해서 SaaS 전문가분께 조언받았습니다. AI가 잡아준 논리 구조 위에 실제 업계의 KPI(Churn rate 등) 관리 노하우가 더해지니 완벽해지더군요.' },
    ],
  },
  {
    group: 'Group 3',
    title: '소상공인 & 자영업자',
    persona: '박사장 유형',
    color: 'amber',
    reviews: [
      { name: '이*숙', role: '카페 운영 5년 차 / 대출 심사용', content: '숫자만 보면 머리가 하얘지는 사람입니다. 은행에서 사업계획서 가져오라길래 막막했는데, 매출이랑 지출 대충 입력하니까 Economics 위원이 알아서 3년 치 추정 손익 계산서를 만들어주네요. 은행 직원이 누가 도와줬냐고 물어봤어요.' },
      { name: '김*철', role: '요식업 프랜차이즈 준비 / 가맹점주 모집', content: '컴퓨터 잘 못 다루는데 사용법이 카톡만큼 쉬워요. 질문하는 대로 대답만 했더니 그럴싸한 사업 소개서가 뚝딱 나왔습니다. 덕분에 가맹점주 미팅 때 태블릿으로 보여주면서 자신감 있게 설명했습니다.' },
      { name: '박*미', role: '의류 쇼핑몰 / 정책 자금 신청', content: '소상공인 대출받으려는데 \'경쟁력\' 쓰라는 칸에서 막혔어요. 그냥 \'옷이 예쁘다\'라고 썼는데, AI가 \'트렌드 기반의 큐레이션 역량\'이라고 고급스럽게 바꿔주더라고요.' },
      { name: '조*환', role: '밀키트 제조 / 판로 개척', content: '식당 장사만 하다가 유통하려니 막막했는데, Marketability 위원이 타겟 고객을 \'30대 맞벌이 부부\'로 좁혀주고 시장 규모까지 잡아줘서 방향 잡기가 훨씬 수월했습니다.' },
    ],
  },
  {
    group: 'Group 4',
    title: '투자 유치(IR) 준비 CEO',
    persona: '한서윤 유형',
    color: 'purple',
    reviews: [
      { name: '장*희', role: '플랫폼 스타트업 / Seed 라운드', content: 'VC들이 항상 묻는 TAM-SAM-SOM 그리는 법을 여기서 제대로 배웠습니다. 예전엔 그냥 큰 숫자만 적었는데, AI가 논리적인 산출 근거를 잡아주니 투자자가 고개를 끄덕이더군요.' },
      { name: '배*성', role: '바이오 벤처 / Pre-A 준비', content: 'IR Deck 만들 때마다 스토리가 꼬였는데, Makers Round가 잡아준 목차 흐름대로 가니까 기승전결이 딱 떨어집니다. 심사위원들이 \'준비 많이 했네\'라고 하더군요.' },
      { name: '유*나', role: '푸드테크 / 엑셀러레이팅', content: 'Realization 위원이 지적한 \'초기 진입 장벽\'에 대한 대비책을 미리 세워둔 덕분에, 데모데이 Q&A 시간 때 공격적인 질문을 아주 여유 있게 방어했습니다.' },
      { name: '송*민', role: '커머스 솔루션 / 팁스(TIPS) 준비', content: '팁스 운영사 미팅 전에 모의고사는 필수입니다. AI가 예상했던 질문이 실제 미팅에서 80% 이상 나왔습니다. 미리 답변을 준비해 가서 당황하지 않았어요.' },
      { name: '한*석', role: '에듀테크 / 엔젤 투자 유치', content: '혼자 상상했던 \'장밋빛 매출 계획\'을 Economics 위원이 \'현실적인 성장률\'로 조정해 줬습니다. 처음엔 실망했지만, 오히려 그 현실적인 숫자가 투자자들에겐 더 신뢰를 줬습니다.' },
    ],
  },
];

export const LandingTestimonialsSection: React.FC = memo(() => {
  useEffect(() => {
    logComponentRender('LandingScenarioSections.tsx', 'LandingTestimonialsSection', undefined, 'G');
  }, []);

  return (
    <section id="problem-section" className="py-24 relative scroll-mt-[100px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/10 to-slate-950" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
            <MessageSquare className="w-4 h-4" /> 고객 시나리오
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Makers Round</span>
            <br />
            고객 상황별 성과 도출 예시
          </h2>
          <p className="text-white/20 text-sm">
            *Makers Round의 AI 솔루션을 통해 경험할 수 있는 기대 효과입니다. <br />
            귀하의 상황과 가장 유사한 사례를 찾아 솔루션을 미리 확인해보세요.
          </p>
        </div>

        {scenarioReviewGroups.map((group, groupIndex) => (
          <div key={group.group} className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-full bg-${group.color}-500/20 text-${group.color}-400 text-xs font-bold`}>
                📌 {group.group}
              </span>
              <h3 className="text-xl font-bold">{group.title}</h3>
            </div>
            <AutoScrollCarousel reviews={group.reviews} color={group.color} direction={groupIndex % 2 === 0 ? 'left' : 'right'} />
          </div>
        ))}
      </div>
    </section>
  );
});

LandingTestimonialsSection.displayName = 'LandingTestimonialsSection';

export interface LandingMakersSectionProps {
  navigate: NavigateFunction;
  scrollToElement: (elementId: string) => void;
  isMakersDetailOpen: boolean;
  setIsMakersDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  makersGalleryIndex: number;
  setMakersGalleryIndex: React.Dispatch<React.SetStateAction<number>>;
  hoveredMaker: number | null;
  setHoveredMaker: React.Dispatch<React.SetStateAction<number | null>>;
}

export const LandingMakersSection: React.FC<LandingMakersSectionProps> = memo(
  ({
    navigate,
    scrollToElement,
    isMakersDetailOpen,
    setIsMakersDetailOpen,
    makersGalleryIndex,
    setMakersGalleryIndex,
    hoveredMaker,
    setHoveredMaker,
  }) => {
    useEffect(() => {
      logComponentRender('LandingScenarioSections.tsx', 'LandingMakersSection', {
        isMakersDetailOpen,
        makersGalleryIndex,
        hoveredMaker,
      }, 'G');
    }, [isMakersDetailOpen, makersGalleryIndex, hoveredMaker]);

    return (
      <section id="makers-section" className="py-24 relative overflow-hidden scroll-mt-[100px]">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="animate-fade-in">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-4 h-4" />
                </div>
                <span className="font-semibold">Makers Round</span>
                <span className="text-white/40">|</span>
                <span className="text-white/60 text-sm">by Makers World</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">M.A.K.E.R.S</span> AI 심사위원단
              </h2>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {[
                  { letter: 'M', korean: '시장성', color: 'purple' },
                  { letter: 'A', korean: '수행능력', color: 'blue' },
                  { letter: 'K', korean: '핵심기술', color: 'cyan' },
                  { letter: 'E', korean: '경제성', color: 'emerald' },
                  { letter: 'R', korean: '실현가능성', color: 'orange' },
                  { letter: 'S', korean: '사회적가치', color: 'pink' },
                ].map((item) => (
                  <span
                    key={item.letter}
                    className={`px-3 py-1 rounded-full bg-${item.color}-500/20 border border-${item.color}-500/30 text-white font-medium text-sm flex items-center gap-1.5`}
                  >
                    <span className={`w-5 h-5 rounded bg-${item.color}-500/40 flex items-center justify-center text-xs font-bold`}>
                      {item.letter}
                    </span>
                    {item.korean}
                  </span>
                ))}
              </div>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                정부지원사업 평가의 6가지 핵심 영역을 전담하는 AI 심사위원단
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              <div className="flex flex-col justify-center">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  정부지원금 합격률을<br />
                  <span className="text-gradient">6명의 AI 심사위원</span>이<br />
                  높여드립니다
                </h3>

                <div className="flex gap-2 mb-6">
                  {makersCommittee.map((m) => (
                    <div
                      key={m.letter}
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center font-bold text-lg shadow-lg`}
                    >
                      {m.letter}
                    </div>
                  ))}
                </div>

                <p className="text-lg text-white/70 mb-8">
                  <strong className="text-white">M.A.K.E.R.S AI 심사위원단</strong>이<br />
                  사업계획서의 6가지 핵심 영역을 사전 심사합니다
                </p>

                <div className="flex flex-col gap-4">
                  <Button
                    size="lg"
                    onClick={() => navigate('/evaluation-demo')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-6 py-4 text-lg font-bold shadow-2xl animate-pulse-glow border-0"
                  >
                    무료로 AI 심사 받아보기
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => {
                      const newState = !isMakersDetailOpen;
                      setIsMakersDetailOpen(newState);
                      if (newState) {
                        setMakersGalleryIndex(0);
                        setTimeout(() => scrollToElement('makers-detail'), 100);
                      }
                    }}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-4 text-lg font-semibold"
                  >
                    {isMakersDetailOpen ? '전문성 상세 닫기' : '최고의 전문성 확인하기'}
                    <ChevronRight className={`w-5 h-5 ml-2 transition-transform ${isMakersDetailOpen ? '-rotate-90' : 'rotate-90'}`} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-2xl overflow-hidden shadow-xl shadow-purple-500/20 border border-white/10">
                  <video autoPlay muted loop playsInline className="w-full h-auto">
                    <source src="/assets/AI_스타트업_사업계획서_솔루션_영상_프롬프트.mp4" type="video/mp4" />
                  </video>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {makersCommittee.map((m, i) => (
                    <div
                      key={m.letter}
                      className={`glass-card rounded-xl p-4 hover-lift cursor-pointer transition-all ${hoveredMaker === i ? 'border-2 ' + m.borderColor + ' glow-purple' : 'border border-white/10'}`}
                      onMouseEnter={() => setHoveredMaker(i)}
                      onMouseLeave={() => setHoveredMaker(null)}
                      onClick={() => {
                        setMakersGalleryIndex(i);
                        if (!isMakersDetailOpen) {
                          setIsMakersDetailOpen(true);
                          setTimeout(() => scrollToElement('makers-detail'), 100);
                        } else {
                          scrollToElement('makers-detail');
                        }
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center font-bold text-lg shadow-lg flex-shrink-0`}>
                          {m.letter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold truncate">{m.name}</h4>
                          <p className="text-white/60 text-xs">{m.korean}</p>
                        </div>
                      </div>
                      <p className="text-xs text-white/70 line-clamp-2">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isMakersDetailOpen && (
            <div id="makers-detail" className="pt-24 scroll-mt-[100px] animate-fade-in">
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    AI 심사위원 <span className="text-gradient">전문성 상세</span>
                  </h2>
                  <p className="text-white/60">6가지 핵심 평가영역에 대한 AI 심사위원단의 전문성을 확인하세요</p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-12 max-w-5xl mx-auto">
                  {makersDetailData.map((agent, i) => (
                    <button
                      key={agent.letter}
                      type="button"
                      onClick={() => setMakersGalleryIndex(i)}
                      className={`relative group transition-all duration-100 ${makersGalleryIndex === i ? 'scale-110 z-10' : 'scale-100 hover:scale-110 opacity-60 hover:opacity-100'}`}
                    >
                      <div
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg transition-all duration-100 overflow-hidden
                        ${makersGalleryIndex === i
                          ? `bg-gradient-to-br ${agent.color} ring-2 ring-white/50 ring-offset-2 ring-offset-slate-900 shadow-xl`
                          : 'bg-white/10 border border-white/10'
                        }`}
                      >
                        <span className={`transition-opacity duration-100 ${makersGalleryIndex !== i ? 'group-hover:opacity-0' : ''}`}>
                          {agent.letter}
                        </span>
                        {makersGalleryIndex !== i && (
                          <div className="absolute inset-0 flex items-center justify-center p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100 bg-black/40 backdrop-blur-md">
                            <span className="text-[10px] font-bold text-white leading-tight break-keep text-center">{agent.name}</span>
                          </div>
                        )}
                      </div>
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-max text-center transition-all duration-100
                        ${makersGalleryIndex === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
                      >
                        <div className="text-xs font-bold text-white/90 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm border border-white/10">
                          {agent.name}
                        </div>
                      </div>
                    </button>
                  ))}

                  <Button
                    size="lg"
                    onClick={() => navigate('/evaluation-demo')}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 px-6 py-3 text-sm font-bold shadow-lg shadow-emerald-500/25 border-0 ml-4"
                  >
                    무료로 AI 심사 받아보기
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="max-w-4xl mx-auto">
                  {makersDetailData.map((agent, i) => (
                    <div
                      key={agent.letter}
                      className={`glass-card rounded-3xl p-8 border border-white/10 ${makersGalleryIndex === i ? 'block' : 'hidden'}`}
                    >
                      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                        <img src={agent.image} alt={`${agent.name} AI`} className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl flex-shrink-0" />
                        <div className="text-center md:text-left">
                          <h3 className="text-2xl md:text-3xl font-bold mb-1">{agent.name} Agent</h3>
                          <p className="text-white/60 text-lg mb-4">{agent.korean} 심사위원</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="glass rounded-xl p-3 text-center">
                              <div className="text-xl font-bold text-gradient mb-0.5">{agent.trainingData}</div>
                              <div className="text-xs text-white/60">학습 데이터</div>
                            </div>
                            <div className="glass rounded-xl p-3 text-center">
                              <div className="text-xl font-bold text-emerald-400 mb-0.5">{agent.accuracy}</div>
                              <div className="text-xs text-white/60">정확도</div>
                            </div>
                            <div className="glass rounded-xl p-3 text-center">
                              <div className="text-xl font-bold text-cyan-400 mb-0.5">{agent.validationScore}</div>
                              <div className="text-xs text-white/60">검증 점수</div>
                            </div>
                            <div className="glass rounded-xl p-3 text-center">
                              <div className="text-sm font-bold text-amber-400 mb-0.5">✨</div>
                              <div className="text-xs text-white/60 line-clamp-2">{agent.specialFeature}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-purple-400 mb-2">학습 데이터 출처</h4>
                        <p className="text-white/70 text-sm">{agent.trainingDesc}</p>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">평가 기능</h4>
                        <div className="flex flex-wrap gap-2">
                          {agent.benchmarks.map((b, j) => (
                            <span key={j} className="px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs">
                              ✓ {b}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-white/80 text-sm leading-relaxed">{agent.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setMakersGalleryIndex((prev) => (prev - 1 + 6) % 6)}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-6 h-6 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMakersGalleryIndex((prev) => (prev + 1) % 6)}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
);

LandingMakersSection.displayName = 'LandingMakersSection';
