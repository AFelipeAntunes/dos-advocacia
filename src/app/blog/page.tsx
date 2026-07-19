import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isWixBlogConfigured, listWixPosts } from "@/lib/wix/blog";
import { getPostDescription, getPostImageUrl } from "@/lib/wix/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog de Direito Imobiliário, Riscos e Contratos de Imóvel",
  description:
    "Direito imobiliário em linguagem direta. Contratos, locação, due diligence e os riscos que aparecem antes de assinar. Para compradores, investidores e imobiliárias.",
  alternates: { canonical: "/blog" }
};

export default async function BlogPage() {
  if (!isWixBlogConfigured()) notFound();

  const posts = await listWixPosts();

  return (
    <main className="blog-shell">
      <section className="blog-intro">
        <p className="eyebrow">Conteúdos</p>
        <h1>Antes de decidir sobre um imóvel, entenda o que pode mudar o seu caso.</h1>
        <p>
          Textos diretos sobre contratos, locação, documentação e conflitos para você reconhecer
          riscos, formular perguntas mais precisas e saber quando uma análise jurídica faz diferença.
        </p>
      </section>

      <section className="blog-grid" aria-label="Publicações do blog">
        {posts.map((post) => (
          <article className="blog-card" key={post.id ?? post.slug}>
            {getPostImageUrl(post) ? (
              <Image
                alt={`Capa do artigo: ${post.title}`}
                className="blog-card__image"
                height={480}
                sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                src={getPostImageUrl(post) ?? ""}
                width={760}
              />
            ) : null}
            <p className="blog-card__date">{formatDate(post.firstPublishedDate)}</p>
            <h2>
              <Link href={`/post/${encodeURIComponent(post.slug ?? "")}`}>{post.title}</Link>
            </h2>
            <p>{getPostDescription(post)}</p>
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
