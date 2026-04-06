import { useCallback, useState, type ReactNode } from "react";
import { CartContext, type CartItem } from "./cart-context";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const key = `${item.id}-${item.size || "default"}`;
        const existing = prev.find(
          (i) => `${i.id}-${i.size || "default"}` === key,
        );
        if (existing) {
          return prev.map((i) =>
            `${i.id}-${i.size || "default"}` === key
              ? {
                  ...i,
                  quantity: i.quantity + quantity,
                }
              : i,
          );
        }
        return [
          ...prev,
          {
            ...item,
            quantity,
          },
        ];
      });
    },
    [],
  );
  const removeItem = useCallback((id: string, size?: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.id === id && (i.size || "default") === (size || "default")),
      ),
    );
  }, []);
  const updateQuantity = useCallback(
    (id: string, quantity: number, size?: string) => {
      if (quantity <= 0) {
        removeItem(id, size);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.id === id && (i.size || "default") === (size || "default")
            ? {
                ...i,
                quantity,
              }
            : i,
        ),
      );
    },
    [removeItem],
  );
  const clearCart = useCallback(() => setItems([]), []);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
