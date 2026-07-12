import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/connexion")({ component: Connexion });

function Connexion() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.email.trim() || !form.password.trim()) {
      setError("Merci de saisir votre email et mot de passe.");
      return;
    }
    const user = { name: form.email.split("@")[0], email: form.email, phone: "" };
    localStorage.setItem("ms-user-v1", JSON.stringify(user));
    navigate({ to: "/mon-compte" });
  };

  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-16">
      <form className="w-full max-w-md rounded-2xl border border-border p-8" onSubmit={onSubmit}>
        <h1 className="font-display text-3xl">Connexion</h1>
        <p className="mt-1 text-sm text-ink-muted">Accédez à votre compte Minimoys Service.</p>
        <div className="mt-6 space-y-3">
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email" className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground" />
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Mot de passe" className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground" />
        </div>
        {error && <p className="mt-3 text-sm text-promo">{error}</p>}
        <button type="submit" className="mt-4 h-11 w-full rounded-full bg-primary text-sm font-semibold uppercase tracking-wider text-primary-foreground">
          Se connecter
        </button>
        <p className="mt-4 text-center text-sm text-ink-muted">
          Pas encore de compte ? <Link to="/inscription" className="text-foreground underline">Créer un compte</Link>
        </p>
      </form>
    </div>
  );
}
