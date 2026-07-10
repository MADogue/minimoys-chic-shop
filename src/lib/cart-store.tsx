import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./data";

export type CartItem = { product: Product; qty: number };

type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  favorites: string[];
  toggleFav: (id: string) => void;
  isFav: (id: string) => boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "ms-cart-v1";
const FKEY = "ms-fav-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
      const f = localStorage.getItem(FKEY);
      if (f) setFavorites(JSON.parse(f));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(FKEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  const value = useMemo<CartCtx>(() => {
    return {
      items,
      add: (p, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((i) => i.product.id === p.id);
          if (found)
            return prev.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + qty } : i));
          return [...prev, { product: p, qty }];
        }),
      remove: (id) => setItems((prev) => prev.filter((i) => i.product.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          prev
            .map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        ),
      clear: () => setItems([]),
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.product.price, 0),
      favorites,
      toggleFav: (id) =>
        setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
      isFav: (id) => favorites.includes(id),
    };
  }, [items, favorites]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
