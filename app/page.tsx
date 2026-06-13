import Link from "next/link";
import {
  Compass,
  BrainCircuit,
  ClipboardCheck,
  FolderClosed,
  Globe2,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  return (
    <main className="bg-hero min-h-screen">
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#how" className="hover:text-slate-900">How it works</a>
          <a href="#who" className="hover:text-slate-900">Who it's for</a>
          <a href="#pricing" className="hover:text-slate-900">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-secondary">Sign in</Link>
          <Link href="/login" className="btn-primary">Get started</Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            Built for German employers hiring globally
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Onboard international talent into Germany —
            <span className="text-brand-900"> from offer to Anmeldung.</span>
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-xl">
            TalentBridge AI guides your international hires through visas, relocation,
            bureaucracy, and life in Germany — while giving HR a single dashboard to
            track every case, document, and deadline.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/login" className="btn-primary text-base px-5 py-3">
              Try the demo
              <ArrowRight size={18} strokeWidth={1.75} />
            </Link>
            <a href="#features" className="btn-secondary text-base px-5 py-3">See features</a>
          </div>
          <div className="mt-8 flex items-center gap-5 text-xs text-slate-500">
            <Trust label="GDPR aware" />
            <Trust label="Multilingual" />
            <Trust label="Made for the German market" />
          </div>
        </div>

        <div className="relative">
          <div className="card p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 inline-flex items-center justify-center font-bold">TI</div>
                <div>
                  <div className="font-semibold text-slate-900">Tasnuva Shahrin Iqbal</div>
                  <div className="text-xs text-slate-500">Product Manager · Bangladesh → Berlin</div>
                </div>
              </div>
              <span className="chip bg-brand-100 text-brand-700">Visa</span>
            </div>
            <div className="mt-5">
              <div className="text-xs text-slate-500 mb-1">Overall progress</div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[42%] bg-brand-800 rounded-full" />
              </div>
              <div className="text-xs text-slate-500 mt-1">42% complete · 5 of 12 stages</div>
            </div>
            <ol className="mt-5 space-y-2.5 text-sm">
              <Step done text="Offer signed" />
              <Step done text="Contract returned" />
              <Step done text="Visa appointment booked" />
              <Step active text="Blue Card application in review" />
              <Step text="Anmeldung within 14 days of arrival" />
              <Step text="Open German bank account" />
            </ol>
            <div className="mt-5 rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-brand-900 text-white">
                  <Sparkles size={12} strokeWidth={2} />
                </span>
                <span className="text-brand-900 text-xs font-bold uppercase tracking-wide">AI tip</span>
              </div>
              <p className="mt-1 text-slate-700">
                Book your Bürgeramt appointment now — Berlin slots release 14 days ahead and disappear fast.
              </p>
            </div>
          </div>

          <div className="hidden lg:block absolute -bottom-8 -left-10 w-56 card p-4">
            <div className="text-xs text-slate-500">Active cases</div>
            <div className="text-2xl font-bold mt-1">28</div>
            <div className="text-xs text-accent-700 mt-1 inline-flex items-center gap-1">
              <TrendingUp size={14} strokeWidth={1.75} /> 4 this week
            </div>
          </div>
          <div className="hidden lg:block absolute -top-6 -right-6 w-60 card p-4">
            <div className="text-xs text-slate-500">Blocked tasks</div>
            <div className="text-2xl font-bold mt-1">3</div>
            <div className="text-xs text-amber-700 mt-1 inline-flex items-center gap-1">
              <AlertTriangle size={14} strokeWidth={1.75} /> Action required
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Why TalentBridge</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">
            One workflow for every international hire.
          </h2>
          <p className="mt-3 text-slate-600">
            From offer letter to first weekend trip — TalentBridge AI removes the
            paperwork friction that slows German hiring.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Feature title="Stage-based case tracking" body="Visa, Anmeldung, bank, insurance, onboarding — every case follows a clear, shared timeline." icon={<Compass size={20} strokeWidth={1.75} />} />
          <Feature title="AI bureaucracy translator" body="Paste any German letter and get a plain-English summary with deadlines highlighted." icon={<BrainCircuit size={20} strokeWidth={1.75} />} />
          <Feature title="Smart task assignment" body="Auto-assigns the right next step to either HR or the employee at each stage." icon={<ClipboardCheck size={20} strokeWidth={1.75} />} />
          <Feature title="Document center" body="One place for passports, contracts, Anmeldung, Steuer-ID, insurance — securely organised." icon={<FolderClosed size={20} strokeWidth={1.75} />} />
          <Feature title="Life in Germany guides" body="Daily German phrases, doctor booking tips, leisure ideas, and shopping guidance." icon={<Globe2 size={20} strokeWidth={1.75} />} />
          <Feature title="HR analytics & CSV export" body="Track delayed tasks, upcoming deadlines, and active cases — export anytime." icon={<BarChart3 size={20} strokeWidth={1.75} />} />
        </div>
      </section>

      <section id="how" className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: 1, title: "HR creates the case", body: "Enter name, role, visa type, start date. The journey is prefilled." },
              { n: 2, title: "Employee follows their checklist", body: "Step-by-step tasks for visa, arrival, and Anmeldung — on mobile." },
              { n: 3, title: "AI removes the confusion", body: "Asks, translates, and explains German bureaucracy on demand." },
              { n: 4, title: "HR sees the full picture", body: "Dashboards, alerts, and CSV export — never miss a deadline again." },
            ].map((s) => (
              <div key={s.n} className="card p-5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 font-bold inline-flex items-center justify-center">{s.n}</div>
                <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="who" className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-700">Built for</div>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              SMEs, scaleups, and global HR teams hiring into Germany.
            </h2>
            <ul className="mt-5 space-y-3 text-slate-700">
              {[
                "IT, engineering, and product companies hiring globally",
                "Healthcare, logistics, and engineering firms importing skilled workers",
                "Talent acquisition & people-ops teams managing 5–500 international hires per year",
                "International employees moving to Germany for the first time",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-accent-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Stat value="14 days" label="Anmeldung deadline tracked automatically" />
            <Stat value="12" label="Onboarding stages, prefilled" />
            <Stat value="6 EU" label="Visa types covered" />
            <Stat value="24/7" label="AI bureaucracy assistant" />
          </div>
        </div>
      </section>

      <section id="pricing" className="max-w-7xl mx-auto px-6 py-16">
        <div className="card overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-10">
              <h3 className="text-2xl font-bold text-slate-900">Ready to try the demo?</h3>
              <p className="mt-2 text-slate-600">Six international cases preloaded across Berlin, Munich, Hamburg, Frankfurt and Stuttgart. Sign in as HR or as an employee.</p>
              <div className="mt-5 flex gap-3">
                <Link href="/login" className="btn-primary">Launch demo</Link>
                <a href="#features" className="btn-secondary">Learn more</a>
              </div>
            </div>
            <div className="bg-brand-900 text-white p-10">
              <div className="text-sm uppercase tracking-wider opacity-80">Demo includes</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• HR dashboard with 6 preloaded employee cases</li>
                <li>• AI assistant for bureaucracy guidance</li>
                <li>• Stage timeline, tasks, documents and notes</li>
                <li>• CSV export and progress analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} TalentBridge AI · Built for the German market</p>
        </div>
      </footer>
    </main>
  );
}

function Trust({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Check size={14} strokeWidth={2.25} className="text-accent-600" />
      {label}
    </span>
  );
}

function Step({ text, done, active }: { text: string; done?: boolean; active?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[11px] font-bold ${
          done
            ? "bg-accent-600 text-white"
            : active
              ? "bg-brand-800 text-white"
              : "bg-slate-200 text-slate-500"
        }`}
      >
        {done ? <Check size={12} strokeWidth={2.5} /> : active ? <span className="w-1.5 h-1.5 rounded-full bg-white" /> : ""}
      </span>
      <span className={done ? "text-slate-500 line-through" : active ? "font-semibold text-slate-900" : "text-slate-700"}>
        {text}
      </span>
    </li>
  );
}

function Feature({ title, body, icon }: { title: string; body: string; icon: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 inline-flex items-center justify-center">{icon}</div>
      <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card p-5">
      <div className="text-2xl font-bold text-brand-900">{value}</div>
      <div className="text-sm text-slate-600 mt-1">{label}</div>
    </div>
  );
}
