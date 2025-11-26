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

// 더미 카페 데이터
const FEATURED_CAFES = [
  {
    id: 'ajou-cafe-1',
    name: '아주 카페 본점',
    description: '신공학관 1층',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    isOpen: true,
    waitTime: '5-10분',
  },
  {
    id: 'ajou-cafe-2',
    name: '팔달관 카페',
    description: '팔달관 지하 1층',
    imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400',
    isOpen: true,
    waitTime: '10-15분',
  },
  {
    id: 'ajou-cafe-3',
    name: '중앙도서관 카페',
    description: '중앙도서관 1층',
    imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400',
    isOpen: false,
    waitTime: '-',
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="page-container bg-gradient-to-b from-ajou-primary to-ajou-dark min-h-screen">
      {/* 헤더 영역 */}
      <div className="px-6 pt-12 pb-8 text-white">
        {/* 로고 & 타이틀 */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <CoffeeIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AjouOrder</h1>
            <p className="text-white/70 text-sm">아주대 캠퍼스 카페 주문</p>
          </div>
        </div>
        
        {/* 위치 정보 */}
        <div className="flex items-center gap-2 mt-6 text-white/80">
          <LocationIcon />
          <span className="text-sm">아주대학교 캠퍼스</span>
        </div>
      </div>
      
      {/* 메인 컨텐츠 */}
      <div className="bg-gray-50 rounded-t-3xl min-h-[calc(100vh-200px)] px-4 py-6">
        {/* 빠른 주문 섹션 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">카페 선택</h2>
            <button 
              onClick={() => navigate('/cafes')}
              className="text-ajou-primary text-sm font-medium flex items-center gap-1"
            >
              전체보기
              <ChevronRightIcon />
            </button>
          </div>
          
          {/* 카페 카드 목록 */}
          <div className="space-y-3">
            {FEATURED_CAFES.map((cafe, index) => (
              <div
                key={cafe.id}
                onClick={() => cafe.isOpen && navigate(`/cafe/${cafe.id}/menu`)}
                className={`
                  card flex gap-4 cursor-pointer animate-slide-up
                  ${!cafe.isOpen ? 'opacity-60 cursor-not-allowed' : ''}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* 카페 이미지 */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <img
                    src={cafe.imageUrl}
                    alt={cafe.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {!cafe.isOpen && (
                    <div className="absolute inset-0 bg-gray-900/60 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs font-bold">준비중</span>
                    </div>
                  )}
                </div>
                
                {/* 카페 정보 */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-semibold text-gray-900">{cafe.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{cafe.description}</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    {cafe.isOpen ? (
                      <>
                        <span className="badge-primary">영업중</span>
                        <span className="text-xs text-gray-500">
                          예상 대기: {cafe.waitTime}
                        </span>
                      </>
                    ) : (
                      <span className="badge bg-gray-200 text-gray-600">영업 종료</span>
                    )}
                  </div>
                </div>
                
                {/* 화살표 */}
                {cafe.isOpen && (
                  <div className="flex items-center text-gray-400">
                    <ChevronRightIcon />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* 공지사항 배너 */}
        <div className="bg-ajou-light rounded-2xl p-4 mb-20">
          <p className="text-ajou-primary text-sm font-medium">📢 공지</p>
          <p className="text-gray-700 text-sm mt-1">
            중앙도서관 카페는 시험 기간 중 연장 운영합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
