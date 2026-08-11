import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { categories, formatFC } from "@/lib/data";
import { productsQueryOptions } from "@/lib/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/site/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";

const searchSchema = z.object({
  cat: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/boutique")({
  validateSearch: (s) => searchSchema.parse(s),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQueryOptions);
  },
  component: Boutique,
  errorComponent: () => (
    <div className="container-page py-24 text-center text-ink-muted">
      Impossible de charger les produits.
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center text-ink-muted">Aucun produit.</div>
  ),
});

function Boutique() {
  const search = Route.useSearch();
  const { data: products } = useSuspenseQuery(productsQueryOptions);
  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const [cat, setCat] = useState<string | undefined>(search.cat);
  const [query, setQuery] = useState<string>(search.q ?? "");
  const [brand, setBrand] = useState<string | undefined>();
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [sort, setSort] = useState<"pop" | "new" | "asc" | "desc">("pop");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (brand && p.brand !== brand) return false;
      if (p.price > maxPrice) return false;
      if (query && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
    if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    if (sort === "pop") list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [products, cat, brand, maxPrice, query, sort]);

  const activeCat = categories.find((c) => c.slug === cat);

  return (
    <div className="container-page py-10 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-ink-muted">Boutique</div>
          <h1 className="mt-2 font-display text-3xl md:text-5xl">
            {activeCat ? activeCat.name : "Tous les produits"}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {filtered.length} produit{filtered.length > 1 ? "s" : ""} disponibles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-10 rounded-full border border-border bg-background px-4 text-sm"
          >
            <option value="pop">Trier : Populaires</option>
            <option value="new">Nouveautés</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtres
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className={`${showFilters ? "block" : "hidden"} md:block`}>
          <div className="space-y-6 rounded-2xl border border-border p-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider">Recherche</h3>
                {showFilters && (
                  <button onClick={() => setShowFilters(false)} className="md:hidden">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nom, marque..."
                className="mt-3 h-9 w-full rounded-full bg-secondary px-4 text-sm outline-none"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Catégorie</h3>
              <div className="mt-3 space-y-1.5">
                <button
                  onClick={() => setCat(undefined)}
                  className={`block w-full text-left text-sm ${!cat ? "font-semibold" : "text-ink-muted"}`}
                >
                  Toutes
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setCat(c.slug)}
                    className={`block w-full text-left text-sm ${cat === c.slug ? "font-semibold" : "text-ink-muted"}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Marque</h3>
              <div className="mt-3 space-y-1.5">
                <button onClick={() => setBrand(undefined)} className={`block text-left text-sm ${!brand ? "font-semibold" : "text-ink-muted"}`}>
                  Toutes
                </button>
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`block w-full text-left text-sm ${brand === b ? "font-semibold" : "text-ink-muted"}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Prix max</h3>
              <input
                type="range"
                min={5000}
                max={300000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full accent-foreground"
              />
              <div className="mt-1 text-xs text-ink-muted">Jusqu'à {formatFC(maxPrice)}</div>
            </div>
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-20 text-center text-ink-muted">
              Aucun produit ne correspond à ces filtres.{" "}
              <Link to="/boutique" className="underline">Réinitialiser</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
