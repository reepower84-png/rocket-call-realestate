"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitResult({ success: true, message: "상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다." });
        setFormData({ name: "", phone: "", message: "" });
      } else {
        setSubmitResult({ success: false, message: result.error || "오류가 발생했습니다." });
      }
    } catch {
      setSubmitResult({ success: false, message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">🏢</span>
            <span className="text-xl font-bold text-emerald-600">로켓콜</span>
            <span className="text-sm text-gray-500 hidden sm:inline">| 분양 전문</span>
          </button>
          <div className="flex items-center gap-3">
            <a
              href="https://drive.google.com/file/d/1FGpJjks9asLnWIAS6wd7be0ARZDssLNM/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-medium transition-all duration-300"
            >
              제안서 보기
            </a>
            <button
              onClick={scrollToForm}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-medium transition-all duration-300 hover:shadow-lg"
            >
              무료 상담 신청
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 gradient-bg text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            🏗️ 부동산 분양 현장 전문 약속콜 서비스
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-yellow-300">확정된 고객</span>만<br />
            딱! 보내드립니다
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            더 이상 불확실한 고객에게 시간 낭비하지 마세요.<br />
            방문 약속이 확정된 고객만 분양 현장으로 보내드립니다.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300">98%</div>
              <div className="text-emerald-100 text-sm">약속 성사율</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300">3,000+</div>
              <div className="text-emerald-100 text-sm">누적 약속 건수</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300">150+</div>
              <div className="text-emerald-100 text-sm">파트너 분양 현장</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300">40%↑</div>
              <div className="text-emerald-100 text-sm">평균 계약률 상승</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToForm}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              지금 무료 상담받기 →
            </button>
            <button
              onClick={() => scrollToSection("about-section")}
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 border border-white/30"
            >
              서비스 자세히 보기
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="about-section" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              분양 현장에서 이런 고민 있으시죠?
            </h2>
            <p className="text-gray-600 text-lg">고객 유치, 정말 힘드시죠. 저희가 압니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center card-shadow card-hover transition-all duration-300">
              <div className="text-5xl mb-4">😰</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">연락 두절 고객</h3>
              <p className="text-gray-600 text-sm">약속 잡아놨는데 연락이 안 되는 고객들...</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center card-shadow card-hover transition-all duration-300">
              <div className="text-5xl mb-4">🙅</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">구매 의향 없는 고객</h3>
              <p className="text-gray-600 text-sm">그냥 구경만 하러 온 고객들에게 시간 낭비</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center card-shadow card-hover transition-all duration-300">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">노쇼(No-Show)</h3>
              <p className="text-gray-600 text-sm">방문 약속 잡았는데 나타나지 않는 고객</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center card-shadow card-hover transition-all duration-300">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">시간 낭비</h3>
              <p className="text-gray-600 text-sm">불확실한 고객 응대에 소중한 시간 소모</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🚀 로켓콜의 솔루션
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              로켓콜은 <span className="text-emerald-600">다릅니다</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              2단계 검증 시스템으로 확정된 고객만 보내드립니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-100">
              <div className="bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1차 검증: 구매 의향 확인</h3>
              <p className="text-gray-600">
                전문 TM 팀이 고객의 실제 구매 의향과 예산, 관심 지역을 꼼꼼히 확인합니다.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-100">
              <div className="bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2차 검증: 방문 약속 확정</h3>
              <p className="text-gray-600">
                분양 현장 방문 일정을 확정하고, 방문 전 리마인드 콜로 노쇼를 방지합니다.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-2xl px-8 py-6">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                🏆 100% 약속 보장제도
              </div>
              <p className="text-gray-600">
                노쇼 발생 시 동일 조건의 고객을 <span className="font-bold text-emerald-600">무료로 재배정</span>해드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why <span className="text-emerald-600">로켓콜</span>?
            </h2>
            <p className="text-gray-600 text-lg">분양 현장의 성공을 위한 6가지 핵심 가치</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 card-shadow card-hover transition-all duration-300">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">확정 고객만 연결</h3>
              <p className="text-gray-600 text-sm">방문 약속이 확정된 고객만 보내드려 시간 낭비를 줄여드립니다.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 card-shadow card-hover transition-all duration-300">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">시간 절약</h3>
              <p className="text-gray-600 text-sm">고객 발굴에 쓰는 시간을 실제 상담과 계약에 집중하세요.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 card-shadow card-hover transition-all duration-300">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">매출 증대</h3>
              <p className="text-gray-600 text-sm">파트너 현장 평균 계약률 40% 이상 상승 효과</p>
            </div>
            <div className="bg-white rounded-2xl p-6 card-shadow card-hover transition-all duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">타겟 맞춤 고객</h3>
              <p className="text-gray-600 text-sm">현장 특성에 맞는 예산대, 지역, 조건의 고객을 매칭합니다.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 card-shadow card-hover transition-all duration-300">
              <div className="text-4xl mb-4">👨‍💼</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">전담 매니저</h3>
              <p className="text-gray-600 text-sm">현장별 전담 매니저가 밀착 관리하여 최적의 서비스를 제공합니다.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 card-shadow card-hover transition-all duration-300">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">합리적 비용</h3>
              <p className="text-gray-600 text-sm">성과 기반 합리적인 비용 구조로 부담 없이 시작하세요.</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={scrollToForm}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-xl"
            >
              무료 상담 신청하기 →
            </button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              서비스 이용 절차
            </h2>
            <p className="text-gray-600 text-lg">간단한 4단계로 확정 고객을 만나보세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">상담 신청</h3>
              <p className="text-gray-600 text-sm">아래 폼을 통해 무료 상담을 신청하세요</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">맞춤 상담</h3>
              <p className="text-gray-600 text-sm">전담 매니저가 현장 상황을 파악합니다</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">약속콜 시작</h3>
              <p className="text-gray-600 text-sm">전문 TM 팀이 고객 발굴을 시작합니다</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">고객 연결</h3>
              <p className="text-gray-600 text-sm">확정된 고객이 현장을 방문합니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              파트너 현장의 생생한 후기
            </h2>
            <p className="text-gray-600 text-lg">로켓콜과 함께하는 분양 현장의 이야기</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 card-shadow">
              <div className="flex text-yellow-400 mb-4">
                {"⭐".repeat(5)}
              </div>
              <p className="text-gray-700 mb-4">
                &ldquo;확정된 고객만 보내주시니까 노쇼 걱정이 없어요. 계약률이 눈에 띄게 올랐습니다.&rdquo;
              </p>
              <div className="border-t pt-4">
                <div className="font-bold text-gray-900">김OO 팀장</div>
                <div className="text-gray-500 text-sm">○○건설 분양대행사 / 경력 8년</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 card-shadow">
              <div className="flex text-yellow-400 mb-4">
                {"⭐".repeat(5)}
              </div>
              <p className="text-gray-700 mb-4">
                &ldquo;전담 매니저님이 현장 상황을 잘 이해해주셔서 딱 맞는 고객을 연결해주세요.&rdquo;
              </p>
              <div className="border-t pt-4">
                <div className="font-bold text-gray-900">이OO 실장</div>
                <div className="text-gray-500 text-sm">△△부동산 / 경력 12년</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 card-shadow">
              <div className="flex text-yellow-400 mb-4">
                {"⭐".repeat(5)}
              </div>
              <p className="text-gray-700 mb-4">
                &ldquo;고객 발굴에 쓰던 시간을 상담에 집중하니 성과가 확 달라졌습니다. 강력 추천!&rdquo;
              </p>
              <div className="border-t pt-4">
                <div className="font-bold text-gray-900">박OO 소장</div>
                <div className="text-gray-500 text-sm">□□분양 현장 / 경력 15년</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-20 px-4 gradient-bg text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            로켓콜의 약속
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="font-bold text-lg mb-2">확정 고객만 전달</h3>
              <p className="text-emerald-100 text-sm">방문 약속이 확정된 고객만 보내드립니다</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="font-bold text-lg mb-2">노쇼 시 무료 재배정</h3>
              <p className="text-emerald-100 text-sm">약속 불이행 시 동일 조건 고객 무료 제공</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="font-bold text-lg mb-2">리스크 제로</h3>
              <p className="text-emerald-100 text-sm">성과가 없으면 비용도 없습니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              서비스 상품 안내
            </h2>
            <p className="text-gray-600 text-lg">현장 상황에 맞는 최적의 상품을 선택하세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl p-8 card-shadow border-2 border-emerald-500">
              <div className="absolute -top-3 left-6 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                BEST
              </div>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">확정 고객 DB</h3>
              <p className="text-gray-600 mb-4">
                방문 약속이 100% 확정된 고객만 전달해드립니다. 노쇼 시 무료 재배정 보장.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✅ 2단계 검증 완료 고객</li>
                <li>✅ 방문 전 리마인드 콜</li>
                <li>✅ 노쇼 시 무료 재배정</li>
                <li>✅ 전담 매니저 배정</li>
              </ul>
              <button
                onClick={scrollToForm}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold transition-all duration-300"
              >
                상담 신청하기
              </button>
            </div>
            <div className="bg-white rounded-2xl p-8 card-shadow border border-gray-200">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">관심 고객 DB</h3>
              <p className="text-gray-600 mb-4">
                분양에 관심을 보인 잠재 고객 정보를 제공합니다. 직접 약속을 잡으실 현장에 추천.
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✅ 구매 의향 확인 고객</li>
                <li>✅ 기본 정보 제공</li>
                <li>✅ 합리적인 가격</li>
                <li>✅ 대량 구매 할인</li>
              </ul>
              <button
                onClick={scrollToForm}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-all duration-300"
              >
                상담 신청하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 px-4 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              무료 상담 신청
            </h2>
            <p className="text-gray-600">
              아래 정보를 입력해주시면 빠르게 연락드리겠습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 card-shadow">
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="홍길동"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="010-1234-5678"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                상담 문의
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-32 resize-none"
                placeholder="문의하실 내용을 입력해주세요 (선택)"
              />
            </div>

            {submitResult && (
              <div className={`mb-6 p-4 rounded-xl ${submitResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {submitResult.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-lg"
            >
              {isSubmitting ? "신청 중..." : "무료 상담 신청하기"}
            </button>

            <p className="text-gray-500 text-xs text-center mt-4">
              입력하신 정보는 상담 목적으로만 사용되며, 개인정보 보호정책에 따라 안전하게 관리됩니다.
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-2xl">🏢</span>
              <span className="text-xl font-bold text-white">로켓콜-분양</span>
            </div>
            <button
              onClick={scrollToForm}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300"
            >
              무료 상담 신청
            </button>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm">
            <p className="mb-2">상호: 제이코리아 | 대표: 이주영</p>
            <p className="mb-4">사업자등록번호: 278-30-01540</p>
            <p className="text-gray-500">
              © 2024 로켓콜-분양. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
