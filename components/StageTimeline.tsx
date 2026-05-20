"use client";

import { STAGES, StageKey } from "@/lib/types";
import { classNames } from "@/lib/utils";

export function StageTimeline({
  current,
  onSelect,
  compact = false,
}: {
  current: StageKey;
  onSelect?: (s: StageKey) => void;
  compact?: boolean;
}) {
  const idx = STAGES.findIndex((s) => s.key === current);

  return (
    <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {STAGES.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={s.key}>
            <button
              type="button"
              onClick={() => onSelect?.(s.key)}
              className={classNames(
                "w-full text-left rounded-lg border px-3 py-2 transition-colors",
                done && "bg-accent-50 border-accent-200 text-accent-700",
                active && "bg-brand-50 border-brand-300 text-brand-700",
                !done && !active && "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={classNames(
                    "w-5 h-5 rounded-full text-[10px] font-bold inline-flex items-center justify-center",
                    done ? "bg-accent-500 text-white" : active ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-600",
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{s.label}</div>
                  {!compact && <div className="text-[11px] text-slate-500 truncate">{s.description}</div>}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
