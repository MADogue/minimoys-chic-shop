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
  const lines = [
    "Bonjour Eventaya,",
    "",
    "Je souhaite passer la commande suivante :",
    "",
    ...items.flatMap(({ product, qty }) => [
      `🛍️ Produit : ${product.name}`,
      `🔢 Quantité : ${qty}`,
      `💰 Prix : ${formatFC(product.price * qty)}`,
      "",
    ]),
    `💵 Total : ${formatFC(total)}`,
    "",
    `👤 Nom : ${customer.name}`,
    `📱 WhatsApp : ${customer.phone}`,
    `📍 Commune : ${customer.commune}`,
    `🏘️ Quartier : ${customer.quartier}`,
    reference ? `\n🧾 N° commande : ${reference}` : "",
    "",
    "Merci.",
  ].filter(Boolean);
  return buildUrl(lines.join("\n"));
}
