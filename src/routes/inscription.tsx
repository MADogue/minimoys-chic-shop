import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/inscription")({ component: Inscription });

function Inscription() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    try {
      const user = { name: form.name, phone: form.phone, email: form.email };
      localStorage.setItem("ms-user-v1", JSON.stringify(user));
      navigate({ to: "/mon-compte" });
    } catch {
      setError("Une erreur est survenue. Réessayez.");
      setLoading(false);
    }
  };

  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-16">
      <form className="w-full max-w-md rounded-2xl border border-border p-8" onSubmit={onSubmit}>
        <h1 className="font-display text-3xl">Créer un compte</h1>
        <p className="mt-1 text-sm text-ink-muted">Rejoignez Minimoys Service en 30 secondes.</p>
        <div className="mt-6 space-y-3">
          <input value={form.name} onChange={update("name")} placeholder="Nom complet" className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground" />
          <input value={form.phone} onChange={update("phone")} type="tel" placeholder="Téléphone (WhatsApp)" className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground" />
          <input value={form.email} onChange={update("email")} type="email" placeholder="Email" className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground" />
          <input value={form.password} onChange={update("password")} type="password" placeholder="Mot de passe (6 caractères min.)" className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground" />
        </div>
        {error && <p className="mt-3 text-sm text-promo">{error}</p>}
        <button type="submit" disabled={loading} className="mt-4 h-11 w-full rounded-full bg-primary text-sm font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-60">
          {loading ? "Création..." : "Créer mon compte"}
        </button>
        <p className="mt-4 text-center text-sm text-ink-muted">
          Déjà inscrit ? <Link to="/connexion" className="text-foreground underline">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}
