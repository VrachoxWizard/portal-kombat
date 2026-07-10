import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { slugify } from "@/lib/slugify";
import { autoLinkFighters, type AutoLinkEntity } from "@/lib/autoLink";

interface MarkdownRendererProps {
  content: string;
  fighters?: AutoLinkEntity[];
}

export function MarkdownRenderer({ content, fighters = [] }: MarkdownRendererProps) {
  if (!content) return null;

  const processedContent = autoLinkFighters(content, fighters);

  return (
    <div className="prose-custom text-slate-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ children }) => (
            <h1 className="scroll-mt-24 text-3xl font-bold font-display text-white mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => {
            const text = String(children);
            const id = slugify(text);
            return (
              <h2
                id={id}
                className="scroll-mt-24 text-2xl font-bold font-display text-white mt-8 mb-4 border-l-4 border-primary pl-4"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = String(children);
            const id = slugify(text);
            return (
              <h3
                id={id}
                className="scroll-mt-24 text-xl font-bold font-display text-white mt-6 mb-3"
              >
                {children}
              </h3>
            );
          },
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-slate-300 text-lg">{children}</p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary bg-primary-ember pl-6 pr-4 py-4 my-6 italic text-white rounded-none border-y border-r border-white/5 shadow-[var(--shadow-card)] accent-edge-glow relative">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>
          ),
          a: ({ href, children }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-primary font-bold animated-link transition-premium"
              >
                {children}
              </a>
            );
          },
          strong: ({ children }) => (
            <strong className="text-white font-bold">{children}</strong>
          ),
          img: ({ src, alt }) => (
            <div className="bezel-outer my-6 overflow-hidden hover:shadow-[0_0_15px_var(--primary-glow)] transition-all duration-300">
              <div className="bezel-inner overflow-hidden bg-slate-950 aspect-video relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt ?? ""} className="object-cover w-full h-full transition-transform duration-500 hover:scale-[1.02]" />
              </div>
            </div>
          ),
          code: ({ children }) => (
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-red-300">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-xl bg-slate-900 border border-white/10 p-4 text-sm">
              {children}
            </pre>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
