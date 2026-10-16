import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';  
import { fetchCafes, submitFeedback, submitRecommendation, fetchRecommendations } from '../api';

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

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

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
  const { user, logout } = useAuth();
  
  const [cafes, setCafes] = useState([]);
  const [cafesLoading, setCafesLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('notice');
  const [feedbackText, setFeedbackText] = useState('');
  const [recommendText, setRecommendText] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  
  const profileMenuRef = useRef(null);
  
  const [submitLoading, setSubmitLoading] = useState(false); 
  const [recentRecommendations, setRecentRecommendations] = useState([]);  
  
  // ✅ 최근 추천 메뉴 불러오기 (API로 변경)
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const data = await fetchRecommendations(5);
        setRecentRecommendations(data);
      } catch (error) {
        console.error('추천 메뉴 로딩 실패:', error);
      }
    };
    loadRecommendations();
  }, [submitSuccess]);
  
  // 프로필 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileMenu(false);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };
  
  // ✅ 건의사항 제출 (API로 변경)
  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return;
    
    setSubmitLoading(true);
    try {
      const result = await submitFeedback(user?.id || null, feedbackText.trim());
      
      if (result.success) {
        setFeedbackText('');
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('건의사항 제출 실패:', error);
      alert('제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // ✅ 메뉴 추천 제출 (API로 변경)
  const handleSubmitRecommend = async () => {
    if (!recommendText.trim()) return;
    
    setSubmitLoading(true);
    try {
      const result = await submitRecommendation(user?.id || null, recommendText.trim());
      
      if (result.success) {
        setRecommendText('');
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('메뉴 추천 실패:', error);
      alert('제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // 사용자 이름 가져오기
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.display_name || user.email?.split('@')[0] || '사용자';
  };
  
  // 사용자 이니셜 가져오기
  const getUserInitial = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  // 탭 컨텐츠 렌더링
  const renderTabContent = () => (
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
              className="flex-1 w-full p-3 bg-gray-50 rounded-2xl border-0 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-ajou-primary/20 min-h-[120px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{feedbackText.length}/500</p>
            <button
              onClick={handleSubmitFeedback}
              disabled={!feedbackText.trim() || submitLoading}
              className={`mt-3 w-full py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all
                ${feedbackText.trim() && !submitLoading 
                  ? 'bg-ajou-primary text-white hover:bg-ajou-dark' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {submitLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <SendIcon />
                  보내기
                </>
              )}
            </button>
          </div>
          {submitSuccess && activeTab === 'feedback' && (
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
              className="flex-1 w-full p-3 bg-white rounded-2xl border-0 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-ajou-accent/20 min-h-[120px]"
              maxLength={100}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{recommendText.length}/100</p>
            <button
              onClick={handleSubmitRecommend}
              disabled={!recommendText.trim() || submitLoading}
              className={`mt-3 w-full py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all
                ${recommendText.trim() && !submitLoading 
                  ? 'bg-ajou-accent text-white hover:opacity-90' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {submitLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <SendIcon />
                  추천하기
                </>
              )}
            </button>
          </div>
          
          {/* 최근 추천된 메뉴 */}
          <div className="mt-4 bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">🔥 최근 추천된 메뉴</p>
            <div className="flex flex-wrap gap-2">
              {recentRecommendations.length > 0 ? (
                recentRecommendations.map((rec, idx) => (
                  <span 
                    key={idx}
                    className={`px-3 py-1 text-xs rounded-full ${
                      idx === 0 ? 'bg-ajou-light text-ajou-primary' :
                      idx === 1 ? 'bg-ajou-accent-light text-ajou-accent' :
                      'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {rec.menu_name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">아직 추천된 메뉴가 없어요</span>
              )}
            </div>
          </div>
          
          {submitSuccess && activeTab === 'recommend' && (
            <div className="mt-3 bg-green-100 text-green-700 text-sm font-medium py-3 px-4 rounded-2xl text-center animate-fade-in">
              ✅ 추천해주셔서 감사합니다!
            </div>
          )}
        </div>
      )}
    </div>
  );
  
  // ✅ 카페 목록 불러오기 (API로 변경)
  useEffect(() => {
    const loadCafes = async () => {
      try {
        const data = await fetchCafes();
        setCafes(data);
      } catch (error) {
        console.error('카페 목록 로딩 실패:', error);
      }
      setCafesLoading(false);
    };
    
    loadCafes();
    
    // 실시간 구독은 Supabase 유지 (WebSocket)
    const channel = supabase
      .channel('cafes-home-channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'cafes' },
        (payload) => {
          setCafes(prev => prev.map(cafe => 
            cafe.id === payload.new.id 
              ? {
                  ...cafe,
                  isOpen: payload.new.is_open,
                  waitTime: payload.new.wait_time,
                }
              : cafe
          ));
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
              <span className="text-sm text-gray-500 hidden sm:block">아주대학교</span>
              
              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-ajou-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{getUserInitial()}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {getUserDisplayName()}
                    </span>
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{getUserDisplayName()}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <button
                          onClick={() => {
                            navigate('/orders');
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <HistoryIcon />
                          주문 내역
                        </button>
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <UserIcon />
                          프로필 설정
                        </button>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                        >
                          <LogoutIcon />
                          로그아웃
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2 bg-ajou-primary text-white text-sm font-medium rounded-xl hover:bg-ajou-dark transition-colors"
                >
                  <UserIcon />
                  <span className="hidden sm:block">로그인</span>
                </button>
              )}
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
                {cafes.map((cafe) => (
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
                  <p className="text-2xl font-bold text-ajou-primary">{cafes.filter(c => c.isOpen).length}</p>
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
            
            {/* 오른쪽: 탭 패널 (데스크탑) */}
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
              
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
      
      {/* 모바일 플로팅 버튼 */}
      <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3">
        <button 
          onClick={() => setShowMobilePanel(true)}
          className="w-14 h-14 bg-ajou-primary text-white rounded-full shadow-lg flex items-center justify-center text-xl"
        >
          📢
        </button>
      </div>
      
      {/* 모바일 바텀시트 */}
      {showMobilePanel && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobilePanel(false)}
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            
            <div className="flex items-center justify-between px-6 pb-4">
              <h3 className="text-lg font-bold text-gray-900">소식 & 의견</h3>
              <button 
                onClick={() => setShowMobilePanel(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XIcon />
              </button>
            </div>
            
            <div className="flex bg-gray-100 rounded-2xl p-1 mx-6 mb-4">
              <button
                onClick={() => setActiveTab('notice')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-xl transition-all ${
                  activeTab === 'notice' ? 'bg-white text-ajou-primary shadow-sm' : 'text-gray-500'
                }`}
              >
                📢 공지
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-xl transition-all ${
                  activeTab === 'feedback' ? 'bg-white text-ajou-primary shadow-sm' : 'text-gray-500'
                }`}
              >
                💬 건의
              </button>
              <button
                onClick={() => setActiveTab('recommend')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-xl transition-all ${
                  activeTab === 'recommend' ? 'bg-white text-ajou-primary shadow-sm' : 'text-gray-500'
                }`}
              >
                ✨ 추천
              </button>
            </div>
            
            <div className="flex-1 overflow-auto px-6 pb-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
