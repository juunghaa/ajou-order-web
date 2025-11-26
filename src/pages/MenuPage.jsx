import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import MenuList from '../components/menu/MenuList';
import MenuDetail from '../components/menu/MenuDetail';
import { FloatingCartButton } from '../components/cart/CartSummary';
import { useCart } from '../context/CartContext';

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
DUMMY_MENUS['ajou-cafe-2'] = {
  ...DUMMY_MENUS['ajou-cafe-1'],
  cafeName: '팔달관 카페',
};

DUMMY_MENUS['ajou-cafe-3'] = {
  ...DUMMY_MENUS['ajou-cafe-1'],
  cafeName: '중앙도서관 카페',
};

const MenuPage = () => {
  const { cafeId } = useParams();
  const { totalItems, totalPrice, addItem } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [cafeData, setCafeData] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // 메뉴 데이터 로드
  useEffect(() => {
    const loadMenus = async () => {
      setLoading(true);
      // 실제로는 Firebase에서 데이터 가져오기
      // const data = await fetchMenus(cafeId);
      
      // 데모용 더미 데이터
      setTimeout(() => {
        setCafeData(DUMMY_MENUS[cafeId] || DUMMY_MENUS['ajou-cafe-1']);
        setLoading(false);
      }, 500);
    };
    
    loadMenus();
  }, [cafeId]);
  
  // 메뉴 클릭 핸들러
  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setIsDetailOpen(true);
  };
  
  // 빠른 담기 핸들러
  const handleQuickAdd = (menu) => {
    // 옵션이 없는 메뉴만 빠른 담기 가능
    if (!menu.options || menu.options.length === 0) {
      addItem({
        id: menu.id,
        name: menu.name,
        price: menu.price,
        imageUrl: menu.imageUrl,
        options: {},
        cafeId: cafeId,
        cafeName: cafeData?.cafeName,
      });
    } else {
      // 옵션이 있으면 상세 페이지로
      handleMenuClick(menu);
    }
  };
  
  // 장바구니에 추가 핸들러
  const handleAddToCart = (item) => {
    addItem(item);
  };
  
  return (
    <div className="page-container">
      <Header title={cafeData?.cafeName || '메뉴'} />
      
      <MenuList
        menus={cafeData?.menus || []}
        categories={cafeData?.categories || []}
        loading={loading}
        onMenuClick={handleMenuClick}
        onQuickAdd={handleQuickAdd}
      />
      
      {/* 메뉴 상세 모달 */}
      <MenuDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        menu={selectedMenu}
        onAddToCart={handleAddToCart}
        cafeId={cafeId}
        cafeName={cafeData?.cafeName}
      />
      
      {/* 플로팅 장바구니 버튼 */}
      <FloatingCartButton
        totalItems={totalItems}
        totalPrice={totalPrice}
        onClick={() => window.location.href = '/cart'}
      />
    </div>
  );
};

export default MenuPage;
