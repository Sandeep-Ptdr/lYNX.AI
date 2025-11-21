import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";  
import { Copy, Check } from "lucide-react";
 
export default function CopyBtn({ inline, className, children, ...props }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  async function handleCopy() {
    try {
       
      const textToCopy =
        codeRef.current?.innerText?.replace(/\u00A0/g, " ") ||  
        String(children).replace(/\n$/, "");

      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // fallback for old browsers
        const ta = document.createElement("textarea");
        ta.value = textToCopy;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopied(true);
    } catch (e) {
      console.error("Copy failed", e);
    }
  }

  // Inline code case
  if (inline) {
    return (
      <span className="relative inline-flex items-center group">
        <code
          ref={codeRef}
          className="px-1 py-[0.15rem] rounded bg-gray-900 text-yellow-200 text-sm"
          {...props}
        >
          {children}
        </code>

        <button
          aria-label="Copy inline code"
          onClick={handleCopy}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs "
          title="Copy"
          type="button"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </span>
    );
  }

  // Block code case
  return (
    <div className="relative group my-3">
      <div className="absolute right-2 top-2 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          onClick={handleCopy}
          aria-label="Copy code block"
          className="inline-flex items-center gap-2 cursor-pointer rounded"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-xs">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </div>

      <pre className="bg-[#0B1220] rounded-md p-3 text-sm overflow-x-auto scrollbar-hide">
        
        <code ref={codeRef} className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}





