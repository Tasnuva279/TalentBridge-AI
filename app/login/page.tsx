"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { setRole } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"hr" | "employee" | null>(null);
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    if (!selected) return;
    setRole(selected);
    router.push(selected === "hr" ? "/hr" : "/employee");
  };

  return (
    <main className="bg-hero min-h-screen">
      <header className="max-w-6xl mx-auto px-6 py-5">
        <Logo />
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-10 items-start">
        <div className="card p-7">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-600 mt-1">
            Choose how you want to experience the demo. No password required.
          </p>

          <div className="mt-6 space-y-3">
            <RoleOption
              selected={selected === "hr"}
              onClick={() => setSelected("hr")}
              title="HR / Admin"
              desc="Manage international hires, visas, tasks, documents, and analytics."
              icon="🏢"
              badge="Workspace"
            />
            <RoleOption
              selected={selected === "employee"}
              onClick={() => setSelected("employee")}
              title="International Employee"
              desc="Follow your relocation checklist, upload docs, and ask the AI."
              icon="🌍"
              badge="Personal"
            />
          </div>

          <div className="mt-6">
            <label className="label">Work email (optional in demo)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.de"
              className="input"
            />
          </div>

          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`btn-primary w-full mt-5 text-base py-3 ${
              !selected ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Continue
          </button>

          <p className="text-xs text-slate-500 mt-4 text-center">
            By continuing, you accept the demo terms. No real data is collected.
          </p>
        </div>

        <div className="card p-7 bg-gradient-to-br from-brand-600 to-accent-600 text-white">
          <h2 className="text-xl font-bold">What's in the demo</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2">
              <span>✓</span> 6 preloaded cases incl. Tasnuva (PM, Bangladesh) and John Doe (FSE, UK)
            </li>
            <li className="flex gap-2">
              <span>✓</span> Full HR workspace: cases, tasks, documents, analytics, CSV export
            </li>
            <li className="flex gap-2">
              <span>✓</span> Mobile-first employee portal with German bureaucracy checklist
            </li>
            <li className="flex gap-2">
              <span>✓</span> AI assistant that translates official German letters into plain English
            </li>
            <li className="flex gap-2">
              <span>✓</span> All data persists in your browser (localStorage). Reset from Settings.
            </li>
          </ul>
          <div className="mt-6 pt-6 border-t border-white/20 text-sm">
            <div className="opacity-80">Already exploring?</div>
            <Link href="/" className="underline">← Back to landing page</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function RoleOption({
  selected,
  onClick,
  title,
  desc,
  icon,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  icon: string;
  badge: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 transition-all ${
        selected
          ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 inline-flex items-center justify-center text-xl">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-slate-900">{title}</div>
            <span className="chip bg-slate-100 text-slate-600 text-[10px]">{badge}</span>
          </div>
          <div className="text-sm text-slate-600 mt-0.5">{desc}</div>
        </div>
        <span
          className={`mt-1 w-5 h-5 rounded-full border-2 inline-flex items-center justify-center ${
            selected ? "border-brand-600 bg-brand-600" : "border-slate-300"
          }`}
        >
          {selected && (
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </span>
      </div>
    </button>
  );
}
