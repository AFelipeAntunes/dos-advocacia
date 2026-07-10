import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("privacidade");
}

export default async function PoliticaDePrivacidadePage() {
  return <LegacyPage page="privacidade" />;
}
