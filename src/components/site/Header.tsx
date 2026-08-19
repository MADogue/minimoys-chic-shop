import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { categories } from "@/lib/data";
import logoAsset from "@/assets/eventaya-logo.png.asset.json";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/boutique", label: "Boutique" },
  { to: "/categories", label: "Catégories" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { count, favorites } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      {/* top strip */}
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <span>Livraison partout en RDC · Paiement à la livraison disponible</span>
          <span>Service client via WhatsApp · 7j/7</span>
        </div>
      </div>

      <div className="container-page flex h-16 items-center gap-4 md:h-20">
        <button
          className="md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={logoAsset.url} alt="Eventaya Service" className="h-10 w-10 object-contain" width={40} height={40} />
          <span className="hidden font-display text-lg font-semibold tracking-wide sm:block">
            EVENTAYA <span className="text-ink-muted">SERVICE</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-7 text-sm font-medium lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <form
          className="ml-auto hidden max-w-md flex-1 md:block"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) window.location.href = `/boutique?q=${encodeURIComponent(q)}`;
          }}
        >
          <label className="flex h-10 items-center gap-2 rounded-full bg-secondary px-4">
            <Search className="h-4 w-4 text-ink-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un produit, une catégorie..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-4">
          <Link to="/favoris" aria-label="Favoris" className="relative hidden rounded-full p-2 hover:bg-secondary sm:inline-flex">
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {favorites.length}
              </span>
            )}
          </Link>
          <Link to="/connexion" aria-label="Compte" className="rounded-full p-2 hover:bg-secondary">
            <User className="h-5 w-5" />
          </Link>
          <Link to="/panier" aria-label="Panier" className="relative rounded-full p-2 hover:bg-secondary">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* mobile search */}
      <div className="container-page pb-3 md:hidden">
        <label className="flex h-10 items-center gap-2 rounded-full bg-secondary px-4">
          <Search className="h-4 w-4 text-ink-muted" />
          <input
            placeholder="Rechercher..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted"
          />
        </label>
      </div>

      {/* categories bar */}
      <div className="hidden border-t border-border bg-background lg:block">
        <div className="container-page flex h-11 items-center gap-6 overflow-x-auto text-xs uppercase tracking-widest">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/boutique"
              search={{ cat: c.slug }}
              className="whitespace-nowrap text-ink-muted transition-colors hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-page flex flex-col py-4 text-base">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="py-2"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-2 text-xs uppercase tracking-widest text-ink-muted">
              Catégories
            </div>
            {categories.map((c) => (
              <Link key={c.slug} to="/boutique" search={{ cat: c.slug }} className="py-1.5 text-sm" onClick={() => setOpen(false)}>
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
