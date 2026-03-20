/*
 * Utilitaires de resolution des images produit.
 * Les chemins internes stockes par le backend sont transformes en URL affichables.
 */

import { apiUrl } from "../api/http";

export const DEFAULT_PRODUCT_IMAGE_PATH = "/uploads/demo/default-product.png";
export const FRONTEND_FALLBACK_IMAGE = "/image.png";

export function resolveImageUrl(imagePath) {
  const raw = String(imagePath || "").trim();

  if (!raw) return FRONTEND_FALLBACK_IMAGE;
  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:") ||
    raw.startsWith("blob:")
  ) {
    return raw;
  }

  if (raw.startsWith("/uploads/")) {
    return `${apiUrl()}${raw}`;
  }

  return raw;
}
