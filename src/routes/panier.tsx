import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-store";
import { formatFC } from "@/lib/data";
import { Trash2, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/panier")({ component: Panier });

function Panier() {
  const { items, setQty, remove, subtotal } = useCart();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(0);

  const applyCode = () => {
    if (code.toUpperCase() === "MS10") setApplied(0.1);
    else setApplied(0);
  };
  const discount = subtotal * applied;
  const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 3000;
  const total = subtotal - discount + shipping;

  return (
    <div className="container-page py-10 md:py-16">
      <h1 className="font-display text-3xl md:text-5xl">Votre panier</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {items.length === 0 ? "Votre panier est vide." : `${items.length} article${items.length > 1 ? "s" : ""}`}
      </p>

      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="text-ink-muted">Découvrez notre sélection.</p>
          <Link to="/boutique" className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
            Aller à la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-4 rounded-2xl border border-border p-4">
                <img src={product.image} alt={product.name} className="h-24 w-24 shrink-0 rounded-xl object-cover md:h-28 md:w-28" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="text-[11px] uppercase tracking-widest text-ink-muted">{product.brand}</div>
                  <Link to="/produit/$id" params={{ id: product.id }} className="mt-0.5 truncate font-medium">
                    {product.name}
                  </Link>
                  <div className="mt-1 text-sm text-ink-muted">{formatFC(product.price)}</div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex h-9 items-center rounded-full border border-border">
                      <button onClick={() => setQty(product.id, qty - 1)} className="px-3">−</button>
                      <span className="w-6 text-center text-sm">{qty}</span>
                      <button onClick={() => setQty(product.id, qty + 1)} className="px-3">+</button>
                    </div>
                    <button onClick={() => remove(product.id)} aria-label="Supprimer" className="text-ink-muted hover:text-foreground">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="hidden shrink-0 self-center font-semibold md:block">
                  {formatFC(product.price * qty)}
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-border p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Résumé</h2>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink-muted">Sous-total</span><span>{formatFC(subtotal)}</span></div>
              {applied > 0 && <div className="flex justify-between text-promo"><span>Code promo</span><span>−{formatFC(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-ink-muted">Livraison</span><span>{shipping === 0 ? "Offerte" : formatFC(shipping)}</span></div>
            </div>
            <div className="mt-4 flex items-stretch gap-2">
              <label className="flex flex-1 items-center gap-2 rounded-full bg-secondary px-3">
                <Tag className="h-4 w-4 text-ink-muted" />
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code promo (MS10)" className="w-full bg-transparent py-2 text-sm outline-none" />
              </label>
              <button onClick={applyCode} className="rounded-full border border-border px-4 text-xs font-semibold uppercase tracking-wider">
                OK
              </button>
            </div>
            <div className="mt-5 border-t border-border pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatFC(total)}</span>
              </div>
            </div>
            <Link to="/paiement" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
              Passer la commande <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-3 text-center text-xs text-ink-muted">Paiement à la livraison disponible</div>
          </aside>
        </div>
      )}
    </div>
  );
}
