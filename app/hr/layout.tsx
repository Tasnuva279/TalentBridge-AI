"use client";

import { Sidebar, MobileTopbar, NavItem } from "@/components/Sidebar";
import { Icon } from "@/components/Icons";

const items: NavItem[] = [
  { href: "/hr", label: "Dashboard", icon: Icon.Dashboard },
  { href: "/hr/employees", label: "Employees", icon: Icon.People },
  { href: "/hr/tasks", label: "Tasks", icon: Icon.Tasks },
  { href: "/hr/documents", label: "Documents", icon: Icon.Docs },
  { href: "/hr/assistant", label: "AI Assistant", icon: Icon.AI },
  { href: "/hr/settings", label: "Settings", icon: Icon.Settings },
];

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        items={items}
        role="HR"
        userName="Anna Schmidt"
        userMeta="People Operations · Berlin"
      />
      <MobileTopbar items={items} role="HR" />
      <main className="md:pl-64">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
