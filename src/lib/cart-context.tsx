import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  variant?: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeItem: (id: string, variant?: string) => void;
  updateQty: (id: string, variant: string | undefined, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "mamiejago-cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const cartKey = (id: string, variant?: string) => `${id}__${variant ?? "default"}`;

  const addItem = useCallback((item: Omit<CartItem, "qty"> & { qty?: number }) => {
    setItems((prev) => {
      const key = cartKey(item.id, item.variant);
      const idx = prev.findIndex((i) => cartKey(i.id, i.variant) === key);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + (item.qty ?? 1) };
        return updated;
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string, variant?: string) => {
    setItems((prev) => prev.filter((i) => cartKey(i.id, i.variant) !== cartKey(id, variant)));
  }, []);

  const updateQty = useCallback((id: string, variant: string | undefined, qty: number) => {
    if (qty <= 0) {
      removeItem(id, variant);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (cartKey(i.id, i.variant) === cartKey(id, variant) ? { ...i, qty } : i))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
