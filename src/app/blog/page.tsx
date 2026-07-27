import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BlogPostCard } from "@/components/blog-post-card";
import {
  filterPostsByCategory,
  getBlogCategories,
  getBlogCategoryTabs,
  getPostCategory
} from "@/lib/wix/blog-navigation";
import { isWixBlogConfigured, listWixCategories, listWixPosts } from "@/lib/wix/blog";

export const revalidate = 3600;

type BlogPageProps = {
  searchParams: Promise<{ categoria?: string | string[] }>;
};

const blogMetadata: Metadata = {
  title: "Blog de Direito Imobiliário, Riscos e Contratos de Imóvel",
  description:
    "Direito imobiliário em linguagem direta. Contratos, locação, due diligence e os riscos que aparecem antes de assinar. Para compradores, investidores e imobiliárias.",
  alternates: { canonical: "/blog" }
};

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const { categoria } = await searchParams;
  const requestedCategory = getRequestedCategory(categoria);
  if (!requestedCategory || !isWixBlogConfigured()) return blogMetadata;

  const [posts, wixCategories] = await Promise.all([listWixPosts(), listWixCategories()]);
  const category = getBlogCategoryTabs(getBlogCategories(posts, wixCategories))
    .find((item) => item.slug === requestedCategory);

  return {
    ...blogMetadata,
    alternates: {
      canonical: category ? `/blog?categoria=${encodeURIComponent(category.slug)}` : "/blog"
    }
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  if (!isWixBlogConfigured()) notFound();

  const [{ categoria }, posts, wixCategories] = await Promise.all([
    searchParams,
    listWixPosts(),
    listWixCategories()
  ]);
  const allCategories = getBlogCategories(posts, wixCategories);
  const categories = getBlogCategoryTabs(allCategories);
  const requestedCategory = getRequestedCategory(categoria);
  const activeCategory = categories.find((category) => category.slug === requestedCategory);
  if (requestedCategory && !activeCategory) redirect("/blog");
  const filteredPosts = filterPostsByCategory(posts, activeCategory);

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

      <nav className="blog-category-tabs" aria-label="Filtrar conteúdos por categoria">
        <Link aria-current={activeCategory ? undefined : "page"} className="blog-category-tab" href="/blog">
          Todos
        </Link>
        {categories.map((category) => (
          <Link
            aria-current={activeCategory?.slug === category.slug ? "page" : undefined}
            className="blog-category-tab"
            href={{ pathname: "/blog", query: { categoria: category.slug } }}
            key={category.id}
          >
            {category.label}
          </Link>
        ))}
      </nav>

      <section className="blog-grid" aria-label="Publicações do blog">
        {filteredPosts.map((post) => (
          <BlogPostCard
            categoryLabel={getPostCategory(post, allCategories)?.label}
            key={post.id ?? post.slug}
            post={post}
          />
        ))}
      </section>
    </main>
  );
}

function getRequestedCategory(value?: string | string[]) {
  return typeof value === "string" ? value : undefined;
}
