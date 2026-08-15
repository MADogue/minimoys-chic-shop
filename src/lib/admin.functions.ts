import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const COLUMNS =
  "id, name, description, price, original_price, category, brand, image, rating, review_count, stock, badge, is_new, created_at, updated_at";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().default(""),
  price: z.number().min(0),
  original_price: z.number().min(0).nullable().optional(),
  category: z.string().min(1),
  brand: z.string().default(""),
  image: z.string().default(""),
  rating: z.number().min(0).max(5).default(0),
  review_count: z.number().int().min(0).default(0),
  stock: z.number().int().min(0).default(0),
  is_new: z.boolean().default(false),
});

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error(error.message);
    return { isAdmin: Boolean(data) };
  });

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("products")
      .select(COLUMNS)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => productSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { id, ...fields } = data;
    const payload = {
      ...fields,
      original_price: fields.original_price ?? null,
    };
    if (id) {
      const { error } = await context.supabase.from("products").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true, id };
    }
    const { data: row, error } = await context.supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row.id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().min(1) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adjustStock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().min(1), delta: z.number().int() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error: readError } = await context.supabase
      .from("products")
      .select("stock")
      .eq("id", data.id)
      .single();
    if (readError) throw new Error(readError.message);
    const next = Math.max(0, (row?.stock ?? 0) + data.delta);
    const { error } = await context.supabase
      .from("products")
      .update({ stock: next })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { stock: next };
  });
