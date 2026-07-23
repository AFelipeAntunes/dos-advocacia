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
    if (!articleContent) return;

    const serviceLinks = Array.from(articleContent.querySelectorAll<HTMLAnchorElement>("a[href]"));
    const articleCluster = serviceLinks
      .map((link) => getServiceDestination(link.href, window.location.origin))
      .filter((destination): destination is string => destination !== null)
      .map(getClusterFromDestination)
      .find((cluster) => cluster !== undefined);

    function trackClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || !articleContent?.contains(link) || !window.gtag) return;

      if (isWhatsAppUrl(link.href)) {
        window.gtag("event", "click_whatsapp", {
          post_slug: postSlug,
          ...(articleCluster ? { cluster: articleCluster } : {}),
          cta_position: "fim",
          link_url: link.href
        });
        return;
      }

      const destination = getServiceDestination(link.href, window.location.origin);
      if (!destination) return;

      window.gtag("event", "click_cta_servico", {
        post_slug: postSlug,
        destino: destination,
        cta_position: "meio"
      });
    }

    articleContent.addEventListener("click", trackClick);
    return () => articleContent.removeEventListener("click", trackClick);
  }, [postSlug]);

  return null;
}
