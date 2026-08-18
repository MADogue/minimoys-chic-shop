import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminNav } from "@/components/admin/AdminNav";
import { getDashboardStats } from "@/lib/dashboard.functions";
import { formatFC } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Tableau de bord — Minimoys Service" },
      {
        name: "description",
        content: "Suivi de l'activité réelle de la boutique : produits, commandes, chiffre d'affaires et vues.",
      },
      { property: "og:title", content: "Tableau de bord — Minimoys Service" },
      { property: "og:description", content: "Suivi de l'activité réelle de la boutique Minimoys Service." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border p-5">
      <div className="text-xs uppercase tracking-wider text-ink-muted">{label}</div>
      <div className="mt-2 font-display text-2xl md:text-3xl">{value}</div>
    </div>
  );
}

function DashboardPage() {
  const statsFn = useServerFn(getDashboardStats);
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => statsFn({}),
  });

  return (
    <div className="container-page py-10 md:py-16">
      <h1 className="font-display text-3xl md:text-5xl">Tableau de bord</h1>
      <p className="mt-2 text-sm text-ink-muted">Activité réelle de la boutique.</p>
      <div className="mt-6">
        <AdminNav />
      </div>

      {isLoading && <p className="mt-10 text-sm text-ink-muted">Chargement…</p>}
      {error && <p className="mt-10 text-sm text-ink-muted">Accès refusé ou données indisponibles.</p>}

      {data && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card label="Produits" value={String(data.totalProducts)} />
          <Card label="Produits disponibles" value={String(data.availableProducts)} />
          <Card label="Commandes" value={String(data.totalOrders)} />
          <Card label="Commandes en attente" value={String(data.pendingOrders)} />
          <Card label="Chiffre d'affaires" value={formatFC(data.revenue)} />
          <Card label="Vues produits" value={String(data.totalViews)} />
          <Card label="Clients" value="Non suivi" />
        </div>
      )}
    </div>
  );
}
