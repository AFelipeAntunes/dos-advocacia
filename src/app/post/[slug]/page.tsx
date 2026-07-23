import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogPostJsonLd } from "@/components/blog-post-json-ld";
import { BlogCtaTracker } from "@/components/blog-cta-tracker";
import { WixRichContent } from "@/components/wix-rich-content";
import { getWixPostBySlug, isWixBlogConfigured, listWixPosts } from "@/lib/wix/blog";
import { getPostDescription, getPostImageUrl } from "@/lib/wix/seo";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  if (!isWixBlogConfigured()) return [];

  const posts = await listWixPosts();
  return posts.flatMap((post) => (post.slug ? [{ slug: post.slug }] : []));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  if (!isWixBlogConfigured()) return {};

  const { slug } = await params;
  const post = await getWixPostBySlug(slug);
  if (!post?.title || !post.slug) return {};

  const description = getPostDescription(post);
  const canonicalSlug = encodeURIComponent(post.slug);
  const image = getPostImageUrl(post);

  return {
    title: `${post.title} | DOS Advocacia Imobiliária`,
    description,
    alternates: { canonical: `/post/${canonicalSlug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/post/${canonicalSlug}`,
      publishedTime: post.firstPublishedDate,
      modifiedTime: post.lastPublishedDate,
      locale: "pt_BR",
      siteName: "DOS Advocacia Imobiliária",
      images: image ? [image] : undefined
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      description,
      images: image ? [image] : undefined,
      title: post.title
    }
  };
}

export default async function PostPage({ params }: PostPageProps) {
  if (!isWixBlogConfigured()) notFound();

  const { slug } = await params;
  const post = await getWixPostBySlug(slug);
  if (!post?.title || !post.slug) notFound();

  return (
    <main className="article-shell">
      <article className="article">
        <BlogPostJsonLd post={post} siteUrl={process.env.SITE_URL ?? "https://www.dosadvocacia.com.br"} />
        <Link className="text-link" href="/blog">
          <span aria-hidden="true">←</span> Ver todos os conteúdos
        </Link>
        <p className="eyebrow">Direito Imobiliário</p>
        <h1>{post.title}</h1>
        <p className="article__meta">
          {formatDate(post.firstPublishedDate)}
          {post.minutesToRead ? ` · ${post.minutesToRead} min de leitura` : ""}
        </p>
        <BlogCtaTracker postSlug={post.slug} />
        <div className="article__content"><WixRichContent content={post.richContent} fallback={post.contentText ?? post.excerpt} /></div>
      </article>
    </main>
  );
}


function formatDate(value?: string) {
  if (!value) return "Conteúdo jurídico";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Conteúdo jurídico";

  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
}
