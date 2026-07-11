import type { WixBlogPost } from "@/lib/wix/types";
import { getPostDescription, getPostImageUrl } from "@/lib/wix/seo";

type BlogPostJsonLdProps = {
  post: WixBlogPost;
  siteUrl: string;
};

export function BlogPostJsonLd({ post, siteUrl }: BlogPostJsonLdProps) {
  if (!post.slug || !post.title) return null;

  const url = new URL(`/post/${encodeURIComponent(post.slug)}`, siteUrl).toString();
  const image = getPostImageUrl(post);
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
      "@type": "Person",
      name: "Drielle Pereira"
    },
    dateModified: post.lastPublishedDate,
    datePublished: post.firstPublishedDate,
    description: getPostDescription(post),
    headline: post.title,
    image: image ? [image] : undefined,
    mainEntityOfPage: { "@id": url, "@type": "WebPage" },
    publisher: {
      "@type": "LegalService",
      name: "DOS Advocacia Imobiliária",
      url: siteUrl
    },
    url
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      type="application/ld+json"
    />
  );
}
