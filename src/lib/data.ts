import hoodie from "@/assets/hero.jpg";
import shoes from "@/assets/cat-shoes.jpg";
import phones from "@/assets/cat-phones.jpg";
import bags from "@/assets/cat-bags.jpg";
import watches from "@/assets/cat-watches.jpg";
import audio from "@/assets/cat-audio.jpg";
import clothing from "@/assets/cat-clothing.jpg";

export type Category = {
  slug: string;
  name: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  price: number; // in USD
  oldPrice?: number;
  category: string;
  brand: string;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  isNew?: boolean;
  description: string;
};

export const categories: Category[] = [
  { slug: "vetements", name: "Vêtements", image: clothing },
  { slug: "chaussures", name: "Chaussures", image: shoes },
  { slug: "telephones", name: "Téléphones", image: phones },
  { slug: "sacs", name: "Sacs", image: bags },
  { slug: "montres", name: "Montres", image: watches },
  { slug: "electronique", name: "Électronique", image: audio },
  { slug: "accessoires", name: "Accessoires", image: watches },
  { slug: "autres", name: "Autres", image: hoodie },
];

export const products: Product[] = [
  {
    id: "hoodie-premium",
    name: "Hoodie Premium Noir",
    price: 25000,
    oldPrice: 32000,
    category: "vetements",
    brand: "MS Essentials",
    image: hoodie,
    rating: 4.6,
    reviews: 128,
    stock: 24,
    isNew: true,
    description:
      "Sweat à capuche coupe oversize en coton lourd 380g. Confort maximal, tenue impeccable, coloris intemporel.",
  },
  {
    id: "sneakers-ms",
    name: "Sneakers MS Classic",
    price: 45000,
    category: "chaussures",
    brand: "MS Studio",
    image: shoes,
    rating: 4.8,
    reviews: 214,
    stock: 12,
    description:
      "Sneakers minimalistes en cuir souple, semelle amortissante, silhouette épurée pour un style quotidien.",
  },
  {
    id: "montre-elegante",
    name: "Montre Élégante Steel",
    price: 30000,
    oldPrice: 38000,
    category: "montres",
    brand: "MS Timepieces",
    image: watches,
    rating: 4.4,
    reviews: 76,
    stock: 18,
    description:
      "Montre analogique cadran noir, bracelet acier inoxydable. Étanche 3ATM, design minimaliste unisexe.",
  },
  {
    id: "sac-a-dos-ms",
    name: "Sac à dos MS Urban",
    price: 20000,
    category: "sacs",
    brand: "MS Studio",
    image: bags,
    rating: 4.5,
    reviews: 92,
    stock: 30,
    isNew: true,
    description:
      "Sac à dos structuré en cuir vegan, compartiment laptop 15\", plusieurs poches organisées.",
  },
  {
    id: "ecouteurs-sans-fil",
    name: "Écouteurs Sans-fil Pro",
    price: 15000,
    oldPrice: 22000,
    category: "electronique",
    brand: "MS Audio",
    image: audio,
    rating: 4.3,
    reviews: 340,
    stock: 45,
    description:
      "Écouteurs Bluetooth 5.3, réduction de bruit active, autonomie 24h avec le boîtier de charge.",
  },
  {
    id: "smartphone-noir",
    name: "Smartphone Noir 128Go",
    price: 280000,
    category: "telephones",
    brand: "MS Mobile",
    image: phones,
    rating: 4.7,
    reviews: 58,
    stock: 8,
    description:
      "Écran AMOLED 6.5\", double SIM, batterie 5000mAh, triple caméra 50MP. Débloqué tous opérateurs.",
  },
  {
    id: "tshirt-minimaliste",
    name: "T-shirt Minimaliste Blanc",
    price: 8000,
    category: "vetements",
    brand: "MS Essentials",
    image: clothing,
    rating: 4.2,
    reviews: 189,
    stock: 60,
    description: "T-shirt coton bio 220g, coupe régulière, finitions premium. Basique indispensable.",
  },
  {
    id: "casque-audio",
    name: "Casque Audio Studio",
    price: 55000,
    oldPrice: 68000,
    category: "electronique",
    brand: "MS Audio",
    image: audio,
    rating: 4.9,
    reviews: 44,
    stock: 15,
    isNew: true,
    description:
      "Casque circum-aural, drivers 40mm, son studio équilibré, coussinets mémoire de forme.",
  },
];

export const brands = Array.from(new Set(products.map((p) => p.brand)));

export function formatFC(n: number): string {
  return `${n.toLocaleString("fr-FR")} $`;
}

export function findProduct(id: string) {
  return products.find((p) => p.id === id);
}
