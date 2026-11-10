"use client";

import { useState } from "react";

const listings = [
  { id: "TZ-PARCEL-0010", region: "Dar es Salaam", size: "3.2 acres", price: "12,500", priceNum: 12500, status: "Available", owner: "0x7a2...f3e1", verified: true, tokenId: 10 },
  { id: "TZ-PARCEL-0024", region: "Arusha", size: "5.0 acres", price: "9,800", priceNum: 9800, status: "Escrow", owner: "0x3b1...a9c2", verified: true, tokenId: 24 },
  { id: "TZ-PARCEL-0057", region: "Zanzibar", size: "1.7 acres", price: "17,450", priceNum: 17450, status: "Available", owner: "0x9f4...d7b3", verified: true, tokenId: 57 },
  { id: "TZ-PARCEL-0033", region: "Dodoma", size: "8.5 acres", price: "28,000", priceNum: 28000, status: "Available", owner: "0x1c8...e5a4", verified: false, tokenId: 33 },
  { id: "TZ-PARCEL-0061", region: "Mwanza", size: "2.8 acres", price: "7,200", priceNum: 7200, status: "Sold", owner: "0x4d2...b8f6", verified: true, tokenId: 61 },
  { id: "TZ-PARCEL-0078", region: "Mbeya", size: "4.1 acres", price: "14,900", priceNum: 14900, status: "Available", owner: "0x6e7...c1d9", verified: true, tokenId: 78 },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; dot: string }> = {
    Available: { cls: "badge badge-emerald", dot: "dot-emerald" },
    Escrow: { cls: "badge badge-amber", dot: "dot-amber" },
    Sold: { cls: "badge badge-slate", dot: "dot-red" },
  };
  const s = map[status] ?? { cls: "badge badge-slate", dot: "" };
  return <span className={s.cls}><span className={`dot ${s.dot}`} />{status}</span>;
}

export default function MarketplacePage() {
  const [filter, setFilter] = useState<"all" | "Available" | "Escrow" | "Sold">("all");
  const filtered = filter === "all" ? listings : listings.filter((l) => l.status === filter);
  const totalVolume = listings.reduce((s, l) => s + l.priceNum, 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="badge badge-blue mb-3"><span className="dot dot-blue" /> Marketplace</div>
        <h1 className="text-3xl font-bold text-slate-900">Land Parcel Marketplace</h1>
        <p className="mt-1 text-slate-600">Browse available parcels, view escrow status, and purchase land with USDC.</p>
      </div>

      {/* Stats bar */}
      <div className="mt-6 flex flex-wrap items-center gap-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div>
          <p className="text-xs text-slate-500">Listings</p>
          <p className="text-lg font-bold text-slate-900">{listings.length}</p>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <div>
          <p className="text-xs text-slate-500">Available</p>
          <p className="text-lg font-bold text-emerald-600">{listings.filter(l => l.status === "Available").length}</p>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <div>
          <p className="text-xs text-slate-500">Total Value</p>
          <p className="text-lg font-bold text-slate-900">{totalVolume.toLocaleString()} USDC</p>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <div>
          <p className="text-xs text-slate-500">Escrow Active</p>
          <p className="text-lg font-bold text-amber-600">{listings.filter(l => l.status === "Escrow").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex gap-2">
        {(["all", "Available", "Escrow", "Sold"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${filter === f ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50 ring-1 ring-slate-200"}`}>
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((listing) => (
          <div key={listing.id} className="card card-interactive overflow-hidden">
            {/* Parcel visual header */}
            <div className="relative h-40 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PHBhdGggZD0iTTIwIDBMMCAyMGgyMEwyMCAwem0wIDQwTDQwIDIwSDIwbDIwIDIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="font-mono text-xs text-white/80">#{listing.tokenId}</p>
                  <p className="text-lg font-bold text-white">{listing.id}</p>
                </div>
                <StatusBadge status={listing.status} />
              </div>
            </div>
            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {listing.region} &middot; {listing.size}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{listing.price} <span className="text-sm font-medium text-slate-500">USDC</span></p>
                </div>
                {listing.verified && (
                  <span className="badge badge-emerald">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Verified
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono">{listing.owner}</span>
              </div>
              {listing.status === "Available" && (
                <button className="btn-primary mt-4 w-full">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                  Purchase with USDC
                </button>
              )}
              {listing.status === "Escrow" && (
                <button className="btn-secondary mt-4 w-full" disabled>
                  <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  In Escrow
                </button>
              )}
              {listing.status === "Sold" && (
                <div className="mt-4 w-full rounded-xl bg-slate-50 py-2.5 text-center text-sm font-medium text-slate-400">Sold</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
