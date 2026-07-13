import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { WIX_BLOG_TAG } from "@/lib/wix/blog";
import {
  isAuthorizedWixRevalidation,
  isWixRevalidationConfigured
} from "@/lib/wix/revalidation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isWixRevalidationConfigured()) {
    return NextResponse.json({ error: "Blog revalidation is not configured." }, { status: 503 });
  }

  if (!isAuthorizedWixRevalidation(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // An edit can affect the listing, article URL, metadata, and sitemap.
  revalidateTag(WIX_BLOG_TAG, { expire: 0 });
  revalidatePath("/blog");
  revalidatePath("/post/[slug]", "page");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ revalidated: true });
}
