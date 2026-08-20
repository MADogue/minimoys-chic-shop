import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const statusSchema = z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]);

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const [products, orders, views] = await Promise.all([
      supabase.from("products").select("id, stock"),
      supabase.from("orders").select("id, status, total"),
      supabase.from("product_views").select("id", { count: "exact", head: true }),
    ]);
    if (products.error) throw new Error(products.error.message);
    if (orders.error) throw new Error(orders.error.message);
    if (views.error) throw new Error(views.error.message);

    const orderRows = orders.data ?? [];
    return {
      totalProducts: products.data?.length ?? 0,
      availableProducts: (products.data ?? []).filter((p) => (p.stock ?? 0) > 0).length,
      totalOrders: orderRows.length,
      pendingOrders: orderRows.filter((o) => o.status === "pending").length,
      revenue: orderRows
        .filter((o) => o.status !== "cancelled")
        .reduce((s, o) => s + Number(o.total ?? 0), 0),
      totalViews: views.count ?? 0,
    };
  });

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select(
        "id, reference, customer_name, customer_contact, commune, quartier, total, status, created_at, order_items(id, product_name, quantity, unit_price)",
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), status: statusSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getProductAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const [products, views, items] = await Promise.all([
      supabase.from("products").select("id, name, stock"),
      supabase.from("product_views").select("product_id"),
      supabase.from("order_items").select("product_id, quantity"),
    ]);
    if (products.error) throw new Error(products.error.message);
    if (views.error) throw new Error(views.error.message);
    if (items.error) throw new Error(items.error.message);

    const viewCount = new Map<string, number>();
    for (const v of views.data ?? [])
      viewCount.set(v.product_id, (viewCount.get(v.product_id) ?? 0) + 1);

    const orderCount = new Map<string, number>();
    const soldCount = new Map<string, number>();
    for (const i of items.data ?? []) {
      if (!i.product_id) continue;
      orderCount.set(i.product_id, (orderCount.get(i.product_id) ?? 0) + 1);
      soldCount.set(i.product_id, (soldCount.get(i.product_id) ?? 0) + (i.quantity ?? 0));
    }

    return (products.data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stock ?? 0,
      views: viewCount.get(p.id) ?? 0,
      orders: orderCount.get(p.id) ?? 0,
      sold: soldCount.get(p.id) ?? 0,
    }));
  });
