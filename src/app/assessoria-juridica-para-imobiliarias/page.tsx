import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("imobiliarias");
}

export default async function AssessoriaJuridicaParaImobiliariasPage() {
  return <LegacyPage page="imobiliarias" />;
}
