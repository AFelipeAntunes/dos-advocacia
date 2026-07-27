import Image from "next/image";
import Link from "next/link";

import type { WixBlogPost } from "@/lib/wix/types";
import { getPostDescription, getPostImageUrl } from "@/lib/wix/seo";

type BlogPostCardProps = {
  categoryLabel?: string;
  post: WixBlogPost;
};

export function BlogPostCard({ categoryLabel, post }: BlogPostCardProps) {
  const href = `/post/${encodeURIComponent(post.slug ?? "")}`;
  const image = getPostImageUrl(post);

  return (
    <article className="blog-card">
      {image ? (
        <Image
          alt={`Capa do artigo: ${post.title}`}
          className="blog-card__image"
          height={480}
          sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
          src={image}
          width={760}
        />
      ) : null}
      <p className="blog-card__date">{formatDate(post.firstPublishedDate)}</p>
      {categoryLabel ? <p className="blog-card__category">{categoryLabel}</p> : null}
      <h2>
        <Link href={href}>{post.title}</Link>
      </h2>
      <p>{getPostDescription(post)}</p>
      <Link className="text-link" href={href}>
        Ler artigo <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

function formatDate(value?: string) {
  if (!value) return "Conteúdo jurídico";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Conteúdo jurídico";

  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
}
