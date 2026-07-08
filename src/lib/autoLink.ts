export interface AutoLinkEntity {
  name: string;
  slug: string;
}

/**
 * Automatically wraps mentions of fighter names in Markdown link syntax,
 * avoiding already existing markdown links, image tags, and code blocks.
 */
export function autoLinkFighters(text: string, entities: AutoLinkEntity[]): string {
  if (!text || !entities || entities.length === 0) return text;

  // 1. Temporarily extract code blocks and existing links to avoid modifying them
  const codeBlocks: string[] = [];
  const existingLinks: string[] = [];
  const images: string[] = [];

  let processedText = text;

  // Extract code blocks (``` ... ```)
  processedText = processedText.replace(/(```[\s\S]*?```)/g, (match) => {
    codeBlocks.push(match);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  // Extract inline code (` ... `)
  processedText = processedText.replace(/(`[^`\n]+`)/g, (match) => {
    codeBlocks.push(match);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  // Extract markdown images (![alt](src))
  processedText = processedText.replace(/(!\[.*?\]\(.*?\))/g, (match) => {
    images.push(match);
    return `___IMAGE_${images.length - 1}___`;
  });

  // Extract existing markdown links ([text](url))
  processedText = processedText.replace(/(\[.*?\]\(.*?\))/g, (match) => {
    existingLinks.push(match);
    return `___LINK_${existingLinks.length - 1}___`;
  });

  // 2. Sort entities by length descending to match longer names (e.g. "Jon Jones") before shorter substrings
  const sortedEntities = [...entities].sort((a, b) => b.name.length - a.name.length);

  // Keep track of what we replaced to avoid double-linking
  const replacedNames = new Set<string>();

  for (const entity of sortedEntities) {
    if (!entity.name || !entity.slug) continue;

    // Avoid double matching or linking parts of names
    const escapedName = entity.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    
    // We match the name only if it has boundaries: not preceded/followed by letters/numbers/hyphens
    // Using lookbehind/lookahead for word boundaries including Croatian characters
    const regex = new RegExp(`(?<![a-zA-Z0-9šŠđĐčČćĆžŽ-])${escapedName}(?![a-zA-Z0-9šŠđĐčČćĆžŽ-])`, "g");

    if (regex.test(processedText)) {
      processedText = processedText.replace(regex, `[${entity.name}](/borci/${entity.slug})`);
      replacedNames.add(entity.name);
    }
  }

  // 3. Restore links, images, and code blocks in reverse order
  processedText = processedText.replace(/___LINK_(\d+)___/g, (_, index) => {
    return existingLinks[parseInt(index, 10)];
  });

  processedText = processedText.replace(/___IMAGE_(\d+)___/g, (_, index) => {
    return images[parseInt(index, 10)];
  });

  processedText = processedText.replace(/___CODE_BLOCK_(\d+)___/g, (_, index) => {
    return codeBlocks[parseInt(index, 10)];
  });

  return processedText;
}
