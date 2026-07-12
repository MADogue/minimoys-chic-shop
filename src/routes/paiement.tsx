import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-store";
import { formatFC } from "@/lib/data";
import { whatsappOrderCart } from "@/lib/whatsapp";
import { ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/paiement")({ component: Paiement });

function Paiement() {
  const { items, subtotal } = useCart();
  const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 3000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl md:text-5xl">Votre panier est vide</h1>
        <Link to="/boutique" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground">
          Aller à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-16">
      <h1 className="font-display text-3xl md:text-5xl">Finaliser la commande</h1>
      <p className="mt-2 text-ink-muted">
        Un clic suffit : envoyez votre commande sur WhatsApp, nous vous confirmons la livraison en quelques minutes.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="font-semibold">Commande via WhatsApp</div>
              <div className="text-sm text-ink-muted">+243 860 046 210</div>
            </div>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-ink-muted">
            <li>1. Cliquez sur « Envoyer ma commande »</li>
            <li>2. Confirmez avec votre nom et adresse dans WhatsApp</li>
            <li>3. Nous préparons et livrons — paiement à la livraison</li>
          </ul>
          <a
            href={whatsappOrderCart(items, total)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
          >
            Envoyer ma commande <ArrowRight className="h-4 w-4" />
          </a>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
            <ShieldCheck className="h-3.5 w-3.5" /> Aucun paiement en ligne requis
          </div>
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
        </aside>
      </div>
    </div>
  );
}
