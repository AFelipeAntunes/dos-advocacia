import Image from "next/image";
import type { ReactNode } from "react";

import { getWixRichContentBlocks, resolveWixImageUrl, type WixRichContentBlock } from "@/lib/wix/rich-content";
import type { WixRichContentNode } from "@/lib/wix/types";

type WixRichContentProps = {
  content?: { nodes?: WixRichContentNode[] };
  fallback?: string;
};

type WixTextContentBlock = Exclude<WixRichContentBlock, { kind: "image" }>;

function InlineContent({ block }: { block: WixTextContentBlock }) {
  return block.runs.map((run, index) => {
    const key = `${block.id}-${index}`;
    let content: ReactNode = run.text;

    if (run.bold) content = <strong key={key}>{content}</strong>;
    if (run.italic) content = <em key={key}>{content}</em>;
    if (run.underline) content = <u key={key}>{content}</u>;

    if (!run.href) return <span key={key}>{content}</span>;

    const isExternal = /^https?:\/\//i.test(run.href);
    return (
      <a
        href={run.href}
        key={key}
        rel={isExternal ? "noreferrer noopener" : undefined}
        target={run.target === "BLANK" ? "_blank" : undefined}
      >
        {content}
      </a>
    );
  });
}

export function WixRichContent({ content, fallback }: WixRichContentProps) {
  const blocks = getWixRichContentBlocks(content, fallback);

  return (
    <>
      {blocks.map((block) => {
        if (block.kind === "image") {
          const src = resolveWixImageUrl(block.src);
          if (!src) return null;

          return (
            <figure className="article__figure" key={block.id}>
              <Image
                alt={block.alt || "Imagem do artigo"}
                height={block.height ?? 700}
                sizes="(max-width: 760px) 100vw, 760px"
                src={src}
                width={block.width ?? 1200}
              />
            </figure>
          );
        }

        if (block.kind === "heading") {
          const Heading = (`h${Math.min(Math.max(block.level, 2), 4)}` as "h2" | "h3" | "h4");
          return <Heading key={block.id}><InlineContent block={block} /></Heading>;
        }

        if (block.kind === "blockquote") {
          return <blockquote key={block.id}><InlineContent block={block} /></blockquote>;
        }

        return <p key={block.id}><InlineContent block={block} /></p>;
      })}
    </>
  );
}
