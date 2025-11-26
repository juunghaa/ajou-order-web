import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
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

const CartPage = () => {
  const navigate = useNavigate();
  const { items, cafe, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  
  // 빈 장바구니
  if (items.length === 0) {
    return (
      <div className="page-container">
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
    <div className="page-container pb-40">
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
            aria-label="장바구니 비우기"
          >
            <TrashIcon />
          </button>
        }
      />
      
      {/* 카페 정보 */}
      {cafe && (
        <div className="px-4 py-3 bg-ajou-light border-b border-ajou-primary/10">
          <p className="text-sm font-medium text-ajou-primary">
            📍 {cafe.name}
          </p>
        </div>
      )}
      
      {/* 장바구니 아이템 목록 */}
      <div className="px-4 py-4 space-y-3">
        {items.map((item, index) => (
          <div 
            key={`${item.id}-${JSON.stringify(item.options)}`}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CartItem
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          </div>
        ))}
      </div>
      
      {/* 주문 정보 요약 */}
      <div className="px-4 py-4 bg-gray-50 border-t border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3">주문 정보</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">상품 금액</span>
            <span className="text-gray-900">
              {new Intl.NumberFormat('ko-KR').format(totalPrice)}원
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">할인 금액</span>
            <span className="text-ajou-accent">-0원</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">총 결제 금액</span>
              <span className="font-bold text-xl text-ajou-primary">
                {new Intl.NumberFormat('ko-KR').format(totalPrice)}원
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 하단 주문 버튼 */}
      <CartSummary
        totalItems={totalItems}
        totalPrice={totalPrice}
        cafeName={cafe?.name}
      />
    </div>
  );
};

export default CartPage;
