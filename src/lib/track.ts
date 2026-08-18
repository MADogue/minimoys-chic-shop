import { useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { recordProductView, createOrder } from "./tracking.functions";
import type { Product } from "./data";

const SKEY = "ms-session-v1";

function sessionId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    let s = localStorage.getItem(SKEY);
    if (!s) {
      s = crypto.randomUUID();
      localStorage.setItem(SKEY, s);
    }
    return s;
  } catch {
    return undefined;
  }
}

/** Enregistre une seule vue par chargement de fiche produit. */
export function useProductView(productId: string) {
  const viewFn = useServerFn(recordProductView);
  const done = useRef<string | null>(null);

  useEffect(() => {
    if (done.current === productId) return;
    done.current = productId;
    const sid = sessionId();
    void viewFn({ data: { productId, ...(sid ? { sessionId: sid } : {}) } }).catch(() => {});
  }, [productId, viewFn]);
}

export function useRecordOrder() {
  const orderFn = useServerFn(createOrder);
  return (items: { product: Product; qty: number }[], total: number) => {
    if (items.length === 0) return;
    void orderFn({
      data: {
        total,
        items: items.map(({ product, qty }) => ({
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          quantity: qty,
        })),
      },
    }).catch(() => {});
  };
}
