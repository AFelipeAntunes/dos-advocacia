import type { BlogCategory } from "@/lib/wix/blog-navigation";
import type { WixBlogPost } from "@/lib/wix/types";

/**
 * Post IDs from DOS-DD-02.01 matrix with Contratos + persona comprador comprovada.
 * Fail closed: any other Contratos post stays without the new DD CTA.
 */
export const CONTRATOS_COMPRADOR_POST_IDS = new Set([
  "600eacb2-e0ad-40af-a9d2-9c453705983c",
  "927d3a84-bcf6-4b2a-af03-dd7a849b25e8",
  "a82baa84-3937-4fd9-a900-566601a9ef3c",
  "f5f7ff6d-cd0d-463b-911d-000a5c2b141d"
]);

export const DUE_DILIGENCE_SERVICE_PATH = "/due-diligence-imobiliaria";
export const COMPRA_SERVICE_PATH = "/assessoria-juridica-compra-de-imovel";
export const IMOBILIARIAS_SERVICE_PATH = "/assessoria-juridica-para-imobiliarias";

export const DUE_DILIGENCE_WHATSAPP_HREF =
  "https://wa.me/5541987926468?text=Ol%C3%A1%2C%20Drielle!%20Vim%20pelo%20conte%C3%BAdo%20do%20blog%20e%20quero%20conversar%20sobre%20uma%20due%20diligence%20imobili%C3%A1ria.";

export type BlogServiceCtaPlan =
  | { kind: "imobiliarias" }
  | { kind: "due-diligence"; showCompraLink: boolean };

function categoryBySlug(categories: BlogCategory[], slug: BlogCategory["slug"]) {
  return categories.find((category) => category.slug === slug);
}

function postHasCategory(post: WixBlogPost, category?: BlogCategory) {
  return Boolean(category?.id && post.categoryIds?.includes(category.id));
}

/**
 * Precedence (parecer 08): Assessoria B2B > Due Diligence > Contratos comprador allowlist.
 * Unknown extra category IDs do not erase a known match. Litígios / unknown-only → null.
 */
export function resolveBlogServiceCtaPlan(
  post: WixBlogPost,
  categories: BlogCategory[]
): BlogServiceCtaPlan | null {
  const ids = post.categoryIds ?? [];
  if (ids.length === 0) return null;

  const known = categories.filter((category) => ids.includes(category.id));
  if (known.length === 0) return null;

  const assessoria = categoryBySlug(categories, "assessoria-para-imobiliárias");
  if (postHasCategory(post, assessoria)) return { kind: "imobiliarias" };

  const dueDiligence = categoryBySlug(categories, "due-diligence-imobiliária");
  if (postHasCategory(post, dueDiligence)) {
    return { kind: "due-diligence", showCompraLink: false };
  }

  const contratos = categoryBySlug(categories, "contratos-imobiliários");
  if (postHasCategory(post, contratos) && post.id && CONTRATOS_COMPRADOR_POST_IDS.has(post.id)) {
    return { kind: "due-diligence", showCompraLink: true };
  }

  return null;
}
