import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";
import { preload } from "react-dom";

export async function generateMetadata() {
  return getLegacyMetadata("home");
}

export default function HomePage() {
  preload("/assets/images/hero-dos-advocacia.webp", {
    as: "image",
    fetchPriority: "high",
    imageSrcSet:
      "/assets/images/hero-dos-advocacia-900.webp 900w, /assets/images/hero-dos-advocacia.webp 1672w",
    imageSizes: "100vw",
    type: "image/webp"
  });

  return <LegacyPage page="home" />;
}
