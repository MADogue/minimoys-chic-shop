import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-store";
import { formatFC } from "@/lib/data";
import { whatsappOrderFull } from "@/lib/whatsapp";
import { useRecordOrder, type CustomerInfo } from "@/lib/track";
import { ShieldCheck, ArrowRight, Loader2, Pencil } from "lucide-react";

export const Route = createFileRoute("/paiement")({
  component: Paiement,
  head: () => ({
    meta: [
      { title: "Commander — Eventaya Service" },
      {
        name: "description",
        content:
          "Renseignez votre nom, votre numéro WhatsApp, votre commune et votre quartier pour finaliser votre commande Eventaya.",
      },
      { property: "og:title", content: "Commander — Eventaya Service" },
      {
        property: "og:description",
        content: "Commande rapide en 4 informations, paiement à la livraison.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const empty: CustomerInfo = { name: "", phone: "", commune: "", quartier: "" };

function Paiement() {
  const { items, subtotal, clear } = useCart();
  const recordOrder = useRecordOrder();
  const [customer, setCustomer] = useState<CustomerInfo>(empty);
  const [step, setStep] = useState<"form" | "recap">("form");
  const [loading, setLoading] = useState(false);

  const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 3000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl md:text-5xl">Votre panier est vide</h1>
        <Link
          to="/boutique"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
        >
          Aller à la boutique
        </Link>
      </div>
    );
  }

  const set = (k: keyof CustomerInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomer((c) => ({ ...c, [k]: e.target.value }));

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const c = {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      commune: customer.commune.trim(),
      quartier: customer.quartier.trim(),
    };
    if (c.name.length < 2) return toast.error("Veuillez indiquer votre nom.");
    if (c.phone.replace(/\D/g, "").length < 8)
      return toast.error("Veuillez indiquer un numéro WhatsApp valide.");
    if (c.commune.length < 2) return toast.error("Veuillez indiquer votre commune.");
    if (c.quartier.length < 2) return toast.error("Veuillez indiquer votre quartier.");
    setCustomer(c);
    setStep("recap");
  };

  const confirm = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await recordOrder(items, total, customer);
      if (!res?.ok) throw new Error("save-failed");
      const url = whatsappOrderFull(
        customer,
        items,
        total,
        "reference" in res ? (res.reference as string) : undefined,
      );
      clear();
      window.location.href = url;
    } catch {
      toast.error("Enregistrement impossible. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const field = "mt-1 h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none focus:border-foreground";

  return (
    <div className="container-page py-10 md:py-16">
      <h1 className="font-display text-3xl md:text-5xl">Finaliser la commande</h1>
      <p className="mt-2 text-ink-muted">
        4 informations suffisent. Paiement à la livraison, confirmation sur WhatsApp.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border p-5 md:p-8">
          {step === "form" ? (
            <form onSubmit={submitForm} noValidate>
              <h2 className="text-sm font-semibold uppercase tracking-wider">Vos informations</h2>
              <div className="mt-5 space-y-4">
                <label className="block text-sm">
                  Nom
                  <input value={customer.name} onChange={set("name")} maxLength={80} autoComplete="name" className={field} placeholder="Votre nom" />
                </label>
                <label className="block text-sm">
                  Numéro WhatsApp
                  <input value={customer.phone} onChange={set("phone")} maxLength={30} inputMode="tel" autoComplete="tel" className={field} placeholder="+243 ..." />
                </label>
                <label className="block text-sm">
                  Commune
                  <input value={customer.commune} onChange={set("commune")} maxLength={80} className={field} placeholder="Ex : Ngaliema" />
                </label>
                <label className="block text-sm">
                  Quartier
                  <input value={customer.quartier} onChange={set("quartier")} maxLength={80} className={field} placeholder="Ex : Binza" />
                </label>
              </div>
              <button
                type="submit"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
              >
                Continuer <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider">Récapitulatif</h2>
                <button
                  onClick={() => setStep("form")}
                  className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" /> Modifier
                </button>
              </div>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between gap-3"><dt className="text-ink-muted">Nom</dt><dd>{customer.name}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-ink-muted">WhatsApp</dt><dd>{customer.phone}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-ink-muted">Commune</dt><dd>{customer.commune}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-ink-muted">Quartier</dt><dd>{customer.quartier}</dd></div>
              </dl>
              <div className="mt-6 border-t border-border pt-4 space-y-2 text-sm">
                {items.map(({ product, qty }) => (
                  <div key={product.id} className="flex justify-between gap-3">
                    <span className="text-ink-muted">{product.name} × {qty}</span>
                    <span>{formatFC(product.price * qty)}</span>
                  </div>
                ))}
                <div className="flex justify-between"><span className="text-ink-muted">Livraison</span><span>{shipping === 0 ? "Offerte" : formatFC(shipping)}</span></div>
                <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold"><span>Total</span><span>{formatFC(total)}</span></div>
              </div>
              <button
                onClick={confirm}
                disabled={loading}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-60"
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement…</> : <>Confirmer la commande <ArrowRight className="h-4 w-4" /></>}
              </button>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
                <ShieldCheck className="h-3.5 w-3.5" /> Aucun paiement en ligne requis
              </div>
            </div>
          )}
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
