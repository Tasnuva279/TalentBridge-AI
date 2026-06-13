import { classNames } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  showLabel = false,
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const color =
    pct >= 80 ? "bg-accent-500" : pct >= 40 ? "bg-brand-500" : "bg-amber-500";
  return (
    <div className={classNames("flex items-center gap-3", className)}>
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={classNames("h-full rounded-full transition-all", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-600 w-9 text-right">
          {pct}%
        </span>
      )}
    </div>
  );
}
