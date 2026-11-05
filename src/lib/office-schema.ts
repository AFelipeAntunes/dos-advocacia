const officeName = "Drielle Pereira Advocacia Imobiliária";
const googleProfile = "https://share.google/HDZRAYV5GDRVEH6Fa";

export const officeLegalService = {
  "@type": "LegalService",
  name: officeName,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. do Batel, 1230, Conj. 508, Batel",
    addressLocality: "Curitiba",
    addressRegion: "PR",
    addressCountry: "BR",
    postalCode: "80420-907"
  },
  sameAs: [googleProfile]
};

export function alignOfficeJsonLd(schema: string): string {
  const data: unknown = JSON.parse(schema, (_key, node) => {
    if (node?.["@type"] === "LegalService") {
      return {
        ...node,
        ...officeLegalService,
        address: { ...officeLegalService.address, ...node.address, postalCode: officeLegalService.address.postalCode },
        sameAs: [...new Set([...(Array.isArray(node.sameAs) ? node.sameAs : []), googleProfile])]
      };
    }
    if (node?.["@type"] === "WebSite" && node.name === "DOS Advocacia Imobiliária") {
      return { ...node, name: officeName };
    }
    return node;
  });
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
