// 백엔드 서버 주소
const API_BASE_URL = 'https://ajou-order-server.onrender.com/api';

// ✅ 카페 목록 조회
export const fetchCafes = async () => {
  const res = await fetch(`${API_BASE_URL}/cafes`);
  const result = await res.json();
  
  if (result.success) {
    return result.data.map(cafe => ({
      id: cafe.id,
      name: cafe.name,
      location: cafe.location,
      imageUrl: cafe.image_url,
      isOpen: cafe.is_open,
      waitTime: cafe.wait_time,
      rating: cafe.rating,
    }));
  }
  return [];
};

// 서버가 주문 견적에 사용하는 메뉴·가격을 우선 표시합니다.
export const fetchMenuCatalog = async (cafeId) => {
  const res = await fetch(`${API_BASE_URL}/menus/${encodeURIComponent(cafeId)}`);
  if (!res.ok) throw new Error('메뉴 목록을 불러오지 못했습니다.');
  const result = await res.json();
  if (!result.success || !result.data?.menus) throw new Error('메뉴 목록이 올바르지 않습니다.');
  return result.data;
};

// ✅ 건의사항 제출
export const submitFeedback = async (userId, content) => {
  const res = await fetch(`${API_BASE_URL}/feedbacks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, content }),
  });
  return res.json();
};

// ✅ 메뉴 추천 제출
export const submitRecommendation = async (userId, menuName) => {
  const res = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, menu_name: menuName }),
  });
  return res.json();
};

// ✅ 최근 추천 메뉴 조회
export const fetchRecommendations = async (limit = 5) => {
  const res = await fetch(`${API_BASE_URL}/recommendations?limit=${limit}`);
  const result = await res.json();
  return result.success ? result.data : [];
};
