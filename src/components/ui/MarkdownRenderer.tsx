import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split by double newlines or standard line breaks to get blocks
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className="prose-custom text-slate-300">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Heading 2: ## Heading
        if (trimmed.startsWith("## ")) {
          const text = trimmed.substring(3).trim();
          const id = text.toLowerCase()
            .replace(/[đ|Đ]/g, "d")
            .replace(/[š|Š]/g, "s")
            .replace(/[ć|Ć|č|Č]/g, "c")
            .replace(/[ž|Ž]/g, "z")
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
          return (
            <h2 key={index} id={id} className="scroll-mt-24 text-2xl font-bold font-display text-white mt-8 mb-4 border-l-4 border-primary pl-4">
              {parseInlineMarkdown(text)}
            </h2>
          );
        }

        // 2. Heading 3: ### Heading
        if (trimmed.startsWith("### ")) {
          const text = trimmed.substring(4).trim();
          const id = text.toLowerCase()
            .replace(/[đ|Đ]/g, "d")
            .replace(/[š|Š]/g, "s")
            .replace(/[ć|Ć|č|Č]/g, "c")
            .replace(/[ž|Ž]/g, "z")
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
          return (
            <h3 key={index} id={id} className="scroll-mt-24 text-xl font-bold font-display text-white mt-6 mb-3">
              {parseInlineMarkdown(text)}
            </h3>
          );
        }

        // 3. Blockquote: > text
        if (trimmed.startsWith("> ")) {
          const lines = trimmed.split("\n").map(line => line.substring(2).trim());
          return (
            <blockquote key={index} className="border-l-4 border-primary bg-primary/5 pl-6 py-3 my-6 italic text-white rounded-r-lg relative">
              {lines.map((line, lineIdx) => (
                <p key={lineIdx} className={lineIdx > 0 ? "mt-2" : ""}>
                  {parseInlineMarkdown(line)}
                </p>
              ))}
            </blockquote>
          );
        }

        // 4. Unordered List: - item or * item
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split("\n").map(item => {
            const content = item.replace(/^[-*]\s+/, "");
            return content.trim();
          });
          return (
            <ul key={index} className="list-disc pl-6 my-4 space-y-2">
              {items.map((item, itemIdx) => (
                <li key={itemIdx}>{parseInlineMarkdown(item)}</li>
              ))}
            </ul>
          );
        }

        // 5. Ordered List: 1. item
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split("\n").map(item => {
            const content = item.replace(/^\d+\.\s+/, "");
            return content.trim();
          });
          return (
            <ol key={index} className="list-decimal pl-6 my-4 space-y-2">
              {items.map((item, itemIdx) => (
                <li key={itemIdx}>{parseInlineMarkdown(item)}</li>
              ))}
            </ol>
          );
        }

        // 6. Image: ![alt](url)
        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
          const [, alt, src] = imgMatch;
          return (
            <div key={index} className="my-6 overflow-hidden rounded-xl border border-white/5 bg-slate-900 aspect-video relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="object-cover w-full h-full" />
            </div>
          );
        }

        // 7. Regular paragraph
        const lines = trimmed.split("\n");
        return (
          <p key={index} className="mb-4 leading-relaxed text-slate-300 text-lg">
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {lineIdx > 0 && <br />}
                {parseInlineMarkdown(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

// Simple regex parser for bold, italics, links
function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Regexes for inline styles
  // Bold: **text**
  // Italic: *text*
  // Link: [label](url)
  const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;
  const matches = text.split(inlineRegex);

  return matches.map((part, partIdx) => {
    // Bold matching
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={partIdx} className="text-white font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Italic matching
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={partIdx} className="italic">{part.slice(1, -1)}</em>;
    }
    // Link matching
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isExternal = url.startsWith("http");
      return (
        <a
          key={partIdx}
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-primary font-bold hover:underline transition-premium"
        >
          {label}
        </a>
      );
    }
    // Plain text
    return part;
  });
}
