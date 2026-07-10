import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("sobre");
}

export default async function SobrePage() {
  return <LegacyPage page="sobre" />;
}
