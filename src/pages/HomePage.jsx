import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CoffeeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8h1a4 4 0 010 8h-1" />
    <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22,2 15,22 11,13 2,9" />
  </svg>
);

// 실제 카페 데이터
const CAFES = [
  {
    id: 'ajou-cafe-1',
    name: '팬도로시 학생회관점',
    location: '학생회관 2층',
    imageUrl: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTAzMDVfMTEw%2FMDAxNzQxMTM1MTUxOTY4.Ir61PzuObmq7hJb76s9Cc3PeKY72XirWpPzaLcCFG3cg.fYw4u_GXqJ0XGvJad-TyslsNjmvB99KAcP7GKeMLd34g.JPEG%2F1000049512.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
    isOpen: true,
    waitTime: '5분',
    rating: 4.3,
  },
  {
    id: 'ajou-cafe-2',
    name: '팬도로시 도서관점',
    location: '중앙도서관 1층',
    imageUrl: 'https://polle-image.tabling.co.kr/posts/1Lrl_kgNnvvzB5z0j5fO4g.jpg?s=800x800',
    isOpen: false,
    waitTime: '-',
    rating: 4.7,
  },
  {
    id: 'ajou-cafe-3',
    name: 'CAFÉ ING',
    location: '일신관 1층',
    imageUrl: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA0MDVfMTc5%2FMDAxNzEyMzEzNTk2ODE5.hmhM74kEgAYhKDtVPAvIy6cgAkXrTaSQYHY2ImLbhbAg.lijIewfajsdpBUD59mevCALkrmVG6ztJCzFEfl1jCncg.JPEG%2F20240404_090438.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
    isOpen: true,
    waitTime: '5분',
    rating: 4.5,
  },
  {
    id: 'ajou-cafe-4',
    name: '다산관 카페',
    location: '다산관 1층',
    imageUrl: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTAzMjRfNTgg%2FMDAxNzQyNzkxNjc0ODkz.eIUSqv-Zz8G1nyQTz1yP9XtIfp0MxOjpO_6sPK7XQrkg.qA7Ff9SmsUnN07PHrs9mKpmlNO89O9lEedkZaUEgX_8g.JPEG%2F20250324_134512.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
    isOpen: true,
    waitTime: '5분',
    rating: 4.3,
  },
];

// 공지사항 데이터
const NOTICES = [
  {
    id: 1,
    type: 'info',
    title: '시험기간 연장 운영',
    content: '중앙도서관 카페 22:00까지 연장 운영합니다.',
    date: '12.01',
  },
  {
    id: 2,
    type: 'event',
    title: '신메뉴 출시 🎉',
    content: '겨울 시즌 한정 메뉴가 출시되었습니다!',
    date: '11.28',
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notice');
  const [feedbackText, setFeedbackText] = useState('');
  const [recommendText, setRecommendText] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) return;
    console.log('건의사항:', feedbackText);
    setFeedbackText('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 2000);
  };
  
  const handleSubmitRecommend = () => {
    if (!recommendText.trim()) return;
    console.log('메뉴 추천:', recommendText);
    setRecommendText('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 2000);
  };
  
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-ajou-primary to-ajou-secondary rounded-xl flex items-center justify-center text-white">
                <CoffeeIcon />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AjouOrder</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/admin')}
                className="text-sm text-gray-500 hover:text-ajou-primary transition-colors"
              >
                관리자
              </button>
              <span className="text-sm text-gray-500">아주대학교</span>
              <div className="w-8 h-8 bg-ajou-light rounded-full flex items-center justify-center">
                <span className="text-ajou-primary text-sm font-medium">👤</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="h-full flex gap-6">
            
            {/* 왼쪽: 카페 선택 */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-900">카페 선택</h2>
                <p className="text-gray-500 text-sm mt-1">주문할 카페를 선택하세요</p>
              </div>
              
              {/* 카페 카드 그리드 */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 content-start overflow-auto">
                {CAFES.map((cafe) => (
                  <div
                    key={cafe.id}
                    onClick={() => cafe.isOpen && navigate(`/cafe/${cafe.id}/menu`)}
                    className={`
                      bg-white rounded-4xl overflow-hidden cursor-pointer
                      border-2 border-transparent
                      hover:border-ajou-primary/20 hover:shadow-card-hover
                      transition-all duration-300 hover:-translate-y-1
                      ${!cafe.isOpen ? 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:border-transparent' : ''}
                    `}
                    style={{ boxShadow: '0 4px 20px rgba(31, 47, 152, 0.08)' }}
                  >
                    <div className="flex h-full">
                      <div className="relative w-32 sm:w-40 flex-shrink-0">
                        <img
                          src={cafe.imageUrl}
                          alt={cafe.name}
                          className="w-full h-full object-cover"
                        />
                        {!cafe.isOpen && (
                          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                            <span className="text-white text-xs font-bold px-3 py-1 bg-black/40 rounded-full">
                              준비중
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 p-4 flex flex-col justify-center">
                        <div>
                          {cafe.isOpen && (
                            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[10px] sm:text-xs font-medium rounded-full mb-2">
                              영업중
                            </span>
                          )}

                          <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">
                            {cafe.name}
                          </h3>

                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            {cafe.location}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                            <ClockIcon />
                            <span>{cafe.waitTime}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                            <StarIcon />
                            <span>{cafe.rating}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
              
              {/* 하단 통계 */}
              <div className="mt-4 flex gap-3">
                <div className="flex-1 bg-ajou-light/50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-ajou-primary">{CAFES.filter(c => c.isOpen).length}</p>
                  <p className="text-xs text-gray-500 mt-1">영업중</p>
                </div>
                <div className="flex-1 bg-ajou-accent-light/50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-ajou-accent">5분</p>
                  <p className="text-xs text-gray-500 mt-1">평균 대기</p>
                </div>
                <div className="flex-1 bg-gray-100 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-700">80+</p>
                  <p className="text-xs text-gray-500 mt-1">메뉴</p>
                </div>
              </div>
            </div>
            
            {/* 오른쪽: 탭 패널 */}
            <div className="w-80 flex-shrink-0 hidden lg:flex flex-col">
              <div className="flex bg-gray-100 rounded-2xl p-1 mb-4">
                <button
                  onClick={() => setActiveTab('notice')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === 'notice' ? 'bg-white text-ajou-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📢 공지
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === 'feedback' ? 'bg-white text-ajou-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  💬 건의
                </button>
                <button
                  onClick={() => setActiveTab('recommend')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === 'recommend' ? 'bg-white text-ajou-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ✨ 추천
                </button>
              </div>
              
              <div className="flex-1 flex flex-col overflow-hidden">
                {activeTab === 'notice' && (
                  <>
                    <div className="flex-1 flex flex-col gap-3 overflow-auto">
                      {NOTICES.map((notice) => (
                        <div
                          key={notice.id}
                          className={`p-4 rounded-3xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                            ${notice.type === 'event' 
                              ? 'bg-ajou-accent-light/30 border-ajou-accent/20 hover:border-ajou-accent/40' 
                              : 'bg-white border-gray-100 hover:border-ajou-primary/20'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-semibold ${notice.type === 'event' ? 'text-ajou-accent' : 'text-gray-900'}`}>
                                {notice.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notice.content}</p>
                            </div>
                            <span className="text-xs text-gray-400 ml-2">{notice.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 bg-gradient-to-br from-ajou-primary to-ajou-secondary rounded-3xl p-5 text-white">
                      <p className="text-sm font-medium opacity-90">이번 주 인기 메뉴</p>
                      <p className="text-lg font-bold mt-1">아메리카노 ☕</p>
                      <p className="text-xs opacity-70 mt-2">전체 주문의 45%를 차지했어요</p>
                    </div>
                  </>
                )}
                
                {activeTab === 'feedback' && (
                  <div className="flex-1 flex flex-col">
                    <div className="bg-white rounded-3xl border-2 border-gray-100 p-5 flex-1 flex flex-col">
                      <h4 className="font-bold text-gray-900 mb-2">건의사항 보내기</h4>
                      <p className="text-xs text-gray-500 mb-4">서비스 개선을 위한 의견을 보내주세요!</p>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="불편한 점, 개선 아이디어 등을 자유롭게 작성해주세요..."
                        className="flex-1 w-full p-3 bg-gray-50 rounded-2xl border-0 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-ajou-primary/20"
                      />
                      <button
                        onClick={handleSubmitFeedback}
                        disabled={!feedbackText.trim()}
                        className={`mt-4 w-full py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all
                          ${feedbackText.trim() ? 'bg-ajou-primary text-white hover:bg-ajou-dark' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        <SendIcon />
                        보내기
                      </button>
                    </div>
                    {submitSuccess && (
                      <div className="mt-3 bg-green-100 text-green-700 text-sm font-medium py-3 px-4 rounded-2xl text-center animate-fade-in">
                        ✅ 소중한 의견 감사합니다!
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'recommend' && (
                  <div className="flex-1 flex flex-col">
                    <div className="bg-gradient-to-br from-ajou-accent-light to-white rounded-3xl border-2 border-ajou-accent/20 p-5 flex-1 flex flex-col">
                      <h4 className="font-bold text-ajou-accent mb-2">✨ 메뉴 추천하기</h4>
                      <p className="text-xs text-gray-500 mb-4">카페에 있었으면 하는 메뉴를 추천해주세요!</p>
                      <textarea
                        value={recommendText}
                        onChange={(e) => setRecommendText(e.target.value)}
                        placeholder="예) 딸기 라떼, 말차 크로와상..."
                        className="flex-1 w-full p-3 bg-white rounded-2xl border-0 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-ajou-accent/20"
                      />
                      <button
                        onClick={handleSubmitRecommend}
                        disabled={!recommendText.trim()}
                        className={`mt-4 w-full py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all
                          ${recommendText.trim() ? 'bg-ajou-accent text-white hover:opacity-90' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        <SendIcon />
                        추천하기
                      </button>
                    </div>
                    <div className="mt-4 bg-white rounded-2xl p-4 border border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-2">🔥 최근 추천된 메뉴</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-ajou-light text-ajou-primary text-xs rounded-full">말차 라떼</span>
                        <span className="px-3 py-1 bg-ajou-accent-light text-ajou-accent text-xs rounded-full">흑당 버블티</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">에그 타르트</span>
                      </div>
                    </div>
                    {submitSuccess && (
                      <div className="mt-3 bg-green-100 text-green-700 text-sm font-medium py-3 px-4 rounded-2xl text-center animate-fade-in">
                        ✅ 추천해주셔서 감사합니다!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* 모바일 플로팅 버튼 */}
      <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3">
        <button 
          onClick={() => navigate('/admin')}
          className="w-12 h-12 bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center text-lg"
        >
          ⚙️
        </button>
        <button className="w-14 h-14 bg-ajou-primary text-white rounded-full shadow-lg flex items-center justify-center text-xl">
          📢
        </button>
      </div>
    </div>
  );
};

export default HomePage;