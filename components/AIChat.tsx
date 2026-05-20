"use client";

import { useEffect, useRef, useState } from "react";
import { aiAnswer } from "@/lib/ai";
import { Employee, Task } from "@/lib/types";
import { Icon } from "./Icons";

type Msg = { id: string; from: "user" | "ai"; text: string };

const suggested = [
  "Explain Anmeldung step by step",
  "What do I need for an EU Blue Card?",
  "How do I open a German bank account?",
  "Translate a German letter for me",
  "Recommend health insurance options",
];

export function AIChat({
  context,
  intro,
  compact = false,
}: {
  context?: { employee?: Employee; tasks?: Task[] };
  intro?: string;
  compact?: boolean;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "intro",
      from: "ai",
      text:
        intro ??
        "Hi! I'm your TalentBridge assistant. I can explain German bureaucracy, translate letters, and suggest next steps. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    const u: Msg = { id: Math.random().toString(36).slice(2), from: "user", text };
    setMessages((m) => [...m, u]);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      const reply = aiAnswer(text, context);
      setMessages((m) => [
        ...m,
        { id: Math.random().toString(36).slice(2), from: "ai", text: reply },
      ]);
      setBusy(false);
    }, 600);
  };

  return (
    <div className={`flex flex-col ${compact ? "h-[420px]" : "h-[70vh]"} card overflow-hidden`}>
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
          {Icon.Sparkle}
        </span>
        <div>
          <div className="font-semibold text-sm">TalentBridge AI Assistant</div>
          <div className="text-[11px] text-slate-500">Mocked responses for demo — explains German bureaucracy in plain English.</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 bg-slate-50/40">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] ${m.from === "user" ? "ml-auto" : ""}`}
          >
            <div
              className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                m.from === "user"
                  ? "bg-brand-600 text-white rounded-tr-sm"
                  : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
              }`}
            >
              {formatMarkdown(m.text)}
            </div>
          </div>
        ))}
        {busy && (
          <div className="max-w-[60%]">
            <div className="rounded-2xl px-4 py-3 text-sm bg-white border border-slate-200 text-slate-500 inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:120ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:240ms]" />
              Thinking…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-4 py-2 border-t border-slate-100 bg-white">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-2">
          {suggested.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about moving to Germany…"
            className="input flex-1"
          />
          <button type="submit" className="btn-primary" disabled={busy}>
            {Icon.Send}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// Tiny markdown-ish formatter: **bold**, list items prefixed by - or numbers, and line breaks.
function formatMarkdown(text: string) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        // bold
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
