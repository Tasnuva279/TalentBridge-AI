import Link from "next/link";

export function Logo({ href = "/", small = false }: { href?: string; small?: boolean }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 group">
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-900 text-white"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18c4-6 12-6 16 0" />
          <circle cx="6" cy="8" r="2.2" />
          <circle cx="18" cy="8" r="2.2" />
        </svg>
      </span>
      {!small && (
        <span className="font-bold text-slate-900 tracking-tight text-lg">
          TalentBridge<span className="text-brand-600"> AI</span>
        </span>
      )}
    </Link>
  );
}
