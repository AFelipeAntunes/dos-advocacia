import { isImobiliariasPost, type BlogCategory } from "@/lib/wix/blog-navigation";
import type { WixBlogPost } from "@/lib/wix/types";

type BlogServiceCtaProps = {
  categories: BlogCategory[];
  post: WixBlogPost;
};

export function BlogServiceCta({ categories, post }: BlogServiceCtaProps) {
  if (!isImobiliariasPost(post, categories)) return null;

  return (
    <aside className="article-service-cta" data-cta-scope="article-service" aria-labelledby="article-service-cta-title">
      <p className="eyebrow eyebrow-light">Para imobiliárias e administradoras</p>
      <h2 id="article-service-cta-title">A rotina do artigo também chega como demanda jurídica</h2>
      <p className="article-service-cta__lead">Contratos, locação, venda e conflitos no mesmo acompanhamento, com leitura da operação antes de o caso virar processo.</p>
      <a className="button button-light" href="/assessoria-juridica-para-imobiliarias">Assessoria jurídica para imobiliárias</a>
    </aside>
  );
}
