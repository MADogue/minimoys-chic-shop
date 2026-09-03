import { createFileRoute, redirect } from "@tanstack/react-router";

// L'ancien formulaire de connexion de /connexion écrivait une fausse session
// dans localStorage sans créer de session Supabase, ce qui rendait la
// connexion admin intermittente. Cette page redirige vers /auth, le vrai
// formulaire de connexion Supabase.
export const Route = createFileRoute("/connexion")({
  beforeLoad: () => {
    throw redirect({ to: "/auth" });
  },
});