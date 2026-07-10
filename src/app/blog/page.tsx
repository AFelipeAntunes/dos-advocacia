import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isWixBlogConfigured, listWixPosts } from "@/lib/wix/blog";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Conteúdos | DOS Advocacia Imobiliária",
  description: "Conteúdos sobre Direito Imobiliário, contratos, locação e prevenção de riscos.",
  alternates: { canonical: "/blog" }
};

function getExcerpt(content?: string) {
  if (!content) return "Leia o conteúdo completo preparado pela DOS Advocacia Imobiliária.";
  return content.length > 180 ? `${content.slice(0, 177).trim()}…` : content;
}

export default async function BlogPage() {
  if (!isWixBlogConfigured()) notFound();

  const posts = await listWixPosts();

  return (
    <main className="blog-shell">
      <section className="blog-intro">
        <p className="eyebrow">Conteúdos</p>
        <h1>Conhecimento para decisões imobiliárias mais seguras.</h1>
        <p>
          Análises claras sobre contratos, locação, conflitos e os aspectos jurídicos que protegem
          decisões relevantes.
        </p>
      </section>

      <section className="blog-grid" aria-label="Publicações do blog">
        {posts.map((post) => (
          <article className="blog-card" key={post.id ?? post.slug}>
            <p className="blog-card__date">{formatDate(post.firstPublishedDate)}</p>
            <h2>
              <Link href={`/post/${encodeURIComponent(post.slug ?? "")}`}>{post.title}</Link>
            </h2>
            <p>{getExcerpt(post.excerpt)}</p>
            <Link className="text-link" href={`/post/${encodeURIComponent(post.slug ?? "")}`}>
              Ler artigo <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

function formatDate(value?: string) {
  if (!value) return "Conteúdo jurídico";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Conteúdo jurídico";

  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
}
