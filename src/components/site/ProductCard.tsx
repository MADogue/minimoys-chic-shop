import { Link } from "@tanstack/react-router";
import { Heart, Star, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/data";
import { formatFC } from "@/lib/data";
import { useCart } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const { add, toggleFav, isFav } = useCart();
  const promo =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <div className="group flex flex-col">
      <div className="relative overflow-hidden rounded-xl bg-secondary aspect-square">
        <Link to="/produit/$id" params={{ id: product.id }} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              Nouveau
            </span>
          )}
          {promo && (
            <span className="rounded-full bg-promo px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-promo-foreground">
              -{promo}%
            </span>
          )}
        </div>
        <button
          onClick={() => toggleFav(product.id)}
          aria-label="Ajouter aux favoris"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background"
        >
          <Heart className={`h-4 w-4 ${isFav(product.id) ? "fill-primary text-primary" : ""}`} />
        </button>
        <button
          onClick={() => add(product)}
          className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Ajouter au panier
        </button>
      </div>

      <div className="mt-3 flex-1">
        <div className="text-[11px] uppercase tracking-widest text-ink-muted">{product.brand}</div>
        <Link to="/produit/$id" params={{ id: product.id }} className="mt-0.5 block font-medium hover:underline">
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span>{product.rating.toFixed(1)}</span>
          <span>({product.reviews})</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-semibold">{formatFC(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-ink-muted line-through">{formatFC(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
