'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  BasketItemWithProduct,
  AppContextType,
  Product,
  BasketItem,
  VerifyProxyResponse
} from '../api';
import { authService, productsService, basketService } from '../api';

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_DEVICE_ID'; payload: string }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_TO_BASKET'; payload: { productID: string; count: number } }
  | { type: 'REMOVE_FROM_BASKET'; payload: string }
  | { type: 'UPDATE_BASKET_ITEM'; payload: { productID: string; count: number } }
  | { type: 'CLEAR_BASKET' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// State interface
interface AppState {
  user: User | null;
  deviceID: string;
  products: Product[];
  basket: BasketItemWithProduct[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AppState = {
  user: null,
  deviceID: '',
  products: [],
  basket: [],
  isLoading: false,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'SET_DEVICE_ID':
      return { ...state, deviceID: action.payload };

    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };

    case 'ADD_TO_BASKET': {
      const { productID, count } = action.payload;
      const product = state.products.find(p => p.id === productID);
      if (!product) return state;

      const existingItem = state.basket.find(item => item.productID === productID);
      if (existingItem) {
        return {
          ...state,
          basket: state.basket.map(item =>
            item.productID === productID
              ? {
                  ...item,
                  count: item.count + count,
                  totalPrice: (item.count + count) * product.unitPrice
                }
              : item
          )
        };
      } else {
        const newItem: BasketItemWithProduct = {
          productID,
          product,
          count,
          totalPrice: count * product.unitPrice
        };
        return { ...state, basket: [...state.basket, newItem] };
      }
    }

    case 'REMOVE_FROM_BASKET':
      return {
        ...state,
        basket: state.basket.filter(item => item.productID !== action.payload)
      };

    case 'UPDATE_BASKET_ITEM': {
      const { productID, count } = action.payload;
      const product = state.products.find(p => p.id === productID);
      if (!product) return state;

      if (count <= 0) {
        return {
          ...state,
          basket: state.basket.filter(item => item.productID !== productID)
        };
      }

      return {
        ...state,
        basket: state.basket.map(item =>
          item.productID === productID
            ? { ...item, count, totalPrice: count * product.unitPrice }
            : item
        )
      };
    }

    case 'CLEAR_BASKET':
      return { ...state, basket: [] };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize device ID and load products on mount
  useEffect(() => {
    // Use fixed deviceID as requested
    const deviceID = '3FA85F64-5717-4562-B3FC-2C963F66AFA6';
    localStorage.setItem('deviceID', deviceID);
    console.log('Using fixed deviceID:', deviceID);
    dispatch({ type: 'SET_DEVICE_ID', payload: deviceID });

    // Load products
    loadProducts();
  }, []);

  // Load products from API
  const loadProducts = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await productsService.getActive();
      if (response.success && response.data) {
        dispatch({ type: 'SET_PRODUCTS', payload: response.data.products });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to load products' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load products' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Login/verify function (used after OTP is sent from phone-input page)
  const login = async (mobile: string, otpCode: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Only verify OTP here. The OTP send (auth/login) is done in phone-input page.
      const verifyResponse = await authService.verify({
        mobile,
        otpCode
      });

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.error || 'Verification failed');
      }

      if (verifyResponse.data && verifyResponse.data.user) {
        const user: User = {
          id: verifyResponse.data.user.id,
          mobile: verifyResponse.data.user.mobile,
          name: verifyResponse.data.user.name
        };
        dispatch({ type: 'SET_USER', payload: user });

        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Load user's basket
        await loadBasket(user.id);
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load basket from API
  const loadBasket = async (userID: string) => {
    try {
      const response = await basketService.read({ userID });
      if (response.success && response.data?.items) {
        // Convert basket items to BasketItemWithProduct
        const basketItems: BasketItemWithProduct[] = [];
        for (const item of response.data.items) {
          const product = state.products.find(p => p.id === item.productID);
          if (product) {
            basketItems.push({
              ...item,
              product,
              totalPrice: item.count * product.unitPrice
            });
          }
        }
        // Update basket in state
        dispatch({ type: 'CLEAR_BASKET' });
        basketItems.forEach(item => {
          dispatch({ type: 'ADD_TO_BASKET', payload: { productID: item.productID, count: item.count } });
        });
      }
    } catch (error) {
      console.error('Failed to load basket:', error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API to clear cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'CLEAR_BASKET' });
    localStorage.removeItem('user');
  };

  // Save basket to backend
  const saveBasket = async () => {
    if (!state.user) return;
    
    try {
      const basketItems = state.basket.map(item => ({
        productID: item.productID,
        count: item.count
      }));

      const response = await basketService.save({
        deviceID: state.deviceID,
        userID: state.user.id,
        items: basketItems
      });

      if (!response.success) {
        console.error('Failed to save basket:', response.error);
      }
    } catch (error) {
      console.error('Error saving basket:', error);
    }
  };

  // Basket functions
  const addToBasket = async (productID: string, count: number) => {
    dispatch({ type: 'ADD_TO_BASKET', payload: { productID, count } });
    // Save to backend after state update
    setTimeout(() => saveBasket(), 100);
  };

  const removeFromBasket = async (productID: string) => {
    dispatch({ type: 'REMOVE_FROM_BASKET', payload: productID });
    // Save to backend after state update
    setTimeout(() => saveBasket(), 100);
  };

  const updateBasketItem = async (productID: string, count: number) => {
    dispatch({ type: 'UPDATE_BASKET_ITEM', payload: { productID, count } });
    // Save to backend after state update
    setTimeout(() => saveBasket(), 100);
  };

  const clearBasket = async () => {
    dispatch({ type: 'CLEAR_BASKET' });
    // Save to backend after state update
    setTimeout(() => saveBasket(), 100);
  };

  const getTotalAmount = () => {
    return state.basket.reduce((total, item) => total + item.totalPrice, 0);
  };

  // Load user from localStorage on mount
  useEffect(() => {
    // First check if we have a token in cookies
    const checkAuth = async () => {
      try {
        // Call a simple API to check if we're authenticated
        const response = await fetch('/api/auth/check', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            dispatch({ type: 'SET_USER', payload: data.user });
            loadBasket(data.user.id);
            return;
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
      
      // Fallback to localStorage if API check fails
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          dispatch({ type: 'SET_USER', payload: user });
          loadBasket(user.id);
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
    };
    
    checkAuth();
  }, []);

  const contextValue: AppContextType = {
    user: state.user,
    basket: state.basket,
    deviceID: state.deviceID,
    login,
    logout,
    addToBasket,
    removeFromBasket,
    updateBasketItem,
    clearBasket,
    saveBasket,
    getTotalAmount,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
