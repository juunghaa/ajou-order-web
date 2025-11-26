import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// 페이지 컴포넌트
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import OrderCompletePage from './pages/OrderCompletePage';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* 홈 페이지 */}
            <Route path="/" element={<HomePage />} />
            
            {/* 카페 메뉴 페이지 */}
            <Route path="/cafe/:cafeId/menu" element={<MenuPage />} />
            
            {/* 장바구니 */}
            <Route path="/cart" element={<CartPage />} />
            
            {/* 주문/결제 */}
            <Route path="/order" element={<OrderPage />} />
            
            {/* 주문 완료 */}
            <Route path="/order/complete" element={<OrderCompletePage />} />
            
            {/* 404 - 홈으로 리다이렉트 */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
