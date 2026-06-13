import { Employee, Task, STAGES } from "./types";

export function classNames(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

// Overall case completion. Blends journey-stage position (60%) with task
// completion (40%) so advancing the timeline immediately moves the bar, while
// finishing tasks still refines it. Used everywhere an employee's headline
// progress percentage is shown.
export function caseProgress(emp: Employee, tasks: Task[]): number {
  const empTasks = tasks.filter((t) => t.assignedTo === emp.id);
  const taskPct = empTasks.length
    ? empTasks.filter((t) => t.status === "completed").length / empTasks.length
    : 0;
  const stageIdx = STAGES.findIndex((s) => s.key === emp.stage);
  const stagePct = STAGES.length > 1 ? Math.max(0, stageIdx) / (STAGES.length - 1) : 0;
  return Math.round((stagePct * 0.6 + taskPct * 0.4) * 100);
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

export function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
