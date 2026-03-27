/**
 * Makers Round 울트라 프리미엄 랜딩페이지
 * M.A.K.E.R.S AI 심사위원단 시스템
 */

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, PromotionBanner } from '../components/ui';
import PreRegistrationSuccess from '../components/PreRegistrationSuccess';
import { LandingHeader } from './LandingPage/sections/LandingHeader';
import { HeroSection } from './LandingPage/sections/HeroSection';
import { LandingTestimonialsSection, LandingMakersSection } from './LandingPage/sections/LandingScenarioSections';
import { useABTest, useHeroCtaTest, useMakersSectionTest, usePricingTest } from '../hooks/useABTest';
import {
  logSectionOrderMemo,
  logSectionOrderCalculation,
  logSectionRenderDecision,
  logVariantOrderRender,
} from '../utils/abTestDebugLogger';
import {
  Rocket, FileText, Sparkles, Clock, CheckCircle2, ArrowRight, Users, Award, Zap,
  Target, AlertTriangle, Brain, LineChart, Shield, GraduationCap, Building2,
  Briefcase, User, Coffee, ChevronRight, Check,
  TrendingUp, Globe, Lightbulb, BarChart3, Scale, Cpu,
  Volume2, VolumeX, Flame
} from 'lucide-react';
import { getPlanPricing, getPromotionStatus, formatPrice } from '../utils/pricing';
import { usePreRegistrationStore } from '../stores/usePreRegistrationStore';
import { useMusicStore } from '../stores/useMusicStore';
import type { PlanType } from '../utils/pricing';
import { PROMO_START_DATE, PHASE_A_END, PHASE_B_END, SERVICE_OPEN_DATE } from '../constants/promotion';

// 날짜 포맷팅 유틸리티 함수 (간단한 M/D 형식)
const formatDateShort = (dateString: string): string => {
  // ISO 문자열에서 날짜 부분만 추출하여 타임존 문제 방지
  const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    const month = parseInt(dateMatch[2], 10);
    const day = parseInt(dateMatch[3], 10);
    return `${month}/${day}`;
  }
  // 폴백: 기존 방식
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

// Phase B 시작일 계산 (Phase A 종료일 다음 날)
const getPhaseBStartDate = (): Date => {
  const phaseAEnd = new Date(PHASE_A_END);
  phaseAEnd.setDate(phaseAEnd.getDate() + 1);
  return phaseAEnd;
};

// 요금제 데이터 (할인가 정보 포함)
const pricingPlans = [
  { 
    name: '기본', 
    planKey: null as null, // 무료 요금제는 할인 미적용
    price: '무료 데모', 
    originalPrice: 0,
    period: '', 
    features: [
      '사업계획서 핵심 질문 리스트 제공', 
      '사업계획서 자동 생성 체험', 
      'AI 심사위원 평가 체험', 
      { text: 'HWP/PDF 다운로드 체험', note: '2026년 양식 통합공고 후 제공' }
    ], 
    cta: '무료 데모 바로가기', 
    popular: false 
  },
  { 
    name: '플러스', 
    planKey: 'plus' as const,
    price: '399,000', 
    originalPrice: 399000,
    period: '2026 상반기 시즌', 
    features: ['기본 기능 전체', '6개 영역 점수 리포트', '통합 개선 피드백 제공', { text: 'AI 고도화 토큰 제공', note: '약 3회 재작성 가능' }], 
    cta: '플러스 시작', 
    popular: false 
  },
  { 
    name: '프로', 
    planKey: 'pro' as const,
    price: '799,000', 
    originalPrice: 799000,
    period: '2026 상반기 시즌', 
    features: ['플러스 기능 전체', '80점 미달 시 재작성 루프', '파트별 고도화 피드백', { text: '토큰 제한 없는 무제한 수정', note: '제출 마감까지 제공' }], 
    cta: '프로 시작', 
    popular: true 
  },
  { 
    name: '프리미엄', 
    planKey: 'premium' as const,
    price: '1,199,000', 
    originalPrice: 1199000,
    period: '2026 상반기 시즌', 
    features: ['프로 기능 전체', { text: '도메인 특화 전문가 매칭', note: '사업 도메인별 선착순 모집' }, { text: '1:1 원격 컨설팅', note: '회당 1시간, 최대 3회 제공' }, '우선 지원'], 
    cta: '프리미엄 시작', 
    popular: false 
  },
];

// 페르소나 데이터
const personas = [
  { id: 'kim', name: '김예비', role: '예비창업패키지 지원자', icon: User, problem: '마감이 일주일 남았는데 시장 분석과 재무 추정을 어떻게 채워야 할지 막막합니다.', goal: '5천만 원 지원금을 위한 전문가 수준 사업계획서 완성', emotion: '불안, 초조', color: 'blue', badge: '가장 많이 사용' },
  { id: 'choi', name: '최민혁', role: '재창업가 (엔지니어 출신)', icon: Brain, problem: '첫 창업 때 시장 수요 없음으로 실패. 이번엔 데이터로 검증하고 싶습니다.', goal: '코드 한 줄 짜기 전 PMF 철저히 검증', emotion: '신중함, 분석적', color: 'purple', badge: 'PMF 진단 추천' },
  { id: 'park', name: '박사장', role: '소상공인 (카페)', icon: Coffee, problem: '은행에서 상권 분석과 추정 손익이 포함된 사업계획서를 요구합니다.', goal: '은행 대출 심사 통과하여 운영 자금 확보', emotion: '답답함', color: 'amber', badge: '소상공인 추천' },
  { id: 'han', name: '한서윤', role: '시드 투자 유치 CEO', icon: Briefcase, problem: 'IR Deck을 만들었지만 TAM-SAM-SOM 근거가 부족합니다.', goal: '5억 원 시드 투자 유치를 위한 IR Deck 완성', emotion: '압박감', color: 'emerald', badge: '투자유치 추천' },
  { id: 'lee', name: '이지은', role: '대학생 창업동아리', icon: GraduationCap, problem: '팀원 모두 BM, CAC, LTV 같은 용어를 모릅니다.', goal: '창업경진대회 1등을 위한 완성도 높은 사업계획서', emotion: '열정적, 막연함', color: 'rose', badge: '학생 추천' },
];

// 고객 시나리오 데이터
const testimonials = [
  { name: '이창업', role: '예비창업패키지 합격자', content: 'M.A.K.E.R.S 평가 덕분에 제 사업계획서의 약점을 정확히 파악했습니다. 경제성 부분을 보완해서 최종 합격!', rating: 5, avatar: '👨‍💼' },
  { name: '박스타트업', role: '초기창업패키지 합격자', content: '6명의 AI 심사위원 피드백이 실제 심사위원 질문과 거의 일치했어요. 면접 준비까지 완벽!', rating: 5, avatar: '👩‍💻' },
  { name: '김대표', role: '시드 투자 유치 성공', content: 'IR Deck 작성할 때 시장성 분석이 특히 도움됐습니다. VC 미팅에서 자신있게 답변할 수 있었어요.', rating: 5, avatar: '🧑‍💼' },
];

// SEO 키워드
const seoKeywords = ['정부사업지원금', '예비창업패키지', '초기창업패키지', 'AI 심사위원단', '멀티에이전트 AI', '사업계획서 자동작성', '1인 소자본 창업', '창업 트렌드'];

// 네비게이션 링크 데이터
const navLinks = [
  { label: '고객 시나리오', href: '#problem-section' },
  { label: 'AI 심사위원단', href: '#makers-section' },
  { label: '맞춤 지원', href: '#business-category' },
  { label: '요금제', href: '#pricing-section' },
  { label: '단계별 솔루션', href: '#solution-steps' },
  { label: '기업 소개', href: '#testimonials-section' },
];

// 히어로 섹션 플리핑 텍스트 데이터
const heroFlipTexts = [
  { text: '예비창업패키지 합격', color: 'text-emerald-400' },
  { text: '초기창업패키지 합격', color: 'text-cyan-400' },
  { text: '정책자금지원 합격', color: 'text-blue-400' },
];

export const LandingPage: React.FC = memo(() => {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState(0);
  const [hoveredMaker, setHoveredMaker] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useABTest({ page: '/' });
  const heroCtaTest = useHeroCtaTest();
  const makersSectionTest = useMakersSectionTest();
  const pricingTest = usePricingTest();

  // 사전 등록 스토어 (성공 정보 표시용)
  const { lastRegistration } = usePreRegistrationStore();

  // AI 심사위원단 갤러리 상태
  const [makersGalleryIndex, setMakersGalleryIndex] = useState(0);
  // A/B 테스트에서 초기값 가져오기 (실험 데이터가 로드되면 업데이트)
  const [isMakersDetailOpen, setIsMakersDetailOpen] = useState(
    makersSectionTest.isMakersDetailOpenDefault ?? false
  );
  
  // 실험 데이터가 로드되면 초기값 업데이트
  useEffect(() => {
    if (makersSectionTest.isMakersDetailOpenDefault !== undefined && !makersSectionTest.isLoading) {
      setIsMakersDetailOpen(makersSectionTest.isMakersDetailOpenDefault);
    }
  }, [makersSectionTest.isMakersDetailOpenDefault, makersSectionTest.isLoading]);

  // 히어로 섹션 텍스트 플리핑 상태
  const [heroFlipIndex, setHeroFlipIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // 전역 음악 상태 사용
  const { initAudio } = useMusicStore();
  
  // 컴포넌트 마운트 시 Audio 초기화
  useEffect(() => {
    initAudio();
  }, [initAudio]);

  // 스크롤 감지
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 히어로 섹션 텍스트 플리핑 애니메이션
  useEffect(() => {
    const flipInterval = setInterval(() => {
      setIsFlipping(true);
      
      // 페이드 아웃 후 인덱스 변경
      setTimeout(() => {
        setHeroFlipIndex((prev) => (prev + 1) % heroFlipTexts.length);
        setIsFlipping(false);
      }, 400);
    }, 3000);

    return () => clearInterval(flipInterval);
  }, []);

  const handleCTAClick = () => navigate('/writing-demo');

  // 요금제 선택 시 프로모션 활성화 여부에 따라 모달 또는 회원가입 페이지로 이동
  const handlePlanSelect = (planName: string) => {
    const promoStatus = getPromotionStatus();
    // 모든 요금제에서 회원가입 페이지로 이동 (프로모션은 SignupPage에서 통합 처리)
    navigate(`/signup?plan=${encodeURIComponent(planName)}`);
  };

  // 헤더 오프셋을 고려한 스크롤 (참조 안정화 → makers 섹션 불필요 리렌더 감소)
  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  const scrollToSection = useCallback(
    (href: string) => {
      const elementId = href.replace('#', '');
      scrollToElement(elementId);
    },
    [scrollToElement]
  );

  // A/B 테스트 섹션 순서 파싱
  // isLoading이 true일 때도 이전에 받은 실제 데이터를 유지하도록 수정
  const sectionOrder = React.useMemo(() => {
    // 실제 데이터가 있으면 항상 사용 (isLoading 중에도 유지)
    if (makersSectionTest.sectionOrder) {
      logSectionOrderMemo(
        'LandingPage.tsx:490',
        makersSectionTest.isLoading,
        makersSectionTest.sectionOrder,
        makersSectionTest.sectionOrder,
        false,
        'G'
      );
      return makersSectionTest.sectionOrder;
    }
    
    // 데이터가 없을 때만 기본값 사용
    const defaultOrder = 'hero,testimonials,makers,business_category,pricing,steps,makers_world';
    logSectionOrderMemo(
      'LandingPage.tsx:497',
      makersSectionTest.isLoading,
      makersSectionTest.sectionOrder,
      defaultOrder,
      true,
      'G'
    );
    return defaultOrder;
  }, [makersSectionTest.sectionOrder]); // isLoading 의존성 제거 - 실제 데이터가 있으면 항상 사용
  
  const isMakersBeforeTestimonials = React.useMemo(() => {
    const sectionOrderArray = sectionOrder.split(',').map(s => s.trim());
    const testimonialsIndex = sectionOrderArray.indexOf('testimonials');
    const makersIndex = sectionOrderArray.indexOf('makers');
    const result = makersIndex < testimonialsIndex && makersIndex !== -1 && testimonialsIndex !== -1;
    
    logSectionOrderCalculation(
      'LandingPage.tsx:504',
      sectionOrder,
      testimonialsIndex,
      makersIndex,
      result,
      'F'
    );
    
    return result;
  }, [sectionOrder]);

  // 섹션 렌더링 순서 결정 로깅
  React.useEffect(() => {
    logSectionRenderDecision(
      'LandingPage.tsx:522',
      isMakersBeforeTestimonials,
      sectionOrder,
      makersSectionTest.variant,
      isMakersDetailOpen,
      'E'
    );
  }, [isMakersBeforeTestimonials, sectionOrder, makersSectionTest.variant, isMakersDetailOpen]);

  // Variant/Control 순서 렌더링 로깅
  React.useEffect(() => {
    if (isMakersBeforeTestimonials) {
      logVariantOrderRender('LandingPage.tsx:533', isMakersBeforeTestimonials, sectionOrder, 'Makers first', 'E');
    } else {
      logVariantOrderRender('LandingPage.tsx:536', isMakersBeforeTestimonials, sectionOrder, 'Testimonials first', 'E');
    }
  }, [isMakersBeforeTestimonials, sectionOrder]);


  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ===== PROMOTION BANNER (사전 등록 프로모션) ===== */}
      <PromotionBanner 
        onRegisterClick={() => navigate('/signup?plan=프로')} 
        onVisibilityChange={setIsBannerVisible}
      />
      
      {/* ===== FIXED HEADER NAVIGATION ===== */}
      <LandingHeader
        isScrolled={isScrolled}
        isBannerVisible={isBannerVisible}
        scrollToSection={scrollToSection}
        onCTAClick={handleCTAClick}
        navLinks={navLinks}
      />

      {/* ===== PRIMARY HERO SECTION ===== */}
      <HeroSection
        heroFlipIndex={heroFlipIndex}
        isFlipping={isFlipping}
        onCTAClick={handleCTAClick}
        scrollToElement={scrollToElement}
      />

      {/* ===== A/B 테스트에 따른 섹션 순서 동적 렌더링 (섹션은 모듈 스코프 컴포넌트로 리마운트 방지) ===== */}
      {isMakersBeforeTestimonials ? (
        <>
          <LandingMakersSection
            key="landing-makers"
            navigate={navigate}
            scrollToElement={scrollToElement}
            isMakersDetailOpen={isMakersDetailOpen}
            setIsMakersDetailOpen={setIsMakersDetailOpen}
            makersGalleryIndex={makersGalleryIndex}
            setMakersGalleryIndex={setMakersGalleryIndex}
            hoveredMaker={hoveredMaker}
            setHoveredMaker={setHoveredMaker}
          />
          <LandingTestimonialsSection key="landing-testimonials" />
        </>
      ) : (
        <>
          <LandingTestimonialsSection key="landing-testimonials" />
          <LandingMakersSection
            key="landing-makers"
            navigate={navigate}
            scrollToElement={scrollToElement}
            isMakersDetailOpen={isMakersDetailOpen}
            setIsMakersDetailOpen={setIsMakersDetailOpen}
            makersGalleryIndex={makersGalleryIndex}
            setMakersGalleryIndex={setMakersGalleryIndex}
            hoveredMaker={hoveredMaker}
            setHoveredMaker={setHoveredMaker}
          />
        </>
      )}

      {/* ===== BUSINESS CATEGORY SUPPORT SECTION ===== */}
      <section id="business-category" className="py-24 relative overflow-hidden scroll-mt-[100px]" >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" >
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
              <Briefcase className="w-4 h-4" /> 사업분야 맞춤지원
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              어떤 창업이든, <span className="text-gradient">완벽하게 지원</span>합니다
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              예비창업자부터 초기창업자까지, 모든 단계에 최적화된 솔루션
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Globe,
                title: '온라인 창업',
                desc: '온라인 쇼핑몰, 디지털 서비스 등 온라인 기반 창업 지원',
                tags: ['스마트스토어', 'SaaS'],
                color: 'blue',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: User,
                title: '1인 소자본 창업',
                desc: '최소 비용으로 시작하는 1인 창업 최적화 솔루션',
                tags: ['프리랜서', '크리에이터'],
                color: 'emerald',
                gradient: 'from-emerald-500 to-teal-500'
              },
              {
                icon: Building2,
                title: '프랜차이즈 사업',
                desc: '프랜차이즈 사업계획서 전문 양식 지원',
                tags: ['가맹점', '본사'],
                color: 'amber',
                gradient: 'from-amber-500 to-orange-500'
              },
              {
                icon: Cpu,
                title: 'AI 분야 창업',
                desc: 'AI 스타트업 특화 사업계획서 및 트렌드 분석',
                tags: ['LLM', 'AI 에이전트'],
                color: 'purple',
                gradient: 'from-purple-500 to-pink-500'
              },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 hover-lift border border-white/10 hover:border-white/20 transition-all group"
              >
                {/* Icon with gradient background */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>

                {/* Description */}
                <p className="text-white/60 text-sm mb-4 leading-relaxed">{item.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, j) => (
                    <span
                      key={j}
                      className={`text-xs px-3 py-1.5 rounded-full bg-${item.color}-500/10 text-${item.color}-400 border border-${item.color}-500/20`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Domain Consulting Support */}
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-400 text-sm font-medium mb-4">
                ✨ 프리미엄 전문 컨설팅
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">사업 도메인별 전문가 컨설팅</h3>
              <p className="text-white/60 text-base max-w-2xl mx-auto">
                각 분야 10년 이상 경력의 검증된 전문가들이 여러분의 사업을 함께 설계합니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                {
                  name: 'SaaS 온라인 서비스',
                  color: 'blue',
                  icon: '💻',
                  teamSize: '8명',
                  expertise: 'AWS·Azure 아키텍트, 프로덕트 매니저 출신',
                  achievements: 'B2B SaaS 스타트업 누적 30개사 지원, 총 ARR 200억 원 달성'
                },
                {
                  name: '온오프라인 교육사업',
                  color: 'emerald',
                  icon: '📚',
                  teamSize: '6명',
                  expertise: '에듀테크·학원사업·기업교육 전문가 그룹',
                  achievements: '교육 스타트업 50개사 투자 유치 지원, 총 300억 원 펀딩 성공'
                },
                {
                  name: '글로벌 유통사업',
                  color: 'cyan',
                  icon: '🌏',
                  teamSize: '10명',
                  expertise: 'KOTRA 출신, 해외 바이어 네트워크 보유',
                  achievements: '아마존·쿠팡 셀러 150개사 육성, 연간 해외 매출 500억 원 지원'
                },
                {
                  name: '레저 관광업',
                  color: 'amber',
                  icon: '✈️',
                  teamSize: '5명',
                  expertise: '관광학 박사·호텔리어·여행사 CEO 출신',
                  achievements: '지역관광 활성화 프로젝트 50건, 정부지원금 합격률 87%'
                },
                {
                  name: '뷰티 코스메틱',
                  color: 'pink',
                  icon: '💄',
                  teamSize: '7명',
                  expertise: '대기업 뷰티 브랜드 디렉터·MD 출신 그룹',
                  achievements: '인디 뷰티 브랜드 40개 런칭, 올리브영·시코르 입점 성공률 90%'
                },
                {
                  name: 'SNS 콘텐츠 수익화',
                  color: 'purple',
                  icon: '📱',
                  teamSize: '9명',
                  expertise: '100만 구독자 크리에이터·MCN 대표 출신',
                  achievements: '크리에이터 200명 육성, 누적 콘텐츠 수익 100억 원 돌파'
                },
                {
                  name: '멀티 채널 마케팅',
                  color: 'orange',
                  icon: '📊',
                  teamSize: '12명',
                  expertise: 'Google·Meta·네이버 공인 파트너 집단',
                  achievements: '퍼포먼스 마케팅 ROAS 평균 520% 달성, D2C 브랜드 100개사 성장 지원'
                },
                {
                  name: 'IT Infra 보안 & AI 안전',
                  color: 'slate',
                  icon: '🔐',
                  teamSize: '11명',
                  expertise: 'ISMS·ISO27001 심사원, AI 윤리 인증 전문가',
                  achievements: '정보보안 인증 취득 80건, AI 서비스 안전성 평가 50건 수행'
                },
              ].map((domain, i) => (
                <div
                  key={i}
                  className={`glass-card rounded-2xl p-6 border border-${domain.color}-500/20 hover:border-${domain.color}-500/40 transition-all hover-lift group`}
                >
                  {/* Domain Badge */}
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-full bg-${domain.color}-500/20 text-${domain.color}-400 text-sm font-bold mb-4`}>
                    {domain.name}
                  </div>

                  {/* Team Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${domain.color}-400 to-${domain.color}-600 flex items-center justify-center text-3xl`}>
                      {domain.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-base flex items-center gap-2">
                        전문 컨설턴트
                        <span className={`text-${domain.color}-400`}>{domain.teamSize}</span>
                      </div>
                      <div className={`text-${domain.color}-400/80 text-sm`}>{domain.expertise}</div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <p className="text-white/70 text-sm leading-relaxed">
                    📈 {domain.achievements}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-white/50 text-sm mb-4">그 외 모든 업종 지원 가능</p>
            <Button
              onClick={() => handlePlanSelect('프리미엄')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8 py-3 font-semibold border-0"
            >
              프리미엄 컨설팅 사전등록하기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section id="pricing-section" className="py-24 relative scroll-mt-[100px]" >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
              <Zap className="w-4 h-4" /> 요금제
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">합리적인 가격, 압도적인 가치</h2>
          </div>

          {/* 프로모션 기간 타임테이블 */}
          {getPromotionStatus().isActive && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="glass-card rounded-xl p-4 border border-white/10">
                <h3 className="text-base font-bold text-center mb-4 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  사전 등록 프로모션 일정
                </h3>
                
                {/* 타임라인 */}
                <div className="relative">
                  {/* 배경 라인 - Phase A, B 부분 */}
                  <div className="absolute top-5 left-0 w-[75%] h-1 bg-white/10 rounded-l-full" />
                  
                  {/* 배경 라인 - 서비스 오픈 부분 (미세한 파란색) */}
                  <div className="absolute top-5 right-0 w-[25%] h-1 bg-blue-400/20 rounded-r-full" />
                  
                  {/* 진행 상태 표시 */}
                  <div className={`absolute top-5 left-0 h-1 rounded-full transition-all duration-500 ${
                    getPromotionStatus().isPhaseA 
                      ? 'w-[40%] bg-gradient-to-r from-rose-500 to-orange-500' 
                      : getPromotionStatus().isPhaseB
                      ? 'w-[75%] bg-gradient-to-r from-rose-500 via-orange-500 to-emerald-500'
                      : 'w-[75%] bg-gradient-to-r from-rose-500 via-orange-500 to-emerald-500'
                  }`} />
                  
                  {/* 기간 표시 */}
                  <div className="relative flex items-start">
                    {/* Phase A: 연말연시 특별 */}
                    <div className={`flex-[1.5] text-center ${getPromotionStatus().isPhaseA ? 'opacity-100' : 'opacity-50'}`}>
                      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        getPromotionStatus().isPhaseA 
                          ? 'bg-gradient-to-r from-rose-500 to-orange-500 shadow-lg shadow-rose-500/30' 
                          : 'bg-white/20'
                      }`}>
                        <Flame className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-sm font-bold text-white mb-0.5">🔥 연말연시 특별</div>
                      <div className={`text-xl font-bold ${getPromotionStatus().isPhaseA ? 'text-rose-400' : 'text-white/50'}`}>
                        30% 할인
                      </div>
                      <div className="text-xs text-white/60">
                        {formatDateShort(PROMO_START_DATE)} ~ {formatDateShort(PHASE_A_END)}
                      </div>
                      {getPromotionStatus().isPhaseA && (
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 rounded-full text-xs text-rose-300 font-medium">
                          <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
                          진행 중
                        </div>
                      )}
                    </div>
                    
                    {/* Phase B: 얼리버드 특가 */}
                    <div className={`flex-[1.5] text-center ${getPromotionStatus().isPhaseB ? 'opacity-100' : 'opacity-50'}`}>
                      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        getPromotionStatus().isPhaseB 
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30' 
                          : 'bg-white/20'
                      }`}>
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-sm font-bold text-white mb-0.5">✨ 얼리버드 특가</div>
                      <div className={`text-xl font-bold ${getPromotionStatus().isPhaseB ? 'text-emerald-400' : 'text-white/50'}`}>
                        10% 할인
                      </div>
                      <div className="text-xs text-white/60">
                        {formatDateShort(getPhaseBStartDate().toISOString())} ~ {formatDateShort(PHASE_B_END)}
                      </div>
                      {getPromotionStatus().isPhaseB && (
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 rounded-full text-xs text-emerald-300 font-medium">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          진행 중
                        </div>
                      )}
                    </div>
                    
                    {/* 서비스 오픈 */}
                    <div className="flex-[1] text-center opacity-50">
                      <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1.5 bg-white/20">
                        <Rocket className="w-4 h-4 text-white/50" />
                      </div>
                      <div className="text-xs font-bold text-white mb-0.5">🚀 서비스 오픈</div>
                      <div className="text-sm font-bold text-white/50">
                        정식 오픈
                      </div>
                      <div className="text-xs text-white/60">
                        {formatDateShort(SERVICE_OPEN_DATE)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 안내 메시지 */}
                <div className="mt-3 text-center text-xs text-white/50">
                  {getPromotionStatus().isPhaseA ? (
                    <span>연말연시 기간에 등록하면 <strong className="text-rose-300">추가 20% 절약</strong> 혜택!</span>
                  ) : (
                    <span>정부지원사업 접수 시작일 전까지 사전 등록 시 할인 적용</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, i) => {
              // 할인 정보 계산 (무료 요금제 제외)
              const promoStatus = getPromotionStatus();
              const planPricing = plan.planKey ? getPlanPricing(plan.planKey) : null;
              // 프로모션이 활성화되어 있고, 요금제가 유료인 경우 할인 적용
              const hasDiscount = planPricing && promoStatus.isActive && planPricing.isDiscounted;
              
              return (
                <div key={i} className={`glass-card rounded-2xl p-6 hover-lift relative flex flex-col ${plan.popular ? 'border-2 border-purple-500 glow-purple' : 'border border-white/10'}`}>
                  {/* 할인 배지 (유료 요금제만) */}
                  {hasDiscount && (
                    <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse ${
                      promoStatus.isPhaseA 
                        ? 'bg-gradient-to-r from-rose-500 to-orange-500' 
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                    }`}>
                      {promoStatus.isPhaseA ? <Flame className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                      {promoStatus.discountRate}% OFF
                    </div>
                  )}
                  
                  {/* 요금제명과 인기 배지 */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    {plan.popular && (
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs font-bold whitespace-nowrap">
                        가장 인기
                      </div>
                    )}
                  </div>
                  
                  {/* 가격 영역 */}
                  <div className="mb-6 min-w-0">
                    {plan.planKey === null ? (
                      <div className="text-3xl font-bold text-white/50 break-words">₩0 <span className="text-lg">(무료 데모)</span></div>
                    ) : hasDiscount && planPricing ? (
                      <>
                        {/* 정가 (취소선) */}
                        <div className="text-lg text-white/40 line-through break-words">
                          ₩{formatPrice(planPricing.originalPrice)}
                        </div>
                        {/* 할인가 */}
                        <div className={`text-2xl sm:text-3xl font-bold break-words overflow-wrap-anywhere ${
                          promoStatus.isPhaseA ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          ₩{formatPrice(planPricing.currentPrice)}
                        </div>
                        {/* 절약 금액 */}
                        <div className={`text-sm font-medium mt-1 break-words ${
                          promoStatus.isPhaseA ? 'text-rose-300' : 'text-emerald-300'
                        }`}>
                          ₩{formatPrice(planPricing.savings)} 절약!
                        </div>
                        {/* Phase A 추가 절약 표시 */}
                        {promoStatus.isPhaseA && planPricing.extraSavingsVsPhaseB > 0 && (
                          <div className="text-xs text-orange-300 mt-1 break-words">
                            연말 특가 추가 혜택 ₩{formatPrice(planPricing.extraSavingsVsPhaseB)}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-2xl sm:text-3xl font-bold break-words overflow-wrap-anywhere">₩{plan.price}</div>
                    )}
                    {plan.period && <div className="text-sm text-white/60 mt-2 break-words">{plan.period}</div>}
                  </div>
                  
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((f, j) => {
                      const isObject = typeof f === 'object' && f !== null;
                      const text = isObject ? f.text : f;
                      const note = isObject ? f.note : null;
                      
                      return (
                        <li key={j} className="flex items-start gap-2 text-sm text-white/80">
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span>{text}</span>
                            {note && (
                              <div className="text-xs text-white/40 mt-0.5">{note}</div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  
                  {/* CTA 버튼 */}
                  {plan.name === '기본' ? (
                    // 무료 데모 전용: 두 개의 버튼이 있는 카드 영역
                    <div className="bg-white/5 rounded-lg p-3 space-y-2">
                      <p className="text-xs text-white/50 text-center mb-2">무료 데모 바로가기</p>
                      <Button 
                        onClick={() => navigate('/writing-demo')} 
                        className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-sm py-2"
                      >
                        사업계획서 작성 데모
                      </Button>
                      <Button 
                        onClick={() => navigate('/evaluation-demo')} 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm py-2"
                      >
                        AI 평가받기 데모
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handlePlanSelect(plan.name)} 
                      className={`w-full ${
                        hasDiscount && promoStatus.isPhaseA
                          ? 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400'
                          : plan.popular 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                            : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {hasDiscount && promoStatus.isPhaseA ? (
                        <>
                          <Flame className="w-4 h-4 mr-1" />
                          연말연시 특가 등록
                        </>
                      ) : hasDiscount ? (
                        '사전 등록하기'
                      ) : (
                        plan.cta
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* 사전등록 프로세스 안내 */}
          <div className="text-center mt-10 space-y-4">
            <div className="max-w-2xl mx-auto glass-card rounded-xl p-4 border border-white/10">
              <p className="text-white/90 text-sm font-medium mb-2">📧 사전등록 프로세스 안내</p>
              <ul className="text-white/60 text-xs space-y-1">
                <li>1. 사전등록 완료 시 할인코드가 포함된 이메일이 발송됩니다</li>
                <li>2. 서비스 정식 오픈 후 할인코드로 결제를 진행합니다</li>
                <li>3. <strong className="text-white/80">현재 단계에서는 결제가 발생하지 않습니다</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STEP-BY-STEP SOLUTION SECTION ===== */}
      <section id="solution-steps" className="py-24 relative overflow-hidden scroll-mt-[100px]" >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
              <Users className="w-4 h-4" /> 단계별 솔루션
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              혹시 이런 상황이신가요?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Makers World는 다양한 단계의 고민을 해결합니다
            </p>
          </div>

          {/* Persona Cards */}
          {/* Persona Cards - 2x2 Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                tier: '기본',
                tierDesc: '빠른 초안 작성으로 사업 본질에 집중',
                name: '김예비',
                role: '예비창업패키지 지원자',
                avatar: '👨‍💼',
                problem: '마감이 일주일 남았는데, 시장 분석과 재무 추정 항목을 어떻게 채워야 할지 막막합니다.',
                emotion: '불안, 초조, 막막함',
                goal: '5천만 원 지원금을 위한 전문가 수준 사업계획서 완성',
                color: 'slate',
                gradient: 'from-slate-500 to-zinc-600',
                borderColor: 'border-slate-500/30',
                buttonText: '가입 및 무료 데모 체험'
              },
              {
                tier: '플러스',
                tierDesc: '심사위원회 평가 추천',
                name: '최민혁',
                role: '재창업가 (엔지니어 출신)',
                avatar: '🧑‍💻',
                problem: '첫 창업 때 시장 수요 없음으로 실패. 기술력만 믿고 2년간 개발했는데 아무도 원하지 않았습니다.',
                emotion: '신중함, 분석적',
                goal: '코드 한 줄 짜기 전, 데이터로 철저히 검증하고 PMF 찾기',
                color: 'blue',
                gradient: 'from-blue-500 to-indigo-600',
                borderColor: 'border-blue-500/30',
                buttonText: '플러스 요금제 사전등록'
              },
              {
                tier: '프로',
                tierDesc: '사업 위기를 극복할 인사이트 확보',
                name: '박사장',
                role: '2년 차 소상공인 (카페)',
                avatar: '☕',
                problem: '매출 정체로 3천만 원 대출이 필요한데, 은행에서 상권 분석과 추정 손익이 포함된 사업계획서를 요구합니다.',
                emotion: '답답함, 숫자 울렁증',
                goal: '은행 대출 심사 통과하여 운영 자금 확보',
                color: 'purple',
                gradient: 'from-purple-500 to-violet-600',
                borderColor: 'border-purple-500/30',
                buttonText: '프로 요금제 사전등록'
              },
              {
                tier: '프리미엄',
                tierDesc: '투자유치를 위한 수준높은 사업 컨설팅',
                name: '한서윤',
                role: '투자 유치 준비 CEO',
                avatar: '👩‍💼',
                problem: 'IR Deck 초안은 만들었지만, VC가 신뢰할 TAM-SAM-SOM 시장 규모와 근거가 부족합니다.',
                emotion: '야심 참, 압박감',
                goal: '5억 원 투자 유치를 위한 방어 가능한 IR Deck 완성',
                color: 'amber',
                gradient: 'from-amber-500 to-orange-600',
                borderColor: 'border-amber-500/30',
                buttonText: '프리미엄 요금제 사전등록'
              },
            ].map((persona, i) => (
              <div
                key={i}
                className={`glass-card rounded-2xl p-6 hover-lift border ${persona.borderColor} transition-all group relative overflow-hidden`}
              >
                {/* Tier Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${persona.gradient} text-xs font-bold text-white shadow-lg`}>
                  {persona.tier}
                </div>

                {/* Tier Description */}
                <div className="mb-5">
                  <span className={`text-xs text-${persona.color}-400 font-medium`}>{persona.tierDesc}</span>
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="text-4xl">{persona.avatar}</div>
                  <div>
                    <h3 className="text-lg font-bold">{persona.name}</h3>
                    <p className="text-sm text-white/60">{persona.role}</p>
                  </div>
                </div>

                {/* Problem & Emotion */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-semibold text-red-400">겪고 있는 문제</span>
                    <span className="text-xs text-white/40">|</span>
                    <span className="text-xs text-pink-400/80">{persona.emotion}</span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">"{persona.problem}"</p>
                </div>

                {/* Goal */}
                <div className={`p-4 rounded-xl bg-${persona.color}-500/10 border border-${persona.color}-500/20`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">이루고 싶은 목표</span>
                  </div>
                  <p className="text-sm text-white/90 font-medium">{persona.goal}</p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handlePlanSelect(persona.tier)}
                  className={`w-full mt-5 py-3 rounded-xl bg-gradient-to-r ${persona.gradient} text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                >
                  {persona.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom message */}
          <div className="text-center mt-12">
            <p className="text-white/50">
              어떤 요금제가 맞는지 모르겠다면, <button onClick={() => handlePlanSelect('기본')} className="text-purple-400 hover:text-purple-300 underline underline-offset-4">무료로 시작</button>해보세요
            </p>
          </div>
        </div>
      </section>

      {/* ===== MAKERS WORLD INTRODUCTION ===== */}
      <section id="testimonials-section" className="py-24 relative overflow-hidden scroll-mt-[100px]" >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-[80px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Title */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6">
              <Globe className="w-4 h-4" /> 전방위 창업자 지원 서비스
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Makers World가<br/>당신의 사업 여정을 함께합니다
            </h2>

            {/* 3단계 창업 여정 with descriptions */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              {[
                { icon: Rocket, title: '창업 시작', desc: '아이디어 구체화부터 사업계획서 작성까지', color: 'from-blue-500 to-cyan-500' },
                { icon: Target, title: '자금 확보', desc: '정부지원금, 투자유치, 대출 등 다양한 경로', color: 'from-purple-500 to-pink-500' },
                { icon: TrendingUp, title: '성장 가속', desc: '시장 분석, 마케팅 전략, 사업 확장까지', color: 'from-emerald-500 to-teal-500' },
              ].map((item, i) => (
                <div key={i} className="glass-card rounded-xl p-5 border border-white/10 text-center hover-lift">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Makers World는 창업의 시작부터 성장까지,<br className="hidden md:block" />
              모든 단계에서 당신의 든든한 파트너가 됩니다.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center mb-12">
            {/* Left Column - Logo */}
            <div className="flex flex-col items-center justify-center">
              <img
                src="/assets/2_Makersworld-logo-neon.png"
                alt="Makers World Logo"
                className="h-48 md:h-64 lg:h-72 w-auto object-contain"
              />
            </div>

            {/* Right Column - Video */}
            <div className="flex flex-col">
              <div className="w-full rounded-2xl overflow-hidden shadow-xl shadow-indigo-500/20 border border-white/10">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto"
                >
                  <source src="/assets/1_251204_메이커스월드_소개영상.mp4" type="video/mp4" />
                  브라우저가 비디오 태그를 지원하지 않습니다.
                </video>
              </div>
            </div>
          </div>

          {/* Tagline - Full Width Bottom */}
          <div className="glass-card rounded-2xl p-10 border border-indigo-500/20 text-center max-w-4xl mx-auto">
            <p className="text-3xl md:text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              "세상의 모든 Maker를 위한 World"
            </p>
            <p className="text-lg text-white/60 mb-6">
              Makers World와 함께라면, 당신의 아이디어가 현실이 됩니다.
            </p>
            {/* Team Intro Button */}
            <Button
              onClick={() => { navigate('/team'); window.scrollTo(0, 0); }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-3 font-semibold border-0"
            >
              <Users className="w-5 h-5 mr-2" />
              팀 소개 보기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===== SEO KEYWORDS ===== */}
      <section className="py-16" >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {seoKeywords.map((k, i) => (
              <span key={i} className="px-4 py-2 glass rounded-full text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">#{k}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 relative overflow-hidden" >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-slate-900" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            지금 바로<br /><span className="text-gradient">AI 심사위원단</span>을 만나보세요
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-xl mx-auto">
            무료로 시작하고, 6명의 AI 심사위원에게<br />사업계획서 피드백을 받아보세요
          </p>
          <Button size="lg" onClick={handleCTAClick} className="bg-gradient-to-r from-purple-600 to-blue-600 px-12 py-5 text-xl font-bold shadow-2xl animate-pulse-glow border-0">
            무료로 시작하기 <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/60 text-sm">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" />회원가입 불필요</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" />기본 기능 무료</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" />즉시 다운로드</span>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 border-t border-white/10 select-none">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center pointer-events-none">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">Makers Round</span>
          </div>
          <p className="text-white/40 text-sm">© 2020 Makers World®. M.A.K.E.R.S AI 심사위원단</p>
        </div>
      </footer>

      {/* ===== 사전 등록 완료 화면 (회원가입 후 표시) ===== */}
      {lastRegistration && <PreRegistrationSuccess />}
    </div>
  );
});

LandingPage.displayName = 'LandingPage';
