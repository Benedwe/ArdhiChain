"use client";

import { useState } from "react";

const mockResults: Record<string, { id: string; owner: string; region: string; size: string; status: string; tokenId: number; registered: string; txHash: string }> = {
  "TZ-PARCEL-0001": { id: "TZ-PARCEL-0001", owner: "0x7a2...f3e1", region: "Dar es Salaam", size: "3.2 acres", status: "Verified", tokenId: 1, registered: "2024-01-15", txHash: "0xabc1...def1" },
  "TZ-PARCEL-0002": { id: "TZ-PARCEL-0002", owner: "0x3b1...a9c2", region: "Arusha", size: "5.0 acres", status: "Pending", tokenId: 2, registered: "2024-02-20", txHash: "0xabc2...def2" },
  "TZ-PARCEL-0003": { id: "TZ-PARCEL-0003", owner: "0x9f4...d7b3", region: "Dodoma", size: "2.1 acres", status: "Verified", tokenId: 3, registered: "2024-03-10", txHash: "0xabc3...def3" },
};

export default function VerificationPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<typeof mockResults[string] | null>(null);
  const [searched, setSearched] = useState(false);

  function handleSearch() {
    setSearched(true);
    setResult(mockResults[query.trim().toUpperCase()] ?? null);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="badge badge-blue mb-3"><span className="dot dot-emerald" /> Verification Portal</div>
        <h1 className="text-3xl font-bold text-slate-900">Parcel Verification</h1>
        <p className="mt-1 text-slate-600">Search any parcel by ID to verify ownership, registry status, and blockchain credentials.</p>
      </div>

      {/* Search */}
      <div className="card mt-8 p-8">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              className="input pl-12"
              placeholder="Enter parcel ID (e.g. TZ-PARCEL-0001)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button onClick={handleSearch} className="btn-primary shrink-0">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Verify Parcel
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-400">Try: TZ-PARCEL-0001, TZ-PARCEL-0002, or TZ-PARCEL-0003</p>
      </div>

      {/* Results */}
      {searched && (
        <div className="mt-6 animate-fade-in-up">
          {result ? (
            <div className="card overflow-hidden">
              {/* Result header */}
              <div className={`p-6 ${result.status === "Verified" ? "bg-gradient-to-r from-emerald-50 to-teal-50" : "bg-gradient-to-r from-amber-50 to-yellow-50"}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-900">{result.id}</h2>
                      <span className={`badge ${result.status === "Verified" ? "badge-emerald" : "badge-amber"}`}>
                        <span className={`dot ${result.status === "Verified" ? "dot-emerald" : "dot-amber"}`} />
                        {result.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">Token #{result.tokenId} &middot; Registered {result.registered}</p>
                  </div>
                  {result.status === "Verified" && (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/25">
                      <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
                <div className="bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Owner</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-slate-800">{result.owner}</p>
                </div>
                <div className="bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Region</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{result.region}</p>
                </div>
                <div className="bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Area Size</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{result.size}</p>
                </div>
                <div className="bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Transaction Hash</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-slate-800">{result.txHash}</p>
                </div>
              </div>

              {/* Blockchain verification */}
              <div className="border-t border-slate-100 p-5">
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                  <svg className="h-5 w-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">Blockchain Verified</p>
                    <p className="text-xs text-emerald-600">This parcel&apos;s NFT title deed is confirmed on the Avalanche Fuji blockchain.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Parcel Not Found</h3>
              <p className="mt-2 text-sm text-slate-500">No parcel matching &quot;{query}&quot; was found in the registry. Please check the ID and try again.</p>
            </div>
          )}
        </div>
      )}

      {/* QR section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-7">
          <h2 className="text-lg font-semibold text-slate-900">QR Code Verification</h2>
          <p className="mt-2 text-sm text-slate-600">Each registered parcel has a unique QR credential. Scan it in the field to instantly verify ownership and status.</p>
          <div className="mt-6 flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
              <p className="mt-2 text-xs text-slate-400">QR code displayed after parcel search</p>
            </div>
          </div>
        </div>
        <div className="card p-7">
          <h2 className="text-lg font-semibold text-slate-900">Verification Checklist</h2>
          <div className="mt-4 space-y-3">
            {[
              "Parcel ID matches on-chain registry",
              "Owner wallet address confirmed",
              "NFT token exists and is not burned",
              "No active disputes or freeze orders",
              "Document hash matches IPFS record",
              "GPS coordinates within registered boundary",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
                <svg className="h-5 w-5 shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
