import type { WixRichContent, WixRichContentNode, WixTextDecoration } from "@/lib/wix/types";

export type WixRichTextRun = {
  bold: boolean;
  href?: string;
  italic: boolean;
  target?: string;
  text: string;
  underline: boolean;
};

type TextBlock = {
  id: string;
  runs: WixRichTextRun[];
};

export type WixRichContentBlock =
  | (TextBlock & { kind: "blockquote" })
  | (TextBlock & { kind: "heading"; level: number })
  | (TextBlock & { kind: "paragraph" })
  | { alt?: string; height?: number; id: string; kind: "image"; src?: string; width?: number };

function decorationsOf(node: WixRichContentNode) {
  return node.textData?.decorations ?? [];
}

function hasDecoration(decorations: WixTextDecoration[], type: string) {
  return decorations.some((decoration) => decoration.type === type);
}

function linkDecoration(decorations: WixTextDecoration[]) {
  return decorations.find((decoration) => decoration.type === "LINK")?.linkData?.link;
}

function textRuns(nodes?: WixRichContentNode[]): WixRichTextRun[] {
  return (nodes ?? []).flatMap((node) => {
    if (node.type !== "TEXT" || !node.textData?.text) return textRuns(node.nodes);

    const decorations = decorationsOf(node);
    const link = linkDecoration(decorations);
    const run: WixRichTextRun = {
      bold: hasDecoration(decorations, "BOLD"),
      italic: hasDecoration(decorations, "ITALIC"),
      text: node.textData.text,
      underline: hasDecoration(decorations, "UNDERLINE")
    };

    if (link?.url) run.href = link.url;
    if (link?.target) run.target = link.target;

    return [run];
  });
}

function imageSource(node: WixRichContentNode) {
  const source = node.imageData?.image?.src;
  return typeof source === "string" ? source : source?.id;
}

function blocksFromNodes(nodes?: WixRichContentNode[], prefix = "block"): WixRichContentBlock[] {
  return (nodes ?? []).flatMap((node, index) => {
    const id = node.id || `${prefix}-${index}`;

    if (node.type === "IMAGE") {
      return [{
        alt: node.imageData?.altText,
        height: node.imageData?.image?.height,
        id,
        kind: "image" as const,
        src: imageSource(node),
        width: node.imageData?.image?.width
      }];
    }

    if (node.type === "HEADING") {
      return [{ id, kind: "heading" as const, level: node.headingData?.level ?? 2, runs: textRuns(node.nodes) }];
    }

    if (node.type === "BLOCKQUOTE") {
      return [{ id, kind: "blockquote" as const, runs: textRuns(node.nodes) }];
    }

    if (node.type === "PARAGRAPH") {
      return [{ id, kind: "paragraph" as const, runs: textRuns(node.nodes) }];
    }

    return blocksFromNodes(node.nodes, id);
  }).filter((block) => block.kind === "image" || block.runs.length > 0);
}

export function getWixRichContentBlocks(content?: WixRichContent, fallback?: string) {
  const blocks = blocksFromNodes(content?.nodes);
  if (blocks.length > 0) return blocks;

  return (fallback ?? "Conteúdo em atualização.")
    .split(/\n{2,}/)
    .map((text, index) => ({
      id: `fallback-${index}`,
      kind: "paragraph" as const,
      runs: [{ bold: false, italic: false, text: text.trim(), underline: false }]
    }))
    .filter((block) => block.runs[0].text.length > 0);
}

export function resolveWixImageUrl(source?: string) {
  if (!source) return undefined;
  if (/^https:\/\//i.test(source)) {
    try {
      const url = new URL(source);
      return url.hostname === "static.wixstatic.com" ? url.toString() : undefined;
    } catch {
      return undefined;
    }
  }

  const mediaId = source
    .replace(/^wix:image:\/\/v1\//i, "")
    .split("/")[0]
    .trim();

  return mediaId ? `https://static.wixstatic.com/media/${mediaId}` : undefined;
}
