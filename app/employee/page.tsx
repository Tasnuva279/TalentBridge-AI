"use client";

import Link from "next/link";
import { mutators, useAppData } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { StageTimeline } from "@/components/StageTimeline";
import { Icon } from "@/components/Icons";
import { KPICard } from "@/components/KPICard";
import { aiNextChecklist } from "@/lib/ai";
import { formatDate, daysUntil } from "@/lib/utils";
import { STAGES, TaskStatus } from "@/lib/types";

export default function EmployeeDashboard() {
  const { data, hydrated, update } = useAppData();
  if (!hydrated) return <div className="muted">Loading…</div>;

  const emp = data.employees.find((e) => e.id === data.currentEmployeeId) ?? data.employees[0];
  if (!emp) return <div className="muted">No employee profile yet.</div>;

  const tasks = data.tasks.filter((t) => t.assignedTo === emp.id);
  const done = tasks.filter((t) => t.status === "completed").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const blocked = tasks.filter((t) => t.status === "blocked").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const upcoming = tasks
    .filter((t) => t.status !== "completed" && t.dueDate)
    .map((t) => ({ ...t, d: daysUntil(t.dueDate)! }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 5);

  const next = aiNextChecklist(emp.stage);

  return (
    <div className="space-y-6">
      <div className="card p-5 bg-gradient-to-br from-brand-50 to-accent-50 border-brand-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Avatar name={emp.fullName} color={emp.avatarColor} size={56} />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">Welcome back</div>
              <h1 className="text-xl font-bold text-slate-900">Hi {emp.fullName.split(" ")[0]} — let's get you settled in {emp.city}.</h1>
              <div className="text-sm text-slate-600">{emp.role} · {emp.department} · {emp.visaType}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/employee/checklist" className="btn-primary">{Icon.Checklist} See checklist</Link>
            <Link href="/employee/assistant" className="btn-secondary">{Icon.Sparkle} Ask AI</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Overall progress" value={`${pct}%`} hint={`${done}/${tasks.length} tasks`} tone="brand" icon={Icon.Tasks} />
        <KPICard label="Open tasks" value={inProgress} hint="In progress" tone="brand" icon={Icon.Checklist} />
        <KPICard label="Blocked" value={blocked} hint="Need help" tone="amber" icon={Icon.Alert} />
        <KPICard label="Start date" value={formatDate(emp.startDate)} hint="Your contract date" tone="accent" icon={Icon.Check} />
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Your journey</h2>
          <span className="chip bg-brand-100 text-brand-700">
            Current: {STAGES.find((s) => s.key === emp.stage)?.label}
          </span>
        </div>
        <StageTimeline current={emp.stage} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Upcoming tasks</h2>
            <Link href="/employee/tasks" className="text-sm text-brand-700 hover:underline">All tasks →</Link>
          </div>
          <div className="space-y-2">
            {upcoming.length === 0 && <div className="text-sm muted">You're all caught up 🎉</div>}
            {upcoming.map((t) => (
              <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/60">
                <input
                  type="checkbox"
                  checked={t.status === "completed"}
                  onChange={(e) =>
                    update((d) => mutators.setTaskStatus(d, t.id, e.target.checked ? "completed" : "in_progress"))
                  }
                  className="mt-1.5 accent-brand-600 w-4 h-4"
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${t.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}>
                    {t.title}
                  </div>
                  <div className="text-xs text-slate-500">Due {formatDate(t.dueDate)} · {STAGES.find((s) => s.key === t.stage)?.label}</div>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="section-title mb-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-brand-50 text-brand-700">{Icon.Sparkle}</span>
            Suggested next actions
          </h2>
          <ol className="space-y-2 text-sm">
            {next.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold inline-flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3 text-xs text-slate-500">Based on your current stage and uploaded documents.</div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="section-title">Your progress at a glance</h2>
        </div>
        <ProgressBar value={pct} showLabel />
        <p className="text-sm text-slate-600 mt-2">
          You've completed {done} of {tasks.length} tasks across your relocation journey.{" "}
          {blocked > 0 && <span className="text-amber-700 font-medium">{blocked} task{blocked > 1 ? "s" : ""} need HR's help.</span>}
        </p>
      </div>
    </div>
  );
}
