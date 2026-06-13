"use client";

import { useState } from "react";
import { AIChat } from "@/components/AIChat";
import { AIOutput } from "@/components/AIResponse";
import { useAppData } from "@/lib/store";
import { aiExplainLetter } from "@/lib/ai";
import { Icon } from "@/components/Icons";

const faqs = [
  {
    q: "What is Anmeldung and when do I do it?",
    a: "Anmeldung is the official registration of your address. You must do it within 14 days of moving into your permanent address. Book an appointment at your local Bürgeramt and bring passport, rental contract, and Wohnungsgeberbestätigung from your landlord.",
  },
  {
    q: "Do I need to speak German on day 1?",
    a: "No. Most international workplaces in Germany operate in English. But A1 German makes daily life much easier — your company often sponsors classes.",
  },
  {
    q: "How does Germany's health insurance work?",
    a: "Health insurance is mandatory. Most employees use statutory (gesetzliche) insurance — ~14.6% of gross salary, half paid by the employer. Choose a provider like TK, AOK or Barmer.",
  },
  {
    q: "Why is my first paycheck taxed so heavily?",
    a: "If you arrive partway through the year, your Steuerklasse (tax class) may default to a high bracket. Once your tax ID is registered with HR, you'll receive corrections. Tax refunds via Elster are common in your first year.",
  },
  {
    q: "What is the Rundfunkbeitrag?",
    a: "A mandatory €18.36/month fee per household that funds public broadcasting. You'll get a letter asking you to register at rundfunkbeitrag.de.",
  },
];

export default function EmployeeAssistantPage() {
  const { data, hydrated } = useAppData();
  const [letterTitle, setLetterTitle] = useState("");
  const [explanation, setExplanation] = useState("");

  if (!hydrated) return <div className="muted">Loading…</div>;
  const emp = data.employees.find((e) => e.id === data.currentEmployeeId) ?? data.employees[0];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
        <p className="text-sm text-slate-600">
          Ask anything about visas, Anmeldung, taxes, banking, doctors, or life in Germany.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AIChat
            context={emp ? { employee: emp, tasks: data.tasks.filter((t) => t.assignedTo === emp.id) } : undefined}
            intro={emp ? `Hi ${emp.fullName.split(" ")[0]}! I can help with your move to ${emp.city}. What's on your mind?` : undefined}
          />
        </div>
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="section-title mb-3">Translate a German letter</h2>
            <p className="text-sm text-slate-600 mb-3">
              Paste a title or the first line of an official letter and I'll explain it in plain English.
            </p>
            <input
              value={letterTitle}
              onChange={(e) => setLetterTitle(e.target.value)}
              placeholder="e.g. Bescheid über die Festsetzung der Einkommensteuer"
              className="input"
            />
            <button
              onClick={() => setExplanation(aiExplainLetter(letterTitle || "(untitled letter)"))}
              className="btn-primary mt-3 w-full"
            >
              {Icon.Sparkle} Explain it
            </button>
            {explanation && (
              <div className="mt-3">
                <AIOutput key={explanation} text={explanation} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="section-title mb-3">Frequently asked questions</h2>
        <div className="divide-y divide-slate-200">
          {faqs.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="cursor-pointer font-medium text-slate-900 list-none flex items-center justify-between">
                <span>{f.q}</span>
                <span className="text-slate-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-slate-600 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
