import { initials } from "@/lib/utils";

export function Avatar({
  name,
  color = "#3b82f6",
  size = 36,
}: {
  name: string;
  color?: string;
  size?: number;
}) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-white font-semibold shrink-0"
      style={{
        background: color,
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
