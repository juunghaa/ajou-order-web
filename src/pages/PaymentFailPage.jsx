import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
        <div className="text-6xl mb-4">😢</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">결제에 실패했습니다</h1>
        <p className="text-gray-500 mb-6">
          {errorMessage || '결제 처리 중 오류가 발생했습니다.'}
        </p>
        
        {errorCode && (
          <p className="text-xs text-gray-400 mb-6">오류 코드: {errorCode}</p>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/cart')}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            장바구니로
          </button>
          <button
            onClick={() => navigate('/order')}
            className="flex-1 py-3 bg-ajou-primary hover:bg-ajou-dark text-white rounded-xl font-medium transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;