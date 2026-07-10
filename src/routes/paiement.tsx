import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { formatFC } from "@/lib/data";
import { Check, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/paiement")({ component: Paiement });

function Paiement() {
  const { items, subtotal, clear } = useCart();
  const [method, setMethod] = useState<"cod" | "mobile">("cod");
  const [done, setDone] = useState(false);

  const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 3000;
  const total = subtotal + shipping;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    clear();
  };

  if (done)
    return (
      <div className="container-page py-24 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl md:text-5xl">Commande confirmée</h1>
        <p className="mt-3 text-ink-muted">
          Nous vous contactons via WhatsApp pour finaliser la livraison.
        </p>
        <Link to="/boutique" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
          Continuer les achats
        </Link>
      </div>
    );

  return (
    <div className="container-page py-10 md:py-16">
      <h1 className="font-display text-3xl md:text-5xl">Paiement</h1>
      <form onSubmit={submit} className="mt-10 grid gap-10 md:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider">Coordonnées</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input label="Nom complet" required />
              <Input label="Téléphone (WhatsApp)" required type="tel" />
              <Input label="Email" type="email" className="md:col-span-2" />
              <Input label="Ville" required />
              <Input label="Commune / Quartier" required />
              <Input label="Adresse détaillée" required className="md:col-span-2" />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider">Méthode de paiement</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className={`cursor-pointer rounded-2xl border p-5 ${method === "cod" ? "border-primary" : "border-border"}`}>
                <input type="radio" name="m" className="sr-only" checked={method === "cod"} onChange={() => setMethod("cod")} />
                <div className="font-semibold">Paiement à la livraison</div>
                <div className="mt-1 text-sm text-ink-muted">Payez en espèces à la réception.</div>
              </label>
              <label className={`cursor-pointer rounded-2xl border p-5 ${method === "mobile" ? "border-primary" : "border-border"}`}>
                <input type="radio" name="m" className="sr-only" checked={method === "mobile"} onChange={() => setMethod("mobile")} />
                <div className="font-semibold">Mobile Money <span className="text-xs text-ink-muted">(bientôt)</span></div>
                <div className="mt-1 text-sm text-ink-muted">Airtel Money, M-Pesa, Orange Money.</div>
              </label>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Votre commande</h2>
          <div className="mt-4 space-y-3 text-sm">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between gap-3">
                <span className="text-ink-muted">{product.name} × {qty}</span>
                <span>{formatFC(product.price * qty)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between"><span className="text-ink-muted">Livraison</span><span>{shipping === 0 ? "Offerte" : formatFC(shipping)}</span></div>
            <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatFC(total)}</span></div>
          </div>
          <button type="submit" disabled={items.length === 0} className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-50">
            Confirmer la commande
          </button>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
            <ShieldCheck className="h-3.5 w-3.5" /> Paiement 100% sécurisé
          </div>
        </aside>
      </form>
    </div>
  );
}

function Input({
  label,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs text-ink-muted">{label}</span>
      <input {...rest} className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground" />
    </label>
  );
}
