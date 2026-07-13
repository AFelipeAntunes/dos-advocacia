import { timingSafeEqual } from "node:crypto";

function getRevalidationSecret() {
  return process.env.WIX_REVALIDATION_SECRET ?? "";
}

function safeCompare(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return expectedBuffer.length === receivedBuffer.length
    && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function isWixRevalidationConfigured() {
  return Boolean(getRevalidationSecret());
}

export function isAuthorizedWixRevalidation(request: Request) {
  const secret = getRevalidationSecret();
  if (!secret) return false;

  const authorization = request.headers.get("authorization");
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const headerToken = request.headers.get("x-revalidation-secret") ?? "";

  return safeCompare(secret, bearerToken) || safeCompare(secret, headerToken);
}
