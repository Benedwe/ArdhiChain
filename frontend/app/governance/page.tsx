"use client";

import { useState } from "react";

const proposals = [
  { id: 1, title: "Approve Transfer of Parcel TZ-PARCEL-0042", description: "Community vote to authorize the transfer of parcel TZ-PARCEL-0042 from current owner to buyer through escrow.", status: "Open", yesVotes: 34, noVotes: 12, quorum: 60, author: "0x7a2...f3e1", created: "2 days ago" },
  { id: 2, title: "Authorize Escrow Payout for Batch #7", description: "Release funds from escrow for 8 completed transactions in batch 7, totaling 94,500 USDC with tax deductions.", status: "Executed", yesVotes: 48, noVotes: 3, quorum: 60, author: "0x3b1...a9c2", created: "5 days ago" },
  { id: 3, title: "Adopt New Tax Policy: 3% Transaction Levy", description: "Proposal to increase the transaction tax from 2% to 3% to fund digital infrastructure improvements.", status: "Open", yesVotes: 22, noVotes: 28, quorum: 60, author: "0x9f4...d7b3", created: "1 day ago" },
  { id: 4, title: "Freeze Parcel TZ-PARCEL-0006 Pending Investigation", description: "Government request to freeze all transfers on parcel 0006 while a boundary dispute investigation is conducted.", status: "Executed", yesVotes: 41, noVotes: 5, quorum: 60, author: "0x1c8...e5a4", created: "1 week ago" },
  { id: 5, title: "Community Fund: 10,000 USDC for Land Surveys", description: "Allocate 10,000 USDC from the treasury to fund rural land surveys in the Dodoma region.", status: "Open", yesVotes: 15, noVotes: 8, quorum: 60, author: "0x4d2...b8f6", created: "6 hours ago" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Open: "badge badge-emerald",
    Executed: "badge badge-blue",
    Failed: "badge badge-red",
  };
  return <span className={map[status] ?? "badge badge-slate"}>{status}</span>;
}

export default function GovernancePage() {
  const [filter, setFilter] = useState<"all" | "Open" | "Executed">("all");

  const filtered = filter === "all" ? proposals : proposals.filter((p) => p.status === filter);
  const openCount = proposals.filter((p) => p.status === "Open").length;
  const executedCount = proposals.filter((p) => p.status === "Executed").length;
  const totalVotes = proposals.reduce((sum, p) => sum + p.yesVotes + p.noVotes, 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="animate-fade-in-up flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="badge badge-purple mb-3"><span className="dot dot-blue" /> Governance DAO</div>
          <h1 className="text-3xl font-bold text-slate-900">Proposal & Voting Hub</h1>
          <p className="mt-1 text-slate-600">Community-driven governance for land transfers, policy changes, and treasury management.</p>
        </div>
        <button className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Create Proposal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Open Proposals</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{openCount}</p>
          <p className="mt-1 text-xs text-emerald-600">Active for voting</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Executed</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{executedCount}</p>
          <p className="mt-1 text-xs text-blue-600">Successfully passed</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Total Votes Cast</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalVotes}</p>
          <p className="mt-1 text-xs text-violet-600">Across all proposals</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex gap-2">
        {(["all", "Open", "Executed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${filter === f ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50 ring-1 ring-slate-200"}`}>
            {f === "all" ? "All Proposals" : f}
          </button>
        ))}
      </div>

      {/* Proposals */}
      <div className="mt-6 space-y-4">
        {filtered.map((p) => {
          const total = p.yesVotes + p.noVotes;
          const yesPercent = total > 0 ? Math.round((p.yesVotes / total) * 100) : 0;
          const noPercent = total > 0 ? 100 - yesPercent : 0;
          const passedQuorum = total >= p.quorum;

          return (
            <div key={p.id} className="card card-interactive p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">#{p.id}</span>
                    <StatusBadge status={p.status} />
                    <span className="text-xs text-slate-400">by {p.author}</span>
                    <span className="text-xs text-slate-400">&middot; {p.created}</span>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">{p.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{p.description}</p>
                </div>
              </div>

              {/* Vote progress */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-emerald-700">For: {p.yesVotes} ({yesPercent}%)</span>
                  <span className="text-red-600">Against: {p.noVotes} ({noPercent}%)</span>
                </div>
                <div className="mt-2 progress-bar">
                  <div className="flex h-full">
                    <div className="progress-fill bg-emerald-500" style={{ width: `${yesPercent}%` }} />
                    <div className="progress-fill bg-red-400" style={{ width: `${noPercent}%` }} />
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{total} votes cast</span>
                  <span className={passedQuorum ? "text-emerald-600 font-medium" : "text-amber-600"}>
                    Quorum: {total}/{p.quorum} {passedQuorum ? "(met)" : "(not met)"}
                  </span>
                </div>
              </div>

              {/* Vote buttons */}
              {p.status === "Open" && (
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-xl bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition-all hover:bg-emerald-100">
                    Vote For
                  </button>
                  <button className="flex-1 rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-red-200 transition-all hover:bg-red-100">
                    Vote Against
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
