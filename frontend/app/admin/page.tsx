"use client";

import { useState } from "react";

const pendingParcels = [
  { id: "TZ-PARCEL-0002", owner: "0x3b1...a9c2", region: "Arusha", submitted: "2 days ago" },
  { id: "TZ-PARCEL-0004", owner: "0x1c8...e5a4", region: "Mwanza", submitted: "4 days ago" },
  { id: "TZ-PARCEL-0008", owner: "0x9f4...d7b3", region: "Dodoma", submitted: "5 days ago" },
];

const pendingDisputes = [
  { id: "D-001", parcel: "TZ-PARCEL-0003", status: "Open", filer: "0x7a2...f3e1" },
  { id: "D-002", parcel: "TZ-PARCEL-0012", status: "Evidence Submitted", filer: "0x9f4...d7b3" },
  { id: "D-004", parcel: "TZ-PARCEL-0041", status: "Open", filer: "0x1c8...e5a4" },
];

const auditLogs = [
  { action: "Parcel TZ-PARCEL-0098 registered", actor: "0x7a2...f3e1", time: "2 min ago", type: "registry" },
  { action: "Parcel TZ-PARCEL-0085 verified", actor: "0x3b1...a9c2", time: "15 min ago", type: "verification" },
  { action: "Escrow released for TZ-PARCEL-0042", actor: "0x9f4...d7b3", time: "1 hr ago", type: "escrow" },
  { action: "Proposal #18 created", actor: "0x1c8...e5a4", time: "3 hrs ago", type: "governance" },
  { action: "Dispute D-012 filed", actor: "0x4d2...b8f6", time: "5 hrs ago", type: "dispute" },
  { action: "Admin approved batch #7", actor: "0x6e7...c1d9", time: "8 hrs ago", type: "admin" },
];

function logTypeColor(type: string) {
  const map: Record<string, string> = {
    registry: "badge-emerald",
    verification: "badge-blue",
    escrow: "badge-purple",
    governance: "badge-amber",
    dispute: "badge-red",
    admin: "badge-slate",
  };
  return map[type] ?? "badge-slate";
}

export default function AdminPage() {
  const [tab, setTab] = useState<"approvals" | "disputes" | "audit">("approvals");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="badge badge-slate mb-3">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Admin Portal
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Government Operations</h1>
        <p className="mt-1 text-slate-600">Manage approvals, dispute outcomes, and audit trail data for Tanzanian land authorities.</p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Pending Approvals</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{pendingParcels.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Open Disputes</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{pendingDisputes.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Audit Events (24h)</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{auditLogs.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">System Status</p>
          <p className="mt-1"><span className="badge badge-emerald"><span className="dot dot-emerald" /> Operational</span></p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        {([
          { key: "approvals" as const, label: "Land Approvals", count: pendingParcels.length },
          { key: "disputes" as const, label: "Dispute Review", count: pendingDisputes.length },
          { key: "audit" as const, label: "Audit Log", count: auditLogs.length },
        ]).map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${tab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-800"}`}>
            {t.label}
            <span className="ml-1.5 rounded-full bg-slate-200 px-2 py-0.5 text-xs">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tab === "approvals" && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Parcel ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Owner</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Region</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Submitted</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingParcels.map((p) => (
                    <tr key={p.id} className="table-row">
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-800">{p.id}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{p.owner}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{p.region}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{p.submitted}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="mr-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100">Approve</button>
                        <button className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "disputes" && (
          <div className="space-y-3">
            {pendingDisputes.map((d) => (
              <div key={d.id} className="card card-interactive flex items-center justify-between p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-800">{d.id}</span>
                    <span className="badge badge-slate">{d.parcel}</span>
                    <span className={`badge ${d.status === "Open" ? "badge-red" : "badge-amber"}`}>{d.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Filed by <span className="font-mono">{d.filer}</span></p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary text-xs">Review Evidence</button>
                  <button className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100">Resolve</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "audit" && (
          <div className="card">
            <div className="divide-y divide-slate-100">
              {auditLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/50">
                  <span className={`badge ${logTypeColor(log.type)}`}>{log.type}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{log.action}</p>
                    <p className="text-xs text-slate-500"><span className="font-mono">{log.actor}</span> &middot; {log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
