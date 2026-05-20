"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { mutators, useAppData } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/Icons";
import { DocumentItem } from "@/lib/types";
import { formatDate, uid } from "@/lib/utils";

export default function HRDocumentsPage() {
  const { data, hydrated, update } = useAppData();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const [employee, setEmployee] = useState<string>("all");

  const filtered = useMemo(() => {
    return data.documents.filter((d) => {
      if (type !== "all" && d.type !== type) return false;
      if (employee !== "all" && d.employeeId !== employee) return false;
      if (query) {
        const emp = data.employees.find((e) => e.id === d.employeeId);
        const q = query.toLowerCase();
        if (
          !d.name.toLowerCase().includes(q) &&
          !(emp?.fullName ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [data.documents, data.employees, type, employee, query]);

  if (!hydrated) return <div className="muted">Loading…</div>;

  const types = ["passport", "contract", "visa", "anmeldung", "tax_id", "insurance", "diploma", "other"];

  const upload = () => {
    if (data.employees.length === 0) return;
    const empId = prompt(`Employee ID (${data.employees.map((e) => e.id).join(", ")}):`, data.employees[0].id);
    if (!empId) return;
    const name = prompt("Document name:", "Document.pdf");
    if (!name) return;
    const doc: DocumentItem = {
      id: uid("doc"),
      name,
      type: "other",
      uploadedBy: "hr",
      uploadedAt: new Date().toISOString(),
      employeeId: empId,
      sizeKB: Math.floor(120 + Math.random() * 400),
    };
    update((d) => mutators.addDocument(d, doc));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Center</h1>
          <p className="text-sm text-slate-600">All uploaded passports, contracts, visas, and bureaucracy docs in one place.</p>
        </div>
        <button onClick={upload} className="btn-primary">{Icon.Upload} Upload</button>
      </div>

      <div className="card p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="relative lg:col-span-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{Icon.Search}</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search documents…" className="input pl-9" />
        </div>
        <select value={employee} onChange={(e) => setEmployee(e.target.value)} className="input">
          <option value="all">All employees</option>
          {data.employees.map((e) => <option key={e.id} value={e.id}>{e.fullName}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="input">
          <option value="all">All types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => {
          const emp = data.employees.find((e) => e.id === d.employeeId);
          return (
            <div key={d.id} className="card p-4">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 inline-flex items-center justify-center shrink-0">
                  {Icon.Docs}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-900 truncate">{d.name}</div>
                  <div className="text-xs text-slate-500">{d.type.toUpperCase()} · {d.sizeKB} KB · uploaded {formatDate(d.uploadedAt)}</div>
                  {emp && (
                    <Link href={`/hr/employees/${emp.id}`} className="mt-2 inline-flex items-center gap-2 text-sm hover:text-brand-700">
                      <Avatar name={emp.fullName} color={emp.avatarColor} size={20} /> {emp.fullName}
                    </Link>
                  )}
                </div>
                <button
                  onClick={() => update((dd) => mutators.deleteDocument(dd, d.id))}
                  className="btn-ghost p-2 text-rose-600 hover:bg-rose-50"
                  aria-label="Delete"
                >{Icon.Trash}</button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card p-10 text-center text-slate-500 sm:col-span-2 lg:col-span-3">No documents match these filters.</div>
        )}
      </div>
    </div>
  );
}
