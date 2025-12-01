import React from 'react';

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MenuCard = ({ 
  menu, 
  onClick, 
  onQuickAdd,
  showQuickAdd = true,
}) => {
  const { id, name, price, description, imageUrl, isSoldOut, isPopular, isNew } = menu;
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };
  
  return (
    <div 
      className={`card flex gap-4 cursor-pointer group ${isSoldOut ? 'opacity-60' : ''}`}
      onClick={() => !isSoldOut && onClick(menu)}
    >
      {/* 이미지 */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <div className="w-full h-full bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl || '/images/default-menu.png'}
            alt={name}
            className="max-w-[70%] max-h-[70%] object-contain"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/images/default-menu.png';
            }}
          />
      </div>

        {/* 품절 오버레이 */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-gray-900/60 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">품절</span>
          </div>
        )}
        
        {/* 뱃지들 */}
        <div className="absolute top-1 left-1 flex flex-col gap-1">
          {isPopular && (
            <span className="badge-accent text-[10px] px-1.5 py-0.5">인기</span>
          )}
          {isNew && (
            <span className="badge-primary text-[10px] px-1.5 py-0.5">NEW</span>
          )}
        </div>
      </div>
      
      {/* 정보 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-ajou-primary transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
              {description}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-ajou-primary">
            {formatPrice(price)}원
          </span>
          
          {/* 빠른 담기 버튼 */}
          {showQuickAdd && !isSoldOut && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(menu);
              }}
              className="w-8 h-8 bg-ajou-primary text-white rounded-full flex items-center justify-center
                         hover:bg-ajou-dark transition-all duration-200 active:scale-90
                         opacity-0 group-hover:opacity-100"
              aria-label="장바구니에 담기"
            >
              <PlusIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
