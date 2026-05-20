"use client";

import { mutators, resetData, useAppData } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/Icons";
import { useRouter } from "next/navigation";

export default function EmployeeSettingsPage() {
  const { data, hydrated, update } = useAppData();
  const router = useRouter();

  if (!hydrated) return <div className="muted">Loading…</div>;

  const current = data.employees.find((e) => e.id === data.currentEmployeeId) ?? data.employees[0];

  return (
    <div className="space-y-5 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

      {current && (
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <Avatar name={current.fullName} color={current.avatarColor} size={56} />
            <div>
              <div className="text-lg font-semibold">{current.fullName}</div>
              <div className="text-sm text-slate-600">{current.role} · {current.department}</div>
              <div className="text-xs text-slate-500">{current.email}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm mt-5">
            <Item label="Country of origin" value={current.countryOfOrigin} />
            <Item label="Nationality" value={current.nationality} />
            <Item label="City in Germany" value={current.city} />
            <Item label="Visa type" value={current.visaType} />
            <Item label="Manager" value={current.manager} />
            <Item label="Languages" value={current.language} />
          </div>
        </div>
      )}

      <div className="card p-5">
        <h2 className="section-title mb-3">Switch demo employee</h2>
        <p className="text-sm text-slate-600 mb-3">
          The demo lets you view the employee portal as different international hires.
        </p>
        <select
          value={data.currentEmployeeId}
          onChange={(e) => update((d) => mutators.setCurrentEmployee(d, e.target.value))}
          className="input"
        >
          {data.employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.fullName} · {emp.countryOfOrigin} → {emp.city}</option>
          ))}
        </select>
      </div>

      <div className="card p-5">
        <h2 className="section-title mb-2">Demo controls</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (!confirm("Reset all demo data?")) return;
              resetData();
            }}
            className="btn-secondary"
          >
            Reset demo data
          </button>
          <button
            onClick={() => {
              if (typeof window !== "undefined") localStorage.removeItem("talentbridge:role");
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
