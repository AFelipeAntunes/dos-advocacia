(() => {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const menuLabel = menuToggle?.querySelector(".sr-only");

  const setMenuState = (isOpen) => {
    menuToggle?.setAttribute("aria-expanded", String(isOpen));
    menu?.classList.toggle("is-open", isOpen);
    if (menuLabel) menuLabel.textContent = isOpen ? "Fechar menu" : "Abrir menu";
  };

  menuToggle?.addEventListener("click", () => {
    setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });

  const revealItems = [...document.querySelectorAll(".reveal")];
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
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
  }

  initializeContactForms();

  function initializeContactForms() {
    document.querySelectorAll(".js-contact-form").forEach((form) => {
      if (!(form instanceof HTMLFormElement) || form.dataset.initialized === "true") return;
      form.dataset.initialized = "true";

      const startedAt = form.elements.namedItem("startedAt");
      if (startedAt instanceof HTMLInputElement) startedAt.value = String(Date.now());

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const fields = new FormData(form);
        const payload = {
          city: valueOf(fields, "city"),
          consent: fields.get("consent") === "on",
          demandType: valueOf(fields, "demandType"),
          email: valueOf(fields, "email"),
          formLocation: form.dataset.formLocation || "contato",
          icp: form.dataset.icp || "",
          message: valueOf(fields, "message"),
          name: valueOf(fields, "name"),
          pageSlug: form.dataset.pageSlug || "contato",
          phone: valueOf(fields, "phone"),
          startedAt: Number(valueOf(fields, "startedAt")),
          state: valueOf(fields, "state"),
          website: valueOf(fields, "website")
        };

        const clientErrors = validateContactPayload(payload);
        showFieldErrors(form, clientErrors);
        if (Object.keys(clientErrors).length) return;

        const submit = form.querySelector("[data-submit]");
        if (submit instanceof HTMLButtonElement) {
          submit.disabled = true;
          submit.setAttribute("aria-busy", "true");
          submit.dataset.originalLabel = submit.textContent || "Enviar mensagem";
          submit.textContent = "Enviando...";
        }
        setStatus(form, "");

        try {
          const response = await fetch("/api/contato", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const result = await response.json().catch(() => ({}));

          if (!response.ok) {
            showFieldErrors(form, result.fieldErrors || {});
            setStatus(form, result.error || "Não foi possível enviar a mensagem. Tente novamente.", true);
            restoreSubmit(submit);
            return;
          }

          trackLead(form, payload);
          form.innerHTML = '<div class="form-success" role="status"><p class="eyebrow">Mensagem recebida</p><h2>Mensagem enviada.</h2><p>O retorno acontece em até 24 horas úteis. Se for urgente, o WhatsApp é o caminho mais rápido.</p><a class="button button-coral" href="https://wa.me/5541987926468?text=Olá%2C+enviei+uma+mensagem+pelo+site+e+gostaria+de+dar+sequência+ao+atendimento." target="_blank" rel="noopener">Falar pelo WhatsApp <span aria-hidden="true">↗</span></a></div>';
        } catch {
          setStatus(form, "Não foi possível enviar agora. Fale pelo e-mail drielle@dosadvocacia.com.br ou pelo WhatsApp.", true);
          restoreSubmit(submit);
        }
      });
    });
  }

  function valueOf(fields, name) {
    const value = fields.get(name);
    return typeof value === "string" ? value.trim() : "";
  }

  function validateContactPayload(payload) {
    const errors = {};
    if (payload.name.length < 2) errors.name = ["Informe seu nome completo."];
    if (!/^\S+@\S+\.\S+$/.test(payload.email)) errors.email = ["Informe um e-mail válido."];
    if (payload.phone.length < 8) errors.phone = ["Informe um telefone para retorno."];
    if (!payload.demandType) errors.demandType = ["Selecione o tipo de demanda."];
    if (payload.message.length < 10) errors.message = ["Conte um pouco mais sobre a sua situação."];
    if (!payload.consent) errors.consent = ["Você precisa concordar com a Política de Privacidade."];
    return errors;
  }

  function showFieldErrors(form, errors) {
    form.querySelectorAll("[data-error-for]").forEach((element) => {
      const field = element.dataset.errorFor;
      const message = field && errors[field]?.[0] ? errors[field][0] : "";
      element.textContent = message;
      const input = field && form.elements.namedItem(field);
      if (input instanceof HTMLElement) input.setAttribute("aria-invalid", String(Boolean(message)));
    });
  }

  function setStatus(form, message, isError) {
    const status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("form-status-error", Boolean(isError));
  }

  function restoreSubmit(submit) {
    if (!(submit instanceof HTMLButtonElement)) return;
    submit.disabled = false;
    submit.removeAttribute("aria-busy");
    submit.textContent = submit.dataset.originalLabel || "Enviar mensagem";
  }

  function trackLead(form, payload) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "generate_lead", {
      page_slug: form.dataset.pageSlug || "contato",
      tipo_demanda: payload.demandType,
      icp: form.dataset.icp || "",
      form_location: form.dataset.formLocation || "contato"
    });
  }
})();
