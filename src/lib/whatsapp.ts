import type { Product } from "./data";
import { formatFC } from "./data";

export const WHATSAPP_NUMBER = "243860046210";

function buildUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function whatsappOrderSingle(product: Product, qty = 1, size?: string) {
  const lines = [
    "Bonjour Eventaya Service 👋",
    "Je souhaite commander :",
    "",
    `• ${product.name} (${product.brand})`,
    `  Réf : ${product.id}`,
    size ? `  Taille : ${size}` : "",
    `  Quantité : ${qty}`,
    `  Prix : ${formatFC(product.price * qty)}`,
    "",
    "Merci de me confirmer la disponibilité et la livraison.",
  ].filter(Boolean);
  return buildUrl(lines.join("\n"));
}

export function whatsappOrderCart(
  items: { product: Product; qty: number }[],
  subtotal: number,
) {
  const lines = [
    "Bonjour Eventaya Service 👋",
    "Je souhaite passer la commande suivante :",
    "",
    ...items.map(
      ({ product, qty }) =>
        `• ${product.name} × ${qty} — ${formatFC(product.price * qty)}`,
    ),
    "",
    `Total : ${formatFC(subtotal)}`,
    "",
    "Merci de me confirmer la disponibilité et la livraison.",
  ];
  return buildUrl(lines.join("\n"));
}

export function whatsappContact(message = "Bonjour Eventaya Service 👋") {
  return buildUrl(message);
}

export function whatsappOrderFull(
  customer: { name: string; phone: string; commune: string; quartier: string },
  items: { product: Product; qty: number }[],
  total: number,
  reference?: string,
) {
  const E = {
    bag: "\u{1F6CD}",
    num: "\u{1F522}",
    money: "\u{1F4B0}",
    cash: "\u{1F4B5}",
    user: "\u{1F464}",
    phone: "\u{1F4F1}",
    pin: "\u{1F4CD}",
    house: "\u{1F3D8}",
    receipt: "\u{1F9FE}",
  };
  const lines: string[] = [
    "Bonjour Eventaya,",
    "",
    "Je souhaite passer la commande suivante :",
    "",
    ...items.flatMap(({ product, qty }) => [
      `${E.bag} Produit : ${product.name}`,
      `${E.num} Quantité : ${qty}`,
      `${E.money} Prix : ${formatFC(product.price * qty)}`,
      "",
    ]),
    `${E.cash} Total : ${formatFC(total)}`,
    "",
    `${E.user} Nom : ${customer.name}`,
    `${E.phone} WhatsApp : ${customer.phone}`,
    `${E.pin} Commune : ${customer.commune}`,
    `${E.house} Quartier : ${customer.quartier}`,
    ...(reference ? ["", `${E.receipt} N° commande : ${reference}`] : []),
    "",
    "Merci.",
  ];
  return buildUrl(lines.join("\n"));
}

