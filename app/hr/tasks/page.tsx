"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { mutators, useAppData } from "@/lib/store";
import { Modal } from "@/components/Modal";
import { TaskForm } from "@/components/TaskForm";
import { Icon } from "@/components/Icons";
import { Avatar } from "@/components/Avatar";
import { STAGES, STATUS_LABEL, Task, TaskStatus } from "@/lib/types";
import { formatDate, daysUntil } from "@/lib/utils";

export default function HRTasksPage() {
  const { data, hydrated, update } = useAppData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [owner, setOwner] = useState<"all" | "hr" | "employee">("all");
  const [stage, setStage] = useState<string>("all");
  const [employee, setEmployee] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return data.tasks.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (owner !== "all" && t.ownedBy !== owner) return false;
      if (stage !== "all" && t.stage !== stage) return false;
      if (employee !== "all" && t.assignedTo !== employee) return false;
      if (query) {
        const q = query.toLowerCase();
        const emp = data.employees.find((e) => e.id === t.assignedTo);
        if (
          !t.title.toLowerCase().includes(q) &&
          !(t.description ?? "").toLowerCase().includes(q) &&
          !(emp?.fullName ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [data.tasks, data.employees, status, owner, stage, employee, query]);

  if (!hydrated) return <div className="muted">Loading…</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-600">All HR and employee tasks across every case.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary">{Icon.Plus} New task</button>
      </div>

      <div className="card p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
        <div className="relative lg:col-span-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{Icon.Search}</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks…" className="input pl-9" />
        </div>
        <select value={employee} onChange={(e) => setEmployee(e.target.value)} className="input">
          <option value="all">All employees</option>
          {data.employees.map((e) => <option key={e.id} value={e.id}>{e.fullName}</option>)}
        </select>
        <select value={stage} onChange={(e) => setStage(e.target.value)} className="input">
          <option value="all">All stages</option>
          {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus | "all")} className="input">
          <option value="all">All statuses</option>
          {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const emp = data.employees.find((e) => e.id === t.assignedTo);
                const d = daysUntil(t.dueDate);
                const overdue = t.status !== "completed" && d !== null && d < 0;
                return (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{t.title}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">{t.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      {emp ? (
                        <Link href={`/hr/employees/${emp.id}`} className="flex items-center gap-2 hover:text-brand-700">
                          <Avatar name={emp.fullName} color={emp.avatarColor} size={24} />
                          <span className="text-sm">{emp.fullName}</span>
                        </Link>
                      ) : (
                        <span className="muted">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="chip bg-slate-100 text-slate-700">{STAGES.find((s) => s.key === t.stage)?.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="chip bg-slate-100 text-slate-700 text-[10px] uppercase">{t.ownedBy}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={t.status}
                        onChange={(e) => update((dd) => mutators.setTaskStatus(dd, t.id, e.target.value as TaskStatus))}
                        className="input w-auto text-xs py-1 px-2"
                      >
                        {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                      </select>
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${overdue ? "text-rose-600 font-semibold" : "text-slate-700"}`}>
                      {formatDate(t.dueDate)}{overdue && " · overdue"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditing(t)} className="btn-ghost p-2" aria-label="Edit">{Icon.Edit}</button>
                        <button onClick={() => update((d) => mutators.deleteTask(d, t.id))} className="btn-ghost p-2 text-rose-600" aria-label="Delete">{Icon.Trash}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-slate-500 py-10">No tasks match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New task" width="max-w-xl">
        <TaskForm
          employees={data.employees}
          onSubmit={(t) => {
            update((d) => mutators.addTask(d, t));
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit task" width="max-w-xl">
        {editing && (
          <TaskForm
            employees={data.employees}
            initial={editing}
            onSubmit={(t) => {
              update((d) => mutators.updateTask(d, t.id, t));
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
