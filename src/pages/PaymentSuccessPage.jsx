import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // URL 파라미터에서 결제 정보 가져오기
        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');

        console.log('결제 성공:', { paymentKey, orderId, amount });

        // localStorage에서 주문 정보 가져오기
        const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
        
        if (!pendingOrder) {
          throw new Error('주문 정보를 찾을 수 없습니다.');
        }

        // Supabase에 주문 저장
        const { data, error } = await supabase
          .from('orders')
          .insert({
            user_id: user?.id || null,
            cafe_id: pendingOrder.cafeId,
            cafe_name: pendingOrder.cafeName,
            items: pendingOrder.items,
            total_price: pendingOrder.totalPrice,
            status: 'pending',
            note: pendingOrder.note,
            payment_method: 'toss',
            order_number: pendingOrder.orderNumber,
          })
          .select()
          .single();

        if (error) throw error;

        // 장바구니 비우기
        clearCart();
        localStorage.removeItem('pendingOrder');

        // 주문 완료 페이지로 이동
        navigate('/order/complete', {
          replace: true,
          state: {
            orderId: data.id,
            orderNumber: pendingOrder.orderNumber,
            waitingNumber: pendingOrder.waitingNumber,
            cafeName: pendingOrder.cafeName,
            items: pendingOrder.items,
            totalPrice: pendingOrder.totalPrice,
            estimatedTime: pendingOrder.estimatedTime,
            paymentKey, // 토스 결제 키 저장
          }
        });

      } catch (error) {
        console.error('결제 처리 실패:', error);
        alert('결제 처리 중 오류가 발생했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ajou-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">결제 처리 중...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccessPage;