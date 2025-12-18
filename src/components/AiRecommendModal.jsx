import React, { useState } from 'react';
import { getMenusByCafeId } from '../data/menuData';  // ✅ 추가

const AiRecommendModal = ({ isOpen, onClose, cafeId }) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      // ✅ 프론트에서 메뉴 데이터 가져오기
      const cafeData = getMenusByCafeId(cafeId);
      const menuList = cafeData.menus.map(m => 
        `${m.name} (${m.price}원, ${m.category})`
      );
      
      const res = await fetch('https://ajou-order-server.onrender.com/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          cafeId,
          cafeName: cafeData.cafeName,
          menus: menuList  // ✅ 메뉴 목록 전달
        }),
      });
      
      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      setResponse('추천을 가져오는데 실패했어요 😢');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          🤖 AI 메뉴 추천
        </h3>
        
        {/* AI 응답 */}
        {response && (
          <div className="mb-4 p-4 bg-purple-50 rounded-2xl">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{response}</p>
          </div>
        )}
        
        {/* 입력 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="예: 달달한 거 추천해줘!"
            className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !message.trim()}
            className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium disabled:opacity-50"
          >
            {loading ? '...' : '🔮'}
          </button>
        </div>
        
        {/* 예시 질문 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['달달한 거', '시원한 음료', '카페인 없는 거', '인기 메뉴'].map((q) => (
            <button
              key={q}
              onClick={() => setMessage(q + ' 추천해줘!')}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200"
            >
              {q}
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default AiRecommendModal;