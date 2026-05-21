import React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface BlogContentRendererProps {
  content: string;
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  const formatInlineText = (text: string): React.ReactNode[] => {
    const tokens: React.ReactNode[] = [];

    // Combined regex to find:
    // 1. **bold** -> (\*\*.*?\*\*)
    // 2. [text](url) -> (\[.*?\]\(.*?\))
    // 3. [cta text] -> (\[.*?\])
    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\)|\[.*?\])/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      const matchStr = match[0];

      // Add preceding plain text
      if (matchIndex > lastIndex) {
        tokens.push(text.substring(lastIndex, matchIndex));
      }

      if (matchStr.startsWith("**") && matchStr.endsWith("**")) {
        const boldText = matchStr.slice(2, -2);
        tokens.push(
          <strong key={matchIndex} className="font-bold text-foreground">
            {boldText}
          </strong>,
        );
      } else if (matchStr.includes("](")) {
        // Markdown link: [text](url)
        const linkMatch = matchStr.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const linkText = linkMatch[1];
          let url = linkMatch[2];

          // Clean up file:// and file:/// paths (common in generated posts)
          if (url.startsWith("file:///")) {
            url = url.replace("file://", "");
          } else if (url.startsWith("file://")) {
            url = url.replace("file://", "");
          }

          const isExternal =
            url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("tel:");

          if (isExternal) {
            tokens.push(
              <a
                key={matchIndex}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                {linkText}
              </a>,
            );
          } else {
            tokens.push(
              <Link
                key={matchIndex}
                to={url as any}
                className="text-primary hover:underline font-semibold"
              >
                {linkText}
              </Link>,
            );
          }
        }
      } else if (matchStr.startsWith("[") && matchStr.endsWith("]")) {
        // CTA link without URL: [text]
        const linkText = matchStr.slice(1, -1);
        tokens.push(
          <Link
            key={matchIndex}
            to="/signup"
            className="text-primary hover:underline font-semibold"
          >
            {linkText}
          </Link>,
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push(text.substring(lastIndex));
    }

    return tokens.length > 0 ? tokens : [text];
  };

  const renderList = (
    list: { type: "ul" | "ol"; items: string[] },
    key: number,
  ): React.ReactNode => {
    if (list.type === "ul") {
      return (
        <ul key={key} className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          {list.items.map((item, idx) => (
            <li key={idx} className="pl-2">
              {formatInlineText(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <ol key={key} className="list-decimal pl-6 mb-6 space-y-2 text-muted-foreground">
          {list.items.map((item, idx) => (
            <li key={idx} className="pl-2">
              {formatInlineText(item)}
            </li>
          ))}
        </ol>
      );
    }
  };

  const lines = content.split(/\r?\n/);
  const renderedElements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "") {
      if (currentList) {
        renderedElements.push(renderList(currentList, renderedElements.length));
        currentList = null;
      }
      continue;
    }

    // Match Headings
    const h3Match = line.match(/^###\s+(.*)/);
    const h2Match = line.match(/^##\s+(?:H2:\s*)?(.*)/);

    if (h2Match) {
      if (currentList) {
        renderedElements.push(renderList(currentList, renderedElements.length));
        currentList = null;
      }
      renderedElements.push(
        <h2
          key={renderedElements.length}
          className="text-2xl md:text-3xl font-display font-black text-foreground mt-12 mb-6 tracking-tight"
        >
          {formatInlineText(h2Match[1])}
        </h2>,
      );
      continue;
    }

    if (h3Match) {
      if (currentList) {
        renderedElements.push(renderList(currentList, renderedElements.length));
        currentList = null;
      }
      renderedElements.push(
        <h3
          key={renderedElements.length}
          className="text-xl md:text-2xl font-display font-bold text-foreground mt-8 mb-4 tracking-tight"
        >
          {formatInlineText(h3Match[1])}
        </h3>,
      );
      continue;
    }

    // Match List Items
    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    const numberMatch = line.match(/^(\d+)\.\s+(.*)/);

    if (bulletMatch) {
      const itemContent = bulletMatch[1];
      if (!currentList || currentList.type !== "ul") {
        if (currentList) {
          renderedElements.push(renderList(currentList, renderedElements.length));
        }
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(itemContent);
      continue;
    }

    if (numberMatch) {
      const itemContent = numberMatch[2];
      if (!currentList || currentList.type !== "ol") {
        if (currentList) {
          renderedElements.push(renderList(currentList, renderedElements.length));
        }
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(itemContent);
      continue;
    }

    // Standard paragraph or CTA row
    if (currentList) {
      renderedElements.push(renderList(currentList, renderedElements.length));
      currentList = null;
    }

    // Match CTA rows like [Get Started Free] | [Watch 3-Min Demo]
    const isCtaRow = /^\s*(?:\[[^\]]+\]\s*(?:\|\s*|$\s*))+$/.test(line);
    if (isCtaRow) {
      const buttonMatches = [...line.matchAll(/\[([^\]]+)\]/g)];
      const buttons = buttonMatches.map((m) => m[1]);
      renderedElements.push(
        <div
          key={renderedElements.length}
          className="flex flex-wrap gap-4 my-8 justify-center sm:justify-start"
        >
          {buttons.map((btnText, btnIdx) => {
            const isSecondary = btnIdx > 0;
            return (
              <Button
                key={btnIdx}
                variant={isSecondary ? "outline" : "default"}
                size="lg"
                className={
                  !isSecondary
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    : "border-primary/20 text-foreground hover:bg-primary/10 hover:border-primary/40 font-semibold"
                }
                asChild
              >
                <Link to="/signup">{btnText}</Link>
              </Button>
            );
          })}
        </div>,
      );
      continue;
    }

    // Special styling for callouts starting with emoji
    const isCallout = line.startsWith("🚀");
    if (isCallout) {
      renderedElements.push(
        <div
          key={renderedElements.length}
          className="my-8 p-6 glass rounded-2xl border border-primary/20 bg-primary/5 shadow-glow-sm"
        >
          <p className="text-lg leading-relaxed text-foreground m-0">{formatInlineText(line)}</p>
        </div>,
      );
    } else {
      renderedElements.push(
        <p key={renderedElements.length} className="mb-6 text-muted-foreground leading-relaxed">
          {formatInlineText(line)}
        </p>,
      );
    }
  }

  // Push remaining list if any
  if (currentList) {
    renderedElements.push(renderList(currentList, renderedElements.length));
  }

  return <div className="space-y-6">{renderedElements}</div>;
}
