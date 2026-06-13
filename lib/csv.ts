import { Employee, Task, STAGES, STATUS_LABEL } from "./types";

export function employeesToCSV(employees: Employee[], tasks: Task[]): string {
  const headers = [
    "Employee ID",
    "Full Name",
    "Email",
    "Country of Origin",
    "Role",
    "Department",
    "Manager",
    "City",
    "Visa Type",
    "Start Date",
    "Current Stage",
    "Overall Status",
    "Tasks Total",
    "Tasks Completed",
    "Tasks Blocked",
    "Progress %",
  ];

  const rows = employees.map((e) => {
    const empTasks = tasks.filter((t) => t.assignedTo === e.id);
    const total = empTasks.length;
    const completed = empTasks.filter((t) => t.status === "completed").length;
    const blocked = empTasks.filter((t) => t.status === "blocked").length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    const stage = STAGES.find((s) => s.key === e.stage)?.label ?? e.stage;
    return [
      e.id,
      e.fullName,
      e.email,
      e.countryOfOrigin,
      e.role,
      e.department,
      e.manager,
      e.city,
      e.visaType,
      e.startDate.slice(0, 10),
      stage,
      STATUS_LABEL[e.status],
      total,
      completed,
      blocked,
      progress,
    ];
  });

  const escape = (v: string | number) => {
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };

  return [headers, ...rows]
    .map((r) => r.map(escape).join(","))
    .join("\n");
}

export function downloadCSV(filename: string, content: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
