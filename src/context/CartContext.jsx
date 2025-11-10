import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(
        item => item.producto.id === action.payload.producto.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.producto.id === action.payload.producto.id
              ? { ...item, cantidad: item.cantidad + action.payload.cantidad }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.producto.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.producto.id === action.payload.productId
            ? { ...item, cantidad: action.payload.cantidad }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        comercio: null,
      };

    case 'SET_COMERCIO':
      return {
        ...state,
        comercio: action.payload,
      };

    default:
      return state;
  }
};

const initialState = {
  items: [],
  comercio: null,
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (producto, cantidad = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { producto, cantidad },
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: productId,
    });
  };

  const updateQuantity = (productId, cantidad) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, cantidad },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setComercio = (comercio) => {
    dispatch({
      type: 'SET_COMERCIO',
      payload: comercio,
    });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.cantidad, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
  };

  const value = {
    items: state.items,
    comercio: state.comercio,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setComercio,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}