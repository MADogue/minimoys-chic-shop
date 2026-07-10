import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";

export const Route = createFileRoute("/mes-commandes")({ component: Commandes });

function Commandes() {
  return (
    <div className="container-page py-10 md:py-16">
      <h1 className="font-display text-3xl md:text-5xl">Mes commandes</h1>
      <div className="mt-10 rounded-2xl border border-dashed border-border py-20 text-center">
        <Package className="mx-auto h-8 w-8 text-ink-muted" />
        <p className="mt-4 text-ink-muted">Aucune commande pour le moment.</p>
        <Link to="/boutique" className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
          Commencer mes achats
        </Link>
      </div>
    </div>
  );
}
