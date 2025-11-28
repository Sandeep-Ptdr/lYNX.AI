// components/ChatMessage.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import CopyBtn from "./CopyBtn";
// Optional (only if you trust content & want HTML in markdown):
// import rehypeRaw from "rehype-raw";
// import rehypeSanitize from "rehype-sanitize";

import "highlight.js/styles/github-dark.css"; // choose a theme you like

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Heuristic normalizer:
 * - unescape HTML entities (so '#', '<', etc. render correctly)
 * - unescape backslash-escaped markdown
 * - detect contiguous code-like lines and wrap them in ```js fences if missing
 *
 * This is conservative — it only wraps multi-line code-like blocks (2+ lines)
 * and leaves other text alone.
 */
function normalizeContent(raw = "") {
  if (!raw) return "";

  let content = String(raw);

  // 1) Unescape simple backslash-escaped markdown/backticks:
  content = content.replace(/\\([`*_~\\])/g, "$1"); // \` -> ` , \* -> *

  // 2) Unescape basic HTML entities using browser textarea (safe, simple)
  //    Works only in browser (SSR guard).
  if (typeof document !== "undefined") {
    try {
      const ta = document.createElement("textarea");
      ta.innerHTML = content;
      content = ta.value;
    } catch (e) {
      /* ignore and continue */
    }
  } else {
    // simple replacements for SSR fallback
    content = content
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  // 3) If there are already fenced code blocks, don't try to wrap inside them.
  // We'll only attempt to auto-wrap code-like contiguous line groups when no triples exist inside that group.
  const lines = content.split(/\r?\n/);

  const isCodeLikeLine = (line) => {
    // Heuristics: contains semicolon, common keywords, arrow, braces, console, or looks like an import/JSX tag
    const trimmed = line.trim();
    if (!trimmed) return false;
    const scorePatterns = [
      /^\s*<\/?[A-Za-z][^>]*>/, // html/jsx tag
      /;\s*$/, // ends with semicolon
      /\b(function|const|let|var|class|import|export|return|await|async|switch|case)\b/,
      /=>/, // arrow fn
      /\bconsole\.(log|error|warn)\b/,
      /{\s*$/, // opening brace at EOL
      /^\s*\/\/|^\s*\/\*/, // comment lines
      /<\w+.*>/, // JSX-like
      /^\s*[A-Za-z_$][A-Za-z0-9_$]*\s*\(.*\)\s*\{?$/, // fn definition line
    ];
    return scorePatterns.some((rx) => rx.test(line));
  };

  let outLines = [];
  let i = 0;
  while (i < lines.length) {
    // If this line begins an existing fenced code block (```), copy through until closing fence
    if (/^\s*```/.test(lines[i])) {
      outLines.push(lines[i]);
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        outLines.push(lines[i]);
        i++;
      }
      // include closing fence if present
      if (i < lines.length) {
        outLines.push(lines[i]);
        i++;
      }
      continue;
    }

    // Detect contiguous code-like region
    let j = i;
    let seq = [];
    while (j < lines.length && isCodeLikeLine(lines[j])) {
      seq.push(lines[j]);
      j++;
    }

    // If we found >= 2 contiguous code-like lines and there was no fenced code inside,
    // wrap them in a fenced block. This avoids wrapping single short lines like "const x = 1;"
    if (seq.length >= 2) {
      // Avoid wrapping if the sequence already contains backticks (rare)
      const hasBacktickFence = seq.some((l) => /```/.test(l));
      if (!hasBacktickFence) {
        outLines.push("```js");
        outLines.push(...seq);
        outLines.push("```");
      } else {
        outLines.push(...seq);
      }
      i = j;
      continue;
    }

    // Otherwise, copy the current line as-is
    outLines.push(lines[i]);
    i++;
  }

  content = outLines.join("\n");

  // Trim only trailing spaces not to alter message formatting
  return content;
}

 
export default function ChatMessage({ role = "assistant", content = "" }) {
  const normalized = normalizeContent(content);
// { console.log(normalized); }
  return (
    <div
      className={`flex gap-2 mt-2 items-start  ${
        role === "assistant" ? "" : "flex-row-reverse"
      }`}
    >
      {/* Avatar */}
      <div className="md:flex hidden">
        <Avatar>
          <AvatarImage
            loading="lazy"
            src={
              role === "assistant"
                ? "https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg"
                : "https://github.com/shadcn.png"
            }
            alt={role === "assistant" ? "Assistant" : "User"}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      {/* Message bubble - kept your classes intact */}
      <div
        className={`md:max-w-[72%] max-w-full w-fit rounded-2xl break-words overflow-x-auto scrollbar-hide  ${
          role === "user"
            ? "ml-auto bg-[#0F172B] text-white p-3"
            : "mr-auto bg-gradient-to-br from-gray-800/70 to-gray-700/60 text-gray-100 p-3"
        }`}
      >
        
        <ReactMarkdown
          // Plugins
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeHighlight /*, rehypeRaw, rehypeSanitize */]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-lg font-semibold my-2" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-base font-semibold my-1" {...props} />
            ),
              code: (props) => <CopyBtn {...props} />,
            p: ({ node, ...props }) => (
              <p className="text-sm leading-relaxed my-1" {...props} />
            ),
            ul: ({ node, ...props }) => <ul className="list-disc ml-5" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal ml-5" {...props} />,
            table: ({ node, ...props }) => (
              <div className="  my-2">
                <table className="min-w-full table-fixed text-sm" {...props} />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th className="text-left py-1 px-2 bg-gray-900/20" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="py-1 px-2 align-top" {...props} />
            ),
          }}
        >
          {normalized}
        </ReactMarkdown>
      </div>
    </div>
  );
}




