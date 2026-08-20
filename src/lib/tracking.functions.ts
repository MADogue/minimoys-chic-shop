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
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    phone: z.string().trim().min(6).max(30),
    commune: z.string().trim().min(2).max(80),
    quartier: z.string().trim().min(2).max(80),
  }),
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
    const id = crypto.randomUUID();
    const reference = `EV-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
    const { error } = await db.from("orders").insert({
      id,
      reference,
      total: data.total,
      channel: "whatsapp",
      status: "pending",
      customer_name: data.customer.name,
      customer_contact: data.customer.phone,
      commune: data.customer.commune,
      quartier: data.customer.quartier,
    });
    if (error) return { ok: false as const };

    const { error: itemsError } = await db.from("order_items").insert(
      data.items.map((i) => ({
        order_id: id,
        product_id: i.productId,
        product_name: i.name,
        unit_price: i.unitPrice,
        quantity: i.quantity,
      })),
    );
    if (itemsError) return { ok: false as const };
    return { ok: true as const, reference };
  });

