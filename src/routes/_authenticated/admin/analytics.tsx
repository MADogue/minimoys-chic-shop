import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { getProductAnalytics } from "@/lib/dashboard.functions";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AnalyticsPage,
  head: () => ({
    meta: [
      { title: "Analytics produits — Eventaya Service" },
      { name: "description", content: "Vues, commandes, quantités vendues et stock par produit." },
      { property: "og:title", content: "Analytics produits — Eventaya Service" },
      { property: "og:description", content: "Performances réelles des produits de la boutique." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AnalyticsPage() {
  const fn = useServerFn(getProductAnalytics);
  const { data, isLoading } = useQuery({ queryKey: ["product-analytics"], queryFn: () => fn({}) });

  const rows = useMemo(() => data ?? [], [data]);
  const topViewed = useMemo(() => [...rows].sort((a, b) => b.views - a.views).slice(0, 5), [rows]);
  const topOrdered = useMemo(() => [...rows].sort((a, b) => b.sold - a.sold).slice(0, 5), [rows]);

  return (
    <div className="container-page py-10 md:py-16">
      <h1 className="font-display text-3xl md:text-5xl">Analytics</h1>
      <div className="mt-6">
        <AdminNav />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border p-5">
          <h2 className="font-display text-xl">Les plus consultés</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {topViewed.map((p) => (
              <li key={p.id} className="flex justify-between gap-4">
                <span>{p.name}</span>
                <span className="text-ink-muted">{p.views} vues</span>
              </li>
            ))}
            {topViewed.length === 0 && <li className="text-ink-muted">Aucune donnée.</li>}
          </ul>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <h2 className="font-display text-xl">Les plus commandés</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {topOrdered.map((p) => (
              <li key={p.id} className="flex justify-between gap-4">
                <span>{p.name}</span>
                <span className="text-ink-muted">{p.sold} vendus</span>
              </li>
            ))}
            {topOrdered.length === 0 && <li className="text-ink-muted">Aucune donnée.</li>}
          </ul>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="p-4">Produit</th>
              <th className="p-4">Vues</th>
              <th className="p-4">Commandes</th>
              <th className="p-4">Quantité vendue</th>
              <th className="p-4">Stock</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-muted">
                  Chargement…
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-muted">
                  Aucune donnée.
                </td>
              </tr>
            )}
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.views}</td>
                <td className="p-4">{p.orders}</td>
                <td className="p-4">{p.sold}</td>
                <td className="p-4">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
