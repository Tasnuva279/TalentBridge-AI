"use client";

import { Sidebar, MobileTopbar, NavItem } from "@/components/Sidebar";
import { Icon } from "@/components/Icons";
import { useAppData } from "@/lib/store";

const items: NavItem[] = [
  { href: "/employee", label: "My dashboard", icon: Icon.Dashboard },
  { href: "/employee/checklist", label: "Germany checklist", icon: Icon.Checklist },
  { href: "/employee/tasks", label: "Tasks", icon: Icon.Tasks },
  { href: "/employee/documents", label: "Documents", icon: Icon.Docs },
  { href: "/employee/assistant", label: "AI assistant", icon: Icon.AI },
  { href: "/employee/life", label: "Life in Germany", icon: Icon.Globe },
  { href: "/employee/settings", label: "Profile", icon: Icon.Settings },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { data, hydrated } = useAppData();
  const emp = hydrated ? data.employees.find((e) => e.id === data.currentEmployeeId) ?? data.employees[0] : undefined;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        items={items}
        role="Employee"
        userName={emp?.fullName ?? "Loading…"}
        userMeta={emp ? `${emp.role} · ${emp.city}` : ""}
      />
      <MobileTopbar items={items} role="Employee" />
      <main className="md:pl-64">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
