import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const demandTypes = [
  "Compra, venda ou investimento",
  "Locação / imobiliária",
  "Conflito ou processo",
  "Outro assunto"
] as const;

const contactSchema = z.object({
  city: z.string().trim().max(100).optional().default(""),
  consent: z.literal(true, { error: "Você precisa concordar com a Política de Privacidade." }),
  demandType: z.enum(demandTypes, { error: "Selecione o tipo de demanda." }),
  email: z.string().trim().email("Informe um e-mail válido.").max(254),
  formLocation: z.enum(["contato", "servico"]),
  icp: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(10, "Conte um pouco mais sobre a sua situação.").max(5000),
  name: z.string().trim().min(2, "Informe seu nome completo.").max(120),
  pageSlug: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(8, "Informe um telefone para retorno.").max(40),
  startedAt: z.number().int().positive(),
  state: z.string().trim().max(2).optional().default(""),
  website: z.string().trim().max(0).optional().default("")
});

type ContactData = z.infer<typeof contactSchema>;

function validationResponse(error: z.ZodError) {
  const fieldErrors = error.flatten().fieldErrors;
  return NextResponse.json(
    { error: "Confira os campos destacados e tente novamente.", fieldErrors },
    { status: 400 }
  );
}

function buildNotification(data: ContactData, receivedAt: string) {
  return [
    "Novo contato pelo site DOS Advocacia",
    "",
    `Nome: ${data.name}`,
    `E-mail: ${data.email}`,
    `Telefone / WhatsApp: ${data.phone}`,
    `Tipo de demanda: ${data.demandType}`,
    `Cidade: ${data.city || "Não informada"}`,
    `Estado: ${data.state || "Não informado"}`,
    `Página de origem: ${data.pageSlug}`,
    `Local do formulário: ${data.formLocation}`,
    `ICP: ${data.icp || "Não informado"}`,
    `Recebido em: ${receivedAt}`,
    `Consentimento LGPD: autorizado em ${receivedAt}`,
    "",
    "Mensagem:",
    data.message
  ].join("\n");
}

function buildAutoreply(name: string) {
  return [
    `Olá, ${name}.`,
    "",
    "Recebemos sua mensagem e ela foi encaminhada ao escritório. O retorno acontece em até 24 horas úteis.",
    "",
    "Esta é uma confirmação automática de recebimento. Não constitui orientação jurídica.",
    "",
    "Atenciosamente,",
    "DOS Advocacia Imobiliária"
  ].join("\n");
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Não foi possível ler a mensagem." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) return validationResponse(parsed.error);

  const data = parsed.data;
  if (data.website || Date.now() - data.startedAt < 3000) {
    return NextResponse.json({ error: "Não foi possível enviar a mensagem. Tente novamente." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "O envio está temporariamente indisponível. Use o WhatsApp ou o e-mail do escritório." }, { status: 503 });
  }

  const receivedAt = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo"
  }).format(new Date());
  const notification = buildNotification(data, receivedAt);
  const resend = new Resend(apiKey);

  let emailResults: Array<Awaited<ReturnType<Resend["emails"]["send"]>>>;
  try {
    emailResults = await Promise.all([
      resend.emails.send({
        from: "Site DOS Advocacia <contato@dosadvocacia.com.br>",
        replyTo: data.email,
        subject: `Novo contato pelo site — ${data.demandType}`,
        text: notification,
        to: "drielle@dosadvocacia.com.br"
      }),
      resend.emails.send({
        from: "Site DOS Advocacia <contato@dosadvocacia.com.br>",
        subject: "Recebemos sua mensagem — DOS Advocacia Imobiliária",
        text: buildAutoreply(data.name),
        to: data.email
      })
    ]);
  } catch {
    return NextResponse.json({ error: "Não foi possível concluir o envio. Use o WhatsApp ou o e-mail do escritório." }, { status: 502 });
  }

  const [officeEmail, visitorEmail] = emailResults;
  if (officeEmail.error || visitorEmail.error) {
    return NextResponse.json({ error: "Não foi possível concluir o envio. Use o WhatsApp ou o e-mail do escritório." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
