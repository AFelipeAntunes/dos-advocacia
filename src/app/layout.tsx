import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://www.dosadvocacia.com.br"),
  applicationName: "DOS Advocacia Imobiliária",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/assets/brand/symbol.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#0b1e47"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
