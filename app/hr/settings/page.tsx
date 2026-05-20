"use client";

import { resetData, useAppData } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";

export default function HRSettingsPage() {
  const { data, hydrated } = useAppData();
  const router = useRouter();

  if (!hydrated) return <div className="muted">Loading…</div>;

  return (
    <div className="space-y-5 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <div className="card p-5">
        <h2 className="section-title mb-3">Workspace</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <Item label="Company" value="TalentBridge GmbH" />
          <Item label="Plan" value="Pro · €99/user/month" />
          <Item label="Locale" value="English (Germany)" />
          <Item label="Region" value="EU · Frankfurt" />
        </div>
      </div>

      <div className="card p-5">
        <h2 className="section-title mb-3">Your profile</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <Item label="Name" value="Anna Schmidt" />
          <Item label="Role" value="People Operations" />
          <Item label="Email" value="anna.schmidt@talentbridge.example" />
          <Item label="Location" value="Berlin" />
        </div>
      </div>

      <div className="card p-5">
        <h2 className="section-title mb-2">Demo data</h2>
        <p className="text-sm text-slate-600 mb-3">
          You have <strong>{data.employees.length}</strong> employees,{" "}
          <strong>{data.tasks.length}</strong> tasks, and{" "}
          <strong>{data.documents.length}</strong> documents stored locally in your browser.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (!confirm("Reset all demo data to the original seed? This cannot be undone.")) return;
              resetData();
            }}
            className="btn-secondary"
          >
            Reset demo data
          </button>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("talentbridge:role");
              }
              router.push("/");
            }}
            className="btn-ghost"
          >
            {Icon.AI} Switch role
          </button>
        </div>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/40">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-slate-900 font-medium mt-0.5">{value}</div>
    </div>
  );
}
