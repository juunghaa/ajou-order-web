import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';  // ✅ 추가

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import ServicePausedPage from './pages/ServicePausedPage';
import LoginPage from './pages/LoginPage';      // ✅ 추가
import SignupPage from './pages/SignupPage';    // ✅ 추가
import OrderHistoryPage from './pages/OrderHistoryPage';  // ✅ 추가
import ProfilePage from './pages/ProfilePage';            // ✅ 추가
import PaymentFailPage from './pages/PaymentFailPage';
import OrderPage from './pages/OrderPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

const testCheckoutEnabled = process.env.REACT_APP_ENABLE_TEST_CHECKOUT === 'true';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/cafe/:cafeId/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order" element={testCheckoutEnabled ? <OrderPage /> : <ServicePausedPage title="주문 기능 점검 중" message="주문과 결제 기능을 점검하고 있습니다. 현재는 카페와 메뉴를 둘러볼 수 있습니다." />} />
              <Route path="/order/complete" element={<ServicePausedPage title="주문 내역을 확인해 주세요" message="이 화면에서는 주문 완료 여부를 확인할 수 없습니다. 로그인 후 주문 내역을 확인해 주세요." />} />
              <Route path="/admin" element={<ServicePausedPage title="관리자 기능 점검 중" message="관리자 기능을 점검하고 있습니다." />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/payment/success" element={testCheckoutEnabled ? <PaymentSuccessPage /> : <ServicePausedPage title="결제 결과 확인 필요" message="이 화면에서는 결제 또는 주문 완료 여부를 확인할 수 없습니다. 토스페이먼츠 결제 내역을 확인해 주세요." />} />
              <Route path="/payment/fail" element={<PaymentFailPage />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
