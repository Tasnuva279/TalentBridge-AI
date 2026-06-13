"use client";

import { useState } from "react";
import { useAppData } from "@/lib/store";
import { AIChat } from "@/components/AIChat";
import { AIOutput } from "@/components/AIResponse";
import { Avatar } from "@/components/Avatar";
import { aiHRSummary, aiExplainLetter } from "@/lib/ai";
import { Icon } from "@/components/Icons";

const rapidPrompts = [
  "Explain the EU Blue Card process",
  "How does Anmeldung work?",
  "Summarise health insurance options",
  "What documents are needed to open a bank account?",
  "Translate a German tax letter",
];

export default function HRAssistantPage() {
  const { data, hydrated } = useAppData();
  const [pickedId, setPickedId] = useState<string>("");
  const [summaryText, setSummaryText] = useState("");
  const [letterTitle, setLetterTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [ask, setAsk] = useState<{ text: string; nonce: number }>({ text: "", nonce: 0 });

  if (!hydrated) return <div className="muted">Loading…</div>;

  const picked = data.employees.find((e) => e.id === pickedId);
  const pushToChat = (text: string) => setAsk((a) => ({ text, nonce: a.nonce + 1 }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
        <p className="text-sm text-slate-600">
          Rapid bureaucracy actions on the left, a live chat thread on the right.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 items-start">
        {/* LEFT — Interactive rapid-action query panel */}
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="section-title mb-3">Rapid actions</h2>
            <div className="flex flex-wrap gap-2">
              {rapidPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => pushToChat(p)}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1.5"
                >
                  {Icon.Sparkle}
                  {p}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Sends the query into the chat thread on the right.
            </p>
          </div>

          <div className="card p-5">
            <h2 className="section-title mb-3">Generate HR case summary</h2>
            <div className="flex gap-2">
              <select
                value={pickedId}
                onChange={(e) => {
                  setPickedId(e.target.value);
                  setSummaryText("");
                }}
                className="input"
              >
                <option value="">Pick an employee…</option>
                {data.employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.fullName} · {e.role}</option>
                ))}
              </select>
              <button
                onClick={() => picked && setSummaryText(aiHRSummary(picked, data.tasks))}
                disabled={!picked}
                className={`btn-primary whitespace-nowrap ${!picked ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {Icon.Sparkle} Generate
              </button>
            </div>
            {picked && summaryText && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar name={picked.fullName} color={picked.avatarColor} size={26} />
                  <div className="text-sm font-semibold">{picked.fullName}</div>
                </div>
                <AIOutput key={picked.id} text={summaryText} />
              </div>
            )}
          </div>

          <div className="card p-5">
            <h2 className="section-title mb-3">Translate a German letter</h2>
            <label className="label">Letter title or first line</label>
            <input
              value={letterTitle}
              onChange={(e) => setLetterTitle(e.target.value)}
              placeholder="e.g. Beitragsbescheid Krankenkasse"
              className="input"
            />
            <button
              onClick={() => setExplanation(aiExplainLetter(letterTitle || "(untitled letter)"))}
              className="btn-primary mt-3 w-full"
            >
              {Icon.Sparkle} Explain in plain English
            </button>
            {explanation && (
              <div className="mt-3">
                <AIOutput key={explanation} text={explanation} />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Dedicated historical chat thread */}
        <div className="lg:sticky lg:top-6">
          <AIChat
            context={picked ? { employee: picked, tasks: data.tasks } : undefined}
            ask={ask}
            intro={
              picked
                ? `I have context on ${picked.fullName} — ${picked.role} from ${picked.countryOfOrigin}, now in ${picked.city}. Ask me anything about their case.`
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
