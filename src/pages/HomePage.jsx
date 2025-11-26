import React from 'react';
import { useNavigate } from 'react-router-dom';

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CoffeeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 8h1a4 4 0 010 8h-1" />
    <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

// 더미 카페 데이터
const FEATURED_CAFES = [
  {
    id: 'ajou-cafe-1',
    name: '아주 카페 본점',
    description: '신공학관 1층',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    isOpen: true,
    waitTime: '5-10분',
    rating: 4.8,
    menuCount: 25,
  },
  {
    id: 'ajou-cafe-2',
    name: '팔달관 카페',
    description: '팔달관 지하 1층',
    imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800',
    isOpen: true,
    waitTime: '10-15분',
    rating: 4.5,
    menuCount: 20,
  },
  {
    id: 'ajou-cafe-3',
    name: '중앙도서관 카페',
    description: '중앙도서관 1층',
    imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800',
    isOpen: false,
    waitTime: '-',
    rating: 4.7,
    menuCount: 18,
  },
  {
    id: 'ajou-cafe-4',
    name: '학생회관 카페',
    description: '학생회관 2층',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    isOpen: true,
    waitTime: '5분',
    rating: 4.3,
    menuCount: 15,
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 영역 */}
      <div className="bg-gradient-to-br from-ajou-primary via-ajou-secondary to-ajou-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 sm:py-12 lg:py-16">
            {/* 로고 & 타이틀 */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                <CoffeeIcon />
              </div>
              <div className="text-white">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">AjouOrder</h1>
                <p className="text-white/70 text-sm sm:text-base">아주대 캠퍼스 카페 주문</p>
              </div>
            </div>
            
            {/* 위치 정보 */}
            <div className="flex items-center gap-2 text-white/80">
              <LocationIcon />
              <span className="text-sm sm:text-base">아주대학교 캠퍼스</span>
            </div>
            
            {/* 통계 카드 - 데스크탑에서만 */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-white">
                <p className="text-2xl font-bold">{FEATURED_CAFES.filter(c => c.isOpen).length}</p>
                <p className="text-white/70 text-sm">영업중인 카페</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-white">
                <p className="text-2xl font-bold">5-15분</p>
                <p className="text-white/70 text-sm">평균 대기시간</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-white">
                <p className="text-2xl font-bold">78개</p>
                <p className="text-white/70 text-sm">주문 가능 메뉴</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">카페 선택</h2>
            <p className="text-gray-500 text-sm mt-1">원하는 카페를 선택하세요</p>
          </div>
          <button 
            onClick={() => navigate('/cafes')}
            className="text-ajou-primary text-sm font-medium flex items-center gap-1 hover:underline"
          >
            전체보기
            <ChevronRightIcon />
          </button>
        </div>
        
        {/* 카페 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {FEATURED_CAFES.map((cafe, index) => (
            <div
              key={cafe.id}
              onClick={() => cafe.isOpen && navigate(`/cafe/${cafe.id}/menu`)}
              className={`
                bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer
                hover:shadow-card-hover transition-all duration-300 
                hover:-translate-y-1 animate-slide-up
                ${!cafe.isOpen ? 'opacity-60 cursor-not-allowed hover:translate-y-0' : ''}
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* 카페 이미지 */}
              <div className="relative h-40 sm:h-48">
                <img
                  src={cafe.imageUrl}
                  alt={cafe.name}
                  className="w-full h-full object-cover"
                />
                {!cafe.isOpen && (
                  <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                    <span className="text-white font-bold px-4 py-2 bg-black/50 rounded-full">
                      준비중
                    </span>
                  </div>
                )}
                {cafe.isOpen && (
                  <div className="absolute top-3 left-3">
                    <span className="badge-primary">영업중</span>
                  </div>
                )}
              </div>
              
              {/* 카페 정보 */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{cafe.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{cafe.description}</p>
                  </div>
                  {cafe.isOpen && (
                    <div className="text-gray-400">
                      <ChevronRightIcon />
                    </div>
                  )}
                </div>
                
                {/* 추가 정보 */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <ClockIcon />
                    <span>{cafe.waitTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>⭐</span>
                    <span>{cafe.rating}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    메뉴 {cafe.menuCount}개
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 공지사항 배너 */}
        <div className="mt-8 bg-gradient-to-r from-ajou-light to-blue-50 rounded-2xl p-6 border border-ajou-primary/10">
          <div className="flex items-start gap-4">
            <span className="text-2xl">📢</span>
            <div>
              <p className="font-semibold text-ajou-primary">공지사항</p>
              <p className="text-gray-700 text-sm mt-1">
                중앙도서관 카페는 시험 기간 중 연장 운영합니다. (22:00까지)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
