import type { WixFaqItem } from "@/lib/wix/rich-content";

type FaqPageJsonLdProps = {
  items: WixFaqItem[];
};

export function FaqPageJsonLd({ items }: FaqPageJsonLdProps) {
  if (items.length < 2) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      },
      name: item.question
    }))
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      type="application/ld+json"
    />
  );
}
