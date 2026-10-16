import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getMenusByCafeId } from '../data/menuData';
import AiRecommendModal from '../components/AiRecommendModal';

// 아이콘 컴포넌트들 (변경 없음)
const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MenuPage = () => {
  const navigate = useNavigate();
  const { cafeId } = useParams();

  const [showAiModal, setShowAiModal] = useState(false);

  const { addItem, totalItems } = useCart();
  
  // 카페별 메뉴 데이터 가져오기
  const cafeData = useMemo(() => getMenusByCafeId(cafeId), [cafeId]);
  const { cafeName, categories, menus } = cafeData;
  
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  
  const allCategories = ['전체', ...categories];
  
  const filteredMenus = useMemo(() => {
    return menus.filter(menu => {
      const matchesCategory = selectedCategory === '전체' || menu.category === selectedCategory;
      const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (menu.nameEn && menu.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menus, selectedCategory, searchQuery]);
  
  const handleSelectMenu = (menu) => {
    setSelectedMenu(menu);
    setQuantity(1);
    const initialOptions = {};
    if (menu.options?.temperature) {
      initialOptions.temperature = menu.options.temperature[0];
    }
    if (menu.options?.size) {
      initialOptions.size = menu.options.size[0];
    }
    setSelectedOptions(initialOptions);
  };
  
  const calculateOptionPrice = () => {
    let extraPrice = 0;
    if (selectedOptions.size?.price) {
      extraPrice += selectedOptions.size.price;
    }
    if (selectedOptions.extra) {
      selectedOptions.extra.forEach(e => {
        extraPrice += e.price;
      });
    }
    return extraPrice;
  };
  
  // 장바구니 추가 핸들러
  const handleAddToCart = () => {
    if (!selectedMenu) return;
    
    // 기본 가격 + 옵션 가격
    const unitPrice = selectedMenu.price + calculateOptionPrice();
    
    // Context에 넘길 아이템 객체 생성
    const cartItem = {
      id: selectedMenu.id, // 유니크 ID는 리듀서나 렌더링 시 처리해도 됨, 여기서는 메뉴 ID 사용
      name: selectedMenu.name,
      price: unitPrice,    // 옵션 포함 단가
      quantity: quantity,  // 선택된 수량
      options: selectedOptions,
      cafeId,
      cafeName,
      imageUrl: selectedMenu.imageUrl,
    };
    
    addItem(cartItem); // Context의 함수 호출
    setSelectedMenu(null); // 모달 닫기
  };
  
  const toggleExtraOption = (extra) => {
    const currentExtras = selectedOptions.extra || [];
    const exists = currentExtras.find(e => e.name === extra.name);
    
    if (exists) {
      setSelectedOptions({
        ...selectedOptions,
        extra: currentExtras.filter(e => e.name !== extra.name),
      });
    } else {
      setSelectedOptions({
        ...selectedOptions,
        extra: [...currentExtras, extra],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeftIcon />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{cafeName}</h1>
                <p className="text-sm text-gray-500">메뉴 선택</p>
              </div>
            </div>
            
            {/* 장바구니 버튼 수정됨: getTotalItems() 함수 호출 -> totalItems 변수 사용 */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-ajou-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
          
          <div className="pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="메뉴 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-ajou-primary/20"
                style={{ paddingLeft: '40px' }}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pb-4 overflow-x-auto scrollbar-hide">
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${selectedCategory === category 
                    ? 'bg-ajou-primary text-white' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-ajou-primary/50'}
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMenus.map(menu => (
            <div
              key={menu.id}
              onClick={() => handleSelectMenu(menu)}
              className="bg-white rounded-3xl overflow-hidden cursor-pointer hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: '0 2px 12px rgba(31, 47, 152, 0.06)' }}
            >
              <div className="relative aspect-square">
                <img
                  src={menu.imageUrl}
                  alt={menu.name}
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  {menu.isPopular && (
                    <span className="px-2 py-0.5 bg-ajou-accent text-white text-xs font-bold rounded-full">
                      인기
                    </span>
                  )}
                  {menu.isNew && (
                    <span className="px-2 py-0.5 bg-ajou-primary text-white text-xs font-bold rounded-full">
                      NEW
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{menu.name}</h3>
                {menu.nameEn && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{menu.nameEn}</p>
                )}
                <p className="text-ajou-primary font-bold mt-2">
                  {menu.price.toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {filteredMenus.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}
      </main>
      
      {/* 플로팅 장바구니 버튼 (모바일) 수정됨 */}
      {totalItems > 0 && (
        <div className="lg:hidden fixed bottom-6 left-4 right-4">
          <button
            onClick={() => navigate('/cart')}
            className="w-full py-4 bg-ajou-primary text-white rounded-2xl font-medium flex items-center justify-center gap-2 shadow-lg"
          >
            <CartIcon />
            장바구니 보기 ({totalItems})
          </button>
        </div>
      )}
      
      {selectedMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-auto animate-slide-up">
            <div className="relative aspect-video">
              <img
                src={selectedMenu.imageUrl}
                alt={selectedMenu.name}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedMenu(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center"
              >
                <XIcon />
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900">{selectedMenu.name}</h2>
              {selectedMenu.nameEn && (
                <p className="text-sm text-gray-500 mt-1">{selectedMenu.nameEn}</p>
              )}
              <p className="text-2xl font-bold text-ajou-primary mt-2">
                {selectedMenu.price.toLocaleString()}원
              </p>
              
              {selectedMenu.options?.temperature && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">온도 선택</p>
                  <div className="flex gap-2">
                    {selectedMenu.options.temperature.map(temp => (
                      <button
                        key={temp}
                        onClick={() => setSelectedOptions({ ...selectedOptions, temperature: temp })}
                        className={`
                          flex-1 py-3 rounded-xl font-medium text-sm transition-all
                          ${selectedOptions.temperature === temp 
                            ? 'bg-ajou-primary text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                        `}
                      >
                        {temp}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedMenu.options?.size && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">사이즈 선택</p>
                  <div className="flex gap-2">
                    {selectedMenu.options.size.map(size => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedOptions({ ...selectedOptions, size })}
                        className={`
                          flex-1 py-3 rounded-xl font-medium text-sm transition-all
                          ${selectedOptions.size?.name === size.name 
                            ? 'bg-ajou-primary text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                        `}
                      >
                        {size.name}
                        {size.price > 0 && (
                          <span className="ml-1 text-xs opacity-80">+{size.price}원</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedMenu.options?.extra && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">추가 옵션</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMenu.options.extra.map(extra => {
                      const isSelected = selectedOptions.extra?.find(e => e.name === extra.name);
                      return (
                        <button
                          key={extra.name}
                          onClick={() => toggleExtraOption(extra)}
                          className={`
                            px-4 py-2 rounded-xl font-medium text-sm transition-all
                            ${isSelected 
                              ? 'bg-ajou-accent text-white' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                          `}
                        >
                          {extra.name} +{extra.price}원
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">수량</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <MinusIcon />
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500">총 금액</span>
                  <span className="text-2xl font-bold text-ajou-primary">
                    {((selectedMenu.price + calculateOptionPrice()) * quantity).toLocaleString()}원
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-ajou-primary text-white rounded-2xl font-medium text-lg hover:bg-ajou-dark transition-colors"
                >
                  장바구니 담기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ AI 버튼 - 여기로 이동! */}
      <button 
        onClick={() => setShowAiModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-40"
      >
        🤖
      </button>
      
      {/* AI 모달 */}
      <AiRecommendModal 
        isOpen={showAiModal} 
        onClose={() => setShowAiModal(false)}
        cafeId={cafeId}
      />

    </div>
  );
};

export default MenuPage;
