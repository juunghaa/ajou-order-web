import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { useCart } from '../context/CartContext';

const CreditCardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
    <circle cx="18" cy="12" r="2" />
  </svg>
);

const PAYMENT_METHODS = [
  { id: 'card', name: '신용/체크카드', icon: CreditCardIcon },
  { id: 'kakao', name: '카카오페이', icon: WalletIcon },
  { id: 'phone', name: '휴대폰 결제', icon: PhoneIcon },
];

const OrderPage = () => {
  const navigate = useNavigate();
  const { items, cafe, totalPrice, clearCart } = useCart();
  
  const [selectedPayment, setSelectedPayment] = useState('kakao');
  const [loading, setLoading] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  
  // 장바구니가 비어있으면 홈으로
  if (items.length === 0) {
    navigate('/');
    return null;
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };
  
  // 주문 처리
  const handleOrder = async () => {
    setLoading(true);
    
    try {
      // 실제로는 Firebase에 주문 저장
      // const orderId = await createOrder({ items, cafe, totalPrice, payment: selectedPayment, note: orderNote });
      
      // 결제 시뮬레이션 (2초 대기)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 주문 데이터 생성
      const orderData = {
        orderId: `AO${Date.now()}`,
        items,
        cafe,
        totalPrice,
        payment: selectedPayment,
        note: orderNote,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        estimatedTime: '10-15분',
      };
      
      // 로컬 스토리지에 최근 주문 저장
      localStorage.setItem('ajouorder_last_order', JSON.stringify(orderData));
      
      // 장바구니 비우기
      clearCart();
      
      // 주문 완료 페이지로 이동
      navigate('/order/complete');
    } catch (error) {
      console.error('주문 실패:', error);
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="page-container pb-32">
      <Header title="주문하기" />
      
      {/* 주문 매장 */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-500 mb-2">주문 매장</h2>
        <p className="font-semibold text-gray-900">{cafe?.name}</p>
      </div>
      
      {/* 주문 메뉴 요약 */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-500 mb-3">주문 메뉴</h2>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.name} x {item.quantity}
              </span>
              <span className="text-gray-900 font-medium">
                {formatPrice(item.price * item.quantity)}원
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
          <span className="font-semibold text-gray-900">합계</span>
          <span className="font-bold text-ajou-primary">{formatPrice(totalPrice)}원</span>
        </div>
      </div>
      
      {/* 요청사항 */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-500 mb-3">요청사항</h2>
        <textarea
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          placeholder="예: 얼음 적게 해주세요"
          className="input-field resize-none h-20"
          maxLength={100}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          {orderNote.length}/100
        </p>
      </div>
      
      {/* 결제 수단 */}
      <div className="px-4 py-4 bg-white">
        <h2 className="text-sm font-medium text-gray-500 mb-3">결제 수단</h2>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon;
            return (
              <label
                key={method.id}
                className={`
                  flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${selectedPayment === method.id 
                    ? 'border-ajou-primary bg-ajou-light' 
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-5 h-5 text-ajou-primary focus:ring-ajou-primary"
                />
                <Icon />
                <span className="font-medium text-gray-900">{method.name}</span>
              </label>
            );
          })}
        </div>
      </div>
      
      {/* 결제 안내 */}
      <div className="px-4 py-4 bg-gray-50">
        <p className="text-xs text-gray-500 leading-relaxed">
          • 주문 후 취소는 매장에 직접 문의해주세요.<br />
          • 결제 완료 후 예상 대기 시간이 안내됩니다.<br />
          • 본 서비스는 결제 시뮬레이션입니다.
        </p>
      </div>
      
      {/* 하단 결제 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-modal z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">총 결제 금액</span>
            <span className="text-2xl font-bold text-ajou-primary">
              {formatPrice(totalPrice)}원
            </span>
          </div>
          <Button
            size="full"
            onClick={handleOrder}
            loading={loading}
          >
            {loading ? '결제 처리 중...' : `${formatPrice(totalPrice)}원 결제하기`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
