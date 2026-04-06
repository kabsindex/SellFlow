import { createContext } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color: string;
  icon: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
