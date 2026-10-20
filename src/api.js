// 백엔드 서버 주소
import { supabase } from './lib/supabase';

const API_BASE_URL = 'https://ajou-order-server.onrender.com/api';

const adminRequest = async (path, options = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    const error = new Error('로그인이 필요합니다.');
    error.status = 401;
    throw error;
  }
  const res = await fetch(`${API_BASE_URL}/admin${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session.access_token}`,
    },
  });
  const result = await res.json();
  if (!res.ok || !result.success) {
    const error = new Error(result.error || '관리자 요청에 실패했습니다.');
    error.status = res.status;
    throw error;
  }
  return result.data;
};

export const fetchAdminCafes = () => adminRequest('/cafes');

export const updateAdminCafeStatus = (cafeId, isOpen) => adminRequest(
  `/cafes/${encodeURIComponent(cafeId)}/status`,
  {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isOpen }),
  }
);

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

// 메뉴와 가격은 서버가 Supabase에서 읽은 값만 표시합니다.
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
