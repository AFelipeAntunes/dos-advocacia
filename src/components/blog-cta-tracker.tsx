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

export type BlogCtaTrackerDocument = Pick<Document, "querySelector" | "querySelectorAll">;

export type BindBlogCtaTrackerOptions = {
  gtag?: Gtag;
  origin?: string;
};

/**
 * Privacy / series note (parecer 08 + card 04):
 * - Editorial links inside `.article__content` keep historical `cta_position=meio`
 *   and WhatsApp keeps `cta_position=fim` + `link_url`.
 * - Injected DD blocks use `meio_artigo` / `fim_artigo` and omit `link_url` on WhatsApp.
 * - B2B final block keeps `fim_artigo` without `link_url`.
 * - Related-posts cards sit outside these scopes and emit zero service events.
 *
 * Exported for CTO 11 R2 behavioral harnesses that exercise the same listeners the
 * component mounts in useEffect, including cleanup on remount/postSlug change.
 */
export function bindBlogCtaTrackerListeners(
  documentRef: BlogCtaTrackerDocument,
  postSlug: string,
  options: BindBlogCtaTrackerOptions = {}
) {
  const articleContent = documentRef.querySelector<HTMLElement>(".article__content");
  const serviceScopes = Array.from(
    documentRef.querySelectorAll<HTMLElement>("[data-cta-scope]")
  );
  if (!articleContent && serviceScopes.length === 0) return () => {};

  const origin = options.origin
    ?? (typeof window !== "undefined" ? window.location.origin : "https://www.dosadvocacia.com.br");
  const emit: Gtag = options.gtag
    ?? ((...args) => {
      window.gtag?.(...args);
    });

  const serviceLinks = articleContent
    ? Array.from(articleContent.querySelectorAll<HTMLAnchorElement>("a[href]")).filter(
      (link) => !link.closest("[data-cta-scope]")
    )
    : [];
  const articleCluster = serviceLinks
    .map((link) => getServiceDestination(link.href, origin))
    .filter((destination): destination is string => destination !== null)
    .map(getClusterFromDestination)
    .find((cluster) => cluster !== undefined);

  function getClickedLink(event: Event) {
    const target = event.target as Element | null;
    if (!target || typeof target.closest !== "function") return null;

    return target.closest<HTMLAnchorElement>("a[href]");
  }

  function trackArticleClick(event: Event) {
    const link = getClickedLink(event);
    if (!link || !articleContent?.contains(link)) return;
    if (link.closest("[data-cta-scope]")) return;

    if (isWhatsAppUrl(link.href)) {
      emit("event", "click_whatsapp", {
        post_slug: postSlug,
        ...(articleCluster ? { cluster: articleCluster } : {}),
        cta_position: "fim",
        link_url: link.href
      });
      return;
    }

    const destination = getServiceDestination(link.href, origin);
    if (!destination) return;

    emit("event", "click_cta_servico", {
      post_slug: postSlug,
      destino: destination,
      cta_position: "meio"
    });
  }

  function trackServiceScopeClick(event: Event) {
    const link = getClickedLink(event);
    if (!link) return;

    const scope = link.closest<HTMLElement>("[data-cta-scope]");
    if (!scope || !serviceScopes.includes(scope)) return;

    const position = scope.dataset.ctaPosition === "meio_artigo" ? "meio_artigo" : "fim_artigo";

    if (isWhatsAppUrl(link.href)) {
      const cluster = getClusterFromDestination("due-diligence-imobiliaria");

      emit("event", "click_whatsapp", {
        post_slug: postSlug,
        ...(cluster ? { cluster } : {}),
        cta_position: position
      });
      return;
    }

    const destination = getServiceDestination(link.href, origin);
    if (!destination) return;

    emit("event", "click_cta_servico", {
      post_slug: postSlug,
      destino: destination,
      cta_position: position
    });
  }

  articleContent?.addEventListener("click", trackArticleClick);
  for (const scope of serviceScopes) {
    scope.addEventListener("click", trackServiceScopeClick);
  }

  return () => {
    articleContent?.removeEventListener("click", trackArticleClick);
    for (const scope of serviceScopes) {
      scope.removeEventListener("click", trackServiceScopeClick);
    }
  };
}

export function BlogCtaTracker({ postSlug }: BlogCtaTrackerProps) {
  useEffect(() => bindBlogCtaTrackerListeners(document, postSlug), [postSlug]);

  return null;
}
