# TalentBridge AI

> AI-powered relocation and onboarding platform for German companies hiring
> international employees — from offer to visa, Anmeldung, bank, insurance,
> onboarding and life in Germany.

A B2B SaaS prototype built with **Next.js 14 (App Router) + TypeScript +
Tailwind CSS**. Demo data persists in `localStorage`, so you can refresh, log
out, and pick up where you left off.

## Features

### Landing & login
- Marketing landing page with hero, features, how-it-works and call-to-action
- Role selector login (HR Admin or International Employee)

### HR / Admin Portal (`/hr`)
- **Dashboard** — KPI cards, employees-by-stage, upcoming & overdue alerts, recent cases table
- **Employees** — full CRUD, search & filter by status, country, role, visa stage, progress %; CSV export
- **Employee detail** — stage timeline (clickable), task list with status updates, document upload, internal HR notes, AI HR summary
- **Tasks** — global task list across cases with full filter/edit/delete
- **Document center** — search and filter all uploaded docs by employee/type
- **AI assistant** — generate HR case summaries, translate German letters, chat with bureaucracy AI
- **Settings** — workspace info, reset demo data, switch role

### Employee Portal (`/employee`)
- **My dashboard** — personalised greeting, KPIs, stage timeline, upcoming tasks, AI-suggested next actions
- **Germany checklist** — visa & arrival checklists, tasks grouped by stage, status updates
- **Tasks** — focused task list, status updates, overdue highlights
- **Documents** — upload placeholders for passport, contract, Anmeldung, Steuer-ID etc.
- **AI assistant** — chat, letter translator, FAQ accordion
- **Life in Germany** — survival German, professional phrases, leisure & vacation ideas, doctor & shopping guides
- **Profile** — switch demo employee, reset data

### AI module
- Context-aware mock responses for Anmeldung, Blue Card, Tax ID, bank, insurance, doctor, language, shopping, leisure
- Letter translator that produces a plain-English summary template
- AI HR case summary generator
- Stage-aware "next best actions"

### Preloaded demo data — six international hires
| Name | Role | From | City | Stage |
| --- | --- | --- | --- | --- |
| Tasnuva Shahrin Iqbal | Product Manager | Bangladesh | Berlin | Visa |
| John Doe | Fullstack Developer | United Kingdom | Munich | Relocation |
| Maria Rodriguez | UI/UX Designer | Mexico | Hamburg | Anmeldung (blocked) |
| Arjun Patel | Fullstack Developer | India | Frankfurt | Onboarding |
| Wei Chen | Data Engineer | China | Stuttgart | Life in Germany |
| Sofia Almeida | Product Manager | Brazil | Berlin | Offer |

## Getting started

Prerequisites: **Node.js 18+** (Node 20 LTS recommended).

```bash
# 1. install dependencies
npm install

# 2. start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

## How to test the demo

1. **Landing** — open `/` and click **Try the demo** or **Get started**.
2. **Login** — choose **HR / Admin** or **International Employee** and continue. The role is stored in localStorage.
3. **HR walkthrough**
   - Dashboard: KPIs, stage breakdown, alerts.
   - Employees: search "Tasnuva", filter by *Visa* stage, export CSV.
   - Open an employee → click stages on the timeline to update, add a task, upload a doc, click **AI summary**.
   - Tasks: filter by *Blocked* to see Maria's Anmeldung blocker.
   - Documents: filter by employee.
   - AI assistant: pick an employee, generate summary, paste a letter title to translate, chat.
4. **Employee walkthrough**
   - From Settings → *Switch demo employee* to switch between the 6 preloaded hires.
   - Dashboard: see personalised greeting, progress %, next AI actions.
   - Germany checklist: visa + arrival checklists, tasks by stage.
   - Tasks: tick checkbox or update status; overdue items are highlighted.
   - Documents: upload a placeholder.
   - AI assistant: ask "How does Anmeldung work?" or "Translate this letter".
   - Life in Germany: survival phrases, doctor tips, vacation ideas.
5. **Reset** — open Settings on either portal and click *Reset demo data*.

## Tech notes

- **Framework**: Next.js 14 App Router, TypeScript strict.
- **Styling**: Tailwind CSS with a custom soft blue/green/white palette.
- **State**: lightweight `useAppData` hook backed by `localStorage` with a
  pub/sub listener — all components stay in sync without a global store
  library.
- **CSV export**: in-browser `Blob` + `URL.createObjectURL` download.
- **AI**: deterministic mock responses in `lib/ai.ts` — swap in a real LLM
  call without touching the UI.
- **Responsive**: sidebar collapses to a top scrollable pill nav on mobile.

## Project structure

```
app/
  page.tsx                     Landing page
  login/page.tsx               Role selector
  hr/
    layout.tsx                 HR sidebar + topbar
    page.tsx                   HR dashboard
    employees/page.tsx         Employee list (search/filter/CSV)
    employees/[id]/page.tsx    Employee detail (stages/tasks/docs/notes/AI)
    tasks/page.tsx             Cross-case task manager
    documents/page.tsx         Global document center
    assistant/page.tsx         AI assistant (summary + chat + letter)
    settings/page.tsx          Workspace settings
  employee/
    layout.tsx                 Employee sidebar + topbar
    page.tsx                   Employee dashboard
    checklist/page.tsx         Germany checklist
    tasks/page.tsx             My tasks
    documents/page.tsx         My documents
    assistant/page.tsx         AI + FAQ
    life/page.tsx              Life in Germany guides
    settings/page.tsx          Profile + switch demo employee
components/
  Sidebar, Logo, KPICard, ProgressBar, StatusBadge, StageTimeline,
  Modal, Avatar, AIChat, EmployeeForm, TaskForm, Icons
lib/
  types.ts   App types, stages, status constants
  seed.ts    Preloaded demo data
  store.ts   useAppData hook + localStorage mutators
  ai.ts      Mock AI responses
  csv.ts     CSV export
  utils.ts   Small helpers (uid, dates, classNames)
```

Built as a portfolio-ready prototype for the German talent market.
