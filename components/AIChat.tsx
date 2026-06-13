"use client";

import { useEffect, useRef, useState } from "react";
import { aiAnswer } from "@/lib/ai";
import { Employee, Task } from "@/lib/types";
import { Icon } from "./Icons";
import { AI_DISCLAIMER, formatMarkdown, useTypewriter } from "./AIResponse";

type Msg = { id: string; from: "user" | "ai"; text: string; stream: boolean };

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
  ask,
}: {
  context?: { employee?: Employee; tasks?: Task[] };
  intro?: string;
  compact?: boolean;
  // External trigger: bump `nonce` to push a prompt into the thread.
  ask?: { text: string; nonce: number };
}) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "intro",
      from: "ai",
      stream: false,
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

  // Send a prompt pushed in from an external rapid-action panel.
  useEffect(() => {
    if (ask && ask.nonce > 0) send(ask.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ask?.nonce]);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    const u: Msg = { id: Math.random().toString(36).slice(2), from: "user", text, stream: false };
    setMessages((m) => [...m, u]);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      const reply = aiAnswer(text, context);
      setMessages((m) => [
        ...m,
        { id: Math.random().toString(36).slice(2), from: "ai", text: reply, stream: true },
      ]);
      setBusy(false);
    }, 550);
  };

  return (
    <div className={`flex flex-col ${compact ? "h-[420px]" : "h-[70vh]"} surface overflow-hidden`}>
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-900 text-white">
          {Icon.Sparkle}
        </span>
        <div>
          <div className="font-semibold text-sm">TalentBridge AI Assistant</div>
          <div className="text-[11px] text-slate-500">Mocked responses for demo — explains German bureaucracy in plain English.</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 bg-slate-50/40">
        {messages.map((m) =>
          m.from === "user" ? (
            <div key={m.id} className="max-w-[85%] ml-auto">
              <div className="rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap bg-brand-900 text-white rounded-tr-sm">
                {m.text}
              </div>
            </div>
          ) : (
            <AIBubble key={m.id} text={m.text} stream={m.stream} onStream={() => endRef.current?.scrollIntoView()} />
          )
        )}
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

function AIBubble({ text, stream, onStream }: { text: string; stream: boolean; onStream?: () => void }) {
  const { out, done } = useTypewriter(text, stream);

  useEffect(() => {
    onStream?.();
  }, [out, onStream]);

  return (
    <div className="max-w-[85%]">
      <div className="rounded-2xl px-4 py-3 text-sm bg-white border border-slate-200 text-slate-800 rounded-tl-sm">
        <div className="whitespace-pre-wrap">
          {formatMarkdown(out)}
          {!done && <span className="inline-block w-1.5 h-4 -mb-0.5 ml-0.5 bg-brand-700 animate-pulse" aria-hidden />}
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">{AI_DISCLAIMER}</p>
        </div>
      </div>
    </div>
  );
}
