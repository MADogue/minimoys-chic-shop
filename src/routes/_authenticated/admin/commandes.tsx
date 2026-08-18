import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AdminNav } from "@/components/admin/AdminNav";
import { listOrders, updateOrderStatus } from "@/lib/dashboard.functions";
import { formatFC } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/admin/commandes")({
  component: OrdersPage,
  head: () => ({
    meta: [
      { title: "Commandes — Minimoys Service" },
      { name: "description", content: "Suivi et mise à jour du statut des commandes de la boutique." },
      { property: "og:title", content: "Commandes — Minimoys Service" },
      { property: "og:description", content: "Suivi des commandes de la boutique Minimoys Service." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const STATUSES = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
] as const;

type Status = (typeof STATUSES)[number]["value"];

function OrdersPage() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(listOrders);
  const statusFn = useServerFn(updateOrderStatus);

  const ordersQuery = useQuery({ queryKey: ["admin-orders"], queryFn: () => listFn({}) });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: Status }) => statusFn({ data: vars }),
    onSuccess: () => {
      toast.success("Statut mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (e: Error) => toast.error(e.message || "Mise à jour impossible."),
  });

  const rows = ordersQuery.data ?? [];

  return (
    <div className="container-page py-10 md:py-16">
      <h1 className="font-display text-3xl md:text-5xl">Commandes</h1>
      <div className="mt-6">
        <AdminNav />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="p-4">N°</th>
              <th className="p-4">Date</th>
              <th className="p-4">Client</th>
              <th className="p-4">Produits</th>
              <th className="p-4">Total</th>
              <th className="p-4">Statut</th>
            </tr>
          </thead>
          <tbody>
            {ordersQuery.isLoading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-ink-muted">
                  Chargement…
                </td>
              </tr>
            )}
            {!ordersQuery.isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-ink-muted">
                  Aucune commande.
                </td>
              </tr>
            )}
            {rows.map((o) => (
              <tr key={o.id} className="border-t border-border align-top">
                <td className="p-4 font-medium">{o.reference}</td>
                <td className="p-4">{new Date(o.created_at).toLocaleString("fr-FR")}</td>
                <td className="p-4">
                  <div>{o.customer_name || "—"}</div>
                  <div className="text-xs text-ink-muted">{o.customer_contact || "—"}</div>
                </td>
                <td className="p-4">
                  {(o.order_items ?? []).map((i) => (
                    <div key={i.id} className="text-xs">
                      {i.product_name} × {i.quantity} — {formatFC(Number(i.unit_price))}
                    </div>
                  ))}
                </td>
                <td className="p-4">{formatFC(Number(o.total))}</td>
                <td className="p-4">
                  <select
                    className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
                    value={o.status}
                    disabled={statusMutation.isPending}
                    onChange={(e) =>
                      statusMutation.mutate({ id: o.id, status: e.target.value as Status })
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
