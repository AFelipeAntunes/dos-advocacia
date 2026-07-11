export type WixLink = {
  rel?: Record<string, boolean>;
  target?: string;
  url?: string;
};

export type WixTextDecoration = {
  linkData?: { link?: WixLink };
  type?: string;
};

export type WixRichContentNode = {
  blockquoteData?: Record<string, unknown>;
  headingData?: { level?: number };
  id?: string;
  imageData?: {
    altText?: string;
    image?: {
      height?: number;
      src?: { id?: string } | string;
      width?: number;
    };
  };
  nodes?: WixRichContentNode[];
  textData?: {
    decorations?: WixTextDecoration[];
    text?: string;
  };
  type?: string;
};

export type WixRichContent = {
  nodes?: WixRichContentNode[];
};

export type WixPostMedia = {
  displayed?: boolean;
  wixMedia?: {
    image?: {
      height?: number;
      id?: string;
      width?: number;
    };
  };
};

export type WixSeoData = {
  tags?: Array<{
    children?: Array<{ children?: string[]; props?: Record<string, string> }>;
    props?: Record<string, string>;
    type?: string;
  }>;
};

export type WixBlogPost = {
  categoryIds?: string[];
  contentText?: string;
  excerpt?: string;
  firstPublishedDate?: string;
  id?: string;
  lastPublishedDate?: string;
  media?: WixPostMedia;
  minutesToRead?: number;
  richContent?: WixRichContent;
  seoData?: WixSeoData;
  slug?: string;
  title?: string;
  url?: { base?: string; path?: string };
};
