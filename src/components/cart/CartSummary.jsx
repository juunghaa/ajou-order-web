import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const CartSummary = ({ 
  totalItems, 
  totalPrice, 
  cafeName,
  onOrder,
  disabled = false,
}) => {
  const navigate = useNavigate();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };
  
  const handleOrder = () => {
    if (onOrder) {
      onOrder();
    } else {
      navigate('/order');
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-modal z-50">
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* 카페 정보 */}
        {cafeName && (
          <p className="text-sm text-gray-500 mb-2">
            {cafeName}에서 주문
          </p>
        )}
        
        {/* 요약 정보 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-gray-600">총 {totalItems}개</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(totalPrice)}원
            </span>
          </div>
        </div>
        
        {/* 주문하기 버튼 */}
        <Button
          size="full"
          onClick={handleOrder}
          disabled={disabled || totalItems === 0}
        >
          {totalItems === 0 ? '장바구니가 비어있습니다' : '주문하기'}
        </Button>
      </div>
    </div>
  );
};

// 플로팅 장바구니 버튼 (메뉴 페이지용)
export const FloatingCartButton = ({ totalItems, totalPrice, onClick }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };
  
  if (totalItems === 0) return null;
  
  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 max-w-lg mx-auto">
      <button
        onClick={onClick}
        className="w-full bg-ajou-primary text-white rounded-2xl p-4 shadow-modal
                   flex items-center justify-between
                   hover:bg-ajou-dark transition-all duration-200 active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
            {totalItems}
          </span>
          <span className="font-semibold">장바구니 보기</span>
        </div>
        <span className="font-bold">{formatPrice(totalPrice)}원</span>
      </button>
    </div>
  );
};

export default CartSummary;
