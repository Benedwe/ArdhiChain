"use client";

import { useState } from "react";

const parcels = [
  { id: "TZ-PARCEL-0001", owner: "0x7a2...f3e1", region: "Dar es Salaam", size: "3.2 acres", status: "Verified", tokenId: 1 },
  { id: "TZ-PARCEL-0002", owner: "0x3b1...a9c2", region: "Arusha", size: "5.0 acres", status: "Pending", tokenId: 2 },
  { id: "TZ-PARCEL-0003", owner: "0x9f4...d7b3", region: "Dodoma", size: "2.1 acres", status: "Verified", tokenId: 3 },
  { id: "TZ-PARCEL-0004", owner: "0x1c8...e5a4", region: "Mwanza", size: "8.5 acres", status: "Pending", tokenId: 4 },
  { id: "TZ-PARCEL-0005", owner: "0x4d2...b8f6", region: "Zanzibar", size: "1.7 acres", status: "Verified", tokenId: 5 },
  { id: "TZ-PARCEL-0006", owner: "0x6e7...c1d9", region: "Mbeya", size: "4.3 acres", status: "Frozen", tokenId: 6 },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Verified: "badge badge-emerald",
    Pending: "badge badge-amber",
    Frozen: "badge badge-red",
  };
  return (
    <span className={map[status] ?? "badge badge-slate"}>
      <span className={`dot ${status === "Verified" ? "dot-emerald" : status === "Pending" ? "dot-amber" : "dot-red"}`} />
      {status}
    </span>
  );
}

export default function LandRegistryPage() {
  const [activeTab, setActiveTab] = useState<"register" | "parcels">("parcels");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="badge badge-emerald mb-3"><span className="dot dot-emerald" /> Land Registry</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Land Parcel Registry</h1>
            <p className="mt-1 text-slate-600">Register new parcels, mint NFT title deeds, and browse the on-chain registry.</p>
          </div>
          <button onClick={() => setActiveTab("register")} className="btn-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Register Parcel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        <button onClick={() => setActiveTab("parcels")} className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${activeTab === "parcels" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-800"}`}>
          All Parcels ({parcels.length})
        </button>
        <button onClick={() => setActiveTab("register")} className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${activeTab === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-800"}`}>
          Register New
        </button>
      </div>

      {activeTab === "parcels" ? (
        <div className="card mt-6 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Parcel ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Owner</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Region</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Size</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Token ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((p) => (
                  <tr key={p.id} className="table-row">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-slate-800">{p.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-600">{p.owner}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{p.region}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{p.size}</td>
                    <td className="px-6 py-4">
                      <span className="badge badge-blue">#{p.tokenId}</span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button className="btn-ghost text-xs">View</button>
                      <button className="btn-ghost text-xs">Transfer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <div className="card p-7">
            <h2 className="text-lg font-semibold text-slate-900">Register New Parcel</h2>
            <p className="mt-1 text-sm text-slate-500">Fill in the details to register a new land parcel on-chain.</p>
            <form className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Parcel Number</label>
                  <input className="input" placeholder="TZ-PARCEL-0007" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Owner Wallet</label>
                  <input className="input" placeholder="0x..." />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Region</label>
                  <input className="input" placeholder="Dar es Salaam" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">District</label>
                  <input className="input" placeholder="Kinondoni" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Ward</label>
                  <input className="input" placeholder="Msasani" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Area Size</label>
                  <input className="input" placeholder="2.5 acres" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">GPS Coordinates</label>
                  <input className="input" placeholder="-6.77, 39.28" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Document Hash / IPFS URI</label>
                <input className="input" placeholder="Qm... or ipfs://..." />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Token URI (metadata)</label>
                <input className="input" placeholder="ipfs://demo/parcel-metadata" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="btn-primary">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  Register & Mint NFT
                </button>
                <button type="button" className="btn-secondary" onClick={() => setActiveTab("parcels")}>Cancel</button>
              </div>
            </form>
          </div>

          {/* Info panel */}
          <div className="space-y-6">
            <div className="card p-7">
              <h2 className="text-lg font-semibold text-slate-900">Registration Process</h2>
              <div className="mt-4 space-y-4">
                {[
                  { step: "1", title: "Submit Details", desc: "Fill in the parcel form with location, size, and ownership data." },
                  { step: "2", title: "Upload Documents", desc: "Attach deed documents which get hashed and stored on IPFS." },
                  { step: "3", title: "Mint NFT", desc: "A unique ERC-721 token is minted representing the title deed." },
                  { step: "4", title: "Verification", desc: "Government officers review and verify the parcel for approval." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{s.step}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                      <p className="text-sm text-slate-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-sm font-semibold text-emerald-800">Smart Contract Info</h3>
              <div className="mt-3 space-y-2 text-xs text-emerald-700">
                <p>Contract: <span className="font-mono">LandRegistry.sol</span></p>
                <p>Standard: <span className="font-mono">ERC-721 (ERC721URIStorage)</span></p>
                <p>Network: <span className="font-mono">Avalanche Fuji (43113)</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
