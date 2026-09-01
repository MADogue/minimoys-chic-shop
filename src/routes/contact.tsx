import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Eventaya Service" },
      { name: "description", content: "Contactez Eventaya Service via WhatsApp, téléphone ou email. Service client 7j/7 en RDC." },
    ],
  }),
});

function Contact() {
  return (
    <div className="container-page py-12 md:py-20">
      <div className="text-xs uppercase tracking-[0.3em] text-ink-muted">Nous contacter</div>
      <h1 className="mt-2 font-display text-4xl md:text-6xl">On vous répond vite.</h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        Une question sur un produit, une commande ou une livraison ? Notre équipe est à votre écoute
        7 jours sur 7 via WhatsApp.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border p-8">
          <h2 className="font-display text-2xl">Coordonnées</h2>
          <ul className="mt-6 space-y-4 text-sm">
<li className="flex items-center gap-3"><MessageCircle className="h-5 w-5" /> WhatsApp : +243 855 915 955</li>
            <li className="flex items-center gap-3"><Phone className="h-5 w-5" /> Appel : +243 855 915 955</li>
            <li className="flex items-center gap-3"><Mail className="h-5 w-5" /> contact@eventaya.cd</li>
            <li className="flex items-center gap-3"><MapPin className="h-5 w-5" /> Kinshasa, RDC</li>
          </ul>
        </div>
        <form className="rounded-2xl border border-border p-8" onSubmit={(e) => e.preventDefault()}>
          <h2 className="font-display text-2xl">Envoyer un message</h2>
          <div className="mt-4 space-y-3">
            <input placeholder="Nom" className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground" />
            <input placeholder="Email ou téléphone" className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground" />
            <textarea placeholder="Votre message" rows={5} className="w-full rounded-lg border border-border bg-background p-4 text-sm outline-none focus:border-foreground" />
          </div>
          <button className="mt-4 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
