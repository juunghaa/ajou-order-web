import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const CheckIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const OrderCompletePage = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  
  useEffect(() => {
    // 로컬 스토리지에서 최근 주문 가져오기
    const lastOrder = localStorage.getItem('ajouorder_last_order');
    if (lastOrder) {
      setOrderData(JSON.parse(lastOrder));
    }
  }, []);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (!orderData) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">주문 정보를 찾을 수 없습니다</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate('/')}
          >
            홈으로 가기
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container bg-gray-50">
      {/* 성공 헤더 */}
      <div className="bg-ajou-primary px-4 pt-12 pb-16 text-center text-white">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 animate-bounce-soft">
          <CheckIcon />
        </div>
        <h1 className="text-2xl font-bold mb-2">주문이 완료되었습니다!</h1>
        <p className="text-white/80">결제가 정상적으로 처리되었습니다</p>
      </div>
      
      {/* 주문 정보 카드 */}
      <div className="px-4 -mt-8">
        <div className="card">
          {/* 예상 대기 시간 */}
          <div className="flex items-center gap-3 p-4 bg-ajou-light rounded-xl mb-4">
            <ClockIcon className="text-ajou-primary" />
            <div>
              <p className="text-sm text-gray-600">예상 대기 시간</p>
              <p className="text-xl font-bold text-ajou-primary">
                {orderData.estimatedTime}
              </p>
            </div>
          </div>
          
          {/* 주문 상세 */}
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">주문번호</span>
              <span className="font-mono font-bold text-gray-900">{orderData.orderId}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">주문매장</span>
              <span className="font-medium text-gray-900">{orderData.cafe?.name}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">주문일시</span>
              <span className="text-gray-900">{formatDate(orderData.createdAt)}</span>
            </div>
            
            <div className="py-2 border-b border-gray-100">
              <span className="text-gray-500 block mb-2">주문메뉴</span>
              <div className="space-y-1">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-gray-900">
                      {formatPrice(item.price * item.quantity)}원
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {orderData.note && (
              <div className="py-2 border-b border-gray-100">
                <span className="text-gray-500 block mb-1">요청사항</span>
                <span className="text-gray-900">{orderData.note}</span>
              </div>
            )}
            
            <div className="flex justify-between py-2">
              <span className="font-semibold text-gray-900">결제금액</span>
              <span className="text-xl font-bold text-ajou-primary">
                {formatPrice(orderData.totalPrice)}원
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 안내 메시지 */}
      <div className="px-4 py-6">
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-orange-800">
            <span className="font-semibold">📢 픽업 안내</span><br />
            음료가 준비되면 알림을 보내드립니다.<br />
            매장에서 주문번호를 말씀해주세요.
          </p>
        </div>
      </div>
      
      {/* 하단 버튼 */}
      <div className="px-4 pb-8 space-y-3">
        <Button
          size="full"
          onClick={() => navigate('/')}
        >
          홈으로 가기
        </Button>
        <Button
          size="full"
          variant="secondary"
          onClick={() => navigate(`/cafe/${orderData.cafe?.id}/menu`)}
        >
          추가 주문하기
        </Button>
      </div>
    </div>
  );
};

export default OrderCompletePage;
