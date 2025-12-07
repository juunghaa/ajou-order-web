import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
);

const PackageIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  // ✅ Supabase에서 주문 내역 가져오기
  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('주문 내역 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">완료</span>;
      case 'preparing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">준비중</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">대기중</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">취소</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">확인중</span>;
    }
  };

  // 비로그인 상태
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center h-14">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
                <ArrowLeftIcon />
              </button>
              <h1 className="flex-1 text-center font-bold text-gray-900 pr-8">주문 내역</h1>
            </div>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-gray-300 mb-4">
              <PackageIcon />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">로그인이 필요해요</h3>
            <p className="text-gray-500 text-sm mb-6">주문 내역을 확인하려면 로그인해주세요</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-ajou-primary text-white font-medium rounded-xl hover:bg-ajou-dark transition-colors"
            >
              로그인하기
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center h-14">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon />
            </button>
            <h1 className="flex-1 text-center font-bold text-gray-900 pr-8">주문 내역</h1>
          </div>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-ajou-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-gray-300 mb-4">
              <PackageIcon />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">주문 내역이 없어요</h3>
            <p className="text-gray-500 text-sm mb-6">첫 주문을 해보세요!</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-ajou-primary text-white font-medium rounded-xl hover:bg-ajou-dark transition-colors"
            >
              카페 둘러보기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                {/* 상단: 날짜 + 상태 */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                  {getStatusBadge(order.status)}
                </div>

                {/* 카페명 */}
                <h3 className="font-bold text-gray-900 mb-2">{order.cafe_name}</h3>

                {/* 주문 아이템 */}
                <div className="space-y-1 mb-3">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      {item.name} x {item.quantity}
                    </p>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-400">외 {order.items.length - 2}개</p>
                  )}
                </div>

                {/* 하단: 금액 */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="font-bold text-ajou-primary">
                    {formatPrice(order.total_price)}원
                  </span>
                  <span className="text-xs text-gray-400">
                    주문번호 #{order.order_number}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistoryPage;