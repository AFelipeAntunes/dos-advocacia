import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("contato");
}

export default async function ContatoPage() {
  return <LegacyPage page="contato" />;
}
