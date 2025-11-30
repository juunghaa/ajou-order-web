import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CheckCircleIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="9,12 12,15 16,10" />
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const OrderCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 주문 정보 (실제로는 props나 context에서 받아옴)
  const orderInfo = location.state || {
    orderId: 'ORD-003',
    orderNumber: 3,
    waitingNumber: 2, // 앞에 대기 중인 주문 수
    cafeName: '학생회관 카페',
    items: [
      { name: '아메리카노', quantity: 2 },
      { name: '카페라떼', quantity: 1 },
    ],
    totalPrice: 13000,
    estimatedTime: '10-15분',
  };
  
  const [countdown, setCountdown] = useState(5);
  
  // 자동 이동 카운트다운 (옵션)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ajou-primary to-ajou-secondary flex flex-col">
      {/* 메인 컨텐츠 */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* 성공 카드 */}
          <div className="bg-white rounded-4xl p-8 text-center shadow-2xl">
            {/* 체크 아이콘 */}
            <div className="inline-flex items-center justify-center text-green-500 mb-6 animate-bounce-soft">
              <CheckCircleIcon />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              주문이 완료되었습니다!
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {orderInfo.cafeName}
            </p>
            
            {/* 대기 순번 - 핵심 정보 */}
            <div className="bg-ajou-light rounded-3xl p-6 mb-6">
              <p className="text-sm text-ajou-primary font-medium mb-2">내 대기 순번</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-6xl font-bold text-ajou-primary">
                  {orderInfo.waitingNumber}
                </span>
                <span className="text-2xl text-ajou-primary/70">번째</span>
              </div>
              {orderInfo.waitingNumber > 0 && (
                <p className="text-sm text-gray-500 mt-3">
                  앞에 <b className="text-ajou-primary">{orderInfo.waitingNumber - 1}명</b>이 대기중이에요
                </p>
              )}
            </div>
            
            {/* 주문 요약 */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">주문번호</span>
                <span className="font-bold text-gray-900">#{orderInfo.orderNumber}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3 space-y-2">
                {orderInfo.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-500">x {item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 mt-3 pt-3 flex items-center justify-between">
                <span className="font-medium text-gray-700">결제 금액</span>
                <span className="font-bold text-ajou-primary text-lg">
                  {orderInfo.totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
            
            {/* 예상 시간 */}
            <div className="flex items-center justify-center gap-2 mb-6 text-ajou-accent">
              <span className="text-lg">⏱️</span>
              <span className="font-medium">예상 대기시간: {orderInfo.estimatedTime}</span>
            </div>
            
            {/* 안내 메시지 */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
              <p className="text-sm text-amber-800">
                📢 음료가 준비되면 <b>앱 알림</b>으로 알려드릴게요!
              </p>
            </div>
            
            {/* 버튼들 */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <HomeIcon />
                홈으로
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="flex-1 py-4 bg-ajou-primary hover:bg-ajou-dark text-white rounded-2xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <ListIcon />
                주문 내역
              </button>
            </div>
          </div>
          
          {/* 하단 로고 */}
          <p className="text-center text-white/50 text-sm mt-8">
            AjouOrder
          </p>
        </div>
      </main>
    </div>
  );
};

export default OrderCompletePage;