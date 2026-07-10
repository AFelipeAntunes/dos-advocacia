import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("treinamentos");
}

export default async function TreinamentosPage() {
  return <LegacyPage page="treinamentos" />;
}
