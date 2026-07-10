import { LegacyPage } from "@/components/legacy-page";
import { getLegacyMetadata } from "@/lib/legacy-pages";

export async function generateMetadata() {
  return getLegacyMetadata("home");
}

export default async function HomePage() {
  return <LegacyPage page="home" />;
}
