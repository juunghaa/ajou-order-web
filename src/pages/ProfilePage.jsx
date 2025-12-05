import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
);

const UserIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [nickname, setNickname] = useState(
    user?.user_metadata?.display_name || ''
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: nickname.trim() }
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const getUserInitial = () => {
    const name = nickname || user?.email?.split('@')[0] || '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center h-14">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon />
            </button>
            <h1 className="flex-1 text-center font-bold text-gray-900 pr-8">프로필 설정</h1>
          </div>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
          {/* 아바타 */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-ajou-primary rounded-full flex items-center justify-center mb-3">
              <span className="text-white text-3xl font-bold">{getUserInitial()}</span>
            </div>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* 닉네임 입력 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ajou-primary/20 focus:border-ajou-primary transition-all"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{nickname.length}/20</p>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
                {error}
              </div>
            )}

            {/* 성공 메시지 */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3">
                ✅ 저장되었습니다!
              </div>
            )}

            {/* 저장 버튼 */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3 bg-ajou-primary hover:bg-ajou-dark text-white font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>

        {/* 로그아웃 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
          >
            로그아웃
          </button>
        </div>

        {/* 계정 정보 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            가입일: {new Date(user?.created_at).toLocaleDateString('ko-KR')}
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;