import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("conflitos");
}

export default async function ConflitosImobiliariosPage() {
  return <LegacyPage page="conflitos" />;
}
