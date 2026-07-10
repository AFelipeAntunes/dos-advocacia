"use client";

import { useEffect } from "react";

export function SiteInteractions() {
  useEffect(() => {
    const menuToggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
    const menu = document.querySelector<HTMLElement>("[data-menu]");

    const closeMenu = () => {
      menuToggle?.setAttribute("aria-expanded", "false");
      menu?.classList.remove("is-open");
    };

    const onToggleMenu = () => {
      if (!menuToggle || !menu) return;
      const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      menu.classList.toggle("is-open", willOpen);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    menuToggle?.addEventListener("click", onToggleMenu);
    menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", onKeyDown);

    const revealItems = [...document.querySelectorAll<HTMLElement>(".reveal")];
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));

      return () => {
        menuToggle?.removeEventListener("click", onToggleMenu);
        menu?.querySelectorAll("a").forEach((link) => link.removeEventListener("click", closeMenu));
        document.removeEventListener("keydown", onKeyDown);
      };
    }

    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => {
      menuToggle?.removeEventListener("click", onToggleMenu);
      menu?.querySelectorAll("a").forEach((link) => link.removeEventListener("click", closeMenu));
      document.removeEventListener("keydown", onKeyDown);
      observer.disconnect();
    };
  }, []);

  return null;
}
