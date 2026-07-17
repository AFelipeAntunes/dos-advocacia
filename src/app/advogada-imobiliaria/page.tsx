import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("advogadaImobiliaria");
}

export default async function AdvogadaImobiliariaPage() {
  return <LegacyPage page="advogadaImobiliaria" />;
}
