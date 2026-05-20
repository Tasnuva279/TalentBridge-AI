"use client";

import { useState } from "react";
import { Employee, STAGES } from "@/lib/types";
import { uid } from "@/lib/utils";

const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#ec4899", "#06b6d4"];

const blankEmployee = (): Employee => ({
  id: uid("emp"),
  fullName: "",
  email: "",
  countryOfOrigin: "",
  nationality: "",
  role: "",
  department: "",
  startDate: new Date().toISOString(),
  city: "Berlin",
  visaType: "EU Blue Card",
  stage: "offer",
  status: "not_started",
  avatarColor: colors[Math.floor(Math.random() * colors.length)],
  language: "English",
  manager: "Anna Schmidt",
});

export function EmployeeForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Employee;
  onSubmit: (emp: Employee) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Employee>(initial ?? blankEmployee());
  const [errors, setErrors] = useState<Partial<Record<keyof Employee, string>>>({});

  const set = <K extends keyof Employee>(k: K, v: Employee[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!form.fullName.trim()) errs.fullName = "Required";
    if (!form.email.trim()) errs.email = "Required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.role.trim()) errs.role = "Required";
    if (!form.countryOfOrigin.trim()) errs.countryOfOrigin = "Required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Full name" error={errors.fullName}>
          <input className="input" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Country of origin" error={errors.countryOfOrigin}>
          <input className="input" value={form.countryOfOrigin} onChange={(e) => set("countryOfOrigin", e.target.value)} placeholder="e.g. Bangladesh" />
        </Field>
        <Field label="Nationality">
          <input className="input" value={form.nationality} onChange={(e) => set("nationality", e.target.value)} placeholder="e.g. Bangladeshi" />
        </Field>
        <Field label="Job title" error={errors.role}>
          <input className="input" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Product Manager" />
        </Field>
        <Field label="Department">
          <input className="input" value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="e.g. Product" />
        </Field>
        <Field label="German city">
          <input className="input" value={form.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label="Visa type">
          <select className="input" value={form.visaType} onChange={(e) => set("visaType", e.target.value)}>
            <option>EU Blue Card</option>
            <option>Skilled Worker Visa</option>
            <option>Job Seeker Visa</option>
            <option>Freelance / Freiberufler</option>
            <option>ICT Card</option>
            <option>Researcher Visa</option>
          </select>
        </Field>
        <Field label="Start date">
          <input
            className="input"
            type="date"
            value={form.startDate.slice(0, 10)}
            onChange={(e) => set("startDate", new Date(e.target.value).toISOString())}
          />
        </Field>
        <Field label="Stage">
          <select className="input" value={form.stage} onChange={(e) => set("stage", e.target.value as Employee["stage"])}>
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Manager">
          <input className="input" value={form.manager} onChange={(e) => set("manager", e.target.value)} />
        </Field>
        <Field label="Languages">
          <input className="input" value={form.language} onChange={(e) => set("language", e.target.value)} placeholder="e.g. English, Bengali" />
        </Field>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">{initial ? "Save changes" : "Create case"}</button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {error && <span className="text-xs text-rose-600 mt-1 block">{error}</span>}
    </label>
  );
}
