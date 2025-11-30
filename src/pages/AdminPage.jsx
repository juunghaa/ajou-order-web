import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

// 더미 주문 데이터
const INITIAL_ORDERS = [
  {
    id: 'ORD-001',
    orderNumber: 1,
    customerName: '김아주',
    items: [
      { name: '아메리카노', options: 'ICE / Large', quantity: 2, price: 4500 },
      { name: '카페라떼', options: 'HOT / Regular', quantity: 1, price: 4000 },
    ],
    totalPrice: 13000,
    status: 'pending', // pending, completed, cancelled
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
    cafeId: 'ajou-cafe-4',
    cafeName: '학생회관 카페',
  },
  {
    id: 'ORD-002',
    orderNumber: 2,
    customerName: '이아주',
    items: [
      { name: '카푸치노', options: 'HOT / Regular', quantity: 1, price: 4500 },
    ],
    totalPrice: 4500,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 3), // 3분 전
    cafeId: 'ajou-cafe-4',
    cafeName: '학생회관 카페',
  },
  {
    id: 'ORD-003',
    orderNumber: 3,
    customerName: '박아주',
    items: [
      { name: '바닐라 라떼', options: 'ICE / Large / 샷 추가', quantity: 1, price: 5500 },
      { name: '초코 케이크', options: '', quantity: 1, price: 5000 },
    ],
    totalPrice: 10500,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 1), // 1분 전
    cafeId: 'ajou-cafe-4',
    cafeName: '학생회관 카페',
  },
  {
    id: 'ORD-004',
    orderNumber: 4,
    customerName: '최아주',
    items: [
      { name: '아메리카노', options: 'HOT / Regular', quantity: 3, price: 4000 },
    ],
    totalPrice: 12000,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15분 전
    cafeId: 'ajou-cafe-4',
    cafeName: '학생회관 카페',
  },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeFilter, setActiveFilter] = useState('pending'); // 'all' | 'pending' | 'completed' | 'cancelled'
  
  // 주문 상태 변경
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };
  
  // 필터링된 주문
  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);
  
  // 대기 중인 주문 수
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  
  // 경과 시간 계산
  const getElapsedTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    return `${Math.floor(minutes / 60)}시간 전`;
  };
  
  // 상태별 스타일
  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'completed': return '완료';
      case 'cancelled': return '취소됨';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeftIcon />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">관리자 페이지</h1>
                <p className="text-sm text-gray-500">주문 관리</p>
              </div>
            </div>
            
            {/* 대기 중 주문 수 */}
            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-amber-700">
                대기 중 {pendingCount}건
              </span>
            </div>
          </div>
        </div>
      </header>
      
      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 필터 탭 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: '전체', count: orders.length },
            { key: 'pending', label: '대기중', count: orders.filter(o => o.status === 'pending').length },
            { key: 'completed', label: '완료', count: orders.filter(o => o.status === 'completed').length },
            { key: 'cancelled', label: '취소', count: orders.filter(o => o.status === 'cancelled').length },
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${activeFilter === filter.key 
                  ? 'bg-ajou-primary text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}
              `}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
        
        {/* 주문 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order) => {
            // 대기 순번 계산 (pending 상태인 주문들 중에서 몇 번째인지)
            const waitingPosition = order.status === 'pending' 
              ? orders.filter(o => o.status === 'pending').findIndex(o => o.id === order.id) + 1 
              : null;
            
            return (
              <div
                key={order.id}
                className={`
                  bg-white rounded-3xl p-5 border-2 transition-all
                  ${order.status === 'pending' ? 'border-amber-200 shadow-lg' : 'border-gray-100'}
                `}
              >
                {/* 주문 헤더 */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">#{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{order.customerName}</p>
                  </div>
                  
                  {/* 대기 순번 뱃지 */}
                  {waitingPosition && (
                    <div className="bg-ajou-primary text-white px-3 py-1 rounded-full">
                      <span className="text-xs font-medium">대기 {waitingPosition}번</span>
                    </div>
                  )}
                </div>
                
                {/* 주문 아이템 */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between bg-gray-50 rounded-xl p-3">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {item.name} x {item.quantity}
                        </p>
                        {item.options && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.options}</p>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* 주문 정보 */}
                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <ClockIcon />
                    <span>{getElapsedTime(order.createdAt)}</span>
                  </div>
                  <span className="text-lg font-bold text-ajou-primary">
                    {order.totalPrice.toLocaleString()}원
                  </span>
                </div>
                
                {/* 액션 버튼 */}
                {order.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckIcon />
                      주문 완료
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <XIcon />
                      주문 취소
                    </button>
                  </div>
                )}
                
                {/* 완료/취소된 주문 복원 버튼 */}
                {order.status !== 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'pending')}
                    className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition-colors"
                  >
                    대기중으로 변경
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        {/* 빈 상태 */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-500">해당하는 주문이 없습니다</p>
          </div>
        )}
      </main>
      
      {/* 통계 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-gray-500">오늘 총 주문</p>
              <p className="text-xl font-bold text-gray-900">{orders.length}건</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">총 매출</p>
              <p className="text-xl font-bold text-ajou-primary">
                {orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString()}원
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-medium">
              대기 {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium">
              완료 {orders.filter(o => o.status === 'completed').length}
            </div>
            <div className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
              취소 {orders.filter(o => o.status === 'cancelled').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;