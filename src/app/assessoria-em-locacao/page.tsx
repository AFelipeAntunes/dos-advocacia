import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("locacao");
}

export default async function AssessoriaEmLocacaoPage() {
  return <LegacyPage page="locacao" />;
}
