import {
  COMPRA_SERVICE_PATH,
  DUE_DILIGENCE_SERVICE_PATH,
  DUE_DILIGENCE_WHATSAPP_HREF,
  IMOBILIARIAS_SERVICE_PATH,
  type BlogServiceCtaPlan,
  resolveBlogServiceCtaPlan
} from "@/lib/wix/blog-cta-eligibility";
import type { BlogCategory } from "@/lib/wix/blog-navigation";
import type { WixBlogPost } from "@/lib/wix/types";

type BlogServiceCtaProps = {
  categories: BlogCategory[];
  post: WixBlogPost;
};

export function getBlogServiceCtaPlan(post: WixBlogPost, categories: BlogCategory[]) {
  return resolveBlogServiceCtaPlan(post, categories);
}

export function BlogDueDiligenceCompactCta() {
  return (
    <aside
      className="article-service-cta article-service-cta--compact"
      data-cta-position="meio_artigo"
      data-cta-scope="due-diligence"
      data-cta-variant="due-diligence-compacto"
      id="article-dd-cta-compact"
      aria-label="Due diligence imobiliária"
    >
      <p>
        Vai comprar ou investir? A due diligence imobiliária analisa o imóvel, quem vende e o que acompanha o bem antes da assinatura.
      </p>
      <a className="text-link" href={DUE_DILIGENCE_SERVICE_PATH} data-cta-destination="due-diligence-imobiliaria">
        Entender a due diligence <span aria-hidden="true">→</span>
      </a>
    </aside>
  );
}

export function BlogServiceCta({ categories, post }: BlogServiceCtaProps) {
  const plan = resolveBlogServiceCtaPlan(post, categories);
  if (!plan) return null;

  if (plan.kind === "imobiliarias") {
    return (
      <aside
        className="article-service-cta"
        data-cta-position="fim_artigo"
        data-cta-scope="article-service"
        data-cta-variant="imobiliarias"
        aria-labelledby="article-service-cta-title"
      >
        <p className="eyebrow eyebrow-light">Para imobiliárias e administradoras</p>
        <h2 id="article-service-cta-title">A rotina do artigo também chega como demanda jurídica</h2>
        <p className="article-service-cta__lead">
          Contratos, locação, venda e conflitos no mesmo acompanhamento, com leitura da operação antes de o caso virar processo.
        </p>
        <a className="button button-light" href={IMOBILIARIAS_SERVICE_PATH}>
          Assessoria jurídica para imobiliárias
        </a>
      </aside>
    );
  }

  return <BlogDueDiligenceCompleteCta plan={plan} />;
}

function BlogDueDiligenceCompleteCta({ plan }: { plan: Extract<BlogServiceCtaPlan, { kind: "due-diligence" }> }) {
  return (
    <aside
      className="article-service-cta article-service-cta--due-diligence"
      data-cta-position="fim_artigo"
      data-cta-scope="due-diligence"
      data-cta-variant="due-diligence-completo"
      id="article-dd-cta-complete"
      aria-labelledby="article-dd-cta-complete-title"
    >
      <p className="eyebrow eyebrow-light">Antes do sinal</p>
      <h2 id="article-dd-cta-complete-title">Antes do sinal, uma conversa</h2>
      <p className="article-service-cta__lead">
        Se você está perto de assinar uma proposta, este é o momento de olhar os documentos.
      </p>
      <div className="article-service-cta__actions">
        <a className="button button-light" href={DUE_DILIGENCE_SERVICE_PATH} data-cta-destination="due-diligence-imobiliaria">
          Conhecer a due diligence imobiliária
        </a>
        {plan.showCompraLink ? (
          <a className="text-link text-link-light" href={COMPRA_SERVICE_PATH} data-cta-destination="assessoria-juridica-compra-de-imovel">
            ver assessoria na compra <span aria-hidden="true">→</span>
          </a>
        ) : null}
        <a
          className="text-link text-link-light"
          href={DUE_DILIGENCE_WHATSAPP_HREF}
          target="_blank"
          rel="noopener"
          data-cta-whatsapp="due-diligence"
        >
          Falar pelo WhatsApp <span aria-hidden="true">↗</span>
        </a>
      </div>
    </aside>
  );
}
