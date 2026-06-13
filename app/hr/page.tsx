"use client";

import Link from "next/link";
import { useAppData } from "@/lib/store";
import { KPICard } from "@/components/KPICard";
import { Icon } from "@/components/Icons";
import { Avatar } from "@/components/Avatar";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { STAGES } from "@/lib/types";
import { daysUntil, formatDate } from "@/lib/utils";

export default function HRDashboard() {
  const { data, hydrated } = useAppData();

  if (!hydrated) return <div className="muted">Loading…</div>;

  const active = data.employees.filter((e) => !e.archived);
  const totalTasks = data.tasks.length;
  const completed = data.tasks.filter((t) => t.status === "completed").length;
  const blocked = data.tasks.filter((t) => t.status === "blocked").length;
  const inProgress = data.tasks.filter((t) => t.status === "in_progress").length;

  const upcoming = data.tasks
    .filter((t) => t.status !== "completed" && t.dueDate)
    .map((t) => ({ ...t, d: daysUntil(t.dueDate) ?? 999 }))
    .filter((t) => t.d <= 14 && t.d >= -3)
    .sort((a, b) => a.d - b.d)
    .slice(0, 6);

  const stageCounts = STAGES.map((s) => ({
    ...s,
    count: active.filter((e) => e.stage === s.key).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">HR Overview</div>
          <h1 className="text-2xl font-bold text-slate-900">Good day, Anna</h1>
          <p className="text-sm text-slate-600">Here's a snapshot of your international hiring pipeline.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/hr/employees?new=1" className="btn-primary">
            {Icon.Plus} Add employee
          </Link>
          <Link href="/hr/assistant" className="btn-secondary">
            {Icon.Sparkle} Ask AI
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Active cases" value={active.length} hint="International hires" tone="brand" icon={Icon.People} />
        <KPICard label="In progress" value={inProgress} hint="Tasks open right now" tone="brand" icon={Icon.Tasks} />
        <KPICard label="Blocked" value={blocked} hint="Need HR attention" tone="amber" icon={Icon.Alert} />
        <KPICard label="Completed" value={`${completed}/${totalTasks}`} hint="Across all tasks" tone="accent" icon={Icon.Check} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Employees by stage</h2>
            <Link href="/hr/employees" className="text-sm text-brand-700 hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {stageCounts.map((s) => (
              <div key={s.key} className="rounded-lg border border-slate-200 p-3 bg-white">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 truncate">{s.label}</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{s.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="section-title mb-4">Upcoming & overdue</h2>
          <div className="space-y-3">
            {upcoming.length === 0 && (
              <div className="text-sm muted">No upcoming deadlines in the next 14 days.</div>
            )}
            {upcoming.map((t) => {
              const emp = data.employees.find((e) => e.id === t.assignedTo);
              const overdue = (t.d ?? 0) < 0;
              return (
                <div key={t.id} className="flex items-start gap-3">
                  <span className={`mt-1 w-2 h-2 rounded-full ${overdue ? "bg-rose-500" : t.d! <= 3 ? "bg-amber-500" : "bg-brand-500"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900 truncate">{t.title}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {emp?.fullName} · due {formatDate(t.dueDate)}
                      {overdue ? " · overdue" : t.d === 0 ? " · today" : ` · in ${t.d} days`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent cases</h2>
          <Link href="/hr/employees" className="text-sm text-brand-700 hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="py-3 pr-3">Employee</th>
                <th className="py-3 pr-3">Role</th>
                <th className="py-3 pr-3">From → City</th>
                <th className="py-3 pr-3">Stage</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-3">Progress</th>
                <th className="py-3 pr-3">Start</th>
              </tr>
            </thead>
            <tbody>
              {active.slice(0, 6).map((e) => {
                const empTasks = data.tasks.filter((t) => t.assignedTo === e.id);
                const done = empTasks.filter((t) => t.status === "completed").length;
                const pct = empTasks.length ? Math.round((done / empTasks.length) * 100) : 0;
                return (
                  <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="py-3 pr-3">
                      <Link href={`/hr/employees/${e.id}`} className="flex items-center gap-3 group">
                        <Avatar name={e.fullName} color={e.avatarColor} size={32} />
                        <span className="font-medium text-slate-900 group-hover:text-brand-700">{e.fullName}</span>
                      </Link>
                    </td>
                    <td className="py-3 pr-3 text-slate-600">{e.role}</td>
                    <td className="py-3 pr-3 text-slate-600">{e.countryOfOrigin} → {e.city}</td>
                    <td className="py-3 pr-3">
                      <span className="chip bg-slate-100 text-slate-700">
                        {STAGES.find((s) => s.key === e.stage)?.label}
                      </span>
                    </td>
                    <td className="py-3 pr-3"><StatusBadge status={e.status} /></td>
                    <td className="py-3 pr-3 min-w-[180px]"><ProgressBar value={pct} showLabel /></td>
                    <td className="py-3 pr-3 text-slate-600 whitespace-nowrap">{formatDate(e.startDate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
