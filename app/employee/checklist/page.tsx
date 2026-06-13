"use client";

import { mutators, useAppData } from "@/lib/store";
import { StageTimeline } from "@/components/StageTimeline";
import { StatusBadge } from "@/components/StatusBadge";
import { Icon } from "@/components/Icons";
import { STAGES, StageKey, TaskStatus, Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

const arrival: { title: string; body: string }[] = [
  { title: "Anmeldung (city registration)", body: "Mandatory within 14 days of moving in. Bring passport, Wohnungsgeberbestätigung (signed by landlord) and rental contract to the Bürgeramt." },
  { title: "Tax ID (Steuer-ID)", body: "Arrives by post 2–3 weeks after Anmeldung. Required for your first paycheck." },
  { title: "Bank account", body: "Open a Girokonto at N26, Sparkasse, Commerzbank or Deutsche Bank. Need passport + Anmeldung." },
  { title: "Health insurance", body: "Statutory (TK, AOK, Barmer) is the default for most employees. Sign up and forward proof to HR." },
  { title: "German SIM card", body: "Aldi Talk, O2 or Vodafone. Prepaid SIMs require ID verification but are quick to set up." },
  { title: "Public transport pass", body: "In Berlin: BVG monthly pass or Deutschlandticket (€58/month, nationwide trains incl.)." },
];

const visa: { title: string; body: string }[] = [
  { title: "Valid passport", body: "At least 12 months remaining from your planned arrival date." },
  { title: "Employment contract", body: "Signed contract from your German employer." },
  { title: "Diploma & translations", body: "Recognised degree certificate, sometimes with sworn translation." },
  { title: "Health insurance confirmation", body: "Statutory or private cover from the day you start work." },
  { title: "Biometric photos", body: "Standard EU biometric photos (35×45mm)." },
  { title: "Proof of accommodation", body: "Temporary or permanent address in Germany." },
];

export default function EmployeeChecklistPage() {
  const { data, hydrated, update } = useAppData();
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");

  if (!hydrated) return <div className="muted">Loading…</div>;
  const emp = data.employees.find((e) => e.id === data.currentEmployeeId) ?? data.employees[0];
  if (!emp) return <div className="muted">No employee.</div>;

  const tasks = data.tasks
    .filter((t) => t.assignedTo === emp.id)
    .filter((t) => (filter === "all" ? true : t.status === filter));

  const byStage = STAGES.map((s) => ({
    stage: s,
    tasks: tasks.filter((t) => t.stage === s.key),
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Germany Relocation Checklist</h1>
        <p className="text-sm text-slate-600">Your step-by-step guide from offer to arrival to life in Germany.</p>
      </div>

      <div className="card p-5">
        <StageTimeline current={emp.stage} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Visa & document checklist">
          <ul className="space-y-2 text-sm">
            {visa.map((v) => (
              <li key={v.title} className="flex gap-3">
                <span className="mt-1 w-5 h-5 rounded-full bg-brand-100 text-brand-700 inline-flex items-center justify-center">{Icon.Check}</span>
                <div>
                  <div className="font-medium text-slate-900">{v.title}</div>
                  <div className="text-slate-600">{v.body}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Arrival checklist">
          <ul className="space-y-2 text-sm">
            {arrival.map((v) => (
              <li key={v.title} className="flex gap-3">
                <span className="mt-1 w-5 h-5 rounded-full bg-accent-100 text-accent-700 inline-flex items-center justify-center">{Icon.Check}</span>
                <div>
                  <div className="font-medium text-slate-900">{v.title}</div>
                  <div className="text-slate-600">{v.body}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="section-title">My tasks by stage</h2>
          <div className="flex gap-1">
            {(["all", "not_started", "in_progress", "blocked", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`chip cursor-pointer ${filter === f ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {f === "all" ? "All" : f.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {byStage.map(({ stage, tasks }) => (
            <StageBlock
              key={stage.key}
              stageKey={stage.key}
              stageLabel={stage.label}
              tasks={tasks}
              onToggle={(t, completed) =>
                update((d) =>
                  mutators.setTaskStatus(d, t.id, completed ? "completed" : "in_progress")
                )
              }
              onStatus={(t, s) => update((d) => mutators.setTaskStatus(d, t.id, s))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="section-title mb-3">{title}</h2>
      {children}
    </div>
  );
}

function StageBlock({
  stageKey,
  stageLabel,
  tasks,
  onToggle,
  onStatus,
}: {
  stageKey: StageKey;
  stageLabel: string;
  tasks: Task[];
  onToggle: (t: Task, completed: boolean) => void;
  onStatus: (t: Task, s: TaskStatus) => void;
}) {
  if (tasks.length === 0) return null;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{stageLabel}</div>
      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white">
            <input
              type="checkbox"
              checked={t.status === "completed"}
              onChange={(e) => onToggle(t, e.target.checked)}
              className="mt-1.5 accent-brand-600 w-4 h-4"
            />
            <div className="flex-1 min-w-0">
              <div className={`font-medium ${t.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}>
                {t.title}
              </div>
              {t.description && <div className="text-xs text-slate-500">{t.description}</div>}
              <div className="text-[11px] text-slate-500 mt-1">Due {formatDate(t.dueDate)}</div>
            </div>
            <select
              value={t.status}
              onChange={(e) => onStatus(t, e.target.value as TaskStatus)}
              className="input w-auto text-xs py-1 px-2"
            >
              <option value="not_started">Not started</option>
              <option value="in_progress">In progress</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
