import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Connexion administrateur — Minimoys Service" },
      {
        name: "description",
        content:
          "Espace réservé à l'équipe Minimoys Service pour gérer le catalogue de produits de la boutique.",
      },
      { property: "og:title", content: "Connexion administrateur — Minimoys Service" },
      {
        property: "og:description",
        content: "Accès sécurisé à l'administration du catalogue Minimoys Service.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connexion réussie.");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Compte créé. Vous pouvez maintenant vous connecter.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-16">
      <form className="w-full max-w-md rounded-2xl border border-border p-8" onSubmit={onSubmit}>
        <h1 className="font-display text-3xl">
          {mode === "signin" ? "Connexion admin" : "Créer un compte admin"}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">Espace réservé à l'équipe Minimoys Service.</p>
        <div className="mt-6 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="Email"
            className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6}
            placeholder="Mot de passe"
            className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 h-11 w-full rounded-full bg-primary text-sm font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-50"
        >
          {loading ? "Patientez…" : mode === "signin" ? "Se connecter" : "Créer le compte"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-sm text-ink-muted underline"
        >
          {mode === "signin" ? "Créer un compte" : "J'ai déjà un compte"}
        </button>
      </form>
    </div>
  );
}
