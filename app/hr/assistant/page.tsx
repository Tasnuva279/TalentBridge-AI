"use client";

import { useState } from "react";
import { useAppData } from "@/lib/store";
import { AIChat } from "@/components/AIChat";
import { Avatar } from "@/components/Avatar";
import { aiHRSummary, aiExplainLetter } from "@/lib/ai";
import { Icon } from "@/components/Icons";

export default function HRAssistantPage() {
  const { data, hydrated } = useAppData();
  const [pickedId, setPickedId] = useState<string>("");
  const [letterTitle, setLetterTitle] = useState("");
  const [explanation, setExplanation] = useState("");

  if (!hydrated) return <div className="muted">Loading…</div>;

  const picked = data.employees.find((e) => e.id === pickedId);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
        <p className="text-sm text-slate-600">
          Get instant summaries, bureaucracy translations, and next-step suggestions across your team.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="section-title mb-3">Generate HR case summary</h2>
            <select
              value={pickedId}
              onChange={(e) => setPickedId(e.target.value)}
              className="input"
            >
              <option value="">Pick an employee…</option>
              {data.employees.map((e) => (
                <option key={e.id} value={e.id}>{e.fullName} · {e.role}</option>
              ))}
            </select>
            {picked && (
              <div className="mt-3 rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-100 p-3 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar name={picked.fullName} color={picked.avatarColor} size={28} />
                  <div className="font-semibold">{picked.fullName}</div>
                </div>
                <div className="whitespace-pre-wrap text-slate-700">
                  {aiHRSummary(picked, data.tasks)}
                </div>
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
              <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm whitespace-pre-wrap">
                {explanation}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <AIChat
            context={picked ? { employee: picked, tasks: data.tasks } : undefined}
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
