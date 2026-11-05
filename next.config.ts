import type { NextConfig } from "next";

import { legacyRedirects, postConsolidationRedirects } from "./src/lib/redirect-config";

// Reexportado para que o teste de redirects continue validando a configuração
// efetivamente aplicada pelo Next.js sem manter uma segunda cópia dos pares.
export { postConsolidationRedirects };

const wixLegacyRedirects = [
  ["/blog/categories/litígios-imobiliários", "/blog"],
  ["/blog/categories/contratos-imobiliários", "/blog"],
  ["/compradores-e-investidores", "/assessoria-juridica-compra-de-imovel"],
  ["/compradores-e-investidores-1-1", "/assessoria-juridica-compra-de-imovel"],
  ["/compradores-e-investidores-1-2", "/assessoria-juridica-compra-de-imovel"],
  ["/política-de-privacidade", "/politica-de-privacidade"]
] as const;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "static.wixstatic.com", protocol: "https" }]
  },
  async redirects() {
    return [
      ...legacyRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true
      })),
      ...wixLegacyRedirects.map(([source, destination]) => ({
        source: encodeURI(source),
        destination,
        statusCode: 301 as const
      })),
      ...postConsolidationRedirects.map(([source, destination]) => ({
        source: encodeURI(source),
        destination: encodeURI(destination),
        statusCode: 301 as const
      }))
    ];
  }
};

export default nextConfig;
