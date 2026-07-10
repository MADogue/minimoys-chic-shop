import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/connexion")({ component: Connexion });

function Connexion() {
  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-16">
      <form className="w-full max-w-md rounded-2xl border border-border p-8" onSubmit={(e) => e.preventDefault()}>
        <h1 className="font-display text-3xl">Connexion</h1>
        <p className="mt-1 text-sm text-ink-muted">Accédez à votre compte Minimoys Service.</p>
        <div className="mt-6 space-y-3">
          <input type="email" placeholder="Email" className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground" />
          <input type="password" placeholder="Mot de passe" className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground" />
        </div>
        <button className="mt-4 h-11 w-full rounded-full bg-primary text-sm font-semibold uppercase tracking-wider text-primary-foreground">
          Se connecter
        </button>
        <p className="mt-4 text-center text-sm text-ink-muted">
          Pas encore de compte ? <Link to="/inscription" className="text-foreground underline">Créer un compte</Link>
        </p>
      </form>
    </div>
  );
}
