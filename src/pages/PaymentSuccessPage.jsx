import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { confirmTossOrder } from '../api';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const inFlight = useRef(false);
  const [message, setMessage] = useState('결제와 주문을 확인하는 중입니다.');
  const [retryable, setRetryable] = useState(false);

  const verifyPayment = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setRetryable(false);
    setMessage('결제와 주문을 확인하는 중입니다.');
    try {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = Number(searchParams.get('amount'));
      if (!paymentKey || !orderId || !Number.isSafeInteger(amount) || amount <= 0) {
        throw new Error('결제 결과 정보가 올바르지 않습니다.');
      }

      let pending;
      try { pending = JSON.parse(localStorage.getItem('pendingOrder') || 'null'); }
      catch (_error) { localStorage.removeItem('pendingOrder'); }
      if (pending && (pending.orderId !== orderId || pending.amount !== amount)) {
        throw new Error('브라우저에 저장된 주문 정보와 결제 결과가 다릅니다.');
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('결제 확인을 위해 다시 로그인해 주세요.');

      const confirmed = await confirmTossOrder({ paymentKey, orderId, amount }, session.access_token);
      localStorage.removeItem('pendingOrder');
      clearCart();
      // Only the server-confirmed order ID establishes completion.
      navigate('/orders', { replace: true, state: { confirmedOrderId: confirmed.orderId } });
    } catch (error) {
      setMessage(error.message || '결제 상태를 확인할 수 없습니다.');
      setRetryable(true);
    } finally {
      inFlight.current = false;
    }
  }, [searchParams, navigate, clearCart]);

  useEffect(() => { verifyPayment(); }, [verifyPayment]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-card p-6 text-center">
        <h1 className="text-xl font-bold mb-3">결제 확인</h1>
        <p className="text-gray-600 mb-5">{message}</p>
        {retryable && (
          <button type="button" onClick={verifyPayment}
            className="w-full py-3 rounded-xl bg-ajou-primary text-white font-medium">
            다시 확인하기
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
