"use client";

import { useEffect, useState } from "react";

// Human-in-the-loop compliance disclaimer shown under every AI output.
export const AI_DISCLAIMER =
  "KI-gestützter Entwurf. Bitte vor der Weiterverarbeitung manuell prüfen.";

// Simulated streaming: reveals `text` progressively for a typing effect.
export function useTypewriter(text: string, enabled = true) {
  const [out, setOut] = useState(enabled ? "" : text);

  useEffect(() => {
    if (!enabled) {
      setOut(text);
      return;
    }
    setOut("");
    if (!text) return;
    let i = 0;
    // Reveal a few characters per tick so long answers still finish quickly.
    const step = Math.max(2, Math.round(text.length / 160));
    const id = setInterval(() => {
      i += step;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [text, enabled]);

  const done = out.length >= text.length;
  return { out, done };
}

// Tiny markdown-ish formatter: **bold** and line breaks.
export function formatMarkdown(text: string) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) => {
          if (p.startsWith("**") && p.endsWith("**")) {
            return (
              <strong key={j} className="font-semibold">
                {p.slice(2, -2)}
              </strong>
            );
          }
          return <span key={j}>{p}</span>;
        });
        return (
          <span key={i} className="block">
            {parts}
            {line === "" && <br />}
          </span>
        );
      })}
    </>
  );
}

function Caret() {
  return <span className="inline-block w-1.5 h-4 -mb-0.5 ml-0.5 bg-brand-700 animate-pulse" aria-hidden />;
}

// Standalone scannable AI output container with permanent disclaimer.
export function AIOutput({
  text,
  stream = true,
  className = "",
}: {
  text: string;
  stream?: boolean;
  className?: string;
}) {
  const { out, done } = useTypewriter(text, stream);
  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50 ${className}`}>
      <div className="p-4 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
        {formatMarkdown(out)}
        {!done && <Caret />}
      </div>
      <div className="px-4 py-2 border-t border-slate-200 bg-white rounded-b-xl">
        <p className="text-[11px] text-slate-400">{AI_DISCLAIMER}</p>
      </div>
    </div>
  );
}
