"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { mutators, useAppData } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/Icons";
import { FileText } from "lucide-react";
import { DocumentItem } from "@/lib/types";
import { formatDate, uid } from "@/lib/utils";

type DocStatus = "verified" | "needs_review";

// Employee-uploaded files await HR verification; HR-uploaded official records
// are treated as already verified (human-in-the-loop review model).
function docStatus(d: DocumentItem): DocStatus {
  return d.uploadedBy === "hr" ? "verified" : "needs_review";
}

const CATEGORY_LABEL: Record<DocumentItem["type"], string> = {
  passport: "Passport",
  contract: "Contract",
  visa: "Visa",
  anmeldung: "Anmeldung",
  tax_id: "Tax ID",
  insurance: "Insurance",
  diploma: "Diploma",
  other: "Other",
};

function StatusBadge({ status }: { status: DocStatus }) {
  if (status === "verified") {
    return (
      <span className="chip bg-accent-50 text-accent-700">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-600" />
        Verified
      </span>
    );
  }
  return (
    <span className="chip bg-amber-50 text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Needs Review
    </span>
  );
}

export default function HRDocumentsPage() {
  const { data, hydrated, update } = useAppData();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const [employee, setEmployee] = useState<string>("all");
  const [status, setStatus] = useState<"all" | DocStatus>("all");

  const filtered = useMemo(() => {
    return data.documents.filter((d) => {
      if (type !== "all" && d.type !== type) return false;
      if (employee !== "all" && d.employeeId !== employee) return false;
      if (status !== "all" && docStatus(d) !== status) return false;
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
  }, [data.documents, data.employees, type, employee, status, query]);

  if (!hydrated) return <div className="muted">Loading…</div>;

  const types = Object.keys(CATEGORY_LABEL) as DocumentItem["type"][];
  const verifiedCount = data.documents.filter((d) => docStatus(d) === "verified").length;
  const reviewCount = data.documents.length - verifiedCount;

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
          <h1 className="text-2xl font-bold text-slate-900">Compliance Document Hub</h1>
          <p className="text-sm text-slate-600">
            {data.documents.length} records · {verifiedCount} verified · {reviewCount} awaiting review.
          </p>
        </div>
        <button onClick={upload} className="btn-primary">{Icon.Upload} Upload</button>
      </div>

      <div className="card p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
        <div className="relative lg:col-span-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{Icon.Search}</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search documents or employees…" className="input pl-9" />
        </div>
        <select value={employee} onChange={(e) => setEmployee(e.target.value)} className="input">
          <option value="all">All employees</option>
          {data.employees.map((e) => <option key={e.id} value={e.id}>{e.fullName}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="input">
          <option value="all">All categories</option>
          {types.map((t) => <option key={t} value={t}>{CATEGORY_LABEL[t]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as "all" | DocStatus)} className="input">
          <option value="all">All statuses</option>
          <option value="verified">Verified</option>
          <option value="needs_review">Needs Review</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Associated Employee</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 whitespace-nowrap">Uploaded</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">File Size</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const emp = data.employees.find((e) => e.id === d.employeeId);
                return (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 inline-flex items-center justify-center shrink-0">
                          <FileText size={18} strokeWidth={1.75} />
                        </span>
                        <span className="font-medium text-slate-900 truncate max-w-[220px]">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {emp ? (
                        <Link href={`/hr/employees/${emp.id}`} className="flex items-center gap-2 hover:text-brand-800">
                          <Avatar name={emp.fullName} color={emp.avatarColor} size={24} />
                          <span className="text-slate-700">{emp.fullName}</span>
                        </Link>
                      ) : (
                        <span className="muted">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="chip bg-slate-100 text-slate-700">{CATEGORY_LABEL[d.type]}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(d.uploadedAt)}</td>
                    <td className="px-4 py-3 text-slate-600 text-right tabular-nums whitespace-nowrap">{d.sizeKB} KB</td>
                    <td className="px-4 py-3"><StatusBadge status={docStatus(d)} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => update((dd) => mutators.deleteDocument(dd, d.id))}
                          className="btn-ghost p-2 text-rose-600 hover:bg-rose-50"
                          aria-label="Delete"
                        >{Icon.Trash}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-slate-500 py-12">No documents match these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
