import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,4 23,10 17,10" />
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
);

const CoffeeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8h1a4 4 0 010 8h-1" />
    <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const AdminPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [cafes, setCafes] = useState([]);  // ✅ 카페 목록
  const [loading, setLoading] = useState(true);
  const [selectedCafe, setSelectedCafe] = useState('all');
  const [activeFilter, setActiveFilter] = useState('waiting');
  const [activeTab, setActiveTab] = useState('orders');  // ✅ 'orders' | 'cafes'
  
  // ✅ 카페 목록 불러오기
  const loadCafes = async () => {
    const { data, error } = await supabase
      .from('cafes')
      .select('*')
      .order('id');
    
    if (!error && data) {
      setCafes(data);
    }
  };
  
  // Supabase에서 주문 불러오기
  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('주문 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 + 실시간 구독
  useEffect(() => {
    loadCafes();  // ✅ 카페 로드
    loadOrders();

    // 주문 실시간 구독
    const ordersChannel = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(order => 
              order.id === payload.new.id ? payload.new : order
            ));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(order => order.id !== payload.old.id));
          }
        }
      )
      .subscribe();
    
    // ✅ 카페 실시간 구독
    const cafesChannel = supabase
      .channel('cafes-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cafes' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setCafes(prev => prev.map(cafe => 
              cafe.id === payload.new.id ? payload.new : cafe
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(cafesChannel);
    };
  }, []);
  
  // ✅ 카페 영업 상태 변경
  const toggleCafeStatus = async (cafeId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('cafes')
        .update({ 
          is_open: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', cafeId);

      if (error) throw error;
      
      // 로컬 상태 업데이트
      setCafes(cafes.map(cafe => 
        cafe.id === cafeId ? { ...cafe, is_open: !currentStatus } : cafe
      ));
    } catch (error) {
      console.error('카페 상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };
  
  // 주문 상태 변경
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };
  
  // 카페별 필터링
  const cafeFilteredOrders = selectedCafe === 'all' 
    ? orders 
    : orders.filter(order => order.cafe_id === selectedCafe);
  
  // 상태별 필터링
  const filteredOrders = (() => {
    switch (activeFilter) {
      case 'waiting':
        return cafeFilteredOrders.filter(o => o.status === 'pending' || o.status === 'preparing');
      case 'completed':
        return cafeFilteredOrders.filter(o => o.status === 'completed');
      case 'cancelled':
        return cafeFilteredOrders.filter(o => o.status === 'cancelled');
      default:
        return cafeFilteredOrders;
    }
  })();
  
  const pendingCount = cafeFilteredOrders.filter(o => o.status === 'pending').length;
  
  const getElapsedTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    return `${Math.floor(minutes / 60)}시간 전`;
  };
  
  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '주문접수';
      case 'preparing': return '준비중';
      case 'completed': return '완료';
      case 'cancelled': return '취소됨';
      default: return status;
    }
  };

  const getOptionsText = (item) => {
    const options = [];
    if (item.selectedOptions) {
      if (item.selectedOptions.temperature) options.push(item.selectedOptions.temperature);
      if (item.selectedOptions.size) options.push(item.selectedOptions.size);
      if (item.selectedOptions.extras?.length > 0) options.push(...item.selectedOptions.extras);
    }
    if (item.options && typeof item.options === 'object') {
      if (item.options.temperature) options.push(item.options.temperature);
      if (item.options.size) options.push(item.options.size);
    }
    return options.length > 0 ? options.join(' / ') : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-ajou-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
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
                <p className="text-sm text-gray-500">주문 및 카페 관리</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => { loadOrders(); loadCafes(); }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="새로고침"
              >
                <RefreshIcon />
              </button>
              
              {pendingCount > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-amber-700">
                    신규 {pendingCount}건
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* ✅ 메인 탭 (주문관리 / 카페관리) */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 py-3">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'orders' 
                  ? 'bg-ajou-primary text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CoffeeIcon />
              주문 관리
            </button>
            <button
              onClick={() => setActiveTab('cafes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'cafes' 
                  ? 'bg-ajou-primary text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <SettingsIcon />
              카페 관리
            </button>
          </div>
        </div>
      </div>
      
      {/* ✅ 카페 관리 탭 */}
      {activeTab === 'cafes' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">카페 영업 상태 관리</h2>
            <p className="text-sm text-gray-500 mt-1">각 카페의 영업 상태를 변경할 수 있습니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cafes.map(cafe => (
              <div
                key={cafe.id}
                className={`bg-white rounded-3xl p-5 border-2 transition-all ${
                  cafe.is_open ? 'border-green-200' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={cafe.image_url}
                    alt={cafe.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{cafe.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        cafe.is_open 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {cafe.is_open ? '영업중' : '준비중'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{cafe.location}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      대기시간: {cafe.wait_time} · 평점: {cafe.rating}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => toggleCafeStatus(cafe.id, cafe.is_open)}
                    className={`flex-1 py-3 rounded-2xl font-medium text-sm transition-colors ${
                      cafe.is_open
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {cafe.is_open ? '영업 종료하기' : '영업 시작하기'}
                  </button>
                </div>
                
                {/* 오늘 주문 통계 */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
                  <div>
                    <p className="text-xs text-gray-500">오늘 주문</p>
                    <p className="text-lg font-bold text-gray-900">
                      {orders.filter(o => o.cafe_id === cafe.id).length}건
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">대기중</p>
                    <p className="text-lg font-bold text-amber-600">
                      {orders.filter(o => o.cafe_id === cafe.id && (o.status === 'pending' || o.status === 'preparing')).length}건
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">매출</p>
                    <p className="text-lg font-bold text-ajou-primary">
                      {orders.filter(o => o.cafe_id === cafe.id && o.status === 'completed').reduce((sum, o) => sum + o.total_price, 0).toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
      
      {/* 주문 관리 탭 */}
      {activeTab === 'orders' && (
        <>
          {/* 카페 선택 탭 */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex gap-2 py-3 overflow-x-auto">
                <button
                  onClick={() => setSelectedCafe('all')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCafe === 'all' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  전체 카페
                </button>
                {cafes.map(cafe => (
                  <button
                    key={cafe.id}
                    onClick={() => setSelectedCafe(cafe.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCafe === cafe.id 
                        ? 'bg-ajou-primary text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cafe.is_open ? 'bg-green-400' : 'bg-gray-400'}`} />
                    {cafe.name}
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                      selectedCafe === cafe.id ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      {orders.filter(o => o.cafe_id === cafe.id && (o.status === 'pending' || o.status === 'preparing')).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* 상태 필터 탭 */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { key: 'all', label: '전체', count: cafeFilteredOrders.length },
                { key: 'waiting', label: '대기중', count: cafeFilteredOrders.filter(o => o.status === 'pending' || o.status === 'preparing').length },
                { key: 'completed', label: '완료', count: cafeFilteredOrders.filter(o => o.status === 'completed').length },
                { key: 'cancelled', label: '취소', count: cafeFilteredOrders.filter(o => o.status === 'cancelled').length },
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeFilter === filter.key 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
            
            {/* 주문 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredOrders.map((order) => {
                const waitingPosition = order.status === 'pending' 
                  ? cafeFilteredOrders.filter(o => o.status === 'pending').findIndex(o => o.id === order.id) + 1 
                  : null;
                
                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-3xl p-5 border-2 transition-all ${
                      order.status === 'pending' ? 'border-amber-200 shadow-lg' : ''
                    } ${order.status === 'preparing' ? 'border-blue-200 shadow-md' : ''} ${
                      order.status === 'completed' || order.status === 'cancelled' ? 'border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">#{order.order_number}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{order.cafe_name}</p>
                      </div>
                      
                      {waitingPosition && (
                        <div className="bg-amber-500 text-white px-3 py-1 rounded-full">
                          <span className="text-xs font-bold">#{waitingPosition}</span>
                        </div>
                      )}
                      
                      {order.status === 'preparing' && (
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full">
                          <span className="text-xs font-bold">준비중</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => {
                        const optionsText = getOptionsText(item);
                        return (
                          <div key={idx} className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">
                                  {item.name} <span className="text-ajou-primary">x{item.quantity}</span>
                                </p>
                                {optionsText && (
                                  <p className="text-xs text-gray-500 mt-1">📋 {optionsText}</p>
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-700 ml-2">
                                {(item.price * item.quantity).toLocaleString()}원
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {order.note && (
                      <div className="bg-amber-50 rounded-xl p-3 mb-4">
                        <p className="text-xs font-medium text-amber-800">💬 요청사항</p>
                        <p className="text-sm text-amber-700 mt-1">{order.note}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <ClockIcon />
                        <span>{getElapsedTime(order.created_at)}</span>
                      </div>
                      <span className="text-lg font-bold text-ajou-primary">
                        {order.total_price.toLocaleString()}원
                      </span>
                    </div>
                    
                    {order.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-medium text-sm transition-colors"
                        >
                          준비 시작
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="py-3 px-4 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl text-sm transition-colors"
                        >
                          <XIcon />
                        </button>
                      </div>
                    )}
                    
                    {order.status === 'preparing' && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <CheckIcon />
                          준비 완료
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'pending')}
                          className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl text-sm transition-colors"
                        >
                          ↩️
                        </button>
                      </div>
                    )}
                    
                    {(order.status === 'completed' || order.status === 'cancelled') && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'pending')}
                        className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition-colors"
                      >
                        다시 대기중으로
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">📭</p>
                <p className="text-gray-500">해당하는 주문이 없습니다</p>
              </div>
            )}
          </main>
        </>
      )}
      
      {/* 하단 통계 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-gray-500">오늘 총 주문</p>
              <p className="text-xl font-bold text-gray-900">{orders.length}건</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">총 매출</p>
              <p className="text-xl font-bold text-ajou-primary">
                {orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total_price, 0).toLocaleString()}원
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium">
              영업중 {cafes.filter(c => c.is_open).length}개
            </div>
            <div className="px-3 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-medium">
              신규 {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium">
              준비 {orders.filter(o => o.status === 'preparing').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;