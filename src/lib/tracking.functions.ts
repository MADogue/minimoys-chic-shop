import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function client() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const recordProductView = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ productId: z.string().min(1), sessionId: z.string().max(64).optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { error } = await client()
      .from("product_views")
      .insert({ product_id: data.productId, session_id: data.sessionId ?? null });
    if (error) return { ok: false };
    return { ok: true };
  });

const orderSchema = z.object({
  total: z.number().min(0),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        name: z.string().min(1),
        unitPrice: z.number().min(0),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1)
    .max(50),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    const db = client();
    const { data: order, error } = await db
      .from("orders")
      .insert({ total: data.total, channel: "whatsapp" })
      .select("id, reference")
      .single();
    if (error || !order) return { ok: false };
    const { error: itemsError } = await db.from("order_items").insert(
      data.items.map((i) => ({
        order_id: order.id,
        product_id: i.productId,
        product_name: i.name,
        unit_price: i.unitPrice,
        quantity: i.quantity,
      })),
    );
    if (itemsError) return { ok: false };
    return { ok: true, reference: order.reference };
  });
