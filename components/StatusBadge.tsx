import { STATUS_LABEL, STATUS_COLOR, TaskStatus } from "@/lib/types";
import { classNames } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return (
    <span className={classNames("chip", STATUS_COLOR[status], className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABEL[status]}
    </span>
  );
}
