import { queryOptions } from "@tanstack/react-query";
import hero from "@/assets/hero.jpg";
import shoes from "@/assets/cat-shoes.jpg";
import phones from "@/assets/cat-phones.jpg";
import bags from "@/assets/cat-bags.jpg";
import watches from "@/assets/cat-watches.jpg";
import audio from "@/assets/cat-audio.jpg";
import clothing from "@/assets/cat-clothing.jpg";
import type { Product } from "./data";
import { listProducts, getProduct } from "./products.functions";

const IMAGES: Record<string, string> = {
  hero,
  "cat-shoes": shoes,
  "cat-phones": phones,
  "cat-bags": bags,
  "cat-watches": watches,
  "cat-audio": audio,
  "cat-clothing": clothing,
};

export function resolveImage(image: string): string {
  if (!image) return hero;
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return IMAGES[image] ?? hero;
}

type Row = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  original_price: number | string | null;
  category: string;
  brand: string;
  image: string;
  rating: number | string;
  review_count: number;
  stock: number;
  is_new: boolean;
};

export function mapProduct(row: Row): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.price),
    ...(row.original_price != null ? { oldPrice: Number(row.original_price) } : {}),
    category: row.category,
    brand: row.brand,
    image: resolveImage(row.image),
    rating: Number(row.rating),
    reviews: row.review_count,
    stock: row.stock,
    isNew: row.is_new,
  };
}

export const productsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: async () => (await listProducts()).map((r) => mapProduct(r as unknown as Row)),
});

export const productQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["products", id],
    queryFn: async () => {
      const row = await getProduct({ data: { id } });
      return row ? mapProduct(row as unknown as Row) : null;
    },
  });
