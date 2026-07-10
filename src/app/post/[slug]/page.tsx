import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getWixPostBySlug, isWixBlogConfigured, listWixPosts } from "@/lib/wix/blog";

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

  const description = post.excerpt ?? getSummary(post.contentText);
  const canonicalSlug = encodeURIComponent(post.slug);

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
      siteName: "DOS Advocacia Imobiliária"
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
        <Link className="text-link" href="/blog">
          <span aria-hidden="true">←</span> Ver todos os conteúdos
        </Link>
        <p className="eyebrow">Direito Imobiliário</p>
        <h1>{post.title}</h1>
        <p className="article__meta">
          {formatDate(post.firstPublishedDate)}
          {post.minutesToRead ? ` · ${post.minutesToRead} min de leitura` : ""}
        </p>
        <div className="article__content">
          {toParagraphs(post.contentText ?? post.excerpt).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}

function getSummary(content?: string) {
  if (!content) return undefined;
  return content.length > 160 ? `${content.slice(0, 157).trim()}…` : content;
}

function toParagraphs(content?: string) {
  return (content ?? "Conteúdo em atualização.")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function formatDate(value?: string) {
  if (!value) return "Conteúdo jurídico";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Conteúdo jurídico";

  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
}
