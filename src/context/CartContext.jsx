import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 장바구니 Context
const CartContext = createContext(null);

// 액션 타입
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_CAFE: 'SET_CAFE',
  LOAD_CART: 'LOAD_CART',
};

// 초기 상태
const initialState = {
  items: [],
  cafe: null,
  totalItems: 0,
  totalPrice: 0,
};

// 총액 계산 함수
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

// 리듀서
const cartReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const { item } = action.payload;
      
      // 다른 카페 상품이면 장바구니 초기화 확인
      if (state.cafe && state.cafe.id !== item.cafeId) {
        const confirm = window.confirm(
          '다른 카페의 메뉴를 담으시겠습니까?\n기존 장바구니가 비워집니다.'
        );
        if (!confirm) return state;
        
        const newItems = [{ ...item, quantity: 1 }];
        return {
          ...state,
          items: newItems,
          cafe: { id: item.cafeId, name: item.cafeName },
          ...calculateTotals(newItems),
        };
      }
      
      // 이미 있는 상품인지 확인
      const existingIndex = state.items.findIndex(
        (i) => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options)
      );
      
      let newItems;
      if (existingIndex >= 0) {
        // 수량 증가
        newItems = state.items.map((i, idx) =>
          idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // 새 상품 추가
        newItems = [...state.items, { ...item, quantity: 1 }];
      }
      
      return {
        ...state,
        items: newItems,
        cafe: state.cafe || { id: item.cafeId, name: item.cafeName },
        ...calculateTotals(newItems),
      };
    }
    
    case ACTIONS.REMOVE_ITEM: {
      const { itemId, options } = action.payload;
      const newItems = state.items.filter(
        (i) => !(i.id === itemId && JSON.stringify(i.options) === JSON.stringify(options))
      );
      
      return {
        ...state,
        items: newItems,
        cafe: newItems.length === 0 ? null : state.cafe,
        ...calculateTotals(newItems),
      };
    }
    
    case ACTIONS.UPDATE_QUANTITY: {
      const { itemId, options, quantity } = action.payload;
      
      if (quantity <= 0) {
        // 수량이 0 이하면 삭제
        return cartReducer(state, {
          type: ACTIONS.REMOVE_ITEM,
          payload: { itemId, options },
        });
      }
      
      const newItems = state.items.map((i) =>
        i.id === itemId && JSON.stringify(i.options) === JSON.stringify(options)
          ? { ...i, quantity }
          : i
      );
      
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }
    
    case ACTIONS.CLEAR_CART:
      return initialState;
    
    case ACTIONS.SET_CAFE:
      return {
        ...state,
        cafe: action.payload,
      };
    
    case ACTIONS.LOAD_CART:
      return {
        ...action.payload,
        ...calculateTotals(action.payload.items || []),
      };
    
    default:
      return state;
  }
};

// Provider 컴포넌트
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // 로컬 스토리지에서 장바구니 불러오기
  useEffect(() => {
    const savedCart = localStorage.getItem('ajouorder_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: ACTIONS.LOAD_CART, payload: parsed });
      } catch (e) {
        console.error('장바구니 로드 실패:', e);
      }
    }
  }, []);
  
  // 장바구니 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('ajouorder_cart', JSON.stringify(state));
  }, [state]);
  
  // 액션 함수들
  const addItem = (item) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: { item } });
  };
  
  const removeItem = (itemId, options = {}) => {
    dispatch({ type: ACTIONS.REMOVE_ITEM, payload: { itemId, options } });
  };
  
  const updateQuantity = (itemId, options, quantity) => {
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { itemId, options, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  };
  
  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// 커스텀 훅
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
