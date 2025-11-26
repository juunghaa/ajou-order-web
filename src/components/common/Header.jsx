import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

// 아이콘 컴포넌트들
const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const Header = ({ 
  title, 
  showBack = true, 
  showCart = true,
  showHome = false,
  transparent = false,
  rightAction = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  
  const isCartPage = location.pathname === '/cart';
  
  return (
    <header 
      className={`header ${transparent ? 'bg-transparent border-none' : ''}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* 왼쪽: 뒤로가기 or 홈 */}
        <div className="w-10">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="뒤로가기"
            >
              <BackIcon />
            </button>
          )}
          {showHome && !showBack && (
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="홈으로"
            >
              <HomeIcon />
            </button>
          )}
        </div>
        
        {/* 중앙: 타이틀 */}
        <h1 className="text-lg font-bold text-gray-900 truncate max-w-[200px]">
          {title}
        </h1>
        
        {/* 오른쪽: 장바구니 or 커스텀 액션 */}
        <div className="w-10 flex justify-end">
          {rightAction ? (
            rightAction
          ) : showCart && !isCartPage ? (
            <button
              onClick={() => navigate('/cart')}
              className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors relative"
              aria-label="장바구니"
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-ajou-accent text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-soft">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
