import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/categories")({
  component: Categories,
  head: () => ({
    meta: [
      { title: "Catégories — Eventaya Service" },
      { name: "description", content: "Toutes les catégories : vêtements, chaussures, téléphones, accessoires, sacs, montres, électronique." },
    ],
  }),
});

function Categories() {
  return (
    <div className="container-page py-12 md:py-20">
      <div className="text-xs uppercase tracking-[0.3em] text-ink-muted">Explorer</div>
      <h1 className="mt-2 font-display text-4xl md:text-6xl">Catégories</h1>
      <p className="mt-3 max-w-xl text-ink-muted">
        Une sélection soignée dans chaque univers. Choisissez la catégorie qui vous correspond.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/boutique"
            search={{ cat: c.slug }}
            className="group relative overflow-hidden rounded-2xl bg-secondary"
          >
            <img src={c.image} alt={c.name} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
              <div className="font-display text-xl">{c.name}</div>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
