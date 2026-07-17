import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("advogadaImobiliariaCuritiba");
}

export default async function AdvogadaImobiliariaCuritibaPage() {
  return <LegacyPage page="advogadaImobiliariaCuritiba" />;
}
