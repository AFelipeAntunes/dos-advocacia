import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("areas");
}

export default async function AreasDeAtuacaoPage() {
  return <LegacyPage page="areas" />;
}
