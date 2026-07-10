import "server-only";

import { importSPKI, jwtVerify } from "jose";

type WixWebhookConfig = {
  appId: string;
  publicKey: string;
};

function getWixWebhookConfig(): WixWebhookConfig | null {
  const appId = process.env.WIX_APP_ID;
  const publicKey = process.env.WIX_WEBHOOK_PUBLIC_KEY?.replace(/\\n/g, "\n");

  if (!appId || !publicKey) return null;

  return { appId, publicKey };
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
    algorithms: ["RS256"],
    audience: config.appId,
    issuer: "wix.com",
    clockTolerance: 60,
    maxTokenAge: "60s"
  });
}
