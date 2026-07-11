import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { WIX_BLOG_TAG, isWixBlogConfigured } from "@/lib/wix/blog";
import { isWixWebhookConfigured, verifyWixWebhook } from "@/lib/wix/webhook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isWixWebhookConfigured() || !isWixBlogConfigured()) {
    return NextResponse.json({ error: "Wix Blog webhook is not configured." }, { status: 503 });
  }

  const token = await request.text();
  if (!token) {
    return NextResponse.json({ error: "Webhook payload is required." }, { status: 400 });
  }

  try {
    await verifyWixWebhook(token);
  } catch {
    return NextResponse.json({ error: "Webhook signature is invalid." }, { status: 401 });
  }

  // The event is only a verified invalidation signal. The next request reloads the source from Wix.
  revalidateTag(WIX_BLOG_TAG, { expire: 0 });
  revalidatePath("/blog");
  revalidatePath("/post/[slug]", "page");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ revalidated: true });
}
