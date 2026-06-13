import { AppData, Employee, Task, DocumentItem, Note } from "./types";

const today = () => new Date().toISOString();
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

const employees: Employee[] = [
  {
    id: "emp-001",
    fullName: "Tasnuva Shahrin Iqbal",
    email: "tasnuva.iqbal@talentbridge.example",
    countryOfOrigin: "Bangladesh",
    nationality: "Bangladeshi",
    role: "Product Manager",
    department: "Product",
    startDate: daysFromNow(20),
    city: "Berlin",
    visaType: "EU Blue Card",
    stage: "visa",
    status: "in_progress",
    avatarColor: "#3b82f6",
    language: "English, Bengali",
    manager: "Lukas Becker",
  },
  {
    id: "emp-002",
    fullName: "John Doe",
    email: "john.doe@talentbridge.example",
    countryOfOrigin: "United Kingdom",
    nationality: "British",
    role: "Fullstack Developer",
    department: "Engineering",
    startDate: daysFromNow(7),
    city: "Munich",
    visaType: "Skilled Worker Visa",
    stage: "relocation",
    status: "in_progress",
    avatarColor: "#10b981",
    language: "English",
    manager: "Anna Schmidt",
  },
  {
    id: "emp-003",
    fullName: "Maria Rodriguez",
    email: "maria.rodriguez@talentbridge.example",
    countryOfOrigin: "Mexico",
    nationality: "Mexican",
    role: "UI/UX Designer",
    department: "Design",
    startDate: daysFromNow(-14),
    city: "Hamburg",
    visaType: "EU Blue Card",
    stage: "anmeldung",
    status: "blocked",
    avatarColor: "#f59e0b",
    language: "English, Spanish",
    manager: "Felix Wagner",
  },
  {
    id: "emp-004",
    fullName: "Arjun Patel",
    email: "arjun.patel@talentbridge.example",
    countryOfOrigin: "India",
    nationality: "Indian",
    role: "Fullstack Developer",
    department: "Engineering",
    startDate: daysFromNow(-30),
    city: "Frankfurt",
    visaType: "EU Blue Card",
    stage: "onboarding",
    status: "in_progress",
    avatarColor: "#8b5cf6",
    language: "English, Hindi",
    manager: "Anna Schmidt",
  },
  {
    id: "emp-005",
    fullName: "Wei Chen",
    email: "wei.chen@talentbridge.example",
    countryOfOrigin: "China",
    nationality: "Chinese",
    role: "Data Engineer",
    department: "Engineering",
    startDate: daysFromNow(-60),
    city: "Stuttgart",
    visaType: "Skilled Worker Visa",
    stage: "life",
    status: "completed",
    avatarColor: "#ef4444",
    language: "English, Mandarin",
    manager: "Anna Schmidt",
  },
  {
    id: "emp-006",
    fullName: "Sofia Almeida",
    email: "sofia.almeida@talentbridge.example",
    countryOfOrigin: "Brazil",
    nationality: "Brazilian",
    role: "Product Manager",
    department: "Product",
    startDate: daysFromNow(45),
    city: "Berlin",
    visaType: "EU Blue Card",
    stage: "offer",
    status: "not_started",
    avatarColor: "#ec4899",
    language: "English, Portuguese",
    manager: "Lukas Becker",
  },
];

const taskTemplates: { stage: Task["stage"]; title: string; description: string; ownedBy: "hr" | "employee" }[] = [
  { stage: "offer", title: "Sign offer letter", description: "Review and sign the digital offer letter.", ownedBy: "employee" },
  { stage: "contract", title: "Return signed contract", description: "Upload countersigned contract.", ownedBy: "employee" },
  { stage: "visa", title: "Submit visa documents to consulate", description: "Passport, contract, proof of qualification.", ownedBy: "employee" },
  { stage: "visa", title: "Provide HR support letter", description: "HR to send formal employment letter for visa appointment.", ownedBy: "hr" },
  { stage: "relocation", title: "Book temporary housing", description: "2-4 weeks of furnished apartment near office.", ownedBy: "hr" },
  { stage: "arrival", title: "Pickup at airport", description: "Coordinate airport transfer with the relocation partner.", ownedBy: "hr" },
  { stage: "anmeldung", title: "Book Bürgeramt appointment", description: "Anmeldung must happen within 14 days of moving in.", ownedBy: "employee" },
  { stage: "bank", title: "Open German bank account", description: "Bring passport, Anmeldung, and contract.", ownedBy: "employee" },
  { stage: "insurance", title: "Choose health insurance provider", description: "Statutory (TK, AOK) or private. Confirm with HR.", ownedBy: "employee" },
  { stage: "onboarding", title: "Day 1 office tour & laptop setup", description: "IT will hand over the laptop and access cards.", ownedBy: "hr" },
  { stage: "onboarding", title: "Complete compliance trainings", description: "GDPR, anti-harassment, security.", ownedBy: "employee" },
  { stage: "life", title: "Register for A1 German course", description: "Company sponsors first 3 months of language classes.", ownedBy: "employee" },
];

function makeTasks(): Task[] {
  const tasks: Task[] = [];
  employees.forEach((emp) => {
    taskTemplates.forEach((t, idx) => {
      // generate a coherent status based on the employee stage
      const stageOrder = [
        "offer", "contract", "visa", "relocation", "arrival",
        "anmeldung", "bank", "insurance", "onboarding", "probation",
        "offboarding", "life",
      ];
      const empStageIdx = stageOrder.indexOf(emp.stage);
      const taskStageIdx = stageOrder.indexOf(t.stage);
      let status: Task["status"] = "not_started";
      if (taskStageIdx < empStageIdx) status = "completed";
      else if (taskStageIdx === empStageIdx) status = emp.status;
      else status = "not_started";

      // sprinkle a couple of blocked tasks
      if (emp.id === "emp-003" && t.stage === "anmeldung") status = "blocked";

      tasks.push({
        id: `task-${emp.id}-${idx}`,
        title: t.title,
        description: t.description,
        stage: t.stage,
        status,
        dueDate: daysFromNow(taskStageIdx * 4 - 5),
        assignedTo: emp.id,
        ownedBy: t.ownedBy,
        createdAt: today(),
        updatedAt: today(),
      });
    });
  });
  return tasks;
}

function makeDocuments(): DocumentItem[] {
  const docs: DocumentItem[] = [];
  employees.forEach((e) => {
    docs.push({
      id: `doc-${e.id}-passport`,
      name: "Passport (scan).pdf",
      type: "passport",
      uploadedBy: "employee",
      uploadedAt: today(),
      employeeId: e.id,
      sizeKB: 412,
    });
    docs.push({
      id: `doc-${e.id}-contract`,
      name: "Employment Contract.pdf",
      type: "contract",
      uploadedBy: "hr",
      uploadedAt: today(),
      employeeId: e.id,
      sizeKB: 220,
    });
  });
  return docs;
}

const notes: Note[] = [
  {
    id: "note-1",
    employeeId: "emp-001",
    author: "Anna (HR)",
    body: "Blue Card application submitted to the Berlin consulate on Monday.",
    createdAt: today(),
  },
  {
    id: "note-2",
    employeeId: "emp-003",
    author: "Anna (HR)",
    body: "Maria's Anmeldung blocked — landlord hasn't issued Wohnungsgeberbestätigung yet.",
    createdAt: today(),
  },
];

export const seedData: AppData = {
  employees,
  tasks: makeTasks(),
  documents: makeDocuments(),
  notes,
  currentEmployeeId: "emp-001",
};
