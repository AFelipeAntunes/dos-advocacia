import { resolveWixImageUrl } from "@/lib/wix/rich-content";
import type { WixBlogPost } from "@/lib/wix/types";

/** Reads only the string title tag documented by the Wix Blog SEO fieldset. */
export function getPostSeoTitle(post: WixBlogPost) {
  const tags = post.seoData?.tags;
  if (!Array.isArray(tags)) return undefined;

  for (const tag of tags) {
    if (tag?.type !== "title" || tag.disabled === true || typeof tag.children !== "string") continue;
    const title = tag.children.trim();
    if (title) return title;
  }
  return undefined;
}

function seoTagContent(post: WixBlogPost, property: string) {
  for (const tag of post.seoData?.tags ?? []) {
    const props = tag.props ?? {};
    if (props.name === property || props.property === property) {
      return props.content;
    }
  }
  return undefined;
}

export function getPostDescription(post: WixBlogPost) {
  return seoTagContent(post, "description") ?? post.excerpt ?? getSummary(post.contentText) ?? "Conteúdo da DOS Advocacia Imobiliária.";
}

export function getPostImageUrl(post: WixBlogPost) {
  return resolveWixImageUrl(post.media?.wixMedia?.image?.id);
}

export function getSummary(content?: string) {
  if (!content) return undefined;
  return content.length > 160 ? `${content.slice(0, 157).trim()}…` : content;
}
