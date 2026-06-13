import { Employee, StageKey, Task, STAGES } from "./types";

// Mock AI generator. Deterministic, context-aware responses for the demo.
export function aiAnswer(prompt: string, ctx?: { employee?: Employee; tasks?: Task[] }): string {
  const p = prompt.toLowerCase();

  if (p.includes("anmeldung")) {
    return [
      "**Anmeldung — city registration in 3 steps**",
      "1. Book an appointment at the local Bürgeramt (e.g. service.berlin.de). Slots open ~14 days in advance — refresh in the morning.",
      "2. Bring your passport, rental contract, and the **Wohnungsgeberbestätigung** signed by your landlord.",
      "3. After registration, you'll receive your Meldebescheinigung. Your Tax ID (Steuer-ID) arrives by post 2–3 weeks later — you'll need it for your first paycheck.",
      "",
      "Tip: Anmeldung is required by law within 14 days of moving in. Without it you cannot open most German bank accounts.",
    ].join("\n");
  }

  if (p.includes("blue card") || p.includes("visa")) {
    return [
      "**EU Blue Card — what you need**",
      "- A recognised university degree",
      "- A binding job offer with a gross salary above the current threshold (~€45,300 in 2024 for shortage occupations such as IT)",
      "- A signed employment contract",
      "- Passport valid for at least 12 months",
      "",
      "Process: book a consulate appointment in your home country → submit documents → receive entry visa (typically 4–8 weeks) → upon arrival in Germany, apply for the Blue Card residence title at the Ausländerbehörde within 90 days.",
    ].join("\n");
  }

  if (p.includes("tax id") || p.includes("steuer")) {
    return [
      "Your **Steuer-ID** is automatically mailed to your registered address ~2–3 weeks after Anmeldung.",
      "If it hasn't arrived after 4 weeks, you can request it directly from the Bundeszentralamt für Steuern. You need it for: salary, opening a bank account at some banks, and filing tax returns.",
    ].join("\n");
  }

  if (p.includes("bank")) {
    return [
      "**Opening a German bank account**",
      "- Easiest options for newcomers: N26, Commerzbank, Deutsche Bank, Sparkasse.",
      "- Documents: passport, Anmeldung certificate, employment contract, and (sometimes) Tax ID.",
      "- N26 and Revolut accept registration before Anmeldung — useful for your first paycheck. For SEPA mortgages or salary deposits at traditional employers, a Girokonto with IBAN is recommended.",
    ].join("\n");
  }

  if (p.includes("insurance") || p.includes("krankenversicherung")) {
    return [
      "**Health insurance in Germany is mandatory.** You choose between:",
      "- **Statutory (GKV)**: TK, AOK, Barmer, DAK. Premiums ~14.6% of gross salary, employer pays half. Recommended for most employees.",
      "- **Private (PKV)**: Available if you earn above ~€69,300/yr. Cheaper when young & healthy, expensive later. Hard to switch back.",
      "",
      "Your HR will register you once you choose. You'll receive an insurance card by post.",
    ].join("\n");
  }

  if (p.includes("translate") || p.includes("german letter") || p.includes("brief")) {
    return [
      "Paste the text of the letter into this chat and I will translate the key points into plain English and highlight any deadlines, fees, or required actions.",
      "",
      "Common official letters you may receive:",
      "- **Meldebescheinigung** — your proof of registration",
      "- **Steuer-ID** — your tax identification number",
      "- **Beitragsbescheid** — health insurance contribution notice",
      "- **GEZ / Rundfunkbeitrag** — TV/radio fee (mandatory, ~€18.36/month per household)",
    ].join("\n");
  }

  if (p.includes("german") || p.includes("language") || p.includes("a1")) {
    return [
      "**Learning German — quick start**",
      "- A1/A2: Goethe-Institut, VHS (Volkshochschule, very affordable), Babbel, Duolingo.",
      "- For the workplace, focus on greetings, basic small talk, ordering food, and post-office vocabulary first.",
      "- Many companies sponsor courses — ask HR about a budget.",
      "",
      "Daily survival phrases:",
      "- *Entschuldigung, sprechen Sie Englisch?* — Excuse me, do you speak English?",
      "- *Ich hätte gern…* — I would like…",
      "- *Kann ich mit Karte zahlen?* — Can I pay by card? (Spoiler: often no in Germany — bring cash.)",
    ].join("\n");
  }

  if (p.includes("doctor") || p.includes("appointment") || p.includes("health")) {
    return [
      "**Booking a doctor (Arzt)**",
      "- Find an English-speaking doctor on Doctolib.de or jameda.de.",
      "- For general issues see a **Hausarzt** (GP) first. They will refer you to specialists.",
      "- Emergencies: 112. Non-emergency on-call: 116 117.",
      "",
      "Bring your insurance card to every visit. Most GP visits are free with statutory insurance.",
    ].join("\n");
  }

  if (p.includes("leisure") || p.includes("vacation") || p.includes("weekend")) {
    return [
      "**Free time in Germany**",
      "- Day trips by Deutsche Bahn or Flixbus — Saxon Switzerland, Black Forest, Bavarian Alps, the Rhine valley.",
      "- Weekend escapes: Prague, Amsterdam, Copenhagen, Zurich — all under 6h by train.",
      "- Most shops close on Sundays. Use Saturdays for groceries; Sundays are for parks, museums, brunch.",
    ].join("\n");
  }

  if (p.includes("shopping")) {
    return [
      "**Shopping guidance**",
      "- Groceries: Aldi, Lidl (cheapest), Rewe, Edeka (broader range), Bio Company (organic).",
      "- Furniture: IKEA, Höffner, second-hand on eBay Kleinanzeigen.",
      "- Pharmacies (Apotheke) are separate from drugstores (dm, Rossmann). Painkillers and prescriptions only at Apotheke.",
      "- Cash is still king at smaller shops — always carry €20–50.",
    ].join("\n");
  }

  // Stage-aware fallback
  if (ctx?.employee) {
    const stage = STAGES.find((s) => s.key === ctx.employee!.stage);
    return [
      `**Next best actions for ${ctx.employee.fullName}**`,
      `Current stage: **${stage?.label ?? ctx.employee.stage}** — ${stage?.description ?? ""}`,
      "",
      "1. Confirm all documents for this stage are uploaded.",
      "2. Reach out to HR if any task is blocked for more than 3 days.",
      "3. Schedule the next stage's appointments early — German offices book up 2–3 weeks ahead.",
      "",
      "Ask me about: *Anmeldung*, *Blue Card*, *Tax ID*, *Bank Account*, *Health Insurance*, *learning German*, *doctor appointments*.",
    ].join("\n");
  }

  return [
    "I can help you navigate German bureaucracy and onboarding. Try asking:",
    "- *How does Anmeldung work?*",
    "- *What documents do I need for a Blue Card?*",
    "- *How do I open a German bank account?*",
    "- *Translate this letter for me.*",
    "- *Recommend German health insurance.*",
  ].join("\n");
}

export function aiExplainLetter(letterTitle: string): string {
  return [
    `**Plain-English summary of "${letterTitle}"**`,
    "",
    "This letter appears to be an official notice from a German authority. Key points typically include:",
    "- Your name, address, and a case/reference number",
    "- A statement of what is being decided or requested",
    "- Required action and deadline (usually 14, 30, or 42 days)",
    "- Where to send a response and how to appeal",
    "",
    "⚠️ Always check the deadline first. Missing a German bureaucracy deadline often means a fine. If unsure, send a copy to your HR or to me, and I'll flag the next action.",
  ].join("\n");
}

export function aiNextChecklist(stage: StageKey): string[] {
  switch (stage) {
    case "offer":
      return ["Sign offer letter", "Upload passport scan to HR", "Confirm preferred start date"];
    case "contract":
      return ["Read and sign the employment contract", "Return signed copy to HR", "Save digital copy in your records"];
    case "visa":
      return [
        "Book consulate appointment",
        "Prepare passport, contract, diploma, photos",
        "Apply for entry visa / Blue Card",
        "Notify HR of approval date",
      ];
    case "relocation":
      return [
        "Finalise flights and share itinerary with HR",
        "Confirm temporary accommodation",
        "Plan shipping or essential luggage",
      ];
    case "arrival":
      return ["Airport pickup confirmed", "Settle into temporary accommodation", "Get a German SIM card (Aldi Talk, O2, Vodafone)"];
    case "anmeldung":
      return [
        "Book Bürgeramt appointment within 14 days",
        "Get Wohnungsgeberbestätigung from landlord",
        "Attend appointment, collect Meldebescheinigung",
      ];
    case "bank":
      return ["Choose bank (N26, Sparkasse, Commerzbank)", "Bring passport + Anmeldung", "Share IBAN with HR for payroll"];
    case "insurance":
      return [
        "Compare statutory providers (TK, AOK, Barmer)",
        "Sign up online and forward confirmation to HR",
        "Wait for insurance card by post",
      ];
    case "onboarding":
      return [
        "Day 1 office tour",
        "Receive laptop & access cards",
        "Complete compliance trainings",
        "Schedule first 1:1 with manager",
      ];
    case "probation":
      return [
        "Schedule monthly 1:1 with manager",
        "Document goals and feedback in writing",
        "Aim for mid-probation review at 3 months",
      ];
    case "life":
      return [
        "Register for an A1 / A2 German course",
        "Find a Hausarzt (general doctor) near home",
        "Plan one weekend trip within Germany",
        "Set up your Rundfunkbeitrag (TV fee) account",
      ];
    case "offboarding":
      return [
        "Final 1:1 with manager",
        "Return laptop and access cards",
        "Receive Arbeitszeugnis (work reference)",
        "Confirm last pay slip & tax docs",
      ];
  }
}

export function aiHRSummary(emp: Employee, tasks: Task[]): string {
  const empTasks = tasks.filter((t) => t.assignedTo === emp.id);
  const completed = empTasks.filter((t) => t.status === "completed").length;
  const blocked = empTasks.filter((t) => t.status === "blocked").length;
  const inProgress = empTasks.filter((t) => t.status === "in_progress").length;
  const stage = STAGES.find((s) => s.key === emp.stage);
  return [
    `**${emp.fullName}** — ${emp.role}, ${emp.department}`,
    `From ${emp.countryOfOrigin}, relocating to ${emp.city}. Visa: ${emp.visaType}.`,
    `Current stage: **${stage?.label}** (${stage?.description}).`,
    "",
    `Progress: ${completed}/${empTasks.length} tasks completed. ${inProgress} in progress, ${blocked} blocked.`,
    blocked > 0
      ? "⚠️ Blocked tasks need immediate HR attention to avoid delays in start date."
      : "✅ Case is on track.",
    "",
    `Suggested HR next step: ${stage?.key === "visa"
      ? "Follow up with the consulate for visa appointment confirmation."
      : stage?.key === "anmeldung"
        ? "Help employee secure landlord paperwork for Anmeldung."
        : "Continue regular weekly check-ins and confirm upcoming milestones."}`,
  ].join("\n");
}
