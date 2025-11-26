import React from 'react';

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

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6" />
    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
  </svg>
);

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove,
  optionLabels = {}, // 옵션 ID -> 이름 매핑
}) => {
  const { id, name, price, imageUrl, quantity, options = {} } = item;
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };
  
  // 선택된 옵션 표시 텍스트 생성
  const getOptionsText = () => {
    const optionTexts = [];
    Object.entries(options).forEach(([groupId, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => {
          if (optionLabels[v]) optionTexts.push(optionLabels[v]);
        });
      } else {
        if (optionLabels[value]) optionTexts.push(optionLabels[value]);
      }
    });
    return optionTexts.join(', ');
  };
  
  const optionsText = getOptionsText();
  const itemTotal = price * quantity;
  
  return (
    <div className="card">
      <div className="flex gap-4">
        {/* 이미지 */}
        <div className="w-20 h-20 flex-shrink-0">
          <img
            src={imageUrl || '/images/default-menu.png'}
            alt={name}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              e.target.src = '/images/default-menu.png';
            }}
          />
        </div>
        
        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
              {optionsText && (
                <p className="text-sm text-gray-500 mt-0.5">{optionsText}</p>
              )}
            </div>
            
            {/* 삭제 버튼 */}
            <button
              onClick={() => onRemove(id, options)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 
                         rounded-lg transition-colors flex-shrink-0"
              aria-label="삭제"
            >
              <TrashIcon />
            </button>
          </div>
          
          {/* 가격 및 수량 */}
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-ajou-primary">
              {formatPrice(itemTotal)}원
            </span>
            
            {/* 수량 조절 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(id, options, quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                           hover:bg-gray-200 transition-colors"
                aria-label="수량 감소"
              >
                <MinusIcon />
              </button>
              <span className="w-6 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => onUpdateQuantity(id, options, quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                           hover:bg-gray-200 transition-colors"
                aria-label="수량 증가"
              >
                <PlusIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
