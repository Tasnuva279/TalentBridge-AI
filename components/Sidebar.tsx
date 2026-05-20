"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { classNames } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export function Sidebar({
  items,
  role,
  userName,
  userMeta,
}: {
  items: NavItem[];
  role: "HR" | "Employee";
  userName: string;
  userMeta: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("talentbridge:role");
    }
    router.push("/");
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-slate-200">
      <div className="px-5 py-5">
        <Logo />
      </div>

      <div className="px-3 mt-1">
        <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {role} Workspace
          </div>
          <div className="text-sm font-semibold text-slate-900 truncate">{userName}</div>
          <div className="text-xs text-slate-500 truncate">{userMeta}</div>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href || (it.href !== "/" && pathname?.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={classNames(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span className={classNames("w-5 h-5", active ? "text-brand-600" : "text-slate-400")}>
                {it.icon}
              </span>
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <button onClick={signOut} className="btn-ghost w-full justify-start">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 12H3m0 0l4-4m-4 4l4 4M21 4v16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}

export function MobileTopbar({ items, role }: { items: NavItem[]; role: "HR" | "Employee" }) {
  const pathname = usePathname();
  return (
    <div className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="px-4 py-3 flex items-center justify-between">
        <Logo />
        <span className="chip bg-brand-50 text-brand-700 text-[10px]">{role}</span>
      </div>
      <nav className="px-2 pb-2 flex overflow-x-auto gap-1 scrollbar-thin">
        {items.map((it) => {
          const active = pathname === it.href || (it.href !== "/" && pathname?.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={classNames(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border",
                active
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-slate-600 border-slate-200"
              )}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
