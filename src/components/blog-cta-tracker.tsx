"use client";

import { useEffect } from "react";

import {
  getClusterFromDestination,
  getServiceDestination,
  isWhatsAppUrl
} from "@/lib/analytics/ga4";

type BlogCtaTrackerProps = {
  postSlug: string;
};

type Gtag = (
  command: "event",
  eventName: "click_whatsapp" | "click_cta_servico",
  parameters: Record<string, string>
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function BlogCtaTracker({ postSlug }: BlogCtaTrackerProps) {
  useEffect(() => {
    const articleContent = document.querySelector<HTMLElement>(".article__content");
    const serviceCta = document.querySelector<HTMLElement>(".article-service-cta");
    if (!articleContent && !serviceCta) return;

    const serviceLinks = articleContent
      ? Array.from(articleContent.querySelectorAll<HTMLAnchorElement>("a[href]"))
      : [];
    const articleCluster = serviceLinks
      .map((link) => getServiceDestination(link.href, window.location.origin))
      .filter((destination): destination is string => destination !== null)
      .map(getClusterFromDestination)
      .find((cluster) => cluster !== undefined);

    function getClickedLink(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element) || !window.gtag) return null;

      return target.closest<HTMLAnchorElement>("a[href]");
    }

    function trackArticleClick(event: MouseEvent) {
      const link = getClickedLink(event);
      if (!link || !articleContent?.contains(link)) return;

      if (isWhatsAppUrl(link.href)) {
        window.gtag?.("event", "click_whatsapp", {
          post_slug: postSlug,
          ...(articleCluster ? { cluster: articleCluster } : {}),
          cta_position: "fim",
          link_url: link.href
        });
        return;
      }

      const destination = getServiceDestination(link.href, window.location.origin);
      if (!destination) return;

      window.gtag?.("event", "click_cta_servico", {
        post_slug: postSlug,
        destino: destination,
        cta_position: "meio"
      });
    }

    function trackServiceCtaClick(event: MouseEvent) {
      const link = getClickedLink(event);
      if (!link || !serviceCta?.contains(link)) return;

      const destination = getServiceDestination(link.href, window.location.origin);
      if (!destination) return;

      window.gtag?.("event", "click_cta_servico", {
        post_slug: postSlug,
        destino: destination,
        cta_position: "fim_artigo"
      });
    }

    articleContent?.addEventListener("click", trackArticleClick);
    serviceCta?.addEventListener("click", trackServiceCtaClick);

    return () => {
      articleContent?.removeEventListener("click", trackArticleClick);
      serviceCta?.removeEventListener("click", trackServiceCtaClick);
    };
  }, [postSlug]);

  return null;
}
