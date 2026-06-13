"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { mutators, useAppData } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { StageTimeline } from "@/components/StageTimeline";
import { Modal } from "@/components/Modal";
import { TaskForm } from "@/components/TaskForm";
import { EmployeeForm } from "@/components/EmployeeForm";
import { AIChat } from "@/components/AIChat";
import { Icon } from "@/components/Icons";
import { STAGES, STATUS_LABEL, TaskStatus, Note, DocumentItem } from "@/lib/types";
import { formatDate, uid } from "@/lib/utils";
import { aiHRSummary } from "@/lib/ai";

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, hydrated, update } = useAppData();

  const [showAddTask, setShowAddTask] = useState(false);
  const [editEmp, setEditEmp] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const emp = data.employees.find((e) => e.id === params.id);
  const tasks = useMemo(() => data.tasks.filter((t) => t.assignedTo === params.id), [data.tasks, params.id]);
  const docs = useMemo(() => data.documents.filter((d) => d.employeeId === params.id), [data.documents, params.id]);
  const notes = useMemo(() => data.notes.filter((n) => n.employeeId === params.id), [data.notes, params.id]);

  if (!hydrated) return <div className="muted">Loading…</div>;
  if (!emp) {
    return (
      <div className="card p-8 text-center">
        <h2 className="font-semibold">Employee not found.</h2>
        <Link href="/hr/employees" className="btn-secondary mt-4">Back to employees</Link>
      </div>
    );
  }

  const done = tasks.filter((t) => t.status === "completed").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const addNote = () => {
    if (!newNote.trim()) return;
    const n: Note = {
      id: uid("note"),
      employeeId: emp.id,
      author: "Anna Schmidt (HR)",
      body: newNote.trim(),
      createdAt: new Date().toISOString(),
    };
    update((d) => mutators.addNote(d, n));
    setNewNote("");
  };

  const uploadDoc = () => {
    const name = prompt("Document name (this is a demo — no real upload):", "Visa Confirmation.pdf");
    if (!name) return;
    const doc: DocumentItem = {
      id: uid("doc"),
      name,
      type: "other",
      uploadedBy: "hr",
      uploadedAt: new Date().toISOString(),
      employeeId: emp.id,
      sizeKB: Math.floor(120 + Math.random() * 400),
    };
    update((d) => mutators.addDocument(d, doc));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/hr/employees" className="text-slate-500 hover:text-slate-900">Employees</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-medium">{emp.fullName}</span>
      </div>

      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={emp.fullName} color={emp.avatarColor} size={56} />
            <div>
              <h1 className="text-xl font-bold text-slate-900">{emp.fullName}</h1>
              <div className="text-sm text-slate-600">{emp.role} · {emp.department}</div>
              <div className="text-xs text-slate-500 mt-1">
                {emp.email} · {emp.countryOfOrigin} → {emp.city}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={emp.status} />
            <span className="chip bg-slate-100 text-slate-700">{emp.visaType}</span>
            <span className="chip bg-brand-50 text-brand-700">Start {formatDate(emp.startDate)}</span>
            <button onClick={() => setShowSummary(true)} className="btn-secondary">{Icon.Sparkle} AI summary</button>
            <button onClick={() => setEditEmp(true)} className="btn-secondary">{Icon.Edit} Edit</button>
            <button
              onClick={() => {
                if (confirm("Delete this employee case?")) {
                  update((d) => mutators.deleteEmployee(d, emp.id));
                  router.push("/hr/employees");
                }
              }}
              className="btn-ghost text-rose-600 hover:bg-rose-50"
            >
              {Icon.Trash} Delete
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-5">
          <div>
            <div className="label">Progress</div>
            <ProgressBar value={pct} showLabel />
            <div className="text-xs text-slate-500 mt-1">{done} of {tasks.length} tasks completed</div>
          </div>
          <div>
            <div className="label">Manager</div>
            <div className="text-sm text-slate-900">{emp.manager}</div>
          </div>
          <div>
            <div className="label">Languages</div>
            <div className="text-sm text-slate-900">{emp.language}</div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Journey timeline</h2>
          <span className="text-xs text-slate-500">Click a stage to update</span>
        </div>
        <StageTimeline
          current={emp.stage}
          onSelect={(s) => update((d) => mutators.setEmployeeStage(d, emp.id, s))}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Tasks</h2>
            <button onClick={() => setShowAddTask(true)} className="btn-secondary">{Icon.Plus} New task</button>
          </div>
          <div className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/60">
                <input
                  type="checkbox"
                  className="mt-1.5 accent-brand-600 w-4 h-4"
                  checked={t.status === "completed"}
                  onChange={(e) =>
                    update((d) => mutators.setTaskStatus(d, t.id, e.target.checked ? "completed" : "in_progress"))
                  }
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={`font-medium ${t.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}>
                      {t.title}
                    </div>
                    <span className="chip bg-slate-100 text-slate-700">{STAGES.find((s) => s.key === t.stage)?.label}</span>
                    <span className="chip bg-slate-100 text-slate-600 text-[10px] uppercase">{t.ownedBy === "hr" ? "HR owns" : "Employee owns"}</span>
                  </div>
                  {t.description && <div className="text-xs text-slate-500 mt-0.5">{t.description}</div>}
                  <div className="text-[11px] text-slate-500 mt-1">Due {formatDate(t.dueDate)}</div>
                </div>
                <select
                  value={t.status}
                  onChange={(e) => update((d) => mutators.setTaskStatus(d, t.id, e.target.value as TaskStatus))}
                  className="input w-auto text-xs py-1 px-2"
                >
                  {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
                    <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                  ))}
                </select>
                <button onClick={() => update((d) => mutators.deleteTask(d, t.id))} className="btn-ghost text-rose-600 p-2" aria-label="Delete">
                  {Icon.Trash}
                </button>
              </div>
            ))}
            {tasks.length === 0 && <div className="text-sm muted">No tasks yet. Click "New task" to assign one.</div>}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Documents</h2>
              <button onClick={uploadDoc} className="btn-secondary">{Icon.Upload} Upload</button>
            </div>
            <div className="space-y-2">
              {docs.map((d) => (
                <div key={d.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200">
                  <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 inline-flex items-center justify-center">
                    {Icon.Docs}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">{d.name}</div>
                    <div className="text-xs text-slate-500">{d.sizeKB} KB · uploaded by {d.uploadedBy.toUpperCase()}</div>
                  </div>
                  <button
                    onClick={() => update((dd) => mutators.deleteDocument(dd, d.id))}
                    className="btn-ghost p-2 text-rose-600 hover:bg-rose-50"
                    aria-label="Delete"
                  >
                    {Icon.Trash}
                  </button>
                </div>
              ))}
              {docs.length === 0 && <div className="text-sm muted">No documents uploaded yet.</div>}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="section-title mb-3">Internal HR notes</h2>
            <div className="space-y-2">
              {notes.map((n) => (
                <div key={n.id} className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="text-sm text-slate-800">{n.body}</div>
                  <div className="text-xs text-amber-700 mt-1">{n.author} · {formatDate(n.createdAt)}</div>
                </div>
              ))}
              {notes.length === 0 && <div className="text-sm muted">No HR notes yet.</div>}
            </div>
            <div className="mt-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a private note for HR…"
                className="input min-h-[64px]"
              />
              <button onClick={addNote} className="btn-primary mt-2 w-full">Add note</button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={showAddTask} onClose={() => setShowAddTask(false)} title="New task" width="max-w-xl">
        <TaskForm
          employees={data.employees}
          defaultEmployeeId={emp.id}
          onSubmit={(t) => {
            update((d) => mutators.addTask(d, t));
            setShowAddTask(false);
          }}
          onCancel={() => setShowAddTask(false)}
        />
      </Modal>

      <Modal open={editEmp} onClose={() => setEditEmp(false)} title="Edit employee" width="max-w-2xl">
        <EmployeeForm
          initial={emp}
          onSubmit={(updated) => {
            update((d) => mutators.updateEmployee(d, emp.id, updated));
            setEditEmp(false);
          }}
          onCancel={() => setEditEmp(false)}
        />
      </Modal>

      <Modal open={showSummary} onClose={() => setShowSummary(false)} title="AI HR summary" width="max-w-2xl">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm whitespace-pre-wrap">
          {aiHRSummary(emp, data.tasks)}
        </div>
        <div className="mt-4">
          <AIChat
            context={{ employee: emp, tasks }}
            intro={`I'm focused on ${emp.fullName}'s case. Ask me about next steps, blockers, or specific documents.`}
            compact
          />
        </div>
      </Modal>
    </div>
  );
}
