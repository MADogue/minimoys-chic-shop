import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { formatFC } from "@/lib/data";
import { productQueryOptions, productsQueryOptions } from "@/lib/products";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCart } from "@/lib/cart-store";
import { Star, ShoppingBag, Heart, Truck, ShieldCheck, RotateCcw, Check } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { whatsappOrderSingle } from "@/lib/whatsapp";
import { useProductView, useRecordOrder } from "@/lib/track";

export const Route = createFileRoute("/produit/$id")({
  loader: async ({ params, context }) => {
    const p = await context.queryClient.ensureQueryData(productQueryOptions(params.id));
    if (!p) throw notFound();
    context.queryClient.ensureQueryData(productsQueryOptions);
    return p;
  },
  component: ProductPage,
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.name} — Minimoys Service` },
            { name: "description", content: loaderData.description },
            { property: "og:title", content: `${loaderData.name} — Minimoys Service` },
            { property: "og:description", content: loaderData.description },
            { property: "og:image", content: loaderData.image },
          ],
        }
      : {},
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">Produit introuvable</h1>
      <Link to="/boutique" className="mt-4 inline-block underline">Retour à la boutique</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">Erreur de chargement</h1>
      <Link to="/boutique" className="mt-4 inline-block underline">Retour à la boutique</Link>
    </div>
  ),
});

const SIZES = ["S", "M", "L", "XL"];

function ProductPage() {
  const product = Route.useLoaderData();
  const { data: products } = useSuspenseQuery(productsQueryOptions);
  const { add, toggleFav, isFav } = useCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);
  useProductView(product.id);
  const recordOrder = useRecordOrder();

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="container-page py-10 md:py-16">
      <nav className="text-xs text-ink-muted">
        <Link to="/">Accueil</Link> / <Link to="/boutique">Boutique</Link> /{" "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="overflow-hidden rounded-2xl bg-secondary">
          <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-widest text-ink-muted">{product.brand}</div>
          <h1 className="mt-2 font-display text-3xl md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-foreground">{product.rating.toFixed(1)}</span>
            <span>· {product.reviews} avis</span>
            <span className="mx-2">·</span>
            <span>{product.stock > 0 ? `${product.stock} en stock` : "Rupture"}</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl">{formatFC(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-ink-muted line-through">{formatFC(product.oldPrice)}</span>
            )}
          </div>

          <p className="mt-6 text-ink-muted">{product.description}</p>

          {["vetements", "chaussures"].includes(product.category) && (
            <div className="mt-8">
              <div className="text-xs font-semibold uppercase tracking-wider">Taille</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-11 min-w-11 rounded-full border px-4 text-sm transition ${
                      size === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 items-center rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 text-lg">−</button>
                <span className="w-8 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-4 text-lg">+</button>
              </div>
              <a
                href={whatsappOrderSingle(product, qty, ["vetements", "chaussures"].includes(product.category) ? size : undefined)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordOrder([{ product, qty }], product.price * qty)}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition hover:opacity-90"
              >
                Commander sur WhatsApp
              </a>
              <button
                onClick={() => toggleFav(product.id)}
                aria-label="Favori"
                className="grid h-12 w-12 place-items-center rounded-full border border-border transition hover:border-foreground"
              >
                <Heart className={`h-5 w-5 ${isFav(product.id) ? "fill-primary text-primary" : ""}`} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-medium transition hover:border-foreground"
            >
              {added ? <><Check className="h-4 w-4" /> Ajouté au panier</> : <><ShoppingBag className="h-4 w-4" /> Ajouter au panier</>}
            </button>
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl bg-surface p-5 text-sm">
            <div className="flex items-center gap-3"><Truck className="h-4 w-4" /> Livraison partout en RDC</div>
            <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4" /> Paiement à la livraison disponible</div>
            <div className="flex items-center gap-3"><RotateCcw className="h-4 w-4" /> Retour sous 7 jours</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-2xl md:text-4xl">Vous pourriez aussi aimer</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
