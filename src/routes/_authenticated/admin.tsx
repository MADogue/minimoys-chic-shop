import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Minus, Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { categories } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import {
  adminListProducts,
  adjustStock,
  checkIsAdmin,
  deleteProduct,
  saveProduct,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Administration du catalogue — Minimoys Service" },
      {
        name: "description",
        content:
          "Ajoutez, modifiez, supprimez vos produits et gérez le stock de la boutique Minimoys Service.",
      },
      { property: "og:title", content: "Administration du catalogue — Minimoys Service" },
      {
        property: "og:description",
        content: "Gestion du catalogue et du stock de la boutique Minimoys Service.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type ProductPayload = {
  id?: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  brand: string;
  image: string;
  rating: number;
  review_count: number;
  stock: number;
  is_new: boolean;
};

type FormState = {
  id?: string;
  name: string;
  price: string;
  original_price: string;
  category: string;
  brand: string;
  image: string;
  rating: string;
  review_count: string;
  stock: string;
  is_new: boolean;
  description: string;
};

const emptyForm: FormState = {
  name: "",
  price: "",
  original_price: "",
  category: categories[0]?.slug ?? "",
  brand: "",
  image: "",
  rating: "0",
  review_count: "0",
  stock: "0",
  is_new: false,
  description: "",
};

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdminFn = useServerFn(checkIsAdmin);
  const listFn = useServerFn(adminListProducts);
  const saveFn = useServerFn(saveProduct);
  const deleteFn = useServerFn(deleteProduct);
  const stockFn = useServerFn(adjustStock);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [open, setOpen] = useState(false);

  const adminQuery = useQuery({ queryKey: ["is-admin"], queryFn: () => isAdminFn({}) });
  const productsQuery = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => listFn({}),
    enabled: adminQuery.data?.isAdmin === true,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const saveMutation = useMutation({
    mutationFn: (payload: ProductPayload) => saveFn({ data: payload }),
    onSuccess: () => {
      toast.success("Produit enregistré.");
      setOpen(false);
      setForm(emptyForm);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message || "Enregistrement impossible."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Produit supprimé.");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message || "Suppression impossible."),
  });

  const stockMutation = useMutation({
    mutationFn: (vars: { id: string; delta: number }) => stockFn({ data: vars }),
    onSuccess: () => refresh(),
    onError: (e: Error) => toast.error(e.message || "Stock non mis à jour."),
  });

  const rows = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (adminQuery.isLoading) {
    return <div className="container-page py-24 text-center text-ink-muted">Chargement…</div>;
  }

  if (!adminQuery.data?.isAdmin) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl">Accès réservé</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Votre compte n'a pas les droits d'administration du catalogue.
        </p>
        <button onClick={signOut} className="mt-6 text-sm underline">
          Se déconnecter
        </button>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category) {
      toast.error("Nom et catégorie sont obligatoires.");
      return;
    }
    saveMutation.mutate({
      ...(form.id ? { id: form.id } : {}),
      name: form.name.trim(),
      description: form.description,
      price: Number(form.price) || 0,
      original_price: form.original_price ? Number(form.original_price) : null,
      category: form.category,
      brand: form.brand,
      image: form.image,
      rating: Number(form.rating) || 0,
      review_count: Number(form.review_count) || 0,
      stock: Number(form.stock) || 0,
      is_new: form.is_new,
    });
  };

  const field =
    "h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-foreground";

  return (
    <div className="container-page py-10 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-5xl">Administration</h1>
          <p className="mt-2 text-sm text-ink-muted">Gérez vos produits et votre stock.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setForm(emptyForm);
              setOpen(true);
            }}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Ajouter un produit
          </button>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-8 rounded-2xl border border-border p-6">
          <h2 className="font-display text-xl">
            {form.id ? "Modifier le produit" : "Nouveau produit"}
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              className={field}
              placeholder="Nom"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className={field}
              placeholder="Prix (FC)"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              className={field}
              placeholder="Ancien prix (facultatif)"
              type="number"
              value={form.original_price}
              onChange={(e) => setForm({ ...form, original_price: e.target.value })}
            />
            <select
              className={field}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              className={field}
              placeholder="Marque"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
            <div className="md:col-span-3">
              <div className="flex flex-wrap items-center gap-4">
                {form.image ? (
                  <img
                    src={resolveImage(form.image)}
                    alt="Aperçu du produit"
                    className="h-20 w-20 rounded-lg border border-border object-cover"
                  />
                ) : null}
                <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-border px-5 text-sm">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Envoi…" : "Photo depuis mon téléphone"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) uploadImage(file);
                    }}
                  />
                </label>
                {form.image ? (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image: "" }))}
                    className="text-sm text-ink-muted underline"
                  >
                    Retirer l'image
                  </button>
                ) : null}
              </div>
              <input
                className={`${field} mt-3`}
                placeholder="Ou coller un lien d'image (facultatif)"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>

            <input
              className={field}
              placeholder="Note (0-5)"
              type="number"
              step="0.1"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            />
            <input
              className={field}
              placeholder="Nombre d'avis"
              type="number"
              value={form.review_count}
              onChange={(e) => setForm({ ...form, review_count: e.target.value })}
            />
            <input
              className={field}
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
          <textarea
            className="mt-3 min-h-24 w-full rounded-lg border border-border bg-background p-4 text-sm outline-none focus:border-foreground"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_new}
              onChange={(e) => setForm({ ...form, is_new: e.target.checked })}
            />
            Nouveau produit
          </label>
          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="h-11 rounded-full bg-primary px-6 text-sm font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-50"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-11 rounded-full border border-border px-6 text-sm"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="p-4">Produit</th>
              <th className="p-4">Catégorie</th>
              <th className="p-4">Prix</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsQuery.isLoading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-muted">
                  Chargement…
                </td>
              </tr>
            )}
            {!productsQuery.isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-muted">
                  Aucun produit.
                </td>
              </tr>
            )}
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-4">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-ink-muted">{p.brand}</div>
                </td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">{Number(p.price).toLocaleString("fr-FR")} FC</td>
                <td className="p-4">
                  <div className="inline-flex items-center gap-2">
                    <button
                      aria-label="Diminuer le stock"
                      onClick={() => stockMutation.mutate({ id: p.id, delta: -1 })}
                      className="grid h-8 w-8 place-items-center rounded-full border border-border"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center">{p.stock}</span>
                    <button
                      aria-label="Augmenter le stock"
                      onClick={() => stockMutation.mutate({ id: p.id, delta: 1 })}
                      className="grid h-8 w-8 place-items-center rounded-full border border-border"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      aria-label="Modifier"
                      onClick={() => {
                        setForm({
                          id: p.id,
                          name: p.name,
                          price: String(p.price),
                          original_price: p.original_price != null ? String(p.original_price) : "",
                          category: p.category,
                          brand: p.brand,
                          image: p.image,
                          rating: String(p.rating),
                          review_count: String(p.review_count),
                          stock: String(p.stock),
                          is_new: p.is_new,
                          description: p.description ?? "",
                        });
                        setOpen(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="grid h-9 w-9 place-items-center rounded-full border border-border"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Supprimer"
                      onClick={() => {
                        if (window.confirm(`Supprimer « ${p.name} » ? Cette action est définitive.`))
                          deleteMutation.mutate(p.id);
                      }}
                      className="grid h-9 w-9 place-items-center rounded-full border border-border text-promo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
