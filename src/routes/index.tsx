import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Award, MessageCircle, Sparkles } from "lucide-react";
import { categories, products } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const popular = products.slice(0, 8);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-surface">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] uppercase tracking-widest text-ink-muted">
              <Sparkles className="h-3 w-3" />
              Vêtements · Chaussures · Tech · Accessoires
            </div>
            <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
              Tout ce qu'il vous <br /> faut, au meilleur <br /> prix.
            </h1>
            <p className="mt-6 max-w-lg text-base text-ink-muted md:text-lg">
              Commandez facilement partout en RDC avec un service rapide et sécurisé.
              Sélection premium, livraison à domicile, paiement à la livraison.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/boutique"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition hover:opacity-90"
              >
                Découvrir la boutique <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider transition hover:bg-primary hover:text-primary-foreground"
              >
                Voir les catégories
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-ink-muted">
              <div><b className="text-foreground">+2 500</b> clients en RDC</div>
              <div className="h-4 w-px bg-border" />
              <div><b className="text-foreground">4.8/5</b> avis clients</div>
              <div className="h-4 w-px bg-border" />
              <div><b className="text-foreground">24h</b> service WhatsApp</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-8 -top-8 hidden font-display text-[10rem] leading-none text-foreground/5 md:block">
              MS
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-background shadow-2xl shadow-black/10">
              <img
                src={hero}
                alt="Sélection Minimoys Service"
                width={1600}
                height={1200}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* USP */}
      <section className="border-y border-border bg-background">
        <div className="container-page grid gap-6 py-10 md:grid-cols-4">
          {[
            { icon: Truck, title: "Livraison partout en RDC", desc: "Kinshasa, Lubumbashi, Goma…" },
            { icon: ShieldCheck, title: "Paiement sécurisé", desc: "Cash à la livraison ou Mobile Money" },
            { icon: Award, title: "Produits de qualité", desc: "Sélection premium vérifiée" },
            { icon: MessageCircle, title: "Service client WhatsApp", desc: "Réponse rapide, 7j/7" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold uppercase tracking-wider">{f.title}</div>
                <div className="mt-0.5 text-sm text-ink-muted">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-page py-16 md:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-ink-muted">Explorer</div>
            <h2 className="mt-2 font-display text-3xl md:text-5xl">Nos catégories</h2>
          </div>
          <Link to="/categories" className="hidden text-sm underline underline-offset-4 md:inline-flex">
            Voir toutes les catégories
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {categories.slice(0, 8).map((c, i) => (
            <Link
              key={c.slug}
              to="/boutique"
              search={{ cat: c.slug }}
              className={`group relative overflow-hidden rounded-2xl bg-secondary ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  i === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-square"
                }`}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white md:p-5">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] opacity-80">Catégorie</div>
                  <div className="mt-0.5 font-display text-xl md:text-2xl">{c.name}</div>
                </div>
                <ArrowRight className="h-5 w-5 -translate-x-1 transition group-hover:translate-x-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR */}
      <section className="container-page pb-16 md:pb-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-ink-muted">Sélection</div>
            <h2 className="mt-2 font-display text-3xl md:text-5xl">Produits populaires</h2>
          </div>
          <Link to="/boutique" className="hidden text-sm underline underline-offset-4 md:inline-flex">
            Voir toute la boutique
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-primary-foreground md:px-16 md:py-24">
          <div className="absolute inset-y-0 right-0 hidden font-display text-[16rem] leading-none text-primary-foreground/5 md:block">
            MS
          </div>
          <div className="relative max-w-2xl">
            <div className="text-xs uppercase tracking-[0.3em] text-primary-foreground/60">
              Pourquoi Minimoys Service
            </div>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">
              Une boutique fiable, pensée pour la RDC.
            </h2>
            <p className="mt-5 max-w-lg text-primary-foreground/70">
              Nous sélectionnons chaque produit, gérons la livraison partout dans le pays et
              restons joignables via WhatsApp. Commandez en toute confiance.
            </p>
            <Link
              to="/boutique"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold uppercase tracking-wider text-foreground transition hover:opacity-90"
            >
              Commencer mes achats <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
