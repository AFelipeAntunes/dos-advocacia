import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("contratos");
}

export default async function ContratosImobiliariosPage() {
  return <LegacyPage page="contratos" />;
}
