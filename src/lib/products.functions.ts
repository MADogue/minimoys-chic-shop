import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

type Row = Database["public"]["Tables"]["products"]["Row"];

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

const COLUMNS =
  "id, name, description, price, original_price, category, brand, image, rating, review_count, stock, badge, is_new, created_at";

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await client()
    .from("products")
    .select(COLUMNS)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Row[];
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await client()
      .from("products")
      .select(COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as Row | null;
  });
