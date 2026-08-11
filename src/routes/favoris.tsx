import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-store";
import { productsQueryOptions } from "@/lib/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/site/ProductCard";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favoris")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQueryOptions);
  },
  component: Favoris,
  errorComponent: () => (
    <div className="container-page py-24 text-center text-ink-muted">
      Impossible de charger les produits.
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center text-ink-muted">Aucun favori.</div>
  ),
});

function Favoris() {
  const { favorites } = useCart();
  const { data: products } = useSuspenseQuery(productsQueryOptions);
  const list = products.filter((p) => favorites.includes(p.id));
  return (
    <div className="container-page py-10 md:py-16">
      <h1 className="font-display text-3xl md:text-5xl">Mes favoris</h1>
      <p className="mt-2 text-sm text-ink-muted">Retrouvez ici les produits que vous aimez.</p>
      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border py-20 text-center">
          <Heart className="mx-auto h-8 w-8 text-ink-muted" />
          <p className="mt-4 text-ink-muted">Vous n'avez pas encore de favoris.</p>
          <Link to="/boutique" className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
            Voir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
