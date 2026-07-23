export const GA_MEASUREMENT_ID = "G-37RDFTHKL8";

export const SERVICE_DESTINATIONS = new Set([
  "assessoria-em-locacao",
  "due-diligence-imobiliaria",
  "assessoria-juridica-compra-de-imovel",
  "contratos-imobiliarios",
  "conflitos-imobiliarios"
]);

export type BlogCluster = "locacao" | "due-diligence" | "planta" | "contratos";

export function getServiceDestination(href: string, origin: string) {
  try {
    const url = new URL(href, origin);
    if (url.origin !== origin) return null;

    const destination = url.pathname.replace(/^\/|\/$/g, "");
    return SERVICE_DESTINATIONS.has(destination) ? destination : null;
  } catch {
    return null;
  }
}

export function getClusterFromDestination(destination: string): BlogCluster | undefined {
  const clusters: Partial<Record<string, BlogCluster>> = {
    "assessoria-em-locacao": "locacao",
    "due-diligence-imobiliaria": "due-diligence",
    "assessoria-juridica-compra-de-imovel": "planta",
    "contratos-imobiliarios": "contratos"
  };

  return clusters[destination];
}

export function isWhatsAppUrl(href: string) {
  try {
    const hostname = new URL(href).hostname.toLowerCase();
    return hostname === "wa.me" || hostname === "api.whatsapp.com";
  } catch {
    return false;
  }
}
