"use client";

import { useEffect, useState, useCallback } from "react";
import { AppData, Employee, Task, DocumentItem, Note, StageKey, TaskStatus } from "./types";
import { seedData } from "./seed";

const KEY = "talentbridge:data:v1";
const ROLE_KEY = "talentbridge:role";

type Listener = (data: AppData) => void;
const listeners = new Set<Listener>();

function read(): AppData {
  if (typeof window === "undefined") return seedData;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seedData));
      return seedData;
    }
    return JSON.parse(raw) as AppData;
  } catch {
    return seedData;
  }
}

function write(data: AppData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
  listeners.forEach((l) => l(data));
}

export function resetData() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(seedData));
  listeners.forEach((l) => l(seedData));
}

export function useAppData() {
  const [data, setData] = useState<AppData>(seedData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(read());
    setHydrated(true);
    const l: Listener = (d) => setData(d);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const update = useCallback((updater: (d: AppData) => AppData) => {
    const current = read();
    const next = updater(current);
    write(next);
  }, []);

  return { data, hydrated, update };
}

// Role helpers
export function setRole(role: "hr" | "employee") {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
}
export function getRole(): "hr" | "employee" | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(ROLE_KEY) as "hr" | "employee" | null) ?? null;
}

// Mutators
export const mutators = {
  addEmployee(data: AppData, emp: Employee): AppData {
    return { ...data, employees: [emp, ...data.employees] };
  },
  updateEmployee(data: AppData, id: string, patch: Partial<Employee>): AppData {
    return {
      ...data,
      employees: data.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    };
  },
  deleteEmployee(data: AppData, id: string): AppData {
    return {
      ...data,
      employees: data.employees.filter((e) => e.id !== id),
      tasks: data.tasks.filter((t) => t.assignedTo !== id),
      documents: data.documents.filter((d) => d.employeeId !== id),
      notes: data.notes.filter((n) => n.employeeId !== id),
    };
  },
  addTask(data: AppData, task: Task): AppData {
    return { ...data, tasks: [task, ...data.tasks] };
  },
  updateTask(data: AppData, id: string, patch: Partial<Task>): AppData {
    return {
      ...data,
      tasks: data.tasks.map((t) =>
        t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
      ),
    };
  },
  setTaskStatus(data: AppData, id: string, status: TaskStatus): AppData {
    return mutators.updateTask(data, id, { status });
  },
  deleteTask(data: AppData, id: string): AppData {
    return { ...data, tasks: data.tasks.filter((t) => t.id !== id) };
  },
  addDocument(data: AppData, doc: DocumentItem): AppData {
    return { ...data, documents: [doc, ...data.documents] };
  },
  deleteDocument(data: AppData, id: string): AppData {
    return { ...data, documents: data.documents.filter((d) => d.id !== id) };
  },
  addNote(data: AppData, note: Note): AppData {
    return { ...data, notes: [note, ...data.notes] };
  },
  setCurrentEmployee(data: AppData, id: string): AppData {
    return { ...data, currentEmployeeId: id };
  },
  setEmployeeStage(data: AppData, id: string, stage: StageKey): AppData {
    return mutators.updateEmployee(data, id, { stage });
  },
};
