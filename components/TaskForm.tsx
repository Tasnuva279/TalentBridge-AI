"use client";

import { useState } from "react";
import { Task, STAGES, STATUS_LABEL, TaskStatus, Employee } from "@/lib/types";
import { uid } from "@/lib/utils";

const blankTask = (employeeId: string): Task => ({
  id: uid("task"),
  title: "",
  description: "",
  stage: "onboarding",
  status: "not_started",
  dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
  assignedTo: employeeId,
  ownedBy: "employee",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function TaskForm({
  employees,
  initial,
  defaultEmployeeId,
  onSubmit,
  onCancel,
}: {
  employees: Employee[];
  initial?: Task;
  defaultEmployeeId?: string;
  onSubmit: (t: Task) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Task>(
    initial ?? blankTask(defaultEmployeeId ?? employees[0]?.id ?? "")
  );
  const [err, setErr] = useState<string>("");

  const set = <K extends keyof Task>(k: K, v: Task[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErr("Title is required");
      return;
    }
    if (!form.assignedTo) {
      setErr("Assign to an employee");
      return;
    }
    onSubmit({ ...form, updatedAt: new Date().toISOString() });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="label">Task title</span>
        <input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} />
      </label>
      <label className="block">
        <span className="label">Description</span>
        <textarea className="input min-h-[80px]" value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />
      </label>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="label">Assigned to</span>
          <select className="input" value={form.assignedTo} onChange={(e) => set("assignedTo", e.target.value)}>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.fullName}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Owned by</span>
          <select className="input" value={form.ownedBy} onChange={(e) => set("ownedBy", e.target.value as Task["ownedBy"])}>
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
          </select>
        </label>
        <label className="block">
          <span className="label">Stage</span>
          <select className="input" value={form.stage} onChange={(e) => set("stage", e.target.value as Task["stage"])}>
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Status</span>
          <select className="input" value={form.status} onChange={(e) => set("status", e.target.value as TaskStatus)}>
            {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="label">Due date</span>
          <input
            className="input"
            type="date"
            value={form.dueDate ? form.dueDate.slice(0, 10) : ""}
            onChange={(e) => set("dueDate", new Date(e.target.value).toISOString())}
          />
        </label>
      </div>
      {err && <div className="text-sm text-rose-600">{err}</div>}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">{initial ? "Save changes" : "Create task"}</button>
      </div>
    </form>
  );
}
