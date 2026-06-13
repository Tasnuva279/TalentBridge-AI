"use client";

import { mutators, useAppData } from "@/lib/store";
import { Icon } from "@/components/Icons";
import { DocumentItem } from "@/lib/types";
import { formatDate, uid } from "@/lib/utils";

export default function EmployeeDocumentsPage() {
  const { data, hydrated, update } = useAppData();
  if (!hydrated) return <div className="muted">Loading…</div>;
  const emp = data.employees.find((e) => e.id === data.currentEmployeeId) ?? data.employees[0];
  if (!emp) return <div className="muted">No employee.</div>;

  const docs = data.documents.filter((d) => d.employeeId === emp.id);

  const upload = () => {
    const name = prompt("Document name (this is a demo — no real upload):", "Passport scan.pdf");
    if (!name) return;
    const doc: DocumentItem = {
      id: uid("doc"),
      name,
      type: "other",
      uploadedBy: "employee",
      uploadedAt: new Date().toISOString(),
      employeeId: emp.id,
      sizeKB: Math.floor(120 + Math.random() * 400),
    };
    update((d) => mutators.addDocument(d, doc));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My documents</h1>
          <p className="text-sm text-slate-600">Upload passport, contract, Anmeldung, Steuer-ID, and other proofs.</p>
        </div>
        <button onClick={upload} className="btn-primary">{Icon.Upload} Upload document</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((d) => (
          <div key={d.id} className="card p-4">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 inline-flex items-center justify-center shrink-0">{Icon.Docs}</span>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-slate-900 truncate">{d.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {d.type.toUpperCase()} · {d.sizeKB} KB · {formatDate(d.uploadedAt)}
                </div>
                <div className="text-xs text-slate-500">Uploaded by {d.uploadedBy.toUpperCase()}</div>
              </div>
              <button
                onClick={() => update((dd) => mutators.deleteDocument(dd, d.id))}
                className="btn-ghost p-2 text-rose-600 hover:bg-rose-50"
                aria-label="Delete"
              >{Icon.Trash}</button>
            </div>
          </div>
        ))}
        {docs.length === 0 && (
          <div className="card p-10 text-center text-slate-500 sm:col-span-2 lg:col-span-3">
            You haven't uploaded any documents yet. Tap "Upload document" to add one.
          </div>
        )}
      </div>
    </div>
  );
}
