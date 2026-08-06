export type ContactFormLocation = "contato" | "servico";

type ContactFormConfig = {
  demandType?: string;
  formLocation: ContactFormLocation;
  icp: string;
  pageSlug: string;
};

const demandOptions = [
  "Compra, venda ou investimento",
  "Locação / imobiliária",
  "Conflito ou processo",
  "Outro assunto"
];

const serviceForms: Record<string, ContactFormConfig> = {
  advogadaImobiliaria: {
    demandType: "Outro assunto",
    formLocation: "servico",
    icp: "comprador",
    pageSlug: "advogada-imobiliaria"
  },
  advogadaImobiliariaCuritiba: {
    demandType: "Outro assunto",
    formLocation: "servico",
    icp: "comprador",
    pageSlug: "advogada-imobiliaria-curitiba"
  },
  assessoriaCompraImovel: {
    demandType: "Compra, venda ou investimento",
    formLocation: "servico",
    icp: "comprador",
    pageSlug: "assessoria-juridica-compra-de-imovel"
  },
  conflitos: {
    demandType: "Conflito ou processo",
    formLocation: "servico",
    icp: "comprador",
    pageSlug: "conflitos-imobiliarios"
  },
  contratos: {
    demandType: "Outro assunto",
    formLocation: "servico",
    icp: "comprador",
    pageSlug: "contratos-imobiliarios"
  },
  dueDiligence: {
    demandType: "Compra, venda ou investimento",
    formLocation: "servico",
    icp: "comprador",
    pageSlug: "due-diligence-imobiliaria"
  },
  locacao: {
    demandType: "Locação / imobiliária",
    formLocation: "servico",
    icp: "imobiliaria",
    pageSlug: "assessoria-em-locacao"
  }
};

function escapeAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function errorSlot(field: string) {
  return `<p class="field-error" data-error-for="${field}" id="${field}-error" role="alert"></p>`;
}

function demandSelect(defaultValue?: string) {
  const options = demandOptions
    .map((option) => `<option value="${escapeAttribute(option)}"${option === defaultValue ? " selected" : ""}>${option}</option>`)
    .join("");

  return `<div class="form-field full"><label for="demanda">Tipo de demanda</label><select aria-describedby="demandType-error" id="demanda" name="demandType" required><option value="">Selecione uma opção</option>${options}</select>${errorSlot("demandType")}</div>`;
}

function sharedFields(config: ContactFormConfig, includeDemand: boolean) {
  return `<div class="form-grid">
    <div class="form-field"><label for="nome">Nome completo</label><input aria-describedby="name-error" id="nome" name="name" autocomplete="name" required>${errorSlot("name")}</div>
    <div class="form-field"><label for="email">E-mail</label><input aria-describedby="email-error" id="email" name="email" type="email" autocomplete="email" required>${errorSlot("email")}</div>
    <div class="form-field"><label for="telefone">Telefone / WhatsApp</label><input aria-describedby="phone-error" id="telefone" name="phone" type="tel" autocomplete="tel" required>${errorSlot("phone")}</div>
    ${includeDemand ? demandSelect() : `<input type="hidden" name="demandType" value="${escapeAttribute(config.demandType ?? "Outro assunto")}">`}
    ${config.formLocation === "contato" ? `<div class="form-field"><label for="cidade">Cidade</label><input id="cidade" name="city" autocomplete="address-level2"></div><div class="form-field"><label for="estado">Estado</label><input id="estado" name="state" autocomplete="address-level1" maxlength="2"></div>` : ""}
    <div class="form-field full"><label for="mensagem">O que você precisa compreender antes de decidir?</label><textarea aria-describedby="message-error" id="mensagem" name="message" required></textarea>${errorSlot("message")}</div>
  </div>
  <label class="consent-field"><input aria-describedby="consent-error" name="consent" type="checkbox" required><span>Li e concordo com a <a href="/politica-de-privacidade">Política de Privacidade</a>.</span></label>${errorSlot("consent")}
  <input aria-hidden="true" autocomplete="off" class="form-honeypot" name="website" tabindex="-1" type="text">
  <input name="startedAt" type="hidden" value="">`;
}

function formMarkup(config: ContactFormConfig) {
  const compact = config.formLocation === "servico";
  const heading = compact ? "Prefere escrever?" : "Prefere começar por escrito?";
  const description = compact
    ? "Envie os detalhes da sua demanda. A mensagem chega direto ao escritório e o retorno acontece em até 24 horas úteis."
    : "Conte, com suas palavras, o que está acontecendo. A mensagem chega direto ao escritório e o retorno acontece em até 24 horas úteis.";

  return `<form class="contact-form${compact ? " contact-form-compact" : ""} js-contact-form" data-form-location="${config.formLocation}" data-icp="${escapeAttribute(config.icp)}" data-page-slug="${escapeAttribute(config.pageSlug)}" novalidate>
    <p class="eyebrow">${compact ? "Mensagem inicial" : "Mensagem inicial"}</p>
    <h2>${heading}</h2>
    <p>${description}</p>
    ${sharedFields(config, !compact)}
    <button class="button button-coral" data-submit type="submit">Enviar mensagem <span aria-hidden="true">↗</span></button>
    <p class="form-status" data-form-status aria-live="polite" role="status"></p>
  </form>`;
}

export function getContactFormMarkup(page: string) {
  if (page === "contato") {
    return formMarkup({ formLocation: "contato", icp: "", pageSlug: "contato" });
  }

  const config = serviceForms[page];
  return config ? `<section class="section-space contact-form-section" aria-labelledby="${config.pageSlug}-contact-title"><div class="page-shell"><div id="${config.pageSlug}-contact-title" class="sr-only">Fale com o escritório</div>${formMarkup(config)}</div></section>` : null;
}
