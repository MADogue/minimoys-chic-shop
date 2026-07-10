import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Heart, MapPin, LogOut, User } from "lucide-react";

export const Route = createFileRoute("/mon-compte")({ component: Compte });

function Compte() {
  return (
    <div className="container-page py-10 md:py-16">
      <h1 className="font-display text-3xl md:text-5xl">Mon compte</h1>
      <p className="mt-2 text-sm text-ink-muted">Gérez vos informations, commandes et favoris.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {[
          { to: "/mes-commandes", icon: Package, label: "Mes commandes" },
          { to: "/favoris", icon: Heart, label: "Favoris" },
          { to: "/mon-compte", icon: MapPin, label: "Adresses" },
          { to: "/mon-compte", icon: User, label: "Profil" },
        ].map((c) => (
          <Link key={c.label} to={c.to} className="rounded-2xl border border-border p-6 transition hover:border-foreground">
            <c.icon className="h-6 w-6" />
            <div className="mt-4 font-semibold">{c.label}</div>
          </Link>
        ))}
      </div>
      <button className="mt-8 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-foreground">
        <LogOut className="h-4 w-4" /> Se déconnecter
      </button>
    </div>
  );
}
