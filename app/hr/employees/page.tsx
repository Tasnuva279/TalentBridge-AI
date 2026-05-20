"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mutators, useAppData } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { EmployeeForm } from "@/components/EmployeeForm";
import { Employee, STAGES, STATUS_LABEL, TaskStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { employeesToCSV, downloadCSV } from "@/lib/csv";

export default function EmployeesPage() {
  return (
    <Suspense fallback={<div className="muted">Loading…</div>}>
      <EmployeesContent />
    </Suspense>
  );
}

function EmployeesContent() {
  const { data, hydrated, update } = useAppData();
  const searchParams = useSearchParams();
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [stage, setStage] = useState<string>("all");
  const [country, setCountry] = useState("all");

  useEffect(() => {
    if (searchParams.get("new") === "1") setShowNew(true);
  }, [searchParams]);

  const countries = useMemo(
    () => Array.from(new Set(data.employees.map((e) => e.countryOfOrigin))).sort(),
    [data.employees]
  );

  const filtered = useMemo(() => {
    return data.employees.filter((e) => {
      if (status !== "all" && e.status !== status) return false;
      if (stage !== "all" && e.stage !== stage) return false;
      if (country !== "all" && e.countryOfOrigin !== country) return false;
      if (query) {
        const q = query.toLowerCase();
        const empTasks = data.tasks.filter((t) => t.assignedTo === e.id);
        const total = empTasks.length;
        const done = empTasks.filter((t) => t.status === "completed").length;
        const pct = total ? Math.round((done / total) * 100) : 0;
        if (
          !e.fullName.toLowerCase().includes(q) &&
          !e.role.toLowerCase().includes(q) &&
          !e.email.toLowerCase().includes(q) &&
          !e.visaType.toLowerCase().includes(q) &&
          !`${pct}%`.includes(q)
        )
          return false;
      }
      return true;
    });
  }, [data.employees, data.tasks, status, stage, country, query]);

  if (!hydrated) return <div className="muted">Loading…</div>;

  const exportCSV = () => {
    const csv = employeesToCSV(filtered, data.tasks);
    downloadCSV(`talentbridge-employees-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleCreate = (emp: Employee) => {
    update((d) => mutators.addEmployee(d, emp));
    setShowNew(false);
  };

  const handleEdit = (emp: Employee) => {
    update((d) => mutators.updateEmployee(d, emp.id, emp));
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this employee case and all related tasks/documents?")) return;
    update((d) => mutators.deleteEmployee(d, id));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-sm text-slate-600">Search, filter, and manage every international hire.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="btn-secondary">{Icon.Download} Export CSV</button>
          <button onClick={() => setShowNew(true)} className="btn-primary">{Icon.Plus} Add employee</button>
        </div>
      </div>

      <div className="card p-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
          <div className="relative lg:col-span-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{Icon.Search}</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, role, email, visa…"
              className="input pl-9"
            />
          </div>
          <select value={stage} onChange={(e) => setStage(e.target.value)} className="input">
            <option value="all">All stages</option>
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus | "all")} className="input">
            <option value="all">All statuses</option>
            {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="input">
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Role · Dept</th>
                <th className="px-4 py-3">Origin → City</th>
                <th className="px-4 py-3">Visa</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const t = data.tasks.filter((x) => x.assignedTo === e.id);
                const done = t.filter((x) => x.status === "completed").length;
                const pct = t.length ? Math.round((done / t.length) * 100) : 0;
                return (
                  <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <Link href={`/hr/employees/${e.id}`} className="flex items-center gap-3 group">
                        <Avatar name={e.fullName} color={e.avatarColor} size={32} />
                        <div>
                          <div className="font-medium text-slate-900 group-hover:text-brand-700">{e.fullName}</div>
                          <div className="text-xs text-slate-500">{e.email}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div>{e.role}</div>
                      <div className="text-xs text-slate-500">{e.department}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {e.countryOfOrigin} → {e.city}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{e.visaType}</td>
                    <td className="px-4 py-3">
                      <span className="chip bg-slate-100 text-slate-700">
                        {STAGES.find((s) => s.key === e.stage)?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                    <td className="px-4 py-3 min-w-[180px]"><ProgressBar value={pct} showLabel /></td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{formatDate(e.startDate)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditing(e)} className="btn-ghost p-2" aria-label="Edit">
                          {Icon.Edit}
                        </button>
                        <button onClick={() => handleDelete(e.id)} className="btn-ghost p-2 text-rose-600 hover:bg-rose-50" aria-label="Delete">
                          {Icon.Trash}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-slate-500 py-10">No employees match these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Add international employee" width="max-w-2xl">
        <EmployeeForm onSubmit={handleCreate} onCancel={() => setShowNew(false)} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit employee" width="max-w-2xl">
        {editing && <EmployeeForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />}
      </Modal>
    </div>
  );
}
