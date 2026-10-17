import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { createOrderIntent } from '../api';

// 토스 테스트 클라이언트 키
const TOSS_CLIENT_KEY = process.env.REACT_APP_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

const TossIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#0064FF"/>
    <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PAYMENT_METHODS = [
  { id: 'toss', name: '카드 테스트 결제', icon: TossIcon },
];

const OrderPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const { items, cafe, totalPrice } = useCart();
  
  const [selectedPayment, setSelectedPayment] = useState('toss');
  const [loading, setLoading] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [tossPayments, setTossPayments] = useState(null);
  
  // ✅ 주문 처리 중 플래그 (ref 사용 - 리렌더링 안 함)
  const isProcessingRef = useRef(false);
  
  const formatPrice = (price) => new Intl.NumberFormat('ko-KR').format(price);
  
  // 토스 SDK 초기화
  useEffect(() => {
    loadTossPayments(TOSS_CLIENT_KEY).then(tp => {
      setTossPayments(tp);
    });
  }, []);
  
  // ✅ 장바구니가 비어있으면 홈으로 (처리 중이 아닐 때만!)
  useEffect(() => {
    if (items.length === 0 && !isProcessingRef.current) {
      navigate('/');
    }
  }, [items, navigate]);
  
  // 장바구니가 비어있으면 로딩 표시
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-ajou-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  const handleOrder = async () => {
    if (isProcessingRef.current) return;
    setLoading(true);
    isProcessingRef.current = true;

    try {
      if (!user || !cafe || !tossPayments) throw new Error('로그인과 결제 준비 상태를 확인해 주세요.');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('다시 로그인해 주세요.');

      const intent = await createOrderIntent({ cafe, items }, orderNote, session.access_token);
      if (intent.amount !== totalPrice) {
        throw new Error('장바구니와 서버 금액이 다릅니다. 메뉴를 다시 확인해 주세요.');
      }
      localStorage.setItem('pendingOrder', JSON.stringify({
        orderId: intent.orderId, amount: intent.amount,
        cafeName: cafe.name, items,
      }));

      await tossPayments.requestPayment('카드', {
        amount: intent.amount,
        orderId: intent.orderId,
        orderName: items.length > 1 ? `${items[0].name} 외 ${items.length - 1}건` : items[0].name,
        customerName: user.user_metadata?.display_name || '고객',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error('주문 실패:', error);
      localStorage.removeItem('pendingOrder');
      if (error.code === 'USER_CANCEL') {
        alert('결제가 취소되었습니다.');
      } else {
        alert(error.message || '주문 처리 중 오류가 발생했습니다.');
      }
    } finally {
      isProcessingRef.current = false;
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-8">
      <Header title="주문하기" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:flex lg:gap-8">
          {/* 주문 정보 입력 */}
          <div className="flex-1 space-y-6">
            {/* 주문 매장 */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-gray-900 mb-3">주문 매장</h2>
              <p className="text-lg font-semibold text-ajou-primary">{cafe?.name}</p>
            </div>
            
            {/* 주문 메뉴 */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-gray-900 mb-4">주문 메뉴</h2>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-contain"
                      />
                      <div>
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-400 ml-2">x {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-gray-900 font-medium">
                      {formatPrice(item.price * item.quantity)}원
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 요청사항 */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-gray-900 mb-3">요청사항</h2>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="예: 얼음 적게 해주세요"
                className="input-field resize-none h-24"
                maxLength={100}
              />
              <p className="text-xs text-gray-400 mt-2 text-right">{orderNote.length}/100</p>
            </div>
            
            {/* 결제 수단 */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-gray-900 mb-4">결제 수단</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${selectedPayment === method.id 
                          ? method.id === 'toss' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-ajou-primary bg-ajou-light'
                          : 'border-gray-200 hover:border-gray-300'}`}
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
              
              {selectedPayment === 'toss' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-700">
                    💳 토스페이로 안전하게 결제됩니다. (테스트 모드)
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* 결제 정보 (데스크탑 사이드바) */}
          <div className="lg:w-96 lg:flex-shrink-0 mt-6 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-card p-6 lg:sticky lg:top-24">
              <h3 className="font-bold text-lg text-gray-900 mb-4">결제 정보</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">상품 금액</span>
                  <span className="text-gray-900">{formatPrice(totalPrice)}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">할인 금액</span>
                  <span className="text-ajou-accent">-0원</span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">총 결제 금액</span>
                    <span className="font-bold text-2xl text-ajou-primary">
                      {formatPrice(totalPrice)}원
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block mt-6">
                <Button size="full" onClick={handleOrder} loading={loading}>
                  {loading ? '결제 처리 중...' : `${formatPrice(totalPrice)}원 결제하기`}
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 leading-relaxed">
                  • 주문 후 취소는 매장에 직접 문의해주세요.<br />
                  • 결제 완료 후 예상 대기 시간이 안내됩니다.<br />
                  • 테스트 모드에서는 실제 결제가 이루어지지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 모바일 하단 결제 버튼 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-modal z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">총 결제 금액</span>
            <span className="text-xl font-bold text-ajou-primary">{formatPrice(totalPrice)}원</span>
          </div>
          <Button size="full" onClick={handleOrder} loading={loading}>
            {loading ? '결제 처리 중...' : `${formatPrice(totalPrice)}원 결제하기`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
