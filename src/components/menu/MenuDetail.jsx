import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const MinusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MenuDetail = ({ 
  isOpen, 
  onClose, 
  menu, 
  onAddToCart,
  cafeId,
  cafeName,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  
  // 메뉴 변경 시 초기화
  useEffect(() => {
    if (menu) {
      setQuantity(1);
      setSelectedOptions({});
      setTotalPrice(menu.price);
    }
  }, [menu]);
  
  // 가격 계산
  useEffect(() => {
    if (!menu) return;
    
    let optionPrice = 0;
    Object.entries(selectedOptions).forEach(([optionGroupId, selectedValues]) => {
      const optionGroup = menu.options?.find(og => og.id === optionGroupId);
      if (!optionGroup) return;
      
      if (Array.isArray(selectedValues)) {
        selectedValues.forEach(val => {
          const option = optionGroup.items?.find(item => item.id === val);
          if (option?.price) optionPrice += option.price;
        });
      } else {
        const option = optionGroup.items?.find(item => item.id === selectedValues);
        if (option?.price) optionPrice += option.price;
      }
    });
    
    setTotalPrice((menu.price + optionPrice) * quantity);
  }, [menu, selectedOptions, quantity]);
  
  const handleOptionChange = (optionGroupId, value, isMultiple) => {
    setSelectedOptions(prev => {
      if (isMultiple) {
        const current = prev[optionGroupId] || [];
        const updated = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value];
        return { ...prev, [optionGroupId]: updated };
      }
      return { ...prev, [optionGroupId]: value };
    });
  };
  
  const handleAddToCart = () => {
    if (!menu) return;
    
    const cartItem = {
      id: menu.id,
      name: menu.name,
      price: menu.price,
      imageUrl: menu.imageUrl,
      options: selectedOptions,
      cafeId,
      cafeName,
    };
    
    // 수량만큼 반복해서 추가 (또는 수량 정보 포함)
    for (let i = 0; i < quantity; i++) {
      onAddToCart(cartItem);
    }
    
    onClose();
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };
  
  if (!menu) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* 메뉴 이미지 */}
        <div className="relative -mx-6 -mt-6">
          <img
            src={menu.imageUrl || '/images/default-menu.png'}
            alt={menu.name}
            className="w-full h-56 object-cover"
            onError={(e) => {
              e.target.src = '/images/default-menu.png';
            }}
          />
          {menu.isPopular && (
            <span className="absolute top-4 left-4 badge-accent">인기 메뉴</span>
          )}
        </div>
        
        {/* 메뉴 정보 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{menu.name}</h2>
          {menu.description && (
            <p className="text-gray-500 mt-2">{menu.description}</p>
          )}
          <p className="text-xl font-bold text-ajou-primary mt-3">
            {formatPrice(menu.price)}원
          </p>
        </div>
        
        {/* 옵션 선택 */}
        {menu.options && menu.options.length > 0 && (
          <div className="space-y-6">
            {menu.options.map((optionGroup) => (
              <div key={optionGroup.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {optionGroup.name}
                  </h3>
                  {optionGroup.required && (
                    <span className="text-xs text-ajou-accent font-medium">필수</span>
                  )}
                </div>
                
                <div className="space-y-2">
                  {optionGroup.items?.map((option) => (
                    <label
                      key={option.id}
                      className={`
                        flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer
                        transition-all duration-200
                        ${(optionGroup.multiple 
                          ? selectedOptions[optionGroup.id]?.includes(option.id)
                          : selectedOptions[optionGroup.id] === option.id)
                          ? 'border-ajou-primary bg-ajou-light'
                          : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type={optionGroup.multiple ? 'checkbox' : 'radio'}
                          name={optionGroup.id}
                          value={option.id}
                          checked={
                            optionGroup.multiple
                              ? selectedOptions[optionGroup.id]?.includes(option.id) || false
                              : selectedOptions[optionGroup.id] === option.id
                          }
                          onChange={() => handleOptionChange(
                            optionGroup.id,
                            option.id,
                            optionGroup.multiple
                          )}
                          className="w-5 h-5 text-ajou-primary focus:ring-ajou-primary"
                        />
                        <span className="text-gray-700">{option.name}</span>
                      </div>
                      {option.price > 0 && (
                        <span className="text-gray-500 text-sm">
                          +{formatPrice(option.price)}원
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 수량 선택 */}
        <div className="flex items-center justify-between py-4 border-t border-gray-100">
          <span className="font-semibold text-gray-900">수량</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center
                         hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <MinusIcon />
            </button>
            <span className="w-8 text-center font-bold text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center
                         hover:bg-gray-200 transition-colors"
            >
              <PlusIcon />
            </button>
          </div>
        </div>
        
        {/* 담기 버튼 */}
        <Button
          size="full"
          onClick={handleAddToCart}
          disabled={menu.isSoldOut}
        >
          {menu.isSoldOut ? '품절된 메뉴입니다' : `${formatPrice(totalPrice)}원 담기`}
        </Button>
      </div>
    </Modal>
  );
};

export default MenuDetail;
