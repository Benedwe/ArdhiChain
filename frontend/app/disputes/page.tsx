"use client";

import { useState } from "react";

const disputes = [
  {
    id: "D-001", parcel: "TZ-PARCEL-0003", status: "Open", filer: "0x7a2...f3e1", respondent: "0x3b1...a9c2",
    description: "Boundary dispute — claimant alleges the eastern boundary extends 15m beyond the registered coordinates.",
    evidence: "QmEvidence001", created: "3 days ago",
    timeline: [
      { event: "Dispute filed", time: "3 days ago", done: true },
      { event: "Evidence submitted by claimant", time: "2 days ago", done: true },
      { event: "Respondent response", time: "Pending", done: false },
      { event: "Officer review", time: "Pending", done: false },
      { event: "Resolution", time: "Pending", done: false },
    ],
  },
  {
    id: "D-002", parcel: "TZ-PARCEL-0012", status: "Evidence Submitted", filer: "0x9f4...d7b3", respondent: "0x1c8...e5a4",
    description: "Ownership challenge — claimant presents historical deed predating the current registration.",
    evidence: "QmEvidence002", created: "5 days ago",
    timeline: [
      { event: "Dispute filed", time: "5 days ago", done: true },
      { event: "Evidence submitted by claimant", time: "4 days ago", done: true },
      { event: "Respondent response", time: "3 days ago", done: true },
      { event: "Officer review", time: "In progress", done: false },
      { event: "Resolution", time: "Pending", done: false },
    ],
  },
  {
    id: "D-003", parcel: "TZ-PARCEL-0025", status: "Resolved", filer: "0x4d2...b8f6", respondent: "0x6e7...c1d9",
    description: "Encroachment dispute — resolved in favor of respondent after survey confirmation.",
    evidence: "QmEvidence003", created: "2 weeks ago",
    timeline: [
      { event: "Dispute filed", time: "2 weeks ago", done: true },
      { event: "Evidence submitted by claimant", time: "12 days ago", done: true },
      { event: "Respondent response", time: "10 days ago", done: true },
      { event: "Officer review", time: "8 days ago", done: true },
      { event: "Resolved — respondent", time: "5 days ago", done: true },
    ],
  },
  {
    id: "D-004", parcel: "TZ-PARCEL-0041", status: "Open", filer: "0x1c8...e5a4", respondent: "0x7a2...f3e1",
    description: "Fraudulent registration claim — filer asserts the parcel was registered without proper documentation.",
    evidence: "QmEvidence004", created: "1 day ago",
    timeline: [
      { event: "Dispute filed", time: "1 day ago", done: true },
      { event: "Evidence submission", time: "Pending", done: false },
      { event: "Respondent response", time: "Pending", done: false },
      { event: "Officer review", time: "Pending", done: false },
      { event: "Resolution", time: "Pending", done: false },
    ],
  },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Open": "badge badge-red",
    "Evidence Submitted": "badge badge-amber",
    "Resolved": "badge badge-emerald",
    "Rejected": "badge badge-slate",
  };
  return <span className={map[status] ?? "badge badge-slate"}>{status}</span>;
}

export default function DisputesPage() {
  const [filter, setFilter] = useState<"all" | "Open" | "Evidence Submitted" | "Resolved">("all");
  const filtered = filter === "all" ? disputes : disputes.filter((d) => d.status === filter);
  const openCount = disputes.filter((d) => d.status === "Open").length;
  const resolvedCount = disputes.filter((d) => d.status === "Resolved").length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="badge badge-amber mb-3"><span className="dot dot-amber" /> Dispute Management</div>
        <h1 className="text-3xl font-bold text-slate-900">Dispute Resolution Center</h1>
        <p className="mt-1 text-slate-600">Track disputes, review evidence, and follow the resolution process for land parcels.</p>
      </div>

      {/* Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-100">
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{openCount}</p>
              <p className="text-sm text-slate-500">Open Disputes</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100">
              <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{disputes.filter(d => d.status === "Evidence Submitted").length}</p>
              <p className="text-sm text-slate-500">Under Review</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{resolvedCount}</p>
              <p className="text-sm text-slate-500">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex gap-2">
        {(["all", "Open", "Evidence Submitted", "Resolved"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${filter === f ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50 ring-1 ring-slate-200"}`}>
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {/* Dispute cards */}
      <div className="mt-6 space-y-4">
        {filtered.map((d) => (
          <div key={d.id} className="card overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-800">{d.id}</span>
                    <StatusBadge status={d.status} />
                    <span className="badge badge-slate">{d.parcel}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{d.description}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>Filer: <span className="font-mono">{d.filer}</span></span>
                    <span>Respondent: <span className="font-mono">{d.respondent}</span></span>
                    <span>Evidence: <span className="font-mono">{d.evidence}</span></span>
                    <span>Filed {d.created}</span>
                  </div>
                </div>
                <button className="btn-secondary shrink-0 text-xs">File Response</button>
              </div>
            </div>

            {/* Timeline */}
            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Resolution Timeline</p>
              <div className="flex flex-wrap gap-1">
                {d.timeline.map((step, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${step.done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                      {step.done ? (
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs ${step.done ? "font-medium text-slate-700" : "text-slate-400"}`}>{step.event}</span>
                    {i < d.timeline.length - 1 && <svg className="h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
