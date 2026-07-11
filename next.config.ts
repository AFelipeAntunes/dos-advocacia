import type { NextConfig } from "next";

const legacyRedirects = [
  ["/index.html", "/"],
  ["/areas-de-atuacao.html", "/areas-de-atuacao"],
  ["/assessoria-em-locacao.html", "/assessoria-em-locacao"],
  ["/conflitos-imobiliarios.html", "/conflitos-imobiliarios"],
  ["/contato.html", "/contato"],
  ["/conteudos.html", "/conteudos"],
  ["/contratos-imobiliarios.html", "/contratos-imobiliarios"],
  ["/due-diligence-imobiliaria.html", "/due-diligence-imobiliaria"],
  ["/politica-de-privacidade.html", "/politica-de-privacidade"],
  ["/sobre.html", "/sobre"],
  ["/treinamentos.html", "/treinamentos"]
] as const;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "static.wixstatic.com", protocol: "https" }]
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true
    }));
  }
};

export default nextConfig;
