import { classNames } from "@/lib/utils";

export function KPICard({
  label,
  value,
  hint,
  tone = "brand",
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "brand" | "accent" | "amber" | "rose" | "slate";
  icon?: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-50 text-brand-700",
    accent: "bg-accent-50 text-accent-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
          {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
        </div>
        {icon && (
          <span
            className={classNames(
              "inline-flex items-center justify-center w-9 h-9 rounded-lg",
              tones[tone]
            )}
          >
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}
