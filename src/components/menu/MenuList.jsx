import React, { useState, useMemo } from 'react';
import MenuCard from './MenuCard';
import { MenuCardSkeleton } from '../common/Loading';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const MenuList = ({ 
  menus = [], 
  categories = [],
  loading = false,
  onMenuClick,
  onQuickAdd,
  showSearch = true,
  showCategories = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // 필터링된 메뉴
  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      // 검색어 필터
      const matchesSearch = searchQuery === '' || 
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (menu.description && menu.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 카테고리 필터
      const matchesCategory = selectedCategory === 'all' || 
        menu.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [menus, searchQuery, selectedCategory]);
  
  // 카테고리별 메뉴 그룹화
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
  
  // 로딩 상태
  if (loading) {
    return (
      <div className="space-y-4 px-4">
        {[1, 2, 3, 4].map((i) => (
          <MenuCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* 검색바 */}
      {showSearch && (
        <div className="px-4 sticky top-[57px] z-40 bg-gray-50 py-3 -mx-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="메뉴 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>
      )}
      
      {/* 카테고리 탭 */}
      {showCategories && categories.length > 0 && (
        <div className="px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${selectedCategory === 'all' 
                  ? 'bg-ajou-primary text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'}
              `}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${selectedCategory === category.id 
                    ? 'bg-ajou-primary text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'}
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* 메뉴 목록 */}
      <div className="px-4">
        {Object.keys(groupedMenus).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        ) : (
          Object.entries(groupedMenus).map(([category, categoryMenus]) => (
            <div key={category} className="mb-6">
              {selectedCategory === 'all' && (
                <h2 className="text-lg font-bold text-gray-900 mb-3 sticky top-[120px] bg-gray-50 py-2 z-30">
                  {category}
                </h2>
              )}
              <div className="space-y-3">
                {categoryMenus.map((menu, index) => (
                  <div 
                    key={menu.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <MenuCard
                      menu={menu}
                      onClick={onMenuClick}
                      onQuickAdd={onQuickAdd}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuList;
