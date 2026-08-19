import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Truck, ShieldCheck, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/a-propos")({
  component: About,
  head: () => ({
    meta: [
      { title: "À propos — Eventaya Service" },
      { name: "description", content: "Eventaya Service, boutique en ligne polyvalente en RDC : vêtements, chaussures, téléphones, accessoires livrés partout au pays." },
    ],
  }),
});

function About() {
  return (
    <div>
      <section className="bg-surface">
        <div className="container-page py-16 md:py-28">
          <div className="text-xs uppercase tracking-[0.3em] text-ink-muted">À propos</div>
          <h1 className="mt-3 max-w-3xl font-display text-4xl md:text-7xl">
            Une boutique en ligne pensée pour la RDC.
          </h1>
          <p className="mt-6 max-w-2xl text-ink-muted md:text-lg">
            Eventaya Service est un groupe d'achat en ligne sécurisé, présent partout en République
            Démocratique du Congo. Nous rassemblons vêtements, chaussures, téléphones et
            accessoires du quotidien à des prix abordables, avec une livraison possible dans tout le pays.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h2 className="font-display text-3xl md:text-5xl">Notre mission</h2>
          <p className="mt-5 text-ink-muted">
            Offrir une expérience d'achat en ligne simple, sécurisée et agréable pour permettre à
            chaque Congolais de trouver ce dont il a besoin, sans se déplacer, en toute confiance.
          </p>
          <p className="mt-4 text-ink-muted">
            Nous sélectionnons rigoureusement chaque produit, négocions les meilleurs prix, et
            assurons un service client réactif via WhatsApp.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Truck, title: "Livraison partout", desc: "Dans toute la RDC" },
            { icon: ShieldCheck, title: "Achat sécurisé", desc: "Paiement 100% sécurisé" },
            { icon: Award, title: "Qualité vérifiée", desc: "Produits sélectionnés" },
            { icon: MessageCircle, title: "Service 7j/7", desc: "Via WhatsApp" },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl border border-border p-6">
              <v.icon className="h-6 w-6" />
              <div className="mt-3 font-semibold">{v.title}</div>
              <div className="mt-1 text-sm text-ink-muted">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="rounded-3xl bg-primary p-10 text-primary-foreground md:p-16">
          <h2 className="font-display text-3xl md:text-5xl">Prêt à découvrir la boutique ?</h2>
          <p className="mt-4 max-w-xl text-primary-foreground/70">
            Style. Qualité. Confiance. Commencez vos achats dès maintenant.
          </p>
          <Link to="/boutique" className="mt-8 inline-flex rounded-full bg-background px-6 py-3 text-sm font-semibold uppercase tracking-wider text-foreground">
            Aller à la boutique
          </Link>
        </div>
      </section>
    </div>
  );
}
