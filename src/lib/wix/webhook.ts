import "server-only";

import { importSPKI, jwtVerify } from "jose";

type WixWebhookConfig = {
  publicKey: string;
};

function getWixWebhookConfig(): WixWebhookConfig | null {
  const publicKey = process.env.WIX_WEBHOOK_PUBLIC_KEY?.replace(/\\n/g, "\n");

  if (!publicKey) return null;

  return { publicKey };
}

export function isWixWebhookConfigured() {
  return getWixWebhookConfig() !== null;
}

export async function verifyWixWebhook(token: string) {
  const config = getWixWebhookConfig();
  if (!config) {
    throw new Error("Wix Blog webhook is not configured.");
  }

  const key = await importSPKI(config.publicKey, "RS256");

  return jwtVerify(token, key, {
    algorithms: ["RS256"]
  });
}
