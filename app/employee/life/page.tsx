"use client";

import { Icon } from "@/components/Icons";

const phrases = [
  { de: "Guten Morgen / Guten Tag / Guten Abend", en: "Good morning / good day / good evening" },
  { de: "Entschuldigung, sprechen Sie Englisch?", en: "Excuse me, do you speak English?" },
  { de: "Ich hätte gern …", en: "I would like …" },
  { de: "Wo ist die nächste Apotheke?", en: "Where is the nearest pharmacy?" },
  { de: "Kann ich mit Karte zahlen?", en: "Can I pay by card?" },
  { de: "Zum Mitnehmen, bitte.", en: "To take away, please." },
  { de: "Ich habe einen Termin um …", en: "I have an appointment at …" },
];

const work = [
  { de: "Können wir das im Meeting besprechen?", en: "Can we discuss this in the meeting?" },
  { de: "Ich melde mich später noch einmal.", en: "I will follow up later." },
  { de: "Lass uns das Thema kurz parken.", en: "Let's briefly park this topic." },
  { de: "Können Sie mir die Dokumente per E-Mail schicken?", en: "Can you send me the documents by email?" },
];

const leisure = [
  { title: "Day trips by Deutsche Bahn", body: "Saxon Switzerland, Black Forest, Bavarian Alps, the Rhine valley — all reachable with the Deutschlandticket (€58/month)." },
  { title: "Weekend escapes", body: "Prague, Amsterdam, Copenhagen, Zurich — all under 6h by train or quick Flixbus." },
  { title: "Sunday tip", body: "Most shops close on Sundays. Plan groceries on Saturday; use Sundays for parks, museums, brunch." },
  { title: "Next vacation idea", body: "Try a 4-day getaway to Lake Garda or the Croatian coast — both are direct from southern German hubs in summer." },
];

const health = [
  { title: "Find an English-speaking doctor", body: "Doctolib.de and jameda.de let you filter by language. Book a Hausarzt (GP) first." },
  { title: "Emergency numbers", body: "112 for emergencies. 116 117 for non-emergency after-hours doctor on-call." },
  { title: "Bringing your insurance card", body: "Always bring your statutory or private health insurance card to appointments." },
];

const shopping = [
  { title: "Groceries", body: "Aldi & Lidl (cheapest), Rewe & Edeka (broader), Bio Company (organic). Bring cash for small shops." },
  { title: "Pharmacy vs drugstore", body: "Apotheke = pharmacy (medicine). dm / Rossmann = drugstore (toothpaste, shampoo, baby items)." },
  { title: "Furniture & secondhand", body: "IKEA + Höffner are the giants. For secondhand try eBay Kleinanzeigen — common in every German city." },
];

export default function LifePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Life in Germany</h1>
        <p className="text-sm text-slate-600">Survival German, healthcare, weekend trips, and shopping — the small things that make a move feel like home.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Survival German — day-to-day" icon="🗣️">
          <ul className="space-y-2 text-sm">
            {phrases.map((p) => (
              <li key={p.de} className="flex flex-col rounded-lg border border-slate-200 p-2.5">
                <span className="font-medium text-slate-900">{p.de}</span>
                <span className="text-xs text-slate-500">{p.en}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Professional daily conversations" icon="💼">
          <ul className="space-y-2 text-sm">
            {work.map((p) => (
              <li key={p.de} className="flex flex-col rounded-lg border border-slate-200 p-2.5">
                <span className="font-medium text-slate-900">{p.de}</span>
                <span className="text-xs text-slate-500">{p.en}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Leisure & next vacation ideas" icon="🌍">
          <ul className="space-y-2 text-sm">
            {leisure.map((l) => (
              <li key={l.title} className="rounded-lg border border-slate-200 p-3">
                <div className="font-medium text-slate-900">{l.title}</div>
                <div className="text-slate-600 text-sm">{l.body}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Health — booking a doctor" icon="🩺">
          <ul className="space-y-2 text-sm">
            {health.map((h) => (
              <li key={h.title} className="rounded-lg border border-slate-200 p-3">
                <div className="font-medium text-slate-900">{h.title}</div>
                <div className="text-slate-600 text-sm">{h.body}</div>
              </li>
            ))}
          </ul>
          <button className="btn-primary mt-3 w-full">
            {Icon.Sparkle} Find a doctor near me (demo)
          </button>
        </Card>

        <Card title="Shopping guidance" icon="🛒">
          <ul className="space-y-2 text-sm">
            {shopping.map((s) => (
              <li key={s.title} className="rounded-lg border border-slate-200 p-3">
                <div className="font-medium text-slate-900">{s.title}</div>
                <div className="text-slate-600 text-sm">{s.body}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Quick German etiquette" icon="🇩🇪">
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Punctuality is a sign of respect — arrive 5 minutes early.</li>
            <li>• Recycling matters. Yellow bin = plastic/metal, blue = paper, brown = bio, black = residual.</li>
            <li>• Quiet hours (Ruhezeit) are 22:00–06:00 and all day Sunday.</li>
            <li>• Cash is still king at small bakeries, kiosks, and Spätis.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="section-title mb-3 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-brand-50 inline-flex items-center justify-center text-lg">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}
