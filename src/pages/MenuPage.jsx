import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import MenuDetail from '../components/menu/MenuDetail';
import { useCart } from '../context/CartContext';
import { MenuCardSkeleton } from '../components/common/Loading';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6" />
    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
  </svg>
);

// 더미 메뉴 데이터
const DUMMY_MENUS = {
  'ajou-cafe-1': {
    cafeName: '아주 카페 본점',
    categories: [
      { id: 'coffee', name: '커피' },
      { id: 'non-coffee', name: '논커피' },
      { id: 'dessert', name: '디저트' },
    ],
    menus: [
      {
        id: 'menu-1',
        name: '아메리카노',
        price: 2500,
        description: '깊고 진한 에스프레소의 풍미',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
        category: '커피',
        isPopular: true,
        isSoldOut: false,
        options: [
          {
            id: 'temp',
            name: '온도',
            required: true,
            multiple: false,
            items: [
              { id: 'hot', name: 'HOT', price: 0 },
              { id: 'ice', name: 'ICE', price: 0 },
            ],
          },
          {
            id: 'size',
            name: '사이즈',
            required: true,
            multiple: false,
            items: [
              { id: 'regular', name: 'Regular', price: 0 },
              { id: 'large', name: 'Large', price: 500 },
            ],
          },
          {
            id: 'shot',
            name: '샷 추가',
            required: false,
            multiple: true,
            items: [
              { id: 'extra-shot', name: '샷 추가', price: 500 },
              { id: 'decaf', name: '디카페인 변경', price: 500 },
            ],
          },
        ],
      },
      {
        id: 'menu-2',
        name: '카페라떼',
        price: 3500,
        description: '부드러운 우유와 에스프레소의 조화',
        imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
        category: '커피',
        isPopular: true,
        isSoldOut: false,
        options: [
          {
            id: 'temp',
            name: '온도',
            required: true,
            multiple: false,
            items: [
              { id: 'hot', name: 'HOT', price: 0 },
              { id: 'ice', name: 'ICE', price: 0 },
            ],
          },
          {
            id: 'size',
            name: '사이즈',
            required: true,
            multiple: false,
            items: [
              { id: 'regular', name: 'Regular', price: 0 },
              { id: 'large', name: 'Large', price: 500 },
            ],
          },
        ],
      },
      {
        id: 'menu-3',
        name: '바닐라라떼',
        price: 4000,
        description: '달콤한 바닐라 시럽이 들어간 라떼',
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
        category: '커피',
        isNew: true,
        isSoldOut: false,
        options: [
          {
            id: 'temp',
            name: '온도',
            required: true,
            multiple: false,
            items: [
              { id: 'hot', name: 'HOT', price: 0 },
              { id: 'ice', name: 'ICE', price: 0 },
            ],
          },
        ],
      },
      {
        id: 'menu-4',
        name: '녹차라떼',
        price: 4000,
        description: '진한 녹차와 부드러운 우유',
        imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400',
        category: '논커피',
        isPopular: false,
        isSoldOut: false,
        options: [
          {
            id: 'temp',
            name: '온도',
            required: true,
            multiple: false,
            items: [
              { id: 'hot', name: 'HOT', price: 0 },
              { id: 'ice', name: 'ICE', price: 0 },
            ],
          },
        ],
      },
      {
        id: 'menu-5',
        name: '초코라떼',
        price: 4000,
        description: '달콤한 초콜릿과 우유의 만남',
        imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400',
        category: '논커피',
        isPopular: false,
        isSoldOut: false,
        options: [],
      },
      {
        id: 'menu-6',
        name: '티라미수 케이크',
        price: 5500,
        description: '진한 에스프레소와 마스카포네 치즈',
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category: '디저트',
        isPopular: true,
        isSoldOut: false,
        options: [],
      },
      {
        id: 'menu-7',
        name: '크로아상',
        price: 3500,
        description: '바삭하고 버터향 가득한 크로아상',
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
        category: '디저트',
        isPopular: false,
        isSoldOut: true,
        options: [],
      },
      {
        id: 'menu-8',
        name: '마카롱 세트',
        price: 6000,
        description: '다양한 맛의 마카롱 4개 세트',
        imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400',
        category: '디저트',
        isNew: true,
        isSoldOut: false,
        options: [],
      },
    ],
  },
};

// 다른 카페도 같은 메뉴 사용 (데모용)
DUMMY_MENUS['ajou-cafe-2'] = { ...DUMMY_MENUS['ajou-cafe-1'], cafeName: '팔달관 카페' };
DUMMY_MENUS['ajou-cafe-3'] = { ...DUMMY_MENUS['ajou-cafe-1'], cafeName: '중앙도서관 카페' };
DUMMY_MENUS['ajou-cafe-4'] = { ...DUMMY_MENUS['ajou-cafe-1'], cafeName: '학생회관 카페' };

const MenuPage = () => {
  const { cafeId } = useParams();
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, addItem, updateQuantity, removeItem } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [cafeData, setCafeData] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // 메뉴 데이터 로드
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCafeData(DUMMY_MENUS[cafeId] || DUMMY_MENUS['ajou-cafe-1']);
      setLoading(false);
    }, 500);
  }, [cafeId]);
  
  // 필터링된 메뉴
  const filteredMenus = useMemo(() => {
    if (!cafeData) return [];
    return cafeData.menus.filter((menu) => {
      const matchesSearch = searchQuery === '' || 
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (menu.description && menu.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || menu.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [cafeData, searchQuery, selectedCategory]);
  
  // 카테고리별 그룹화
  const groupedMenus = useMemo(() => {
    if (selectedCategory !== 'all') {
      return { [selectedCategory]: filteredMenus };
    }
    return filteredMenus.reduce((acc, menu) => {
      const category = menu.category || '기타';
      if (!acc[category]) acc[category] = [];
      acc[category].push(menu);
      return acc;
    }, {});
  }, [filteredMenus, selectedCategory]);
  
  const formatPrice = (price) => new Intl.NumberFormat('ko-KR').format(price);
  
  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setIsDetailOpen(true);
  };
  
  const handleQuickAdd = (menu) => {
    if (!menu.options || menu.options.length === 0) {
      addItem({
        id: menu.id,
        name: menu.name,
        price: menu.price,
        imageUrl: menu.imageUrl,
        options: {},
        cafeId,
        cafeName: cafeData?.cafeName,
      });
    } else {
      handleMenuClick(menu);
    }
  };
  
  const handleAddToCart = (item) => addItem(item);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="메뉴" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <MenuCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={cafeData?.cafeName || '메뉴'} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:flex lg:gap-8">
          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            {/* 검색 & 필터 */}
            <div className="sticky top-[57px] z-40 bg-gray-50 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 검색바 */}
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="메뉴 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-12 w-full"
                  />
                </div>
                
                {/* 카테고리 탭 */}
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                      ${selectedCategory === 'all' ? 'bg-ajou-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                  >
                    전체
                  </button>
                  {cafeData?.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                        ${selectedCategory === category.name ? 'bg-ajou-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 메뉴 그리드 */}
            {Object.keys(groupedMenus).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">검색 결과가 없습니다</p>
              </div>
            ) : (
              Object.entries(groupedMenus).map(([category, categoryMenus]) => (
                <div key={category} className="mb-8">
                  {selectedCategory === 'all' && (
                    <h2 className="text-lg font-bold text-gray-900 mb-4">{category}</h2>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryMenus.map((menu, index) => (
                      <div
                        key={menu.id}
                        onClick={() => !menu.isSoldOut && handleMenuClick(menu)}
                        className={`bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer
                          hover:shadow-card-hover transition-all duration-300 animate-slide-up
                          ${menu.isSoldOut ? 'opacity-60 cursor-not-allowed' : ''}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {/* 이미지 */}
                        <div className="relative h-40">
                          <img
                            src={menu.imageUrl || '/images/default-menu.png'}
                            alt={menu.name}
                            className="w-full h-full object-cover"
                          />
                          {menu.isSoldOut && (
                            <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                              <span className="text-white font-bold">품절</span>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 flex gap-1">
                            {menu.isPopular && <span className="badge-accent text-xs">인기</span>}
                            {menu.isNew && <span className="badge-primary text-xs">NEW</span>}
                          </div>
                        </div>
                        
                        {/* 정보 */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900">{menu.name}</h3>
                          {menu.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{menu.description}</p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-bold text-ajou-primary">{formatPrice(menu.price)}원</span>
                            {!menu.isSoldOut && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleQuickAdd(menu); }}
                                className="w-8 h-8 bg-ajou-primary text-white rounded-full flex items-center justify-center
                                  hover:bg-ajou-dark transition-colors active:scale-90"
                              >
                                <PlusIcon />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* 사이드 장바구니 (데스크탑) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                장바구니 ({totalItems})
              </h3>
              
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">장바구니가 비어있습니다</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {items.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                          <p className="text-ajou-primary font-semibold text-sm mt-1">
                            {formatPrice(item.price * item.quantity)}원
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.options, item.quantity - 1)}
                              className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm"
                            >
                              <MinusIcon />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.options, item.quantity + 1)}
                              className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm"
                            >
                              <PlusIcon />
                            </button>
                            <button
                              onClick={() => removeItem(item.id, item.options)}
                              className="ml-auto w-6 h-6 text-gray-400 hover:text-red-500"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-100 mt-4 pt-4">
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600">총 금액</span>
                      <span className="text-xl font-bold text-ajou-primary">
                        {formatPrice(totalPrice)}원
                      </span>
                    </div>
                    <button
                      onClick={() => navigate('/cart')}
                      className="btn-primary w-full"
                    >
                      주문하기
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 모바일 플로팅 장바구니 버튼 */}
      {totalItems > 0 && (
        <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-ajou-primary text-white rounded-2xl p-4 shadow-modal
              flex items-center justify-between hover:bg-ajou-dark transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
              <span className="font-semibold">장바구니 보기</span>
            </div>
            <span className="font-bold">{formatPrice(totalPrice)}원</span>
          </button>
        </div>
      )}
      
      {/* 메뉴 상세 모달 */}
      <MenuDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        menu={selectedMenu}
        onAddToCart={handleAddToCart}
        cafeId={cafeId}
        cafeName={cafeData?.cafeName}
      />
    </div>
  );
};

export default MenuPage;
