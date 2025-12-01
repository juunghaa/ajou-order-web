import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { useCart } from '../context/CartContext';

const EmptyCartIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6" />
    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
  </svg>
);

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CartPage = () => {
  const navigate = useNavigate();
  const { items, cafe, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  
  const formatPrice = (price) => new Intl.NumberFormat('ko-KR').format(price);
  
  // 빈 장바구니
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="장바구니" />
        
        <div className="flex flex-col items-center justify-center h-[60vh] px-4">
          <EmptyCartIcon />
          <h2 className="text-xl font-bold text-gray-900 mt-6">
            장바구니가 비어있어요
          </h2>
          <p className="text-gray-500 mt-2 text-center">
            맛있는 음료와 디저트를 담아보세요!
          </p>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => navigate('/')}
          >
            메뉴 보러가기
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-8">
      <Header 
        title="장바구니" 
        rightAction={
          <button
            onClick={() => {
              if (window.confirm('장바구니를 비우시겠습니까?')) {
                clearCart();
              }
            }}
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <TrashIcon />
          </button>
        }
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:flex lg:gap-8">
          {/* 장바구니 아이템 */}
          <div className="flex-1">
            {/* 카페 정보 */}
            {cafe && (
              <div className="bg-ajou-light rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-ajou-primary">📍 {cafe.name}</p>
              </div>
            )}
            
            {/* 아이템 목록 */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div 
                  key={`${item.id}-${JSON.stringify(item.options)}`}
                  className="bg-white rounded-2xl shadow-card p-4 animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex gap-4">
                    <img
                      src={item.imageUrl || '/images/default-menu.png'}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-contain"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id, item.options)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold text-ajou-primary text-lg">
                          {formatPrice(item.price * item.quantity)}원
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.options, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                          >
                            <MinusIcon />
                          </button>
                          <span className="w-6 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.options, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                          >
                            <PlusIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 주문 정보 (데스크탑 사이드바) */}
          <div className="lg:w-96 lg:flex-shrink-0 mt-6 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-card p-6 lg:sticky lg:top-24">
              <h3 className="font-bold text-lg text-gray-900 mb-4">주문 정보</h3>
              
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
              
              {/* 데스크탑 주문 버튼 */}
              <div className="hidden lg:block mt-6">
                <Button size="full" onClick={() => navigate('/order')}>
                  {formatPrice(totalPrice)}원 주문하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 모바일 하단 주문 버튼 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-modal z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">총 {totalItems}개</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice)}원</span>
          </div>
          <Button size="full" onClick={() => navigate('/order')}>
            주문하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
