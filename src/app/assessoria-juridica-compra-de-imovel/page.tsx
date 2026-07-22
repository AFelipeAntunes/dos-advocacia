import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("assessoriaCompraImovel");
}

export default async function AssessoriaJuridicaCompraDeImovelPage() {
  return <LegacyPage page="assessoriaCompraImovel" />;
}
