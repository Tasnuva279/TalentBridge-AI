"use client";

import { useState } from "react";
import { mutators, useAppData } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";
import { STAGES, STATUS_LABEL, TaskStatus } from "@/lib/types";
import { formatDate, daysUntil } from "@/lib/utils";

export default function EmployeeTasksPage() {
  const { data, hydrated, update } = useAppData();
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");

  if (!hydrated) return <div className="muted">Loading…</div>;
  const emp = data.employees.find((e) => e.id === data.currentEmployeeId) ?? data.employees[0];
  if (!emp) return <div className="muted">No employee.</div>;

  const tasks = data.tasks
    .filter((t) => t.assignedTo === emp.id)
    .filter((t) => (filter === "all" ? true : t.status === filter))
    .sort((a, b) => {
      const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return da - db;
    });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My tasks</h1>
        <p className="text-sm text-slate-600">Update status as you go. Mark blocked items so HR can help.</p>
      </div>

      <div className="card p-3 flex flex-wrap items-center gap-2">
        {(["all", "not_started", "in_progress", "blocked", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`chip cursor-pointer ${filter === f ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            {f === "all" ? "All" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {tasks.map((t) => {
          const d = daysUntil(t.dueDate);
          const overdue = t.status !== "completed" && d !== null && d < 0;
          return (
            <div key={t.id} className="card p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={t.status === "completed"}
                  onChange={(e) =>
                    update((d) => mutators.setTaskStatus(d, t.id, e.target.checked ? "completed" : "in_progress"))
                  }
                  className="mt-1.5 accent-brand-600 w-5 h-5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={`font-medium ${t.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}>
                      {t.title}
                    </div>
                    <span className="chip bg-slate-100 text-slate-700">{STAGES.find((s) => s.key === t.stage)?.label}</span>
                    {t.ownedBy === "hr" && <span className="chip bg-amber-50 text-amber-700">HR owned</span>}
                  </div>
                  {t.description && <div className="text-sm text-slate-600 mt-1">{t.description}</div>}
                  <div className={`text-xs mt-1 ${overdue ? "text-rose-600 font-semibold" : "text-slate-500"}`}>
                    Due {formatDate(t.dueDate)}{overdue ? " · overdue" : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={t.status} />
                  <select
                    value={t.status}
                    onChange={(e) => update((d) => mutators.setTaskStatus(d, t.id, e.target.value as TaskStatus))}
                    className="input w-auto text-xs py-1 px-2"
                  >
                    {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
                      <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
        {tasks.length === 0 && (
          <div className="card p-10 text-center text-slate-500">No tasks in this view.</div>
        )}
      </div>
    </div>
  );
}
