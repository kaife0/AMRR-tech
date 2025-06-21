import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Item } from '../types/item';
import { apiService } from '../services/api';

interface ItemState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

type ItemAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: string };

const initialState: ItemState = {
  items: [],
  loading: false,
  error: null
};

function itemReducer(state: ItemState, action: ItemAction): ItemState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    default:
      return state;
  }
}

interface ItemContextType {
  state: ItemState;
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  setItems: (items: Item[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshItems: () => Promise<void>;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const useItems = () => {
  const context = useContext(ItemContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};

interface ItemProviderProps {
  children: ReactNode;
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(itemReducer, initialState);

  const addItem = (item: Item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const updateItem = (item: Item) => {
    dispatch({ type: 'UPDATE_ITEM', payload: item });
  };

  const deleteItem = (id: string) => {
    dispatch({ type: 'DELETE_ITEM', payload: id });
  };

  const setItems = (items: Item[]) => {
    dispatch({ type: 'SET_ITEMS', payload: items });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };  // Static fallback data
  const getStaticItems = (): Item[] => [
    {
      id: '1',
      name: 'Classic White Shirt',
      type: 'Shirt',
      description: 'A comfortable cotton white shirt perfect for office wear.',
      coverImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
      additionalImages: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop&crop=center'
      ],
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Running Sneakers',
      type: 'Shoes',
      description: 'Lightweight running shoes with excellent cushioning.',
      coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center',
      additionalImages: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&crop=center'
      ],
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Denim Jeans',
      type: 'Pant',
      description: 'Classic blue denim jeans with a perfect fit.',
      coverImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop&crop=center',
      additionalImages: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1506629905639-b8f5c88b3d3c?w=600&h=600&fit=crop&crop=center'
      ],
      createdAt: new Date()
    }
  ];

  const refreshItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getItems();
      
      if (response.success && response.data && response.data.length > 0) {
        // Convert date strings back to Date objects
        const itemsWithDates = response.data.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }));
        setItems(itemsWithDates);
      } else {
        // Use static data if API fails or returns empty data
        console.log('Using static fallback data');
        setItems(getStaticItems());
        if (!response.success) {
          setError('Using demo data - backend not available');
        }
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      console.log('Using static fallback data due to network error');
      setItems(getStaticItems());
      setError('Using demo data - network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load items on component mount
  useEffect(() => {
    refreshItems();
  }, []);

  const value: ItemContextType = {
    state,
    addItem,
    updateItem,
    deleteItem,
    setItems,
    setLoading,
    setError,
    refreshItems
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};
