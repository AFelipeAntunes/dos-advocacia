import { getLegacyPage, type LegacyPageKey } from "@/lib/legacy-pages";

type LegacyPageProps = {
  page: LegacyPageKey;
};

export async function LegacyPage({ page }: LegacyPageProps) {
  const legacyPage = await getLegacyPage(page);

  return (
    <>
      {legacyPage.jsonLd.map((schema, index) => (
        <script
          key={`${page}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      ))}
      <div dangerouslySetInnerHTML={{ __html: legacyPage.body }} />
      <script src="/site-interactions.js" />
    </>
  );
}
