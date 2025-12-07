import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// 토스 테스트 클라이언트 키
const TOSS_CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

const CreditCardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const TossIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#0064FF"/>
    <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
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
  { id: 'toss', name: '토스페이', icon: TossIcon },
  { id: 'kakao', name: '카카오페이', icon: WalletIcon },
];

const OrderPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const { items, cafe, totalPrice, clearCart } = useCart();
  
  const [selectedPayment, setSelectedPayment] = useState('toss');
  const [loading, setLoading] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [tossPayments, setTossPayments] = useState(null);
  
  const formatPrice = (price) => new Intl.NumberFormat('ko-KR').format(price);
  
  // 토스 SDK 초기화
  useEffect(() => {
    loadTossPayments(TOSS_CLIENT_KEY).then(tp => {
      setTossPayments(tp);
    });
  }, []);
  
  // 장바구니가 비어있으면 홈으로
  if (items.length === 0) {
    navigate('/');
    return null;
  }
  
  const handleOrder = async () => {
    setLoading(true);
    
    try {
      // 1. 주문번호 생성
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 2. 해당 카페의 오늘 마지막 주문번호 조회
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: lastOrders } = await supabase
        .from('orders')
        .select('order_number')
        .eq('cafe_id', cafe?.id)
        .gte('created_at', today.toISOString())
        .order('order_number', { ascending: false })
        .limit(1);
      
      const lastOrder = lastOrders?.[0] || null;
      const nextOrderNumber = lastOrder ? lastOrder.order_number + 1 : 1;
      
      // 3. 대기중인 주문 수 조회
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('cafe_id', cafe?.id)
        .in('status', ['pending', 'preparing']);
      
      const waitingNumber = (pendingCount || 0) + 1;
      
      // 4. 주문 정보 임시 저장 (결제 전)
      const orderData = {
        orderId,
        orderNumber: nextOrderNumber,
        waitingNumber,
        cafeName: cafe?.name,
        cafeId: cafe?.id,
        items,
        totalPrice,
        note: orderNote,
        paymentMethod: selectedPayment,
        estimatedTime: `${Math.max(5, waitingNumber * 3)}-${Math.max(10, waitingNumber * 5)}분`,
      };
      
      // localStorage에 임시 저장 (결제 성공 후 사용)
      localStorage.setItem('pendingOrder', JSON.stringify(orderData));
      
      // 5. 토스 결제인 경우
      if (selectedPayment === 'toss' && tossPayments) {
        await tossPayments.requestPayment('카드', {
          amount: totalPrice,
          orderId: orderId,
          orderName: items.length > 1 
            ? `${items[0].name} 외 ${items.length - 1}건` 
            : items[0].name,
          customerName: user?.user_metadata?.display_name || '고객',
          successUrl: `${window.location.origin}/payment/success`,
          failUrl: `${window.location.origin}/payment/fail`,
        });
        return; // 토스 결제 페이지로 리다이렉트
      }
      
      // 6. 다른 결제 수단 (시뮬레이션)
      await processOrderWithoutToss(orderData);
      
    } catch (error) {
      console.error('주문 실패:', error);
      
      // 토스 결제 취소인 경우
      if (error.code === 'USER_CANCEL') {
        alert('결제가 취소되었습니다.');
      } else {
        alert('주문 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 토스 외 결제 처리 (시뮬레이션)
  const processOrderWithoutToss = async (orderData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        cafe_id: orderData.cafeId,
        cafe_name: orderData.cafeName,
        items: orderData.items,
        total_price: orderData.totalPrice,
        status: 'pending',
        note: orderData.note,
        payment_method: orderData.paymentMethod,
        order_number: orderData.orderNumber,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    clearCart();
    localStorage.removeItem('pendingOrder');
    
    navigate('/order/complete', { 
      state: {
        orderId: data.id,
        orderNumber: orderData.orderNumber,
        waitingNumber: orderData.waitingNumber,
        cafeName: orderData.cafeName,
        items: orderData.items,
        totalPrice: orderData.totalPrice,
        estimatedTime: orderData.estimatedTime,
      }
    });
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
              
              {/* 토스 선택 시 안내 */}
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
              
              {/* 데스크탑 결제 버튼 */}
              <div className="hidden lg:block mt-6">
                <Button size="full" onClick={handleOrder} loading={loading}>
                  {loading ? '결제 처리 중...' : `${formatPrice(totalPrice)}원 결제하기`}
                </Button>
              </div>
              
              {/* 안내 */}
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