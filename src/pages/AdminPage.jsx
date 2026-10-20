import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchAdminCafes, updateAdminCafeStatus } from '../api';

const AdminPage = () => {
  const { user } = useAuth();
  const [cafes, setCafes] = useState([]);
  const [state, setState] = useState('loading');
  const [checkedUserId, setCheckedUserId] = useState(null);
  const [error, setError] = useState('');
  const [pendingCafe, setPendingCafe] = useState(null);
  const [reloadTick, setReloadTick] = useState(0);
  const userId = user?.id;

  const loadCafes = () => {
    setState('loading');
    setError('');
    setReloadTick((value) => value + 1);
  };

  useEffect(() => {
    if (!userId) {
      setCafes([]);
      setCheckedUserId(null);
      setState('login');
      return;
    }
    let active = true;
    setCafes([]);
    setCheckedUserId(null);
    setState('loading');
    fetchAdminCafes()
      .then((data) => {
        if (active) {
          setCafes(data);
          setCheckedUserId(userId);
          setState('ready');
        }
      })
      .catch((requestError) => {
        if (active) {
          setCheckedUserId(userId);
          setState(requestError.status === 403 ? 'forbidden' : requestError.status === 401 ? 'login' : 'error');
        }
      });
    return () => { active = false; };
  }, [userId, reloadTick]);

  const changeStatus = async (cafe) => {
    setPendingCafe(cafe.id);
    setError('');
    try {
      const updated = await updateAdminCafeStatus(cafe.id, !cafe.is_open);
      setCafes((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) {
      setError(requestError.status === 403
        ? '이 카페의 관리자 권한이 없습니다. 목록을 새로고침해 주세요.'
        : '카페 상태를 변경하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setPendingCafe(null);
    }
  };

  const displayState = !userId ? 'login' : checkedUserId === userId ? state : 'loading';
  if (displayState !== 'ready') {
    const message = {
      loading: '관리 카페를 확인하는 중입니다.',
      login: '관리자 페이지를 보려면 로그인해 주세요.',
      forbidden: '관리할 수 있는 카페가 없습니다.',
      error: '관리 카페를 불러오지 못했습니다.',
    }[displayState];
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">카페 관리자</h1>
          <p className="mt-4 text-gray-600" role="status">{message}</p>
          <div className="mt-6 flex justify-center gap-4">
            {displayState === 'login' && <Link to="/login" className="text-ajou-primary font-semibold">로그인</Link>}
            {displayState === 'error' && <button onClick={loadCafes} className="text-ajou-primary font-semibold">다시 시도</button>}
            <Link to="/" className="text-gray-600">카페 둘러보기</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">카페 영업 상태 관리</h1>
            <p className="mt-1 text-sm text-gray-600">담당 카페만 표시됩니다.</p>
          </div>
          <button onClick={loadCafes} className="rounded-xl bg-white px-4 py-2 text-sm text-gray-700 shadow-sm">새로고침</button>
        </div>
        {error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {cafes.map((cafe) => (
            <section key={cafe.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <img src={cafe.image_url} alt="" className="h-16 w-16 rounded-xl object-cover" />
                <div>
                  <h2 className="font-bold text-gray-900">{cafe.name}</h2>
                  <p className="text-sm text-gray-500">{cafe.location}</p>
                  <p className={`mt-1 text-sm font-semibold ${cafe.is_open ? 'text-green-700' : 'text-gray-500'}`}>
                    {cafe.is_open ? '영업 중' : '영업 준비 중'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => changeStatus(cafe)}
                disabled={pendingCafe !== null}
                className="mt-5 w-full rounded-xl bg-ajou-primary px-4 py-3 font-semibold text-white disabled:opacity-50"
              >
                {pendingCafe === cafe.id ? '변경 중...' : cafe.is_open ? '영업 종료하기' : '영업 시작하기'}
              </button>
            </section>
          ))}
        </div>
        <Link to="/" className="mt-8 inline-block text-sm text-gray-600 underline">카페 둘러보기</Link>
      </div>
    </main>
  );
};

export default AdminPage;
