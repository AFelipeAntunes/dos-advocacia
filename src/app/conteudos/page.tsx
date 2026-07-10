import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("conteudos");
}

export default async function ConteudosPage() {
  return <LegacyPage page="conteudos" />;
}
