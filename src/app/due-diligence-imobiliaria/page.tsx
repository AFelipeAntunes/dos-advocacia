import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("dueDiligence");
}

export default async function DueDiligenceImobiliariaPage() {
  return <LegacyPage page="dueDiligence" />;
}
