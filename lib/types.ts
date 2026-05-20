export type Role = "hr" | "employee";

export type StageKey =
  | "offer"
  | "contract"
  | "visa"
  | "relocation"
  | "arrival"
  | "anmeldung"
  | "bank"
  | "insurance"
  | "onboarding"
  | "probation"
  | "offboarding"
  | "life";

export const STAGES: { key: StageKey; label: string; description: string }[] = [
  { key: "offer", label: "Offer", description: "Job offer signed and accepted" },
  { key: "contract", label: "Contract", description: "Employment contract issued" },
  { key: "visa", label: "Visa", description: "Work visa / Blue Card application" },
  { key: "relocation", label: "Relocation", description: "Flights, housing, shipping" },
  { key: "arrival", label: "Arrival", description: "Landing in Germany" },
  { key: "anmeldung", label: "Anmeldung", description: "City registration (Bürgeramt)" },
  { key: "bank", label: "Bank Account", description: "Open a German bank account" },
  { key: "insurance", label: "Health Insurance", description: "Choose statutory or private cover" },
  { key: "onboarding", label: "Onboarding", description: "First day, tools, intro plan" },
  { key: "probation", label: "Probation", description: "First 6 months performance" },
  { key: "offboarding", label: "Offboarding", description: "Exit, references, paperwork" },
  { key: "life", label: "Life in Germany", description: "Language, health, leisure, shopping" },
];

export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  stage: StageKey;
  status: TaskStatus;
  dueDate?: string; // ISO date
  assignedTo: string; // employee id
  ownedBy: "hr" | "employee";
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type:
    | "passport"
    | "contract"
    | "visa"
    | "anmeldung"
    | "tax_id"
    | "insurance"
    | "diploma"
    | "other";
  uploadedBy: "hr" | "employee";
  uploadedAt: string;
  employeeId: string;
  sizeKB: number;
  note?: string;
}

export interface Note {
  id: string;
  employeeId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  countryOfOrigin: string;
  nationality: string;
  role: string; // job title
  department: string;
  startDate: string; // ISO
  city: string; // German city of relocation
  visaType: string;
  stage: StageKey;
  status: TaskStatus;
  avatarColor: string;
  language: string;
  manager: string;
  archived?: boolean;
}

export interface AppData {
  employees: Employee[];
  tasks: Task[];
  documents: DocumentItem[];
  notes: Note[];
  // currently signed-in employee id (for employee role demo)
  currentEmployeeId: string;
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  completed: "Completed",
};

export const STATUS_COLOR: Record<TaskStatus, string> = {
  not_started: "bg-slate-100 text-slate-700",
  in_progress: "bg-brand-100 text-brand-700",
  blocked: "bg-amber-100 text-amber-700",
  completed: "bg-accent-100 text-accent-700",
};
