"use client";

import { useEffect } from "react";

import {
  getInstitutionalPostDestination,
  getServiceDestination,
  isWhatsAppUrl
} from "@/lib/analytics/ga4";

type InstitutionalCtaTrackerProps = {
  pageSlug: string;
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

const CTA_POSITIONS = new Set([
  "hero",
  "icp_comprador",
  "icp_imobiliaria",
  "atendimento",
  "rodape_pagina",
  "demandas"
]);

function getCtaPosition(link: HTMLAnchorElement) {
  const explicitPosition = link.dataset.ctaPosition;
  if (explicitPosition && CTA_POSITIONS.has(explicitPosition)) return explicitPosition;
  if (link.dataset.icp === "comprador") return "icp_comprador";
  if (link.dataset.icp === "imobiliaria") return "icp_imobiliaria";
  if (link.closest(".page-hero")) return "hero";
  if (link.closest("footer, .quiet-cta")) return "rodape_pagina";
  return "atendimento";
}

export function InstitutionalCtaTracker({ pageSlug }: InstitutionalCtaTrackerProps) {
  useEffect(() => {
    function trackClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element) || !window.gtag) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const ctaPosition = getCtaPosition(link);
      const icp = link.dataset.icp ?? "";

      if (isWhatsAppUrl(link.href)) {
        window.gtag("event", "click_whatsapp", {
          page_slug: pageSlug,
          page_type: "institucional",
          cta_position: ctaPosition,
          icp
        });
        return;
      }

      const destination =
        getServiceDestination(link.href, window.location.origin) ??
        (link.dataset.trackPost === "true"
          ? getInstitutionalPostDestination(link.href, window.location.origin)
          : null);
      if (!destination) return;

      window.gtag("event", "click_cta_servico", {
        page_slug: pageSlug,
        page_type: "institucional",
        destino: destination,
        cta_position: ctaPosition,
        icp
      });
    }

    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, [pageSlug]);

  return null;
}
